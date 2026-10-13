# Night Shift Direction

## Chosen direction

Treat the page as a quiet night field guide: two image records are the instrument, and the interface behaves like a page marker between scales. The wide DSS2 field establishes context; the Hubble ACS observation resolves the encounter. The first screen is dark enough for the material to remain visible, but the type is clear and restrained rather than a generic neon space dashboard.

## Alternatives

- A dense observatory dashboard: useful for repeated measurement, but it makes a single astronomical image feel like a data tile.
- A cinematic full-screen space poster: memorable, but it hides the actual reading task and source trail.
- A field guide with two source scales: chosen. It makes the wide field and Hubble detail materially distinct while keeping the same M51 encounter, facts, controls, and provenance visible.

## Material decisions

- `m51-galaxy.jpg` supplies the wide DSS2 field and `m51-hubble.jpg` supplies the Hubble ACS pair/core view. Each image keeps its own record and credit.
- Sora handles navigation and measurements; Newsreader handles the field note.
- Paper, ink, blue, and coral are derived from the inspected Hubble image rather than a purple space gradient.
- Grouping uses open image stages, spacing, tone, and named feature markers. Repeated cards, decorative star fields, and fake telemetry are rejected.
- The view transition has a purpose: it changes the scale and material of the observation. Reduced motion keeps the final view and controls usable.

## Regional Composition

The opening establishes the encounter in a bounded image field on desktop; the narrow opening shows the complete pair above the reading copy. The overview now uses three local relationships in one open field: the orientation marker starts at the left edge, the short title and explanatory copy occupy a bounded start-aligned reading measure, and the facts sit as a quiet right-hand record. At intermediate widths the facts regroup beneath the reading block; on phones the whole field returns to normal flow with the same start edge. No page-wide center axis is implied.

The reading instrument sits in a 1240px field; its 1080px working relationship gives the image a maximum 740px stage beside 300px controls. Below 900px, the explanation joins the heading before the image and controls stack. The paper note is a continuous band with its own reading measure, a 380px crop, and serif observation type. Below 900px, copy precedes the smaller end-positioned crop; the image is limited to 280px on phones. The source field is open and bounded at 1080px, with compact start-aligned headings and records that regroup before the columns squeeze. Outer viewport margin and distance from a painted surface's edge are inspected separately.

These are decisions for M51's reading distances, not defaults for other websites. The latest comparison, eight actual viewport snapshots from 320px to 1920px, the 2026-10-11 mixed-alignment browser readback, image-failure state, source switching, and reduced-motion observations are recorded in `../artifacts/layout-study/RESEARCH.md` and `../artifacts/layout-study/night-shift-alignment-followup.md`. Earlier PNG captures are historical and do not verify this CSS revision.

## Source and rights

The local wide-field image is the 7095x6219 DSS2 reproduction recorded in `../shared/assets/m51-source.json`; its official page identifies ESA/Hubble and Digitized Sky Survey 2. The local close image is a 6000x4164 rendition of the Hubble ACS observation heic0506a, recorded in `../shared/assets/m51-hubble-source.json`. The page keeps the full applicable credits beside the relevant records and links the ESA/Hubble reuse policy.
