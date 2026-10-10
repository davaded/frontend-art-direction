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

- Local wide asset: `shared/assets/m51-galaxy.jpg`, 7095x6219, inspected before use.
- Local close asset: `shared/assets/m51-hubble.jpg`, 6000x4164, inspected before use.
- Source records: `shared/assets/m51-source.json` and `shared/assets/m51-hubble-source.json`.
- A source audit corrected the wide record from an inferred Hubble/public-domain credit to the official DSS2/ESA-Hubble credit before the revised capture.
- No placeholder, generated, remote font, or telemetry asset is used by this brief.
- Temporary debugger blocking, cache, media, and viewport conditions were restored after testing.

## Post-20 cycles / source and composition revision

### Cycle 21 / Source identity

- Defect: the original record described a DSS2 wide field as NASA/ESA Hubble material and used a public-domain label inferred from a Commons template.
- Change: inspected the official ESA/Hubble record and embedded metadata, added the Hubble ACS record separately, and changed visible credits when the reading source changes.
- Result: the wide field and close Hubble image each expose their record ID, instrument/source, credit, date, and reuse policy.

### Cycle 22 / Subject hierarchy

- Defect: the first page used oversized editorial type while the actual galaxy was too small to inspect.
- Change: made the close Hubble image the hero material, reduced the title to a supporting role, and placed the title against the actual spiral rather than over an empty star field.
- Result: the spiral and companion carry the first glance; the 1280x720 opening keeps the title, entry link, and image record legible.

### Cycle 23 / Material continuity

- Defect: unlabeled crosshairs and a detached field note asked the reader to locate features without showing them.
- Change: named the core and companion in the pair view, added a nearby core crop, and connected the note back to the Core state.
- Result: the visual argument now proceeds from pair to dust-lane detail with the described material adjacent to the copy.

### Cycle 24 / Desktop result context

- Defect: the desktop image was taller than the viewport, so a reading-distance change left the subject visible but the controls below the fold.
- Change: staged the desktop instrument as an image-and-controls composition; at mobile it returns to a vertical reading order.
- Result: at 1280x720 the 732x508 image stage and 344x54 control row are visible together; at 390x844 the 390x271 stage and 350x54 controls are visible together.

### Cycle 25 / Independent comparison

- Evidence: an unprimed screenshot review compared the original and revised desktop, mobile, narrow, and pair-state captures. The revised direction resolved hero hierarchy, image-to-note continuity, narrow overlap, orientation pacing, and source specificity.
- Remaining decision: the review identified an apparent single-source/two-source contradiction. The brief and design record now explicitly define two complementary source records for one M51 encounter, so the final screenshots and source model agree.
- Verdict: CURRENT WINS within the supplied screenshot comparison boundary. This remains visual evidence for this brief, not a universal quality claim for arbitrary products.
- Structured journal: `.art-direction/visual-critique/critique-20261010222354-929501b0.json` records four resolved findings, the comparison boundary, and the next regression operation.
