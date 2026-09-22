# Reference-Led Build

Use this mode when the user names a site, supplies a screenshot, or says “make a website like this.” The expected output is a working target surface with a comparable visual grammar, not a written moodboard and not an indistinguishable clone.

## One-Sentence Contract

Treat a short request as enough to start, not enough to skip inspection. Preserve the request as the product intent and infer the missing implementation details through the following contract:

```text
Reference:
Target product and audience:
Primary workflow/object:
Visual genome:
First viewport:
Page sections:
Component grammar:
State matrix:
Motion purpose:
Responsive re-staging:
Asset and content fallback:
Acceptance evidence:
```

The executable form is:

```bash
node <skill-root>/scripts/reference-build.mjs \
  --query "Build a component gallery for our analytics SDK like Rare UI" \
  --project /path/to/project --format md
```

The command selects a named reference when it appears in the sentence or URL, then adds only supporting lenses with distinct jobs. An unknown URL becomes an inspect-first external reference instead of silently falling back to a saved site. The primary reference is never silently displaced by a higher keyword score. It also returns a token seed for canvas, surfaces, color roles, radius, spacing, container width, and desktop/mobile type sizes; treat these as starting values to tune against rendered evidence, not measured source CSS.

Every full audit also creates this contract when no site is named. In that case it is an adaptive, evidence-first contract rather than a forced visual skin. The complete reference inventory is still considered, and any selected supporting lens must earn its place through a distinct job.

## Build Sequence

### 1. Inspect The Reference

Open the live reference or inspect the supplied image before writing UI code. Record visible facts:

- first-viewport composition and what enters below the fold;
- navigation shape, content hierarchy, and section rhythm;
- type roles, approximate scale, line length, and text density;
- palette roles, material, border, radius, shadow, texture, and contrast;
- repeated component silhouettes and fixed-format frames;
- interaction states, object continuity, and motion triggers;
- desktop/mobile differences and any real media or data object.

Do not infer hidden source code or claim a framework from appearance alone.

### 2. Translate The Grammar

Keep the target product's object, copy, data, and workflow. Translate the reference through decisions rather than screenshots:

```text
Borrow: hierarchy, rhythm, material, component behavior, motion purpose
Reject: brand identity, exact copy, proprietary assets, irrelevant density, decorative excess
Translate: target tokens, real content, local primitives, device/input constraints
```

If the target has weak content or missing media, acquire or generate suitable media before the visual acceptance pass. If no candidate meets the quality bar, use a complete assetless product surface or report the blocker; never use a placeholder or low-quality filler to simulate a finished hero.

### 3. Implement The First Viewport First

The first viewport is the acceptance anchor. Build its layout skeleton, real object, primary action, type roles, and major surfaces before filling the entire page. Make the next section visibly enter the desktop and mobile viewport when the reference relies on that rhythm.

Do not build a page of equal cards because the reference is a gallery. Give the target product one primary object and use repeated frames only where comparison or discovery is the actual job.

### 4. Add States And Motion

Enumerate the real states before polishing:

```text
idle / hover / focus / pressed / selected / disabled
loading / empty / partial / error / success / updating
expanded / collapsed / filtered / dragged / reduced-motion
```

Use `Review -> Apply -> Polish` for named transitions. Motion must explain state, continuity, feedback, or spatial relationship. Every motion path needs cleanup, reduced-motion behavior, and a static final-state fallback.

### 5. Prove Against The Reference And The Product

Run the target app and capture at least:

- desktop first viewport;
- target mobile first viewport;
- one non-default state;
- one reduced-motion or static fallback state;
- console/build output.

Compare hierarchy, not pixel identity: first read, object prominence, density, type rhythm, surface contrast, responsive order, interaction latency, and whether the borrowed idea is visible in the result. Iterate the largest visible mismatch first.

For a named or selected reference, record and verify at least three fidelity anchors before polish:

- composition: first-viewport hierarchy, section rhythm, or specimen geometry;
- material/type: surface contrast, type roles, spacing, borders, or media treatment;
- interaction cadence: trigger, response, continuity, final state, and reduced-motion behavior.

## Boundaries

- A URL is an art-direction input, not permission to copy its source or assets.
- A component demo is not automatically the right product workflow.
- A polished reference does not justify a new dependency; inspect local primitives and use the lightest compatible implementation.
- A screenshot or static build is not proof of interaction quality.
- If the user asks for exact duplication, clarify ownership and licensing boundaries before reproducing branded or proprietary material.
