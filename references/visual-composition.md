# Visual Composition Contract

The most common failure in generated frontend UI is not a missing component. It is an unchosen composition: a centered hero, a neutral headline, a row of equal cards, and a pile of effects trying to create hierarchy after the fact. This guide turns visual judgment into constraints an implementation can execute and a reviewer can disprove.

## Lock Before Styling

Write these decisions before choosing colors, shadows, gradients, or animation:

- **Composition grammar**: rail + canvas, object + caption, table + detail, specimen + index, narrative chapters, or another named relationship.
- **Alignment axis**: the edge, baseline, column, or origin that repeats across title, object, action, and supporting detail.
- **Dominant**: the one object, task, data relationship, or media proof that owns the first read.
- **Counterweight**: the small region that balances the dominant without competing with it.
- **Below-fold peek**: the next proof or state that enters the first viewport and explains why the page continues.
- **Type ceiling**: the largest title role the content and viewing distance can justify.
- **Surface budget**: the maximum framed surfaces, radius family, and elevation levels allowed in the first viewport.
- **Geometry contract**: edge character, corner hierarchy, separation strategy, line policy, and any localized sharp exception.
- **Visual treatment**: the palette temperature, type relationship, material logic, media behavior, and one repeatable signature device that make the otherwise ordinary surface feel authored.

If these are not named, the build is still choosing a template by accident.

An adaptive direction is not a visual style. For an ordinary website with no named case, choose a treatment such as a quiet editorial studio, warm humanist editorial, or another evidence-supported stance. Keep the content structure adaptive while making the visual language deliberate.

## First-Viewport Tests

Run the first viewport through four cheap tests before polishing:

1. **Thumbnail**: reduce the screenshot until text is unreadable. The dominant/counterweight relationship must still be clear.
2. **Grayscale**: remove hue. Grouping, selection, and action priority must survive through value, spacing, and shape.
3. **Blur**: soften detail. The eye should land on the intended object, not the loudest gradient, shadow, or heading.
4. **Mobile restage**: do not scale the desktop composition. Reorder the dominant, action, rail, and proof for touch and reading order.

Fix the largest silhouette problem first. Do not add another effect to a failed hierarchy.

## Type And Spacing

- Name roles before values: display claim, title, body, label, metadata, action, and data/mono where relevant.
- Keep no more than three dominant text levels in the first viewport.
- Set a readable measure for copy. A title should wrap because the content has meaning, not because the container was left arbitrary.
- Use a spacing rhythm that belongs to the surface. Marketing chapters can breathe; workbenches need operational rhythm; data surfaces need predictable columns.
- Check real copy, mixed language, long labels, numbers, units, and error text. Placeholder copy hides typographic failures.
- Treat line breaks as composition decisions. An orphan word, accidental three-line button, or detached caption is a layout defect.

## Surface Discipline

Cards are a semantic choice, not a default wrapper. Prefer rows, rails, open bands, tables, media fields, drawers, sheets, timelines, and canvases when they describe the job more accurately.

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

The repair is structural: promote the real object, choose an axis, remove equal weighting, shorten and specify the copy, and show the next useful state.

If a project-owned `DESIGN.md`, inspected reference, accepted concept, explicit user direction, or evidence-backed model proposal intentionally uses one of these patterns, keep it. Record the authority source, the deliberate reason, the evidence, the risk, the hard invariants preserved, and the rendered proof. The goal is to reject accidental defaults, not to reject authored design.

## Responsive Re-Staging

Desktop, tablet, and mobile should preserve the same visual thesis while changing the relationship between regions:

- collapse rails into an explicit sheet, tab, or indexed path;
- keep the dominant object identifiable before secondary explanation;
- move actions near the object they affect;
- preserve stable frame dimensions when inner state changes;
- keep fallback, reduced-motion, loading, empty, and error states in the same hierarchy.

The contract is successful when the page still reads as the same product after color and motion are removed, while no longer looking like a generic template.
