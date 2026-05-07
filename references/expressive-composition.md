# Expressive Composition

Use this reference when a UI is technically correct but feels mechanical, generic, or lifeless. A good surface should have structure and judgment, but also a memorable composition move that belongs to the product.

## Goal

Move beyond "neat layout" into intentional visual direction:

- one clear visual anchor
- varied rhythm instead of equal-weight repetition
- typographic hierarchy with contrast and cadence
- content-shaped layout instead of template-shaped layout
- a product-specific motif, material, media treatment, or interaction idea
- enough restraint that the expressive move does not damage usability

## Common Mechanical Patterns

Treat these as warning signs:

- centered hero, subtitle, two buttons, and three cards with no product-specific idea
- every section using the same card width, radius, shadow, and spacing
- equal visual weight for all panels, stats, actions, and text blocks
- generic dashboard grid where all cards compete instead of one area leading
- oversized heading used to compensate for weak composition
- gradients, glow, glass, or animated backgrounds added before hierarchy is solved
- icons used as decoration instead of clarifying meaning
- font scale that is mathematically tidy but emotionally flat
- too many isolated cards instead of composed regions
- responsive layout that only stacks blocks without rethinking the first read

## Expressive Composition Moves

Choose one or two, not all of them:

- **Hero anchor**: one dominant product image, data object, media object, live preview, or visual state that carries the first read.
- **Asymmetric balance**: a strong leading column, offset media, staggered modules, or unequal panes that still align to a clear grid.
- **Scale contrast**: meaningful jumps between display, title, body, labels, numbers, and metadata.
- **Density contrast**: one calm focal area paired with tighter supporting information.
- **Editorial rhythm**: alternating text/media scale, section pacing, pull quotes, captions, or narrative progression when content is the product.
- **Instrument panel**: dense controls grouped around a primary task, with strong hierarchy and minimal ornament.
- **Spatial continuity**: layout and motion that imply where the user came from and where the next action goes.
- **Material specificity**: surface, border, texture, shadow, and image treatment derived from the product domain, not generic UI fashion.
- **Data personality**: charts, metrics, badges, and numbers styled to match the product's stakes and usage frequency.
- **Content-shaped modules**: cards and panels sized by content importance, not by a repeated template.

## Typography With Character

Type should carry hierarchy and personality before decoration does.

Scale contrast does not mean "make the headline huge." For product UI, hierarchy should often come from placement, grouping, weight, density, whitespace, numeric treatment, and component state before display-size text.

Check:

- Does the type scale create a clear first, second, and third read?
- Does the heading rhythm vary by section purpose instead of repeating the same pattern?
- Are labels, captions, metadata, and numbers intentionally styled?
- Does the typeface or fallback fit the product character and language?
- Are line length, line height, and paragraph spacing designed for the actual content?
- Is there enough contrast between display, body, labels, and numeric data?

Avoid:

- one-size-fits-all heading blocks
- negative letter spacing everywhere
- huge type inside compact tools
- hero-scale headings in dashboards, settings, tables, forms, and dense workflow screens
- weak labels that look like placeholder text
- font choices that fail with CJK or mixed-language content

## Layout Taste Checks

Before final delivery, inspect the screenshot and ask:

- What is the one thing the user sees first, and is it the right thing?
- Where does the eye go second and third?
- Could this layout be swapped into a random SaaS template without anyone noticing?
- Is every major region the same size or same weight?
- Is the most important workflow physically easier to see and act on?
- Does the layout use negative space as structure, not emptiness?
- Is there a product-specific visual idea, not just clean components?
- Does mobile preserve the same idea with a different structure, or merely stack cards?

If the answer is weak, revise composition before adding effects.

## Implementation Rule

When a UI feels mechanical:

1. Remove decorative effects that are hiding weak composition.
2. Pick the primary visual anchor.
3. Reweight the layout around that anchor.
4. Add contrast in scale, density, alignment, or material.
5. Make typography carry hierarchy.
6. Reintroduce color, motion, and components only after the composition has a point of view.
