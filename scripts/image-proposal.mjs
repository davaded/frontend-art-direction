#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { inspectExistingArtifact, inspectLocalEvidence } from "./media-evidence.mjs";
import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";

const JOURNAL_DIR = ".art-direction/image-proposals";

function sessionPath(projectRoot, session) {
  const root = resolve(projectRoot ?? process.cwd());
  if (!session) throw new Error("--session is required");
  const path = resolve(root, session.endsWith(".json") ? session : join(JOURNAL_DIR, `${session}.json`));
  if (!path.startsWith(`${root}/`) && path !== root) throw new Error("session must stay inside the project root");
  return path;
}

function readSession(path) {
  if (!existsSync(path)) throw new Error(`Image proposal session not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeSession(path, session) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(session, null, 2)}\n`);
  return session;
}

function requireValidMedia(projectRoot, ref, label) {
  const evidence = inspectLocalEvidence(projectRoot, ref);
  if (evidence.kind !== "capture-or-media" || evidence.exists !== true || evidence.valid !== true) {
    throw new Error(`${label} needs an existing valid local image or media file`);
  }
  return evidence;
}

function requireText(value, label) {
  if (!String(value ?? "").trim()) throw new Error(`${label} is required`);
  return String(value).trim();
}

function listOption(value) {
  if (!value) return [];
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

export function buildImageProposalContract({ query = "", baseline = "", gap = "" } = {}) {
  return {
    protocol: "frontend-art-direction/image-proposal-v1",
    status: "ready",
    purpose: "Use image generation to explore an unresolved visual relationship, then translate the selected proposal into source and prove it with a real render.",
    target: { query: query || null, baseline: baseline || null, largestGap: gap || null },
    sequence: [
      "capture and inspect the real baseline",
      "record a bounded proposal with its prompt and input roles",
      "inspect and select or reject the proposal",
      "translate the selected relationship into source and usable assets",
      "recapture the actual target at comparable states",
      "close only after the final render proves the translation",
    ],
    hardRules: [
      "generated images are proposals or production assets, never implementation proof",
      "preserve the real subject, content, scope, and user direction",
      "do not ship a flattened mockup as the webpage",
      "if image generation is unavailable, continue with screenshot-to-code iteration and record the limitation",
    ],
  };
}

export function createImageProposalSession({ projectRoot, query = "", baseline = "", gap = "" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const id = `image-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const path = sessionPath(root, id);
  if (baseline) requireValidMedia(root, baseline, "baseline");
  const session = {
    version: 1,
    id,
    status: "ready",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectRoot: root,
    query: query || null,
    largestGap: gap || null,
    baseline: baseline ? inspectLocalEvidence(root, baseline) : null,
    proposals: [],
    decision: null,
    translation: null,
    evidence: [],
    contract: buildImageProposalContract({ query, baseline, gap }),
  };
  return { path, session: writeSession(path, session) };
}

function updateSession(path, update) {
  const current = readSession(path);
  return writeSession(path, { ...current, ...update, updatedAt: new Date().toISOString() });
}

export function addImageProposal({ projectRoot, session, id, path: proposalPath = "", prompt = "", summary = "", role = "screenshot-edit", inputs = "", preserve = "" } = {}) {
  const proposalId = requireText(id, "--id");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  if (current.proposals.some((item) => item.id === proposalId)) throw new Error(`Proposal already exists: ${proposalId}`);
  const evidence = requireValidMedia(projectRoot, proposalPath, `proposal ${proposalId}`);
  const proposal = {
    id: proposalId,
    path: evidence.ref,
    role: role || "screenshot-edit",
    prompt: requireText(prompt, "--prompt"),
    summary: requireText(summary, "--summary"),
    inputRoles: listOption(inputs),
    preserve: preserve || null,
    status: "pending",
    addedAt: new Date().toISOString(),
  };
  return updateSession(file, { status: "proposal-ready", proposals: [...current.proposals, proposal] });
}

export function decideImageProposal({ projectRoot, session, proposal, decision } = {}) {
  if (!["select", "reject"].includes(decision)) throw new Error("decision must be select or reject");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  const selected = current.proposals.find((item) => item.id === proposal);
  if (!selected) throw new Error(`Unknown proposal: ${proposal}`);
  if (decision === "select") requireValidMedia(projectRoot, selected.path, `proposal ${proposal}`);
  const proposals = current.proposals.map((item) => ({
    ...item,
    status: item.id === proposal ? decision === "select" ? "selected" : "rejected" : item.status,
  }));
  return updateSession(file, {
    status: decision === "select" ? "selected-awaiting-translation" : "proposal-rejected",
    proposals,
    decision: { proposal, action: decision, decidedAt: new Date().toISOString() },
  });
}

export function translateImageProposal({ projectRoot, session, sourceDiff = "", delta = "", assets = "" } = {}) {
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  const selected = current.proposals.find((item) => item.status === "selected");
  if (!selected || current.decision?.action !== "select") throw new Error("select a proposal before translating it");
  if (!inspectExistingArtifact(projectRoot, sourceDiff)) throw new Error("translation needs an existing source diff or implementation artifact");
  const translation = {
    proposal: selected.id,
    sourceDiff: inspectLocalEvidence(projectRoot, sourceDiff).ref,
    delta: requireText(delta, "--delta"),
    assets: listOption(assets),
    translatedAt: new Date().toISOString(),
  };
  return updateSession(file, { status: "translated-awaiting-capture", translation });
}

export function recordImageEvidence({ projectRoot, session, kind, path: evidencePath = "", notes = "" } = {}) {
  if (!["baseline", "after"].includes(kind)) throw new Error("--kind must be baseline or after");
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  const evidence = requireValidMedia(projectRoot, evidencePath, kind);
  const event = { kind, path: evidence.ref, notes: notes || null, recordedAt: new Date().toISOString() };
  const evidenceList = current.evidence.filter((item) => item.kind !== kind);
  return updateSession(file, {
    status: kind === "after" && current.translation ? "ready-to-close" : current.status,
    evidence: [...evidenceList, event],
    baseline: kind === "baseline" ? evidence : current.baseline,
  });
}

export function closeImageProposalSession({ projectRoot, session } = {}) {
  const file = sessionPath(projectRoot, session);
  const current = readSession(file);
  const baseline = current.evidence.find((item) => item.kind === "baseline") ?? current.baseline;
  const after = current.evidence.find((item) => item.kind === "after");
  if (!baseline || !requireValidMedia(projectRoot, baseline.ref ?? baseline.path, "baseline")) throw new Error("image proposal session needs a valid baseline capture");
  const selected = current.proposals.find((item) => item.status === "selected");
  if (!selected || current.decision?.action !== "select") throw new Error("image proposal session needs a selected proposal");
  if (!current.translation?.sourceDiff || !inspectExistingArtifact(projectRoot, current.translation.sourceDiff)) throw new Error("selected proposal needs a recorded source translation");
  if (!after || !requireValidMedia(projectRoot, after.path, "after capture")) throw new Error("image proposal session needs a valid after capture");
  return updateSession(file, {
    status: "complete",
    proof: {
      baseline: inspectLocalEvidence(projectRoot, baseline.ref ?? baseline.path),
      proposal: inspectLocalEvidence(projectRoot, selected.path),
      sourceDiff: inspectExistingArtifact(projectRoot, current.translation.sourceDiff),
      after: inspectLocalEvidence(projectRoot, after.path),
    },
    completedAt: new Date().toISOString(),
  });
}

function renderImageProposal(session, path = "") {
  const selected = session.proposals.find((item) => item.status === "selected");
  return `# Image Proposal Session\n\n- Session: **${session.id}**\n- Status: **${session.status}**\n- Query: ${session.query ?? "not set"}\n- Largest gap: ${session.largestGap ?? "not set"}\n- Proposals: ${session.proposals.length}\n- Selected proposal: ${selected?.id ?? "none"}\n- Session file: \`${path || session.id}\`\n\nGenerated images remain proposals or assets. Close requires a selected proposal, a recorded source translation, and a valid after capture of the actual target.\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const subcommand = args.positionals[0] ?? "start";
  if (args.options.help || args.options.h) {
    console.log(`image-proposal.mjs <start|status|add|select|reject|translate|record|close> [options]\n\n  --project <path> --query <text> --baseline <capture> --gap <text>\n  --session <id-or-path> --id <proposal-id> --path <image-or-capture>\n  --prompt <text> --summary <text> --role <screenshot-edit|concept|asset>\n  --inputs <role1,role2> --preserve <text> --source-diff <path> --delta <text> --assets <path1,path2>\n  --kind <baseline|after> --notes <text> --format md|json`);
    return;
  }
  const projectRoot = option(args, "project", process.cwd());
  let result;
  if (subcommand === "start") {
    result = createImageProposalSession({ projectRoot, query: option(args, "query", ""), baseline: option(args, "baseline", ""), gap: option(args, "gap", "") });
    result = { ...result.session, sessionPath: result.path };
  } else if (subcommand === "status") {
    const path = sessionPath(projectRoot, option(args, "session", ""));
    result = { ...readSession(path), sessionPath: path };
  } else if (subcommand === "add") {
    result = addImageProposal({ projectRoot, session: option(args, "session", ""), id: option(args, "id", ""), path: option(args, "path", ""), prompt: option(args, "prompt", ""), summary: option(args, "summary", ""), role: option(args, "role", "screenshot-edit"), inputs: option(args, "inputs", ""), preserve: option(args, "preserve", "") });
  } else if (subcommand === "select" || subcommand === "reject") {
    result = decideImageProposal({ projectRoot, session: option(args, "session", ""), proposal: option(args, "proposal", option(args, "id", "")), decision: subcommand });
  } else if (subcommand === "translate") {
    result = translateImageProposal({ projectRoot, session: option(args, "session", ""), sourceDiff: option(args, "source-diff", ""), delta: option(args, "delta", ""), assets: option(args, "assets", "") });
  } else if (subcommand === "record") {
    result = recordImageEvidence({ projectRoot, session: option(args, "session", ""), kind: option(args, "kind", ""), path: option(args, "path", ""), notes: option(args, "notes", "") });
  } else if (subcommand === "close") {
    result = closeImageProposalSession({ projectRoot, session: option(args, "session", "") });
  } else {
    throw new Error(`Unknown image proposal subcommand: ${subcommand}`);
  }
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderImageProposal(result, result.sessionPath), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
