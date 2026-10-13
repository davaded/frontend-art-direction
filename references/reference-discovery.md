# Reference Discovery

Use this mode for any substantial frontend whose visual direction needs evidence. Start from the user's supplied case when present; otherwise search from the actual subject, audience, content, and missing decision. A catalog cannot define the boundaries of design. Find a small set of sources that can improve visible decisions, then implement and compare.

## Source Order

Rank sources in this order unless the task gives a stronger constraint:

1. The user's supplied site, screenshot, or brand material.
2. An original live site or complete authored project that demonstrates the needed composition, content, or workflow relationship.
3. An official design system or platform guideline for behavior, semantics, and accessibility.
4. A maintainer-run component, state, or motion showcase for a narrow implementation job.
5. Galleries, visual communities, and directories for discovering candidates. Follow the original source before calling a whole-page layout or behavior inspected.

Quality and task fit outrank geography, star count, and local-market proximity. A global reference is not automatically better, and a local reference is not automatically worse; the page must win on the decision it is being used to inform.

Run the local scout before browsing broadly:

```bash
node <skill-root>/scripts/reference-scout.mjs \
  --query "premium keyboard and mouse product website" \
  --format md
```

The scout is a shortlist generator. Open the selected official pages and record what was actually visible before calling a source used.

## Discover By The Missing Decision

The scout exposes all channels below as a reserve and recommends a few by job. This is not a mandatory tour, a list of page genres, or an aesthetic ranking.

| Missing decision | Starting points | Evidence to obtain |
| --- | --- | --- |
| Full-page composition, typography, chapter rhythm | [Siteinspire](https://www.siteinspire.com/), [MUUUUU.ORG](https://muuuuu.org/zh/), [Awwwards](https://www.awwwards.com/websites/) | Original site's opening, middle, ending, and responsive changes |
| Complete visual concept and type/image relationships | [Behance](https://www.behance.net/) | Whole project; distinguish a presentation board from a live implementation |
| Real screen and task sequence | [Mobbin](https://mobbin.com/) | Captured states, entry/action/result/recovery path; current behavior where relevant |
| Focused component or micro-interaction | [Dribbble](https://dribbble.com/), existing component/motion reserve | Specimen anatomy, state behavior, constraints; whole-product usability remains unproven |
| Cross-media composition or motion relationships | [Inspora](https://www.inspora.design/) | Recorded or live medium, creator link, complete sequence; trace the original before borrowing |
| Website motion and section continuity | [MotionSites AI](https://motionsites.ai/) | Accessible demo, full-page scope and responsive behavior; distinguish video, live controls and licensed material |
| Material, image, color, or visual mood | [Pinterest](https://www.pinterest.com/), [Huaban](https://huaban.com/) | Original source, authorship, asset rights; use a moodboard as a hypothesis |
| Fresh discovery or missing channels | [Muzli](https://muz.li/), [Eagle Blog](https://cn.eagle.cool/blog/post/best-websites-designers-love-for-finding-design-inspirations) | Creator/live-project link, not the aggregator's popularity |

If a site requires login, returns an access error, or does not expose the relevant case, record that boundary and use another accessible source. Do not claim research from a name, search result, or a blocked page. No account, extension, or subscription is required by this workflow.

## What The Current References Teach

The useful unit of research is a relationship, not a skin. Current reference sources support four recurring observations:

- **Alignment communicates hierarchy.** Use a local edge, baseline, center, or origin when it tells the reader which things belong together. Change that relationship when the content changes job. Apple's layout guidance explicitly treats alignment, grouping, reading order, safe areas, and adaptation as hierarchy decisions, and recommends progressive disclosure when the whole collection does not belong on screen at once. See [Apple Layout](https://developer.apple.com/design/human-interface-guidelines/layout) and [Apple Design Principles](https://developer.apple.com/design/human-interface-guidelines/design-principles/).
- **A strong page has a dominant object and a counterfield.** Siteinspire separates grid layouts from unusual layouts and exposes subject/type filters; that is a useful reminder to choose the page grammar from the subject instead of forcing every brief into a grid. Use [Siteinspire](https://www.siteinspire.com/) to find candidates, then inspect the original site at opening, middle, ending, and narrow widths.
- **Workflow quality lives across states.** Mobbin is valuable because it organizes real screens, flows, and UI elements rather than only hero compositions. Extract entry, action, result, recovery, and mobile regrouping from [Mobbin](https://mobbin.com/); do not treat a single screenshot as a complete product.
- **Components are local instruments.** Rare UI presents individual animated React components that can be installed source-first, while the surrounding page still needs its own hierarchy and product object. Borrow one component for a named job, adapt its tokens and states locally, and keep it removable. See [Rare UI](https://www.rareui.com/).
- **Subject material prevents interchangeable pages.** When the subject has an official archive, making-of record, specimen, source document, or physical detail, inspect that material in addition to the homepage. A process frame, measurement, crop, or source relationship can become a useful counterweight or proof moment. Keep the material's identity and credit visible, and do not turn this into an automatic gallery section.

Translate these observations into the build contract as: dominant/counterweight, per-region placement and text alignment, natural measure, named empty-space purpose, optional versus core relationships, and explicit wide/intermediate/narrow regrouping. A reference pass fails when it only returns colors, gradients, rounded corners, or a list of attractive components.

Component libraries complement page research. Load `reference-composition` and `resource-catalog` for a named gap in the chosen structure; combine source-owned pieces with one coherent type, material, spacing, and state language. A pile of beautiful components does not choose the page's relationships for it.

One inspected specimen is Kyle Thacker's [Soft glass workspace picker](https://www.inspora.design/posts/soft-glass-workspace-picker), viewed on 2026-10-13 at 1280x720. The recorded demo attaches a view-selection popover to its toolbar trigger and combines icons, labels and checkmarks to expose enabled views. Those contextual and state relationships can inform a target's own controls; the glass material and palette remain choices. Inspora links to the [creator's original post](https://x.com/kylethacker/status/2106909046880244165), but that original prototype was not inspected. This observation establishes a visible design hypothesis, not functioning input, exclusive selection, keyboard behavior, mobile layout or a translated target result.

## Hardware And Peripheral Lens

For hardware, computer accessories, audio, phones, cameras, or desk devices, the default reference jobs are:

1. **Product object**: Is the object recognizable before the copy explains it?
2. **Material and industrial character**: Do finish, silhouette, construction, and scale carry real product meaning?
3. **Feature proof**: Does each section prove one outcome with a real image, interaction, measurement, or workflow?
4. **Comparison and purchase path**: Can a user compare, configure, get support, and buy without breaking the story?

Useful official starting points in the local catalog include Apple Mac/iPhone, Teenage Engineering, Logitech MX, Elgato Creator Hardware, Bang & Olufsen, Framework, and Razer for gaming-specific work. These are not a fixed bundle. Select only the sources whose jobs are distinct and relevant.

## What To Extract From A Site

Record facts at the level of decisions:

```text
Subject, task, or authored intent:
First viewport:
Navigation and local product nav:
Per-region placement vs text alignment:
Viewport field vs content/object/reading measures:
Useful empty space and neighbor relationships:
Section/chapter rhythm and density changes:
Real media, material, and content:
Proof, interaction, or reading continuation:
Ending and destinations:
Mobile re-staging:
Motion purpose and static fallback:
```

Apple-style product pages are useful because they usually make the object legible first, then move through distinct proof chapters such as design, performance, software, connectivity, security, comparison, and purchase support. Borrow the sequencing principle, not the brand, copy, exact spacing, or product framing.

## No Named Case

When the request names a subject or website type but no case:

1. Read the actual subject, audience, content, and purpose; keep unclear details provisional.
2. Run the scout. Use a relevant catalog candidate or its open discovery plan; a subject missing from the catalog must not inherit hardware references.
3. Inspect a few distinct sources that resolve different gaps. Derive region relationships and responsive behavior, not a fixed skin or a single global alignment.
4. Form structurally different concepts from real content; choose by coherence, intent fit, readable measures, and feasibility. An accepted user or project direction can own this choice.
5. Implement the chosen full scope with authentic or generated usable media. Compare actual wide, ordinary, intermediate, and narrow renders; repair the largest visible gap.

For a greenfield, visually-led surface, a generated concept image may be used as a temporary visual hypothesis. It must be inspected, translated into tokens and component geometry, and replaced or supported by licensed/real product media before release.

## Visual QA

Compare the implemented render with the direction assumption at the same viewport and state. Check, in order:

1. Subject or working-object prominence and first read.
2. Type scale, line length, and section rhythm.
3. Material, image crop, contrast, and surface hierarchy.
4. Content density, readable measures, local alignment, useful space, and complete paths/ending.
5. Mobile order, touch targets, loading/fallback, reduced motion, and console errors.

Fix the largest visible mismatch first. A successful build, a URL response, or a polished screenshot without a working state is not visual acceptance.

## Boundaries

- Do not use a regional competitor as the default merely because it sells the same category.
- Do not infer quality from awards, stars, or a screenshot without inspecting the live interaction and content hierarchy.
- Do not copy logos, proprietary assets, exact copy, source code, or an indistinguishable full-page composition.
- Do not call a source “used” until a visible decision was inspected and translated into the target product.
