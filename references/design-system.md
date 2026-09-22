# Design System Decision Guide

This guide turns the local brief into decisions that can survive implementation. Use it with the output of `scripts/design-brief.mjs`.

## Confidence And Provenance

Every decision belongs to one of three buckets:

- **Observed**: directly supported by a project file, rendered state, user asset, or inspected reference.
- **Inferred**: a reasonable choice derived from the requirement and observed constraints.
- **Open**: missing evidence that could change the choice.

Do not present an inferred font, palette, or motion system as an existing product fact. The generated brief must keep these labels visible.

If the project has a substantive `DESIGN.md`, treat it as project-owned visual memory before ranking local styles or treatments. The saved candidates are fallback vocabulary for missing fields, not a normalization pass over the project's own direction. See [constraint-authority.md](constraint-authority.md) for the precedence and exception record.

## Content Readiness

Use the lowest level that describes the actual surface:

- **L0**: placeholders, invented claims, missing product object, or thin media. Use restrained UI craft; do not fake a cinematic hero.
- **L1**: real workflows, entities, forms, tables, settings, or operational data. Use productive UI, compact type, complete states, and useful feedback motion.
- **L2**: a strong product/data/media object users inspect, compare, configure, or manipulate. Give it a focused visual anchor.
- **L3**: authored copy plus high-quality image/video/model/motion/media system where storytelling or immersion is the actual job. Consider stronger expression only after proving fit, performance, and fallback.

Good content supports expression; it does not create a need for display type. If the same job works with smaller type, use smaller type.

## Type Identity

Choose roles, not a font name alone:

```text
UI/body:
Display/editorial, if needed:
Numeric/code:
Script and language support:
Largest role and ceiling:
Why this pairing fits:
```

Default ceilings:

- dense tools, dashboards, settings, tables, and forms: compact page title, usually no display role;
- panels, dialogs, and sidebars: short headings sized for scanning;
- metrics: large only when the metric is the primary object and has context;
- editorial or launch surfaces: display type only when copy, composition, and supporting media earn it.

Avoid choosing a default sans by habit, but do not add a second family just to look designed. Test real content, mixed language, numbers, truncation, and user text scaling.

## Shape Language

Name the job of the surface before naming its radius:


```text
Primary surface: pane / canvas / table / frame / rail / page
Secondary surface: row / strip / drawer / sheet / panel
Object/media surface:
Navigation and controls:
Radius/depth/material logic:
Card budget:
What must not become a card:
```

Cards are for discrete repeated objects, summaries, media, or selectable items. Do not wrap every section, toolbar, hero, statistic, and state in the same rounded rectangle. A recognizable silhouette should survive a grayscale screenshot.

## Color And Material

Choose semantic roles before hex values:

```text
Canvas:
Surface:
Elevated surface:
Text / muted text:
Border / divider:
Action accent:
Success / warning / danger:
Contrast and dark/light behavior:
```

Use one clear accent plus semantic states unless the product has a real multi-color data model. Avoid gradients, glow, noise, and translucent material as substitutes for hierarchy. Check contrast in the actual component state, not only on the base surface.

## Motion Budget

Choose the smallest motion grammar that explains the product:

- **Low**: press, focus, selection, and short feedback.
- **Medium**: panel, tab, filter, list, route, or data continuity.
- **High**: authored scroll, product object, media, or spatial narrative.

Every motion decision names its trigger, purpose, duration range, interruption behavior, reduced-motion state, and cleanup owner. Decorative loops do not count as product quality.

## Premium Finish

When the direction needs to feel high-end, read [premium-finish.md](premium-finish.md). Check grayscale hierarchy, optical alignment, type ceiling, surface/material layers, specific copy, asset truth, and one restrained interaction before adding visual effects. Remove at least one treatment that does not carry product meaning.

## Brief Output

A useful brief ends with:

```text
Direction:
Signature move:
Signature interaction:
Type ceiling:
Component shape language:
Medium decision:
What is intentionally not used:
Confidence:
Open evidence:
```

If the last three fields are missing, the brief is too confident to be useful.
