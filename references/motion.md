# Motion And Spatial Guide

Motion is a communication layer. Choose it because a state, relationship, or object becomes easier to understand, not because the page feels empty.

## Motion Lock

Before a substantial animation pass, write:

```text
Purpose: feedback / continuity / reveal / comparison / progress / inspection / narrative
Animated objects:
Trigger:
Timing and easing:
Interruption behavior:
Reduced-motion state:
Cleanup owner:
Verification:
```

If the purpose cannot be named, remove the motion or choose a static treatment.

For a substantial web transition, use the internal Transitions.dev bridge before writing code:

```bash
node <skill-root>/scripts/transitions-adapter.mjs \
  --intent "<visible state or relationship>" \
  --project <project-root> \
  --phase all --format md
```

The bridge fetches a pinned upstream Skill into a private cache on first use. It is an implementation source for this skill, not a second skill the user must install. If the source is unavailable, continue with this guide's local rules and record the missing upstream evidence.

## Choose The Lightest Medium

- CSS transitions or native view transitions for simple state and route continuity.
- Motion or a local animation primitive for component-level layout and gesture feedback.
- GSAP for authored timelines, scroll-controlled sequences, SVG/text choreography, or synchronized multi-object scenes where simpler tools become brittle.
- Rive/Lottie for an authored stateful illustration or brand object with a real state model.
- Three.js, React Three Fiber, model-viewer, or Spline only when users inspect, configure, understand, or are meaningfully guided by a spatial object.

Do not add a motion or 3D dependency to compensate for weak hierarchy. Read [../data/motion.json](../data/motion.json) for candidate grammars and [resources.md](resources.md) for implementation options, then inspect the chosen library's current API and license before implementing.

## State Motion

Useful motion has a state pair:

```text
from -> to -> user meaning
idle -> selected -> preserve object identity
filter old -> filter new -> preserve list context
closed -> open -> reveal the next action
loading -> ready -> show what became available
playing -> paused -> keep media position legible
```

Use transform and opacity where possible. Keep feedback short; reserve long choreography for a real narrative or spatial scene. Do not hijack scroll, trap touch, or make a user wait for decoration.

## Purpose, Cleanup, And Fallback

Every motion decision must answer four questions before code is merged:

- **Purpose**: is this feedback, continuity, reveal, comparison, progress, inspection, or narrative?
- **Cleanup**: who removes closing/replay classes, cancels timers, disconnects listeners, and reverts scoped timelines on unmount?
- **Reduced motion**: what does `prefers-reduced-motion: reduce` disable, and which state remains visible when it does?
- **Fallback**: what static poster, final state, or non-spatial alternative preserves understanding on low-power devices, unsupported browsers, interrupted transitions, and failed media loads?

If any answer is missing, keep the implementation static until it is explicit. A reduced-motion rule is not a substitute for a usable resting and final state.

## GSAP Rules

When GSAP is justified:

- run it only on the client in SSR frameworks;
- scope selectors with refs or `useGSAP`/`gsap.context()`;
- use a timeline for ordered choreography and position parameters instead of delay chains;
- keep ScrollTrigger on the parent timeline, refresh after layout-changing content, and revert on teardown;
- use `matchMedia()` for breakpoint and reduced-motion behavior;
- animate transforms/opacity before layout properties;
- remove debug markers and verify resize, back-scroll, unmount/remount, and mobile fallback.

## Spatial Quality

For a model or canvas, verify:

- first-frame poster/loading state;
- camera framing, lighting, and object scale;
- pointer, keyboard, and touch affordances;
- asset size and memory budget;
- mobile and low-power fallback;
- a static or reduced-motion path that preserves understanding.

## Review / Apply / Polish

Separate motion work into three decisions:

1. **Review**: identify the state or relationship that needs motion, inspect the local implementation path, and select one upstream recipe only when it is a genuine fit. Do not edit yet.
2. **Apply**: implement one coherent grammar with documented hooks, cleanup, replay behavior, reduced-motion treatment, and a static fallback. Keep the diff limited to the target component.
3. **Polish**: after observing the running surface, tune timing, easing, interruption, text fit, performance, and cross-device behavior. Match tokens by usage, not by the nearest number.

The bridge's `--phase review`, `--phase apply`, and `--phase polish` modes expose the same separation internally. The normal skill flow uses `--phase all` so the agent can read the complete contract without asking the user to install transitions separately.

Do not polish an animation whose state purpose is still unclear.
