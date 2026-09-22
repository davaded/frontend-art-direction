#!/usr/bin/env node

import { isMainModule, isUnderspecifiedRequest, loadDataset, meaningfulTokens, option, parseArgs, tokenize, writeOutput } from "./lib.mjs";
import { advisoryChecks, renderAuthorityMarkdown, resolveCreativeAuthority } from "./authority.mjs";

const HELP = `visual-direction.mjs [options]

Resolve a concrete visual grammar before implementation. The output turns a
brief into an executable layout, type, spacing, surface, copy, and anti-AI
contract instead of another abstract style label.

Options:
  --query <text>         Product, screen, or implementation question
  --profile <id|text>    Product profile or surface mode
  --style <id|text>      Design stance
  --reference <id|text>  Named visual reference
  --direction <id>       Pin a local visual direction
  --treatment <id>       Pin a visual treatment / expression layer
  --authority <mode>     adaptive|reference|project|artist|concept|model
  --creative-direction   Explicit visual direction supplied by the user/artist
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
  modelProposal = false,
  overrides = [],
} = {}) {
  const directions = loadDataset("visual-directions.json").directions;
  const profileId = idOf(profile);
  const referenceId = idOf(reference);
  const context = `${textOf(profile)} ${textOf(style)} ${textOf(reference)}`.trim();
  const underspecified = adaptiveDefault || (isUnderspecifiedRequest(query) && !context);
  const queryTokens = underspecified ? [] : meaningfulTokens(query);
  const contextTokens = underspecified ? [] : meaningfulTokens(context);
  const explicit = requestedDirection ? directions.find((item) => item.id === requestedDirection) : null;
  const ranked = directions
    .map((direction) => ({ direction, ...scoreDirection(direction, queryTokens, contextTokens, { profileId, referenceId }) }))
    .sort((left, right) => right.score - left.score || left.direction.id.localeCompare(right.direction.id));
  const selected = explicit ?? (underspecified
    ? directions.find((item) => item.id === "adaptive-asymmetric")
    : ranked[0]?.direction ?? directions.find((item) => item.id === "adaptive-asymmetric"));
  const selectedScore = explicit ? 99 : ranked.find((item) => item.direction.id === selected.id)?.score ?? 0;
  const selectedMatch = ranked.find((item) => item.direction.id === selected.id);
  const visualTreatment = selectVisualTreatment(query, {
    profile,
    style,
    direction: selected,
    adaptiveDefault: underspecified,
    treatment: requestedTreatment,
  });
  const constraintAuthority = resolveCreativeAuthority({
    query,
    project,
    designMemory,
    reference: referenceId,
    referenceInspected,
    referenceEvidence,
    creativeDirection,
    authority,
    acceptedConcept,
    modelProposal,
    requestedDirection,
    overrides,
  });
  const directionLock = constraintAuthority.mode === "project-owned"
    ? `Respect ${constraintAuthority.source} as the project-owned visual authority. Use ${selected.label} only to fill fields the project direction does not define.`
    : constraintAuthority.mode === "adaptive-default"
      ? `Use ${selected.label} as a provisional visual hypothesis. A stronger reference, concept, project direction, or artist-led proposal may replace it.`
      : `Use ${selected.label} under ${constraintAuthority.label}; local AI-default checks remain advisory and may be overridden with evidence.`;
  return {
    id: selected.id,
    label: selected.label,
    confidence: confidence(selectedScore, Boolean(explicit)),
    mode: underspecified ? "adaptive" : "signal-led",
    matched: [...new Set([...(selectedMatch?.queryHits ?? []), ...(selectedMatch?.contextHits ?? [])])],
    directionLock: `${directionLock} Signature candidate: ${selected.signature}.`,
    firstViewport: selected.firstViewport,
    layoutRules: selected.layoutRules,
    typeRules: selected.typeRules,
    spacingRules: selected.spacingRules,
    surfaceRules: selected.surfaceRules,
    geometryRules: selected.geometryRules,
    contentRules: selected.contentRules,
    antiAiChecks: selected.antiAiChecks,
    advisoryChecks: advisoryChecks(selected.antiAiChecks, visualTreatment.antiAiChecks),
    renderChecks: selected.renderChecks,
    signature: selected.signature,
    visualTreatment,
    constraintAuthority,
    source: "data/visual-directions.json",
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
    profile: option(args, "profile", ""),
    style: option(args, "style", ""),
    reference: option(args, "reference", ""),
    direction: option(args, "direction", ""),
    treatment: option(args, "treatment", ""),
    authority: option(args, "authority", ""),
    creativeDirection: option(args, "creative-direction", ""),
    referenceInspected: Boolean(args.options["reference-inspected"]),
    acceptedConcept: Boolean(args.options["concept-accepted"]),
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
