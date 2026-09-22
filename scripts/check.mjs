#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { tmpdir } from "node:os";
import { buildAudit, renderAuditMarkdown } from "./audit.mjs";
import { buildBrief, renderBriefMarkdown } from "./design-brief.mjs";
import { REPO_ROOT, isMainModule, readJson, walkFiles } from "./lib.mjs";
import { renderScanMarkdown, scanProject } from "./inspect-project.mjs";
import { buildProjectGraph, queryProjectGraph, renderGraphMarkdown } from "./project-graph.mjs";
import { mapProject, renderMapMarkdown } from "./project-map.mjs";
import { queryResources, renderResourceMarkdown } from "./resource-catalog.mjs";
import { renderReferenceComposition, selectReferenceComposition } from "./reference-composition.mjs";
import { buildReferenceBuild, renderReferenceBuild } from "./reference-build.mjs";
import { renderReferenceScout, scoutReferences } from "./reference-scout.mjs";
import { renderVisualDirection, selectVisualDirection } from "./visual-direction.mjs";

const root = REPO_ROOT;
const errors = [];
const notes = [];

function fail(message) {
  errors.push(message);
}

function assertExists(path) {
  if (!existsSync(path)) fail(`missing: ${relative(root, path)}`);
}

function parseFrontmatter(content) {
  if (!content.startsWith("---\n")) return null;
  const end = content.indexOf("\n---", 4);
  if (end < 0) return null;
  return content.slice(4, end);
}

function checkMarkdownLinks() {
  const markdownFiles = walkFiles(root).filter((file) => file.endsWith(".md"));
  for (const file of markdownFiles) {
    const content = readFileSync(file, "utf8");
    const links = [...content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)].map((match) => match[1]);
    for (const link of links) {
      if (/^(https?:|mailto:|#)/.test(link)) continue;
      const clean = link.split("#")[0];
      if (!clean) continue;
      const target = resolve(file, "..", clean);
      if (!existsSync(target)) fail(`broken link: ${relative(root, file)} -> ${link}`);
    }
  }
}

function checkData() {
  const dataFiles = ["profiles.json", "styles.json", "types.json", "palettes.json", "motion.json", "stacks.json", "quality-gates.json", "resources.json", "reference-lenses.json", "reference-recipes.json", "reference-sources.json", "visual-directions.json", "visual-treatments.json", "constraint-policy.json"];
  const datasets = {};
  for (const file of dataFiles) {
    const path = join(root, "data", file);
    try {
      const data = readJson(path);
      datasets[file] = data;
      const collection = Object.values(data).find((value) => Array.isArray(value));
      if (!collection || collection.length === 0) fail(`empty dataset: data/${file}`);
      const ids = collection?.map((item) => item.id) ?? [];
      if (new Set(ids).size !== ids.length) fail(`duplicate dataset id: data/${file}`);
    } catch (error) {
      fail(`invalid JSON: data/${file}: ${error.message}`);
    }
  }
  const ids = (file, key) => new Set((datasets[file]?.[key] ?? []).map((item) => item.id));
  const styleIds = ids("styles.json", "styles");
  const typeIds = ids("types.json", "types");
  const paletteIds = ids("palettes.json", "palettes");
  const motionIds = ids("motion.json", "motions");
  if (!(datasets["quality-gates.json"]?.qualityGates ?? []).some((gate) => gate.id === "asset-readiness")) fail("quality gates are missing asset-readiness");
  if (!(datasets["quality-gates.json"]?.qualityGates ?? []).some((gate) => gate.id === "premium-finish")) fail("quality gates are missing premium-finish");
  if (!(datasets["quality-gates.json"]?.qualityGates ?? []).some((gate) => gate.id === "reference-fidelity")) fail("quality gates are missing reference-fidelity");
  if (!(datasets["quality-gates.json"]?.qualityGates ?? []).some((gate) => gate.id === "visual-direction")) fail("quality gates are missing visual-direction");
  if (!(datasets["quality-gates.json"]?.qualityGates ?? []).some((gate) => gate.id === "constraint-authority")) fail("quality gates are missing constraint-authority");
  if (!(datasets["constraint-policy.json"]?.hardInvariants ?? []).some((item) => item.id === "semantic-accessibility")) fail("constraint policy is missing semantic-accessibility");
  if (!(datasets["constraint-policy.json"]?.advisoryDefaults ?? []).some((item) => item.id === "ai-default-composition")) fail("constraint policy is missing advisory AI-default composition policy");
  if (!ids("styles.json", "styles").has("quiet-luxury")) fail("styles are missing quiet-luxury");
  for (const profile of datasets["profiles.json"]?.profiles ?? []) {
    for (const [field, set] of [["stance", styleIds], ["type", typeIds], ["palette", paletteIds], ["motion", motionIds]]) {
      if (!set.has(profile[field])) fail(`profile ${profile.id} references missing ${field}: ${profile[field]}`);
    }
  }
  for (const style of datasets["styles.json"]?.styles ?? []) {
    for (const profileId of style.bestFor ?? []) {
      if (!(datasets["profiles.json"]?.profiles ?? []).some((profile) => profile.id === profileId)) {
        fail(`style ${style.id} references missing profile: ${profileId}`);
      }
    }
  }
  for (const reference of datasets["reference-lenses.json"]?.references ?? []) {
    if (!reference.url || !/^https?:\/\//.test(reference.url)) fail(`reference ${reference.id} has no valid URL`);
    if (!Array.isArray(reference.roles) || reference.roles.length === 0) fail(`reference ${reference.id} has no roles`);
    if (!Array.isArray(reference.borrow) || reference.borrow.length === 0) fail(`reference ${reference.id} has no borrow guidance`);
    if (!Array.isArray(reference.reject) || reference.reject.length === 0) fail(`reference ${reference.id} has no reject guidance`);
    if (!reference.visual?.family || !reference.visual?.motion) fail(`reference ${reference.id} has incomplete visual lens data`);
  }
  const lensIds = new Set((datasets["reference-lenses.json"]?.references ?? []).map((reference) => reference.id));
  for (const recipe of datasets["reference-recipes.json"]?.recipes ?? []) {
    if (!lensIds.has(recipe.referenceId)) fail(`recipe ${recipe.referenceId} has no matching reference lens`);
    if (!recipe.archetype || !recipe.firstViewport || !Array.isArray(recipe.sections) || recipe.sections.length === 0) fail(`recipe ${recipe.referenceId} is incomplete`);
    if (!recipe.motionContract?.review || !recipe.motionContract?.fallback) fail(`recipe ${recipe.referenceId} has incomplete motion contract`);
    if (!recipe.tokenSeed?.canvas || !recipe.tokenSeed?.radius || !recipe.tokenSeed?.spacing || !recipe.tokenSeed?.type) fail(`recipe ${recipe.referenceId} has incomplete token seed`);
  }
  for (const source of datasets["reference-sources.json"]?.sources ?? []) {
    if (!source.sourceType || !Number.isFinite(source.qualityTier)) fail(`reference source ${source.id} has incomplete provenance`);
    if (!Array.isArray(source.urls) || source.urls.length === 0 || source.urls.some((url) => !/^https?:\/\//.test(url))) fail(`reference source ${source.id} has invalid URLs`);
    if (!Array.isArray(source.roles) || source.roles.length === 0 || !Array.isArray(source.borrow) || source.borrow.length === 0 || !Array.isArray(source.reject) || source.reject.length === 0) fail(`reference source ${source.id} has incomplete decision guidance`);
  }
  for (const direction of datasets["visual-directions.json"]?.directions ?? []) {
    if (!direction.label || !direction.signature) fail(`visual direction ${direction.id} has no label/signature`);
    if (!direction.firstViewport?.layout || !direction.firstViewport?.alignmentAxis || !direction.firstViewport?.dominant) fail(`visual direction ${direction.id} has incomplete first viewport contract`);
    if (!direction.typeRules?.title || !direction.typeRules?.hierarchy) fail(`visual direction ${direction.id} has incomplete type rules`);
    if (!direction.spacingRules?.rhythm || !direction.surfaceRules?.cardBudget) fail(`visual direction ${direction.id} has incomplete spacing/surface rules`);
    if (!Array.isArray(direction.antiAiChecks) || direction.antiAiChecks.length < 3) fail(`visual direction ${direction.id} has too few AI-default checks`);
    if (!Array.isArray(direction.renderChecks) || direction.renderChecks.length < 2) fail(`visual direction ${direction.id} has too few render checks`);
  }
  const directionIds = ids("visual-directions.json", "directions");
  const profileIds = ids("profiles.json", "profiles");
  const treatmentStyleIds = ids("styles.json", "styles");
  for (const treatment of datasets["visual-treatments.json"]?.treatments ?? []) {
    if (!treatment.label || !treatment.signature || !treatment.palette || !treatment.typography || !treatment.composition) fail(`visual treatment ${treatment.id} is incomplete`);
    if (!Array.isArray(treatment.directionIds) || treatment.directionIds.some((id) => !directionIds.has(id))) fail(`visual treatment ${treatment.id} references a missing direction`);
    if (!Array.isArray(treatment.profileIds) || treatment.profileIds.some((id) => !profileIds.has(id))) fail(`visual treatment ${treatment.id} references a missing profile`);
    if (!Array.isArray(treatment.styleIds) || treatment.styleIds.some((id) => !treatmentStyleIds.has(id))) fail(`visual treatment ${treatment.id} references a missing style`);
    if (!Array.isArray(treatment.antiAiChecks) || treatment.antiAiChecks.length < 3) fail(`visual treatment ${treatment.id} has too few AI-default checks`);
    if (!Array.isArray(treatment.renderChecks) || treatment.renderChecks.length < 2) fail(`visual treatment ${treatment.id} has too few render checks`);
  }
}

function checkScripts() {
  const scripts = walkFiles(join(root, "scripts")).filter((file) => file.endsWith(".mjs"));
  scripts.push(join(root, "bin", "frontend-art-direction.js"));
  for (const script of scripts) {
    try {
      execFileSync(process.execPath, ["--check", script], { stdio: "pipe" });
    } catch (error) {
      fail(`syntax error: ${relative(root, script)}: ${error.stderr?.toString().trim() || error.message}`);
    }
  }
}

function checkPackage() {
  const packageJson = readJson(join(root, "package.json"));
  for (const required of ["SKILL.md", "README.md", "agents", "bin", "scripts", "data", "references", "templates", "docs"]) {
    if (!packageJson.files.includes(required)) fail(`package.files does not include ${required}`);
  }
  if (packageJson.type !== "module") fail("package.json must use type=module");
  if (!packageJson.scripts?.test) fail("package.json is missing the test script");
  for (const script of ["graph", "brief", "direction", "reference", "scout", "reference-build", "resource", "audit", "motion"]) {
    if (!packageJson.scripts?.[script]) fail(`package.json is missing the ${script} script`);
  }
}

function checkSkill() {
  const skill = readFileSync(join(root, "SKILL.md"), "utf8");
  const frontmatter = parseFrontmatter(skill);
  if (!frontmatter) fail("SKILL.md is missing YAML frontmatter");
  if (!/^name:\s*frontend-art-direction/m.test(frontmatter ?? "")) fail("SKILL.md frontmatter has no name");
  if (!/^description:\s*.+/m.test(frontmatter ?? "")) fail("SKILL.md frontmatter has no description");
  const lines = skill.split("\n").length;
  if (lines > 220) fail(`SKILL.md is too large (${lines} lines; keep the router small)`);
  if (/TODO|TBD|your text here|lorem ipsum/i.test(skill)) fail("SKILL.md contains unfinished placeholder text");
  if (!skill.includes("Asset priority is user-provided")) fail("SKILL.md is missing the default asset policy");
}

async function checkSmoke() {
  try {
    const report = scanProject(root, { maxFiles: 5000 });
    if (!report.stack.frameworks.includes("vite") && !report.stack.frameworks.includes("react")) {
      notes.push("repository itself is a skill package, so its scan has no frontend framework signal");
    }
    const brief = buildBrief({ query: "analytics dashboard for operators", projectRoot: root });
    const map = mapProject(root, "where is the package test script", { limit: 5 });
    const graph = buildProjectGraph(root);
    const graphQuery = queryProjectGraph(graph, "motion adapter design brief", { limit: 5 });
    const resources = queryResources("modal transition cleanup", { stack: "react", limit: 4 });
    const rewampResources = queryResources("Rewamp UI component workbench", { stack: "react", limit: 4 });
    const genericResources = queryResources("我要一个网站", { limit: 8 });
    const references = selectReferenceComposition("AI agent dashboard with approval modal", {
      profile: "agent workspace",
      style: "instrument panel",
      motion: "modal continuity",
      limit: 4,
    });
    const microReferences = selectReferenceComposition("polish the button hover micro-interaction", { limit: 4 });
    const rewampReferences = selectReferenceComposition("build a searchable component workbench like Rewamp UI", { limit: 4 });
    const noReference = selectReferenceComposition("我要一个网站");
    const transactionBrief = buildBrief({ query: "商品支付与订单流程" });
    const genericBrief = buildBrief({ query: "我要一个网站" });
    const genericScout = scoutReferences("我要一个网站");
    const hardwareScout = scoutReferences("高端硬件外设官网", { limit: 4 });
    const hardwareBrief = buildBrief({ query: "高端硬件外设官网" });
    const premiumBrief = buildBrief({ query: "高端品牌官网，要求有质感" });
    const genericDirection = selectVisualDirection("我要一个网站", { adaptiveDefault: true });
    const hardwareDirection = selectVisualDirection("premium keyboard and mouse product website", { profile: "hardware-product-story" });
    const analyticsDirection = selectVisualDirection("analytics dashboard", { profile: "data-workbench" });
    const agentDirection = selectVisualDirection("AI agent dashboard with approval modal", { profile: "productive-app" });
    const galleryDirection = selectVisualDirection("component gallery like Rare UI", { reference: "rare-ui" });
    const rewampDirection = selectVisualDirection("searchable component workbench like Rewamp UI", { reference: "rewamp-ui" });
    const companyDirection = selectVisualDirection("公司官网", { profile: "editorial-marketing", style: "editorial-authority" });
    const projectOwnedDirection = selectVisualDirection("内部品牌工作台", {
      project: {
        designAuthority: {
          exists: true,
          path: "DESIGN.md",
          authority: "project-owned",
          confidence: "high",
          hasDirectionContract: true,
        },
      },
    });
    const inspectedReferenceDirection = selectVisualDirection("component gallery like Rare UI", {
      reference: "rare-ui",
      referenceInspected: true,
    });
    const modelDirection = selectVisualDirection("experimental editorial interface", {
      authority: "model",
      modelProposal: true,
      creativeDirection: "A sparse, typographic, intentionally asymmetric reading instrument.",
    });
    const authorityFixture = mkdtempSync(join(tmpdir(), "frontend-art-direction-authority-"));
    try {
      writeFileSync(join(authorityFixture, "DESIGN.md"), `# DESIGN.md\n\n## Direction\n- Design stance: brutalist editorial instrument\n- Signature move: oversized index and hard rules\n- What is intentionally not used: soft cards\n`);
      const scannedAuthority = scanProject(authorityFixture);
      const scannedDirection = selectVisualDirection("内部工作台", { project: scannedAuthority });
      if (scannedAuthority.designAuthority?.path !== "DESIGN.md" || scannedAuthority.designAuthority?.confidence !== "high") fail("inspect did not detect the project-owned DESIGN.md authority");
      if (scannedDirection.constraintAuthority?.mode !== "project-owned" || scannedDirection.constraintAuthority?.projectDesign?.fields?.["design-stance"] !== "brutalist editorial instrument") fail("scanned DESIGN.md authority was not carried into the direction contract");
    } finally {
      rmSync(authorityFixture, { recursive: true, force: true });
    }
    const referenceBuild = buildReferenceBuild({
      query: "Build a component gallery for our analytics SDK like Rare UI",
      projectRoot: root,
    });
    const magicBuild = buildReferenceBuild({
      query: "Build a high-impact landing block like Magic UI",
    });
    const rewampBuild = buildReferenceBuild({
      query: "Build a searchable component workbench like Rewamp UI",
    });
    const externalBuild = buildReferenceBuild({
      query: "Build a product like https://example.com/visual-tool for our workflow",
    });
    const audit = await buildAudit({ projectRoot: root, query: "analytics dashboard", offline: true, limit: 4 });
    const referenceAudit = await buildAudit({ projectRoot: root, query: "Build a component gallery like Rare UI", offline: true, limit: 4 });
    const hardwareAudit = await buildAudit({ projectRoot: root, query: "高端硬件外设类网站", offline: true, limit: 4 });
    const motionAudit = await buildAudit({ projectRoot: root, query: "modal transition cleanup", motion: true, offline: true, limit: 4 });
    if (!brief.recommendation.profile?.id || !brief.recommendation.motion?.id) fail("brief smoke output is incomplete");
    if (!map.results.some((item) => item.path === "package.json")) fail("project map did not rank package.json for a package query");
    if (graph.scan.graphNodes === 0 || graph.scan.graphEdges === 0) fail("project graph smoke output is empty");
    if (graphQuery.results.length === 0) fail("project graph query returned no results");
    if (resources.candidates.length === 0) fail("resource catalog smoke output is empty");
    if (!rewampResources.candidates.some((item) => item.id === "rewamp-ui-components")) fail("resource catalog did not route the named Rewamp UI component source");
    if (genericResources.candidates.length !== 1 || genericResources.candidates[0].id !== "local-primitives") fail("underspecified resource query ranked unrelated dependencies");
    if (references.selected.length < 2 || references.selected.length > 4) fail("reference composition did not respect the 2-4 lens budget");
    if (new Set(references.selected.map((item) => item.id)).size !== references.selected.length) fail("reference composition selected duplicate lenses");
    if (references.selected.some((item) => item.borrow.length === 0 || item.reject.length === 0 || !item.translate)) fail("reference composition guidance is incomplete");
    if (!microReferences.requiredRoles.some((role) => role.id === "micro-interaction") || !microReferences.selected.some((item) => ["bencho", "design-spells", "react-bits", "obsidian-ui"].includes(item.id))) fail("micro-interaction reference routing is incomplete");
    if (!rewampReferences.selected.some((item) => item.id === "rewamp-ui")) fail("reference composition did not route the named Rewamp UI workbench lens");
    if (noReference.mode !== "no-reference-default" || noReference.selected.length !== 0) fail("no-reference mode forced an external visual lens");
    if (transactionBrief.recommendation.profile.id !== "commerce-flow" || transactionBrief.recommendation.style.id !== "visual-object") fail("explicit transaction matching did not resolve the commerce profile");
    if (transactionBrief.referenceComposition.selected.some((item) => ["rare-ui", "beautiful-ui", "beui"].includes(item.id))) fail("transaction brief imported a visual showcase lens");
    if (genericBrief.directionMode !== "adaptive-default" || genericBrief.recommendation.profile.id !== "adaptive-surface" || genericBrief.recommendation.style.id !== "evidence-led-neutral") fail("underspecified request did not resolve the adaptive default");
    if (genericBrief.referenceComposition.selected.length !== 0 || genericBrief.referenceScout.active) fail("underspecified request forced a reference or product category");
    if (genericScout.active || genericScout.selected.length !== 0) fail("generic request activated the product reference scout without category evidence");
    if (!hardwareScout.active || !hardwareScout.selected.some((item) => item.id === "apple-product")) fail("hardware reference scout did not return a global official benchmark");
    if (hardwareBrief.recommendation.profile.id !== "hardware-product-story" || hardwareBrief.recommendation.style.id !== "premium-industrial") fail("hardware request did not resolve the hardware product direction");
    if (premiumBrief.recommendation.style.id !== "quiet-luxury" || premiumBrief.recommendation.palette.id !== "tonal-studio" || !premiumBrief.quality.gates.some((gate) => gate.id === "premium-finish")) fail("premium request did not resolve the premium finish direction");
    if (genericDirection.id !== "adaptive-asymmetric" || genericDirection.mode !== "adaptive" || genericDirection.visualTreatment?.id !== "quiet-editorial-studio" || genericDirection.visualTreatment?.confidence !== "provisional" || genericDirection.constraintAuthority?.mode !== "adaptive-default" || !genericDirection.constraintAuthority?.canOverrideAdvisory || genericDirection.constraintAuthority?.creativeFreedom !== "open-with-proof") fail("generic visual direction did not stay adaptive with an overrideable provisional authority");
    if (hardwareDirection.id !== "object-led-editorial" || analyticsDirection.id !== "data-detail-workbench" || agentDirection.id !== "stateful-instrument" || galleryDirection.id !== "specimen-catalog" || rewampDirection.id !== "specimen-catalog") fail("visual direction routing did not resolve the product-specific grammar");
    if (companyDirection.visualTreatment?.id !== "quiet-editorial-studio") fail("ordinary company site did not resolve a visual treatment");
    if (projectOwnedDirection.constraintAuthority?.mode !== "project-owned" || projectOwnedDirection.constraintAuthority?.source !== "DESIGN.md") fail("project-owned DESIGN.md did not outrank local defaults");
    if (inspectedReferenceDirection.constraintAuthority?.mode !== "reference-led" || inspectedReferenceDirection.constraintAuthority?.evidenceStatus !== "observed") fail("inspected reference did not become creative authority");
    if (modelDirection.constraintAuthority?.mode !== "model-proposed" || !modelDirection.constraintAuthority?.canOverrideAdvisory) fail("model-proposed direction did not receive controlled creative freedom");
    if ([genericDirection, hardwareDirection, analyticsDirection, agentDirection, galleryDirection].some((direction) => direction.antiAiChecks.length < 3 || !direction.advisoryChecks?.length || !direction.typeRules?.hierarchy || !direction.surfaceRules?.cardBudget || !direction.visualTreatment?.signatureDevice)) fail("visual direction contract is incomplete");
    if (!brief.visualDirection?.id || !hardwareBrief.visualDirection?.firstViewport?.alignmentAxis) fail("brief did not expose the visual direction contract");
    if (!brief.quality.gates.some((gate) => gate.id === "constraint-authority")) fail("brief did not expose the constraint-authority quality gate");
    if (referenceBuild.primaryReference.id !== "rare-ui" || referenceBuild.pagePlan.length === 0 || referenceBuild.componentGrammar.length === 0 || !referenceBuild.fidelityAnchors?.composition) fail("reference build contract did not resolve the named primary reference");
    if (magicBuild.primaryReference.id !== "magic-ui" || magicBuild.pagePlan.length === 0 || magicBuild.motionContract.fallback.length === 0) fail("reference build did not resolve the new source-owned lens");
    if (rewampBuild.primaryReference.id !== "rewamp-ui" || !rewampBuild.pagePlan.some((section) => section.id === "component-index") || !rewampBuild.componentGrammar.some((item) => item.id === "specimen-stage") || !rewampBuild.responsivePlan.mobile.includes("selected identity")) fail("reference build did not apply the Rewamp UI component-workbench recipe");
    if (!externalBuild.primaryReference.id.startsWith("external-") || externalBuild.visualGenome.family !== "unknown until live inspection") fail("reference build did not preserve an unknown URL as an inspect-first reference");
    if (!audit.referenceCoverage.some((item) => item.id === "graphify") || !audit.referenceCoverage.some((item) => item.id === "reference-lenses") || !audit.referenceCoverage.some((item) => item.id === "visual-treatment") || !audit.referenceCoverage.some((item) => item.id === "constraint-authority")) fail("audit reference coverage is incomplete");
    if (audit.pipeline?.length < 8 || !audit.pipeline.some((item) => item.id === "transitions" && item.status !== "skipped") || audit.referenceInventory?.length < 8 || audit.resourceMatrix?.length < 12) fail("full audit did not execute the complete capability pipeline");
    if (!audit.pipeline.some((item) => item.id === "visual-direction") || !audit.proof.direction.visualDirection?.surfaceRules?.cardBudget) fail("full audit did not expose the visual direction contract");
    if (audit.referenceBuild?.referenceMode !== "adaptive-no-reference" || !audit.controlDials?.referenceFidelity) fail("full audit did not keep an unnamed request adaptive while producing the reference fidelity and control-dial contract");
    if (referenceAudit.proof.referenceBuild?.primaryReference?.id !== "rare-ui") fail("audit did not activate the reference build path");
    if (hardwareAudit.referenceBuild?.referenceMode !== "scouted-reference" || !["apple-product", "bang-olufsen", "teenage-engineering", "logitech-mx"].includes(hardwareAudit.referenceBuild?.primaryReference?.id) || !hardwareAudit.referenceInventory?.some((item) => item.id === hardwareAudit.referenceBuild.primaryReference.id && item.status === "primary-product")) fail("product reference scouting did not feed the visual build contract");
    if (!motionAudit.proof.motion?.workflow?.includes("review") || !motionAudit.proof.motion.workflow.includes("polish")) fail("audit motion integration did not return the full workflow");
    if (renderScanMarkdown(report).includes("[object Object]")) fail("inspect markdown renderer returned [object Object]");
    if (renderBriefMarkdown(brief).includes("[object Object]")) fail("brief markdown renderer returned [object Object]");
    if (renderMapMarkdown(map).includes("[object Object]")) fail("project map markdown renderer returned [object Object]");
    if (renderGraphMarkdown(graph, graphQuery).includes("[object Object]")) fail("project graph markdown renderer returned [object Object]");
    if (renderResourceMarkdown(resources).includes("[object Object]")) fail("resource markdown renderer returned [object Object]");
    if (renderReferenceComposition(references).includes("[object Object]")) fail("reference markdown renderer returned [object Object]");
    if (renderReferenceScout(hardwareScout).includes("[object Object]")) fail("reference scout markdown renderer returned [object Object]");
    if (renderReferenceBuild(referenceBuild).includes("[object Object]")) fail("reference build markdown renderer returned [object Object]");
    if (renderVisualDirection(agentDirection).includes("[object Object]") || !renderVisualDirection(agentDirection).includes("Visual Treatment") || !renderVisualDirection(agentDirection).includes("AI-Default Checks (Advisory)") || !renderVisualDirection(agentDirection).includes("Constraint Authority")) fail("visual direction markdown renderer is incomplete");
    if (renderAuditMarkdown(audit).includes("[object Object]")) fail("audit markdown renderer returned [object Object]");
    const inspectMd = execFileSync(process.execPath, [join(root, "scripts", "inspect-project.mjs"), root, "--format", "md"], { encoding: "utf8" });
    const briefMd = execFileSync(process.execPath, [join(root, "scripts", "design-brief.mjs"), "--query", "analytics dashboard", "--format", "md"], { encoding: "utf8" });
    const briefJson = execFileSync(process.execPath, [join(root, "scripts", "design-brief.mjs"), "--query", "analytics dashboard", "--format", "json"], { encoding: "utf8" });
    const directionMd = execFileSync(process.execPath, [join(root, "scripts", "visual-direction.mjs"), "--query", "AI agent dashboard with approval modal", "--profile", "productive-app", "--format", "md"], { encoding: "utf8" });
    const directionJson = execFileSync(process.execPath, [join(root, "scripts", "visual-direction.mjs"), "--query", "AI agent dashboard with approval modal", "--profile", "productive-app", "--format", "json"], { encoding: "utf8" });
    const mapJson = execFileSync(process.execPath, [join(root, "scripts", "project-map.mjs"), root, "--query", "package test script", "--format", "json"], { encoding: "utf8" });
    const graphJson = execFileSync(process.execPath, [join(root, "scripts", "project-graph.mjs"), root, "--query", "motion adapter", "--format", "json"], { encoding: "utf8" });
    const resourceJson = execFileSync(process.execPath, [join(root, "scripts", "resource-catalog.mjs"), "--query", "accessible modal", "--stack", "react", "--format", "json"], { encoding: "utf8" });
    const referenceMd = execFileSync(process.execPath, [join(root, "scripts", "reference-composition.mjs"), "--query", "AI agent dashboard with approval modal", "--format", "md"], { encoding: "utf8" });
    const referenceJson = execFileSync(process.execPath, [join(root, "scripts", "reference-composition.mjs"), "--query", "AI agent dashboard with approval modal", "--format", "json"], { encoding: "utf8" });
    const scoutMd = execFileSync(process.execPath, [join(root, "scripts", "reference-scout.mjs"), "--query", "高端硬件外设官网", "--format", "md"], { encoding: "utf8" });
    const scoutJson = execFileSync(process.execPath, [join(root, "scripts", "reference-scout.mjs"), "--query", "高端硬件外设官网", "--format", "json"], { encoding: "utf8" });
    const referenceBuildMd = execFileSync(process.execPath, [join(root, "scripts", "reference-build.mjs"), "--query", "Build a component gallery for our analytics SDK like Rare UI", "--format", "md"], { encoding: "utf8" });
    const referenceBuildJson = execFileSync(process.execPath, [join(root, "scripts", "reference-build.mjs"), "--query", "Build a component gallery for our analytics SDK like Rare UI", "--format", "json"], { encoding: "utf8" });
    const externalBuildJson = execFileSync(process.execPath, [join(root, "scripts", "reference-build.mjs"), "--query", "Build a product like https://example.com/visual-tool for our workflow", "--format", "json"], { encoding: "utf8" });
    const auditJson = execFileSync(process.execPath, [join(root, "scripts", "audit.mjs"), root, "--query", "analytics dashboard", "--offline", "--format", "json"], { encoding: "utf8" });
    const referenceAuditJson = execFileSync(process.execPath, [join(root, "scripts", "audit.mjs"), root, "--query", "Build a component gallery like Rare UI", "--offline", "--format", "json"], { encoding: "utf8" });
    const motionMd = execFileSync(process.execPath, [join(root, "scripts", "transitions-adapter.mjs"), "--intent", "modal close cleanup", "--phase", "all", "--offline", "--format", "md"], { encoding: "utf8" });
    const motionJson = execFileSync(process.execPath, [join(root, "scripts", "transitions-adapter.mjs"), "--intent", "modal close cleanup", "--phase", "all", "--offline", "--format", "json"], { encoding: "utf8" });
    if (inspectMd.includes("[object Object]") || briefMd.includes("[object Object]") || directionMd.includes("[object Object]")) fail("CLI markdown smoke output returned [object Object]");
    if (!JSON.parse(briefJson).recommendation?.profile?.id) fail("CLI JSON smoke output is incomplete");
    if (JSON.parse(directionJson).id !== "stateful-instrument" || !JSON.parse(directionJson).visualTreatment?.id || !JSON.parse(directionJson).constraintAuthority?.mode || !directionMd.includes("Visual Treatment") || !directionMd.includes("AI-Default Checks (Advisory)")) fail("CLI visual direction output is incomplete");
    if (!JSON.parse(mapJson).results?.some((item) => item.path === "package.json")) fail("CLI project map JSON output is incomplete");
    if (!JSON.parse(graphJson).nodes?.length || !JSON.parse(graphJson).query?.results?.length) fail("CLI project graph JSON output is incomplete");
    if (!JSON.parse(resourceJson).candidates?.length) fail("CLI resource JSON output is incomplete");
    if (!JSON.parse(referenceJson).selected?.length || JSON.parse(referenceJson).selected.length > 4) fail("CLI reference JSON output is incomplete");
    if (!JSON.parse(scoutJson).selected?.some((item) => item.id === "apple-product")) fail("CLI reference scout JSON output is incomplete");
    if (referenceMd.includes("[object Object]") || !referenceMd.includes("Borrow:") || !referenceMd.includes("Translate:")) fail("reference composition markdown smoke output is incomplete");
    if (scoutMd.includes("[object Object]") || !scoutMd.includes("Selection Policy") || !scoutMd.includes("Live Inspection Checklist")) fail("reference scout markdown smoke output is incomplete");
    if (referenceBuildMd.includes("[object Object]") || !referenceBuildMd.includes("Visual Genome") || !referenceBuildMd.includes("Token Seed") || !referenceBuildMd.includes("Acceptance")) fail("reference build markdown smoke output is incomplete");
    if (JSON.parse(referenceBuildJson).primaryReference?.id !== "rare-ui" || !JSON.parse(referenceBuildJson).fidelityAnchors?.composition || !JSON.parse(referenceBuildJson).motionContract?.fallback) fail("reference build JSON output is incomplete");
    if (!JSON.parse(externalBuildJson).primaryReference?.id?.startsWith("external-")) fail("CLI reference build did not preserve an unknown URL");
    if (!JSON.parse(auditJson).referenceCoverage?.length || !JSON.parse(auditJson).pipeline?.some((item) => item.id === "transitions")) fail("CLI audit JSON output is incomplete");
    if (JSON.parse(referenceAuditJson).proof?.referenceBuild?.primaryReference?.id !== "rare-ui") fail("CLI audit did not expose the reference build path");
    if (motionMd.includes("[object Object]") || !motionMd.includes("Review") || !motionMd.includes("Polish")) fail("motion adapter markdown smoke output is incomplete");
    const motion = JSON.parse(motionJson);
    if (!motion.guardrails?.cleanup || !motion.guardrails?.reducedMotion || !motion.guardrails?.fallback) fail("motion adapter JSON guardrails are incomplete");
    if (!motion.selected?.some((item) => item.id === "modal")) fail("motion adapter did not select the modal recipe");
  } catch (error) {
    fail(`smoke execution failed: ${error.message}`);
  }
}

for (const path of [
  join(root, "SKILL.md"), join(root, "README.md"), join(root, "package.json"),
  join(root, "agents", "openai.yaml"), join(root, "bin", "frontend-art-direction.js"),
  join(root, "references", "operating-modes.md"), join(root, "references", "motion.md"),
  join(root, "references", "reference-composition.md"),
  join(root, "references", "assets.md"),
  join(root, "references", "premium-finish.md"),
  join(root, "references", "reference-discovery.md"),
  join(root, "references", "reference-build.md"),
  join(root, "references", "visual-composition.md"),
  join(root, "references", "constraint-authority.md"),
  join(root, "templates", "DESIGN.md"), join(root, "scripts", "transitions-adapter.mjs"),
  join(root, "scripts", "project-graph.mjs"), join(root, "scripts", "resource-catalog.mjs"), join(root, "scripts", "audit.mjs"),
  join(root, "data", "quality-gates.json"), join(root, "data", "resources.json"), join(root, "data", "reference-lenses.json"), join(root, "data", "reference-recipes.json"), join(root, "data", "reference-sources.json"),
  join(root, "scripts", "reference-composition.mjs"), join(root, "scripts", "reference-scout.mjs"), join(root, "scripts", "reference-build.mjs"),
  join(root, "scripts", "visual-direction.mjs"),
  join(root, "scripts", "authority.mjs"),
  join(root, "data", "visual-directions.json"),
  join(root, "data", "visual-treatments.json"),
  join(root, "data", "constraint-policy.json"),
]) assertExists(path);

async function main() {
  checkSkill();
  checkPackage();
  checkData();
  checkMarkdownLinks();
  checkScripts();
  await checkSmoke();

  if (errors.length > 0) {
    console.error(`FAIL ${errors.length} check(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`PASS frontend-art-direction checks (${walkFiles(root).length} files scanned)`);
  for (const note of notes) console.log(`NOTE ${note}`);
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
