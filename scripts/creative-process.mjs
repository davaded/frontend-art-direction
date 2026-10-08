import { readFileSync } from "node:fs";

const DIRECTION_FIELDS = [
  "id", "label", "signature", "firstViewport", "layoutRules", "typeRules",
  "spacingRules", "surfaceRules", "geometryRules", "contentRules", "renderChecks",
  "antiAiChecks", "visualTreatment",
];
const BUILD_FIELDS = [
  "firstViewport", "pagePlan", "componentGrammar", "tokenSeed", "motionContract",
  "responsivePlan", "assetStrategy", "buildOrder", "acceptance",
];
const PROTECTED_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireText(value, path) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${path} must be non-empty text`);
}

export function validateAuthoredDirection(value) {
  if (!isObject(value)) throw new Error("authored direction must be a JSON object");
  for (const key of Object.keys(value)) {
    if (![...DIRECTION_FIELDS, "rationale", "build"].includes(key)) throw new Error(`Unsupported authored direction field: ${key}`);
  }
  for (const key of ["label", "signature", "rationale"]) requireText(value[key], `authoredDirection.${key}`);
  if (!isObject(value.firstViewport)) throw new Error("authoredDirection.firstViewport must describe the chosen composition");
  requireText(value.firstViewport.layout, "authoredDirection.firstViewport.layout");
  requireText(value.firstViewport.dominant, "authoredDirection.firstViewport.dominant");
  if (value.build !== undefined) {
    if (!isObject(value.build)) throw new Error("authoredDirection.build must be an object");
    for (const key of Object.keys(value.build)) {
      if (!BUILD_FIELDS.includes(key)) throw new Error(`Unsupported authored build field: ${key}`);
    }
  }
  return value;
}

export function readAuthoredDirection(path) {
  return path ? validateAuthoredDirection(JSON.parse(readFileSync(path, "utf8"))) : null;
}

// Preserve supplied fields exactly and use candidates only for missing fields.
export function mergeVisualContract(base, patch, path = "direction") {
  if (patch === undefined) return base;
  if (Array.isArray(base)) {
    if (!Array.isArray(patch)) throw new Error(`${path} must be an array`);
    return patch.map((item, index) => {
      const sample = base[0];
      if (isObject(sample)) {
        if (!isObject(item)) throw new Error(`${path}[${index}] must be an object`);
        for (const key of Object.keys(sample)) {
          if (item[key] === undefined) throw new Error(`${path}[${index}].${key} is required`);
        }
      }
      return mergeVisualContract(sample ?? "", item, `${path}[${index}]`);
    });
  }
  if (isObject(base)) {
    if (!isObject(patch)) throw new Error(`${path} must be an object`);
    const merged = { ...base };
    for (const [key, value] of Object.entries(patch)) {
      if (PROTECTED_KEYS.has(key)) throw new Error(`Unsupported field: ${path}.${key}`);
      if (!(key in base) && !path.startsWith("build.tokenSeed")) throw new Error(`Unknown field: ${path}.${key}`);
      merged[key] = mergeVisualContract(base[key] ?? (isObject(value) ? {} : ""), value, `${path}.${key}`);
    }
    return merged;
  }
  requireText(patch, path);
  return patch;
}

export function applyAuthoredDirection(candidate, authored) {
  if (!authored) return candidate;
  validateAuthoredDirection(authored);
  const patch = Object.fromEntries(DIRECTION_FIELDS.filter((key) => authored[key] !== undefined).map((key) => [key, authored[key]]));
  const resolved = mergeVisualContract(candidate, { ...patch, id: authored.id ?? "authored-direction" });
  return {
    ...resolved,
    authoredBuild: authored.build ?? null,
  };
}

export function applyAuthoredBuild(candidate, authoredBuild) {
  if (!authoredBuild) return candidate;
  if (!isObject(candidate) || !isObject(authoredBuild)) throw new Error("authored build must be an object");
  const resolved = { ...candidate };
  for (const [key, value] of Object.entries(authoredBuild)) {
    if (key === "tokenSeed" && isObject(candidate.tokenSeed) && isObject(value)) {
      resolved.tokenSeed = { ...candidate.tokenSeed, ...value };
    } else {
      resolved[key] = value;
    }
  }
  return resolved;
}

export function buildVisualIterationPlan() {
  return {
    status: "planned-not-executed",
    screenshotLoop: {
      sequence: ["capture actual render", "inspect visible defects", "change code or assets", "recapture and compare"],
      coverage: ["desktop full scope", "target-mobile full scope", "opening, middle, and ending or relevant routes", "important state, transition, or fallback"],
      repairOrder: "Resolve incomplete scope, broken content, composition, hierarchy, and media before fine detail; preserve strengths and check regressions after each material change.",
    },
    imageLoop: {
      useWhen: "Use available image generation for an open visual thesis, a bland composition, or unsuitable media; direct code fixes remain appropriate for local defects.",
      sequence: ["inspect current screenshot or real brief", "generate or edit visual proposal", "inspect and select revision", "translate changes into code and usable assets", "capture actual render and compare"],
      inputs: "Current screenshot is the edit target when available; inspected references and user assets have explicit supporting roles.",
      execution: "The agent invokes the available built-in image tool; this local command does not generate images or capture a browser.",
    },
    evidence: {
      acceptanceSource: "actual-render",
      generatedImageRole: "proposal-or-asset",
      ledger: "baseline capture -> observed defect -> selected proposal if used -> code/asset delta -> recapture -> resolved/open issues",
    },
    convergence: "Continue while material issues remain and a useful repair is available. If rounds plateau, replace the weak direction or missing asset; report real blockers and never claim acceptance from a plan or generated mockup.",
    reference: "references/visual-iteration.md",
  };
}

export function buildCreativeProcess({ authored = null, authority, candidate }) {
  const sourceLed = ["explicit-creative-direction", "reference-led", "project-owned", "accepted-concept"].includes(authority.mode);
  return {
    status: authored ? "authored-proposal" : sourceLed ? "source-led" : "exploration-required",
    candidateRole: "gap-fill vocabulary; keyword confidence does not measure visual quality",
    source: authored ? authored.label : sourceLed ? authority.source : null,
    rationale: authored?.rationale ?? null,
    fallbackCandidate: candidate.id,
    exploration: sourceLed
      ? "Translate the authoritative design's relationships and explore its unresolved details; preserve the requested fidelity and product intent."
      : "For a substantial new surface or a bland redesign, derive 2-3 structural hypotheses from real content before committing to a local candidate. Compare reading order, dominant object, silhouette, type/media relationship, and interaction model; a new palette alone is not a different concept.",
    referenceUse: "Inspect relevant references for distinct jobs after forming an independent thesis; synthesize the relationships rather than average whole-site skins.",
    selection: "Choose by intent fit, coherent composition, subject specificity, and feasibility. Start with the strongest composition and one meaningful state or moment, then finish the full declared scope.",
    rejection: "If the first render is interchangeable with another product, change the thesis or composition before polishing. A rejected concept need not be kept because it obeys the dataset.",
    proof: "Compare desktop/mobile silhouette, real assets, typography, and state behavior against the chosen thesis. This contract does not prove originality or visual quality.",
    visualIteration: buildVisualIterationPlan(),
  };
}

export function renderCreativeProcess(process) {
  return `## Creative Process

- Status: **${process.status}**
- Candidate role: ${process.candidateRole}
${process.rationale ? `- Chosen rationale: ${process.rationale}\n` : ""}- Exploration: ${process.exploration}
- References: ${process.referenceUse}
- Selection: ${process.selection}
- Reject and revise: ${process.rejection}
- Proof: ${process.proof}

### Visual Iteration Plan

- Execution: **${process.visualIteration.status}**; the implementing agent must run the tools.
- Screenshot loop: ${process.visualIteration.screenshotLoop.sequence.join(" -> ")}
- Coverage: ${process.visualIteration.screenshotLoop.coverage.join("; ")}
- Image loop: ${process.visualIteration.imageLoop.sequence.join(" -> ")}
- Use image generation when: ${process.visualIteration.imageLoop.useWhen}
- Acceptance source: actual browser/device render; generated images remain proposals or assets.
- Evidence ledger: ${process.visualIteration.evidence.ledger}
- Convergence: ${process.visualIteration.convergence}
- Read: ${process.visualIteration.reference}
`;
}
