import { loadDataset, meaningfulTokens, positiveRoutingText } from "./lib.mjs";

const GENERIC_REFERENCE_TOKENS = new Set(["http", "https", "www", "com", "dev", "io", "ui"]);
const REFERENCE_SIGNAL = /https?:\/\/|like\s+|similar\s+to|inspired\s+by|based\s+on|\b(?:rare\s+ui|beautiful\s+ui|beui|magic\s+ui|react\s+bits|aceternity|obsidian\s+ui|bencho|design\s+spells|transitions|shadcn)\b|像|类似|参考|仿照|复刻/i;
const URL_PATTERN = /https?:\/\/[^\s<>"'()[\]，；。！？“”]+/gi;

export function hasReferenceBuildSignal(query) {
  return REFERENCE_SIGNAL.test(positiveRoutingText(query));
}

export function withoutReferenceUrls(input) {
  return String(input ?? "").replace(URL_PATTERN, (value) => {
    try { new URL(value); return " "; } catch { return value; }
  }).trim();
}

function extractUrl(input) {
  const match = String(input ?? "").match(URL_PATTERN);
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
  const url = extractUrl(input);
  const hostname = url ? new URL(url).hostname.replace(/^www\./, "") : "";
  const candidates = hostname ? references.filter((reference) => new URL(reference.url).hostname.replace(/^www\./, "") === hostname) : references;
  if (hostname && candidates.length === 0) return { reference: externalReference(url), score: 1, hits: [url], external: true };
  const ranked = candidates.map((reference) => ({
    reference,
    ...referenceMatchScore(reference, url || input),
  })).sort((left, right) => right.score - left.score || left.reference.id.localeCompare(right.reference.id));
  if (ranked[0]?.score > 0) return ranked[0];
  return url ? { reference: externalReference(url), score: 1, hits: [url], external: true } : null;
}
