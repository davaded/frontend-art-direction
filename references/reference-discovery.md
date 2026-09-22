# Reference Discovery

Use this mode for a product, brand, hardware, peripheral, or media-led site when the user has not supplied a concrete visual case. The objective is not to collect attractive pages. It is to find a small set of live sources that can improve a visible product decision.

## Source Order

Rank sources in this order unless the task gives a stronger constraint:

1. The user's supplied site, screenshot, or brand material.
2. An official product or brand site that proves the same object, audience, or buying decision.
3. An official design system or platform guideline for behavior, semantics, and accessibility.
4. A maintainer-run component, state, or motion showcase for a narrow implementation job.
5. A curated gallery for discovery only. Do not use gallery polish as proof of product fit.

Quality and task fit outrank geography, star count, and local-market proximity. A global reference is not automatically better, and a local reference is not automatically worse; the page must win on the decision it is being used to inform.

Run the local scout before browsing broadly:

```bash
node <skill-root>/scripts/reference-scout.mjs \
  --query "premium keyboard and mouse product website" \
  --format md
```

The scout is a shortlist generator. Open the selected official pages and record what was actually visible before calling a source used.

## Hardware And Peripheral Lens

For hardware, computer accessories, audio, phones, cameras, or desk devices, the default reference jobs are:

1. **Product object**: Is the object recognizable before the copy explains it?
2. **Material and industrial character**: Do finish, silhouette, construction, and scale carry real product meaning?
3. **Feature proof**: Does each section prove one outcome with a real image, interaction, measurement, or workflow?
4. **Comparison and purchase path**: Can a user compare, configure, get support, and buy without breaking the story?

Useful official starting points in the local catalog include Apple Mac/iPhone, Teenage Engineering, Logitech MX, Elgato Creator Hardware, Bang & Olufsen, Framework, and Razer for gaming-specific work. These are not a fixed bundle. Select only the sources whose jobs are distinct and relevant.

## What To Extract From A Product Site

Record facts at the level of decisions:

```text
Product object:
First viewport:
Navigation and local product nav:
Section/chapter rhythm:
One claim per section:
Object, material, and lifestyle media:
Feature or performance proof:
Variant/configuration behavior:
Comparison and purchase path:
Support, trust, and recovery path:
Mobile re-staging:
Motion purpose and static fallback:
```

Apple-style product pages are useful because they usually make the object legible first, then move through distinct proof chapters such as design, performance, software, connectivity, security, comparison, and purchase support. Borrow the sequencing principle, not the brand, copy, exact spacing, or product framing.

## No Named Case

When the request is only “make a premium hardware website”:

1. Resolve the product profile and audience before choosing a visual skin.
2. Run the scout and live-inspect no more than three distinct sources.
3. Write a direction assumption with one primary object, one chapter rhythm, one type ceiling, one material rule, and one conversion path.
4. If the real product object or media is missing, lower the expression budget. Use a concept image or restrained product surface as a hypothesis, not as fake product proof.
5. Implement the first viewport and one complete proof chapter before filling the rest of the page.

For a greenfield, visually-led surface, a generated concept image may be used as a temporary visual hypothesis. It must be inspected, translated into tokens and component geometry, and replaced or supported by licensed/real product media before release.

## Visual QA

Compare the implemented render with the direction assumption at the same viewport and state. Check, in order:

1. Product object prominence and first read.
2. Type scale, line length, and section rhythm.
3. Material, image crop, contrast, and surface hierarchy.
4. Proof density, comparison clarity, and purchase/support access.
5. Mobile order, touch targets, loading/fallback, reduced motion, and console errors.

Fix the largest visible mismatch first. A successful build, a URL response, or a polished screenshot without a working state is not visual acceptance.

## Boundaries

- Do not use a regional competitor as the default merely because it sells the same category.
- Do not infer quality from awards, stars, or a screenshot without inspecting the live interaction and content hierarchy.
- Do not copy logos, proprietary assets, exact copy, source code, or an indistinguishable full-page composition.
- Do not call a source “used” until a visible decision was inspected and translated into the target product.
