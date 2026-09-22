#!/usr/bin/env node

import { resolve } from "node:path";
import { asNumber, isMainModule, loadDataset, meaningfulTokens, option, parseArgs, writeOutput } from "./lib.mjs";
import { scanProject } from "./inspect-project.mjs";
import { selectReferenceComposition } from "./reference-composition.mjs";
import { selectVisualDirection } from "./visual-direction.mjs";
import { renderAuthorityMarkdown } from "./authority.mjs";

const HELP = `reference-build.mjs [options]

Turn one sentence and an optional named reference into an implementation-ready
visual build contract. This command does not copy a site or edit a target app.
The agent uses the contract to implement and verify the target project.

Options:
  --query <text>         One-sentence product or redesign request
  --reference <id|url>   Explicit primary reference (optional)
  --project <path>       Optional target project to scan
  --profile <text>       Product profile or surface mode
  --style <text>         Candidate visual stance
  --motion <text>        Motion intent or grammar
  --authority <mode>     adaptive|reference|project|artist|concept|model
  --creative-direction   Explicit visual direction supplied by the user/artist
  --reference-inspected  Mark the reference as inspected evidence
  --concept-accepted     Mark a generated concept as approved direction
  --model-proposed       Mark the direction as an evidence-backed model proposal
  --format md|json       Output format (default: md)
  --output <path>        Write the contract instead of stdout
`;

const GENERIC_REFERENCE_TOKENS = new Set(["http", "https", "www", "com", "dev", "io", "ui"]);
const REFERENCE_SIGNAL = /https?:\/\/|like\s+|similar\s+to|inspired\s+by|based\s+on|\b(?:rare\s+ui|beautiful\s+ui|beui|magic\s+ui|react\s+bits|aceternity|obsidian\s+ui|bencho|design\s+spells|transitions|shadcn)\b|像|类似|参考|仿照|复刻/i;

const EXTERNAL_RECIPE = {
  archetype: "live-reference-adaptation",
  firstViewport: {
    layout: "reconstruct the observed first viewport hierarchy before adding lower-page detail",
    mustShow: ["the target product object", "the reference's primary visual relationship", "one usable action"],
    belowFoldPeek: "the next section or specimen that establishes the reference rhythm",
  },
  sections: [
    {
      id: "reference-first-viewport",
      purpose: "translate the observed reference hierarchy into the target product",
      layout: "match the reference's major regions while preserving target workflow and content",
      content: "real target content, data, and product object",
      components: ["local navigation", "primary object", "primary action", "reference-specific visual anchor"],
    },
    {
      id: "workflow-proof",
      purpose: "prove the target product instead of copying the source page",
      layout: "use the reference's section rhythm with target-specific specimens or workflow groups",
      content: "realistic states and evidence",
      components: ["stateful object", "supporting detail", "recovery or empty state"],
    },
  ],
  componentGrammar: [
    {
      id: "observed-reference-primitive",
      shape: "derive silhouette, spacing, surface, and interaction from the inspected reference; keep tokens source-owned",
      states: ["idle", "hover", "focus", "active", "loading", "reduced-motion"],
      behavior: "preserve target semantics and keep dimensions stable through state changes",
    },
  ],
  motionContract: {
    intensity: "inspect-first",
    triggers: ["only observed state relationships that help the target workflow"],
    review: "inspect the live reference and name the purpose before choosing an implementation",
    apply: "use local CSS, platform behavior, or an existing project primitive first",
    polish: "tune against rendered screenshots and remove motion that does not survive comparison",
    reducedMotion: "preserve the complete state and information hierarchy without travel",
    fallback: "the target surface remains usable and visually coherent without animation",
  },
  responsive: {
    desktop: "match the reference's major desktop hierarchy after inspecting the live page",
    tablet: "re-stage content where the reference changes density or navigation",
    mobile: "recompose for target input and reading order; do not shrink the desktop screenshot",
  },
  assetStrategy: {
    hero: "inspect the reference asset role, then use licensed target media or a restrained fallback",
    specimens: "use target product objects and deterministic states rather than copying source assets",
    fallback: "static final state, approved poster, or product-owned assetless fallback with explicit loading behavior",
  },
  tokenSeed: {
    canvas: "observed from live reference",
    surface: "observed from live reference",
    ink: "observed from live reference",
    accent: "observed from live reference",
    border: "observed from live reference",
    container: "measure from live reference first",
    radius: { nav: "measure", frame: "measure", specimen: "measure", control: "measure" },
    spacing: { pageDesktop: "measure", pageMobile: "measure", section: "measure", grid: "measure" },
    type: { displayDesktop: "measure", displayMobile: "measure", body: "measure", meta: "measure" },
    note: "unknown URL: do not invent visual values before inspecting the live reference",
  },
  buildOrder: ["inspect live reference", "target first viewport", "target workflow object", "responsive re-staging", "state behavior", "motion and polish"],
  acceptance: ["the borrowed visual relationship is visible in the rendered result", "target content and workflow remain distinct", "desktop and mobile hierarchy are coherent", "unknown reference values are replaced by inspected evidence"],
};

const ADAPTIVE_RECIPE = {
  archetype: "evidence-led-adaptive-surface",
  firstViewport: {
    layout: "compose one primary object or task, one clear action, and enough of the next proof/state to establish rhythm",
    mustShow: ["real target content or object", "one usable primary action", "the state or proof that follows next"],
    belowFoldPeek: "the next content, state, or interaction that gives the surface a reason to continue",
  },
  sections: [
    {
      id: "primary-surface",
      purpose: "establish the target's real object, task, or content hierarchy before styling a genre",
      layout: "choose the composition from content density, object importance, and input model",
      content: "real target content, data, media, or interaction; no invented domain template",
      components: ["local navigation", "primary object or task", "primary action", "state cue"],
    },
    {
      id: "proof-and-depth",
      purpose: "make the product's value legible through a working proof rather than decorative filler",
      layout: "follow the first viewport's hierarchy with one supporting proof relationship",
      content: "specific copy, realistic data, target media, or a deterministic working state",
      components: ["proof object", "supporting detail", "recovery or empty state"],
    },
    {
      id: "states-and-fallback",
      purpose: "make interaction, loading, error, reduced-motion, and final-state behavior inspectable",
      layout: "keep state changes local to the object that changes and preserve normal document flow",
      content: "trigger, response, final state, responsive behavior, and fallback",
      components: ["state label", "keyboard/touch path", "reduced-motion path", "static fallback"],
    },
  ],
  componentGrammar: [
    {
      id: "evidence-led-surface",
      shape: "derive silhouette, density, material, and hierarchy from the target evidence; do not preselect a dashboard, commerce, or editorial skin",
      states: ["idle", "hover", "focus", "active", "loading", "empty", "error", "reduced-motion", "fallback"],
      behavior: "keep the primary object and surrounding geometry stable while state changes",
    },
  ],
  motionContract: {
    intensity: "purposeful-by-job",
    triggers: ["only state, continuity, feedback, reveal, comparison, progress, or inspection relationships"],
    review: "run Review even when the user did not ask for animation; name the relationship before choosing a recipe",
    apply: "use the lightest local or platform mechanism that preserves the target's visual language",
    polish: "compare desktop, mobile, reduced-motion, and interrupted states; remove motion that does not improve comprehension",
    reducedMotion: "preserve the complete information hierarchy and final state without travel or looping",
    fallback: "the target surface remains usable and coherent with animation disabled or unavailable",
  },
  responsive: {
    desktop: "use the widest canvas to establish the primary relationship and expose the next proof",
    tablet: "reduce simultaneous regions and preserve the primary object/action pair",
    mobile: "recompose for touch and reading order; do not shrink a desktop composition into a narrow column",
  },
  assetStrategy: {
    hero: "use user-provided, existing/official, attributable, or target-specific generated media; otherwise use a complete assetless object-led composition",
    specimens: "prefer working target states and deterministic content over decorative screenshots",
    fallback: "static final state, approved poster, or product-owned assetless fallback with explicit loading and error behavior",
  },
  tokenSeed: {
    canvas: "derive from local tokens or target content",
    surface: "derive from local tokens or the primary object",
    ink: "derive from real copy and contrast requirements",
    accent: "one product-owned or semantic accent after hierarchy is stable",
    border: "use the smallest boundary that clarifies grouping",
    container: "measure from the target content and viewport",
    radius: { nav: "local tokens", frame: "local tokens", specimen: "local tokens", control: "local tokens" },
    spacing: { pageDesktop: "measure", pageMobile: "measure", section: "measure", grid: "measure" },
    type: { displayDesktop: "earn from content", displayMobile: "earn from content", body: "measure", meta: "measure" },
    note: "no named visual source; do not invent a reference palette or layout before the target evidence exists",
  },
  buildOrder: ["primary hierarchy", "real object/content", "state matrix", "responsive re-staging", "purposeful motion", "premium finish"],
  acceptance: ["the primary object or task is identifiable immediately", "the first viewport has a visible point of view without a forced genre", "one non-default state is complete", "desktop/mobile and reduced-motion paths remain coherent"],
};

const PRODUCT_RECIPE = {
  archetype: "object-first-product-story",
  firstViewport: {
    layout: "put the real product object, one concrete promise, and the next proof relationship in the first viewport",
    mustShow: ["the target product object or a target-specific generated asset", "one specific product promise", "one usable action or path to inspect more"],
    belowFoldPeek: "the first feature, material, workflow, or comparison proof rather than a decorative card wall",
  },
  sections: [
    {
      id: "object-first-hero",
      purpose: "establish object identity and the visual thesis before asking the user to compare or buy",
      layout: "use the inspected product reference's object-to-copy relationship while preserving normal document flow",
      content: "specific target product, material, use context, and one measurable or observable claim",
      components: ["product object", "compact navigation", "specific claim", "primary inspection or action path"],
    },
    {
      id: "feature-proof-chapters",
      purpose: "translate one product promise at a time into visible evidence",
      layout: "one idea per chapter with controlled object scale, supporting copy, and a clear next step",
      content: "real feature, material, performance, compatibility, or workflow proof",
      components: ["feature object", "evidence media or state", "short explanation", "supporting detail"],
    },
    {
      id: "comparison-and-path",
      purpose: "make configuration, compatibility, comparison, or purchase decisions legible after product understanding",
      layout: "late-stage comparison or decision surface that does not compete with the first product read",
      content: "target-specific variants, specs, constraints, and recovery or support path",
      components: ["comparison control", "specification group", "availability or compatibility state", "action"],
    },
    {
      id: "states-and-fallback",
      purpose: "keep media, interaction, reduced-motion, and failure behavior complete",
      layout: "preserve the product object and decision path when media or motion is unavailable",
      content: "loading, error, reduced-motion, keyboard/touch, and static final state",
      components: ["status text", "poster or static object", "keyboard/touch path", "recovery action"],
    },
  ],
  componentGrammar: [
    {
      id: "product-proof-surface",
      shape: "stable object-led frame with material contrast and enough room for the target product to remain legible",
      states: ["idle", "hover", "focus", "active", "loading", "error", "reduced-motion", "fallback"],
      behavior: "keep object identity, crop, and action geometry stable while proof or configuration state changes",
    },
  ],
  motionContract: {
    intensity: "medium-purposeful",
    triggers: ["object reveal", "chapter continuity", "configuration or comparison change", "feature-state feedback"],
    review: "inspect the selected product reference and name the object or proof relationship before choosing motion",
    apply: "use local CSS or platform behavior first; animate the product relationship or state, not the entire page",
    polish: "tune against rendered desktop/mobile crops, interrupted states, and real media loading; remove decorative choreography",
    reducedMotion: "show the complete product object, proof, and action without travel, looping, or parallax dependence",
    fallback: "a static product object, poster, or text/specification state preserves the decision path when motion or media fails",
  },
  responsive: {
    desktop: "use the inspected reference's product-to-copy scale while exposing the next proof chapter",
    tablet: "reduce simultaneous media and copy regions without losing object identity or the primary action",
    mobile: "recompose object, claim, proof, and controls for touch and reading order; do not shrink the desktop composition",
  },
  assetStrategy: {
    hero: "use user-provided, official/authorized, or target-specific generated product media; never copy the reference source asset",
    specimens: "prefer real product detail, compatible state, or deterministic workflow proof over decorative renders",
    fallback: "approved poster, static object-led composition, or complete text/specification state with explicit loading/error behavior",
  },
  tokenSeed: {
    canvas: "inspect the selected product reference, then adapt to the target brand and contrast requirements",
    surface: "derive from the target object's material and the reference's tonal hierarchy",
    ink: "specific product copy with readable contrast",
    accent: "one target-owned action or semantic accent",
    border: "use boundaries only where they clarify object, proof, or decision grouping",
    container: "measure from the product object, copy length, and target viewport",
    radius: { nav: "inspect and adapt", frame: "inspect and adapt", specimen: "inspect and adapt", control: "local tokens" },
    spacing: { pageDesktop: "measure", pageMobile: "measure", section: "measure from proof rhythm", grid: "only where comparison requires it" },
    type: { displayDesktop: "earn from the product claim", displayMobile: "fit real copy", body: "measure", meta: "measure" },
    note: "the product source is a quality and visual reference candidate; inspect the live source before locking values",
  },
  buildOrder: ["inspect product source", "object-first hero", "real target asset/object", "feature proof chapters", "comparison/configuration path", "states, fallback, motion, and polish"],
  acceptance: ["the target product object is identifiable immediately", "at least three source-derived decisions are visible without copying the brand", "feature or material proof is concrete", "desktop/mobile and reduced-motion paths preserve the decision flow", "no placeholder or low-quality filler remains"],
};

function extractUrl(input) {
  const match = String(input ?? "").match(/https?:\/\/[^\s<>"')]+/i);
  return match?.[0]?.replace(/[.,;:]+$/, "") ?? "";
}

function externalReference(url) {
  const hostname = new URL(url).hostname.replace(/^www\./, "");
  const id = `external-${hostname.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "reference"}`;
  return {
    id,
    label: `External reference: ${hostname}`,
    url,
    sourceType: "user-supplied-live-site",
    roles: ["visual-language", "quality-reference"],
    borrow: ["inspect and translate the visible hierarchy, material, rhythm, and interaction purpose"],
    reject: ["do not copy brand identity, source code, exact copy, or proprietary assets"],
    visual: {
      family: "unknown until live inspection",
      palette: "measure from the live reference",
      typography: "measure roles and density from the live reference",
      layout: "map the observed first viewport and section rhythm",
      surfaces: "inspect borders, radius, shadow, texture, and contrast",
      motion: "inspect only meaningful state relationships",
    },
  };
}

function productReferenceFromScout(source) {
  if (!source) return null;
  if (source.scouted) return source;
  const urls = source.urls ?? (source.url ? [source.url] : []);
  return {
    id: source.id,
    label: source.label,
    url: urls[0] ?? null,
    urls,
    sourceType: source.sourceType ?? "official-product",
    roles: source.jobs ?? source.roles ?? ["product-object", "feature-proof"],
    scouted: true,
    visualSignals: source.visualSignals ?? [],
    inspect: source.inspect ?? [],
    borrow: source.borrow ?? ["inspect and translate the source's object, hierarchy, proof, and interaction relationships"],
    reject: source.reject ?? ["do not copy brand identity, source code, exact copy, or proprietary assets"],
    useWhen: source.jobs ?? source.roles ?? [],
    avoidWhen: ["do not use the source as a literal skin or substitute for target product evidence"],
    visual: {
      family: "object-first product story",
      palette: "inspect the source's material contrast and adapt it to a target-owned palette",
      typography: "inspect the source's reading scale; keep the target copy compact and specific",
      layout: "object-first first viewport with one-claim proof chapters and a visible next relationship",
      surfaces: "material, finish, and product silhouette carry depth; avoid effect stacks without object proof",
      motion: "object continuity, feature reveal, and configuration feedback only when they clarify the product",
    },
  };
}

function referenceMatchScore(reference, input) {
  const needle = String(input ?? "").toLocaleLowerCase();
  if (!needle) return { score: 0, hits: [] };
  const exactValues = [reference.id, reference.label, reference.url, new URL(reference.url).hostname]
    .filter(Boolean)
    .map((value) => String(value).toLocaleLowerCase());
  const exactHits = exactValues.filter((value) => needle.includes(value));
  const queryTokens = meaningfulTokens(needle);
  const referenceTokens = meaningfulTokens(`${reference.id} ${reference.label} ${reference.url}`);
  const tokenHits = referenceTokens.filter((token) => queryTokens.includes(token) && !GENERIC_REFERENCE_TOKENS.has(token));
  return {
    score: exactHits.length * 30 + new Set(tokenHits).size * 8,
    hits: [...new Set([...exactHits, ...tokenHits])],
  };
}

export function resolveReference(input, references = loadDataset("reference-lenses.json").references) {
  const ranked = references.map((reference) => ({
    reference,
    ...referenceMatchScore(reference, input),
  })).sort((left, right) => right.score - left.score || left.reference.id.localeCompare(right.reference.id));
  if (ranked[0]?.score > 0) return ranked[0];
  const url = extractUrl(input);
  return url ? { reference: externalReference(url), score: 1, hits: [url], external: true } : null;
}

function genericLensRecipe(reference) {
  const visual = reference.visual ?? {};
  return {
    archetype: "reference-lens-adaptation",
    firstViewport: {
      layout: visual.layout ?? "reconstruct the observed first viewport hierarchy before adding lower-page detail",
      mustShow: ["the target product object or working interaction", "one clear primary action", "the reference-specific visual anchor"],
      belowFoldPeek: "the first working specimen or workflow proof",
    },
    sections: [
      {
        id: "direction-hero",
        purpose: "establish the target product and translate the reference's visual thesis",
        layout: visual.layout ?? "a focused first viewport with one dominant object",
        content: "real target content, object, or interaction; no copied demo copy",
        components: ["local navigation", "primary object or interaction", "primary action", "short proof statement"],
      },
      {
        id: "working-proof",
        purpose: "prove the product through a working object rather than a decorative screenshot",
        layout: "repeat the reference's rhythm while keeping target workflow and content primary",
        content: "realistic states, media, or data relationships",
        components: ["reference-specific specimen", "supporting detail", "state or recovery action"],
      },
      {
        id: "state-and-implementation",
        purpose: "make the borrowed interaction and its boundaries inspectable",
        layout: "compact implementation or state notes after the working proof",
        content: "trigger, response, final state, responsive behavior, and fallback",
        components: ["state label", "keyboard/touch path", "reduced-motion path", "static fallback"],
      },
    ],
    componentGrammar: [
      {
        id: "reference-lens-surface",
        shape: visual.surfaces ?? "contained surface with stable geometry and a clear interactive object",
        states: ["idle", "hover", "focus", "active", "loading", "reduced-motion", "fallback"],
        behavior: "keep the object identity and surrounding geometry stable while the state changes",
      },
    ],
    motionContract: {
      intensity: "inspect-first",
      triggers: [visual.motion ?? "only meaningful state relationships observed in the live source"],
      review: "inspect the live source and name the purpose, trigger, and final state before choosing timing",
      apply: "use local CSS, a platform capability, or an existing project primitive before adding a runtime",
      polish: "tune against rendered desktop and mobile states, then remove motion that does not survive comparison",
      reducedMotion: "preserve the complete information hierarchy and final state without travel or looping",
      fallback: "the target surface remains usable and coherent with animation disabled or unavailable",
    },
    responsive: {
      desktop: "preserve the reference's major hierarchy while keeping target content and actions visible",
      tablet: "reduce simultaneous specimens and re-stage navigation or controls where needed",
      mobile: "recompose for touch and reading order; do not shrink a desktop composition into a narrow column",
    },
    assetStrategy: {
      hero: "use licensed target media or a restrained product-owned fallback; never copy source assets",
      specimens: "prefer working target states and deterministic content over decorative screenshots",
      fallback: "static final state, approved poster, or product-owned assetless fallback with explicit loading and error behavior",
    },
    tokenSeed: {
      canvas: "observed from live reference",
      surface: "observed from live reference",
      ink: "observed from live reference",
      accent: "observed from live reference",
      border: "observed from live reference",
      container: "measure from live reference first",
      radius: { nav: "measure", frame: "measure", specimen: "measure", control: "measure" },
      spacing: { pageDesktop: "measure", pageMobile: "measure", section: "measure", grid: "measure" },
      type: { displayDesktop: "measure", displayMobile: "measure", body: "measure", meta: "measure" },
      note: "this lens has no local recipe yet; inspect the live source before locking visual values",
    },
    buildOrder: ["inspect the named source", "target first viewport", "target working proof", "responsive re-staging", "state and fallback", "motion and polish"],
    acceptance: ["the borrowed visual relationship is visible in the rendered result", "target content and workflow remain distinct", "desktop and mobile hierarchy are coherent", "the interaction remains understandable without motion"],
  };
}

function recipeFor(reference, recipes) {
  if (reference.id.startsWith("external-")) return EXTERNAL_RECIPE;
  if (reference.scouted) return PRODUCT_RECIPE;
  return recipes.find((recipe) => recipe.referenceId === reference.id) ?? genericLensRecipe(reference);
}

function projectEvidence(project) {
  if (!project) return {
    status: "not-scanned",
    instruction: "Scan the target project before editing; local tokens, routes, assets, and existing primitives remain unknown.",
  };
  return {
    status: project.status,
    root: project.project,
    frameworks: project.stack.frameworks,
    manifests: project.manifests.slice(0, 5),
    routes: project.paths.routes.slice(0, 8),
    components: project.paths.components.slice(0, 8),
    tokens: project.paths.tokens.slice(0, 8),
    assets: project.assets.examples.slice(0, 8),
    designAuthority: project.designAuthority ? {
      path: project.designAuthority.path,
      confidence: project.designAuthority.confidence,
      hasDirectionContract: project.designAuthority.hasDirectionContract,
      fields: project.designAuthority.fields,
      declaredExceptions: project.designAuthority.declaredExceptions,
    } : null,
    gaps: project.gaps.slice(0, 6),
    instruction: "Preserve or repair the local system before introducing a new visual language or dependency.",
  };
}

function normalizeSelected(primary, composition, references, limit = 4) {
  const selected = composition.selected.map((item) => ({ ...item, primary: item.id === primary?.id }));
  if (!primary) return selected;
  const primaryEntry = selected.find((item) => item.id === primary.id);
  if (primaryEntry) return [{ ...primaryEntry, primary: true }, ...selected.filter((item) => item.id !== primary.id)];
  const source = references.find((item) => item.id === primary.id) ?? primary;
  if (!source) return selected;
  const scouted = Boolean(primary.scouted);
  return [
    {
      id: source.id,
      label: source.label,
      url: source.url,
      sourceType: source.sourceType,
      assignedRole: scouted ? "primary-product-reference" : "primary-reference",
      assignedRoleLabel: scouted ? "主产品参考" : "主参考",
      score: 99,
      confidence: scouted ? "scouted" : "explicit",
      why: scouted ? "品类参考侦察选出的主产品来源" : "用户明确点名的主参考",
      borrow: source.borrow.slice(0, 3),
      reject: source.reject.slice(0, 2),
      translate: scouted
        ? "以对象、材质、功能证明和使用场景为主视觉骨架；替换品牌、内容、资产和产品对象。"
        : "保留其视觉语法和页面节奏，替换品牌、内容、资产和产品对象。",
      scouted,
      primary: true,
    },
    ...selected.slice(0, Math.max(limit - 1, 0)),
  ];
}

export function buildReferenceBuild({
  query = "Build a product-specific frontend interface",
  reference = "",
  projectRoot,
  profile = "",
  style = "",
  motion = "",
  limit = 4,
  allowInferred = true,
  referenceExplicit = true,
  productReference = null,
  authority = "",
  creativeDirection = "",
  referenceInspected = false,
  acceptedConcept = false,
  modelProposal = false,
  directionOverrides = [],
} = {}) {
  const references = loadDataset("reference-lenses.json").references;
  const recipes = loadDataset("reference-recipes.json").recipes;
  const scouted = productReferenceFromScout(productReference);
  const explicitInput = reference || (referenceExplicit && REFERENCE_SIGNAL.test(query) ? query : "");
  const explicit = referenceExplicit ? resolveReference(explicitInput, references) : null;
  const seeded = !referenceExplicit ? resolveReference(reference, references) : null;
  const inferred = allowInferred ? resolveReference(query, references) : null;
  const productResolved = scouted ? { reference: scouted, score: 100, hits: scouted.visualSignals ?? [], scouted: true } : null;
  const resolved = explicit ?? productResolved ?? seeded ?? inferred;
  const primary = resolved?.reference ?? null;
  const selectionLimit = Math.min(Math.max(Number(limit) || 4, 1), 4);
  const composition = selectReferenceComposition(`${query} ${primary?.label ?? ""}`, {
    profile,
    style,
    motion: `${motion} ${primary?.label ?? ""}`,
    motionSignal: Boolean(motion),
    limit: selectionLimit,
  });
  const selected = normalizeSelected(primary, composition, references, selectionLimit).slice(0, selectionLimit);
  // Supporting lenses can inform the contract, but they do not become the
  // primary visual authority when the request did not name a reference.
  const chosen = primary;
  const recipe = chosen ? recipeFor(chosen, recipes) : ADAPTIVE_RECIPE;
  const project = projectRoot ? scanProject(resolve(projectRoot)) : null;
  const visualDirection = selectVisualDirection(query, {
    profile,
    style,
    reference: chosen?.id ?? "",
    adaptiveDefault: !primary && selected.length === 0,
    project,
    authority,
    creativeDirection,
    referenceInspected,
    referenceEvidence: chosen ? { status: referenceInspected ? "observed" : "candidate", source: chosen.id } : null,
    acceptedConcept,
    modelProposal,
    overrides: directionOverrides,
  });
  const visual = chosen?.visual ?? {
    family: "evidence-led adaptive surface",
    palette: "derive from local tokens, real content, and semantic roles",
    typography: "derive roles and scale from content, reading distance, and density",
    layout: "derive hierarchy from the primary object/task and the next proof",
    surfaces: "use a restrained local material system with stable geometry",
    motion: "review state, continuity, feedback, reveal, comparison, progress, and inspection before adding motion",
  };
  const mode = primary
    ? (explicit ? "named-reference" : productResolved ? "scouted-reference" : seeded ? "supporting-reference" : "inferred-reference")
    : "adaptive-no-reference";

  return {
    version: 1,
    query,
    executionMode: "implement-and-verify",
    fidelity: primary ? primary.scouted ? "translate-inspected-product-grammar-not-brand-or-source" : "borrow-visual-grammar-not-brand-or-source" : "evidence-first-no-forced-reference",
    referenceMode: mode,
    primaryReference: {
      id: chosen?.id ?? "adaptive-default",
      label: chosen?.label ?? "Adaptive default (no named reference)",
      url: chosen?.url ?? null,
      sourceType: chosen?.sourceType ?? null,
      roles: chosen?.roles ?? [],
      scouted: Boolean(chosen?.scouted),
      explicit: Boolean(explicit),
      match: resolved?.hits ?? [],
    },
    selectedReferences: selected,
    visualDirection,
    constraintAuthority: visualDirection.constraintAuthority,
    visualGenome: {
      family: visual.family,
      palette: visual.palette,
      typography: visual.typography,
      layout: visual.layout,
      surfaces: visual.surfaces,
      motion: visual.motion,
    },
    fidelityAnchors: {
      composition: visual.layout,
      material: visual.surfaces,
      type: visual.typography,
      interaction: visual.motion,
      proof: primary ? "make at least three observed reference decisions visible in the rendered target" : "make the target's own object, content, and state relationship visible before adding a borrowed style",
    },
    referenceEvidence: primary?.scouted ? {
      visualSignals: primary.visualSignals ?? [],
      inspect: primary.inspect ?? [],
      urls: primary.urls ?? (primary.url ? [primary.url] : []),
    } : null,
    firstViewport: recipe.firstViewport,
    pagePlan: recipe.sections,
    componentGrammar: recipe.componentGrammar,
    tokenSeed: recipe.tokenSeed,
    motionContract: recipe.motionContract,
    responsivePlan: recipe.responsive,
    assetStrategy: recipe.assetStrategy,
    buildOrder: recipe.buildOrder,
    acceptance: recipe.acceptance,
    project: projectEvidence(project),
    implementationRules: [
      "Treat the sentence as an implementation request; do not stop at a moodboard or prose brief.",
      "Run the full local capability pipeline on every frontend pass: inspect, graph, brief, all reference lenses, product-reference scouting when a category exists, resource provenance, internal motion review, and rendered verification.",
      "When a product-reference scout returns a candidate, let its object/material/proof grammar lead the visual build; component and motion references may support it but must not replace its first-viewport direction.",
      "Inspect the live reference or supplied screenshot before coding and record the visible decisions that are actually borrowed.",
      "Before polishing, name three fidelity anchors: composition, material/type, and interaction cadence; verify each in the rendered result.",
      `Use the visual direction contract (${visualDirection.label}) as the starting point for layout/type/spacing. If ${visualDirection.constraintAuthority.source} defines a different visual language, preserve that source and use this contract only to fill gaps.`,
      "Treat the visual direction and treatment anti-AI checks as advisory smell detectors; record an authority-backed override instead of rejecting a deliberate choice.",
      `Use the visual treatment (${visualDirection.visualTreatment.label}) to make the ordinary surface visibly authored: apply its palette/material, type relationship, composition cue, and signature device unless the authority source deliberately defines another language.`,
      "Keep the hard invariants: accessibility, task/state completeness, responsive usability, asset truth/rights, motion fallback, runtime integrity, and rendered proof.",
      "Use real target content, data, and workflow objects; deterministic mock data is acceptable only when the backend is unavailable.",
      "Do not copy logos, brand names, proprietary assets, source code, exact text, or an indistinguishable full-page clone.",
      "Treat user-provided assets as authoritative; otherwise find high-quality attributable media or generate target-specific assets, and never ship placeholders, low-resolution filler, random stock, or visibly flawed generated media.",
      "If no asset passes the quality bar, use a deliberate assetless composition or report the blocker instead of pretending the surface is finished.",
      "After implementation, verify desktop and mobile screenshots plus one non-default state, console output, and reduced-motion behavior.",
    ],
    source: {
      lenses: "data/reference-lenses.json",
      recipes: "data/reference-recipes.json",
      selectionMode: allowInferred ? "named, scouted product, supporting, or inferred reference" : "named/scouted/supporting reference only; otherwise adaptive contract",
    },
  };
}

function list(items) {
  return (items ?? []).map((item) => `- ${item}`).join("\n") || "- None recorded.";
}

export function renderReferenceBuild(contract) {
  const selected = contract.selectedReferences.length > 0
    ? contract.selectedReferences.map((item, index) => `- **${index + 1}. ${item.label}**${item.primary ? " · primary" : ""} · ${item.assignedRoleLabel} · ${item.confidence}: ${item.translate}`).join("\n")
    : "- No supporting reference; rely on local project evidence.";
  const sections = contract.pagePlan.map((section, index) => `### ${index + 1}. ${section.id}

- Purpose: ${section.purpose}
- Layout: ${section.layout}
- Content: ${section.content}
- Components: ${section.components.join(", ")}`).join("\n\n");
  const components = contract.componentGrammar.map((component) => `- **${component.id}**: ${component.shape}; states: ${component.states.join(", ")}; behavior: ${component.behavior}`).join("\n");
  const tokenSeed = Object.entries(contract.tokenSeed ?? {})
    .filter(([key]) => key !== "note")
    .map(([key, value]) => `- **${key}**: ${typeof value === "object" ? Object.entries(value).map(([innerKey, innerValue]) => `${innerKey}=${innerValue}`).join(", ") : value}`).join("\n");
  const primarySource = contract.primaryReference.url ? ` ([source](${contract.primaryReference.url}))` : "";
  const sourceEvidence = contract.referenceEvidence
    ? `\n## Scouted Product Evidence\n\n- Visual signals: ${contract.referenceEvidence.visualSignals.join("；") || "inspect the source directly"}\n- Inspect: ${contract.referenceEvidence.inspect.join("；") || "first viewport, object scale, proof sequence, mobile re-staging, and fallback"}\n- URLs: ${contract.referenceEvidence.urls.map((url) => `[source](${url})`).join(" · ") || "none recorded"}\n`
    : "";
  return `# Reference Build Contract

Request: **${contract.query}**

Execution mode: **${contract.executionMode}**
Reference mode: **${contract.referenceMode}**
Primary reference: **${contract.primaryReference.label}**${primarySource}${contract.primaryReference.explicit ? " · explicitly named" : contract.referenceMode === "inferred-reference" ? " · inferred from the request" : ""}
Fidelity rule: **${contract.fidelity}**

## Selected Reference Lenses

${selected}
${sourceEvidence}

## Visual Genome

- Family: ${contract.visualGenome.family}
- Palette: ${contract.visualGenome.palette}
- Typography: ${contract.visualGenome.typography}
- Layout: ${contract.visualGenome.layout}
- Surfaces: ${contract.visualGenome.surfaces}
- Motion: ${contract.visualGenome.motion}

## Visual Direction Contract

- Direction: **${contract.visualDirection.label}** (${contract.visualDirection.confidence})
- Lock: ${contract.visualDirection.directionLock}
- Visual stance: **${contract.visualDirection.visualTreatment?.label ?? "not resolved"}** (${contract.visualDirection.visualTreatment?.confidence ?? "unknown"})
- Stance signature: ${contract.visualDirection.visualTreatment?.signature ?? "not recorded"}
- Palette/material: ${contract.visualDirection.visualTreatment?.palette ?? "not recorded"}
- Signature device: ${contract.visualDirection.visualTreatment?.signatureDevice ?? "not recorded"}
- Expression budget: ${contract.visualDirection.visualTreatment?.expressionBudget ?? "not recorded"}
- First viewport: ${contract.visualDirection.firstViewport.layout}
- Alignment: ${contract.visualDirection.firstViewport.alignmentAxis}
- Card budget: ${contract.visualDirection.surfaceRules.cardBudget}
- Type: ${contract.visualDirection.typeRules.title}
- Spacing: ${contract.visualDirection.spacingRules.rhythm}

${renderAuthorityMarkdown(contract.constraintAuthority, { includeChecks: false })}

AI-default checks (advisory):

${list(contract.visualDirection.advisoryChecks?.map((item) => `${item.source}: ${item.check}`) ?? contract.visualDirection.antiAiChecks)}

## Fidelity Anchors

- Composition: ${contract.fidelityAnchors.composition}
- Material: ${contract.fidelityAnchors.material}
- Type: ${contract.fidelityAnchors.type}
- Interaction: ${contract.fidelityAnchors.interaction}
- Proof: ${contract.fidelityAnchors.proof}

## First Viewport

- Layout: ${contract.firstViewport.layout}
- Must show: ${contract.firstViewport.mustShow.join(", ")}
- Below-fold peek: ${contract.firstViewport.belowFoldPeek}

## Page Plan

${sections}

## Component Grammar

${components}

## Token Seed

${tokenSeed}

_${contract.tokenSeed?.note ?? "Use these as starting values and tune against the rendered reference."}_

## Motion Contract

- Intensity: ${contract.motionContract.intensity}
- Triggers: ${contract.motionContract.triggers.join(", ")}
- Review: ${contract.motionContract.review}
- Apply: ${contract.motionContract.apply}
- Polish: ${contract.motionContract.polish}
- Reduced motion: ${contract.motionContract.reducedMotion}
- Static fallback: ${contract.motionContract.fallback}

## Responsive Plan

- Desktop: ${contract.responsivePlan.desktop}
- Tablet: ${contract.responsivePlan.tablet}
- Mobile: ${contract.responsivePlan.mobile}

## Asset Strategy

- Hero: ${contract.assetStrategy.hero}
- Specimens: ${contract.assetStrategy.specimens}
- Fallback: ${contract.assetStrategy.fallback}

## Build Order

${list(contract.buildOrder)}

## Acceptance

${list(contract.acceptance)}

## Local Project Evidence

- Status: **${contract.project.status}**
- Frameworks: ${(contract.project.frameworks ?? []).join(", ") || "not scanned"}
- Design authority: ${contract.project.designAuthority ? `\`${contract.project.designAuthority.path}\` (${contract.project.designAuthority.confidence}); ${contract.project.designAuthority.hasDirectionContract ? "structured direction detected" : "partial direction"}` : "none detected"}
- Instruction: ${contract.project.instruction}

## Implementation Rules

${list(contract.implementationRules)}

This contract is a construction input, not visual proof. The target project still needs a rendered desktop/mobile pass and a non-default state check.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "Build a product-specific frontend interface");
  const contract = buildReferenceBuild({
    query,
    reference: option(args, "reference", ""),
    projectRoot: option(args, "project"),
    profile: option(args, "profile", ""),
    style: option(args, "style", ""),
    motion: option(args, "motion", ""),
    limit: asNumber(option(args, "limit", 4), 4),
    authority: option(args, "authority", ""),
    creativeDirection: option(args, "creative-direction", ""),
    referenceInspected: Boolean(args.options["reference-inspected"]),
    acceptedConcept: Boolean(args.options["concept-accepted"]),
    modelProposal: Boolean(args.options["model-proposed"]),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? contract : renderReferenceBuild(contract), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main();
