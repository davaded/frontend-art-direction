# Common Frame / Evidence

Input: `做一个城市独立电影放映俱乐部的网站`. Brand, English locale, two films and sample November dates are recorded implementation assumptions, not added user instructions. This is a local concept with no booking backend.

## Current proof

- Actual current default captures: 1920x1000, 1440x900, 1280x720, 1024x900, 901x900, 768x900, 601x900, 390x844 and 320x740. See artifacts/mark-test-1440.jpg, artifacts/mark-test-390.jpg, artifacts/revision-layout-snapshots.json and artifacts/revision-layout-audit.md. These include the film-length metadata, reversed wide-screen programme row, storyboard artifact, and the small subject-native `01 / of 02 / open movie` opening mark. All nine readbacks show no horizontal overflow; desktop and mobile full-page captures were inspected. The 390px packed-field advisory and its rendered exception remain recorded. Earlier after-* and current-* captures are retained as repair comparisons, not overwritten.
- Layout and mobile repair comparisons: artifacts/COMPARISON.md. Desktop programme y~=830; short-height programme y~=675. Reading prose remains independently measured, centered brand and start-aligned programme/prose remain distinct.
- Real paths exercised: film details; save both films; all/saved filtering; refresh restores a saved film; removal retains the current detail subject; removal of a hidden opener returns to visible programme controls; last removal produces a usable empty state; recovery returns to All screenings; Escape restores the real opener; calendar export downloads a real file; reduced motion; actual image-request failure and UI retry.
- Downloaded artifact: artifacts/common-frame-steel.ics. It contains a sample event on 2026-11-06 at 19:00..20:00 with CRLF and folded lines. The hour is a sample screening/discussion slot, not a claim about the film's runtime. No ticket is reserved.
- State observations: artifacts/state-observations.json. Observations captured before an animation finished are retained separately; use settled records for accepted return-path evidence. Verification-created saves were removed, returning the count to zero.
- Explicit reverse/forward Tab wrapping was verified at 320x740; settled Escape dismissal restored the Into the film opener and cleared body overflow. See artifacts/current-focus-observations.json and artifacts/current-detail-320.jpg. The immediate Escape observation is retained as transitional rather than accepted as the dismissed state.
- Actual unavailable-storage behavior was exercised in artifacts/storage-unavailable.html, whose sandbox excludes allow-same-origin. Saving remains usable during the visit; filtering previously erased the visit-only warning. The repaired status retains that limitation through filtering, details and dismissal; reload returns to zero saved screenings. See artifacts/storage-observations.json and artifacts/storage-before-390.jpg -> artifacts/storage-after-390.jpg. Opaque-origin font loading is outside normal-app visual evidence.
- A clean browser tab loaded the revised page at all nine sizes with no captured warning/error console logs. Page-error event coverage for this new interval was not collected; the geometry report keeps missing coverage unrecorded. Earlier normal captures and keyboard/short-height follow-up separately recorded no Runtime.exceptionThrown events. None of these observations covers the entire earlier session.
- Static checks: npm test passed with 348 files scanned at the latest check; node --check app.js passed; git diff --check passed; skill-creator quick_validate.py passed; npm pack --dry-run passed with 76 package files. The file count is not a test-case count. These checks do not validate screenshot quality.

## Material and reference proof

See RESEARCH.md and assets/SOURCES.md. Metrograph was inspected on desktop; Cineville on desktop and 390x844 mobile; the live 5Point Film Festival was inspected at 1440x900 and 390x844. Their local captures are in artifacts/. Official Tears of Steel and Sintel images, an additional 4K Celia frame, and David Revoy's official storyboard frame were inspected at their intended sizes with source-specific attribution. No placeholder, film-library installation, or extra motion dependency is used. Transitions.dev's pinned modal recipe was adapted behind the skill's internal motion bridge.

Generation produced no proposal: the configured image provider rejected gpt-image-2. It is not counted as a completed image iteration.

## Visual critique

- Structured review: `.art-direction/visual-critique/critique-20261011121221-98f7763c.json`.
- Review boundary: deliberately reset implementing-agent self-review; implementation history was read before the screenshot-first pass, so residual bias is explicit. It is stronger than an unrecorded opinion but not independent external acceptance.
- Verdict: `CURRENT WINS` against the earlier Common Frame draft for the declared club workflow. The opening mark resolved the first-read gap; one P2 gap remains open around the pause created by the wide reversed programme row. The inspected 5Point reference is stronger on immediate visual tension, but it is a different festival product and is used as a relationship reference rather than a parity target.

## Open work

Independent forward evaluation on 2026-10-13 adds a narrow-navigation gap and a product-completion boundary: actual city/venue/participation information is absent. See [the saved-capture review](artifacts/forward-evaluation-2026-10-13.md). It is independent static/capture evidence, not a new runtime pass or final sign-off.

The narrow-navigation repair is implemented with a native More disclosure and the actual Reading room / The club anchors. Source inspection and JavaScript syntax checking do not prove its width fit, focus return, destination scroll, no-JavaScript behaviour or touch use; those require a fresh permitted runtime pass. Existing screenshots predate this repair.

1. Decide whether the wide reversed-row pause is a useful editorial pause or needs one more subject-specific transition; do not solve it with a generic divider or card grid.
2. Run final scope/accessibility/sign-off only after that visual decision and its regression checks.
3. The image-driven iteration path still needs a working image provider. No proposal was produced by the failed attempt.

The browser interruption was resolved. Current keyboard and storage paths were checked in fresh tabs; the temporary sandbox tab was closed, viewport overrides reset, and normal preview retained with zero verification saves. Current normal verification did not introduce request, cache or motion overrides.

The design loop is at checkpoint 20 pending sign-off. References and completed checkpoints are a ledger; final acceptance must not disappear behind a passing package test. The broader one-sentence skill goal remains open.
