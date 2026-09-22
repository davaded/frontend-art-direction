#!/usr/bin/env node

import { loadDataset } from "./lib.mjs";

const POLICY = loadDataset("constraint-policy.json");

const MODE_LABELS = {
  "explicit-creative-direction": "Explicit creative direction",
  "reference-led": "Reference-led direction",
  "project-owned": "Project-owned DESIGN.md",
  "accepted-concept": "Accepted visual concept",
  "model-proposed": "Evidence-backed model proposal",
  "adaptive-default": "Adaptive local default",
};

const MODE_SOURCE_LABELS = {
  "explicit-creative-direction": "current user direction or explicit direction pin",
  "reference-led": "named or inspected reference",
  "project-owned": "project design memory",
  "accepted-concept": "approved concept or visual hypothesis",
  "model-proposed": "agent/model proposal with a recorded rationale",
  "adaptive-default": "local candidates and evidence-led fallback",
};

const CREATIVE_DIRECTION_SIGNAL = /\b(?:brutalist|brutalism|editorial|experimental|expressionist|typographic|kinetic|cinematic|minimalist|minimal|maximalist|asymmetric|asymmetrical|quiet luxury|art[- ]directed|avant[- ]garde|playful|warm humanist|industrial|premium|high[- ]end|luxury)\b|(?:极简|极繁|实验性|实验风格|编辑型|杂志感|艺术化|艺术指导|非对称|不对称|动态|电影感|极简主义|高端|奢华|有质感|克制|大胆|工业风|复古|温暖亲和)/i;

function text(value) {
  return String(value ?? "").trim();
}

function hasValue(value) {
  return Boolean(text(value));
}

function normalizeMode(value) {
  const raw = text(value).toLocaleLowerCase();
  if (["artist", "creative", "explicit", "user", "direction", "explicit-creative-direction"].includes(raw)) return "explicit-creative-direction";
  if (["reference", "reference-led", "ref"].includes(raw)) return "reference-led";
  if (["project", "design-md", "project-owned", "design"].includes(raw)) return "project-owned";
  if (["concept", "accepted-concept"].includes(raw)) return "accepted-concept";
  if (["model", "agent", "model-proposed"].includes(raw)) return "model-proposed";
  if (["adaptive", "default", "adaptive-default"].includes(raw)) return "adaptive-default";
  return "";
}

function normalizeOverrides(overrides) {
  const list = Array.isArray(overrides) ? overrides : overrides ? [overrides] : [];
  return list.map((item) => {
    if (typeof item === "string") {
      return {
        rule: item,
        reason: "record the deliberate visual reason before implementation",
        evidence: "pending",
        risk: "review against the hard invariants and target viewport",
        proof: "desktop/mobile/state render proof required",
      };
    }
    return {
      rule: text(item?.rule ?? item?.id) || "unnamed advisory default",
      reason: text(item?.reason) || "record the deliberate visual reason before implementation",
      evidence: text(item?.evidence) || "pending",
      risk: text(item?.risk) || "review against the hard invariants and target viewport",
      proof: text(item?.proof) || "desktop/mobile/state render proof required",
    };
  });
}

function projectDesignRecord(project, designMemory) {
  const candidate = designMemory ?? project?.designAuthority ?? null;
  if (!candidate) return null;
  if (candidate.exists === false) return null;
  if (typeof candidate === "string") {
    return { exists: true, path: candidate, authority: "project-owned", confidence: "medium" };
  }
  return {
    exists: candidate.exists !== false,
    path: candidate.path ?? candidate.source ?? "DESIGN.md",
    authority: candidate.authority ?? "project-owned",
    confidence: candidate.confidence ?? "medium",
    hasDirectionContract: candidate.hasDirectionContract !== false,
    fields: candidate.fields ?? {},
    declaredExceptions: candidate.declaredExceptions ?? [],
  };
}

function selectedMode({
  query,
  requestedMode,
  creativeDirection,
  reference,
  referenceInspected,
  referenceEvidence,
  design,
  acceptedConcept,
  modelProposal,
}) {
  if (requestedMode) return requestedMode;
  if (hasValue(creativeDirection)) return "explicit-creative-direction";
  if (hasValue(reference) && (referenceInspected || referenceEvidence?.status === "observed" || referenceEvidence?.status === "approved")) return "reference-led";
  if (CREATIVE_DIRECTION_SIGNAL.test(text(query))) return "explicit-creative-direction";
  if (design?.exists && (design.authority === "project-owned" || design.hasDirectionContract)) return "project-owned";
  if (hasValue(reference)) return "reference-led";
  if (acceptedConcept) return "accepted-concept";
  if (modelProposal) return "model-proposed";
  return "adaptive-default";
}

function evidenceStatus(mode, { query, referenceInspected, referenceEvidence, design, acceptedConcept, creativeDirection, modelProposal }) {
  if (mode === "project-owned") return design?.hasDirectionContract ? "observed" : "partial";
  if (mode === "reference-led") return referenceInspected || ["observed", "approved"].includes(referenceEvidence?.status) ? "observed" : "pending-inspection";
  if (mode === "accepted-concept") return acceptedConcept ? "approved" : "pending-approval";
  if (mode === "explicit-creative-direction") return hasValue(creativeDirection) || CREATIVE_DIRECTION_SIGNAL.test(text(query)) ? "user-supplied" : "explicit-pin";
  if (mode === "model-proposed") return modelProposal ? "proposed" : "needs-rationale";
  return "provisional";
}

export function resolveCreativeAuthority({
  query = "",
  project = null,
  designMemory = null,
  reference = "",
  referenceInspected = false,
  referenceEvidence = null,
  creativeDirection = "",
  authority = "",
  acceptedConcept = false,
  modelProposal = false,
  requestedDirection = "",
  overrides = [],
} = {}) {
  const design = projectDesignRecord(project, designMemory);
  const requestedMode = normalizeMode(authority) || (hasValue(requestedDirection) ? "explicit-creative-direction" : "");
  const mode = selectedMode({
    query,
    requestedMode,
    creativeDirection,
    reference,
    referenceInspected,
    referenceEvidence,
    design,
    acceptedConcept,
    modelProposal,
  });
  const explicitOverrides = normalizeOverrides(overrides);
  const source = mode === "project-owned"
    ? design?.path ?? "DESIGN.md"
    : mode === "reference-led"
      ? text(reference) || "named reference"
      : mode === "explicit-creative-direction"
        ? text(creativeDirection) || text(query).slice(0, 180) || "user-supplied visual language"
        : MODE_SOURCE_LABELS[mode];
  const inheritedSources = [];
  if (design?.exists && mode !== "project-owned") inheritedSources.push({ source: design.path, role: "project context; fill gaps unless explicitly replaced" });
  if (hasValue(reference) && mode !== "reference-led") inheritedSources.push({ source: reference, role: "reference candidate; inspect before borrowing" });

  return {
    mode,
    label: MODE_LABELS[mode],
    source,
    confidence: mode === "adaptive-default" ? "provisional" : mode === "model-proposed" ? "proposed" : "strong",
    evidenceStatus: evidenceStatus(mode, { query, referenceInspected, referenceEvidence, design, acceptedConcept, creativeDirection, modelProposal }),
    query,
    policy: "hard-invariants-first; local aesthetic rules are advisory",
    canOverrideAdvisory: true,
    requiresOverrideRecord: explicitOverrides.length > 0,
    overrideRecordStatus: explicitOverrides.length > 0 ? "recorded" : "available-if-an-advisory-default-is-overridden",
    creativeFreedom: "open-with-proof",
    nextDecision: mode === "adaptive-default"
      ? "Run a creative divergence check before implementation. If a stronger visual thesis appears, promote it to model-proposed or reference-led instead of preserving the local default for consistency."
      : "Implement the authority source first. Use local candidates only for missing fields, and record only the advisory defaults that are intentionally overridden.",
    hardInvariants: POLICY.hardInvariants,
    advisoryDefaults: POLICY.advisoryDefaults,
    precedence: POLICY.authorityOrder,
    inheritedSources,
    projectDesign: design,
    creativeDirection: text(creativeDirection) || null,
    activeOverrides: explicitOverrides,
    overrideProtocol: POLICY.overrideProtocol,
    note: mode === "adaptive-default"
      ? "Use the local direction as a provisional starting point. A stronger reference, concept, project DESIGN.md, or model proposal may replace it."
      : "Preserve hard invariants, but let this authority source define the visual language. Local anti-AI checks are warnings, not style law.",
  };
}

export function advisoryChecks(directionChecks = [], treatmentChecks = []) {
  return [
    ...directionChecks.map((check) => ({ source: "visual direction", check, status: "advisory" })),
    ...treatmentChecks.map((check) => ({ source: "visual treatment", check, status: "advisory" })),
  ];
}

export function renderAuthorityMarkdown(authorityRecord, { includeChecks = true } = {}) {
  if (!authorityRecord) return "- Authority not resolved.";
  const invariantLines = (authorityRecord.hardInvariants ?? []).map((item) => `- **${item.label}**: ${item.rule}`).join("\n") || "- None recorded.";
  const overrideLines = authorityRecord.activeOverrides?.length > 0
    ? authorityRecord.activeOverrides.map((item) => `- **${item.rule}**: ${item.reason} Evidence: ${item.evidence} Risk: ${item.risk} Proof: ${item.proof}`).join("\n")
    : "- No active override recorded; keep the default direction provisional until stronger evidence appears.";
  const fields = (authorityRecord.overrideProtocol?.fields ?? []).join("; ");
  return `## Constraint Authority

- Mode: **${authorityRecord.label}** (${authorityRecord.confidence})
- Source: **${authorityRecord.source}**
- Evidence: **${authorityRecord.evidenceStatus}**
- Policy: ${authorityRecord.policy}
- Creative freedom: **${authorityRecord.creativeFreedom ?? "open-with-proof"}**
- Advisory defaults may be overridden: **${authorityRecord.canOverrideAdvisory ? "yes" : "no"}**
- Override record: **${authorityRecord.overrideRecordStatus ?? (authorityRecord.requiresOverrideRecord ? "required" : "available when needed")}**
- Note: ${authorityRecord.note}
- Next decision: ${authorityRecord.nextDecision ?? "keep the strongest evidenced direction"}

### Hard Invariants

${invariantLines}

### Override Record

Required fields: ${fields || "source, reason, evidence, risk, preserved invariants, rendered proof"}

${overrideLines}
${includeChecks ? `
### Local Defaults (Advisory)

- These are smell detectors and starting points, not universal style bans.
- A deliberate exception is healthy when the authority source and render proof are stronger than the default heuristic.
` : ""}`;
}
