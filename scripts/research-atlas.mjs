#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { isMainModule, isUnderspecifiedRequest, option, parseArgs, relativePath, writeOutput } from "./lib.mjs";

const ATLAS_DIR = ".art-direction/research-atlas";
const REFERENCE_STATUSES = new Set(["candidate", "inspected", "selected", "rejected", "unavailable"]);
const SECTION_STATUSES = new Set(["pending", "complete", "skipped"]);
const SKILL_STATUSES = new Set(["selected", "unavailable"]);

export const ATLAS_SECTIONS = [
  ["navigation", "Navigation and entry", "Does the entry structure establish the product and invite the right first action?"],
  ["first-viewport", "First viewport", "What leads the eye, what is dominant, and what peeks into the next chapter?"],
  ["object-or-content", "Object or content", "How is the actual subject, artifact, data, or workflow made visible?"],
  ["composition-and-rhythm", "Composition and rhythm", "Which alignment, scale, spacing, crop, and counterweight relationships create the silhouette?"],
  ["responsive", "Responsive re-staging", "What changes on narrow screens, touch input, and long content?"],
  ["states-and-interaction", "States and interaction", "How do controls, feedback, empty/error/success states, and recovery read?"],
  ["motion", "Motion language", "Which changes need motion, and what are the cleanup, reduced-motion, and static final states?"],
  ["assets-and-material", "Assets and material", "Which image, video, texture, type, color, and surface choices carry the subject?"],
  ["ending", "Ending and continuation", "How does the surface resolve, hand off, or make the next action legible?"],
].map(([id, label, prompt]) => ({ id, label, prompt }));

const HELP = `research-atlas.mjs [start|status|add|section|synthesize|skill|close] [options]

Persist reference research as inspectable evidence, section winners, and an original synthesis.

Commands:
  start                 Create an atlas under .art-direction/research-atlas/
  status                Read an atlas
  add                   Add or update a user, discovered, local, or candidate reference
  section               Record a section winner or an explicit skip
  synthesize            Record the direction assembled from the research
  skill                 Record a selected or unavailable local skill
  close                 Validate and close the atlas

Common options:
  --project <path>      Target project root
  --session <id>        Atlas id or JSON path
  --query <text>        Product, page, or design question
  --format md|json      Output format (default: md)
  --output <path>       Write output instead of stdout

Reference options:
  --id <id> --label <text> --url <url> --kind user|discovered|local|candidate
  --status candidate|inspected|selected|rejected|unavailable
  --role <text> --evidence <paths> --strengths <items> --weaknesses <items>
  --borrow <items> --reject <items> --observations <items>

Section options:
  --section <id> --winner <reference-id> --decision <text> --evidence <paths>
  --status complete|skipped --reason <text>

Synthesis options:
  --direction <text> --visual-language <text> --composition <text>
  --type <text> --material <text> --motion <text> --assets <text>
  --template-risk <text> --gaps <items> --rejected-defaults <items>

Skill options:
  --id <skill-id> --status selected|unavailable --reason <text>
`;

function list(value) {
  return String(value ?? "")
    .split(/[\n,]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function slug(value) {
  const normalized = String(value ?? "")
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 48);
  return normalized || "reference";
}

function atlasPath(projectRoot, session) {
  const root = resolve(projectRoot ?? process.cwd());
  if (!session) throw new Error("--session is required");
  const path = resolve(root, session.endsWith(".json") ? session : join(ATLAS_DIR, `${session}.json`));
  if (!path.startsWith(`${root}/`) && path !== root) throw new Error("atlas must stay inside the project root");
  return path;
}

function readAtlas(path) {
  if (!existsSync(path)) throw new Error(`Research atlas not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeAtlas(path, atlas) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(atlas, null, 2)}\n`);
  return atlas;
}

function normalizeEvidence(projectRoot, values) {
  return list(values).map((ref) => {
    const isUrl = /^(?:https?:|data:)/u.test(ref);
    if (isUrl) return { ref, kind: "external", exists: null };
    if (/^(?:decision|note|observation):/iu.test(ref)) return { ref, kind: "recorded-note", exists: null };
    const absolute = resolve(projectRoot, ref);
    const inside = absolute === projectRoot || absolute.startsWith(`${projectRoot}/`);
    return {
      ref: inside ? relativePath(projectRoot, absolute) : ref,
      kind: /\.(?:png|jpe?g|webp|avif|gif|mp4|mov|pdf)$/iu.test(ref) ? "capture-or-media" : "artifact-or-check",
      exists: inside ? existsSync(absolute) : false,
    };
  });
}

function hasLocalEvidence(items = []) {
  return items.some((item) => item.exists === true);
}

function timestamp() {
  return new Date().toISOString();
}

function updateAtlas(path, updater) {
  const current = readAtlas(path);
  const next = updater(current);
  return writeAtlas(path, { ...next, updatedAt: timestamp() });
}

export function createResearchAtlas({ projectRoot, query = "", mode = "" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const id = `atlas-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const path = atlasPath(root, id);
  const adaptive = mode || (isUnderspecifiedRequest(query) ? "adaptive-no-reference" : "reference-led");
  const atlas = {
    protocol: "frontend-art-direction/research-atlas-v1",
    version: 1,
    id,
    status: "in-progress",
    mode: adaptive,
    createdAt: timestamp(),
    updatedAt: timestamp(),
    projectRoot: root,
    query,
    policy: {
      userReferencesFirst: true,
      sectionWinnersMayComeFromDifferentSources: true,
      referenceIsEvidenceOnlyAfterInspection: true,
      noReferenceFallback: "Use subject, local evidence, and authored direction; do not invent a skin from the catalog.",
    },
    references: [],
    sections: ATLAS_SECTIONS.map((section) => ({
      ...section,
      status: "pending",
      winner: null,
      decision: null,
      evidence: [],
      recordedAt: null,
    })),
    synthesis: {
      status: "pending",
      direction: null,
      visualLanguage: null,
      composition: null,
      type: null,
      material: null,
      motion: null,
      assets: null,
      templateRisk: null,
      gaps: [],
      rejectedDefaults: [],
    },
    skills: { selected: [], unavailable: [] },
    history: [],
  };
  return { path, atlas: writeAtlas(path, atlas) };
}

export function getResearchAtlas({ projectRoot, session } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = atlasPath(root, session);
  return { ...readAtlas(path), atlasPath: path };
}

export function addResearchAtlasReference({
  projectRoot,
  session,
  id = "",
  label = "",
  url = "",
  kind = "discovered",
  status = "candidate",
  role = "",
  evidence = "",
  strengths = "",
  weaknesses = "",
  borrow = "",
  reject = "",
  observations = "",
} = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = atlasPath(root, session);
  if (!String(label).trim()) throw new Error("--label is required");
  if (!REFERENCE_STATUSES.has(status)) throw new Error(`--status must be ${[...REFERENCE_STATUSES].join(", ")}`);
  const referenceId = slug(id || label);
  const evidenceItems = normalizeEvidence(root, evidence);
  if (["inspected", "selected"].includes(status) && !hasLocalEvidence(evidenceItems)) {
    throw new Error("inspected or selected references require at least one existing local capture or research artifact in --evidence");
  }
  return updateAtlas(path, (current) => {
    const reference = {
      id: referenceId,
      label: String(label).trim(),
      url: String(url).trim() || null,
      kind,
      status,
      role: String(role).trim() || null,
      evidence: evidenceItems,
      strengths: list(strengths),
      weaknesses: list(weaknesses),
      borrow: list(borrow),
      reject: list(reject),
      observations: list(observations),
      updatedAt: timestamp(),
    };
    const references = current.references.some((item) => item.id === referenceId)
      ? current.references.map((item) => item.id === referenceId ? { ...item, ...reference } : item)
      : [...current.references, reference];
    return {
      ...current,
      references,
      history: [...current.history, { type: "reference", id: referenceId, status, at: timestamp() }],
    };
  });
}

export function recordResearchAtlasSection({ projectRoot, session, section, winner = "", status = "complete", decision = "", evidence = "", reason = "" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = atlasPath(root, session);
  if (!ATLAS_SECTIONS.some((item) => item.id === section)) throw new Error(`unknown atlas section: ${section}`);
  if (!SECTION_STATUSES.has(status) || status === "pending") throw new Error("section status must be complete or skipped");
  const evidenceItems = normalizeEvidence(root, evidence);
  if (status === "skipped" && !String(reason).trim()) throw new Error("a skipped section requires --reason");
  if (status === "complete" && (!String(winner).trim() || !String(decision).trim())) throw new Error("a completed section requires --winner and --decision");
  return updateAtlas(path, (current) => {
    const reference = winner ? current.references.find((item) => item.id === winner) : null;
    if (winner && !reference) throw new Error(`section winner does not exist in atlas: ${winner}`);
    if (status === "complete" && (!reference || !hasLocalEvidence(reference.evidence))) throw new Error("a section winner must be an inspected reference with local research evidence");
    const sections = current.sections.map((item) => item.id === section
      ? {
        ...item,
        status,
        winner: winner || null,
        decision: String(decision || reason).trim(),
        evidence: evidenceItems,
        recordedAt: timestamp(),
      }
      : item);
    const references = winner
      ? current.references.map((item) => item.id === winner ? { ...item, status: "selected", selectedAt: timestamp() } : item)
      : current.references;
    return {
      ...current,
      sections,
      references,
      history: [...current.history, { type: "section", section, status, winner: winner || null, at: timestamp() }],
    };
  });
}

export function recordResearchAtlasSynthesis({
  projectRoot,
  session,
  direction = "",
  visualLanguage = "",
  composition = "",
  type = "",
  material = "",
  motion = "",
  assets = "",
  templateRisk = "",
  gaps = "",
  rejectedDefaults = "",
} = {}) {
  const path = atlasPath(projectRoot, session);
  const fields = { direction, visualLanguage, composition, type, material, motion, assets, templateRisk };
  const missing = Object.entries(fields).filter(([, value]) => !String(value).trim()).map(([key]) => key);
  if (missing.length > 0) throw new Error(`synthesis is missing: ${missing.join(", ")}`);
  return updateAtlas(path, (current) => ({
    ...current,
    synthesis: {
      status: "complete",
      direction: String(direction).trim(),
      visualLanguage: String(visualLanguage).trim(),
      composition: String(composition).trim(),
      type: String(type).trim(),
      material: String(material).trim(),
      motion: String(motion).trim(),
      assets: String(assets).trim(),
      templateRisk: String(templateRisk).trim(),
      gaps: list(gaps),
      rejectedDefaults: list(rejectedDefaults),
    },
    history: [...current.history, { type: "synthesis", at: timestamp() }],
  }));
}

export function recordResearchAtlasSkill({ projectRoot, session, id = "", status = "selected", reason = "" } = {}) {
  const path = atlasPath(projectRoot, session);
  if (!String(id).trim()) throw new Error("--id is required");
  if (!SKILL_STATUSES.has(status)) throw new Error("skill status must be selected or unavailable");
  if (status === "unavailable" && !String(reason).trim()) throw new Error("an unavailable skill requires --reason");
  return updateAtlas(path, (current) => {
    const key = status === "selected" ? "selected" : "unavailable";
    const otherKey = key === "selected" ? "unavailable" : "selected";
    const item = { id: String(id).trim(), reason: String(reason).trim() || null, at: timestamp() };
    return {
      ...current,
      skills: {
        ...current.skills,
        [key]: [...current.skills[key].filter((entry) => entry.id !== item.id), item],
        [otherKey]: current.skills[otherKey].filter((entry) => entry.id !== item.id),
      },
      history: [...current.history, { type: "skill", id: item.id, status, at: timestamp() }],
    };
  });
}

export function closeResearchAtlas({ projectRoot, session } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = atlasPath(root, session);
  const current = readAtlas(path);
  const openSections = current.sections.filter((item) => item.status === "pending");
  if (openSections.length > 0) throw new Error(`cannot close research atlas with open sections: ${openSections.map((item) => item.id).join(", ")}`);
  const unreviewedUserReferences = current.references.filter((item) => item.kind === "user" && item.status === "candidate");
  if (unreviewedUserReferences.length > 0) throw new Error(`user references still need a decision: ${unreviewedUserReferences.map((item) => item.id).join(", ")}`);
  const selected = current.references.filter((item) => item.status === "selected");
  if (current.mode !== "adaptive-no-reference" && selected.length === 0) throw new Error("reference-led atlas requires at least one selected, inspected reference; use adaptive-no-reference only when no example is justified");
  if (selected.some((item) => !hasLocalEvidence(item.evidence))) throw new Error("selected references must retain local inspection evidence");
  if (current.synthesis.status !== "complete") throw new Error("research atlas requires a completed synthesis before close");
  const winners = current.sections.filter((item) => item.status === "complete");
  if (winners.some((item) => !item.winner)) throw new Error("completed atlas sections require a winner");
  return writeAtlas(path, {
    ...current,
    status: "complete",
    completedAt: timestamp(),
    updatedAt: timestamp(),
    qualityBar: {
      selectedReferences: selected.map((item) => item.id),
      sectionWinners: Object.fromEntries(winners.map((item) => [item.id, item.winner])),
      templateRisk: current.synthesis.templateRisk,
    },
  });
}

function renderEvidence(items = []) {
  return items.length > 0 ? items.map((item) => `${item.ref}${item.exists === true ? " [exists]" : item.exists === false ? " [missing]" : " [external/note]"}`).join("; ") : "none";
}

export function renderResearchAtlas(atlas, path = "") {
  const references = atlas.references.length > 0
    ? atlas.references.map((item) => `- **${item.label}** \`${item.id}\` · ${item.kind} · ${item.status}${item.role ? ` · ${item.role}` : ""}\n  - Borrow: ${item.borrow.join("；") || "pending"}\n  - Reject: ${item.reject.join("；") || "pending"}\n  - Evidence: ${renderEvidence(item.evidence)}`).join("\n")
    : "- No external reference selected; follow the adaptive subject-led path.";
  const sections = atlas.sections.map((item) => `- **${item.label}** \`${item.id}\`: ${item.status}${item.winner ? ` · winner=${item.winner}` : ""}${item.decision ? ` · ${item.decision}` : ""}`).join("\n");
  const synthesis = atlas.synthesis;
  return `# Research Atlas

- Atlas: **${atlas.id}**
- Status: **${atlas.status}**
- Mode: **${atlas.mode}**
- Query: **${atlas.query || "(none)"}**
- File: \`${path || atlas.atlasPath || atlas.id}\`

References are candidates until they have local inspection evidence. Section winners may come from different sources, but the synthesis must become an original direction for the target subject.

## References

${references}

## Section Winners

${sections}

## Synthesis

- Status: **${synthesis.status}**
- Direction: ${synthesis.direction || "pending"}
- Visual language: ${synthesis.visualLanguage || "pending"}
- Composition: ${synthesis.composition || "pending"}
- Type: ${synthesis.type || "pending"}
- Material: ${synthesis.material || "pending"}
- Motion: ${synthesis.motion || "pending"}
- Assets: ${synthesis.assets || "pending"}
- Template risk: ${synthesis.templateRisk || "pending"}
- Rejected defaults: ${synthesis.rejectedDefaults.join("；") || "none recorded"}
- Gaps: ${synthesis.gaps.join("；") || "none recorded"}

## Skill Registry

- Selected: ${atlas.skills.selected.map((item) => item.id).join(", ") || "none recorded"}
- Unavailable: ${atlas.skills.unavailable.map((item) => `${item.id} (${item.reason})`).join(", ") || "none recorded"}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const command = ["start", "status", "add", "section", "synthesize", "skill", "close"].includes(args.positionals[0]) ? args.positionals[0] : "status";
  const projectRoot = option(args, "project", process.cwd());
  let result;
  if (command === "start") {
    const created = createResearchAtlas({ projectRoot, query: option(args, "query", args.positionals.slice(1).join(" ") || ""), mode: option(args, "mode", "") });
    result = { ...created.atlas, atlasPath: created.path };
  } else if (command === "status") {
    result = getResearchAtlas({ projectRoot, session: option(args, "session", "") });
  } else if (command === "add") {
    result = addResearchAtlasReference({
      projectRoot,
      session: option(args, "session", ""),
      id: option(args, "id", ""),
      label: option(args, "label", ""),
      url: option(args, "url", ""),
      kind: option(args, "kind", "discovered"),
      status: option(args, "status", "candidate"),
      role: option(args, "role", ""),
      evidence: option(args, "evidence", ""),
      strengths: option(args, "strengths", ""),
      weaknesses: option(args, "weaknesses", ""),
      borrow: option(args, "borrow", ""),
      reject: option(args, "reject", ""),
      observations: option(args, "observations", ""),
    });
  } else if (command === "section") {
    result = recordResearchAtlasSection({
      projectRoot,
      session: option(args, "session", ""),
      section: option(args, "section", ""),
      winner: option(args, "winner", ""),
      status: option(args, "status", "complete"),
      decision: option(args, "decision", ""),
      evidence: option(args, "evidence", ""),
      reason: option(args, "reason", ""),
    });
  } else if (command === "synthesize") {
    result = recordResearchAtlasSynthesis({
      projectRoot,
      session: option(args, "session", ""),
      direction: option(args, "direction", ""),
      visualLanguage: option(args, "visual-language", ""),
      composition: option(args, "composition", ""),
      type: option(args, "type", ""),
      material: option(args, "material", ""),
      motion: option(args, "motion", ""),
      assets: option(args, "assets", ""),
      templateRisk: option(args, "template-risk", ""),
      gaps: option(args, "gaps", ""),
      rejectedDefaults: option(args, "rejected-defaults", ""),
    });
  } else if (command === "skill") {
    result = recordResearchAtlasSkill({
      projectRoot,
      session: option(args, "session", ""),
      id: option(args, "id", ""),
      status: option(args, "status", "selected"),
      reason: option(args, "reason", ""),
    });
  } else {
    result = closeResearchAtlas({ projectRoot, session: option(args, "session", "") });
  }
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderResearchAtlas(result, result.atlasPath), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
