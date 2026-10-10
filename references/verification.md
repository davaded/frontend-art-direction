# Verification And Evidence

Visual quality is accepted from the rendered surface, not from prose or a successful build alone.

## Three Proof Layers

Report these separately:

1. **Static**: type checks, lint, unit tests, package validation, file inspection.
2. **Runtime**: app launch, route, interaction, state transition, console/log output.
3. **Visual**: screenshot or device inspection at relevant viewports, with text fit, hierarchy, contrast, overflow, and alignment checked.

A proof at one layer must not be described as proof at another.

## Minimum Visual Pass

Apply the [Product Or Experience Signal Gate](product-prototype.md) before judging polish. Functional surfaces must show their object, action, result, and exercised state. Narrative and art-directed surfaces must show their subject, thesis, attention path, authored proof, and chosen transition or ending. The selected mode stays open to the work's own visual language.

Apply the Completion Contract to the declared scope. A full page, route, scene, component workbench, or single component has different boundaries, but each must finish its own regions, destinations, responsive path, states or ending, and fallback before handoff. A first-viewport screenshot is insufficient evidence for a larger scope.

For a new or substantially changed surface:

- run the real app or the closest available preview;
- verify the complete declared scope, including lower sections, destinations, specimens, or ending, instead of checking only the first viewport;
- inspect desktop and the target mobile/device size;
- check the first screen before scrolling and one meaningful non-default state;
- after triggering a visual state from a lower control or deep scroll position, confirm the changed object/result is still visible; a changed label or selected control alone is insufficient;
- preserve every primary route or provide an equally direct mobile alternative; do not hide a meaningful destination merely to make a narrow header fit;
- challenge the actual content shape: a paragraph instead of a short title, a long unbroken identifier, mixed-language glyphs, dense or empty results, and native input values when relevant; do not solve ordinary overflow by shrinking the whole interface;
- exercise the primary product action and capture the before/after state, or capture the authored transition, spatial relationship, or stable ending; reject only an unintentional presentation shell even when its styling is polished;
- verify loading, empty, error, success, selected, or partial-data states that matter to the workflow;
- inspect text wrapping, focus, touch targets, contrast, overflow, and console errors;
- wait for fonts and images to settle and verify entrance or route animations have reached their final state before using a screenshot as visual evidence; capture a second settled frame when the first frame may still be transitional;
- inspect every primary image/video/illustration/model at its rendered desktop and mobile size; confirm sharpness, focal crop, provenance, and absence of placeholder or filler media;
- run a grayscale pass for hierarchy, alignment, type ceiling, surface/material separation, and excessive effects before judging color polish;
- verify reduced motion or the static fallback;
- compare against the requirement frame, local evidence, and direction assumption.

Exercise the workflow continuously, including its editing or result context. An editor can fit the first screen yet lose its object when the user reaches a palette; a task dialog can look complete yet silently replace the selected task after completion. Preserve the relationship between object, action, and result through the actual sequence. A split workspace, a compact preview, a dialog, or a deliberate navigation path may solve the job; none is a universal layout rule.

Inspect native controls at their real platform-rendered size. Date fields, select values, and intrinsic grid tracks can squeeze neighboring content even when the page has no horizontal scroll. Confirm the full selected value and nearby alignment, not only document width. For exported artifacts, compare real content and layout with the working object; use the same layout decisions where practical and distinguish system font fallback from a claimed custom font.

Include a short-height or landscape case when the surface uses a viewer, overlay, or height-bound work area. Confirm that dismissal and navigation remain reachable while long content can scroll. For a declared image-failure path, provoke a real local request failure and inspect the visible message, disabled states, and recovery action: a `hidden` attribute or an error handler can exist while author CSS keeps the broken image visible and clips its feedback. Restore temporary failure, cache, viewport, and media conditions after verification.

For substantial work, use [visual-iteration.md](visual-iteration.md) for the screenshot-to-code and screenshot-to-image-to-code loops. Keep the baseline, named visible defects, code/asset repairs, and inspected recaptures. The workflow is complete when remaining material issues are resolved or honestly blocked; taking screenshots without using them to guide repairs is insufficient.

Run `node <skill-root>/scripts/visual-lint.mjs <project-root>` before visual critique when the target is available. Treat its findings as deterministic leads for `audit`, `harden`, `typeset`, `colorize`, `animate`, `distill`, or `extract`; confirm every meaningful finding against the rendered surface because source detectors cannot certify taste, originality, or intentional exceptions.

When the target project already exposes Playwright or Puppeteer, create comparable local evidence with:

```bash
node <skill-root>/scripts/browser-capture.mjs \
  --url http://localhost:5173 \
  --output artifacts/desktop.png \
  --manifest artifacts/desktop.json \
  --viewport 1440x900 --full-page
```

Use `--click "<selector>"` for one meaningful state before capture and run the command again for the target mobile viewport. The command reuses the target's runner and writes console/page-error data to the manifest; it does not install a browser.

When image generation is used to resolve a visual thesis, record the proposal-to-code handoff separately from runtime proof:

```bash
node <skill-root>/scripts/image-proposal.mjs status \
  --project /path/to/project --session <id> --format json
```

`image-proposal close` is the final gate for that optional path. It requires a valid baseline, a selected local proposal, an existing source translation artifact, and a valid after capture. A generated image by itself never satisfies the visual proof layer.

## Reference Or Concept QA

When the work started from a live reference, screenshot, or generated concept, visual comparison is a blocking gate for substantial work:

1. Keep the source visual and implementation screenshot available at the same time.
2. Capture the implementation at the same viewport and relevant state.
3. Inspect one full-page/first-viewport pair and focused surfaces for navigation, hero, primary object, section rhythm, and mobile re-staging.
4. Classify observed mismatches as P0 unusable/broken, P1 major hierarchy or layout mismatch, P2 visible polish or responsive mismatch, and P3 optional refinement. A deliberately translated difference is not a defect solely because it differs from the source.
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
Iteration evidence: baseline -> observed problem -> code/asset change -> inspected recapture
Generated proposal and prompt, if used: recorded separately from runtime proof
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
