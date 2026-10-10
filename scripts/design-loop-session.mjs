import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { loadDataset, relativePath } from "./lib.mjs";
import { buildDesignLoop } from "./design-loop.mjs";
import { createResearchAtlas, getResearchAtlas } from "./research-atlas.mjs";

const SESSION_DIR = ".art-direction/design-loop";
const MODES = ["create", "rebuild", "refine", "fix", "audit", "resume"];
const CLOSED_STATUSES = new Set(["complete", "skipped"]);

function sessionPath(projectRoot, session) {
  const root = resolve(projectRoot ?? process.cwd());
  if (!session) throw new Error("--session is required");
  const path = resolve(root, session.endsWith(".json") ? session : join(SESSION_DIR, `${session}.json`));
  if (!path.startsWith(`${root}/`) && path !== root) throw new Error("session must stay inside the project root");
  return path;
}

function readSession(path) {
  if (!existsSync(path)) throw new Error(`Design loop session not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

export function getDesignLoopSession({ projectRoot, session } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = sessionPath(root, session);
  return { ...readSession(path), sessionPath: path };
}

function writeSession(path, session) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(session, null, 2)}\n`);
  return session;
}

function list(value) {
  return String(value ?? "")
    .split(/[\n,]/u)
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasBytes(bytes, values, offset = 0) {
  return values.every((value, index) => bytes[offset + index] === value);
}

function isRenderableCapture(path, ref) {
  try {
    const bytes = readFileSync(path).subarray(0, 32);
    const extension = extname(ref).toLocaleLowerCase();
    if (extension === ".png") return hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if ([".jpg", ".jpeg"].includes(extension)) return hasBytes(bytes, [0xff, 0xd8, 0xff]);
    if (extension === ".gif") return hasBytes(bytes, [0x47, 0x49, 0x46, 0x38]);
    if (extension === ".webp") return hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8);
    if ([".avif", ".heic", ".heif", ".mp4", ".mov", ".m4v"].includes(extension)) return hasBytes(bytes, [0x66, 0x74, 0x79, 0x70], 4);
    if ([".webm", ".mkv"].includes(extension)) return hasBytes(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
    return false;
  } catch {
    return false;
  }
}

function parseDimensionScores(value, dimensions) {
  const scores = {};
  for (const item of list(value)) {
    const [id, rawScore] = item.split("=");
    const score = Number(rawScore);
    if (!dimensions.some((dimension) => dimension.id === id)) throw new Error(`unknown quality dimension: ${id}`);
    if (!Number.isFinite(score) || score < 1 || score > 10) throw new Error(`quality dimension ${id} must be between 1 and 10`);
    scores[id] = score;
  }
  return scores;
}

function weightedQualityScore(scores, dimensions) {
  const rated = dimensions.filter((dimension) => Number.isFinite(scores[dimension.id]));
  if (rated.length === 0) return null;
  const weight = rated.reduce((sum, dimension) => sum + dimension.weight, 0);
  return Number((rated.reduce((sum, dimension) => sum + scores[dimension.id] * dimension.weight, 0) / weight).toFixed(2));
}

function inferMode(query = "") {
  const text = String(query).toLocaleLowerCase();
  if (/resume|continue|继续|接着/u.test(text)) return "resume";
  if (/audit|review|检查|审查|验收/u.test(text)) return "audit";
  if (/fix|bug|broken|修复|报错|溢出|错位/u.test(text)) return "fix";
  if (/refine|polish|premium|优化|打磨|质感|高级/u.test(text)) return "refine";
  if (/rebuild|redesign|彻底重构|重做|重构|改版/u.test(text)) return "rebuild";
  return "create";
}

function normalizeEvidence(projectRoot, values) {
  return list(values).map((ref) => {
    const isUrl = /^(?:https?:|data:)/u.test(ref);
    if (isUrl) return { ref, kind: "external", exists: null };
    if (/^(?:decision|note|observation):/iu.test(ref)) return { ref, kind: "recorded-note", exists: null };
    const absolute = resolve(projectRoot, ref);
    const inside = absolute === projectRoot || absolute.startsWith(`${projectRoot}/`);
    const file = inside && existsSync(absolute) ? statSync(absolute) : null;
    const capture = /\.(?:png|jpe?g|webp|avif|gif|mp4|mov|m4v|webm|mkv)$/iu.test(ref);
    return {
      ref: inside ? relativePath(projectRoot, absolute) : ref,
      kind: capture ? "capture-or-media" : "artifact-or-check",
      exists: Boolean(file?.isFile()),
      size: file?.size ?? null,
      valid: capture && file?.isFile() ? isRenderableCapture(absolute, ref) : null,
    };
  });
}

function hasCaptureEvidence(items) {
  return items.some((item) => item.exists === true && item.kind === "capture-or-media" && item.size > 0 && item.valid === true);
}

function captureEvidenceCount(items) {
  return items.filter((item) => item.exists === true && item.kind === "capture-or-media" && item.size > 0 && item.valid === true).length;
}

function currentRound(session) {
  const pending = session.rounds.find((item) => !CLOSED_STATUSES.has(item.status));
  return pending?.round ?? session.rounds.length + 1;
}

function findRound(session, round) {
  const item = session.rounds.find((candidate) => candidate.round === round);
  if (!item) throw new Error(`Unknown round: ${round}; expected 1-${session.rounds.length}`);
  return item;
}

function requireOrderedRound(session, round) {
  const active = currentRound(session);
  if (round > active) throw new Error(`Round ${round} is premature; complete or explicitly skip round ${active} first`);
}

export function createDesignLoopSession({ projectRoot, query = "", mode = "", action = "", scope = "substantial" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const resolvedMode = MODES.includes(mode) ? mode : inferMode(query);
  const plan = buildDesignLoop({ query, scope });
  if (action) plan.operation = { ...plan.operation, operation: action, confidence: "explicit-session-action" };
  const id = `loop-${new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14)}-${randomUUID().slice(0, 8)}`;
  const path = sessionPath(root, id);
  const rubric = loadDataset("quality-rubric.json");
  const research = createResearchAtlas({ projectRoot: root, query, mode: resolvedMode === "create" && !query ? "adaptive-no-reference" : "" });
  const session = {
    protocol: "frontend-art-direction/design-loop-session-v1",
    version: 1,
    id,
    status: "in-progress",
    mode: resolvedMode,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    projectRoot: root,
    query,
    scope,
    operation: plan.operation,
    surfaceMode: plan.surfaceMode,
    qualityBar: rubric,
    researchAtlas: {
      id: research.atlas.id,
      path: relativePath(root, research.path),
      status: research.atlas.status,
    },
    currentRound: 1,
    rounds: plan.roundsDetail.map((item) => ({
      ...item,
      status: "pending",
      attempts: [],
      decision: null,
      evidence: [],
      proof: [],
      issues: [],
      score: null,
    })),
    history: [],
  };
  return { path, session: writeSession(path, session) };
}

export function recordDesignLoopRound({ projectRoot, session, round, status = "complete", decision = "", evidence = "", proof = "", issues = "", score = "", dimensions = "", reason = "", largestGap = "", repair = "", verdict = "", comparison = "" } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = sessionPath(root, session);
  const current = readSession(path);
  const number = Number(round);
  if (!Number.isInteger(number) || number < 1) throw new Error("--round must be an integer from 1 to 20");
  if (!["complete", "skipped", "blocked"].includes(status)) throw new Error("--status must be complete, skipped, or blocked");
  requireOrderedRound(current, number);
  findRound(current, number);
  const evidenceItems = normalizeEvidence(root, evidence);
  const proofItems = list(proof);
  const issueItems = list(issues);
  const comparisonItems = normalizeEvidence(root, comparison);
  const dimensionScores = parseDimensionScores(dimensions, current.qualityBar.dimensions ?? []);
  const numericScore = score === "" ? null : Number(score);
  if (numericScore !== null && (!Number.isFinite(numericScore) || numericScore < 1 || numericScore > 10)) throw new Error("--score must be between 1 and 10");
  if (status === "complete" && (!String(decision).trim() || evidenceItems.length === 0)) throw new Error("a completed round requires --decision and --evidence");
  if (status === "skipped" && !String(reason).trim()) throw new Error("a skipped round requires --reason");
  if (status === "blocked" && !String(reason || decision).trim()) throw new Error("a blocked round requires --reason or --decision");
  if (number >= 15 && status === "complete" && proofItems.length === 0) throw new Error(`round ${number} requires at least one --proof item`);
  const missingEvidence = evidenceItems.filter((item) => item.exists === false);
  if (status === "complete" && missingEvidence.length > 0) throw new Error(`evidence does not exist inside the project: ${missingEvidence.map((item) => item.ref).join(", ")}`);
  const missingComparison = comparisonItems.filter((item) => item.exists === false);
  if (status === "complete" && missingComparison.length > 0) throw new Error(`comparison evidence does not exist inside the project: ${missingComparison.map((item) => item.ref).join(", ")}`);
  if (number >= 15 && status === "complete" && !hasCaptureEvidence(evidenceItems)) throw new Error(`round ${number} requires at least one existing local screenshot or media capture in --evidence`);
  if (number >= 16 && number <= 19 && status === "complete" && captureEvidenceCount(evidenceItems) < 2) throw new Error(`round ${number} requires before-and-after capture evidence in --evidence`);
  if (number >= 16 && number <= 19 && status === "complete" && comparisonItems.length === 0) throw new Error(`round ${number} requires --comparison evidence`);
  if (number >= 16 && number <= 19 && status === "complete" && (!String(largestGap).trim() || !String(repair).trim())) throw new Error(`round ${number} requires --largest-gap and --repair`);
  if (number === 19 && status === "complete" && !["CURRENT WINS", "REFERENCE WINS", "INCONCLUSIVE"].includes(String(verdict).trim())) throw new Error("round 19 requires --verdict CURRENT WINS, REFERENCE WINS, or INCONCLUSIVE");
  if (number === 20 && status === "complete" && String(verdict).trim() !== "CURRENT WINS") throw new Error("round 20 requires --verdict CURRENT WINS before sign-off");
  const attempt = {
    status,
    decision: String(decision || reason).trim() || null,
    evidence: evidenceItems,
    proof: proofItems,
    issues: issueItems,
    score: numericScore,
    dimensionScores,
    calculatedScore: weightedQualityScore(dimensionScores, current.qualityBar.dimensions ?? []),
    largestGap: String(largestGap).trim() || null,
    repair: String(repair).trim() || null,
    verdict: String(verdict).trim() || null,
    comparison: comparisonItems,
    recordedAt: new Date().toISOString(),
  };
  const rounds = current.rounds.map((item) => item.round === number
    ? {
      ...item,
      status,
      decision: attempt.decision,
      evidence: evidenceItems,
      proof: proofItems,
      issues: issueItems,
      score: numericScore,
      dimensionScores,
      calculatedScore: attempt.calculatedScore,
      largestGap: attempt.largestGap,
      repair: attempt.repair,
      verdict: attempt.verdict,
      comparison: comparisonItems,
      attempts: [...item.attempts, attempt],
    }
    : item);
  const next = { ...current, rounds, currentRound: currentRound({ ...current, rounds }), history: [...current.history, { round: number, ...attempt }], updatedAt: new Date().toISOString() };
  return writeSession(path, next);
}

export function closeDesignLoopSession({ projectRoot, session } = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const path = sessionPath(root, session);
  const current = readSession(path);
  if (current.researchAtlas) {
    const atlas = getResearchAtlas({ projectRoot: root, session: current.researchAtlas.path });
    if (atlas.status !== "complete") throw new Error(`research atlas must be closed before design-loop signoff: ${current.researchAtlas.path}`);
  }
  const pending = current.rounds.filter((item) => !CLOSED_STATUSES.has(item.status));
  if (pending.length > 0) throw new Error(`cannot sign off with open rounds: ${pending.map((item) => item.round).join(", ")}`);
  const signoff = findRound(current, 20);
  const requiredProof = current.qualityBar.requiredProof ?? [];
  const missingProof = requiredProof.filter((item) => !signoff.proof.includes(item));
  if (missingProof.length > 0) throw new Error(`signoff is missing proof: ${missingProof.join(", ")}`);
  const blockers = signoff.issues.filter((item) => /^P[01]\b/iu.test(item));
  if (blockers.length > 0) throw new Error(`signoff still has P0/P1 issues: ${blockers.join(", ")}`);
  const missingDimensions = (current.qualityBar.dimensions ?? []).filter((dimension) => !Number.isFinite(signoff.dimensionScores?.[dimension.id]));
  if (missingDimensions.length > 0) throw new Error(`signoff is missing quality dimensions: ${missingDimensions.map((item) => item.id).join(", ")}`);
  const calculatedScore = weightedQualityScore(signoff.dimensionScores, current.qualityBar.dimensions ?? []);
  const finalScore = signoff.score ?? calculatedScore;
  if (finalScore < current.qualityBar.targetScore || calculatedScore < current.qualityBar.targetScore) throw new Error(`signoff quality score must be at least ${current.qualityBar.targetScore}`);
  return writeSession(path, { ...current, status: "complete", currentRound: 21, qualityScore: calculatedScore, researchAtlas: current.researchAtlas ? { ...current.researchAtlas, status: "complete" } : current.researchAtlas, completedAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
}

export function renderDesignLoopSession(session, path = "") {
  const counts = session.rounds.reduce((result, item) => {
    result[item.status] = (result[item.status] ?? 0) + 1;
    return result;
  }, {});
  const current = session.rounds.find((item) => item.round === session.currentRound);
  const open = session.rounds.filter((item) => !CLOSED_STATUSES.has(item.status)).map((item) => `${item.round}:${item.id}`).join(", ") || "none";
  return `# Design Loop Session

- Session: **${session.id}**
- Status: **${session.status}**
- Mode: **${session.mode}**
- Current round: **${current ? `${current.round} ${current.id}` : "complete"}**
- Progress: ${counts.complete ?? 0} complete / ${counts.skipped ?? 0} skipped / ${counts.blocked ?? 0} blocked / ${counts.pending ?? 0} pending
- Open rounds: ${open}
- Quality target: **${session.qualityBar.targetScore}/10**
- Research atlas: **${session.researchAtlas?.status ?? "legacy session"}** · \`${session.researchAtlas?.path ?? "not linked"}\`
- Session file: \`${path || session.id}\`

The session is visual proof only after its evidence paths point to inspected artifacts and round 20 includes static, runtime, visual, accessibility, and scope proof.
`;
}
