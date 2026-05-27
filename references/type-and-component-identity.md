# Type and Component Identity

Use this when a frontend surface risks looking like the same generic page: one default font, repeated default components, identical panels, square-block sections, and no product-specific component silhouette.

Core rule:

```text
Typography and component shape are identity decisions, not defaults.
```

The goal is not to use many fonts or unusual shapes. The goal is to make the type roles and component forms match the product's scene, workflow, content, state model, input method, and style anchor.

## Type Identity Decision

Before implementing substantial UI, define:

```text
Type identity:
Product scene:
Language/script needs:
Primary UI/body family:
Display/editorial family:
Numeric/code family:
Why one family is enough, if using one:
Pairing logic:
What this avoids:
```

Guidance:

- Use the project's existing font tokens first when they are intentional and fit the scene.
- If building from scratch, choose type by product character, not by habit.
- A single family is acceptable only when the scene benefits from restraint, the family has enough weights/features, and the design still has hierarchy through size, weight, spacing, and role.
- Two families are often better for distinctive work: one for UI/body reliability, one for display/editorial character, numbers, or technical material.
- Three families is the usual ceiling: UI/body, display/editorial, mono/numeric/code.
- For CJK or mixed-language UI, choose fonts and scale for real Chinese text, not Latin-only screenshots. Avoid huge Chinese headings unless the surface genuinely supports them.
- Use tabular numbers for metrics, finance, dashboards, clocks, and aligned numeric lists.

Scene examples:

- **Productive app / dashboard**: compact humanist or neo-grotesk sans for UI, tabular numeric treatment, optional mono for IDs, code, commands, logs, shortcuts, or chips.
- **Developer / builder tool**: readable UI sans plus restrained mono accents. Avoid turning every label into monospace.
- **Editorial / report / thought leadership**: serif or editorial display for headlines only when the writing earns it, paired with a highly readable body face.
- **Luxury / cinematic / brand story**: high-contrast serif, condensed display, or cinematic title face may be used sparingly, with restrained body/UI text.
- **Warm consumer / education / wellness**: humanist or rounded sans, friendly weights, softer rhythm; avoid childish type unless the product actually calls for it.
- **Data / research / finance**: stable sans, tabular numbers, clear labels, low-drama display.

Reject:

- using Inter/system/default sans everywhere by habit
- one font size/weight rhythm across every product category
- display type used only to make a generic screen feel designed
- decorative font choices that make labels, tables, forms, or mobile UI harder to read
- fake sophistication from letter spacing, all-caps labels, or oversized headings

## Component Shape Language

Before building or restyling substantial UI, define:

```text
Component shape language:
Primary surface form:
Secondary surface form:
Object/media form:
Navigation/control form:
Radius/depth/material logic:
Card budget:
What should not be a card:
What breaks the square-block pattern:
```

Good UI should have a recognizable silhouette. At screenshot distance, the page should not read as a grid of identical rectangles unless the product is intentionally a dense list, table, board, or catalog.

This applies to every component category, not only cards:

- navigation
- command surfaces
- buttons and icon buttons
- forms and validation
- tables and lists
- charts and data objects
- media and product objects
- panels, drawers, dialogs, sheets, and inspectors
- tabs, segmented controls, filters, menus, and toolbars
- loading, empty, error, success, selected, disabled, and partial-data states
- animation, model, spatial, and canvas components

Possible forms:

- split panes
- inspector panels
- rails and docks
- command bars
- list rows
- dense tables
- object/media canvases
- product frames
- timeline lanes
- comparison columns
- maps/charts/waveforms
- carousels only when real browsing behavior exists
- toolbelts and floating controls
- cards for true repeated items only

## Component Context Decision

For substantial UI, record the component logic before choosing shapes or imports:

```text
Component context decision:
Component / component family:
Job:
Scene:
Input model:
Density:
Existing primitive:
Chosen form:
State cycle:
Motion / feedback:
Accessibility constraint:
What default pattern is rejected:
```

Examples:

- A high-frequency filter control may be a compact toolbar with chips, saved views, keyboard focus, and row-count feedback, not a decorative filter card.
- A product showcase may need a staged media frame, caption system, object inspection, and scroll reveal, not a generic screenshot card.
- A settings page may need grouped rows, inline validation, and progressive disclosure, not a stack of equal cards.
- A data-heavy screen may need tables, split panes, sticky columns, selected-row detail, and skeleton rows, not metrics in large square tiles.
- A mobile flow may need bottom sheets, steppers, tactile press states, and thumb-zone controls, not desktop cards collapsed into one column.

Rules:

- Cards are for discrete repeated objects, summaries, media, or selectable items. Do not wrap every section, toolbar, hero, form, and statistic in cards.
- If using cards, vary their job: one object card, one detail panel, one control strip, one list/table region, not same radius/border/shadow everywhere.
- Choose radius and depth from the style anchor: sharp editorial grids, quiet app panels, tactile consumer controls, cinematic media frames, technical instrument surfaces, etc.
- Components should inherit local primitives and accessibility behavior, but their arrangement, density, and surface treatment should express the selected direction.
- In tools and dashboards, distinction can come from density, rails, rows, selected states, tables, and object panels instead of decorative cards.
- In brand/editorial/product pages, distinction can come from media frames, cropping, overlays, captions, scroll rhythm, and object staging instead of generic feature cards.

Reject:

- all modules having the same rectangle, radius, border, padding, and shadow
- floating cards inside cards
- hero, navbar, stats, feature list, testimonials, and CTA all using the same block pattern
- arbitrary rounded boxes because there is no layout idea
- component-library defaults used as the product identity
- "grid of cards" as the default answer for every requirement

## Generic Component Default Audit

Before finalizing a screen, check whether any component was chosen by habit instead of scene fit:

- filled primary button plus ghost secondary button everywhere
- pill badges for every metadata label
- small uppercase eyebrow above every section
- accordion FAQ or accordion settings when inline disclosure, search, side-by-side lists, or grouping would fit better
- modal for simple edit, inspect, or confirm flows that would work better as inline editing, drawer, popover, or dedicated page
- circular avatar, sun/moon toggle, three-column pricing, testimonial carousel, logo wall, or footer link farm by default
- generic circular spinner instead of skeletons, progress, or state-specific loading
- repeated split headers, repeated zigzags, or repeated equal tiles
- long lists implemented as decorative blocks instead of tables, rows, virtualized lists, or grouped sections
- chart, map, waveform, timeline, canvas, media, model, or editor surfaces treated like ordinary cards

These are not banned patterns. They need a reason tied to the requirement, reference, workflow, and component context decision.

## Identity Check

Before final delivery, ask:

- Does the type choice reveal the product category or mood, or could it be any AI-generated site?
- If only one font is used, is that a deliberate decision with enough hierarchy?
- Are numbers, labels, body copy, headings, and controls treated as different roles?
- Does the page silhouette have a clear structure beyond equal rectangles?
- What parts are intentionally not cards?
- Do component forms match the workflow: scan, compare, edit, inspect, buy, read, configure, monitor, command, or tell a story?
- Did every major component family get a context decision instead of a default shape?
- Are navigation, controls, forms, tables/lists, media, panels, and states shaped by their jobs?
- Does the result still look distinct with colors temporarily removed?
