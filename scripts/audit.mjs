#!/usr/bin/env node

import { resolve } from "node:path";
import { buildBrief } from "./design-brief.mjs";
import { buildProjectGraph, queryProjectGraph } from "./project-graph.mjs";
import { asNumber, isMainModule, loadDataset, option, parseArgs, writeOutput } from "./lib.mjs";
import { queryResources } from "./resource-catalog.mjs";
import { buildMotionPlan } from "./transitions-adapter.mjs";
import { scanProject } from "./inspect-project.mjs";
import { buildReferenceBuild } from "./reference-build.mjs";
import { renderAuthorityMarkdown } from "./authority.mjs";

const HELP = `audit.mjs [project-root] [options]

Run the full frontend-art-direction decision pipeline. It combines local
evidence, a dependency graph, design intelligence, every saved reference lens,
resource provenance, the internal Transitions.dev motion bridge, and rendered
verification requirements without writing to the target project.

Options:
  --project <path>       Project root (also accepted as the first positional)
  --query <text>         Product, screen, or implementation question
  --motion               Keep the always-on internal Transitions.dev plan (default)
  --no-motion            Explicitly skip the motion plan for a constrained run
  --offline              Do not fetch a motion source; use the private cache
  --format md|json       Output format (default: md)
  --output <path>        Write the audit instead of stdout
  --limit <number>       Graph/resource result count (default: 5)
  --max-files <number>   Scan limit (default: 3000)
`;

export const REFERENCE_COVERAGE = [
  {
    id: "openai-product-design",
    requestedName: "OpenAI product design",
    capability: "reference/design routing, concept-first generation, and blocking visual QA",
    implementation: "scripts/reference-scout.mjs + references/reference-discovery.md + references/verification.md",
    command: "scout / brief / audit",
    status: "implemented-locally",
  },
  {
    id: "anthropic-frontend-design",
    requestedName: "Anthropic frontend design",
    capability: "deliberate aesthetic direction and rejection of generic AI-looking frontend output",
    implementation: "data/profiles.json + data/styles.json + data/quality-gates.json",
    command: "brief / audit",
    status: "implemented-locally",
  },
  {
    id: "premium-finish",
    capability: "grayscale hierarchy, optical alignment, material discipline, specific copy, and restrained interaction",
    implementation: "references/premium-finish.md + data/quality-gates.json + data/styles.json",
    command: "brief / audit",
    status: "implemented-locally",
  },
  {
    id: "ui-ux-pro-max",
    requestedName: "Nextlevelbuild / UI UX Pro Max",
    capability: "searchable design intelligence, style decisions, and quality gates",
    implementation: "scripts/design-brief.mjs + data/quality-gates.json",
    command: "brief / audit",
    status: "implemented-locally",
  },
  {
    id: "graphify",
    requestedName: "Graphify Labs",
    capability: "queryable repository structure with dependency neighborhoods",
    implementation: "scripts/project-graph.mjs",
    command: "graph / audit",
    status: "implemented-locally",
  },
  {
    id: "caveman",
    requestedName: "JuliusBrussee / Caveman",
    capability: "short, evidence-first agent output with a fixed response contract",
    implementation: "scripts/audit.mjs + references/response-contract.md",
    command: "audit",
    status: "implemented-locally",
  },
  {
    id: "composio",
    requestedName: "ComposioHQ curation",
    capability: "categorized resource discovery with practical entry points",
    implementation: "scripts/resource-catalog.mjs + data/resources.json",
    command: "resource / audit",
    status: "implemented-locally",
  },
  {
    id: "voltagent",
    requestedName: "VoltAgent curation",
    capability: "provenance-aware curation and trust tiers",
    implementation: "scripts/resource-catalog.mjs + data/resources.json",
    command: "resource / audit",
    status: "implemented-locally",
  },
  {
    id: "transitions",
    requestedName: "Transitions.dev Motion",
    capability: "Review -> Apply -> Polish with purpose, cleanup, reduced-motion, and fallback",
    implementation: "scripts/transitions-adapter.mjs",
    command: "motion / audit (always-on)",
    status: "implemented-with-private-cache",
  },
  {
    id: "reference-lenses",
    requestedName: "Saved visual and interaction references",
    capability: "role-based composition of visual, micro-interaction, motion, and source-owned UI references",
    implementation: "scripts/reference-composition.mjs + data/reference-lenses.json",
    command: "reference / brief / audit",
    status: "implemented-locally",
  },
  {
    id: "reference-build",
    requestedName: "Reference-led build contract",
    capability: "one-sentence reference-led build contract with visual genome, page plan, and acceptance gates",
    implementation: "scripts/reference-build.mjs + data/reference-recipes.json",
    command: "reference-build",
    status: "implemented-locally",
  },
  {
    id: "visual-treatment",
    requestedName: "Ordinary-site visual expression",
    capability: "separate content structure from palette, typography relationship, material logic, signature device, and expression budget",
    implementation: "scripts/visual-direction.mjs + data/visual-treatments.json + references/visual-composition.md",
    command: "direction / brief / reference-build / audit",
    status: "implemented-locally",
  },
  {
    id: "constraint-authority",
    requestedName: "Creative direction authority",
    capability: "hard-invariant protection with overrideable visual defaults and project-owned DESIGN.md precedence",
    implementation: "scripts/authority.mjs + data/constraint-policy.json + references/constraint-authority.md",
    command: "direction / brief / reference-build / audit",
    status: "implemented-locally",
  },
];

function buildReferenceInventory(composition, referenceBuild, referenceScout) {
  const selectedIds = new Set([
    ...(composition?.selected ?? []).map((item) => item.id),
    ...(referenceBuild?.selectedReferences ?? []).map((item) => item.id),
  ]);
  const primaryId = referenceBuild?.primaryReference?.id;
  const inventory = loadDataset("reference-lenses.json").references.map((reference) => ({
    id: reference.id,
    label: reference.label,
    sourceType: reference.sourceType,
    roles: reference.roles,
    url: reference.url,
    status: reference.id === primaryId ? "primary" : selectedIds.has(reference.id) ? "applied-support" : "considered",
    useWhen: reference.useWhen,
    avoidWhen: reference.avoidWhen,
  }));
  if (referenceBuild?.primaryReference?.scouted && !inventory.some((item) => item.id === primaryId)) {
    inventory.unshift({
      id: primaryId,
      label: referenceBuild.primaryReference.label,
      sourceType: referenceBuild.primaryReference.sourceType ?? "scouted-product",
      roles: referenceBuild.primaryReference.roles ?? ["product-object", "feature-proof"],
      url: referenceBuild.primaryReference.url,
      status: "primary-product",
      useWhen: "产品对象、材质、功能证明或使用场景需要真实产品参考时",
      avoidWhen: "不要复制品牌身份、原站文案或原站素材",
    });
  }
  for (const source of referenceScout?.selected ?? []) {
    if (inventory.some((item) => item.id === source.id)) continue;
    inventory.push({
      id: source.id,
      label: source.label,
      sourceType: source.sourceType ?? "scouted-product",
      roles: source.jobs ?? ["product-reference"],
      url: source.urls?.[0] ?? null,
      status: source.id === primaryId ? "primary-product" : "scouted-candidate",
      useWhen: source.why ?? "产品对象、材质、功能证明或使用场景需要真实产品参考时",
      avoidWhen: source.reject ?? "不要复制品牌身份、原站文案或原站素材",
    });
  }
  return inventory.map((reference) => ({
    ...reference,
    status: reference.status ?? (reference.id === primaryId ? "primary" : selectedIds.has(reference.id) ? "applied-support" : "considered"),
  }));
}

function buildResourceMatrix(resources) {
  const selectedIds = new Set((resources?.candidates ?? []).map((candidate) => candidate.id));
  return loadDataset("resources.json").resources.map((resource) => ({
    id: resource.id,
    label: resource.label,
    job: resource.job,
    category: resource.category,
    trustTier: resource.trustTier,
    sourceType: resource.sourceType,
    sourceUrl: resource.sourceUrl,
    installPolicy: resource.installPolicy,
    status: selectedIds.has(resource.id) ? "ranked-for-this-query" : "cataloged-for-review",
  }));
}

function buildControlDials(brief, referenceBuild) {
  const profile = brief.recommendation.profile;
  const style = brief.recommendation.style;
  const motion = brief.recommendation.motion;
  const surface = profile.surfaceMode;
  const visualVariance = ["editorial-authority", "quiet-luxury", "visual-object", "kinetic-product", "spatial-model-led"].includes(style.id)
    ? "high"
    : style.id === "evidence-led-neutral" ? "medium-provisional" : "medium";
  const motionIntensity = ["scroll-narrative", "model-inspection", "media-state", "purposeful-motion"].includes(motion.id)
    ? "medium until purpose is proven"
    : ["micro-feedback", "list-preserve-context"].includes(motion.id) ? "low-to-medium" : "medium";
  return {
    visualVariance,
    motionIntensity,
    informationDensity: profile.density ?? "medium",
    componentDistinctiveness: ["Editorial Marketing", "Spatial Experiential"].includes(surface) ? "high" : "medium",
    referenceFidelity: referenceBuild?.referenceMode === "named-reference" ? "high: three visible anchors required" : referenceBuild?.referenceMode === "scouted-reference" ? "high: object, material/proof, and interaction anchors required" : referenceBuild?.referenceMode === "inferred-reference" ? "medium: validate the inferred lens" : "adaptive: local evidence leads",
    assetExpression: ["Editorial Marketing", "Spatial Experiential"].includes(surface) ? "high only with real or target-specific media" : "restrained until the primary object proves it",
    visualDirection: brief.visualDirection?.id ?? "adaptive-asymmetric",
    visualTreatment: brief.visualDirection?.visualTreatment?.id ?? "quiet-editorial-studio",
    signatureDevice: brief.visualDirection?.visualTreatment?.signatureDevice ?? "not resolved",
    expressionBudget: brief.visualDirection?.visualTreatment?.expressionBudget ?? "not resolved",
    cardBudget: brief.visualDirection?.surfaceRules?.cardBudget ?? "not resolved",
    typeDiscipline: brief.visualDirection?.typeRules?.hierarchy ?? "not resolved",
    alignmentAxis: brief.visualDirection?.firstViewport?.alignmentAxis ?? "not resolved",
    authorityMode: brief.visualDirection?.constraintAuthority?.mode ?? "not resolved",
    authoritySource: brief.visualDirection?.constraintAuthority?.source ?? "not resolved",
    advisoryDefaultGuard: brief.visualDirection?.antiAiChecks?.join(" | ") ?? "not resolved",
    guardrail: "Increase one dial at a time; never use motion, effects, or a reference skin to compensate for missing product evidence.",
  };
}

function hasReferenceBuildSignal(query) {
  return /https?:\/\/|like\s+|similar\s+to|inspired\s+by|based\s+on|像|类似|参考|仿照|复刻/.test(String(query).toLocaleLowerCase());
}

function compact(value, max = 180) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 3)}...` : text;
}

export async function buildAudit({
  projectRoot,
  query = "frontend interface",
  motion = true,
  offline = false,
  maxFiles = 3000,
  limit = 5,
} = {}) {
  const root = resolve(projectRoot ?? process.cwd());
  const scan = scanProject(root, { maxFiles });
  const graph = buildProjectGraph(root, { maxFiles });
  const graphQuery = queryProjectGraph(graph, query, { limit });
  const brief = buildBrief({ query, projectRoot: root });
  const namedReferenceRequest = hasReferenceBuildSignal(query);
  const scoutedProductReference = !namedReferenceRequest && brief.referenceScout.active
    ? brief.referenceScout.selected[0]
    : null;
  const referenceBuild = buildReferenceBuild({
    query,
    projectRoot: root,
    profile: brief.directionMode === "adaptive-default" ? "" : `${brief.recommendation.profile.id} ${brief.recommendation.profile.surfaceMode}`,
    style: brief.directionMode === "adaptive-default" ? "" : `${brief.recommendation.style.id} ${brief.recommendation.style.label}`,
    motion: brief.directionMode === "adaptive-default" ? "" : `${brief.recommendation.motion.id} ${brief.recommendation.motion.label}`,
    reference: namedReferenceRequest ? query : "",
    allowInferred: namedReferenceRequest,
    referenceExplicit: namedReferenceRequest,
    productReference: scoutedProductReference,
  });
  const resources = queryResources(query, {
    stack: brief.recommendation.stack.id,
    limit: Math.max(limit, 8),
  });
  const includeMotion = motion !== false;
  let motionPlan = null;
  if (includeMotion) {
    motionPlan = await buildMotionPlan({
      intent: query,
      projectRoot: root,
      offline,
    });
  }

  const referenceInventory = buildReferenceInventory(brief.referenceComposition, referenceBuild, brief.referenceScout);
  const resourceMatrix = buildResourceMatrix(resources);
  const controlDials = buildControlDials(brief, referenceBuild);
  const pipeline = [
    { id: "inspect", label: "local project inspection", status: "completed", evidence: `${scan.scan.fileCount} files scanned` },
    { id: "graphify", label: "repository graph and dependency context", status: "completed", evidence: `${graph.scan.graphNodes} nodes / ${graph.scan.graphEdges} edges` },
    { id: "design-intelligence", label: "design intelligence and quality gates", status: "completed", evidence: `${brief.quality.gates.length} gates / ${brief.quality.antiPatterns.length} anti-patterns` },
    { id: "visual-direction", label: `visual direction contract: ${brief.visualDirection.label} / ${brief.visualDirection.visualTreatment.label}`, status: "completed", evidence: `${brief.visualDirection.firstViewport.layout}; ${brief.visualDirection.visualTreatment.signatureDevice}` },
    { id: "direction-authority", label: `creative direction authority: ${brief.visualDirection.constraintAuthority.mode}`, status: "completed", evidence: `${brief.visualDirection.constraintAuthority.source}; advisory defaults remain overrideable` },
    { id: "reference-lenses", label: "all saved reference lenses considered", status: "completed", evidence: `${referenceInventory.length} lenses cataloged; ${referenceInventory.filter((item) => item.status !== "considered").length} applied` },
    { id: "reference-build", label: "reference/build contract", status: "completed", evidence: `${referenceBuild.referenceMode} / ${referenceBuild.primaryReference.label}` },
    { id: "resource-catalog", label: "local decision resource classification", status: "completed", evidence: `${resourceMatrix.length} resources cataloged; ${resources.candidates.length} ranked for this query` },
    { id: "transitions", label: "Transitions.dev Review -> Apply -> Polish", status: motionPlan ? motionPlan.source.status === "unavailable" ? "completed-with-warning" : "completed" : "skipped", evidence: motionPlan ? `${motionPlan.selected.length} candidate recipes; source ${motionPlan.source.status}` : "explicitly disabled" },
    { id: "verification", label: "rendered verification contract", status: "completed", evidence: "desktop, mobile, non-default, reduced-motion, and console checks required" },
  ];

  const unresolved = graph.nodes.filter((node) => node.kind === "unresolved").length;
  const open = [
    ...brief.openEvidence.slice(0, 3),
    ...(unresolved > 0 ? [`${unresolved} unresolved relative import${unresolved === 1 ? "" : "s"} remain visible in the graph; verify aliases or generated files.`] : []),
    "Static audit does not prove runtime behavior or visual quality; exercise the target surface and capture rendered evidence.",
  ];
  if (motionPlan?.source?.status !== "cached" && motionPlan?.source?.status !== "fetched") {
    open.push(`Motion source status is ${motionPlan?.source?.status ?? "unknown"}; inspect the returned source before applying a recipe.`);
  }

  return {
    project: root,
    query,
    contract: "Decision / Changed / Proof / Open",
    decision: `Run the full pipeline for ${brief.recommendation.profile.label} with ${brief.recommendation.style.label}; use ${brief.visualDirection.constraintAuthority.label} as the creative authority, keep ${brief.visualDirection.label} as a candidate where it does not conflict, then anchor the first pass on ${brief.recommendation.profile.anchor}.`,
    changed: "No target project files changed; this full audit reads local evidence, evaluates every capability, and produces an implementation contract.",
    pipeline,
    controlDials,
    proof: {
      scan: {
        status: scan.status,
        files: scan.scan.fileCount,
        frameworks: scan.stack.frameworks,
        paths: scan.evidence.slice(0, 5).map((item) => ({ kind: item.kind, paths: item.paths.slice(0, 4) })),
      },
      graph: {
        nodes: graph.scan.graphNodes,
        edges: graph.scan.graphEdges,
        hotspots: graph.hotspots.slice(0, 5).map((node) => ({ path: node.path ?? node.label, kind: node.kind, degree: node.degree })),
        query: graphQuery.results.slice(0, limit),
      },
      direction: {
        profile: brief.recommendation.profile.id,
        style: brief.recommendation.style.id,
        confidence: brief.confidence,
        visualDirection: brief.visualDirection,
        constraintAuthority: brief.visualDirection.constraintAuthority,
        qualityGates: brief.quality.gates.slice(0, 4).map((gate) => gate.id),
        antiPatterns: brief.quality.antiPatterns.slice(0, 3).map((item) => item.id),
        controlDials,
      },
      referenceComposition: {
        policy: brief.referenceComposition.selectionPolicy,
        selected: brief.referenceComposition.selected.map((reference) => ({
          id: reference.id,
          label: reference.label,
          role: reference.assignedRoleLabel,
          confidence: reference.confidence,
          borrow: reference.borrow,
          reject: reference.reject,
          translate: reference.translate,
        })),
        notSelected: brief.referenceComposition.notSelected,
      },
      referenceScout: {
        category: brief.referenceScout.category,
        selected: brief.referenceScout.selected.slice(0, 4).map((source) => ({
          id: source.id,
          label: source.label,
          qualityTier: source.qualityTier,
          confidence: source.confidence,
          jobs: source.jobs,
          urls: source.urls,
          why: source.why,
        })),
      },
      referenceBuild: referenceBuild ? {
        primaryReference: referenceBuild.primaryReference,
        referenceMode: referenceBuild.referenceMode,
        visualGenome: referenceBuild.visualGenome,
        fidelityAnchors: referenceBuild.fidelityAnchors,
        referenceEvidence: referenceBuild.referenceEvidence,
        visualDirection: referenceBuild.visualDirection,
        firstViewport: referenceBuild.firstViewport,
        sections: referenceBuild.pagePlan.map((section) => section.id),
        acceptance: referenceBuild.acceptance,
      } : null,
      referenceInventory: referenceInventory.map((reference) => ({
        id: reference.id,
        label: reference.label,
        status: reference.status,
        roles: reference.roles,
      })),
      resources: resources.candidates.slice(0, Math.min(limit, 4)).map((candidate) => ({
        id: candidate.id,
        label: candidate.label,
        trustTier: candidate.trustTier,
        why: candidate.why,
        installPolicy: candidate.installPolicy,
      })),
      motion: motionPlan ? {
        source: motionPlan.source.status,
        selected: motionPlan.selected.slice(0, 3).map((item) => ({ id: item.id, confidence: item.confidence })),
        workflow: ["review", "apply", "polish"].filter((phase) => motionPlan.workflow[phase]),
        guardrails: motionPlan.guardrails,
      } : null,
    },
    direction: {
      profile: brief.recommendation.profile,
      style: brief.recommendation.style,
      type: brief.recommendation.type,
      palette: brief.recommendation.palette,
      motion: brief.recommendation.motion,
      stack: brief.recommendation.stack,
      visualDirection: brief.visualDirection,
      sceneDials: brief.quality.dials,
      qualityGates: brief.quality.gates,
      antiPatterns: brief.quality.antiPatterns,
    },
    referenceComposition: brief.referenceComposition,
    referenceBuild,
    referenceInventory,
    resources,
    resourceMatrix,
    motion: motionPlan,
    referenceCoverage: REFERENCE_COVERAGE,
    open,
    next: [
      `node <skill-root>/scripts/project-map.mjs ${root} --query "${query}" --format md`,
      includeMotion ? `node <skill-root>/scripts/transitions-adapter.mjs --intent "${query}" --project ${root} --phase all --format md` : "Run the target app and capture one default plus one non-default state.",
      `node <skill-root>/scripts/reference-scout.mjs --query "${query}" --format md`,
      `node <skill-root>/scripts/reference-build.mjs --query "${query}" --project ${root} --format md`,
    ],
  };
}

export function renderAuditMarkdown(audit) {
  const graphHits = audit.proof.graph.query.length > 0
    ? audit.proof.graph.query.slice(0, 5).map((item) => `- \`${item.path ?? item.label}\` (${item.kind}, ${item.score})`).join("\n")
    : "- No graph node matched the query.";
  const resources = audit.proof.resources.length > 0
    ? audit.proof.resources.map((item) => `- **${item.label}**: ${item.why}; trust ${item.trustTier}/5; ${item.installPolicy}`).join("\n")
    : "- No resource candidate; inspect local primitives first.";
  const motion = audit.proof.motion
    ? `\n## Motion\n\n- Source: **${audit.proof.motion.source}**\n- Recipes: ${audit.proof.motion.selected.map((item) => `\`${item.id}\` (${item.confidence})`).join(", ") || "none"}\n- Phases: ${audit.proof.motion.workflow.join(" -> ") || "review only"}\n- Guardrails: purpose, cleanup, reduced-motion, fallback are included.\n`
    : "";
  const referenceComposition = audit.proof.referenceComposition;
  const references = referenceComposition?.selected?.length > 0
    ? referenceComposition.selected.map((reference) => `- **${reference.label}** · ${reference.role} · ${reference.confidence}\n  - Borrow: ${reference.borrow.join("；")}\n  - Reject: ${reference.reject.join("；")}\n  - Translate: ${reference.translate}`).join("\n")
    : "- No reference selected; use local evidence first.";
  const referenceScout = audit.proof.referenceScout?.selected?.length > 0
    ? audit.proof.referenceScout.selected.map((source) => `- **${source.label}** · ${source.confidence} · ${source.jobs.join(", ")} · ${source.urls.join(" / ")}`).join("\n")
    : audit.proof.referenceScout?.category?.id === "unspecified"
      ? "- Inactive until a domain, audience, object, task, or named reference is supplied."
      : "- No product source candidate; add category or object evidence first.";
  const referenceBuild = audit.proof.referenceBuild
    ? `\n## Reference Build\n\n- Mode: **${audit.proof.referenceBuild.referenceMode}**\n- Primary reference: **${audit.proof.referenceBuild.primaryReference.label}**\n- Visual genome: ${audit.proof.referenceBuild.visualGenome.family}; ${audit.proof.referenceBuild.visualGenome.layout}\n- Visual direction: **${audit.proof.referenceBuild.visualDirection?.label ?? "not resolved"}**; visual stance **${audit.proof.referenceBuild.visualDirection?.visualTreatment?.label ?? "not resolved"}**; ${audit.proof.referenceBuild.visualDirection?.surfaceRules?.cardBudget ?? "card budget not recorded"}\n- Fidelity anchors: ${Object.values(audit.proof.referenceBuild.fidelityAnchors ?? {}).join("；")}\n- Product evidence: ${audit.proof.referenceBuild.referenceEvidence?.visualSignals?.join("；") || "inspect the selected source before locking visual values"}\n- First viewport: ${audit.proof.referenceBuild.firstViewport.layout}\n- Sections: ${audit.proof.referenceBuild.sections.join(", ")}\n- Acceptance: ${audit.proof.referenceBuild.acceptance.join("；")}\n`
    : "";
  const pipeline = audit.pipeline?.map((item) => `- **${item.status}** ${item.label}: ${item.evidence}`).join("\n") ?? "- Pipeline status unavailable.";
  const dials = Object.entries(audit.controlDials ?? {}).map(([key, value]) => `- **${key}**: ${value}`).join("\n") || "- No control dials recorded.";
  const aiDefaultRejections = [...new Set([
    ...(audit.proof.direction.visualDirection?.antiAiChecks ?? []),
    ...(audit.proof.direction.visualDirection?.visualTreatment?.antiAiChecks ?? []),
  ])].map((item) => `- ${item}`).join("\n") || "- No AI-default check list recorded.";
  const inventory = audit.referenceInventory?.map((item) => `- **${item.status}** ${item.label} · ${item.roles.join(", ")}`).join("\n") || "- No reference inventory recorded.";
  const resourceMatrix = audit.resourceMatrix?.map((item) => `- **${item.status}** ${item.label} · ${item.category} · trust ${item.trustTier}/5 · ${item.installPolicy}`).join("\n") || "- No resource matrix recorded.";
  const open = audit.open.slice(0, 6).map((item) => `- ${compact(item)}`).join("\n");
  const coverage = audit.referenceCoverage.map((item) => `- **${item.id}**: ${item.status}; ${item.implementation}`).join("\n");
  const referenceScoutHeading = audit.proof.referenceScout?.category?.id === "unspecified"
    ? "## External Reference Scout (inactive)"
    : "## Global Product Reference Scout";
  return `# Frontend Decision Audit

Query: **${audit.query}**

## Decision

${audit.decision}

## Changed

${audit.changed}

## Proof

- Local scan: **${audit.proof.scan.status}**, ${audit.proof.scan.files} files; stack: ${audit.proof.scan.frameworks.join(", ") || "not confirmed"}
- Graph: **${audit.proof.graph.nodes} nodes / ${audit.proof.graph.edges} edges**
- Direction: **${audit.proof.direction.profile}** + **${audit.proof.direction.style}**
- Visual direction: **${audit.proof.direction.visualDirection?.label ?? "not resolved"}**; visual stance **${audit.proof.direction.visualDirection?.visualTreatment?.label ?? "not resolved"}**; authority **${audit.proof.direction.constraintAuthority?.label ?? "not resolved"}**; ${audit.proof.direction.visualDirection?.firstViewport?.alignmentAxis ?? "alignment axis not recorded"}
- Quality gates: ${audit.proof.direction.qualityGates.join(", ")}

## Full Pipeline

${pipeline}

## Internal Control Dials

${dials}

${renderAuthorityMarkdown(audit.proof.direction.constraintAuthority)}

## AI-Default Checks (Advisory)

${aiDefaultRejections}

Graph evidence:
${graphHits}

Resource candidates:
${resources}
${motion}
## Reference Composition

${referenceComposition?.policy ?? "Select references by distinct job, not by checklist."}

${references}

${referenceScoutHeading}

- Category: **${audit.proof.referenceScout?.category?.label ?? "not resolved"}** (${audit.proof.referenceScout?.category?.confidence ?? "unknown"})
- Policy: choose by product fit and demonstrated quality; do not use geography as a quota.

${referenceScout}

${referenceBuild}

## Reference Inventory

All saved lenses are considered locally on every full run; only distinct, evidenced jobs are applied to the target:

${inventory}

## Resource Decision Matrix

${resourceMatrix}

## Reference Coverage

${coverage}

## Open

${open}

## Next

${audit.next.map((item) => `- ${item}`).join("\n")}
`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const root = option(args, "project", args.positionals[0] ?? process.cwd());
  const query = option(args, "query", args.positionals.slice(1).join(" ") || "frontend interface");
  const audit = await buildAudit({
    projectRoot: root,
    query,
    motion: !Boolean(args.options["no-motion"]),
    offline: Boolean(args.options.offline),
    maxFiles: asNumber(option(args, "max-files", 3000), 3000),
    limit: asNumber(option(args, "limit", 5), 5),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? audit : renderAuditMarkdown(audit), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
