# Taste Positioning

Use this when a UI is correct but forgettable: safe, neat, bland, over-normalized, or "fine" without a point of view. The goal is not to make every product loud. The goal is to make a deliberate choice and make that choice visible.

## Core Rule

Do not average all references into a neutral middle. Pick a stance, then make the UI prove it.

For substantial UI work, write this before implementation:

```text
Design stance:
Personality axis:
Signature move:
Signature interaction:
Type ceiling:
Display need:
Display support:
What stays restrained:
What gets removed because it is generic:
```

If these fields are vague, the result will usually be vague.

## Stance Options

Choose one primary stance. Add a secondary stance only if it has a clear job.

- **Quiet precision**: restrained, dense, exact, tool-like. Distinction comes from alignment, information architecture, crisp states, and micro-interactions.
- **Kinetic product**: motion and state are part of the product feel. Distinction comes from transitions, continuity, live feedback, and tactile controls.
- **Visual object**: a product object, model, canvas, chart, waveform, map, document, or media item anchors the layout.
- **Editorial authority**: typography, pacing, imagery, and narrative rhythm lead. Suitable for content, reports, launches, portfolios, and brand stories.
- **Instrument panel**: dense controls around a primary task. Suitable for creators, operators, analytics, media tools, dev tools, and expert workflows.
- **Consumer character**: warmer, more memorable, more expressive. Distinction comes from brand language, illustration/media, playful states, and memorable details.

Bad stance: "clean modern premium." That is not a stance.

## Anti-Bland Checks

Reject the first pass if:

- the UI could be pasted into any generic SaaS template
- every module has the same size, radius, border, and spacing
- the only "personality" is color, glow, or a large headline
- large type appears because good assets exist, not because the surface actually needs display scale
- large type appears without strong content, image, animation, model, data object, or editorial material supporting it
- there is no signature interaction or state change
- typography is either oversized or all the same weight
- icons, charts, images, and cards feel sourced from unrelated systems
- the layout has no visual anchor
- the design is neither clearly restrained nor clearly expressive

## Interaction and Motion Taste

Substantial UI should have a signature interaction, not just hover color.

Good examples:

- a command surface where selection, preview, and details move as one object
- a dashboard where filtering preserves row/card continuity
- a media UI where playback, waveform, and queue states have a shared rhythm
- a product page where the model/canvas reacts to configuration changes
- a form where validation, progress, and success states feel designed
- a dense tool where panels dock, collapse, and focus with clear spatial logic

Keep motion short and purposeful:

- 80-140ms for press, hover, focus, selection
- 140-240ms for menus, popovers, tabs, filters, row changes
- 220-420ms for panels, route continuity, reveal, product-object changes
- longer only for narrative, 3D, scroll, or onboarding moments

If an animation does not communicate state, continuity, product meaning, or delight after task success, remove it.

## Typography Restraint

Default to smaller, more intentional type in product tools.

Suggested ceilings unless the brief explicitly justifies display scale:

- dense tools, dashboards, settings, tables, forms: 24-32px page title max
- compact panels, cards, sidebars, dialogs: 16-22px headings
- metrics: large numbers only when they are the actual primary object
- landing/editorial/brand pages: display type allowed, but only with strong composition and real visual material

Rules:

- If a heading can be 40% smaller with no loss of meaning, make it smaller.
- Do not use huge words to create drama in a dashboard, settings page, table, or expert tool.
- Do not use huge words to compensate for missing copy, weak assets, absent motion, missing model quality, or generic background treatment.
- Use hierarchy through grouping, position, contrast, rhythm, and labels before increasing font size.
- Make numbers intentional: tabular, aligned, scoped, and paired with context.
- Strong editorial copy, a product object, a high-quality image/illustration, a meaningful animation, a framed 3D/model moment, or a data/media object can support large display type, but it does not automatically make large type appropriate.
- Large display type must be needed by the surface and earned by its support. When unsure, make it smaller.

## Recovery Recipe

When the UI feels "食之无味，弃之可惜":

1. Remove one generic layer: extra cards, decorative background, oversized heading, weak icon row, or ornamental glow.
2. Choose one stance from the list above.
3. Pick one visual anchor or object.
4. Add one signature interaction tied to state or workflow.
5. Set a type ceiling before restyling.
6. If large text was used, name the display need and support material; if either is weak, shrink the text and strengthen content, media, or interaction first.
7. Recompose the screen around the anchor and interaction.
8. Verify that the screenshot has a recognizable first read without needing explanation.
