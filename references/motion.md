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

Intent matches are candidates; source findings require UI review. A negated effect, array `filter()`, stylesheet link, or reduced-motion guard does not identify an animated component. Confirm the visible element and state pair before applying a recipe. When the relationship is unresolved, preserve immediate/static feedback or explicitly pin the inspected recipe instead of turning a generic word such as text or selection into an effect.

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

## Scroll And Pointer Contracts

Use these as transferable interaction relationships, not a required style. Specify the visible subject and measured effect before selecting a library. Inspora and MotionSites are discovery sources; neither establishes the implementation or runtime behavior of a particular effect.

| Effect | Define before implementation | Input and fallback | Verify in the target |
| --- | --- | --- | --- |
| Parallax | Which layers move relative to which scroll range; maximum displacement, entry/rest/exit frames, text measure and cropping | Preserve native document flow and scrolling; reduced motion keeps the intended resting composition | First and last frames, reverse scroll, resize, short screens, image/font loading and normal-flow access to the complete content |
| Magnetic button | Stable semantic button/hit area, activation radius, bounded inner visual displacement, easing and return to rest | Use a fine pointer with hover; touch and keyboard keep an ordinary button and visible focus | Enter/leave from every edge, click while displaced, rapid re-entry, disabled/loading state and teardown; the target never runs away from input |
| Pointer follower | Whether a label, preview or highlight follows; coordinate space, offset, bounds, lag and visibility owner | Preserve the system pointer and native controls; coarse pointer/reduced motion shows the same relevant content without chasing | Scrolled/transformed containers, viewport edges, hidden tabs, pointer exit, overlays, unmount and remount |

Drive continuous input through one scoped animation-frame loop or the existing engine. Store the latest input without forcing a framework render for every event; recompute bounds after layout changes and release frames, listeners, observers and transforms on teardown. Capture resting and changed states, then exercise input continuity: a still screenshot cannot prove scroll or pointer behavior. Short numeric choices belong to the target's interaction contract, not a universal preset.

## Pending Feedback

[loading.dev](https://loading.dev/llms.txt) supplies React indicators; its current docs specify React 19+, shared size/color/duration controls and reduced-motion support. Recheck the selected release's compatibility before use. Keep an existing local/native status in other stacks rather than upgrading a framework for an indicator.

Reserve stable space, connect activity to a real operation and expose its status semantically. Stop at ready, empty, error or cancellation; retain retry/continuation and the completed result. Use determinate progress only when measured by the operation. An animated spinner does not justify an artificial wait or prove that a request succeeded.

## Agent-Authored Rive Assets

Use [Rive CLI / RML](https://rive.app/docs/cli/overview) when a stateful illustration, responsive animated object or authored scene benefits from an editable animation asset. The agent owns the scene, data/input bindings and iteration. Ordinary CSS feedback can keep its existing medium.

Inspect the current [getting-started guide](https://rive.app/docs/cli/getting-started) and [command reference](https://github.com/rive-app/rive-docs/blob/main/cli/reference/commands.mdx), then check the available CLI with `rive --version` and `rive doctor`. If it is unavailable, record that and choose the official setup compatible with the host or a coherent local fallback; installing this skill does not install Rive or a runtime into every project. Preserve existing animation sources when extending a project.

Create a new scene folder only when needed, read its generated agent instructions, then use `rive docs` and `rive schema` for authoring instead of guessing RML properties. Keep `scene.rml`, scripts and actual assets under source control. Example checks for a scene at `motion-scene`:

```bash
rive motion-scene --verify --format=json
rive inspect motion-scene --summary
rive motion-scene --screenshot=rest.png
rive motion-scene --screenshot=changed.png --pointer=click@120,60 --advance=250ms
rive motion-scene --once
```

Use the scene's actual control coordinates and declared data properties. Check the resolved object/input names and resulting values; a syntactically accepted flag can still miss its intended target. These are proposed commands until executed, and compilation/frame checks establish asset evidence only. Load the resulting asset in the target's actual runtime and verify layout, host controls, input/data binding, loading/error, focus, reduced-motion result, visibility handling and disposal separately.

The current official guide says scripted web assets require signed `--publish` output; publication and editor export need an account, with possible watermark/plan constraints. An unsigned local build cannot establish scripted web delivery. Treat remote signing, upload and account publication as a separate external action within the user's authorization; this workflow does not publish automatically. Preserve a complete static result and semantic host controls when the runtime or asset fails.

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
