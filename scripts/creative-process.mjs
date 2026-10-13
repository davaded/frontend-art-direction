import { readFileSync } from "node:fs";
import { validateProductSignalProposal } from "./product-signal.mjs";

const DIRECTION_FIELDS = [
  "id", "label", "signature", "firstViewport", "layoutRules", "typeRules",
  "spacingRules", "surfaceRules", "geometryRules", "contentRules", "renderChecks",
  "antiAiChecks", "visualTreatment", "compositionPlan",
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
    if (![...DIRECTION_FIELDS, "rationale", "build", "productSignal"].includes(key)) throw new Error(`Unsupported authored direction field: ${key}`);
  }
  for (const key of ["label", "signature", "rationale"]) requireText(value[key], `authoredDirection.${key}`);
  if (!isObject(value.firstViewport)) throw new Error("authoredDirection.firstViewport must describe the chosen composition");
  requireText(value.firstViewport.layout, "authoredDirection.firstViewport.layout");
  requireText(value.firstViewport.dominant, "authoredDirection.firstViewport.dominant");
  if (value.compositionPlan !== undefined) validateCompositionPlan(value.compositionPlan);
  if (value.productSignal !== undefined) validateProductSignalProposal(value.productSignal);
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
      if (!(key in base) && !path.startsWith("build.tokenSeed")) {
        const hint = path === "direction.visualTreatment" && key === "motion"
          ? " Put motion behavior in build.motionContract (review, apply, polish, reducedMotion and fallback)."
          : "";
        throw new Error(`Unknown field: ${path}.${key}. Supported fields: ${Object.keys(base).join(", ")}.${hint}`);
      }
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
  const patch = Object.fromEntries(DIRECTION_FIELDS.filter((key) => key !== "compositionPlan" && authored[key] !== undefined).map((key) => [key, authored[key]]));
  const resolved = mergeVisualContract(candidate, { ...patch, id: authored.id ?? "authored-direction" });
  return {
    ...resolved,
    compositionPlan: authored.compositionPlan
      ? buildCompositionPlan(authored.compositionPlan)
      : candidate.compositionPlan ?? buildCompositionPlan(),
    authoredBuild: authored.build ?? null,
    authoredProductSignal: authored.productSignal ?? null,
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

function validateCompositionPlan(plan) {
  if (!isObject(plan) || !Array.isArray(plan.regions)) throw new Error("compositionPlan.regions must be an array");
  for (const key of Object.keys(plan)) {
    if (!["regions", "optionalRegions", "notes", "selectedHypothesis", "hypotheses", "guardrails", "spatialBudget", "spaceChoreography"].includes(key)) throw new Error(`Unsupported compositionPlan field: ${key}`);
  }
  if (plan.notes !== undefined) requireText(plan.notes, "compositionPlan.notes");
  if (plan.selectedHypothesis !== undefined) requireText(plan.selectedHypothesis, "compositionPlan.selectedHypothesis");
  validateCompositionRegions(plan.regions, "compositionPlan.regions");
  if (plan.optionalRegions !== undefined) validateCompositionRegions(plan.optionalRegions, "compositionPlan.optionalRegions");
  if (plan.guardrails !== undefined) validateCompositionGuardrails(plan.guardrails, "compositionPlan.guardrails");
  if (plan.spatialBudget !== undefined) validateSpatialBudget(plan.spatialBudget, "compositionPlan.spatialBudget");
  if (plan.spaceChoreography !== undefined) validateSpaceChoreography(plan.spaceChoreography, "compositionPlan.spaceChoreography");
  if (plan.hypotheses !== undefined) {
    if (!Array.isArray(plan.hypotheses)) throw new Error("compositionPlan.hypotheses must be an array");
    for (const [index, hypothesis] of plan.hypotheses.entries()) {
      if (!isObject(hypothesis)) throw new Error(`compositionPlan.hypotheses[${index}] must be an object`);
      for (const key of ["id", "label", "thesis", "bestFor", "tradeoff", "wide", "narrow"]) {
        requireText(hypothesis[key], `compositionPlan.hypotheses[${index}].${key}`);
      }
      if (hypothesis.regions !== undefined) validateCompositionRegions(hypothesis.regions, `compositionPlan.hypotheses[${index}].regions`);
      if (hypothesis.optionalRegions !== undefined) validateCompositionRegions(hypothesis.optionalRegions, `compositionPlan.hypotheses[${index}].optionalRegions`);
    }
  }
  return plan;
}

function validateCompositionRegions(regions, path) {
  if (!Array.isArray(regions)) throw new Error(`${path} must be an array`);
  const fields = ["region", "placement", "textAlignment", "measure", "relation", "space", "priority", "scope", "wide", "intermediate", "narrow", "occupancy", "field", "surface", "pause", "geometry"];
  for (const [index, region] of regions.entries()) {
    if (!isObject(region)) throw new Error(`compositionPlan.regions[${index}] must be an object`);
    requireText(region.region, `${path}[${index}].region`);
    for (const [key, value] of Object.entries(region)) {
      if (!fields.includes(key)) throw new Error(`Unsupported composition region field: ${path}[${index}].${key}`);
      if (key === "geometry") {
        validateRegionGeometry(value, `${path}[${index}].geometry`);
        continue;
      }
      requireText(value, `${path}[${index}].${key}`);
    }
  }
}

function validateCompositionGuardrails(value, path) {
  if (!isObject(value)) throw new Error(`${path} must be an object`);
  const stringFields = ["wide", "intermediate", "narrow", "fullBleedPolicy", "counterfield", "override"];
  const listFields = ["alignmentSequence", "measureSequence", "fieldSequence", "checks"];
  for (const key of [...stringFields, ...listFields]) {
    if (value[key] === undefined) continue;
    if (listFields.includes(key)) {
      if (!Array.isArray(value[key]) || value[key].some((item) => typeof item !== "string")) throw new Error(`${path}.${key} must be an array of strings`);
    } else {
      requireText(value[key], `${path}.${key}`);
    }
  }
}

function validateSpatialBudget(value, path) {
  if (!isObject(value)) throw new Error(`${path} must be an object`);
  const textFields = ["status", "wide", "intermediate", "narrow", "fullBleedLimit", "counterfield", "override"];
  const listFields = ["occupancy", "checks"];
  for (const key of [...textFields, ...listFields]) {
    if (value[key] === undefined) continue;
    if (listFields.includes(key)) {
      if (!Array.isArray(value[key]) || value[key].some((item) => typeof item !== "string")) throw new Error(`${path}.${key} must be an array of strings`);
    } else {
      requireText(value[key], `${path}.${key}`);
    }
  }
}

function validateSpaceChoreography(value, path) {
  if (!isObject(value)) throw new Error(`${path} must be an object`);
  const textFields = ["status", "selectedHypothesis", "wide", "intermediate", "narrow", "counterfield", "fullBleedLimit", "override"];
  const listFields = ["anchorSequence", "measureSequence", "fieldSequence", "densitySequence", "counterfieldRegions", "fullBleedRegions", "checks"];
  for (const key of [...textFields, ...listFields]) {
    if (value[key] === undefined) continue;
    if (listFields.includes(key)) {
      if (!Array.isArray(value[key]) || value[key].some((item) => typeof item !== "string")) throw new Error(`${path}.${key} must be an array of strings`);
    } else {
      requireText(value[key], `${path}.${key}`);
    }
  }
  if (value.sequence === undefined) return;
  if (!Array.isArray(value.sequence)) throw new Error(`${path}.sequence must be an array`);
  const fields = ["region", "anchor", "measure", "field", "density", "mobile", "pause", "occupancy"];
  for (const [index, step] of value.sequence.entries()) {
    if (!isObject(step)) throw new Error(`${path}.sequence[${index}] must be an object`);
    for (const key of Object.keys(step)) {
      if (!fields.includes(key)) throw new Error(`Unsupported space choreography field: ${path}.sequence[${index}].${key}`);
      requireText(step[key], `${path}.sequence[${index}].${key}`);
    }
  }
}

const REGION_GEOMETRY_FIELDS = ["anchor", "measure", "field", "density", "mobile"];

function validateRegionGeometry(value, path) {
  if (!isObject(value)) throw new Error(`${path} must be an object`);
  for (const key of Object.keys(value)) {
    if (!REGION_GEOMETRY_FIELDS.includes(key)) throw new Error(`Unsupported field: ${path}.${key}`);
    requireText(value[key], `${path}.${key}`);
  }
  for (const key of REGION_GEOMETRY_FIELDS) {
    requireText(value[key], `${path}.${key}`);
  }
}

const COMPOSITION_HYPOTHESIS_FRAMES = [
  {
    id: "subject-led",
    label: "Subject-led silhouette",
    thesis: "Let one real object, task, or piece of evidence own the first read; use one quiet counterfield and a compact ending.",
    bestFor: "object, product, media, specimen, or a single focused task",
    tradeoff: "Supporting explanation must earn its place beside or after the subject.",
    wide: "Grow the surrounding field and object stage independently; keep prose and controls bounded.",
    narrow: "Keep the subject first, then move explanation and actions into its reading order.",
  },
  {
    id: "open-field",
    label: "Open-field sequence",
    thesis: "Use changes in scale, pause, and local alignment to create chapters without stacking equal full-width bands.",
    bestFor: "editorial, narrative, campaign, art, or image-led work",
    tradeoff: "The page needs real material and a deliberate ending; empty space cannot be used as filler.",
    wide: "Leave the viewport field visible around bounded chapters and let only the subject earn full bleed.",
    narrow: "Keep short claims free to center, while prose and evidence return to a readable start edge.",
  },
  {
    id: "attached-relationship",
    label: "Attached relationship",
    thesis: "Keep an action, explanation, or index attached to the object it changes or explains, then collapse that relationship explicitly.",
    bestFor: "workbenches, data, comparison, configuration, and inspectable workflows",
    tradeoff: "The attachment must be local; a global rail or panel wall would recreate the same template problem.",
    wide: "Align the attached region to the object's edge and reserve a counterfield instead of filling the viewport.",
    narrow: "Turn the attachment into a sheet, tab, inline group, or next reading step before it becomes cramped.",
  },
];

function normalizedTokens(value) {
  return String(value ?? "").toLocaleLowerCase().split(/[^\p{L}\p{N}]+/u).filter(Boolean);
}

function includesSignal(tokens, values) {
  return tokens.some((token) => values.some((value) => token === value || (token.endsWith("s") && token.slice(0, -1) === value) || (value.endsWith("s") && value.slice(0, -1) === token)));
}

function rankCompositionHypotheses(options = {}) {
  const query = normalizedTokens(`${options.query ?? ""} ${options.productRequest?.selectionQuery ?? ""}`);
  const directionId = options.direction?.id ?? options.directionId ?? "adaptive-asymmetric";
  const scores = new Map(COMPOSITION_HYPOTHESIS_FRAMES.map((frame) => [frame.id, 0]));
  const add = (id, amount) => scores.set(id, (scores.get(id) ?? 0) + amount);
  if (["object-led-editorial", "spatial-inspection", "specimen-catalog"].includes(directionId)) add("subject-led", 4);
  if (["narrative-chapters"].includes(directionId)) add("open-field", 4);
  if (["rail-canvas-workbench", "data-detail-workbench", "stateful-instrument"].includes(directionId)) add("attached-relationship", 4);
  if (includesSignal(query, ["editorial", "publication", "journal", "magazine", "essay", "story", "narrative", "campaign", "film", "cinema", "archive", "电影", "影像", "文章", "叙事"])) add("open-field", 3);
  if (includesSignal(query, ["tool", "workbench", "dashboard", "data", "table", "configure", "compare", "editor", "工具", "工作台", "数据", "配置", "对比"])) add("attached-relationship", 3);
  if (includesSignal(query, ["object", "product", "media", "image", "specimen", "gallery", "device", "产品", "媒体", "图片", "样本", "设备"])) add("subject-led", 2);
  return [...scores.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([id, score]) => ({ id, score }));
}

function regionDensity(region) {
  const dominant = region.priority === "dominant";
  const resolution = region.priority === "resolution";
  return {
    occupancy: dominant ? "bounded by the object's natural measure; full bleed only when the subject earns it" : resolution ? "contracted to the actual handoff" : "bounded content measure with a visible counterfield",
    field: "keep the viewport field visible around this region; do not create a full-width band by default",
    surface: dominant ? "one subject stage or open field; avoid an extra wrapper around the stage" : "open surface or tonal shift; add a boundary only when it carries a real semantic job",
    pause: region.space,
    intermediate: dominant ? "protect the dominant object; narrow its counterfield and release secondary copy before shrinking the object" : resolution ? "contract to the actual handoff and keep it in the current reading order" : "remove optional side gaps, then regroup this region around its local edge",
  };
}

function regionGeometry(region) {
  const regionName = String(region.region ?? "").toLocaleLowerCase();
  const name = `${regionName} ${region.placement ?? ""}`.toLocaleLowerCase();
  // A title rail can point at an object without becoming the object stage itself.
  // Classify the named region before reading descriptive placement text.
  const isOpening = /entry|opening|orientation|overview|context bar/.test(regionName);
  const isObject = !isOpening && !/proof text|prose/.test(region.measure ?? "") && /object|stage|canvas|instrument|data object|subject|specimen|proof|media|painting|work/.test(regionName);
  const isUtility = /rail|inspector|control|detail|caption|source|index|definition|context|feedback|action/.test(regionName);
  const isPause = /breathing|continuation|ending|fallback|history|definition|pause|note/.test(regionName);
  const placement = String(region.placement ?? "").toLocaleLowerCase();
  const anchor = /^centered\b/.test(placement) ? "center"
    : /end edge|end-attached|local end edge/.test(placement) ? "local-end"
    : /start edge|start-aligned|offset/.test(placement) ? "local-start"
    : region.textAlignment === "center" ? "center" : region.textAlignment === "end" ? "local-end" : "local-start";
  const measure = isObject ? "intrinsic-object" : isPause ? "compact" : isUtility ? "utility" : "reading";
  let field = isObject ? "inset-stage" : isUtility ? "attached-local" : isPause ? "open-pause" : "bounded-reading";
  if (isOpening) field = "open-field";
  if (/full[- ]?bleed|full[- ]?field/.test(name)) field = "earned-bleed";
  const density = isPause ? "quiet" : region.priority === "dominant" ? "focused" : "supporting";
  const mobile = isObject ? "preserve-then-stack" : isUtility ? "attach-then-collapse" : isPause ? "keep-pause" : "normal-flow";
  return { anchor, measure, field, density, mobile };
}

function enrichGeneratedRegions(regions) {
  return regions.map((region) => ({ ...region, ...regionDensity(region), geometry: regionGeometry(region) }));
}

function regionKind(region) {
  const regionName = String(region.region ?? "").toLocaleLowerCase();
  if (/entry|opening|orientation|overview|context bar/.test(regionName)) return "reading";
  if (region.priority === "resolution" || /ending|fallback|return|export|next action|handoff/.test(regionName)) return "resolution";
  if (region.priority === "dominant" || /object|stage|canvas|instrument|subject|specimen|data object|media|painting|work/.test(regionName)) return "dominant";
  if (/breathing|continuation|pause|history|note|definition/.test(regionName)) return "pause";
  if (/rail|inspector|control|detail|caption|source|index|context|feedback|action/.test(regionName)) return "utility";
  return "reading";
}

function transformHypothesisRegions(regions, hypothesisId) {
  return regions.map((region) => {
    const kind = regionKind(region);
    const next = { ...region };
    if (hypothesisId === "subject-led") {
      if (kind === "dominant" && region.geometry?.measure === "intrinsic-object") {
        next.placement = "bounded subject stage with a quiet counterfield";
        next.textAlignment = "center";
        next.geometry = { ...region.geometry, anchor: "center", field: "inset-stage", density: "focused" };
      } else if (kind === "utility") {
        next.placement = "attached to the subject's local end edge";
        next.geometry = { ...region.geometry, anchor: "local-end", field: "attached-local", density: "supporting" };
      } else if (kind === "resolution") {
        next.placement = "centered compact handoff in an open field";
        next.textAlignment = "center";
        next.geometry = { ...region.geometry, anchor: "center", field: "open-pause", measure: "compact" };
      }
      next.intermediate = kind === "dominant"
        ? "preserve the subject stage first; move metadata and tools below it before reducing the subject"
        : next.intermediate;
    }
    if (hypothesisId === "open-field") {
      if (kind === "dominant") {
        next.placement = "open field with one earned object edge";
        next.textAlignment = region.region.toLocaleLowerCase().includes("opening") || region.region.toLocaleLowerCase().includes("entry") ? "center" : "start";
        next.geometry = { ...region.geometry, anchor: next.textAlignment === "center" ? "center" : "local-start", field: region.geometry?.measure === "intrinsic-object" ? "earned-bleed" : "open-field" };
      } else if (kind === "pause") {
        next.placement = "quiet counterfield at the local end edge";
        next.textAlignment = "end";
        next.geometry = { ...region.geometry, anchor: "local-end", field: "open-pause", density: "quiet" };
      } else if (kind === "resolution") {
        next.placement = "start edge with a bounded handoff";
        next.textAlignment = "start";
        next.geometry = { ...region.geometry, anchor: "local-start", field: "bounded-reading" };
      }
      next.intermediate = kind === "dominant"
        ? "change the chapter relationship or crop before narrowing the main field"
        : kind === "pause"
          ? "remove the side note if it crowds the chapter; keep the pause in normal flow"
          : next.intermediate;
    }
    if (hypothesisId === "attached-relationship") {
      if (kind === "dominant") {
        next.placement = "bounded work object with a local datum";
        next.textAlignment = "start";
        next.geometry = { ...region.geometry, anchor: "local-start", field: "inset-stage" };
      } else if (kind === "utility") {
        next.placement = "end-attached to the object it changes or explains";
        next.geometry = { ...region.geometry, anchor: "local-end", field: "attached-local", measure: "utility" };
      } else if (kind === "pause") {
        next.placement = "centered compact pause";
        next.textAlignment = "center";
        next.geometry = { ...region.geometry, anchor: "center", field: "open-pause", measure: "compact" };
      }
      next.intermediate = kind === "utility"
        ? "collapse the attachment into a sheet, tab, or inline group before the object loses its measure"
        : next.intermediate;
    }
    return next;
  });
}

function buildCompositionGuardrails(regions, selectedHypothesis = null) {
  const core = regions.filter((region) => region.scope !== "optional");
  const active = core.length > 0 ? core : regions;
  const alignmentSequence = active.map((region) => region.textAlignment).filter(Boolean);
  const measureSequence = active.map((region) => region.geometry?.measure ?? region.measure).filter(Boolean);
  const fieldSequence = active.map((region) => region.geometry?.field ?? region.field).filter(Boolean);
  const fullBleedRegions = active
    .filter((region) => /earned[- ]bleed|full[- ]bleed|full[- ]field/u.test(`${region.field ?? ""} ${region.geometry?.field ?? ""} ${region.placement ?? ""}`))
    .map((region) => region.region);
  const boundedRegions = active.filter((region) => !fullBleedRegions.includes(region.region) && (region.geometry?.measure ?? region.measure));
  return {
    status: "advisory-composition-budget",
    selectedHypothesis,
    alignmentSequence,
    measureSequence,
    fieldSequence,
    wide: "Let the page show more than one reading distance: keep at least one bounded measure and one visible counterfield when the subject does not earn continuous bleed; align each local region to the edge or center that explains its job.",
    intermediate: "Re-stage relationships before shrinking them: collapse optional candidates, change local alignment or crop, and keep the dominant object at its natural measure instead of compressing every region into one column.",
    narrow: "Stack by attention, not by source order alone: preserve short centered or end-attached cues where they help, return long prose to a readable start edge, and keep a quiet pause after the dominant object when it separates the next read.",
    fullBleedPolicy: fullBleedRegions.length > 0
      ? `Earned bleed candidates: ${fullBleedRegions.join(", ")}. Each must name the subject, crop, or interaction that requires the viewport edge.`
      : "No core region currently earns full bleed; keep the viewport field visible around the subject.",
    counterfield: boundedRegions.length > 0
      ? `Counterfield is available beside or around: ${boundedRegions.map((region) => region.region).join(", ")}. Preserve it when it frames, balances, or delays the next read.`
      : "Name an explicit counterfield before expanding every core region to the viewport edge.",
    checks: [
      "Do not use one global alignment axis when neighboring content has different jobs.",
      "Do not let the same shell, measure, and surface repeat for every region without evidence.",
      "A full-bleed region needs a subject-specific reason; otherwise bound it to its natural object or reading measure.",
      "At least one screenshot pass must inspect the whole-page silhouette at wide, intermediate, and narrow widths.",
    ],
    override: "These are visible design questions, not a mandatory style. An authored direction, inspected reference, or stronger model proposal may replace them when the rendered result proves the replacement.",
  };
}

function buildSpatialBudget(regions, selectedHypothesis = null) {
  const core = regions.filter((region) => region.scope !== "optional");
  const active = core.length > 0 ? core : regions;
  const fullBleed = active
    .filter((region) => /earned[- ]bleed|full[- ]bleed|full[- ]field/u.test(`${region.field ?? ""} ${region.geometry?.field ?? ""} ${region.placement ?? ""}`))
    .map((region) => region.region);
  const occupancy = active.map((region) => `${region.region}: ${region.geometry?.measure ?? region.measure ?? "natural measure"}; ${region.geometry?.density ?? "supporting"}; preserve ${region.space ?? "a visible counterfield"}`);
  const counterfieldRegions = active
    .filter((region) => !fullBleed.includes(region.region) || region.priority !== "dominant")
    .map((region) => region.region);
  return {
    status: "advisory-spatial-budget",
    selectedHypothesis,
    wide: "Keep at least one core region visibly inset or naturally bounded when the subject is not immersive. A useful starting range is 52-84% of the viewport for the dominant stage and 16-32% of quiet counterfield; replace the range when the object or reference proves a better measure.",
    intermediate: "At roughly tablet width, spend space on relationships rather than smaller copies: collapse a rail, recrop the object, or change the local alignment before letting every region claim the same track.",
    narrow: "Keep text on a 16-24px page gutter and a natural reading measure. Let only a legible subject or interaction earn edge-to-edge media; short claims may center while prose, metadata, and actions return to a start edge.",
    fullBleedLimit: fullBleed.length > 0
      ? `Default to one continuous full-bleed candidate at a time (${fullBleed.join(", ")}); each additional bleed needs a subject-specific continuation reason.`
      : "No core region is currently marked for full bleed; preserve a visible viewport field around the subject.",
    counterfield: counterfieldRegions.length > 0
      ? `Reserve a quiet field beside, below, or between: ${counterfieldRegions.join(", ")}. It may frame, balance, separate, or delay the next read.`
      : "Name a counterfield before allowing every core region to touch the viewport edges.",
    occupancy,
    checks: [
      "Do not let three consecutive core regions claim the viewport edge merely because their parent grid is full width.",
      "Do not use equal columns or equal vertical bands when the content has different reading distances.",
      "At narrow width, check the actual text gutter and the subject crop separately; no overflow does not prove comfort.",
      "Capture wide, intermediate, and narrow silhouettes before accepting a space budget.",
    ],
    override: "This is a review budget, not a layout quota. An authored direction, inspected reference, project-owned DESIGN.md, or stronger model proposal can override it when the rendered subject, crop, and continuation make the exception legible.",
  };
}

function buildSpaceChoreography(regions, selectedHypothesis = null) {
  const core = regions.filter((region) => region.scope !== "optional");
  const active = core.length > 0 ? core : regions;
  const sequence = active.map((region) => ({
    region: region.region,
    anchor: region.geometry?.anchor ?? region.textAlignment ?? "local-start",
    measure: region.geometry?.measure ?? region.measure ?? "natural-measure",
    field: region.geometry?.field ?? region.field ?? "chosen-field",
    density: region.geometry?.density ?? "supporting",
    mobile: region.geometry?.mobile ?? "re-stage-for-reading",
    pause: region.pause ?? region.space ?? "preserve the chosen pause",
    occupancy: region.occupancy ?? "preserve the chosen measure",
  }));
  const anchorSequence = sequence.map((step) => step.anchor);
  const measureSequence = sequence.map((step) => step.measure);
  const fieldSequence = sequence.map((step) => step.field);
  const densitySequence = sequence.map((step) => step.density);
  const fullBleedRegions = active
    .filter((region) => /earned[- ]bleed|full[- ]bleed|full[- ]field/u.test(`${region.field ?? ""} ${region.geometry?.field ?? ""} ${region.placement ?? ""}`))
    .map((region) => region.region);
  const counterfieldRegions = active
    .filter((region) => !fullBleedRegions.includes(region.region) || region.priority !== "dominant")
    .map((region) => region.region);
  return {
    status: "advisory-space-choreography",
    selectedHypothesis,
    sequence,
    anchorSequence,
    measureSequence,
    fieldSequence,
    densitySequence,
    counterfieldRegions,
    fullBleedRegions,
    wide: "Use the sequence as a spatial score: let each region keep its local anchor and natural measure, then leave the named counterfield visible before the next relationship enters.",
    intermediate: "Change the relationship before compressing it: collapse the attached edge, recrop the object, or move the pause into normal flow while preserving the sequence's dominant region.",
    narrow: "Re-stage the sequence for touch and reading. Keep short claims or deliberate cues centered only when they help; return prose, metadata, and actions to their local start edge and protect the page gutter.",
    counterfield: counterfieldRegions.length > 0
      ? `Keep space available around or between: ${counterfieldRegions.join(", ")}. Explain whether it frames, balances, separates, or delays the next read.`
      : "Name a counterfield before allowing every core region to touch the viewport edges.",
    fullBleedLimit: fullBleedRegions.length > 0
      ? `Treat ${fullBleedRegions.join(", ")} as earned bleed candidates only; each must name the subject, crop, or interaction that requires the edge.`
      : "No core region currently earns full bleed; keep the viewport field visible around the subject.",
    checks: [
      "Read the sequence by region, not by the page's outer grid; neighboring regions may use different anchors.",
      "Do not repeat the same measure, field, or density across the whole page without a subject-specific reason.",
      "A pause must separate, frame, balance, or delay something; remove decorative empty bands that do none of these.",
      "Capture wide, intermediate, and narrow silhouettes and compare the sequence after each responsive change.",
    ],
    override: "This is an executable review aid, not a style quota. An authored direction, inspected reference, or stronger model proposal may replace the sequence when the rendered subject makes the alternative legible.",
  };
}

function hypothesisSummary(regions) {
  const coreRegions = regions.filter((region) => region.scope !== "optional");
  const optionalRegions = regions.filter((region) => region.scope === "optional");
  const active = coreRegions.length > 0 ? coreRegions : regions;
  return {
    regions: coreRegions,
    optionalRegions,
    alignmentMix: [...new Set(active.map((region) => region.textAlignment).filter(Boolean))],
    geometryMix: [...new Set(active.map((region) => region.geometry?.field).filter(Boolean))],
    measureMix: [...new Set(active.map((region) => region.geometry?.measure).filter(Boolean))],
    densityMix: [...new Set(active.map((region) => region.geometry?.density).filter(Boolean))],
    guardrails: buildCompositionGuardrails(regions),
    spatialBudget: buildSpatialBudget(regions),
    spaceChoreography: buildSpaceChoreography(regions),
  };
}

function renderHypothesisSummary(hypothesis) {
  const regionMap = hypothesis.regions?.map((region) => `${region.region}:${region.textAlignment}/${region.geometry?.field ?? "field?"}/${region.geometry?.measure ?? "measure?"}`).join(" · ");
  const optionalMap = hypothesis.optionalRegions?.map((region) => `${region.region}:${region.textAlignment}/${region.geometry?.field ?? "field?"}/${region.geometry?.measure ?? "measure?"}`).join(" · ");
  const guardrails = hypothesis.guardrails;
  return `${hypothesis.thesis} Best for: ${hypothesis.bestFor} Tradeoff: ${hypothesis.tradeoff} Mix: ${hypothesis.alignmentMix?.join(", ") || "not recorded"}; fields: ${hypothesis.geometryMix?.join(", ") || "not recorded"}; measures: ${hypothesis.measureMix?.join(", ") || "not recorded"}. Core regions: ${regionMap || "not recorded"}. Optional candidates: ${optionalMap || "none"}. Alignment sequence: ${guardrails?.alignmentSequence?.join(" -> ") || "not recorded"}; field sequence: ${guardrails?.fieldSequence?.join(" -> ") || "not recorded"}`;
}

function buildHypotheses(options, selectedHypothesis, baseRegions) {
  const ranking = rankCompositionHypotheses(options);
  return ranking.map(({ id, score }) => {
    const frame = COMPOSITION_HYPOTHESIS_FRAMES.find((item) => item.id === id);
    const regions = transformHypothesisRegions(baseRegions, id);
    return { ...frame, score, ...hypothesisSummary(regions), guardrails: buildCompositionGuardrails(regions, id), spatialBudget: buildSpatialBudget(regions, id), spaceChoreography: buildSpaceChoreography(regions, id), selected: id === selectedHypothesis };
  });
}

const COMPOSITION_HYPOTHESES = {
  "adaptive-asymmetric": [
    ["entry", "start edge with an open counterfield", "start", "short claim plus one proof cue", "name the subject before utility", "keep one quiet side of the field empty so the first object has room to register", "dominant", "let the field grow before the copy measure; keep the next proof visible", "center only a short title when it improves the object; return prose and actions to the start edge"],
    ["primary object", "offset stage, never full width by default", "start", "the object's natural measure", "the dominant object carries the first proof", "leave a counterfield beside or below the object instead of filling the track", "dominant", "retain the object stage and let its edge set the local datum", "put the object first, then stack controls and explanation in its reading order"],
    ["explanation", "opposing edge or bounded reading block", "start", "45-70ch readable prose", "explain the object without competing with it", "separate the explanation with a pause, not a full-width rule", "support", "allow a different edge from the opening when the object needs counterweight", "join normal flow and remove vacant rail indentation"],
    ["continuation", "centered compact cue", "center", "one sentence, source cue, or action", "delay the next move without inventing a section", "treat empty space as a pause; omit the cue when the content has no next move", "support", "show only a small glimpse of the next relationship", "keep it short and close to the object or action it continues"],
    ["ending", "start edge with a compact return", "start", "source, index, or stable final state", "resolve the subject and hand off the next path", "let the ending contract instead of filling the viewport", "resolution", "return to a readable record or next action", "use a single column and preserve the final action's proximity"],
  ],
  "object-led-editorial": [
    ["opening", "offset title rail beside the object field", "start", "short object-specific claim", "the claim points at the real object", "keep one side quiet so the object is not trapped in a centered stack", "dominant", "let the media enter the viewport before the next chapter", "stack title and object with the object first when the crop is narrow"],
    ["object stage", "centered or naturally offset stage", "center", "natural media measure", "the object owns the visual weight", "frame the object with space instead of extra copy", "dominant", "preserve the crop and change scale rather than repeating a split", "keep the full object legible before secondary metadata"],
    ["proof chapter", "opposing edge or end-attached caption", "start", "bounded proof text", "translate the object into a concrete use or material fact", "change the reading edge to create rhythm", "support", "keep the caption near its evidence but away from the title rail", "collapse to one start edge and keep the proof next to the object"],
    ["detail", "start edge with a smaller object counterweight", "start", "40-66ch plus detail crop", "show the reason to inspect further", "allow the detail to sit smaller than the opening object", "support", "use a different crop or scale, never another identical hero", "move the detail above prose if the image is the proof"],
    ["ending", "centered compact index or return", "center", "collection or next action", "close the object story without a filler grid", "contract the final field around the actual handoff", "resolution", "leave the last action visibly connected to the object", "keep the return control reachable after the final media"],
  ],
  "narrative-chapters": [
    ["opening", "centered short claim in a broad field", "center", "one or two lines", "establish the thesis without consuming the whole page", "use broad silence as an intentional entrance", "dominant", "let the next proof relationship peek into the viewport", "center only the claim; start-align supporting copy"],
    ["proof", "start edge with media or artifact offset", "start", "bounded caption and explanation", "turn the claim into something inspectable", "keep the proof narrower than the field", "dominant", "change crop or scale from the opening", "place proof before explanation when the media carries the argument"],
    ["breathing space", "end-attached note or open pause", "end", "short note or none", "give the previous chapter time to settle", "this region may be mostly empty when the pause has a job", "counterweight", "do not fill a quiet chapter with cards", "remove the rail and keep only the useful note"],
    ["chapter", "asymmetric object and reading block", "start", "45-72ch prose", "change the reading relationship instead of repeating a module", "let the object and copy occupy different measures", "support", "allow the chapter to choose a new local edge", "reorder object, title, and copy around the real subject"],
    ["ending", "start edge with a compact continuation", "start", "source, index, or next action", "resolve the narrative and leave a usable handoff", "reduce scale at the end rather than adding a final band", "resolution", "keep the ending visibly related to the first subject", "make the handoff one column and touch-safe"],
  ],
  "rail-canvas-workbench": [
    ["context rail", "start edge rail or sheet trigger", "start", "compact navigation and status", "orient without competing with the work object", "keep the rail quiet and let the canvas breathe beside it", "support", "reserve stable width for navigation and collapse it deliberately", "become a sheet or indexed strip before the canvas"],
    ["work canvas", "centered bounded canvas in the available field", "start", "stable work-object bounds", "the active object is the product", "use gutters and a calm field instead of pane borders on every side", "dominant", "keep the canvas dimensions stable as state changes", "show the object first and move secondary tools below"],
    ["inspector", "end edge attached to the canvas", "start", "grouped controls or selected detail", "keep actions close to the object they affect", "use one local edge and open space rather than a boxed panel wall", "support", "align to the canvas edge, not the viewport edge", "become a bottom sheet, tab, or inline group"],
    ["feedback", "local to the changed object", "end", "one status, error, or confirmation", "make the result visible where the action happened", "reserve a small local pause for state feedback", "support", "avoid global toast choreography when local evidence is enough", "keep feedback in the same reading order as the action"],
    ["ending", "stable work state with a clear next action", "start", "saved, exported, or recoverable state", "leave the user with a known result", "do not invent a marketing footer for a tool", "resolution", "preserve selection and focus", "keep the final action reachable without reopening the rail"],
  ],
  "stateful-instrument": [
    ["orientation", "start edge with a compact state label", "start", "title, status, and one control", "tell the user what is active before motion begins", "leave a quiet field around the instrument", "support", "show the next state cue without crowding the instrument", "stack the label above the instrument"],
    ["instrument", "centered stage with a local control orbit", "center", "stable media, waveform, or live object bounds", "the changing state is the dominant object", "protect the stage from surrounding chrome", "dominant", "keep state changes inside a stable frame", "put controls below or beside the object in a touch-safe order"],
    ["state detail", "end edge or nearby reading block", "start", "specific status and recovery copy", "explain what changed and what can happen next", "do not stretch status copy to the full field", "support", "attach the detail to the instrument's active edge", "join it to the instrument before unrelated content"],
    ["history", "start edge indexed record", "start", "compact trace or recent events", "make continuity inspectable without a dashboard wall", "allow history to stay sparse when there is little to report", "support", "keep it subordinate to the current state", "collapse to the latest meaningful event"],
    ["fallback", "centered static final state or recovery action", "center", "one clear fallback", "keep the experience complete without motion or media", "use the pause to make recovery legible", "resolution", "show the final state even when animation is disabled", "place recovery immediately after the failed object"],
  ],
  "data-detail-workbench": [
    ["context bar", "start edge filter and freshness strip", "start", "compact controls and definitions", "frame the question the data answers", "keep filters from becoming a headline band", "support", "leave the data object visible in the first viewport", "wrap controls into an explicit filter path"],
    ["data object", "start-aligned table, chart, or map stage", "start", "full data relationship with readable columns", "the evidence is the dominant object", "use width for comparison and height for reading, not decoration", "dominant", "protect column identity and selected state", "prioritize the selected row or chart before secondary controls"],
    ["selected detail", "end edge attached to the selected object", "start", "bounded explanation and units", "answer the question behind the selection", "keep detail away from unrelated summary cards", "support", "align to the data object's edge", "move below the selected row or into a sheet"],
    ["definition", "centered compact note", "center", "one definition, source, or freshness cue", "make ambiguity resolvable without filling space", "omit it when labels already do the work", "support", "keep it smaller than the data object", "place it next to the relevant value"],
    ["ending", "start edge export, next query, or stable empty state", "start", "one next action or recovery", "close the decision loop", "keep the final state quiet and explicit", "resolution", "preserve filters and selection", "make the action reachable after the data result"],
  ],
  "spatial-inspection": [
    ["orientation", "start edge label with a centered subject cue", "start", "short context and one action", "explain what can be inspected", "leave the viewport field open around the subject", "support", "allow the subject to dominate before controls", "keep the cue above the object"],
    ["subject stage", "centered or off-axis spatial field", "center", "natural object or scene measure", "the subject is the visual anchor", "use negative space to reveal scale and depth", "dominant", "preserve the scene frame and interaction affordance", "prioritize the focal object and move tools below"],
    ["inspection controls", "end edge or local overlay", "end", "compact controls", "actions stay attached to the subject", "avoid building a control wall around the scene", "support", "keep controls outside the focal crop", "become a bottom sheet or local toolbar"],
    ["detail", "start edge explanatory block", "start", "readable note and source", "turn inspection into understanding", "let the detail be smaller than the stage", "support", "follow the subject's most useful view", "place it after the scene"],
    ["ending", "centered return or next view", "center", "one continuation action", "resolve the inspection path", "close around the next meaningful view", "resolution", "preserve the current subject identity", "keep the action close to the final state"],
  ],
  "specimen-catalog": [
    ["index", "start edge searchable index", "start", "categories, search, and selected identity", "help the user choose one object", "keep browsing chrome quieter than the specimen", "support", "reserve a stable index width", "become a menu or filter sheet"],
    ["specimen stage", "centered bounded specimen canvas", "center", "stable preview bounds", "one component owns the visual attention", "let the specimen breathe inside a calm stage", "dominant", "preserve the preview geometry between states", "show the specimen before source and metadata"],
    ["source actions", "end edge compact action dock", "end", "install, source, info, theme", "keep implementation actions near the selected specimen", "use a small local dock instead of multiple cards", "support", "align to the specimen stage", "become a bottom action dock"],
    ["anatomy", "start edge notes or state list", "start", "component parts and states", "make the specimen reusable and understandable", "allow empty space when the specimen is self-explanatory", "support", "show only the states that prove the job", "collapse into an indexed list"],
    ["ending", "centered compact related set", "center", "next specimen or source handoff", "continue browsing without a filler gallery", "use a small closing field", "resolution", "keep one next object visible", "return to the index or selected identity"],
  ],
};

const OPTIONAL_HYPOTHESIS_REGIONS = {
  "adaptive-asymmetric": new Set(["explanation", "continuation"]),
  "object-led-editorial": new Set(["proof chapter", "detail"]),
  "narrative-chapters": new Set(["breathing space", "chapter"]),
  "rail-canvas-workbench": new Set(["feedback"]),
  "stateful-instrument": new Set(["history"]),
  "data-detail-workbench": new Set(["definition"]),
  "spatial-inspection": new Set(["inspection controls"]),
  "specimen-catalog": new Set(["anatomy"]),
};

function generatedRegions(directionId) {
  const optional = OPTIONAL_HYPOTHESIS_REGIONS[directionId] ?? OPTIONAL_HYPOTHESIS_REGIONS["adaptive-asymmetric"];
  return (COMPOSITION_HYPOTHESES[directionId] ?? COMPOSITION_HYPOTHESES["adaptive-asymmetric"]).map(([region, placement, textAlignment, measure, relation, space, priority, wide, narrow]) => ({
    region,
    placement,
    textAlignment,
    measure,
    relation,
    space,
    priority,
    scope: optional.has(region) ? "optional" : "core",
    wide,
    narrow,
  }));
}

export function buildCompositionPlan(authored = null, options = {}) {
  if (authored) validateCompositionPlan(authored);
  const directionId = options.direction?.id ?? options.directionId ?? "adaptive-asymmetric";
  const baseRegions = options.generate ? enrichGeneratedRegions(generatedRegions(directionId)) : [];
  const generated = !authored && baseRegions.length > 0;
  const ranking = options.generate ? rankCompositionHypotheses(options) : [];
  const selectedHypothesis = authored?.selectedHypothesis ?? ranking[0]?.id ?? null;
  const selectedCandidates = authored ? [...authored.regions, ...(authored.optionalRegions ?? [])] : options.generate ? transformHypothesisRegions(baseRegions, selectedHypothesis) : [];
  const selectedSummary = hypothesisSummary(selectedCandidates);
  const regions = authored?.regions ?? selectedSummary.regions;
  const optionalRegions = authored?.optionalRegions ?? selectedSummary.optionalRegions;
  const hypotheses = authored?.hypotheses ?? (options.generate ? buildHypotheses(options, selectedHypothesis, baseRegions) : []);
  const guardrails = authored?.guardrails ?? buildCompositionGuardrails(selectedCandidates, selectedHypothesis);
  const spatialBudget = authored?.spatialBudget ?? buildSpatialBudget(selectedCandidates, selectedHypothesis);
  const spaceChoreography = authored?.spaceChoreography ?? buildSpaceChoreography(selectedCandidates, selectedHypothesis);
  return {
    status: authored?.regions.length ? "authored-plan-render-pending" : generated ? "generated-hypothesis-render-pending" : "region-decisions-required",
    policy: generated
      ? "This is an executable regional hypothesis derived from the subject signal and direction. Core regions describe the minimum relationship to render; optional candidates stay out until real content or interaction earns them. Keep mixed alignment only where neighboring content earns it; replace the hypothesis freely after reference inspection and the first render."
      : "Choose alignment and occupied width per region. Centered placement and centered text are separate decisions. A shared local datum is useful, never a site-wide alignment mandate. Neither mixed alignment nor asymmetry is compulsory.",
    regions,
    optionalRegions,
    notes: authored?.notes ?? null,
    selectedHypothesis,
    hypothesisSelection: {
      status: authored ? "authored" : ranking[0]?.score > 0 ? "signal-led-candidate" : "exploratory-fallback",
      basis: authored ? "Authored regional decisions take precedence."
        : ranking[0]?.score > 0 ? "Subject and direction signals rank a replaceable render candidate."
        : "No structural signal distinguishes the alternatives. Declaration order supplies a first exploration, not a design decision or an alignment requirement.",
    },
    hypotheses,
    alignmentMix: selectedSummary.alignmentMix,
    placementMix: [...new Set(selectedCandidates.map((region) => region.placement))],
    geometryMix: selectedSummary.geometryMix,
    measureMix: selectedSummary.measureMix,
    densityMix: selectedSummary.densityMix,
    guardrails,
    spatialBudget,
    spaceChoreography,
    decisions: [
      generated ? "Treat core regions as the minimum relationship to test and optional candidates as discardable; remove every candidate the actual scope does not need. Never implement the list merely because it exists." : "For each actual region, name placement, text alignment, readable/object measure, relation to its neighbors, and wide/narrow re-staging. Do not invent sections to fill a map.",
      "Distinguish viewport field, content shell, object stage, and reading measure. Bound each by its content; do not stretch everything when the viewport grows.",
      "Keep useful empty space: explain what it separates, frames, balances, or delays. Change widths and pauses when the content asks for a different reading distance. Empty space is an authored region, not an unfilled grid track.",
      "Compare the full page silhouette: avoid identical edge-to-edge bands or alternating pairs unless the actual sequence earns them.",
      "Implement each region's geometry tokens literally: anchor, measure, field, density, and mobile are construction decisions, not descriptive polish notes. A page is suspect when every region shares the same field or measure without evidence.",
      generated ? "Render the selected hypothesis and keep the other two as deliberate alternatives; if the first render is packed or interchangeable, change the structural hypothesis before polishing." : "If the rendered silhouette is packed or interchangeable, revise the regional relationships before polishing.",
    ],
    proof: "Inspect opening, middle, ending, and affected states at wide desktop, ordinary desktop, an intermediate width, and narrow mobile. Check actual viewport, loaded assets, line endings, occupied width, separation, and control/result proximity; no overflow alone does not prove comfort.",
    reference: "references/visual-composition.md",
  };
}

export function buildVisualIterationPlan() {
  return {
    status: "planned-not-executed",
    screenshotLoop: {
      sequence: ["capture actual render", "inspect visible defects", "change code or assets", "recapture and compare"],
      coverage: ["wide and ordinary desktop full scope", "intermediate-width composition", "target-mobile full scope", "opening, middle, and ending or relevant routes", "important state, transition, or fallback"],
      repairOrder: "Resolve incomplete scope, broken content, composition, hierarchy, and media before fine detail; preserve strengths and check regressions after each material change.",
    },
    imageLoop: {
      useWhen: "Use available image generation for an open visual thesis, a bland composition, or unsuitable media; direct code fixes remain appropriate for local defects.",
      sequence: ["inspect current screenshot or real brief", "generate or edit visual proposal", "inspect and select revision", "translate changes into code and usable assets", "capture actual render and compare"],
      inputs: "Current screenshot is the edit target when available; inspected references and user assets have explicit supporting roles.",
      execution: "The agent invokes the available built-in image tool, then records the proposal with image-proposal; this local command does not generate images or capture a browser.",
    },
    evidence: {
      acceptanceSource: "actual-render",
      generatedImageRole: "proposal-or-asset",
      ledger: "baseline capture -> observed defect -> selected proposal if used -> code/asset delta -> recapture -> resolved/open issues",
    },
    convergence: "Continue while material issues remain and a useful repair is available. If rounds plateau, replace the weak direction or missing asset; report real blockers and never claim acceptance from a plan or generated mockup.",
    reference: "references/visual-iteration.md; image-proposal journal",
  };
}

export function buildCreativeProcess({ authored = null, authority, candidate, compositionPlan = null }) {
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
    compositionPlan: compositionPlan ?? buildCompositionPlan(authored?.compositionPlan),
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

### Region Composition

- Status: **${process.compositionPlan.status}**
- Selection evidence: **${process.compositionPlan.hypothesisSelection?.status ?? "authored"}**; ${process.compositionPlan.hypothesisSelection?.basis ?? "Preserve the authored regional decisions."}
- Policy: ${process.compositionPlan.policy}
- Alignment mix: ${process.compositionPlan.alignmentMix?.join(", ") || "not recorded"}; placement mix: ${process.compositionPlan.placementMix?.join(", ") || "not recorded"}
${process.compositionPlan.selectedHypothesis ? `- Selected structural hypothesis: **${process.compositionPlan.selectedHypothesis}**; this is a render candidate, not a permanent layout rule.\n` : ""}${process.compositionPlan.hypotheses?.length ? `- Structural alternatives to compare:\n${process.compositionPlan.hypotheses.map((hypothesis) => `  - **${hypothesis.label}** (${hypothesis.id})${hypothesis.selected ? " · selected" : " · alternative"}: ${renderHypothesisSummary(hypothesis)}`).join("\n")}\n` : ""}
${process.compositionPlan.notes ? `- Authored notes: ${process.compositionPlan.notes}\n` : ""}- Geometry fields: ${process.compositionPlan.geometryMix?.join(", ") || "not recorded"}; measures: ${process.compositionPlan.measureMix?.join(", ") || "not recorded"}; density: ${process.compositionPlan.densityMix?.join(", ") || "not recorded"}
${process.compositionPlan.guardrails ? `- Composition budget: alignment ${process.compositionPlan.guardrails.alignmentSequence?.join(" -> ") || "not recorded"}; measures ${process.compositionPlan.guardrails.measureSequence?.join(" -> ") || "not recorded"}; fields ${process.compositionPlan.guardrails.fieldSequence?.join(" -> ") || "not recorded"}\n- Wide: ${process.compositionPlan.guardrails.wide}\n- Intermediate: ${process.compositionPlan.guardrails.intermediate}\n- Narrow: ${process.compositionPlan.guardrails.narrow}\n- Full-bleed policy: ${process.compositionPlan.guardrails.fullBleedPolicy}\n- Counterfield: ${process.compositionPlan.guardrails.counterfield}\n- Guardrail checks: ${(process.compositionPlan.guardrails.checks ?? []).join("; ")}\n- Creative override: ${process.compositionPlan.guardrails.override}\n` : ""}
${process.compositionPlan.spatialBudget ? `- Spatial budget: ${process.compositionPlan.spatialBudget.wide}\n- Intermediate space rule: ${process.compositionPlan.spatialBudget.intermediate}\n- Narrow space rule: ${process.compositionPlan.spatialBudget.narrow}\n- Full-bleed limit: ${process.compositionPlan.spatialBudget.fullBleedLimit}\n- Counterfield budget: ${process.compositionPlan.spatialBudget.counterfield}\n- Occupancy by region: ${(process.compositionPlan.spatialBudget.occupancy ?? []).join("; ")}\n- Spatial checks: ${(process.compositionPlan.spatialBudget.checks ?? []).join("; ")}\n- Spatial override: ${process.compositionPlan.spatialBudget.override}\n` : ""}
${process.compositionPlan.spaceChoreography ? `- Space choreography: ${process.compositionPlan.spaceChoreography.sequence?.map((step) => `${step.region}:${step.anchor}/${step.measure}/${step.field}/${step.density}`).join(" -> ") || "not recorded"}\n- Wide spatial score: ${process.compositionPlan.spaceChoreography.wide}\n- Intermediate spatial score: ${process.compositionPlan.spaceChoreography.intermediate}\n- Narrow spatial score: ${process.compositionPlan.spaceChoreography.narrow}\n- Counterfield regions: ${(process.compositionPlan.spaceChoreography.counterfieldRegions ?? []).join(", ") || "not recorded"}\n- Choreography checks: ${(process.compositionPlan.spaceChoreography.checks ?? []).join("; ")}\n- Choreography override: ${process.compositionPlan.spaceChoreography.override}\n` : ""}
${process.compositionPlan.regions.map((region) => `- **${region.region}** · core: ${Object.entries(region).filter(([key]) => key !== "region").map(([key, value]) => `${key}: ${isObject(value) ? JSON.stringify(value) : value}`).join("; ") || "details pending"}`).join("\n")}
${process.compositionPlan.optionalRegions?.length ? `- Optional candidates, implement only when earned:\n${process.compositionPlan.optionalRegions.map((region) => `  - **${region.region}**: ${Object.entries(region).filter(([key]) => key !== "region").map(([key, value]) => `${key}: ${isObject(value) ? JSON.stringify(value) : value}`).join("; ") || "details pending"}`).join("\n")}` : "- Optional candidates: none recorded."}
${process.compositionPlan.decisions.map((item) => `- ${item}`).join("\n")}
- Proof: ${process.compositionPlan.proof}
- Read: ${process.compositionPlan.reference}

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
