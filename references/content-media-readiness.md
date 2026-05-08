# Content and Media Readiness

Use this before choosing a strong visual style, display typography, cinematic layout, 3D, or heavy motion. The goal is to stop AI from inventing "premium" presentation before it knows whether the content, assets, motion, and product object can support that expression.

## Core Rule

Do not start from a style label such as "premium", "cinematic", "Apple-like", or "high-end." Start from inspected content and media readiness.

Good copy, high-quality imagery, animation, models, charts, audio, canvas objects, or editorial material can support expression, but they do not create the need for it. Display-size text, immersive heroes, and strong motion remain rare exceptions.

## Readiness Card

Create this card before major visual decisions:

```text
Content / Media Readiness:
Real content:
Data and workflow:
Product/media object:
Image/video/model/chart/canvas/audio assets:
Motion candidates:
Reference evidence that can actually transfer:
Readiness level: L0/L1/L2/L3
Surface mode: Productive App UI / Editorial Marketing / Spatial Experiential
Expression budget: low / medium / high / exceptional
Type ceiling:
Display text: off by default; proposed only if needed and supported
Primary visual medium:
Downgrade rule:
Evidence pack to collect:
```

## Readiness Levels

### L0: Placeholder or Thin Content

Signals:

- mostly placeholder copy, empty cards, generic lorem text, fake testimonials, vague metrics, or invented product claims
- no concrete product object, real data, real workflow, image, chart, model, or media asset
- reference evidence is named but not inspected or not transferable

Default treatment:

- use Productive App UI
- no display-size text, fake hero, cinematic composition, ornamental 3D, or large decorative motion
- improve information architecture, grouping, labels, realistic sample states, component states, and micro-interaction
- use restrained type and compact hierarchy

### L1: Real Data, Forms, or Workflow

Signals:

- real entities, fields, tables, forms, filters, navigation, task sequence, settings, admin flows, or operational data
- limited or no high-quality imagery/model/media
- value comes from clarity, speed, trust, and repeated use

Default treatment:

- Productive App UI first
- compact type roles, strong grouping, meaningful states, useful empty/loading/error/success handling
- stateful micro-motion for feedback and continuity
- visual anchor can be a data object, selected item, preview, or workflow area

### L2: Strong Product, Data, or Media Object

Signals:

- a real product object, chart, map, audio waveform, canvas drawing, document preview, image set, or meaningful visualization exists
- users need to inspect, compare, configure, understand, or manipulate that object
- references provide transferable layout, component, or motion behavior

Default treatment:

- Productive App UI with a focused visual anchor, or a restrained hybrid
- local hero/object area is acceptable when it serves the workflow
- display text is still usually off; consider it only if the content role truly needs it
- motion should preserve object identity, reveal state, or demonstrate the product

### L3: High-Quality Editorial, Model, Animation, or Media System

Signals:

- strong authored copy, high-quality photography/video, product model, spatial scene, motion design, rich editorial content, or polished media system
- the first screen's job is to explain, sell, immerse, demonstrate, or create brand memory
- references include inspected typography, layout, media, and motion evidence that fits the current surface

Default treatment:

- Editorial Marketing or Spatial Experiential may be considered
- display type, immersive hero, strong motion, or 3D are still not automatic
- prove display need first, then prove support, fit, text containment, performance, and reduced-motion fallback
- if the same message works smaller, reduce the type and let the media/object carry expression

## Surface Modes

### Productive App UI

Default for tools, dashboards, admin, settings, forms, tables, developer tools, CRM, commerce operations, embedded displays, and car/head-unit UI.

- type: compact titles, labels, body, numeric roles; display type off by default
- motion: productive feedback, continuity, loading, selection, filtering, success/error
- expression: density, grouping, alignment, state quality, component craft, real data rhythm

### Editorial Marketing

Use only when the job is persuasion, launch, explanation, brand storytelling, or authored editorial content.

- type: display role remains rare; good copy/assets are support, not permission
- motion: reveal and narrative pacing only when they clarify the message
- expression: real story, real object, quality imagery, careful composition, restrained type

### Spatial Experiential

Use only when spatial media helps inspect, demonstrate, configure, understand, or embody the product.

- type: interface labels and controls must stay usable around the spatial object
- motion: model interaction, camera, state continuity, or demonstration; no ornamental loops
- expression: model quality, framing, lighting, loading/poster state, performance, fallback

If a surface mixes modes, declare the primary mode and keep secondary mode behavior subordinate.

## Expression Budget

Set the expression budget after the readiness level:

- **Low**: L0 or fragile content. Use restrained UI craft only.
- **Medium**: L1. Use component states, density contrast, micro-motion, and one workflow anchor.
- **High**: L2. Use a product/data/media object as a visual anchor with purposeful motion.
- **Exceptional**: L3 plus real product need. Consider display type, immersive layout, authored animation, or spatial media only when needed.

Downgrade immediately when content is thin, media is generic, references are not inspected, motion has no state meaning, or the layout starts reading as an AI-generated poster.

## Evidence Pack

Before final delivery, gather or report the closest available evidence:

- readiness level, surface mode, and expression budget
- references used and the exact decisions borrowed
- largest text role, approximate/computed size, and why it does not exceed the type ceiling
- display need and display support if any large type was used
- screenshot, viewport check, device check, or reason verification was blocked
- motion trigger, state purpose, timing/easing, and reduced-motion fallback
- one visible before/after or brief/result comparison when possible

Do not claim a reference, motion system, or display treatment worked unless the evidence pack can point to visible proof.

## Useful External Patterns

- Material 3: semantic type roles reduce arbitrary font-size choices.
- Atlassian: app UI, marketing, editorial, and technical content need different typography behavior.
- Carbon: productive motion and expressive motion should be separated.
- Playwright and Storybook visual testing: rendered evidence catches what prose self-review misses.
