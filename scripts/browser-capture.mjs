#!/usr/bin/env node

import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { isMainModule, option, parseArgs, writeOutput } from "./lib.mjs";

const HELP = `browser-capture.mjs [options]

Capture a running development target with an existing Playwright or Puppeteer install.
This command never installs a browser or dependency.

Options:
  --url <url>             Target URL (required)
  --output <path>         PNG/JPEG capture path (required)
  --manifest <path>       JSON proof manifest (default: <output>.json)
  --viewport <WxH>        Viewport size (default: 1440x900)
  --device-scale <n>      Device scale factor (default: 1)
  --full-page             Capture the full page instead of the viewport
  --reduced-motion        Emulate prefers-reduced-motion: reduce
  --click <selector>      Click one target selector before capture
  --wait <ms>             Wait after load (default: 250)
  --format md|json        Output format (default: md)
`;

function parseViewport(value = "1440x900") {
  const match = String(value).match(/^(\d+)x(\d+)$/u);
  if (!match) throw new Error(`--viewport must use WIDTHxHEIGHT, received ${value}`);
  return { width: Number(match[1]), height: Number(match[2]) };
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
  try {
    const playwright = await loadTargetPackage("playwright");
    const playwrightRuntime = playwright?.chromium ? playwright : playwright?.default;
    if (playwrightRuntime?.chromium) return { kind: "playwright", module: playwrightRuntime };
    const puppeteer = await loadTargetPackage("puppeteer");
    const puppeteerRuntime = puppeteer?.launch ? puppeteer : puppeteer?.default;
    if (puppeteerRuntime?.launch) return { kind: "puppeteer", module: puppeteerRuntime };
  } catch {}
  throw new Error("No supported browser runner found. Add Playwright or Puppeteer to the target project, then run this command again; the skill does not install it automatically.");
}

async function captureWithPlaywright(runner, options, messages) {
  const browser = await runner.module.chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: options.viewport, deviceScaleFactor: options.deviceScale });
    page.on("console", (message) => messages.console.push({ type: message.type(), text: message.text() }));
    page.on("pageerror", (error) => messages.pageErrors.push(String(error)));
    if (options.reducedMotion) await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(options.url, { waitUntil: "networkidle", timeout: options.timeout });
    if (options.wait > 0) await page.waitForTimeout(options.wait);
    if (options.click) {
      await page.locator(options.click).click();
      if (options.wait > 0) await page.waitForTimeout(options.wait);
    }
    await page.screenshot({ path: options.output, fullPage: options.fullPage });
  } finally {
    await browser.close();
  }
}

async function captureWithPuppeteer(runner, options, messages) {
  const browser = await runner.module.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ ...options.viewport, deviceScaleFactor: options.deviceScale });
    page.on("console", (message) => messages.console.push({ type: message.type(), text: message.text() }));
    page.on("pageerror", (error) => messages.pageErrors.push(String(error)));
    if (options.reducedMotion) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
    await page.goto(options.url, { waitUntil: "networkidle0", timeout: options.timeout });
    if (options.wait > 0) await new Promise((resolveWait) => setTimeout(resolveWait, options.wait));
    if (options.click) {
      await page.click(options.click);
      if (options.wait > 0) await new Promise((resolveWait) => setTimeout(resolveWait, options.wait));
    }
    await page.screenshot({ path: options.output, fullPage: options.fullPage });
  } finally {
    await browser.close();
  }
}

export async function captureBrowser({ url, output, manifest = "", viewport = "1440x900", deviceScale = 1, fullPage = false, reducedMotion = false, click = "", wait = 250, timeout = 30000 } = {}) {
  if (!url) throw new Error("--url is required");
  if (!output) throw new Error("--output is required");
  const targetOutput = resolve(output);
  const targetManifest = resolve(manifest || `${targetOutput}.json`);
  const parsedViewport = parseViewport(viewport);
  const messages = { console: [], pageErrors: [] };
  const runner = await loadRunner();
  mkdirSync(dirname(targetOutput), { recursive: true });
  if (runner.kind === "playwright") await captureWithPlaywright(runner, { url, output: targetOutput, viewport: parsedViewport, deviceScale: Number(deviceScale), fullPage, reducedMotion, click, wait: Number(wait), timeout: Number(timeout) }, messages);
  else await captureWithPuppeteer(runner, { url, output: targetOutput, viewport: parsedViewport, deviceScale: Number(deviceScale), fullPage, reducedMotion, click, wait: Number(wait), timeout: Number(timeout) }, messages);
  const proof = {
    protocol: "frontend-art-direction/browser-capture-v1",
    runner: runner.kind,
    url,
    output: targetOutput,
    viewport: parsedViewport,
    deviceScale: Number(deviceScale),
    fullPage,
    reducedMotion,
    interaction: click ? { type: "click", selector: click } : null,
    console: messages.console,
    pageErrors: messages.pageErrors,
    capturedAt: new Date().toISOString(),
  };
  mkdirSync(dirname(targetManifest), { recursive: true });
  writeFileSync(targetManifest, `${JSON.stringify(proof, null, 2)}\n`);
  return { ...proof, manifest: targetManifest };
}

function render(result) {
  return `# Browser Capture\n\n- Runner: **${result.runner}**\n- URL: ${result.url}\n- Capture: \`${result.output}\`\n- Manifest: \`${result.manifest}\`\n- Viewport: **${result.viewport.width}×${result.viewport.height}** @${result.deviceScale}x\n- Full page: **${result.fullPage ? "yes" : "no"}**\n- Reduced motion: **${result.reducedMotion ? "yes" : "no"}**\n- Console messages: **${result.console.length}**\n- Page errors: **${result.pageErrors.length}**\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.options.help || args.options.h) {
    console.log(HELP);
    return;
  }
  const result = await captureBrowser({
    url: option(args, "url", ""),
    output: option(args, "output", ""),
    manifest: option(args, "manifest", ""),
    viewport: option(args, "viewport", "1440x900"),
    deviceScale: option(args, "device-scale", "1"),
    fullPage: Boolean(args.options["full-page"]),
    reducedMotion: Boolean(args.options["reduced-motion"]),
    click: option(args, "click", ""),
    wait: option(args, "wait", "250"),
    timeout: option(args, "timeout", "30000"),
  });
  const format = option(args, "format", "md");
  writeOutput(format === "json" ? result : render(result), { format, output: option(args, "report", "") });
}

if (isMainModule(import.meta.url)) main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
