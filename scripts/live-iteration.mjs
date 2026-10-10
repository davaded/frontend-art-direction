#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";
import { resolveDesignOperation } from "./design-operation.mjs";
import { classifySurfaceMode } from "./surface-mode.mjs";

const LIVE_DIR = ".art-direction/live";

function sessionPath(projectRoot, session) {
  const root = resolve(projectRoot ?? process.cwd());
  if (!session) throw new Error("--session is required");
  const path = resolve(root, session.endsWith(".json") ? session : join(LIVE_DIR, `${session}.json`));
  if (!path.startsWith(`${root}/`) && path !== root) throw new Error("session must stay inside the project root");
  return path;
}

function readSession(path) {
  if (!existsSync(path)) throw new Error(`Live session not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeSession(path, session) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(session, null, 2)}\n`);
  return session;
}

export function buildLiveIterationContract({ query = "", url = "", target = "", surfaceMode = null, operation = null } = {}) {
  const mode = surfaceMode ?? classifySurfaceMode(query);
  const action = operation ?? resolveDesignOperation(query, { mode: mode.mode === "adaptive" ? "" : mode.mode });
  return {
    protocol: "frontend-art-direction/live-v1",
    status: "ready",
    prerequisites: [
      "target project dev server with HMR or a static route the browser adapter can inspect",
      "browser adapter that can capture the selected target and report generated variants",
      "source patch or accepted-variant handoff before claiming implementation proof",
    ],
    restrictions: [
      "development targets only; never inject into production or weaken CSP",
      "generated variants are proposals until accepted and written to source",
      "actual browser capture remains the acceptance evidence",
    ],
    target: { url: url || null, selector: target || null },
    surfaceMode: mode,
    operation: action,
    sequence: [
      "boot session and capture baseline",
      "select route, region, or element",
      "generate 2-3 bounded variants inside the selected operation",
      "capture and compare variants at the same viewport/state",
      "accept or discard one variant",
      "write the accepted source delta",
      "recapture desktop/mobile and record final proof",
    ],
    evidence: ["baseline", "variant", "decision", "source-diff", "after-capture"],
  };
}

export function createLiveSession({ projectRoot, query = "", url = "", target = "", mode = "", action = "", viewport = "", count = 3 } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const surfaceMode = classifySurfaceMode(query, { explicit: mode });
  const operation = resolveDesignOperation(query, { mode: surfaceMode.mode === "adaptive" ? "" : surfaceMode.mode });
  if (action) operation.operation = action;
  const id = `live-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const path = sessionPath(root, id);
  const session = {
    version: 1,
    id,
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectRoot: root,
    target: { url: url || null, selector: target || null, viewport: viewport || null },
    query,
    surfaceMode,
    operation,
    requestedVariantCount: Math.max(2, Math.min(Number(count) || 3, 3)),
    variants: [],
    evidence: [],
    decision: null,
    contract: buildLiveIterationContract({ query, url, target, surfaceMode, operation }),
  };
  return { path, session: writeSession(path, session) };
}

function updateSession(path, update) {
  const session = readSession(path);
  const updated = { ...session, ...update, updatedAt: new Date().toISOString() };
  return writeSession(path, updated);
}

export function recordLiveEvent({ projectRoot, session, kind, path: evidencePath = "", notes = "", variant = "", sourceDiff = "" } = {}) {
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  const event = {
    kind,
    path: evidencePath || null,
    notes: notes || null,
    variant: variant || null,
    sourceDiff: sourceDiff || null,
    recordedAt: new Date().toISOString(),
  };
  const next = { ...current, evidence: [...current.evidence, event], updatedAt: new Date().toISOString() };
  return writeSession(file, next);
}

export function addLiveVariant({ projectRoot, session, id, path: variantPath = "", summary = "", sourceDiff = "" } = {}) {
  if (!id) throw new Error("--id is required for add-variant");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  if (current.variants.some((variant) => variant.id === id)) throw new Error(`Variant already exists: ${id}`);
  const variant = { id, path: variantPath || null, summary: summary || null, sourceDiff: sourceDiff || null, status: "pending" };
  return writeSession(file, { ...current, status: "variants-ready", variants: [...current.variants, variant], updatedAt: new Date().toISOString() });
}

export function decideLiveVariant({ projectRoot, session, variant, decision, sourceDiff = "", path: afterPath = "" } = {}) {
  if (!["accept", "discard"].includes(decision)) throw new Error("decision must be accept or discard");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  if (!current.variants.some((item) => item.id === variant)) throw new Error(`Unknown variant: ${variant}`);
  const variants = current.variants.map((item) => ({ ...item, status: item.id === variant ? decision === "accept" ? "accepted" : "discarded" : item.status }));
  return writeSession(file, {
    ...current,
    status: decision === "accept" ? "accepted-awaiting-proof" : "discarded",
    variants,
    decision: { variant, action: decision, sourceDiff: sourceDiff || null, afterCapture: afterPath || null, decidedAt: new Date().toISOString() },
    updatedAt: new Date().toISOString(),
  });
}

function renderLiveSession(session, path = "") {
  return `# Live Iteration Session

- Session: **${session.id}**
- Status: **${session.status}**
- Target: ${session.target.url ?? "not set"}${session.target.selector ? " · " + "`" + session.target.selector + "`" : ""}
- Surface mode: **${session.surfaceMode.mode}** (${session.surfaceMode.confidence})
- Operation: **${session.operation.operation}** (${session.operation.confidence})
- Variants: ${session.variants.length}/${session.requestedVariantCount}
- Evidence events: ${session.evidence.length}
- Session file: ${"`" + (path || session.id) + "`"}

The browser adapter must capture the baseline, generate bounded variants, persist the accepted source delta, and record an after-capture before this session is visual proof.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const subcommand = args.positionals[0] ?? "start";
  if (args.options.help || args.options.h) {
    console.log(`live-iteration.mjs <start|status|record|add-variant|accept|discard> [options]\n\n  --project <path> --query <text> --url <url> --target <selector>\n  --session <id-or-path> --kind <baseline|variant|after> --path <capture>\n  --id <variant-id> --summary <text> --source-diff <path>\n  --format md|json`);
    return;
  }
  const projectRoot = option(args, "project", process.cwd());
  let result;
  if (subcommand === "start") {
    result = createLiveSession({ projectRoot, query: option(args, "query", ""), url: option(args, "url", ""), target: option(args, "target", ""), mode: option(args, "mode", ""), action: option(args, "action", ""), viewport: option(args, "viewport", ""), count: option(args, "count", 3) });
    result = { ...result.session, sessionPath: result.path };
  } else if (subcommand === "status") {
    const path = sessionPath(projectRoot, option(args, "session", ""));
    result = { ...readSession(path), sessionPath: path };
  } else if (subcommand === "record") {
    result = recordLiveEvent({ projectRoot, session: option(args, "session", ""), kind: option(args, "kind", ""), path: option(args, "path", ""), notes: option(args, "notes", ""), variant: option(args, "variant", ""), sourceDiff: option(args, "source-diff", "") });
  } else if (subcommand === "add-variant") {
    result = addLiveVariant({ projectRoot, session: option(args, "session", ""), id: option(args, "id", ""), path: option(args, "path", ""), summary: option(args, "summary", ""), sourceDiff: option(args, "source-diff", "") });
  } else if (subcommand === "accept" || subcommand === "discard") {
    result = decideLiveVariant({ projectRoot, session: option(args, "session", ""), variant: option(args, "variant", option(args, "id", "")), decision: subcommand, sourceDiff: option(args, "source-diff", ""), path: option(args, "path", "") });
  } else {
    throw new Error(`Unknown live subcommand: ${subcommand}`);
  }
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderLiveSession(result, result.sessionPath), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
