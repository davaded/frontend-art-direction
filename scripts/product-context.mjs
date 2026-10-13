#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { chooseRecord, isMainModule, isUnderspecifiedRequest, loadDataset, option, parseArgs, writeOutput } from "./lib.mjs";
import { classifySurfaceMode } from "./surface-mode.mjs";

export const PRODUCT_CONTEXT_FIELDS = [
  ["product-audience", "Product / audience"],
  ["primary-workflow", "Primary workflow"],
  ["input-model", "Input model"],
  ["viewing-distance", "Viewing distance"],
  ["primary-object", "Primary object"],
  ["primary-job", "Primary job"],
  ["visible-result", "Visible result"],
  ["content-readiness", "Content readiness"],
  ["environment", "Operating environment"],
  ["language", "Language / locale"],
  ["constraints", "Hard constraints"],
  ["non-goals", "Non-goals / avoid"],
];

const FIELD_BY_KEY = new Map(PRODUCT_CONTEXT_FIELDS.flatMap(([id, label]) => [
  [id, id],
  [label.toLocaleLowerCase(), id],
  [label.replaceAll(" / ", " ").toLocaleLowerCase(), id],
]));

function normalizeKey(value) {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
    .replace(/[：]/gu, ":")
    .replace(/\s+/gu, " ");
}

function fieldId(value) {
  const key = normalizeKey(value).replace(/\s*:\s*$/u, "");
  if (FIELD_BY_KEY.has(key)) return FIELD_BY_KEY.get(key);
  return PRODUCT_CONTEXT_FIELDS.find(([id, label]) => key === id || key === label.toLocaleLowerCase())?.[0] ?? null;
}

function parseFields(content) {
  const fields = {};
  for (const match of content.matchAll(/^[\t ]*[-*][\t ]*([^:\n：]{2,100})[\t ]*[:：][\t ]*([^\n]*)$/gmu)) {
    const id = fieldId(match[1]);
    if (id && !fields[id] && match[2].trim()) fields[id] = match[2].trim();
  }
  return fields;
}

export function productContextPath(projectRoot) {
  const root = resolve(projectRoot ?? process.cwd());
  return resolve(root, "PRODUCT.md");
}

export function parseProductContext(content, path = "PRODUCT.md") {
  const text = String(content ?? "").trim();
  const fields = parseFields(text);
  const missing = [
    !fields["product-audience"] && "product-audience",
    !fields["primary-job"] && !fields["primary-workflow"] && "primary-job",
  ].filter(Boolean);
  return {
    protocol: "frontend-art-direction/product-context-v1",
    path,
    status: !text ? "empty" : missing.length === 0 ? "observed" : "partial",
    fields,
    missing,
    text,
    fieldLabels: Object.fromEntries(PRODUCT_CONTEXT_FIELDS),
  };
}

export function readProductContext(projectRoot) {
  const path = productContextPath(projectRoot);
  if (!existsSync(path)) return null;
  try {
    return parseProductContext(readFileSync(path, "utf8"), basename(path));
  } catch {
    return { protocol: "frontend-art-direction/product-context-v1", path: basename(path), status: "unreadable", fields: {}, missing: ["product-audience", "primary-job"], text: "" };
  }
}

const ROUTING_FIELDS = ["product-audience", "primary-workflow", "primary-object", "primary-job", "visible-result"];
const PROFILE_CONTEXT_FIELDS = ["product-audience", "primary-workflow", "primary-job"];
const GENERIC_PROFILE_WORDS = new Set(["design", "creative", "mobile", "touch", "general", "neutral", "evidence", "website", "site", "page", "ui", "ux", "landing", "brand", "marketing", "campaign", "官网", "品牌", "发布", "宣传", "设计", "创作", "通用", "适配", "中性"]);
const OPERATING_PROFILES = new Set(["productive-app", "creative-editor", "command-tool", "data-workbench", "commerce-flow", "media-experience", "component-workbench"]);
const CREATION_REQUEST = /\b(?:build|create|develop|design|make)\s+(?:(?:me|us)\s+)?(?:a|an|new|another)\b|(?:做|创建|制作|开发|设计|生成)(?:一个|一款|一套|一页|个|新的|另一个)/iu;

export function positiveRoutingText(text = "") {
  // Keep common negative clauses out of keyword routing, while preserving the raw request elsewhere.
  return String(text).replace(/(?:\b(?:not|no|without)\s+(?!only\b|just\b)|不是|不要|无需|不做|不需要)(?:(?!\bbut\b|\binstead\b|而是|但是|但)[^,;.!?\n，；。！？])*/giu, " ").trim();
}

function chooseProductProfile(profiles, text, preferredId) {
  if (profiles.some((record) => record.id === preferredId)) {
    return chooseRecord(profiles, [], preferredId, "adaptive-surface", ["keywords"]);
  }
  const normalize = (value) => String(value).toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  const query = normalize(text);
  const ranked = profiles.map((record) => {
    // Profile evidence needs the whole keyword; shared CJK fragments can name unrelated subjects.
    const hits = [...new Set(record.keywords.map(normalize))].filter((keyword) => {
      if (!keyword || GENERIC_PROFILE_WORDS.has(keyword)) return false;
      return /\p{Script=Han}/u.test(keyword)
        ? query.includes(keyword)
        : new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}\\b`, "u").test(query);
    });
    return { record, score: hits.length, hits };
  }).sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id));
  const best = ranked[0]?.score > 0
    ? ranked[0]
    : { record: profiles.find((record) => record.id === "adaptive-surface") ?? profiles[0], score: 0, hits: [] };
  return {
    ...best,
    confidence: best.score >= 4 ? "high" : best.score >= 2 ? "medium" : "low",
    candidates: ranked.slice(0, 3).map(({ record, score, hits }) => ({ id: record.id, score, hits })),
  };
}

export function resolveProductRequest(query = "", context = null, { profile = "", surfaceMode = "" } = {}) {
  const profiles = loadDataset("profiles.json").profiles;
  const affirmative = positiveRoutingText(query);
  const underspecified = isUnderspecifiedRequest(affirmative);
  const routingQuery = underspecified ? "" : affirmative;
  const current = chooseProductProfile(profiles, routingQuery, profile);
  const usedFields = ROUTING_FIELDS.filter((id) => context?.fields?.[id]);
  const background = usedFields.map((id) => positiveRoutingText(context.fields[id])).join("\n").trim();
  // Objects/results provide signal content, not a page genre from words such as image or table.
  const profileBackground = PROFILE_CONTEXT_FIELDS.map((id) => positiveRoutingText(context?.fields?.[id])).join("\n");
  const inherited = chooseProductProfile(profiles, profileBackground);
  const currentMode = classifySurfaceMode(routingQuery, { explicit: surfaceMode });
  // Background fills an unresolved request; it never replaces a specified page job.
  const concreteCreation = !underspecified && CREATION_REQUEST.test(affirmative);
  const useBackground = !profile && !concreteCreation && current.score === 0 && currentMode.mode === "adaptive" && Boolean(background);
  const subjectSelection = useBackground ? inherited : current;
  const visitorMode = useBackground ? classifySurfaceMode(background) : currentMode;
  // The topic may be a tool; the requested surface can still be its public website.
  const selection = !profile && visitorMode.mode === "persuade" && OPERATING_PROFILES.has(subjectSelection.record.id)
    ? { ...subjectSelection, record: profiles.find((item) => item.id === "editorial-marketing") }
    : subjectSelection;
  if (useBackground && visitorMode.mode !== "adaptive") visitorMode.evidence.source = context.path;
  return {
    profile: selection,
    subjectProfile: subjectSelection.record.id,
    source: profile ? "explicit" : current.score > 0 || currentMode.mode !== "adaptive" || concreteCreation ? "current-request" : useBackground ? context.path : "open",
    routingQuery,
    selectionQuery: useBackground ? `${routingQuery}\n${background}`.trim() : routingQuery,
    surfaceMode: visitorMode,
    usedFields: useBackground ? usedFields : [],
    signalFields: useBackground ? Object.fromEntries(usedFields.map((id) => [id, context.fields[id]])) : {},
    constraints: context?.fields?.constraints ?? "",
    nonGoals: context?.fields?.["non-goals"] ?? "",
  };
}

function value(options, id) {
  return String(options[id] ?? "").trim();
}

export function renderProductContextMarkdown(context) {
  const lines = PRODUCT_CONTEXT_FIELDS.map(([id, label]) => `- ${label}: ${context?.fields?.[id] ?? ""}`);
  return `# PRODUCT.md\n\nRecord known product facts. Leave unknown or irrelevant fields empty. Choose visitor mode per surface; keep visual language in DESIGN.md.\n\n${lines.join("\n")}\n\nCurrent user requirements take precedence. Update these facts when the product changes.\n`;
}

export function initProductContext({ projectRoot, force = false, values = {} } = {}) {
  const path = productContextPath(projectRoot);
  if (existsSync(path) && !force) throw new Error(`Product context already exists: ${path}; edit it directly or pass --force to replace it`);
  const content = renderProductContextMarkdown({ fields: Object.fromEntries(PRODUCT_CONTEXT_FIELDS.map(([id]) => [id, value(values, id)])) });
  writeFileSync(path, content, { flag: force ? "w" : "wx" });
  return { ...parseProductContext(content, basename(path)), path };
}

export function renderProductContextStatus(context) {
  const facts = Object.entries(context.fields).map(([id, text]) => `- ${context.fieldLabels?.[id] ?? id}: ${text}`);
  return `## Product Context\n\n- File: ${context.path}\n- Status: ${context.status}\n- Open core facts: ${context.missing.join(", ") || "none"}\n\n${facts.join("\n") || "No structured facts recorded; inspect the project and original request before choosing a genre."}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args.positionals[0] ?? "status";
  if (args.options.help || args.options.h) {
    console.log(`product-context.mjs <init|status|template> [options]\n\n  init writes PRODUCT.md in --project; existing files need --force.\n  status is read-only; template prints a blank document.\n  --project <path> --force\n  --product-audience <text> --primary-workflow <text>\n  --input-model <text> --viewing-distance <text> --primary-object <text>\n  --primary-job <text> --visible-result <text> --content-readiness <text>\n  --environment <text> --language <text> --constraints <text> --non-goals <text>\n  --format md|json --output <report-path>`);
    return;
  }
  if (!["init", "status", "template"].includes(command)) throw new Error(`Unknown product-context command: ${command}`);
  const projectRoot = option(args, "project", process.cwd());
  const format = option(args, "format", "md");
  const output = option(args, "output");
  const supported = new Set(["help", "h", "project", "force", "format", "output", ...PRODUCT_CONTEXT_FIELDS.map(([id]) => id)]);
  for (const name of Object.keys(args.options)) {
    if (!supported.has(name)) throw new Error(`Unknown product-context option: --${name}`);
  }
  if (!["md", "json"].includes(format)) throw new Error("--format accepts md or json");
  if (output && resolve(output) === productContextPath(projectRoot)) throw new Error("Report output must not replace PRODUCT.md; edit the product document directly");
  let result;
  if (command === "init") {
    const values = Object.fromEntries(PRODUCT_CONTEXT_FIELDS.map(([id]) => [id, option(args, id, "")]));
    const force = option(args, "force", false);
    if (![true, false, "true", "false"].includes(force)) throw new Error("--force accepts true or false");
    result = initProductContext({ projectRoot, force: force === true || force === "true", values });
  } else if (command === "template") {
    result = parseProductContext(renderProductContextMarkdown({ fields: {} }));
  } else {
    result = readProductContext(projectRoot) ?? { ...parseProductContext(""), status: "missing" };
  }
  writeOutput(format === "json" ? result : command === "template" ? renderProductContextMarkdown(result) : renderProductContextStatus(result), { format, output });
}

if (isMainModule(import.meta.url)) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
