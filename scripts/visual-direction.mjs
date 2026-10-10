#!/usr/bin/env node

import { isMainModule, isUnderspecifiedRequest, loadDataset, meaningfulTokens, option, parseArgs, tokenize, writeOutput } from "./lib.mjs";
import { advisoryChecks, renderAuthorityMarkdown, resolveCreativeAuthority } from "./authority.mjs";
import { applyAuthoredDirection, buildCreativeProcess, readAuthoredDirection, renderCreativeProcess } from "./creative-process.mjs";
import { buildProductSignal, renderProductSignal } from "./product-signal.mjs";
import { buildCompletionContract, renderCompletionContract } from "./completion-contract.mjs";
import { renderProductContextStatus, resolveProductRequest } from "./product-context.mjs";
import { scanProject } from "./inspect-project.mjs";

const HELP = `visual-direction.mjs [options]

Resolve a concrete visual grammar before implementation. The output turns a
brief into an executable layout, type, spacing, surface, copy, and anti-AI
contract instead of another abstract style label.

Options:
  --query <text>         Product, screen, or implementation question
  --project <path>       Read PRODUCT.md and project-owned DESIGN.md
  --profile <id|text>    Product profile or surface mode
  --style <id|text>      Design stance
  --reference <id|text>  Named visual reference
  --direction <id>       Pin a local visual direction
  --treatment <id>       Pin a visual treatment / expression layer
  --concept <id>         Accept one adaptive concept frame
  --authority <mode>     adaptive|reference|project|artist|concept|model
  --creative-direction   Explicit visual direction supplied by the user/artist
  --direction-file <path> Authored JSON composition and optional build plan
  --reference-inspected  Mark the reference as inspected evidence
  --concept-accepted     Mark a generated concept as approved direction
  --model-proposed       Mark the direction as an evidence-backed model proposal
  --format md|json       Output format (default: md)
  --output <path>        Write the direction instead of stdout
`;

function textOf(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  return [value.id, value.label, value.surfaceMode, value.signature, value.family].filter(Boolean).join(" ");
}

function idOf(value) {
  if (!value) return "";
  return typeof value === "string" ? value : value.id ?? "";
}

const SIGNAL_BOOSTS = [
  {
    directionId: "stateful-instrument",
    tokens: ["ai", "agent", "assistant", "streaming", "thinking", "approval", "realtime", "audio", "video", "player", "voice", "代理", "流式", "思考", "审批", "实时", "播放"],
    boost: 28,
  },
  {
    directionId: "spatial-inspection",
    tokens: ["3d", "model", "viewer", "configurator", "vehicle", "camera", "webgl", "模型", "车辆", "配置器", "相机"],
    boost: 24,
  },
  {
    directionId: "data-detail-workbench",
    tokens: ["analytics", "monitoring", "table", "chart", "metrics", "research", "分析", "监控", "表格", "图表", "指标"],
    boost: 18,
  },
  {
    directionId: "object-led-editorial",
    tokens: ["hardware", "device", "product", "material", "launch", "peripheral", "硬件", "设备", "产品", "材质", "外设"],
    boost: 18,
  },
];

const DEFAULT_TREATMENT_ID = "quiet-editorial-studio";

const ADAPTIVE_CONCEPT_FRAMES = [
  {
    id: "open-field",
    label: "Open Field",
    directionId: "adaptive-asymmetric",
    treatmentId: "quiet-editorial-studio",
    thesis: "Let one subject or task occupy a continuous field while a small counterweight makes the next move legible.",
    structuralChange: "open field + offset object + visible continuation",
    chooseWhen: "the work needs breathing room, a strong subject, or a calm reading path",
  },
  {
    id: "object-story",
    label: "Object Story",
    directionId: "object-led-editorial",
    treatmentId: "material-object-studio",
    thesis: "Let the actual object, artifact, or material evidence carry the identity and reveal itself through changing crops and scale.",
    structuralChange: "stable object stage + changing crop + evidence chapters",
    chooseWhen: "the subject has physical form, material detail, or a visual artifact worth inspecting",
  },
  {
    id: "sequence-chapters",
    label: "Sequence Chapters",
    directionId: "narrative-chapters",
    treatmentId: "warm-humanist-editorial",
    thesis: "Make each section change the reading relationship so the page behaves like a sequence rather than a stack of modules.",
    structuralChange: "claim -> proof -> breathing space -> changed relationship",
    chooseWhen: "the work depends on story, people, a launch, a belief, or progressive disclosure",
  },
];

const DIVERGENCE_DIRECTION_ORDER = [
  "adaptive-asymmetric",
  "object-led-editorial",
  "narrative-chapters",
  "rail-canvas-workbench",
  "stateful-instrument",
  "data-detail-workbench",
  "spatial-inspection",
  "specimen-catalog",
];

const DIVERGENCE_TREATMENT_HINTS = {
  "adaptive-asymmetric": "quiet-editorial-studio",
  "object-led-editorial": "material-object-studio",
  "narrative-chapters": "warm-humanist-editorial",
  "rail-canvas-workbench": "ink-state-instrument",
  "stateful-instrument": "ink-state-instrument",
  "data-detail-workbench": "data-graphic-clarity",
  "spatial-inspection": "material-object-studio",
  "specimen-catalog": "specimen-graphic-system",
};

function buildAdaptiveConceptSet(directions, treatments, { selectedId = null, status = "selection-required" } = {}) {
  return {
    status,
    selected: selectedId,
    policy: "These are structural hypotheses, not product genres or a fixed skin. Choose from the real subject, content, and evidence; an authored direction may replace all of them.",
    candidates: ADAPTIVE_CONCEPT_FRAMES.map((frame) => {
      const direction = directions.find((item) => item.id === frame.directionId);
      const treatment = treatments.find((item) => item.id === frame.treatmentId);
      return {
        ...frame,
        direction: direction ? { id: direction.id, label: direction.label, signature: direction.signature, firstViewport: direction.firstViewport } : null,
        treatment: treatment ? { id: treatment.id, label: treatment.label, signature: treatment.signature, composition: treatment.composition, geometry: treatment.geometry } : null,
      };
    }),
  };
}

function conceptRecord(frame, direction, treatment, score = 0, matches = []) {
  return {
    id: frame.id,
    label: frame.label,
    directionId: direction?.id ?? frame.directionId,
    treatmentId: treatment?.id ?? frame.treatmentId,
    thesis: frame.thesis || direction?.signature || "A structural hypothesis derived from the current evidence.",
    structuralChange: frame.structuralChange || `${direction?.firstViewport?.layout ?? "change the composition"}; ${treatment?.composition ?? "change the material relationship"}`,
    chooseWhen: frame.chooseWhen || `the current query matches ${matches.join(", ") || "this direction"}`,
    score,
    matches,
    direction: direction ? { id: direction.id, label: direction.label, signature: direction.signature, firstViewport: direction.firstViewport } : null,
    treatment: treatment ? { id: treatment.id, label: treatment.label, signature: treatment.signature, composition: treatment.composition, geometry: treatment.geometry } : null,
  };
}

function buildRoutedConceptSet(query, directions, treatments, {
  profile = "",
  style = "",
  reference = "",
  queryTokens = [],
  contextTokens = [],
  selectedId = null,
  status = "selection-required",
} = {}) {
  const profileId = idOf(profile);
  const referenceId = idOf(reference);
  const ranked = directions
    .map((direction) => ({ direction, ...scoreDirection(direction, queryTokens, contextTokens, { profileId, referenceId }) }))
    .sort((left, right) => right.score - left.score || left.direction.id.localeCompare(right.direction.id));
  const rankedById = new Map(ranked.map((item) => [item.direction.id, item]));
  const selectedDirectionId = selectedId || ranked[0]?.direction.id;
  const relevant = ranked.filter((item) => item.score > 0 && item.direction.id !== selectedDirectionId);
  const fallback = DIVERGENCE_DIRECTION_ORDER
    .map((id) => rankedById.get(id))
    .filter((item) => item && item.direction.id !== selectedDirectionId);
  const pool = [rankedById.get(selectedDirectionId), ...relevant, ...fallback].filter(Boolean);
  const candidates = [];
  const usedDirections = new Set();
  const usedTreatments = new Set();
  for (const item of pool) {
    if (candidates.length >= 3 || usedDirections.has(item.direction.id)) continue;
    const hintedTreatment = DIVERGENCE_TREATMENT_HINTS[item.direction.id] ?? "";
    const treatment = selectVisualTreatment(query, { profile, style, direction: item.direction, adaptiveDefault: false, treatment: hintedTreatment });
    if (usedTreatments.has(treatment.id)) continue;
    candidates.push(conceptRecord({ id: item.direction.id, label: item.direction.label }, item.direction, treatment, item.score, [...new Set([...item.queryHits, ...item.contextHits])].slice(0, 6)));
    usedDirections.add(item.direction.id);
    usedTreatments.add(treatment.id);
  }
  return {
    status,
    selected: selectedId,
    policy: "These are query-aware structural hypotheses, not product genres or a fixed skin. Choose from the real subject, content, and evidence; an authored direction may replace all of them.",
    candidates,
  };
}

function scoreTreatment(treatment, queryTokens, contextTokens, { profileId, styleId, directionId } = {}) {
  const searchable = new Set(tokenize([
    treatment.id,
    treatment.label,
    ...(treatment.keywords ?? []),
    ...(treatment.directionIds ?? []),
    ...(treatment.profileIds ?? []),
    ...(treatment.styleIds ?? []),
    treatment.signature,
    treatment.geometry,
  ].join(" ")));
  const queryHits = queryTokens.filter((token) => searchable.has(token));
  const contextHits = contextTokens.filter((token) => searchable.has(token));
  let score = new Set(queryHits).size * 3 + new Set(contextHits).size;
  if (directionId && treatment.directionIds?.includes(directionId)) score += 28;
  if (profileId && treatment.profileIds?.includes(profileId)) score += 18;
  if (styleId && treatment.styleIds?.includes(styleId)) score += 16;
  return {
    score,
    queryHits: [...new Set(queryHits)],
    contextHits: [...new Set(contextHits)],
  };
}

function scoreDirection(direction, queryTokens, contextTokens, { profileId, referenceId } = {}) {
  const searchable = new Set(tokenize([
    direction.id,
    direction.label,
    ...(direction.keywords ?? []),
    ...(direction.profileIds ?? []),
    direction.signature,
  ].join(" ")));
  const queryHits = queryTokens.filter((token) => searchable.has(token));
  const contextHits = contextTokens.filter((token) => searchable.has(token));
  let score = new Set(queryHits).size * 3 + new Set(contextHits).size;
  const signalBoost = SIGNAL_BOOSTS.find((item) => item.directionId === direction.id);
  const signalHits = signalBoost
    ? queryTokens.filter((token) => signalBoost.tokens.includes(token))
    : [];
  if (signalBoost && signalHits.length > 0) score += signalBoost.boost;
  if (profileId && direction.profileIds?.includes(profileId)) score += 24;
  if (referenceId && ["rare-ui", "rewamp-ui", "magic-ui", "react-bits", "aceternity-ui", "obsidian-ui"].includes(referenceId) && direction.id === "specimen-catalog") score += 22;
  if (referenceId && ["apple-product", "bang-olufsen", "teenage-engineering", "logitech-mx", "elgato-creator-hardware", "framework-computer"].includes(referenceId) && direction.id === "object-led-editorial") score += 22;
  return {
    score,
    queryHits: [...new Set([...queryHits, ...signalHits])],
    contextHits: [...new Set(contextHits)],
  };
}

function confidence(score, explicit) {
  if (explicit) return "explicit";
  if (score >= 24) return "high";
  if (score >= 12) return "medium";
  return "provisional";
}

export function selectVisualTreatment(query = "frontend interface", {
  profile = "",
  style = "",
  direction = "",
  adaptiveDefault = false,
  treatment: requestedTreatment = "",
} = {}) {
  const treatments = loadDataset("visual-treatments.json").treatments;
  const profileId = idOf(profile);
  const styleId = idOf(style);
  const directionId = idOf(direction);
  const context = `${textOf(profile)} ${textOf(style)} ${textOf(direction)}`.trim();
  const underspecified = adaptiveDefault || (isUnderspecifiedRequest(query) && !context);
  const queryTokens = underspecified ? [] : meaningfulTokens(query);
  const contextTokens = underspecified ? [] : meaningfulTokens(context);
  const explicit = requestedTreatment ? treatments.find((item) => item.id === requestedTreatment) : null;
  const ranked = treatments
    .map((treatment) => ({ treatment, ...scoreTreatment(treatment, queryTokens, contextTokens, { profileId, styleId, directionId }) }))
    .sort((left, right) => right.score - left.score || left.treatment.id.localeCompare(right.treatment.id));
  const selected = explicit ?? (underspecified
    ? treatments.find((item) => item.id === DEFAULT_TREATMENT_ID)
    : ranked[0]?.treatment ?? treatments.find((item) => item.id === DEFAULT_TREATMENT_ID));
  const selectedScore = explicit ? 99 : ranked.find((item) => item.treatment.id === selected.id)?.score ?? 0;
  const selectedMatch = ranked.find((item) => item.treatment.id === selected.id);
  return {
    id: selected.id,
    label: selected.label,
    confidence: explicit ? "explicit" : underspecified ? "provisional" : confidence(selectedScore, false),
    mode: underspecified ? "adaptive" : "signal-led",
    matched: [...new Set([...(selectedMatch?.queryHits ?? []), ...(selectedMatch?.contextHits ?? [])])],
    signature: selected.signature,
    palette: selected.palette,
    typography: selected.typography,
    composition: selected.composition,
    material: selected.material,
    geometry: selected.geometry,
    signatureDevice: selected.signatureDevice,
    assetStrategy: selected.assetStrategy,
    expressionBudget: selected.expressionBudget,
    antiAiChecks: selected.antiAiChecks,
    renderChecks: selected.renderChecks,
    source: "data/visual-treatments.json",
  };
}

export function selectVisualDirection(query = "frontend interface", {
  profile = "",
  style = "",
  reference = "",
  adaptiveDefault = false,
  direction: requestedDirection = "",
  treatment: requestedTreatment = "",
  project = null,
  designMemory = null,
  authority = "",
  creativeDirection = "",
  referenceInspected = false,
  referenceEvidence = null,
  acceptedConcept = false,
  concept = "",
  modelProposal = false,
  overrides = [],
  authoredDirection = null,
  productRequest = null,
} = {}) {
  const request = productRequest ?? resolveProductRequest(query, project?.productContext, { profile: typeof profile === "object" ? profile.id : String(profile).split(/\s+/)[0] });
  const authorityQuery = request.routingQuery;
  query = request.selectionQuery;
  if (!profile && request.profile.record.id !== "adaptive-surface") profile = request.profile.record;
  const directions = loadDataset("visual-directions.json").directions;
  const treatments = loadDataset("visual-treatments.json").treatments;
  const profileId = idOf(profile);
  const referenceId = idOf(reference);
  const context = `${textOf(profile)} ${textOf(style)} ${textOf(reference)}`.trim();
  const underspecified = adaptiveDefault || (isUnderspecifiedRequest(query) && !context);
  const queryTokens = underspecified ? [] : meaningfulTokens(query);
  const contextTokens = underspecified ? [] : meaningfulTokens(context);
  const explicit = requestedDirection ? directions.find((item) => item.id === requestedDirection) : null;
  const fixedConcept = ADAPTIVE_CONCEPT_FRAMES.find((item) => item.id === concept);
  const directionConcept = directions.find((item) => item.id === concept);
  const requestedConcept = fixedConcept ?? (directionConcept ? { id: directionConcept.id, directionId: directionConcept.id, treatmentId: "", dynamic: true } : null);
  if (concept && !requestedConcept) throw new Error(`unknown adaptive concept: ${concept}`);
  const ranked = directions
    .map((direction) => ({ direction, ...scoreDirection(direction, queryTokens, contextTokens, { profileId, referenceId }) }))
    .sort((left, right) => right.score - left.score || left.direction.id.localeCompare(right.direction.id));
  const selected = explicit ?? (requestedConcept
    ? directions.find((item) => item.id === requestedConcept.directionId)
    : underspecified
    ? directions.find((item) => item.id === "adaptive-asymmetric")
    : ranked[0]?.direction ?? directions.find((item) => item.id === "adaptive-asymmetric"));
  const selectedScore = explicit ? 99 : ranked.find((item) => item.direction.id === selected.id)?.score ?? 0;
  const selectedMatch = ranked.find((item) => item.direction.id === selected.id);
  const candidateTreatment = selectVisualTreatment(query, {
    profile,
    style,
    direction: selected,
    adaptiveDefault: underspecified,
    treatment: requestedTreatment || requestedConcept?.treatmentId || "",
  });
  const constraintAuthority = resolveCreativeAuthority({
    query: authorityQuery,
    project,
    designMemory,
    reference: referenceId,
    referenceInspected,
    referenceEvidence,
    creativeDirection,
    authority: authority || (authoredDirection ? "model" : ""),
    acceptedConcept,
    modelProposal: modelProposal || Boolean(authoredDirection),
    requestedDirection,
    overrides,
  });
  const resolved = applyAuthoredDirection({ ...selected, visualTreatment: candidateTreatment }, authoredDirection);
  if (!authoredDirection && constraintAuthority.mode === "adaptive-default" && request.signalFields["primary-object"]) {
    resolved.firstViewport = { ...resolved.firstViewport, dominant: request.signalFields["primary-object"] };
  }
  const visualTreatment = resolved.visualTreatment;
  const conceptSet = !authoredDirection && constraintAuthority.mode === "adaptive-default"
    ? fixedConcept
      ? buildAdaptiveConceptSet(directions, treatments, { selectedId: requestedConcept?.id ?? null, status: requestedConcept ? "accepted" : "selection-required" })
      : buildRoutedConceptSet(query, directions, treatments, { profile, style, reference, queryTokens, contextTokens, selectedId: requestedConcept?.id ?? (underspecified ? null : selected.id), status: requestedConcept ? "accepted" : "selection-required" })
    : {
      status: "suppressed-by-authority",
      selected: null,
      policy: "An inspected reference, project direction, user direction, accepted concept, or model proposal owns the direction; local concept frames remain available only as gap-fill vocabulary.",
      candidates: [],
    };
  const creativeProcess = buildCreativeProcess({ authored: authoredDirection, authority: constraintAuthority, candidate: selected });
  const productSignal = buildProductSignal({
    query,
    profile: typeof profile === "object" ? profile : { id: idOf(profile), anchor: resolved.firstViewport.dominant },
    visualDirection: resolved,
    contextFields: request.signalFields,
  });
  const completionContract = buildCompletionContract({
    query,
    productSignal,
  });
  const directionLock = constraintAuthority.mode === "project-owned"
    ? `Respect ${constraintAuthority.source} as the project-owned visual authority. Use ${selected.label} only to fill fields the project direction does not define.`
    : authoredDirection
      ? `Implement ${resolved.label}: ${authoredDirection.rationale} Unspecified fields remain candidate suggestions; render proof is pending.`
      : requestedConcept
        ? `Implement accepted concept ${requestedConcept.label}: ${requestedConcept.thesis} Preserve the concept's structure while adapting it to the subject.`
      : `Derive the composition from ${constraintAuthority.mode === "adaptive-default" ? "the content and a creative exploration" : constraintAuthority.source}. ${selected.label} is gap-fill vocabulary; its layout, type sizes, radii, and signature are suggestions, not a chosen design.`;
  return {
    id: resolved.id,
    label: resolved.label,
    confidence: authoredDirection ? "proposed" : confidence(selectedScore, Boolean(explicit)),
    mode: authoredDirection ? "authored" : underspecified ? "adaptive" : "signal-led",
    selectionStatus: authoredDirection ? "authored-proposal" : requestedConcept ? "accepted-concept" : underspecified ? "provisional-concept-fallback" : "candidate",
    matched: [...new Set([...(selectedMatch?.queryHits ?? []), ...(selectedMatch?.contextHits ?? [])])],
    directionLock,
    firstViewport: resolved.firstViewport,
    layoutRules: resolved.layoutRules,
    typeRules: resolved.typeRules,
    spacingRules: resolved.spacingRules,
    surfaceRules: resolved.surfaceRules,
    geometryRules: resolved.geometryRules,
    contentRules: resolved.contentRules,
    antiAiChecks: resolved.antiAiChecks,
    advisoryChecks: advisoryChecks(selected.antiAiChecks, visualTreatment.antiAiChecks),
    renderChecks: resolved.renderChecks,
    signature: resolved.signature,
    authoredBuild: resolved.authoredBuild,
    creativeProcess,
    productSignal,
    productContext: project?.productContext ?? null,
    productRequest: request,
    completionContract,
    visualTreatment,
    conceptSet,
    constraintAuthority,
    source: authoredDirection ? "authored direction; local data fills missing fields" : "data/visual-directions.json",
  };
}

function bulletList(items) {
  return (items ?? []).map((item) => `- ${item}`).join("\n") || "- None recorded.";
}

export function renderVisualDirection(direction) {
  const map = (value) => Object.entries(value ?? {}).map(([key, item]) => `- **${key}**: ${item}`).join("\n");
  const treatment = direction.visualTreatment ?? {};
  const authority = direction.constraintAuthority;
  const advisory = direction.advisoryChecks?.length > 0
    ? direction.advisoryChecks.map((item) => `- **${item.source}**: ${item.check}`).join("\n")
    : bulletList(direction.antiAiChecks);
  return `# Visual Direction

Direction: **${direction.label}** (${direction.confidence})
Mode: **${direction.mode}**
Matched: ${direction.matched.join(", ") || "provisional evidence"}

Selection: **${direction.selectionStatus}**; confidence measures routing fit, not visual quality.

${direction.productContext ? renderProductContextStatus(direction.productContext) : ""}

${renderCreativeProcess(direction.creativeProcess)}

## Concept Set

- Status: **${direction.conceptSet?.status ?? "not recorded"}**
- Selected: **${direction.conceptSet?.selected ?? "none"}**
- Policy: ${direction.conceptSet?.policy ?? "not recorded"}
${(direction.conceptSet?.candidates ?? []).map((item) => `- **${item.label}** \`${item.id}\`: ${item.thesis} Choose when: ${item.chooseWhen}. Structure: ${item.structuralChange}.`).join("\n") || "- No adaptive concepts; an authority source owns the direction."}

${renderProductSignal(direction.productSignal)}

${renderCompletionContract(direction.completionContract)}

${renderAuthorityMarkdown(authority, { includeChecks: false })}

## Direction Lock

${direction.directionLock}

## Visual Treatment

- Stance: **${treatment.label ?? "not resolved"}** (${treatment.confidence ?? "unknown"})
- Signature: ${treatment.signature ?? "not recorded"}
- Palette: ${treatment.palette ?? "not recorded"}
- Typography: ${treatment.typography ?? "not recorded"}
- Composition: ${treatment.composition ?? "not recorded"}
- Material: ${treatment.material ?? "not recorded"}
- Geometry: ${treatment.geometry ?? "not recorded"}
- Signature device: ${treatment.signatureDevice ?? "not recorded"}
- Expression budget: ${treatment.expressionBudget ?? "not recorded"}

## First Viewport

${map(direction.firstViewport)}

## Layout Rules

${bulletList(direction.layoutRules)}

## Type Rules

${map(direction.typeRules)}

## Spacing Rules

${map(direction.spacingRules)}

## Surface Rules

${map(direction.surfaceRules)}

## Geometry Rules

${map(direction.geometryRules)}

## Content Rules

${bulletList(direction.contentRules)}

## AI-Default Checks (Advisory)

${advisory}

These checks are smell detectors, not universal style bans. A stronger authority source may deliberately override them when the override record and rendered proof are present.

## Render Checks

${bulletList(direction.renderChecks)}
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "frontend interface");
  const result = selectVisualDirection(query, {
    project: option(args, "project") ? scanProject(option(args, "project")) : null,
    profile: option(args, "profile", ""),
    style: option(args, "style", ""),
    reference: option(args, "reference", ""),
    direction: option(args, "direction", ""),
    treatment: option(args, "treatment", ""),
    authority: option(args, "authority", ""),
    creativeDirection: option(args, "creative-direction", ""),
    authoredDirection: readAuthoredDirection(option(args, "direction-file")),
    referenceInspected: Boolean(args.options["reference-inspected"]),
    acceptedConcept: Boolean(args.options["concept-accepted"]),
    concept: option(args, "concept", ""),
    modelProposal: Boolean(args.options["model-proposed"]),
    adaptiveDefault: Boolean(args.options.adaptive),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : renderVisualDirection(result), {
    format,
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) main();
