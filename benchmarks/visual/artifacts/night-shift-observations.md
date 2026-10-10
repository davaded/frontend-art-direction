# Night Shift Observation Record

These records come from the local CUA browser session against `http://127.0.0.1:4177/night-shift/`. The visual frames were inspected in the browser at the stated viewport; this record keeps the route, state, scroll, and runtime observations durable beside the benchmark source.

## Cycle 15 / Hero scale

- Baseline: 1280x720 desktop first screen; the original 7095x6219 image left M51 small in a wide star field while the title carried nearly all of the hierarchy.
- Change: scaled the real hero image to `1.18` and moved its focal position to `52% 48%`.
- Result: M51 and its companion read as a second compositional weight while the title, source identity, and surrounding field remain visible.

## Cycle 16 / Result visibility

- Defect: clicking `Core` from the reading instrument footer changed the selected control while the zoomed subject remained above the viewport.
- Change: a view change now returns the instrument to the viewport with `scrollIntoView`; the image transition remains the meaningful motion and the scroll handoff is immediate.
- Result: the `Core` hash, label, selected state, and enlarged M51 are visible together from the former deep-scroll position.

## Cycle 17 / Narrow navigation

- Defect: the first mobile version hid `Readings` at the narrow breakpoint to save header width.
- Change: compressed the three primary links to a 9px, 8px-gap row instead of deleting the destination.
- Result: at 320x740 the accessibility tree contains `Field guide`, `Readings`, and `Source`; the first screen has no visible horizontal overflow and the M51 title remains inside the hero.

## Cycle 18 / Image failure

- Defect: a failed image still exposed broken-image alt text and crosshairs while the reading controls looked active.
- Change: added a global hidden rule, an error class that removes crosshairs, a visible status panel, and disabled-control styling. A missing image URL was induced through the page debugger and then restored.
- Result: the reading area exposes `The image could not load. The source record is still available below.`; all three distance controls are disabled; the source links remain available.

## Cycle 19 / Keyboard and reduced motion

- Action: with `prefers-reduced-motion: reduce`, focused the `Core` control and pressed Space.
- Result: accessibility state reports `Core` selected; runtime readback reports viewport `390x844`, `transition: 0s`, `scroll-behavior: auto`, `imageHidden: false`, `stageVisible: true`, and document width `390`.

## Cycle 20 / Ending handoff

- Defect: at the bottom of the desktop page, the note-to-source handoff left an empty pale band that read like an unfinished page break.
- Change: reduced only the desktop note bottom padding from `148px` to `88px`; mobile spacing remains independently staged.
- Result: the final source band follows the note with a tighter, intentional handoff and retains the source record, NASA/ESA/STScI credit, footer, and both external links.

## Shared runtime facts

- Local asset: `shared/assets/m51-galaxy.jpg`, 7095x6219, inspected before use.
- Source record: `shared/assets/m51-source.json`.
- No placeholder, generated, remote font, or telemetry asset is used by this brief.
- Temporary debugger blocking, cache, media, and viewport conditions were restored after testing.
