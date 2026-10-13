#!/usr/bin/env node

import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { asNumber, isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";

const HELP = `layout-audit.mjs [options]

Read rendered geometry at several widths and report advisory composition risks.
The audit never decides taste; it catches overflow, edge-to-edge packing, wide
prose measures, a single page-wide alignment, and missing bounded measures
before visual critique.

Options:
  --url <url>             Target URL (required without --snapshots)
  --snapshots <path>      Summarize snapshots from a connected browser; no local runner required
  --viewport <WxH,...>    Widths to inspect (default: 1440x900,1024x768,768x900,390x844)
  --reduced-motion        Emulate prefers-reduced-motion: reduce
  --wait <ms>             Wait after load (default: 250)
  --timeout <ms>          Navigation timeout (default: 30000)
  --format md|json        Output format (default: md)
  --output <path>         Write the report instead of stdout
`;

function parseViewports(value = "1440x900,1024x768,768x900,390x844") {
  return String(value).split(",").map((item) => {
    const match = item.trim().match(/^(\d+)x(\d+)$/u);
    if (!match) throw new Error(`--viewport must use WIDTHxHEIGHT, received ${item}`);
    return { width: Number(match[1]), height: Number(match[2]) };
  });
}

async function loadTargetPackage(name) {
  try {
    const requireFromSkill = createRequire(import.meta.url);
    const modulePath = requireFromSkill.resolve(name, { paths: [process.cwd()] });
    return await import(pathToFileURL(modulePath).href);
  } catch {
    return null;
  }
}

async function loadRunner() {
  const playwright = await loadTargetPackage("playwright");
  const playwrightRuntime = playwright?.chromium ? playwright : playwright?.default;
  if (playwrightRuntime?.chromium) return { kind: "playwright", module: playwrightRuntime };
  const puppeteer = await loadTargetPackage("puppeteer");
  const puppeteerRuntime = puppeteer?.launch ? puppeteer : puppeteer?.default;
  if (puppeteerRuntime?.launch) return { kind: "puppeteer", module: puppeteerRuntime };
  throw new Error("No supported browser runner found. Add Playwright or Puppeteer to the target project; layout-audit does not install it automatically.");
}

export function collectLayout() {
  const viewport = { width: window.innerWidth, height: window.innerHeight };
  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);
    return rect.width > 1 && rect.height > 1 && styles.display !== "none" && styles.visibility !== "hidden" && styles.opacity !== "0";
  };
  const inferFieldAnchor = (rect) => {
    const edge = 8;
    if (rect.left <= edge && rect.right >= viewport.width - edge) return "full-field";
    const centerDelta = Math.abs(rect.left + rect.width / 2 - viewport.width / 2);
    if (centerDelta <= viewport.width * 0.05) return "center-field";
    if (rect.left <= viewport.width * 0.2) return "start-field";
    if (rect.right >= viewport.width * 0.8) return "end-field";
    return "offset-field";
  };
  const explicit = [...document.querySelectorAll("[data-layout-region]")].filter(visible);
  const fallback = [...document.querySelectorAll("main > section, main > article, body > header, body > footer, body > section, body > article")].filter(visible);
  const broadFallback = fallback.length > 0
    ? fallback
    : [...document.querySelectorAll("main, [role='main'], body > *")].filter(visible);
  const elements = (explicit.length > 0 ? explicit : broadFallback).slice(0, 80);
  const regions = elements.map((element, index) => {
    const rect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);
    const textElements = [...element.querySelectorAll("h1,h2,h3,h4,h5,p,button,a,[role='heading']")]
      .filter((candidate) => visible(candidate) && candidate.textContent.trim())
      .slice(0, 24);
    const textNodes = textElements.map((candidate) => candidate.getBoundingClientRect());
    const proseSelector = "p,li,blockquote,dt,dd";
    const proseElements = [...element.querySelectorAll(proseSelector)]
      .filter((candidate) => {
        const content = candidate.textContent.trim();
        const substantial = content.length >= 80 || (content.match(/\p{Script=Han}/gu)?.length ?? 0) >= 36;
        return substantial && visible(candidate) && !candidate.querySelector(proseSelector);
      })
      .slice(0, 24);
    const proseNodes = proseElements.map((candidate) => candidate.getBoundingClientRect());
    const proseBlocks = proseElements.map((candidate, proseIndex) => {
      const proseRect = proseNodes[proseIndex];
      const proseStyles = getComputedStyle(candidate);
      const fontSize = Number.parseFloat(proseStyles.fontSize);
      return {
        width: Math.round(proseRect.width),
        widthEm: Number.isFinite(fontSize) && fontSize > 0 ? Number((proseRect.width / fontSize).toFixed(1)) : null,
        gutter: Math.round(Math.max(0, Math.min(proseRect.left, viewport.width - proseRect.right))),
        textLength: candidate.textContent.trim().length,
        textAlign: proseStyles.textAlign,
      };
    });
    const textAlignmentEvidence = textElements.map((candidate) => {
      const candidateStyles = getComputedStyle(candidate);
      return { align: candidateStyles.textAlign, direction: candidateStyles.direction };
    });
    const contentWidth = textNodes.length > 0 ? Math.max(...textNodes.map((candidate) => candidate.width)) : rect.width;
    const contentLeft = textNodes.length > 0 ? Math.min(...textNodes.map((candidate) => candidate.left)) : rect.left;
    const contentRight = textNodes.length > 0 ? Math.max(...textNodes.map((candidate) => candidate.right)) : rect.right;
    const contentSpan = Math.max(0, contentRight - contentLeft);
    const contentGutter = Math.max(0, Math.min(contentLeft, viewport.width - contentRight));
    const proseWidth = proseNodes.length > 0 ? Math.max(...proseNodes.map((candidate) => candidate.width)) : 0;
    const proseLeft = proseNodes.length > 0 ? Math.min(...proseNodes.map((candidate) => candidate.left)) : rect.left;
    const proseRight = proseNodes.length > 0 ? Math.max(...proseNodes.map((candidate) => candidate.right)) : rect.right;
    const proseGutter = proseNodes.length > 0 ? Math.max(0, Math.min(proseLeft, viewport.width - proseRight)) : 0;
    const hasMedia = Boolean(element.querySelector("img, video, canvas, svg"));
    const hasText = textNodes.length > 0;
    return {
      index,
      tag: element.tagName.toLocaleLowerCase(),
      label: (element.getAttribute("data-layout-region") || element.querySelector("h1,h2,h3")?.textContent || element.textContent || "").replace(/\s+/gu, " ").trim().slice(0, 80),
      left: Math.round(rect.left),
      right: Math.round(rect.right),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
      widthRatio: Number((rect.width / viewport.width).toFixed(3)),
      contentWidth: Math.round(contentWidth),
      contentWidthRatio: Number((contentWidth / viewport.width).toFixed(3)),
      contentLeft: Math.round(contentLeft),
      contentRight: Math.round(contentRight),
      contentSpan: Math.round(contentSpan),
      contentSpanRatio: Number((contentSpan / viewport.width).toFixed(3)),
      contentGutter: Math.round(contentGutter),
      proseWidth: Math.round(proseWidth),
      proseWidthRatio: Number((proseWidth / viewport.width).toFixed(3)),
      proseGutter: Math.round(proseGutter),
      proseBlocks,
      localContentInset: Math.round(Math.max(0, Math.min(contentLeft - rect.left, rect.right - contentRight))),
      paintedSurface: !["transparent", "rgba(0, 0, 0, 0)"].includes(styles.backgroundColor)
        && Boolean(element.parentElement)
        && styles.backgroundColor !== getComputedStyle(element.parentElement).backgroundColor,
      gutter: Math.round(Math.min(Math.max(rect.left, 0), Math.max(viewport.width - rect.right, 0))),
      counterfield: Math.round(Math.max(Math.max(rect.left, 0), Math.max(viewport.width - rect.right, 0))),
      fieldAnchor: inferFieldAnchor(rect),
      textAlignmentEvidence,
      cssTextAlign: styles.textAlign,
      maxWidth: styles.maxWidth,
      heightRatio: Number((rect.height / viewport.height).toFixed(3)),
      hasMedia,
      hasText,
    };
  });
  return {
    url: location.href,
    capturedAt: new Date().toISOString(),
    viewport,
    scrollWidth: document.documentElement.scrollWidth,
    documentWidth: document.documentElement.clientWidth,
    regions,
  };
}

export function summarizeTextAlignment(evidence = []) {
  const alignments = [...new Set(evidence.map(({ align, direction = "ltr" }) => {
    if (align === "start") return "local-start";
    if (align === "end") return "local-end";
    if (align === "left") return direction === "rtl" ? "local-end" : "local-start";
    if (align === "right") return direction === "rtl" ? "local-start" : "local-end";
    if (align === "center" || align === "justify") return align;
    return "unknown";
  }).filter((align) => align !== "unknown"))];
  return { textAlignment: alignments.length > 1 ? "mixed" : alignments[0] ?? "unknown", textAlignmentMix: alignments };
}

export function summarizeLayout(snapshot) {
  const regions = (snapshot.regions ?? []).map((region) => region.textAlignmentEvidence
    ? { ...region, ...summarizeTextAlignment(region.textAlignmentEvidence) }
    : region);
  const fullWidth = regions.filter((region) => region.widthRatio >= 0.92).length;
  const bounded = regions.filter((region) => region.widthRatio <= 0.82 || region.contentWidthRatio <= 0.82 || (region.contentSpanRatio ?? 1) <= 0.82 || (region.contentGutter ?? 0) >= 24).length;
  const packedContent = regions.filter((region) => (region.contentSpanRatio ?? region.contentWidthRatio ?? region.widthRatio) >= 0.88 && (region.contentGutter ?? region.gutter ?? 0) < 24).length;
  const anchors = [...new Set(regions.flatMap((region) => region.textAlignmentMix ?? [region.textAlignment]).filter((align) => align && align !== "unknown"))];
  const fieldAnchors = [...new Set(regions.map((region) => region.fieldAnchor).filter(Boolean))];
  const maxGutter = Math.max(0, ...regions.map((region) => region.gutter));
  const maxCounterfield = Math.max(0, ...regions.map((region) => region.counterfield ?? 0));
  const maxContentGutter = Math.max(0, ...regions.map((region) => region.contentGutter ?? 0));
  const widths = regions.map((region) => region.widthRatio).filter((value) => Number.isFinite(value));
  const widthSpread = widths.length > 1 ? Math.max(...widths) - Math.min(...widths) : 0;
  const uniformShell = snapshot.viewport.width > 560 && regions.length >= 3 && fullWidth / regions.length >= 0.7 && widthSpread <= 0.08 && maxCounterfield < 80;
  const fullViewportBands = regions.filter((region) => region.widthRatio >= 0.92 && (region.heightRatio ?? 0) >= 0.82 && region.heightRatio <= 1.15).length;
  const narrowEdgeContent = snapshot.viewport.width <= 560 && regions.some((region) => region.hasText !== false
    && (region.contentSpanRatio ?? region.contentWidthRatio ?? region.widthRatio) >= 0.88
    && (region.contentGutter ?? region.gutter ?? 0) < 16);
  const surfaceEdgeRegions = regions.filter((region) => region.hasText && region.paintedSurface
    && region.widthRatio < 0.96 && region.localContentInset < 12);
  const wideProseRegions = snapshot.viewport.width > 560 ? regions.filter((region) => region.hasText && (
    region.proseBlocks ? region.proseBlocks.some((block) => block.widthEm > 45)
      : (region.proseWidthRatio ?? 0) >= 0.72 && (region.proseGutter ?? region.contentGutter ?? region.gutter ?? 0) < 80
  )) : [];
  const overflow = snapshot.scrollWidth > snapshot.documentWidth + 1;
  const warnings = [];
  if (overflow) warnings.push("horizontal-overflow");
  if (regions.length >= 3 && fullWidth / regions.length >= 0.7 && anchors.length <= 1) warnings.push("packed-edge-to-edge");
  if (regions.length >= 3 && packedContent / regions.length >= 0.65 && maxCounterfield < 80) warnings.push("packed-content-field");
  if (uniformShell) warnings.push("uniform-shell-rhythm");
  if (regions.length >= 3 && fullViewportBands / regions.length >= 0.6) warnings.push("repeated-viewport-bands");
  if (narrowEdgeContent) warnings.push("narrow-edge-content");
  if (wideProseRegions.length > 0) warnings.push("wide-prose-measure");
  if (surfaceEdgeRegions.length > 0) warnings.push("text-at-surface-edge");
  if (regions.length === 0) warnings.push("no-regions-observed");
  if (regions.length >= 4 && anchors.length === 1 && fieldAnchors.length <= 1 && widthSpread <= 0.08) warnings.push("single-page-wide-anchor");
  if (regions.length >= 3 && bounded === 0 && maxGutter < 24) warnings.push("no-bounded-reading-measure");
  return {
    viewport: snapshot.viewport,
    url: snapshot.url ?? null,
    capturedAt: snapshot.capturedAt ?? null,
    regionCount: regions.length,
    fullWidthCount: fullWidth,
    boundedCount: bounded,
    alignmentMix: anchors,
    fieldAnchorMix: fieldAnchors,
    maxGutter,
    maxCounterfield,
    maxContentGutter,
    widthSpread: Number(widthSpread.toFixed(3)),
    fullViewportBandCount: fullViewportBands,
    overflow,
    surfaceEdgeRegions: surfaceEdgeRegions.map((region) => region.label ?? region.index),
    wideProseRegions: wideProseRegions.map((region) => region.label ?? region.index),
    warnings,
    status: warnings.length > 0 ? "review" : "clear",
    regions,
  };
}

export function summarizeSnapshots(input) {
  if (!Array.isArray(input?.snapshots) || input.snapshots.length === 0) {
    throw new Error("Snapshot input must contain a non-empty snapshots array.");
  }
  for (const [index, snapshot] of input.snapshots.entries()) {
    if (!snapshot || ![snapshot.viewport?.width, snapshot.viewport?.height].every((value) => Number.isFinite(value) && value > 0)
      || ![snapshot.scrollWidth, snapshot.documentWidth].every((value) => Number.isFinite(value) && value >= 0)
      || !Array.isArray(snapshot.regions)
      || !snapshot.regions.every((region) => region && [region.widthRatio, region.gutter].every((value) => Number.isFinite(value) && value >= 0))) {
      throw new Error(`Snapshot ${index} is missing valid viewport, document widths, or regions.`);
    }
  }
  const report = {
    protocol: "frontend-art-direction/layout-audit-v1",
    url: input.url ?? input.snapshots[0].url ?? "",
    runner: input.runner ?? "connected-browser",
    reducedMotion: Boolean(input.reducedMotion),
    capturedAt: input.capturedAt ?? input.snapshots[0].capturedAt ?? null,
    reportedAt: new Date().toISOString(),
    viewports: input.snapshots.map(summarizeLayout),
    console: Array.isArray(input.console) ? input.console : null,
    pageErrors: Array.isArray(input.pageErrors) ? input.pageErrors : null,
    runtimeEvidence: Array.isArray(input.console) && Array.isArray(input.pageErrors) ? "recorded" : "not-recorded",
  };
  report.status = report.viewports.some((item) => item.status === "review") || report.pageErrors?.length > 0 ? "review" : "clear";
  return report;
}

async function auditWithPlaywright(runner, options, results) {
  const browser = await runner.module.chromium.launch({ headless: true });
  try {
    for (const viewport of options.viewports) {
      const page = await browser.newPage({ viewport });
      page.on("console", (message) => results.console.push({ type: message.type(), text: message.text(), viewport }));
      page.on("pageerror", (error) => results.pageErrors.push({ text: String(error), viewport }));
      if (options.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(options.url, { waitUntil: "networkidle", timeout: options.timeout });
      if (options.wait > 0) await page.waitForTimeout(options.wait);
      results.viewports.push(summarizeLayout(await page.evaluate(collectLayout)));
      await page.close();
    }
  } finally {
    await browser.close();
  }
}

async function auditWithPuppeteer(runner, options, results) {
  const browser = await runner.module.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const viewport of options.viewports) {
      await page.setViewport(viewport);
      page.on("console", (message) => results.console.push({ type: message.type(), text: message.text(), viewport }));
      page.on("pageerror", (error) => results.pageErrors.push({ text: String(error), viewport }));
      if (options.reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
      await page.goto(options.url, { waitUntil: "networkidle0", timeout: options.timeout });
      if (options.wait > 0) await new Promise((resolveWait) => setTimeout(resolveWait, options.wait));
      results.viewports.push(summarizeLayout(await page.evaluate(collectLayout)));
    }
  } finally {
    await browser.close();
  }
}

export async function auditLayout({ url, viewport = "1440x900,1024x768,768x900,390x844", reducedMotion = false, wait = 250, timeout = 30000 } = {}) {
  if (!url) throw new Error("--url is required");
  const runner = await loadRunner();
  const results = { protocol: "frontend-art-direction/layout-audit-v1", url, runner: runner.kind, reducedMotion, viewports: [], console: [], pageErrors: [], runtimeEvidence: "recorded", capturedAt: new Date().toISOString() };
  const options = { url, viewports: parseViewports(viewport), reducedMotion, wait: Number(wait), timeout: Number(timeout) };
  if (runner.kind === "playwright") await auditWithPlaywright(runner, options, results);
  else await auditWithPuppeteer(runner, options, results);
  results.status = results.viewports.some((item) => item.status === "review") || results.pageErrors.length > 0 ? "review" : "clear";
  return results;
}

export function renderLayoutAudit(report) {
  const rows = report.viewports.map((item) => `- **${item.viewport.width}×${item.viewport.height}**: ${item.status}; regions ${item.regionCount}; full-width ${item.fullWidthCount}; bounded ${item.boundedCount}; text anchors ${item.alignmentMix.join(", ") || "none"}; field anchors ${item.fieldAnchorMix?.join(", ") || "none"}; width spread ${item.widthSpread ?? "n/a"}; max inset ${item.maxGutter}px; max counterfield ${item.maxCounterfield}px; narrow content gutter ${item.maxContentGutter ?? "n/a"}px; wide prose regions ${item.wideProseRegions?.join(", ") || "none"}; overflow ${item.overflow ? "yes" : "no"}; warnings ${item.warnings.join(", ") || "none"}`).join("\n");
  return `# Layout Audit\n\n- Status: **${report.status}**\n- Runner: **${report.runner}**\n- URL: ${report.url}\n- Reduced motion: **${report.reducedMotion ? "yes" : "no"}**\n- Runtime logs: **${report.runtimeEvidence ?? "not-recorded"}**\n\n${rows || "- No viewport results."}\n\nThis is geometry evidence for the next screenshot critique. It cannot certify taste, originality, or whether a full-bleed composition is artistically earned. Packed-content, wide-prose, uniform-shell, repeated-viewport-band, narrow-edge, and painted-surface text-inset warnings are prompts to inspect the actual silhouette; an immersive subject, operational table, or authored reference may intentionally override them with evidence.\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const snapshots = option(args, "snapshots", "");
  const report = snapshots ? summarizeSnapshots(JSON.parse(readFileSync(snapshots, "utf8"))) : await auditLayout({
    url: option(args, "url", ""),
    viewport: option(args, "viewport", "1440x900,1024x768,768x900,390x844"),
    reducedMotion: Boolean(args.options["reduced-motion"]),
    wait: asNumber(option(args, "wait", "250"), 250),
    timeout: asNumber(option(args, "timeout", "30000"), 30000),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? report : renderLayoutAudit(report), { format, output: option(args, "output") });
}

if (isMainModule(import.meta.url)) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
