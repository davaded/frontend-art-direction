# Visual Composition Contract

The common failure is an unchosen relationship between content, space, and attention. A centered opening can be excellent; a left-aligned page can be generic. Choose relationships that fit the material, then test the actual reading distance. This guide supplies decision questions, not a prescribed page silhouette.

## Lock Before Styling

Write these decisions before choosing colors, shadows, gradients, or animation:

- **Composition grammar**: rail + canvas, object + caption, table + detail, specimen + index, narrative chapters, or another named relationship.
- **Alignment relationships**: useful local edges, baselines, centers, or origins connecting each region. The legacy `firstViewport.alignmentAxis` is a local candidate suggestion, never a mandate for the whole page.
- **Region measures**: distinguish the viewport field, content shell, media/object stage, and readable text width. Decide their limits independently.
- **Dominant**: the one object, task, data relationship, or media proof that owns the first read.
- **Counterweight**: the small region that balances the dominant without competing with it.
- **Below-fold peek**: the next proof or state that enters the first viewport and explains why the page continues.
- **Type ceiling**: the largest title role the content and viewing distance can justify.
- **Surface budget**: the maximum framed surfaces, radius family, and elevation levels allowed in the first viewport.
- **Geometry contract**: edge character, corner hierarchy, separation strategy, line policy, and any localized sharp exception.
- **Visual treatment**: the palette temperature, type relationship, material logic, media behavior, and one repeatable signature device that make the otherwise ordinary surface feel authored.

If these are not named, the build is still choosing a template by accident.

## Region Composition Map

For the actual regions in the declared scope, record:

| Region | Placement | Text alignment | Measure / occupancy | Field / surface / pause | Geometry tokens | Wide / intermediate / narrow change |
| --- | --- | --- | --- | --- | --- |
| Name the real region | Centered, offset, edge-attached, or another authored placement | Start, center, end, or deliberate local variation | Content-dependent width / stage size; state what may remain empty | Keep the viewport field visible when useful; name the surface boundary and the pause's job | `anchor`, `measure`, `field`, `density`, `mobile` | What is bounded, reordered, regrouped, recropped, or allowed to stay quiet at each width |

This is a recording format, not a required list of sections. Do not invent a hero, CTA, three columns, or fixed mixture of alignments. A designer's `DESIGN.md` or inspected reference can provide the relationships directly. When no authored map exists, the CLI creates a provisional regional hypothesis from the selected direction so implementation has actual placement, space, and responsive decisions to test; it separates core relationships from optional candidates, and the latter must be removed unless real content or interaction earns them. Revise or replace the hypothesis when the subject asks for something else. `compositionPlan.regions` and `compositionPlan.optionalRegions` in an authored direction file preserve those decisions through the CLI.

Separate **where a block sits** from **how its lines align**. A narrow essay block can sit in the center of the page with start-aligned paragraphs. An overview title can be centered while following controls, captions, or comparison data share a start edge. End-aligned text needs a real local relationship; do not apply it to long prose for symmetry.

Empty space has a job: frame an object, separate arguments, balance a neighboring mass, or delay the next read. Leave it when it does that job. The generated plan records that job as `space` and marks a region's `priority`; use those fields to decide what can remain quiet and what must stay visible. Do not add filler to occupy every grid track, and do not replace everything with giant empty bands. Inspect both the full-page silhouette and the region at actual reading size.

For a substantial or visually uncertain request, form at least three structural hypotheses before polishing: a subject-led silhouette, an open-field sequence, and an attached relationship are useful starting frames, but their names are replaceable. Each generated alternative must carry a real regional map with local anchors, occupied fields, natural measures, and intermediate-width regrouping. Select one to render, keep the alternatives visible in the contract, and change the structure when the first screenshot is packed, interchangeable, or uncomfortable at either endpoint. A palette variation is not a structural alternative.

`occupancy` says how much of the available field the region is allowed to claim. `field` keeps the viewport background distinct from the content shell. `surface` prevents every region from becoming a new card or color band. `pause` names the specific reason to leave room. Generated geometry tokens make the same decision executable: `anchor` is the local edge or center, `measure` is the content role (`intrinsic-object`, `reading`, `utility`, or `compact`), `field` is the spatial relationship (`open-field`, `inset-stage`, `bounded-reading`, `attached-local`, `open-pause`, or an earned bleed), `density` is the intended visual pressure, and `mobile` is the reflow action. These are advisory design decisions: an inspected reference, authored concept, project-owned `DESIGN.md`, or stronger model proposal can replace them.

The generated composition budget makes the silhouette reviewable: read its alignment sequence, measure sequence, field sequence, counterfield, and full-bleed policy as one relationship. It is a prompt to compare the rendered page, not a quota that forces every page to use every alignment. A deliberate full-bleed page can pass when its subject, crop, and continuation prove why the viewport edge matters; a page that is full-bleed only because the CSS grid has no counterfield needs a structural repair.

When an open brief has no signal strong enough to choose a workbench, editorial, or spatial grammar, use a subject-led exploratory fallback with at least one bounded stage and one different local anchor. This keeps the first render from inheriting a single utility axis by accident. It does not require a centered page: the title rail, object stage, prose, and handoff should still be allowed to choose start, center, or end from their jobs.

`spaceChoreography` makes that review executable: read the core sequence as `region:anchor/measure/field/density`, then verify each region's pause, occupancy, and mobile re-staging in the screenshots. It gives the implementing agent a spatial score to follow while preserving local variation; it does not turn a good reference or an authored composition into a fixed recipe.

The spatial budget makes the same review concrete. Start with a bounded dominant stage or reading measure on wide screens, keep a visible counterfield when the subject is not immersive, and allow only a legible subject or interaction to touch the narrow viewport edge. At intermediate widths, change the relationship before reducing type or squeezing a rail. These are starting ranges and review questions, not universal dimensions; the authority source may replace them when the rendered object and its continuation justify the exception.

The geometry audit should also compare the rhythm between regions, not only each region in isolation. A page can have an inset shell and still feel packed when every chapter reuses the same width, when several sections occupy nearly a full viewport height, or when narrow content has no text gutter. Treat `uniform-shell-rhythm`, `repeated-viewport-bands`, and `narrow-edge-content` as screenshot-critique prompts. They identify a repeated construction decision; they do not prohibit a deliberate gallery, table, or immersive scene.

Read text measures separately from media measures. An image may earn a wide or full field while its caption, explanation, and controls stay in a narrower reading track. Two or more wide prose regions close to the viewport edges are a review signal even when the page has no horizontal overflow; inspect line length, local alignment, and the empty field around the copy before polishing.

Do not let a single CSS container erase these decisions. The viewport field, content shell, object stage, and reading measure are separate layers. The same page may center a short thesis in an open field, start-align its prose inside a narrower reading measure, attach a source index to the object's end edge, and leave a quiet counterfield beside the stage. At an intermediate width, collapse the attachment or change its order before shrinking the stage below the subject's natural measure.

Change reading distance when the content changes. A full-width image, bounded instrument, narrow reading passage, and compact source record need not occupy the same shell. Repeated alignment can establish continuity; changes in width, scale, spacing, and placement can establish chapters. Neither repetition nor variation is mandatory by count.

An adaptive direction is not a visual style. For an ordinary website with no named case, choose a treatment such as a quiet editorial studio, warm humanist editorial, or another evidence-supported stance. Keep the content structure adaptive while making the visual language deliberate.

## First-Viewport Tests

Run the first viewport through four cheap tests before polishing:

1. **Thumbnail**: reduce the screenshot until text is unreadable. The dominant/counterweight relationship must still be clear.
2. **Grayscale**: remove hue. Grouping, selection, and action priority must survive through value, spacing, and shape.
3. **Blur**: soften detail. The eye should land on the intended object, not the loudest gradient, shadow, or heading.
4. **Mobile restage**: do not scale the desktop composition. Reorder the dominant, action, rail, and proof for touch and reading order.

Fix the largest silhouette problem first. Do not add another effect to a failed hierarchy.

Check a short desktop height as well as wide and narrow widths when the opening is media-led. An opening may show its next useful region at 900px and conceal it at 720px. Adjust the masthead, stage, caption, or pause as a relationship; keep the subject's focal features visible and recapture. Do not achieve the peek by squeezing every region or clipping the subject.

## Type And Spacing

- Name roles before values: display claim, title, body, label, metadata, action, and data/mono where relevant.
- Keep no more than three dominant text levels in the first viewport.
- Set a readable measure for copy. A title should wrap because the content has meaning, not because the container was left arbitrary.
- Use a spacing rhythm that belongs to the surface. Marketing chapters can breathe; workbenches need operational rhythm; data surfaces need predictable columns.
- Check real copy, mixed language, long labels, numbers, units, and error text. Placeholder copy hides typographic failures.
- Treat line breaks as composition decisions. An orphan word, accidental three-line button, or detached caption is a layout defect.

## Surface Discipline

Cards are a semantic choice, not a default wrapper. Prefer rows, rails, open bands, tables, media fields, drawers, sheets, timelines, and canvases when they describe the job more accurately.

An inset page is not automatically spacious. Inspect the content's distance from its own surface boundary as well as the viewport edge. A chapter-wide rounded box can leave a large outer margin while squeezing its reading tracks or putting a caption against the box edge. Try independent reading measures or an open chapter before treating a smaller wrapper as the repair; intentional image bleed can remain when its captions and controls still have a clear home.

Use one primary radius family and a small elevation vocabulary. Pills are for compact status or navigation; they should not become the silhouette of every control. Establish canvas/object/action contrast before adding glass, glow, blur, noise, or gradients.

For ordinary surfaces, default to soft structural geometry rather than hard-edge scaffolding. Keep the page field open, make the dominant stage the softest large contour, step down through panels and controls, and attempt spacing, alignment, tone, inset, crop, overlap, or depth before borders and dividers. Do not confuse this with rounding every section into a card. Read [geometry-language.md](geometry-language.md) for the full edge hierarchy and exceptions.

Use straight rules only when they carry a scanning, comparison, focus, safety, code, table, or intentional art-direction job. Prefer local low-contrast separators over page-wide rules, and avoid several 1px lines meeting at exposed right angles unless the precise grid is the point.

## AI-Default Bias List

Treat these as warnings against an unchosen template, not as universal bans:

- centered eyebrow + giant heading + button + three equal cards
- repeated 50/50 image/text sections with only the copy changed
- four KPI cards before the actual data relationship
- every region wrapped in the same rounded rectangle
- abstract claims such as “beautiful”, “powerful”, and “seamless” without an object or outcome
- dark gradient, glass, glow, or aurora used as the identity of an otherwise empty surface
- tiny gray metadata carrying the explanation for an oversized headline
- motion or hover effects compensating for missing content, hierarchy, or state design

The repair is structural: promote the real object, choose local relationships and measures, remove accidental equal weighting, specify the copy, and show the next useful state.

If a project-owned `DESIGN.md`, inspected reference, accepted concept, explicit user direction, or evidence-backed model proposal intentionally uses one of these patterns, keep it. Record the authority source, the deliberate reason, the evidence, the risk, the hard invariants preserved, and the rendered proof. The goal is to reject accidental defaults, not to reject authored design.

## Responsive Re-Staging

Desktop, tablet, and mobile should preserve the same visual thesis while changing the relationship between regions:

- on a wide screen, let the field grow without automatically enlarging prose, media, column gaps, or control travel; set subject-dependent maximum measures and leave the rest as useful space;
- at intermediate widths, regroup tracks before a paragraph, caption, or control becomes cramped; inspect this width rather than assuming two endpoint screenshots cover it;
- on mobile, choose which short titles benefit from centering, which reading blocks need a start edge, and which images truly need full bleed; remove vacant rail indentation when it no longer serves an index;
- collapse rails into an explicit sheet, tab, or indexed path;
- keep the dominant object identifiable before secondary explanation;
- move actions near the object they affect;
- preserve stable frame dimensions when inner state changes;
- keep fallback, reduced-motion, loading, empty, and error states in the same hierarchy.

The contract is successful when the page still reads as the same product after color and motion are removed, while no longer looking like a generic template.
