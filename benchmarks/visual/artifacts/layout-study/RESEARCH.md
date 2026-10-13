# Layout Research / 2026-10-11

This pass addresses the observed tendency to fill every band, carry one alignment through a page, and stretch media or tracks with the viewport. Research observations and target acceptance are separate. The captures below document particular source states, not complete accessibility or performance audits.

## Original Sources Inspected

| Source and local evidence | Observed relationship | Translation | Boundary |
| --- | --- | --- | --- |
| [Apple MacBook Air](https://www.apple.com/macbook-air/), `apple-opening.png`, `apple-design.png`, 1440x900 | The hardware is centered in a broad field. Opening copy starts at a different local edge; the Design chapter moves the heading into a narrower measure while its image extends wider. | Separate field, object stage, heading placement, and prose measure. | Do not inherit its media budget, branding, product framing, exact ratios, or commerce path. These captures establish desktop composition only. |
| [Kinfolk](https://www.kinfolk.com/), `kinfolk-opening.png`, `kinfolk-stories.png`, 1440x900 | A compact magazine cover and short title sit in a centered opening with substantial framing space. The following collection uses start-aligned descriptions and an end-positioned collection action. | Change reading distance and local alignment with the kind of content; centered openings remain valid. | Do not copy the magazine's visual identity, subscription bar, or literal whitespace. A gallery row does not establish the target's full workflow. |

Earlier live inspection in this goal also covered Linear's object-led opening and workflow sections. It contributes the distinction between an expressive content area and quiet tools; no saved Linear capture is included in this evidence set, so it is not a selected acceptance anchor here.

## Discovery Channels Reviewed

The user's ten channels are retained in `data/reference-sources.json`. Their roles differ; listing them does not mean using them as a skin or importing code.

| Channel | Access observed during this goal | Role / next evidence |
| --- | --- | --- |
| Siteinspire | Public page readable | Structural discovery; follow the original live site |
| MUUUUU.ORG | Public page readable | Layout/style/industry discovery; follow its original-site link |
| Mobbin | Public page readable | Real screen/flow research; respect deeper access limits |
| Dribbble | Public page readable | Component/state specimens; whole-product behavior is unproven |
| Muzli | Public page readable | Fresh discovery; follow the creator or project |
| Eagle Blog | Public guide readable | Directory navigation, not a primary design authority |
| Behance | Public fetch returned 403 | Retained as a candidate; no project claimed inspected |
| Pinterest | Public fetch returned 403 | Retained as a candidate; no pin claimed inspected |
| Huaban | Public fetch timed out | Retained as a candidate; no collection claimed inspected |
| Awwwards | Public fetch failed | Retained as a candidate; no award entry claimed inspected |

Component and motion resources remain the existing role-based reserve. This pass reuses the working segmented reading controls, native painting viewer, local Lucide icons, and existing purposeful image/view motion. The full offline audit executed the cached Transitions review/apply/polish plan. Its low-confidence tooltip/hover candidates do not resolve a missing job here; no extra animation library is added. Reduced-motion and source continuity require fresh runtime checks after the layout edits.

## Concepts And Choice

1. One narrower shell for every region: rejects the edge-to-edge fill, but still normalizes all reading distances and leaves a repeated silhouette.
2. Alternate centered and offset regions by count: creates variation without a content reason; risks another template.
3. Measures and relationships chosen from each region's material: chosen. The M51 overview is a centered narrow read, the instrument is a bounded working object, and the core note is a closer image/prose relationship. Monet's coast, wide field, near-square pond, and return to whole works establish distinct scales and chapter placements.

The choice is not a rule that every site must mix alignments or use these widths. A valid authored `DESIGN.md`, inspected reference, or better model proposal remains authoritative. The new composition map records that decision without inventing page genres or a mandatory section count.

## Scope And Invariants

This calibration changes the Skill's discovery/composition contracts and two existing authored surfaces. All actual chapters, source records, natural-ratio whole works, reading controls, dialogs, keyboard paths, and reduced-motion/fallback contracts remain in scope. No placeholder or generated replacement image is introduced. Package tests prove routing and preservation of supplied decisions; target captures and exercised states prove only their observed implementation.

The production loop was opened retrospectively after the first source edits, to preserve the work and outstanding checkpoints. It is not evidence that a plan or journal created the design. This pass must not be relabeled as twenty rendered iterations or a universal one-sentence quality guarantee.

## Follow-up / Open Chapters And Local Boundaries

Fresh inspection of [Rare UI](https://www.rareui.com/) at 1440x1000 is saved in `rare-current-1440.jpg` and `rare-components-1440.jpg`. Its opening uses one large soft boundary around a short thesis; the following component collection uses unequal specimen sizes, while headings and descriptions keep their own measures. Those frames support separating a major opening from the repeated items it introduces. They do not support rounding every chapter, transplanting its flower/orb effects, or claiming its full responsive flow was verified in this follow-up.

Night Shift's old inset chapter stack still pressed captions and source copy against their own painted edges at 768px. The baseline is `night-shift-before-768.jpg`; `night-shift-current-1440.jpg` is also a pre-repair capture despite its earlier filename. The repair opens the orientation and source chapters, bounds their reading measures independently, and gives the paper note a continuous field with its own inner space. The note changes from adjacent image/prose to start-aligned copy and a smaller end-positioned crop before either column becomes uncomfortable. This replaces the previous wrapper decision for M51; it is not a new page recipe.

The 601px capture exposed a second issue: the pair identifier wrapped inside a three-column fact rail, and the bright core crossed opening metadata. Definition rows now start below 700px, and the intermediate opening uses a different focal position. The actual changed styles were read back before accepting the new captures. Ordinary reloads retained old CSS in the connected browser; an explicit development refresh and computed-style readback resolved that capture condition.

The 2026-10-11 alignment follow-up addresses a different failure: the overview's previous centered reading block made the page's local relationships too easy to flatten into one axis. A fresh browser readback at `1280x720` shows the orientation marker at x=80, the reading block at x=247.5 with a 614.4px width, and the fact record at x=909.9 with a 290.1px width. At `390x844`, the same regions return to the 342px page gutter and normal reading order. This is a local relationship change, not a rule that every page must mix alignments. The clean tab reported no warning or error logs.

| Current evidence | Observation | Limit |
| --- | --- | --- |
| `night-shift-after-320.jpg`, `-390.jpg`, `-601.jpg`, `-768.jpg`, `-901.jpg`, `-1024.jpg`, `-1440.jpg`, `-1920.jpg` | Eight complete captures with actual viewport sizes checked against the requested sizes; no horizontal overflow in these states | A geometry result alone does not judge taste, contrast, or arbitrary future content |
| `night-shift-snapshots.json`, `night-shift-layout-audit.md`, `night-shift-layout-audit.json` | Connected-browser geometry processed by the shipped audit CLI without installing a browser runner | Runtime logs were not supplied to this geometry report and remain explicitly unrecorded |
| `night-shift-core-320.jpg`, `night-shift-states.json` | Returning from the lower note keeps the changed core and controls visible; source switching reaches the DSS2 record; the three labels fit at 320px | These are the exercised reading actions, not an accessibility audit of every destination |
| `night-shift-image-failure-320.jpg`, `night-shift-states.json` | A blocked local Hubble request exposes three real feedback messages, hides failed images, and disables reading controls; restoring the request reloads the real image | This verifies the current failure path, not every network condition |
| `night-shift-states.json` | Reduced-motion mode gives the core a final 2.15 scale and a zero-duration transition; normal conditions were restored afterward | Other motion or future routes remain outside this check |

Two audit corrections came from the actual snapshots. Shared full-width parent fields are normal on phones with readable inner gutters; they should not trigger artificial inset boxes. Long wrapping-driven content should not count as a repeated viewport-height band. Conversely, one well-spaced region must not hide a cramped neighbor, and outer framing must not hide text touching its own painted boundary. Regression checks cover these distinctions without making any alignment mixture compulsory.

The historical closed production-loop record and earlier `night-after-*.png` files describe prior revisions. Current target acceptance uses the follow-up evidence above. Other benchmarks and the broad one-sentence generation goal still need further current-state comparison; this follow-up does not establish universal output quality.
