# GSAP Execution Patterns

Use this reference when GSAP is a serious candidate for the implementation, especially for timeline choreography, ScrollTrigger scenes, SVG/text animation, route/section transitions, React/Next animation, or media-led experiential pages.

This file is intentionally practical. GSAP can add weight, but weight is acceptable when it buys visible quality, timing control, continuity, or a motion system that simpler CSS/Motion code would make fragile.

Primary source to inspect when available: `greensock/gsap-skills`, the official GSAP AI skills repository. Treat its examples as implementation references, but still run and verify code in the target project.

## Weight Rule

Do not reject GSAP only because it is heavier than CSS transitions or a small motion helper. Choose GSAP when the animation is part of the product experience and needs:

- precise multi-step sequencing
- scroll-driven pinning, scrub, parallax, horizontal narrative, or scene choreography
- SVG path, morph, text, draggable, FLIP, or plugin-powered effects
- interruptible or controllable timelines
- cross-element choreography that must stay synchronized
- framework-agnostic behavior across React, Vue, Svelte, or vanilla code

Do not use GSAP when the same result is a simple hover, opacity fade, route fade, accordion, or one-off transform that CSS, View Transitions, Motion, or the local component system already handles cleanly.

## Official Skill Map

The GSAP skills repository is split by job. Use the closest slice instead of treating GSAP as one giant prompt:

- `gsap-core`: `gsap.to()`, `from()`, `fromTo()`, easing, duration, stagger, transforms, `autoAlpha`, `matchMedia()`
- `gsap-timeline`: sequencing, position parameter, labels, nested timelines, playback
- `gsap-scrolltrigger`: scroll-linked animations, pinning, scrub, triggers, refresh, cleanup
- `gsap-plugins`: ScrollToPlugin, ScrollSmoother, Flip, Draggable, Inertia, Observer, SplitText, ScrambleText, DrawSVG, MorphSVG, MotionPath, CustomEase, GSDevTools
- `gsap-utils`: `clamp`, `mapRange`, `normalize`, `interpolate`, `random`, `snap`, `toArray`, `selector`, `wrap`, `pipe`
- `gsap-react`: `@gsap/react`, `useGSAP`, refs, scope, `gsap.context()`, cleanup, SSR safety
- `gsap-performance`: transforms, opacity, `quickTo`, `will-change`, batching, ScrollTrigger performance
- `gsap-frameworks`: Vue, Nuxt, Svelte, lifecycle, selector scoping, cleanup

## Install And Licensing

Current GSAP guidance says all plugins are available from the public `gsap` package. Do not create a GreenSock private registry `.npmrc`, auth token setup, or Club GSAP workaround unless the current official docs explicitly require it for the project.

Typical React install:

```bash
npm install gsap @gsap/react
```

Typical non-React install:

```bash
npm install gsap
```

Register plugins once before use:

```js
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
```

## GSAP Implementation Lock

Before building a substantial GSAP scene, define:

```text
Motion purpose:
GSAP job: core / timeline / scrolltrigger / plugin / framework integration
Why GSAP instead of CSS/Motion:
Animated objects:
Trigger model:
Timeline structure:
Plugins:
Responsive rules:
Reduced-motion behavior:
Cleanup plan:
Performance risks:
Verification plan:
```

If the lock cannot name why GSAP is needed, use a lighter tool.

## React And Next Pattern

Prefer `@gsap/react` when available.

```tsx
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function AnimatedBlock() {
  const scope = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      gsap.from(".item", {
        y: 24,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope }
  );

  return (
    <section ref={scope}>
      <div className="item" />
      <div className="item" />
    </section>
  );
}
```

Rules:

- run GSAP only on the client; do not execute GSAP or ScrollTrigger during SSR
- pass a scope ref so selectors only match inside the component
- use refs for direct targets when possible
- use `contextSafe` for callbacks that create animations after the hook runs
- when not using `useGSAP`, wrap setup in `gsap.context()` and return `ctx.revert()`

## Timeline Pattern

Use a timeline when animations need ordering, overlap, labels, or shared defaults.

```js
const tl = gsap.timeline({
  defaults: { duration: 0.55, ease: "power2.out" },
});

tl.from(".title", { y: 32, autoAlpha: 0 })
  .from(".media", { scale: 0.96, autoAlpha: 0 }, "<0.1")
  .from(".cta", { y: 16, autoAlpha: 0 }, "-=0.2");
```

Rules:

- use the position parameter instead of chains of manual delays
- label meaningful phases if the timeline will be controlled later
- store the timeline if it needs play, pause, reverse, progress, or cleanup
- keep ScrollTrigger on the timeline or top-level tween, not on child tweens inside a timeline

## ScrollTrigger Pattern

Use ScrollTrigger when scroll position is the control surface.

```js
gsap.registerPlugin(ScrollTrigger);

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".scene",
    start: "top top",
    end: "+=1200",
    scrub: 1,
    pin: true,
  },
});

tl.to(".object", { yPercent: -18, rotation: 4, ease: "none" })
  .to(".caption", { autoAlpha: 1, y: 0 }, "<0.2");
```

Rules:

- choose `scrub` for scroll-linked progress or `toggleActions` for discrete play/reverse; do not mix them casually
- animate children inside a pinned section; avoid animating the pinned element itself
- use `markers: true` only while debugging; remove it before delivery
- call `ScrollTrigger.refresh()` after images, fonts, dynamic content, route transitions, or layout changes that affect trigger positions
- create ScrollTriggers in page order, or set `refreshPriority`
- kill or revert triggers on route/component teardown

## Horizontal Scroll And Container Animation

For fake horizontal scroll, vertical scroll drives an inner horizontal tween. The horizontal tween must use `ease: "none"` so scroll progress maps directly to movement.

```js
const track = document.querySelector(".track");

const scrollTween = gsap.to(track, {
  x: () => Math.min(0, window.innerWidth - track.scrollWidth),
  ease: "none",
  scrollTrigger: {
    trigger: ".horizontal-scene",
    start: "top top",
    end: () => `+=${track.scrollWidth - window.innerWidth}`,
    pin: true,
    scrub: true,
    invalidateOnRefresh: true,
  },
});

gsap.to(".nested-card", {
  y: -40,
  scrollTrigger: {
    trigger: ".nested-card",
    containerAnimation: scrollTween,
    start: "left center",
    toggleActions: "play none none reverse",
  },
});
```

Rules:

- animate the inner track, not the pinned wrapper
- `containerAnimation` ScrollTriggers do not support every pin/snap behavior; verify the exact interaction
- use `invalidateOnRefresh` when dimensions are calculated from layout
- test mobile carefully; horizontal scroll scenes often need a simpler fallback

## Responsive And Reduced Motion

Use `gsap.matchMedia()` when animation changes by breakpoint or must honor reduced motion.

```js
const mm = gsap.matchMedia();

mm.add(
  {
    desktop: "(min-width: 900px)",
    reduce: "(prefers-reduced-motion: reduce)",
  },
  ({ conditions }) => {
    if (conditions?.reduce) {
      gsap.set(".item", { clearProps: "all" });
      return;
    }

    if (conditions?.desktop) {
      gsap.from(".item", { y: 32, autoAlpha: 0, stagger: 0.08 });
    }
  }
);

// later
mm.revert();
```

Rules:

- define a non-motion or lower-motion state, not only a shorter duration
- make mobile composition intentional; do not merely scale desktop choreography
- if reduced motion is active, preserve content visibility and interaction

## Performance Rules

- prefer `x`, `y`, `xPercent`, `yPercent`, `scale`, `rotation`, and `opacity`
- use `autoAlpha` when hidden elements should also be `visibility: hidden`
- avoid animating `width`, `height`, `top`, `left`, `margin`, and `padding` when transforms can produce the same visible effect
- use `quickTo()` for frequently updated values such as pointer-following elements
- use `will-change` only on elements that actually animate
- do not set `force3D` or layer hints everywhere "just in case"
- batch repeated reveal animations instead of creating hundreds of disconnected tweens
- clean up offscreen or route-abandoned animations

## Plugin Selection

Use plugins for the job they are best at:

- Flip: layout transition where object identity matters
- Draggable + Inertia: drag with momentum
- Observer: unified wheel/touch/pointer intent
- SplitText: controlled text splitting and cleanup
- ScrambleText: intentional text state effect, not body-copy decoration
- DrawSVG/MorphSVG/MotionPath: SVG drawing, morphing, path-following
- ScrollToPlugin: controlled scroll navigation
- ScrollSmoother: scroll smoothing only when smooth scroll is part of the experience
- GSDevTools: development timeline debugging only; do not ship in production

Register every plugin before use and clean up plugin instances that mutate DOM.

## Verification

Before delivery:

- run the page and check console errors
- inspect desktop and mobile viewport screenshots
- verify reduced-motion behavior
- verify route unmount/remount does not duplicate tweens or triggers
- test scroll scenes from top, middle refresh, resize, and back-scroll
- remove `markers: true`
- check that dynamic images/fonts/content do not desync trigger positions
- verify the animation still communicates meaning when slowed, skipped, or interrupted

## Common Failure Modes

- using GSAP to hide weak composition instead of improving hierarchy
- scroll choreography that traps the user or delays core content
- selector strings that leak outside a component
- missing cleanup in SPAs
- calling GSAP during SSR
- putting ScrollTrigger on child tweens inside a parent timeline
- forgetting `ScrollTrigger.refresh()` after layout-changing content loads
- using `scrub` and `toggleActions` together without understanding which behavior wins
- leaving debug markers in production
- copying reference code without running it; even official examples can contain typos or framework-version drift
