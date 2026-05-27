# Style Anchor Recipes

Use this when choosing or presenting a visual direction. The goal is to make each direction concrete without importing a large recipe catalog.

Core rule:

```text
No direction without an anchor. No anchor without borrow / avoid / misuse risk.
```

An anchor can be a user-provided reference, an inspected product, a design system, a studio/designer school, a known category leader, or one of the lightweight recipes below. Anchors are not skins to copy. They are taste constraints that explain what to borrow, what to avoid, and why the direction fits the current scene.

## Style Anchor Card

Every substantial visual direction, Direction Advisor option, or new visual language should include:

```text
Style anchor:
School:
Best for:
Scene fit:
Signature move:
Medium/motion fit:
Type behavior:
Borrow:
Avoid:
Misuse risk:
Verification clue:
```

Rules:

- Use local or user-provided references first. If the project already has `DESIGN.md`, Figma, screenshots, tokens, or shipped screens, the anchor must respect them.
- If the anchor is a public product, studio, designer, or recent web reference and it matters to the decision, inspect or verify it before relying on memory.
- Do not combine more than two anchors unless the user explicitly wants exploration and the combination has a clear reason.
- Do not describe the anchor as "clean", "modern", "premium", "sleek", or "Apple-like" without naming concrete signature moves.
- If no listed anchor fits, create a custom anchor card with the same fields before presenting it.

## Lightweight Anchor Index

### Quiet Precision

Style anchor: Apple HIG / Dieter Rams-Braun.
Best for: settings, productivity tools, mobile utilities, hardware-adjacent products, calm high-trust flows.
Signature move: restrained surfaces, exact alignment, few roles, quiet dividers, strong affordance clarity.
Medium/motion fit: subtle feedback, state continuity, product imagery only when real and useful.
Type behavior: compact, role-based, rarely display-sized.
Borrow: restraint, hierarchy discipline, tactile controls, clear states.
Avoid: fake Apple gloss, giant launch-page type in app UI, generic device mockup worship.
Misuse risk: becomes sterile or under-designed when there is no strong information architecture.

### Information Architecture

Style anchor: Pentagram / Vignelli / Tufte.
Best for: dashboards, research tools, documentation, reports, data products, complex navigation.
Signature move: grid-first structure, typographic hierarchy, restrained color, high signal-to-noise.
Medium/motion fit: static clarity first; motion only for filtering, drill-down, comparison, or state continuity.
Type behavior: confident scale contrast but disciplined roles.
Borrow: layout rigor, labels, grouping, data density, editorial order.
Avoid: decorative minimalism, empty whitespace that hides complexity, fake chart drama.
Misuse risk: can feel academic or dry if the product needs warmth or direct manipulation.

### Modern Builder Tool

Style anchor: Linear / Raycast / Vercel.
Best for: developer tools, AI tools, command surfaces, infrastructure, project management, workflow apps.
Signature move: command clarity, dense panels, crisp states, monospace chips or technical microcopy.
Medium/motion fit: quick panel transitions, command feedback, selection/detail continuity.
Type behavior: compact interface type, restrained page titles, strong labels and metadata.
Borrow: focus states, keyboard-first flows, subtle depth, precise interaction rhythm.
Avoid: GitHub-dark cosplay, purple-blue AI gradients, every panel as the same card.
Misuse risk: easily becomes another generic dark SaaS clone.

### Instrument Panel

Style anchor: Bloomberg Terminal / Figma / Ableton-style creator tools.
Best for: expert tools, editors, monitoring, analytics, media controls, operational dashboards.
Signature move: a primary work object surrounded by toolbars, inspectors, status, and control clusters.
Medium/motion fit: selection, docking, collapse, scrub, drag, and live-update feedback.
Type behavior: compact, numeric, tabular, density-aware.
Borrow: control grouping, state density, keyboard/touch affordances, object identity.
Avoid: marketing whitespace, oversized headings, decorative empty cards.
Misuse risk: can feel crowded if grouping, contrast, and hierarchy are weak.

### Editorial Authority

Style anchor: NYT / Monocle / Stripe Press.
Best for: longform, reports, explainers, launch narratives, case studies, premium content.
Signature move: strong reading rhythm, high-quality copy, measured whitespace, image-caption discipline.
Medium/motion fit: scroll pacing, chapter reveals, media as evidence, not decoration.
Type behavior: display type allowed only when the copy and media deserve it.
Borrow: pacing, typography, image editorial treatment, section rhythm.
Avoid: empty hero posters, giant words without substance, stock photography.
Misuse risk: misfires on dense app tools where users need speed over atmosphere.

### Product Object

Style anchor: Apple product pages / Aesop product systems / high-quality ecommerce configurators.
Best for: physical products, product inspection, ecommerce, configurators, object-led launches.
Signature move: product or media object anchors the composition; UI orbits the object.
Medium/motion fit: real photography, video, 3D/model, comparison, configuration transitions.
Type behavior: restrained around the object; let the object carry expression.
Borrow: object framing, material quality, precise media treatment, focused affordances.
Avoid: CSS silhouettes, fake product renders, ornamental 3D that does not inspect or explain.
Misuse risk: collapses if real imagery/model quality is weak.

### Kinetic Product

Style anchor: Field.io / Active Theory / Resn.
Best for: brand moments, launch pages, spatial explainers, interactive storytelling, creative portfolios.
Signature move: motion or spatial interaction is the remembered product behavior.
Medium/motion fit: authored motion, scroll narrative, WebGL/3D, reactive visuals, choreography.
Type behavior: can use display type, but motion/object must support it.
Borrow: sequencing, interaction surprise, spatial continuity, memorable transitions.
Avoid: generic fade-in-on-scroll, particle loops, moving everything at once.
Misuse risk: expensive, fragile, and distracting for tools or high-frequency workflows.

### Warm Humanist

Style anchor: Mailchimp / Headspace / early consumer onboarding systems.
Best for: education, wellness, community, family, lifestyle, approachable B2C.
Signature move: soft hierarchy, friendly illustration/media, forgiving spacing, encouraging states.
Medium/motion fit: gentle validation, progress, success, onboarding, empty-state moments.
Type behavior: readable, warm, not corporate-large.
Borrow: voice, approachable rhythm, supportive state design.
Avoid: childish illustration in serious contexts, fake friendliness, emoji as icon replacement.
Misuse risk: weakens trust for finance, infrastructure, security, or expert tools.

### Raw / Counter-Culture

Style anchor: Are.na / Bloomberg Businessweek / Balenciaga post-2017 web language.
Best for: artist tools, culture, fashion, experimental publishing, anti-polished communities.
Signature move: deliberate friction, plain materials, unusual proportion, strong editorial attitude.
Medium/motion fit: minimal or abrupt motion, unexpected layout, raw image treatment.
Type behavior: can be large or blunt, but must feel intentional.
Borrow: confidence, asymmetry, anti-template stance.
Avoid: accidental broken layout, half-committed brutalism, inaccessible contrast.
Misuse risk: looks unfinished when the product lacks cultural permission.

### Data-First Clarity

Style anchor: Tufte / Observable / mature analytics products.
Best for: charts, maps, metrics, finance, operations, scientific or research interfaces.
Signature move: data object is the visual anchor; decoration retreats.
Medium/motion fit: chart interaction, brushing, filtering, comparison, update continuity.
Type behavior: labels, numbers, legends, and annotations carry hierarchy.
Borrow: data-ink restraint, semantic color, aligned numbers, annotations.
Avoid: chartjunk, arbitrary gradients, giant KPI cards without context.
Misuse risk: can feel plain if no exploratory interaction or narrative layer exists.

### Spatial / Model-Led

Style anchor: model-viewer product inspection / Three.js experiential demos / Spline prototypes.
Best for: 3D products, spatial data, configurators, AR-like previews, embodied demos.
Signature move: model, scene, camera, or spatial object is the core interface element.
Medium/motion fit: model inspection, camera framing, lighting, hotspots, object-state transitions.
Type behavior: labels and controls stay subordinate and usable.
Borrow: framing, lighting discipline, performance-aware interaction, poster/loading fallback.
Avoid: ornamental rotating objects, unoptimized GLB assets, blank canvas risks.
Misuse risk: fails hard without optimized assets, fallback, and responsive framing.

## Direction Option Template

When presenting three directions, each option should compress the Style Anchor Card into:

```text
Direction:
Anchor:
Why it fits:
Signature move:
Medium/motion:
Type ceiling:
Borrow:
Avoid:
Misuse risk:
```

The three options should be visibly different in school, composition, medium, and interaction. If all three options could use the same screenshot, rewrite them.

## Verification

Before final delivery, check:

- Is the selected anchor visible in layout, type, visual language, motion, or component behavior?
- Did the implementation avoid the listed misuse risk?
- Are borrowed decisions tied to the requirement and local evidence rather than copied as surface style?
- Did the final UI drift into generic "clean modern premium" despite the anchor?
