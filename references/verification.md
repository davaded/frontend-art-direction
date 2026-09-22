# Verification And Evidence

Visual quality is accepted from the rendered surface, not from prose or a successful build alone.

## Three Proof Layers

Report these separately:

1. **Static**: type checks, lint, unit tests, package validation, file inspection.
2. **Runtime**: app launch, route, interaction, state transition, console/log output.
3. **Visual**: screenshot or device inspection at relevant viewports, with text fit, hierarchy, contrast, overflow, and alignment checked.

A proof at one layer must not be described as proof at another.

## Minimum Visual Pass

For a new or substantially changed surface:

- run the real app or the closest available preview;
- inspect desktop and the target mobile/device size;
- check the first screen before scrolling and one meaningful non-default state;
- verify loading, empty, error, success, selected, or partial-data states that matter to the workflow;
- inspect text wrapping, focus, touch targets, contrast, overflow, and console errors;
- inspect every primary image/video/illustration/model at its rendered desktop and mobile size; confirm sharpness, focal crop, provenance, and absence of placeholder or filler media;
- run a grayscale pass for hierarchy, alignment, type ceiling, surface/material separation, and excessive effects before judging color polish;
- verify reduced motion or the static fallback;
- compare against the requirement frame, local evidence, and direction assumption.

For an existing surface, capture before and after when the tooling allows it.

## Reference Or Concept QA

When the work started from a live reference, screenshot, or generated concept, visual comparison is a blocking gate for substantial work:

1. Keep the source visual and implementation screenshot available at the same time.
2. Capture the implementation at the same viewport and relevant state.
3. Inspect one full-page/first-viewport pair and focused surfaces for navigation, hero, primary object, section rhythm, and mobile re-staging.
4. Classify mismatches as P0 unusable/broken, P1 major hierarchy or layout mismatch, P2 visible polish or responsive mismatch, and P3 optional refinement.
5. Fix P0-P2 issues and repeat the capture. Do not stop after the first pass merely because the app builds.

Prioritize object prominence, hierarchy, composition, type scale, image crop, and section rhythm before shadows, border tint, or micro-spacing. When the reference conflicts with the target product's content or accessibility, preserve the product and document the translation instead of chasing pixel identity.

## Evidence Pack

Keep the report compact:

```text
Requirement:
Direction and confidence:
Local evidence used:
References inspected and decisions borrowed:
Files changed:
Largest text role and approximate size:
States exercised:
Motion trigger and fallback:
Asset source / generation path and quality proof:
Static proof:
Runtime proof:
Visual proof:
Open gaps:
```

Use exact commands, paths, viewport sizes, and screenshot names. “Looks good” is not evidence.

## Failure Handling

If visual inspection is blocked, say exactly what was still verified and what remains unknown. Do not infer a clean render from a build, HTTP 200, or a running dev server. If the first render is generic or incoherent:

1. identify the failed decision: hierarchy, density, type, component shape, medium, motion, or content readiness;
2. remove one generic layer;
3. change the decision, not just the shadow or color;
4. re-run the visual pass.

## Skill Package Checks

For this repository:

```bash
npm test
npm run pack:check
```

`npm test` checks structure, frontmatter, internal links, JSON data, and script syntax. `npm run pack:check` checks the publish file set. Neither proves a target app's visual quality.
