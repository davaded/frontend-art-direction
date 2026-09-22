# Asset Acquisition And Quality

Use this policy by default whenever imagery, video, illustration, texture, audio, a model, or another authored asset materially affects the visible result.

## Source Priority

Use the first source that can satisfy the product and quality bar:

1. **User-provided assets**: treat them as authoritative. Preserve the subject, identity, brand, and intended role. Optimize, crop, or derive responsive variants without silently replacing the material.
2. **Existing project or official assets**: inspect local files, product media, press kits, brand systems, and verified first-party sources.
3. **High-quality searched assets**: use original-resolution, attributable, legally usable material whose subject and composition fit the target surface.
4. **Generated assets**: use the installed image-generation capability to create target-specific media when search cannot supply the right composition or visual identity.
5. **Assetless composition**: if no asset passes the bar, design a complete surface that deliberately does not depend on media, or report the asset as a blocker. Never fill the gap with a placeholder.

User-provided material outranks a more fashionable alternative. Do not regenerate or swap it unless the user asks, the file is unusable, or a legal/safety constraint requires a stop.

## No-Filler Rule

The delivered or visually reviewed surface must not contain:

- placeholder images, gray boxes presented as finished media, or generic hero gradients standing in for the product;
- low-resolution thumbnails stretched above their useful size;
- watermarks, search-result previews, unexplained third-party logos, or hotlinked files;
- random stock imagery that does not prove the product, place, person, workflow, or use case;
- obviously flawed generated media, including malformed objects, unreadable text, accidental logos, broken anatomy, inconsistent product geometry, or unusable crops;
- fake screenshots or product renders presented as real evidence.

A temporary development marker may exist while coding, but it must be replaced before the first visual acceptance pass.

## Search Contract

When sourcing an asset:

```text
Product role:
Required subject:
Target aspect ratio / viewport:
Minimum useful dimensions:
Source and provenance:
Usage or license boundary:
Focal point and safe crop:
Desktop / mobile variants:
Optimization format:
```

Prefer first-party or original sources over reposts and aggregators. Inspect the actual file, not only a search thumbnail. Download or store the approved asset in the target project when permitted; do not make production rendering depend on an unstable search result.

## Generation Contract

When generating media:

- define the exact role, subject, aspect ratio, camera/framing, lighting, material, palette, negative constraints, and text-free regions before generation;
- generate for the target crop instead of forcing one image into incompatible desktop and mobile frames;
- inspect the full-resolution result for object integrity, repeated details, text/logo artifacts, edge quality, and compression;
- generate a new variant when the crop or subject is weak; do not hide defects with blur, overlays, darkness, or aggressive cropping;
- do not fabricate an exact branded product, identifiable person, certification, screenshot, or factual result when authenticity matters.

Generated media is a production candidate only after visual inspection. The fact that generation completed is not quality proof.

## Render Acceptance

Before handoff, verify every primary asset in the running surface:

- it remains sharp at its rendered desktop and mobile size without visible upscaling;
- the subject and focal point survive responsive cropping;
- loading does not collapse layout or move adjacent controls;
- alt text, captions, controls, poster/static behavior, and reduced-motion behavior match the asset's role;
- color treatment and overlays do not conceal low quality or make the product hard to inspect;
- source/provenance and any usage limitation are recorded;
- the final screenshot contains no unfinished placeholder or low-quality filler.

If the user supplied the asset, include it in the visual proof. If it exposes a crop or quality limitation, preserve the material and report the limitation rather than silently substituting something else.
