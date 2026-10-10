#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { inspectLocalEvidence } from "./media-evidence.mjs";
import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";

const JOURNAL_DIR = ".art-direction/visual-critique";
const SEVERITIES = new Set(["P0", "P1", "P2", "P3"]);
const CONFIDENCES = new Set(["code-certain", "render-certain", "aesthetic-judgment"]);
const FINDING_STATUSES = new Set(["open", "resolved", "deferred"]);
const VERDICTS = new Set(["CURRENT WINS", "REFERENCE WINS", "INCONCLUSIVE"]);

function sessionPath(projectRoot, session) {
  const root = resolve(projectRoot ?? process.cwd());
  if (!session) throw new Error("--session is required");
  const path = resolve(root, session.endsWith(".json") ? session : join(JOURNAL_DIR, `${session}.json`));
  if (!path.startsWith(`${root}/`) && path !== root) throw new Error("session must stay inside the project root");
  return path;
}

function readSession(path) {
  if (!existsSync(path)) throw new Error(`Visual critique session not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeSession(path, session) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(session, null, 2)}\n`);
  return session;
}

function requireText(value, label) {
  if (!String(value ?? "").trim()) throw new Error(`${label} is required`);
  return String(value).trim();
}

function list(value) {
  return String(value ?? "").split(/[\n,]/u).map((item) => item.trim()).filter(Boolean);
}

function inspectReference(projectRoot, ref) {
  if (!ref) return null;
  if (/^(?:https?:|data:)/u.test(ref)) return { ref, kind: "external", exists: null, valid: null };
  return inspectLocalEvidence(projectRoot, ref);
}

function requireValidCapture(projectRoot, ref, label) {
  const evidence = inspectLocalEvidence(projectRoot, ref);
  if (evidence.kind !== "capture-or-media" || evidence.exists !== true || evidence.valid !== true) {
    throw new Error(`${label} needs an existing valid local image or media capture`);
  }
  return evidence;
}

function normalizeFindingEvidence(projectRoot, refs) {
  const evidence = list(refs).map((ref) => inspectReference(projectRoot, ref));
  if (evidence.length === 0) throw new Error("--evidence is required for a finding");
  const missing = evidence.filter((item) => item.exists === false);
  if (missing.length > 0) throw new Error(`finding evidence does not exist inside the project: ${missing.map((item) => item.ref).join(", ")}`);
  return evidence;
}

export function buildVisualCritiqueContract({ query = "", capture = "", reference = "", viewport = "", state = "" } = {}) {
  return {
    protocol: "frontend-art-direction/visual-critique-v1",
    status: "ready",
    purpose: "Provide a fresh, severity-ranked visual judgment before a meaningful round is accepted.",
    reviewer: { mode: "unprimed", implementationHistory: "do-not-read-before-first-look" },
    target: { query: query || null, capture: capture || null, reference: reference || null, viewport: viewport || null, state: state || null },
    reviewOrder: ["thumbnail and first glance", "subject and truth", "composition and hierarchy", "type and density", "material and geometry", "interaction and states", "responsive re-staging", "originality and template risk"],
    findingContract: ["severity", "region", "observation", "consequence", "evidence", "repair", "confidence"],
    verdicts: [...VERDICTS],
    hardRules: [
      "a clean anti-pattern scan cannot certify taste or originality",
      "CURRENT WINS cannot leave an open P0 or P1 finding",
      "a critique journal is review evidence, not implementation proof",
    ],
  };
}

export function createVisualCritiqueSession({ projectRoot, query = "", capture = "", reference = "", viewport = "", state = "", round = "" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const currentCapture = requireValidCapture(root, capture, "current capture");
  const id = `critique-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const path = sessionPath(root, id);
  const session = {
    protocol: "frontend-art-direction/visual-critique-v1",
    version: 1,
    id,
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectRoot: root,
    query: query || null,
    reviewer: { mode: "unprimed", implementationHistory: "not-read-before-first-look" },
    target: {
      capture: currentCapture,
      reference: inspectReference(root, reference),
      viewport: viewport || null,
      state: state || null,
      round: round ? Number(round) : null,
    },
    findings: [],
    verdict: null,
    largestGap: null,
    nextOperation: null,
    regressionCheck: null,
    contract: buildVisualCritiqueContract({ query, capture: currentCapture.ref, reference, viewport, state }),
  };
  return { path, session: writeSession(path, session) };
}

function updateSession(path, update) {
  const current = readSession(path);
  return writeSession(path, { ...current, ...update, updatedAt: new Date().toISOString() });
}

export function addVisualFinding({ projectRoot, session, id, severity, region, observation, consequence, evidence, repair, confidence, status = "open" } = {}) {
  const findingId = requireText(id, "--id");
  if (!SEVERITIES.has(severity)) throw new Error("--severity must be P0, P1, P2, or P3");
  if (!CONFIDENCES.has(confidence)) throw new Error("--confidence must be code-certain, render-certain, or aesthetic-judgment");
  if (!FINDING_STATUSES.has(status)) throw new Error("--status must be open, resolved, or deferred");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  if (current.findings.some((item) => item.id === findingId)) throw new Error(`Finding already exists: ${findingId}`);
  const finding = {
    id: findingId,
    severity,
    region: requireText(region, "--region"),
    observation: requireText(observation, "--observation"),
    consequence: requireText(consequence, "--consequence"),
    evidence: normalizeFindingEvidence(projectRoot, evidence),
    repair: requireText(repair, "--repair"),
    confidence,
    status,
    recordedAt: new Date().toISOString(),
  };
  return updateSession(file, { status: "findings-ready", findings: [...current.findings, finding] });
}

export function recordVisualVerdict({ projectRoot, session, verdict, largestGap, nextOperation, regressionCheck } = {}) {
  if (!VERDICTS.has(verdict)) throw new Error("--verdict must be CURRENT WINS, REFERENCE WINS, or INCONCLUSIVE");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  if (current.findings.length === 0) throw new Error("record at least one structured finding before the verdict");
  if (verdict === "CURRENT WINS" && current.findings.some((item) => ["P0", "P1"].includes(item.severity) && item.status === "open")) {
    throw new Error("CURRENT WINS cannot leave an open P0 or P1 finding");
  }
  return updateSession(file, {
    status: "verdict-ready",
    verdict,
    largestGap: requireText(largestGap, "--largest-gap"),
    nextOperation: requireText(nextOperation, "--next-operation"),
    regressionCheck: requireText(regressionCheck, "--regression-check"),
    decidedAt: new Date().toISOString(),
  });
}

export function closeVisualCritiqueSession({ projectRoot, session } = {}) {
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  requireValidCapture(projectRoot, current.target.capture.ref, "current capture");
  if (current.findings.length === 0) throw new Error("visual critique needs at least one structured finding");
  if (!current.verdict || !VERDICTS.has(current.verdict)) throw new Error("visual critique needs a recorded verdict");
  if (current.verdict === "CURRENT WINS" && current.findings.some((item) => ["P0", "P1"].includes(item.severity) && item.status === "open")) throw new Error("visual critique cannot close with an open P0 or P1 finding");
  return updateSession(file, {
    status: "complete",
    proof: { capture: requireValidCapture(projectRoot, current.target.capture.ref, "current capture"), findingCount: current.findings.length, verdict: current.verdict },
    completedAt: new Date().toISOString(),
  });
}

export function validateVisualCritiqueArtifact(projectRoot, ref, expectedVerdict = "") {
  if (extname(String(ref)).toLocaleLowerCase() !== ".json") return null;
  const root = resolve(projectRoot);
  const absolute = resolve(root, ref);
  if (!absolute.startsWith(`${root}/`) && absolute !== root) throw new Error(`critique journal must stay inside the project root: ${ref}`);
  if (!existsSync(absolute)) return null;
  const session = JSON.parse(readFileSync(absolute, "utf8"));
  if (session.protocol !== "frontend-art-direction/visual-critique-v1" || session.status !== "complete") throw new Error(`critique journal must be a complete visual-critique session: ${ref}`);
  if (expectedVerdict && session.verdict !== expectedVerdict) throw new Error(`critique journal verdict ${session.verdict} does not match ${expectedVerdict}`);
  return session;
}

function renderVisualCritique(session, path = "") {
  const open = session.findings.filter((item) => item.status === "open");
  return `# Independent Visual Critique\n\n- Session: **${session.id}**\n- Status: **${session.status}**\n- Reviewer mode: **${session.reviewer.mode}**\n- Capture: \`${session.target.capture.ref}\`\n- Findings: ${session.findings.length} (${open.length} open)\n- Verdict: **${session.verdict ?? "not recorded"}**\n- Largest gap: ${session.largestGap ?? "not recorded"}\n- Next operation: ${session.nextOperation ?? "not recorded"}\n- Session file: \`${path || session.id}\`\n\nA critique records visual judgment; the browser capture remains the implementation proof.\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const subcommand = args.positionals[0] ?? "start";
  if (args.options.help || args.options.h) {
    console.log(`visual-critique.mjs <start|status|add|verdict|close> [options]\n\n  --project <path> --query <text> --capture <path> --reference <path-or-url>\n  --viewport <size> --state <state> --round <number> --session <id-or-path>\n  --id <finding-id> --severity <P0|P1|P2|P3> --region <text>\n  --observation <text> --consequence <text> --evidence <paths> --repair <text>\n  --confidence <code-certain|render-certain|aesthetic-judgment> --status <open|resolved|deferred>\n  --verdict <CURRENT WINS|REFERENCE WINS|INCONCLUSIVE> --largest-gap <text>\n  --next-operation <text> --regression-check <text> --format md|json`);
    return;
  }
  const projectRoot = option(args, "project", process.cwd());
  let result;
  if (subcommand === "start") {
    const created = createVisualCritiqueSession({ projectRoot, query: option(args, "query", ""), capture: option(args, "capture", ""), reference: option(args, "reference", ""), viewport: option(args, "viewport", ""), state: option(args, "state", ""), round: option(args, "round", "") });
    result = { ...created.session, sessionPath: created.path };
  } else if (subcommand === "status") {
    const path = sessionPath(projectRoot, option(args, "session", ""));
    result = { ...readSession(path), sessionPath: path };
  } else if (subcommand === "add") {
    result = addVisualFinding({ projectRoot, session: option(args, "session", ""), id: option(args, "id", ""), severity: option(args, "severity", ""), region: option(args, "region", ""), observation: option(args, "observation", ""), consequence: option(args, "consequence", ""), evidence: option(args, "evidence", ""), repair: option(args, "repair", ""), confidence: option(args, "confidence", ""), status: option(args, "status", "open") });
  } else if (subcommand === "verdict") {
    result = recordVisualVerdict({ projectRoot, session: option(args, "session", ""), verdict: option(args, "verdict", ""), largestGap: option(args, "largest-gap", ""), nextOperation: option(args, "next-operation", ""), regressionCheck: option(args, "regression-check", "") });
  } else if (subcommand === "close") {
    result = closeVisualCritiqueSession({ projectRoot, session: option(args, "session", "") });
  } else {
    throw new Error(`Unknown visual critique subcommand: ${subcommand}`);
  }
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderVisualCritique(result, result.sessionPath), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
