import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, resolve } from "node:path";
import { relativePath } from "./lib.mjs";

export function isCaptureReference(ref = "") {
  return /\.(?:png|jpe?g|webp|avif|gif|mp4|mov|m4v|webm|mkv)$/iu.test(String(ref));
}

function hasBytes(bytes, values, offset = 0) {
  return values.every((value, index) => bytes[offset + index] === value);
}

export function isRenderableCapture(path, ref) {
  try {
    const bytes = readFileSync(path).subarray(0, 32);
    const extension = extname(ref).toLocaleLowerCase();
    if (extension === ".png") return hasBytes(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    if ([".jpg", ".jpeg"].includes(extension)) return hasBytes(bytes, [0xff, 0xd8, 0xff]);
    if (extension === ".gif") return hasBytes(bytes, [0x47, 0x49, 0x46, 0x38]);
    if (extension === ".webp") return hasBytes(bytes, [0x52, 0x49, 0x46, 0x46]) && hasBytes(bytes, [0x57, 0x45, 0x42, 0x50], 8);
    if ([".avif", ".heic", ".heif", ".mp4", ".mov", ".m4v"].includes(extension)) return hasBytes(bytes, [0x66, 0x74, 0x79, 0x70], 4);
    if ([".webm", ".mkv"].includes(extension)) return hasBytes(bytes, [0x1a, 0x45, 0xdf, 0xa3]);
    return false;
  } catch {
    return false;
  }
}

export function inspectLocalEvidence(projectRoot, ref) {
  const root = resolve(projectRoot);
  const absolute = resolve(root, ref);
  const inside = absolute === root || absolute.startsWith(`${root}/`);
  const file = inside && existsSync(absolute) ? statSync(absolute) : null;
  const capture = isCaptureReference(ref);
  return {
    ref: inside ? relativePath(root, absolute) : ref,
    kind: capture ? "capture-or-media" : "artifact-or-check",
    exists: Boolean(file?.isFile()),
    size: file?.size ?? null,
    valid: capture && file?.isFile() ? isRenderableCapture(absolute, ref) : null,
  };
}

export function inspectExistingArtifact(projectRoot, ref) {
  const item = inspectLocalEvidence(projectRoot, ref);
  return item.exists === true && item.size > 0;
}
