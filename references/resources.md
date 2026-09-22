# Resource Map

Use this as an execution catalog, not a moodboard. Pick a resource only after the local scan names a missing job. Verify the current documentation, framework version, license, bundle cost, accessibility behavior, and reduced-motion fallback before adding it.

The executable form is:

```bash
node <skill-root>/scripts/resource-catalog.mjs \
  --query "<missing job>" --stack <detected-stack> --format md
```

It returns a few candidates with provenance, trust tier, install policy, states, avoid guidance, and verification requirements. It never installs a dependency. The Composio and VoltAgent references are represented here as curation and provenance behavior, not as an instruction to copy an entire catalog.

## Selection Order

1. existing project primitive and token system;
2. platform or browser capability;
3. a mature, narrowly scoped primitive;
4. a specialized library only when the product object or interaction needs it.

Never install a library because its demo looks polished. Its state model and failure behavior must fit the target surface.

## Common Jobs

| Job | First candidates | Borrow | Reject when |
| --- | --- | --- | --- |
| Accessible controls | local system, Radix, shadcn/ui | semantics, focus, keyboard, composability | the default skin would become the product identity |
| Full component kit | local system, HeroUI, Spectrum UI | state coverage and responsive behavior | it replaces a coherent local system without a gap |
| Icons | local icon set, Lucide | consistent stroke/size/labels | multiple icon families would mix visual weight |
| Tables and data | local table, TanStack Table, Recharts/ECharts | sorting, virtualization, chart interaction | the data model is still unclear |
| Simple component motion | CSS, View Transitions, Motion, AutoAnimate | continuity and layout state | a decorative effect is the only reason |
| Named UI transition recipe | internal Transitions.dev bridge | reviewed CSS hooks, cleanup, reduced-motion guard, and token polish | the state purpose is unclear or the source would add a runtime dependency |
| Micro-interaction research | Bencho, Design Spells | trigger/response vocabulary, timing, desktop/mobile comparison | the core hierarchy or product object is still unresolved |
| React visual primitive | Rewamp UI, React Bits, Magic UI, Obsidian UI | one source-owned effect or component adapted into local tokens and states | the default demo skin would become the product identity |
| High-impact landing block | Aceternity UI, Magic UI | one bounded visual anchor with real media and normal-flow fallback | glow, gradient, parallax, or 3D is standing in for product proof |
| Authored timeline or scroll | GSAP / ScrollTrigger | sequence, scrub, pin, controlled choreography | CSS or native scroll behavior is enough |
| State illustration | Rive or Lottie | authored state machine and fallback | the animation has no product state |
| 3D inspection | model-viewer, Three.js, React Three Fiber, Spline | camera, object, loading, interaction | a photo or static preview explains the object better |
| Media/audio state | native media, Web Audio, wavesurfer.js | playback, buffering, permission, seek | a waveform is only decoration |

## Resource Card

Before import, write:

```text
Missing job:
Candidate and current docs inspected:
Framework/version fit:
States and accessibility:
Bundle/performance cost:
License/asset boundary:
Reduced-motion or static fallback:
Local component that will own the styling:
What defaults will be replaced:
Verification:
```

## Anti-Catalog Rules

- A component catalog is not an art direction reference.
- An animation demo is not evidence that the target needs motion.
- A chart engine does not choose the chart's hierarchy or color semantics.
- A model library does not solve framing, loading, camera bounds, or mobile fallback.
- One coherent icon system beats a larger mixed collection.
- Prefer a smaller dependency surface when two options communicate the same state.

## Useful Starting Points

These are starting points, not endorsements for every project:

- [Radix Primitives](https://www.radix-ui.com/primitives) for accessible low-level web behavior.
- [shadcn/ui](https://ui.shadcn.com/) for source-owned React components that can be adapted into a local system.
- [Lucide](https://lucide.dev/) for a coherent open icon family.
- [Motion](https://motion.dev/) and the [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API) for component and route continuity.
- [Transitions.dev](https://transitions.dev/skill) through this skill's internal bridge for named CSS transition recipes; the user does not install it separately.
- [Bencho](https://bencho.dev/) and [Design Spells](https://designspells.com/) for interaction vocabulary and polish research; they are inspiration sources, not automatic dependencies.
- [Rewamp UI](https://www.rewampui.com/components), [Magic UI](https://magicui.design/), [React Bits](https://reactbits.dev/), [Aceternity UI](https://ui.aceternity.com/), and [Obsidian UI](https://www.obsidianui.dev/) as source-owned component/effect candidates; copy only the narrow job that survives local state, license, accessibility, and performance review.
- [GSAP](https://gsap.com/) for authored timelines and ScrollTrigger scenes that simpler tools cannot express cleanly.
- [model-viewer](https://modelviewer.dev/) for a bounded model-inspection surface before reaching for a custom scene.
- [TanStack Table](https://tanstack.com/table) for table behavior, with local visual and accessibility ownership.
