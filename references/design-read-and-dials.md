# Design Read and Context Dials

Use this before substantial UI implementation, especially when the task is vague, from scratch, visually weak, or likely to drift into a default aesthetic.

Core rule:

```text
Read the scene before choosing the look.
```

This borrows Taste Skill's strongest mechanism: a short design read plus context dials. Do not copy its landing-page bias. Use the mechanism to decide what this product needs.

## Design Read

Before implementation, write one compact read:

```text
Design Read:
Reading this as:
Audience:
Primary workflow:
Surface mode:
Context constraints:
Style anchor:
Design variance:
Motion intensity:
Information density:
Component distinctiveness:
Why these dials fit:
```

If several reads are plausible and the cost of choosing wrong is high, use the checkpoint workflow instead of guessing.

## Context Dials

Use dials as implementation constraints, not decoration.

### Design Variance

- **Low**: stable grid, familiar navigation, clear alignment, official design-system behavior.
- **Medium**: one or two composition moves: split panes, offset object, varied section rhythm, density contrast.
- **High**: asymmetric layout, scroll narrative, expressive media, unusual component silhouette, or memorable spatial treatment.

Raise variance when brand/story/portfolio/experimental direction matters. Lower it for admin tools, regulated flows, accessibility-first products, heavy forms, and high-frequency operations.

### Motion Intensity

- **Low**: hover/focus/pressed feedback, state continuity, no ambient loops.
- **Medium**: route or panel transitions, staggered reveals, filtering/list continuity, loading-to-content transitions, object hover.
- **High**: cinematic sequencing, scroll-triggered chapters, parallax, physics, 3D/model interaction, or animated storytelling.

Motion must explain state, continuity, instruction, product meaning, or story. If the reason is only "it looks cool", drop it.

### Information Density

- **Low**: editorial, brand, media-led, portfolio, launch, or object showcase surfaces.
- **Medium**: normal SaaS/product surfaces, settings, content pages, forms, and light dashboards.
- **High**: tables, analytics, operations, developer tools, financial/research screens, cockpit monitoring, and editors.

Density controls type scale, spacing, component form, and navigation. High density usually wants rows, tables, rails, filters, inspectors, and status strips more than large cards.

### Component Distinctiveness

- **Low**: official design-system product where consistency and accessibility dominate.
- **Medium**: mature primitives customized into a clear product silhouette.
- **High**: custom object/media components, spatial controls, unusual navigation, interactive visualizations, animated product modules, or domain-specific controls.

Raise distinctiveness when the product has a strong object, medium, workflow, or brand world. Lower it when the user needs predictable enterprise UX, platform fidelity, or fast implementation inside an existing design system.

## Anti-Default Sweep

Before code, explicitly reject defaults that do not fit the read:

- one default font for every category
- centered hero and giant heading by habit
- three equal feature cards
- generic card grid as the page structure
- one filled CTA plus one ghost CTA everywhere
- pill badges and small uppercase eyebrows on every section
- modal for every action
- spinner for every loading state
- decorative motion not tied to state or story
- component-library defaults as product identity
- AI-purple gradients, generic glass, or stock visual treatment without scene fit

The goal is not to ban these patterns. The goal is to require a reason before using them.
