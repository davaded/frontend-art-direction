#!/usr/bin/env node

import { resolve } from "node:path";
import {
  chooseRecord,
  isMainModule,
  loadDataset,
  isUnderspecifiedRequest,
  meaningfulTokens,
  option,
  parseArgs,
  tokenize,
  writeOutput,
} from "./lib.mjs";
import { scanProject } from "./inspect-project.mjs";
import { selectReferenceComposition } from "./reference-composition.mjs";
import { scoutReferences } from "./reference-scout.mjs";
import { selectVisualDirection } from "./visual-direction.mjs";
import { renderAuthorityMarkdown } from "./authority.mjs";

const HELP = `design-brief.mjs [options]

Generate a candidate, evidence-labeled art-direction brief from local data.

Options:
  --query <text>         Product and screen description
  --project <path>       Optional project root to scan locally
  --profile <id>         Pin a product profile
  --style <id>           Pin a style anchor
  --type <id>            Pin a type strategy
  --palette <id>         Pin a semantic palette
  --motion <id>          Pin a motion grammar
  --stack <id>           Pin a stack note
  --authority <mode>     adaptive|reference|project|artist|concept|model
  --creative-direction   Explicit visual direction supplied by the user/artist
  --reference-inspected  Mark the reference as inspected evidence
  --concept-accepted     Mark a generated concept as approved direction
  --model-proposed       Mark the direction as an evidence-backed model proposal
  --format md|json       Output format (default: md)
  --output <path>        Write the brief instead of stdout
`;

function confidenceNote(selection) {
  if (selection.confidence === "explicit") return "explicit override";
  if (selection.confidence === "high") return `high candidate confidence; matched ${selection.hits.join(", ") || "query structure"}`;
  if (selection.confidence === "medium") return `medium candidate confidence; matched ${selection.hits.join(", ") || "some terms"}`;
  return "low candidate confidence; verify against the real surface";
}

function findStack(stacks, queryTokens, requested) {
  if (requested) {
    return stacks.find((stack) => stack.id === requested) ?? { id: requested, label: requested, notes: "No local stack note; inspect the project conventions." };
  }
  return chooseRecord(stacks, queryTokens, undefined, "vanilla", ["id", "keywords"]).record;
}

function rankQualityRecords(records, queryTokens, limit) {
  return records
    .map((record) => {
      const text = `${record.id} ${record.label} ${(record.keywords ?? []).join(" ")} ${(record.question ?? "")} ${(record.passWhen ?? "")}`;
      const haystack = new Set(tokenize(text));
      const hits = queryTokens.filter((token) => haystack.has(token));
      return { record, hits: [...new Set(hits)], score: hits.length };
    })
    .sort((left, right) => right.score - left.score || left.record.id.localeCompare(right.record.id))
    .slice(0, limit);
}

function qualitySelection(queryTokens) {
  const quality = loadDataset("quality-gates.json");
  const dials = rankQualityRecords(quality.sceneDials, queryTokens, 2).filter((item) => item.score > 0);
  const rankedGates = rankQualityRecords(quality.qualityGates, queryTokens, 6);
  const mandatoryGates = ["visual-direction", "geometry-language", "constraint-authority"]
    .map((id) => quality.qualityGates.find((gate) => gate.id === id))
    .filter(Boolean);
  const gates = [...rankedGates];
  for (const mandatory of mandatoryGates) {
    if (!gates.some((item) => item.record.id === mandatory.id)) gates.push({ record: mandatory, hits: [], score: 0 });
  }
  const rankedAntiPatterns = quality.antiPatterns
    .map((record) => {
      const haystack = new Set(tokenize(`${record.id} ${record.label} ${(record.signals ?? []).join(" ")}`));
      const hits = queryTokens.filter((token) => haystack.has(token));
      return { ...record, hits: [...new Set(hits)], score: hits.length };
    })
    .sort((left, right) => right.score - left.score || left.id.localeCompare(right.id))
    .slice(0, 4);
  const baselineAntiPatterns = ["centered-hero-template", "card-wall", "hard-edge-scaffolding", "type-scale-collapse", "generic-copy"]
    .map((id) => quality.antiPatterns.find((record) => record.id === id))
    .filter(Boolean);
  const antiPatterns = [...rankedAntiPatterns];
  for (const baseline of baselineAntiPatterns) {
    if (!antiPatterns.some((item) => item.id === baseline.id)) antiPatterns.push({ ...baseline, hits: [], score: 0 });
  }
  return {
    dials: dials.map((item) => ({ ...item.record, matched: item.hits })),
    gates: gates.map((item) => ({ ...item.record, matched: item.hits })),
    antiPatterns,
    implementationChecks: quality.implementationChecks,
    source: "data/quality-gates.json",
  };
}

function evidenceCards(project) {
  if (!project) return [{ status: "open", label: "local project", detail: "No project scan supplied; local structure and runtime claims remain open." }];
  const cards = [
    { status: "observed", label: "stack", detail: `${project.stack.frameworks.join(", ") || "framework not confirmed"}; ${project.scan.fileCount} files scanned`, paths: project.manifests.slice(0, 4) },
    { status: project.paths.routes.length > 0 ? "observed" : "open", label: "routes/screens", detail: `${project.paths.routes.length} candidate paths`, paths: project.paths.routes.slice(0, 5) },
    { status: project.paths.components.length > 0 ? "observed" : "open", label: "components", detail: `${project.paths.components.length} candidate paths`, paths: project.paths.components.slice(0, 5) },
    { status: project.paths.tokens.length > 0 ? "observed" : "open", label: "tokens/styles", detail: `${project.paths.tokens.length} candidate paths`, paths: project.paths.tokens.slice(0, 5) },
    { status: project.assets.count > 0 ? "observed" : "open", label: "assets", detail: `${project.assets.count} media/font files`, paths: project.assets.examples.slice(0, 5) },
  ];
  if (project.designAuthority) {
    cards.push({
      status: project.designAuthority.status === "observed" ? "observed" : "open",
      label: "project design authority",
      detail: `${project.designAuthority.path}; ${project.designAuthority.hasDirectionContract ? "structured visual direction detected" : "direction fields need review"}`,
      paths: [project.designAuthority.path],
    });
  }
  return cards;
}

export function buildBrief({ query, projectRoot, overrides = {} }) {
  const datasets = {
    profiles: loadDataset("profiles.json").profiles,
    styles: loadDataset("styles.json").styles,
    types: loadDataset("types.json").types,
    palettes: loadDataset("palettes.json").palettes,
    motions: loadDataset("motion.json").motions,
    stacks: loadDataset("stacks.json").stacks,
  };
  const project = projectRoot ? scanProject(projectRoot) : null;
  const localTokens = project ? tokenize(`${project.stack.frameworks.join(" ")} ${project.stack.dependencies.join(" ")} ${project.paths.routes.join(" ")}`) : [];
  const queryTokens = meaningfulTokens(`${query} ${localTokens.join(" ")}`);
  const hasFrontendEvidence = Boolean(project && (
    project.stack.frameworks.length > 0
    || project.paths.routes.length > 0
    || project.paths.components.length > 0
  ));
  const adaptiveDefault = !overrides.profile && !overrides.style && isUnderspecifiedRequest(query) && (!project || !hasFrontendEvidence);
  const quality = qualitySelection(queryTokens);
  const profile = chooseRecord(datasets.profiles, queryTokens, overrides.profile, adaptiveDefault ? "adaptive-surface" : "productive-app");
  const style = chooseRecord(datasets.styles, [...queryTokens, ...tokenize(profile.record.id)], overrides.style, adaptiveDefault ? "evidence-led-neutral" : profile.record.stance, ["id", "label", "keywords", "bestFor"]);
  const type = chooseRecord(datasets.types, [...queryTokens, ...tokenize(profile.record.id), ...tokenize(style.record.id)], overrides.type, adaptiveDefault ? "adaptive-hierarchy" : profile.record.type);
  const palette = chooseRecord(datasets.palettes, [...queryTokens, ...tokenize(profile.record.id)], overrides.palette, adaptiveDefault ? "adaptive-neutral" : profile.record.palette);
  const motion = chooseRecord(datasets.motions, [...queryTokens, ...tokenize(profile.record.motion)], overrides.motion, adaptiveDefault ? "purposeful-motion" : profile.record.motion);
  const stack = findStack(datasets.stacks, queryTokens, overrides.stack ?? project?.stack.frameworks[0]);
  const referenceComposition = selectReferenceComposition(adaptiveDefault ? "" : query, {
    profile: adaptiveDefault ? "" : `${profile.record.id} ${profile.record.surfaceMode} ${profile.record.label}`,
    style: adaptiveDefault ? "" : `${style.record.id} ${style.record.label}`,
    motion: adaptiveDefault ? "" : `${motion.record.id} ${motion.record.label}`,
    limit: 4,
  });
  const referenceScout = scoutReferences(adaptiveDefault ? "" : query, {
    profile: adaptiveDefault ? "" : `${profile.record.id} ${profile.record.surfaceMode} ${profile.record.label}`,
    limit: 4,
  });
  const visualDirection = selectVisualDirection(query, {
    profile: profile.record,
    style: style.record,
    reference: referenceScout.selected[0]?.id ?? referenceComposition.selected[0]?.id ?? "",
    adaptiveDefault,
    project,
    authority: overrides.authority,
    creativeDirection: overrides.creativeDirection,
    referenceInspected: Boolean(overrides.referenceInspected),
    acceptedConcept: Boolean(overrides.acceptedConcept),
    modelProposal: Boolean(overrides.modelProposal),
    overrides: overrides.directionOverrides,
  });

  const openEvidence = [
    "Inspect real copy, data shape, and empty/error/partial states before locking type scale.",
    "Confirm the local component and token source before adding a dependency.",
    profile.record.surfaceMode === "Editorial Marketing" || profile.record.surfaceMode === "Spatial Experiential"
      ? "Use user-provided media first; otherwise find or generate high-quality target-specific assets, record provenance, and verify desktop/mobile crop. Do not ship placeholders or low-quality filler."
      : "Confirm the primary workflow and target input method with a rendered state.",
  ];
  if (!project) openEvidence.unshift("No project scan supplied; all local-system claims remain open.");
  if (adaptiveDefault) openEvidence.unshift("Direction assumption: no domain, audience, object, or workflow was specified; keep the composition adaptive until one is known.");
  if (project?.designAuthority) openEvidence.unshift(`Project-owned visual authority detected at ${project.designAuthority.path}; read and preserve it before replacing the direction.`);
  if (project?.gaps.length > 0) openEvidence.push(...project.gaps.slice(0, 3));

  return {
    query,
    evidence: {
      localProject: project?.project ?? null,
      localStatus: project?.status ?? "not-scanned",
      observedPaths: project ? project.evidence.flatMap((item) => item.paths.slice(0, 8)) : [],
      cards: evidenceCards(project),
    },
    recommendation: {
      profile: profile.record,
      style: style.record,
      type: type.record,
      palette: palette.record,
      motion: motion.record,
      stack,
    },
    directionMode: visualDirection.constraintAuthority?.mode === "adaptive-default" ? (adaptiveDefault ? "adaptive-default" : "signal-led") : visualDirection.constraintAuthority.mode,
    confidence: {
      profile: confidenceNote(profile),
      style: confidenceNote(style),
      type: confidenceNote(type),
      palette: confidenceNote(palette),
      motion: confidenceNote(motion),
    },
    decisions: {
      surfaceMode: profile.record.surfaceMode,
      designStance: style.record.label,
      signatureMove: style.record.signature,
      signatureInteraction: motion.record.purpose,
      typeCeiling: profile.record.typeCeiling,
      componentShape: `${visualDirection.geometryRules.edgeCharacter}; ${visualDirection.geometryRules.cornerHierarchy}`,
      medium: profile.record.surfaceMode === "Spatial Experiential" ? "hybrid spatial object + usable controls" : profile.record.surfaceMode === "Editorial Marketing" ? "media-led or restrained editorial hybrid, pending asset check" : adaptiveDefault ? "adaptive surface with one primary object or task and a normal-flow fallback" : "static product UI with stateful transitions",
      intentionalOmissions: [...new Set([...style.record.avoid, ...profile.record.avoid])].slice(0, 8),
      sceneDials: quality.dials,
      visualDirection: visualDirection.directionLock,
      visualTreatment: visualDirection.visualTreatment?.signature,
      constraintAuthority: visualDirection.constraintAuthority,
    },
    quality,
    visualDirection,
    referenceComposition,
    referenceScout,
    openEvidence,
    sources: {
      profile: "data/profiles.json",
      style: "data/styles.json",
      type: "data/types.json",
      palette: "data/palettes.json",
      motion: "data/motion.json",
      stack: "data/stacks.json",
      quality: quality.source,
      visualDirection: visualDirection.source,
      references: referenceComposition.source,
      referenceSources: referenceScout.source,
    },
  };
}

export function renderBriefMarkdown(brief) {
  const { recommendation: rec } = brief;
  const bullets = (items) => items.map((item) => `- ${item}`).join("\n");
  const paletteRoles = Object.entries(rec.palette.roles).map(([key, value]) => `\`${key}: ${value}\``).join(" · ");
  const evidenceCards = brief.evidence.cards.map((card) => `- **${card.status}** ${card.label}: ${card.detail}${card.paths?.length ? ` (${card.paths.slice(0, 3).map((path) => `\`${path}\``).join(", ")})` : ""}`).join("\n");
  const dials = brief.quality.dials.map((dial) => `- **${dial.label}**: ${dial.question}`).join("\n");
  const gates = brief.quality.gates.map((gate) => `- **${gate.label}**: ${gate.passWhen} Evidence: ${gate.evidence}`).join("\n");
  const antiPatterns = brief.quality.antiPatterns.map((item) => `- **${item.label}**: ${item.rejectWhen} Repair: ${item.repair}`).join("\n");
  const visualTreatment = brief.visualDirection.visualTreatment ?? {};
  const visualRejections = [...new Set([
    ...(brief.visualDirection.antiAiChecks ?? []),
    ...(visualTreatment.antiAiChecks ?? []),
  ])];
  const references = brief.referenceComposition.selected.length > 0
    ? brief.referenceComposition.selected.map((reference, index) => `- **${index + 1}. ${reference.label}** · ${reference.assignedRoleLabel} · ${reference.confidence}: ${reference.translate} Borrow: ${reference.borrow.join("；")} Reject: ${reference.reject.join("；")}`).join("\n")
    : "- No reference selected; use local evidence first.";
  const scoutHeading = brief.referenceScout.active ? "Global Product Reference Scout" : "External Reference Scout (inactive)";
  const sourceCandidates = brief.referenceScout.selected.length > 0
    ? brief.referenceScout.selected.map((source, index) => `- **${index + 1}. ${source.label}** · ${source.confidence}: ${source.why} ${source.urls.map((url) => `[official](${url})`).join(" · ")}`).join("\n")
    : brief.referenceScout.active
      ? "- No global product source selected; add product/category evidence first."
      : "- Inactive until a domain, audience, object, task, or named reference is supplied.";
  return `# Art Direction Brief (Candidate)

Query: **${brief.query || "(none)"}**
Local evidence: **${brief.evidence.localStatus}**${brief.evidence.localProject ? ` at \`${brief.evidence.localProject}\`` : ""}

## Direction

- Profile: **${rec.profile.label}** (${brief.confidence.profile})
- Surface mode: **${brief.decisions.surfaceMode}**
- Stance: **${rec.style.label}** (${brief.confidence.style})
- Signature move: ${brief.decisions.signatureMove}
- Visual direction: **${brief.visualDirection.label}** (${brief.visualDirection.confidence})
- Direction lock: ${brief.visualDirection.directionLock}
- Visual stance: **${visualTreatment.label ?? "not resolved"}** (${visualTreatment.confidence ?? "unknown"})
- Medium: ${brief.decisions.medium}
- Stack note: ${rec.stack.notes}

## Type, Color, And Motion

- Type: **${rec.type.label}**; ${rec.type.roles}
- Type ceiling: ${brief.decisions.typeCeiling}
- Palette candidate: **${rec.palette.label}** (${brief.confidence.palette})
- Semantic roles: ${paletteRoles}
- Motion: **${rec.motion.label}**; purpose: ${rec.motion.purpose}; range: ${rec.motion.range}
- Motion fallback: ${rec.motion.fallback}

## Component And State Direction

- Layout: ${rec.profile.layout}
- Visual anchor: ${rec.profile.anchor}
- Signature interaction: ${brief.decisions.signatureInteraction}
- Relevant states: ${rec.profile.states.join(", ")}
- Component shape: ${brief.decisions.componentShape}

## Visual Direction Contract

- First viewport: ${brief.visualDirection.firstViewport.layout}
- Alignment: ${brief.visualDirection.firstViewport.alignmentAxis}
- Card budget: ${brief.visualDirection.surfaceRules.cardBudget}
- Edge character: ${brief.visualDirection.geometryRules.edgeCharacter}
- Corner hierarchy: ${brief.visualDirection.geometryRules.cornerHierarchy}
- Separation: ${brief.visualDirection.geometryRules.separation}
- Line policy: ${brief.visualDirection.geometryRules.linePolicy}
- Sharp exception: ${brief.visualDirection.geometryRules.sharpException}
- Type rule: ${brief.visualDirection.typeRules.title}
- Spacing rhythm: ${brief.visualDirection.spacingRules.rhythm}
- Palette/material: ${visualTreatment.palette ?? "not recorded"}
- Treatment geometry: ${visualTreatment.geometry ?? "not recorded"}
- Signature device: ${visualTreatment.signatureDevice ?? "not recorded"}
- Expression budget: ${visualTreatment.expressionBudget ?? "not recorded"}

${renderAuthorityMarkdown(brief.visualDirection.constraintAuthority, { includeChecks: false })}

AI-default checks (advisory):
${visualRejections.map((check) => `- ${check}`).join("\n")}

## Reference Composition

The selected references are lenses with distinct jobs, not a checklist. The brief uses at most four and records what to borrow, reject, and translate:

${references}

## ${scoutHeading}

- Category: **${brief.referenceScout.category.label}** (${brief.referenceScout.category.confidence})
- Policy: quality and product fit outrank geography, popularity, and market proximity.

${sourceCandidates}

Live inspection prompts: ${brief.referenceScout.liveInspectionChecklist.join("；")}

## Intentionally Not Used

${bullets(brief.decisions.intentionalOmissions)}

## Evidence And Open Questions

Evidence cards:
${evidenceCards}

Scene dials:
${dials || "- No strong scene dial matched; keep the direction provisional."}

Quality gates:
${gates}

Anti-pattern watchlist:
${antiPatterns}

Open before implementation:
${bullets(brief.openEvidence)}

Implementation checks:
${brief.quality.implementationChecks.map((check) => `- ${check}`).join("\n")}

## Provenance

This is a local heuristic candidate, not a shipped design system. Verify it against the rendered product. Data sources: ${Object.values(brief.sources).map((source) => `\`${source}\``).join(", ")}.
`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const query = option(args, "query", args.positionals.join(" ") || "frontend interface");
  const projectRoot = option(args, "project");
  const brief = buildBrief({
    query,
    projectRoot: projectRoot ? resolve(projectRoot) : undefined,
    overrides: {
      profile: option(args, "profile"),
      style: option(args, "style"),
      type: option(args, "type"),
      palette: option(args, "palette"),
      motion: option(args, "motion"),
      stack: option(args, "stack"),
      authority: option(args, "authority"),
      creativeDirection: option(args, "creative-direction"),
      referenceInspected: Boolean(args.options["reference-inspected"]),
      acceptedConcept: Boolean(args.options["concept-accepted"]),
      modelProposal: Boolean(args.options["model-proposed"]),
    },
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? brief : renderBriefMarkdown(brief), {
    format,
    output: option(args, "output"),
  });
}

if (isMainModule(import.meta.url)) main();
