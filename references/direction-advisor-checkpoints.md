# Direction Advisor and Checkpoints

Use this when the request may produce a wrong visual direction if the agent proceeds silently. The decision should come from agent judgment plus the user's request, not from surface category alone.

Core rule:

```text
Do not ask for confirmation on every UI task. Stop only when ambiguity and cost-of-wrong-direction are both meaningfully high.
```

Small fixes, clear product constraints, existing component extensions, and user-specified references should keep moving. Cinematic heroes, brand pages, marketing surfaces, 3D/model work, and unusual motion are risk signals, not automatic checkpoint triggers. If the user clearly asks for one of those directions and the evidence is sufficient, proceed with a short Direction Assumption instead of stopping.

## Checkpoint Decision

Decide from the combination of:

- **User clarity**: Did the user name a style, reference, product goal, audience, and desired level of autonomy?
- **Local evidence**: Are there usable components, tokens, screenshots, `DESIGN.md`, real content, media, or assets?
- **Direction spread**: Would two or more credible directions create substantially different layouts, media, motion, or brand feeling?
- **Cost of being wrong**: Would a wrong direction waste major implementation time or require replacing a route, component system, animation model, 3D scene, or brand surface?
- **Reversibility**: Can the agent make a small v0 or local improvement that is easy to revise?
- **User instruction**: Did the user ask the agent to decide, move fast, avoid stopping, or explicitly confirm first?

Pause for confirmation only when the combined judgment says the direction is both uncertain and expensive to undo.

Continue without a checkpoint when:

- the user asked for a narrow local fix
- the user clearly requested the direction, style, or medium and the evidence is enough to execute
- the user asked the agent to decide; in that case choose the strongest direction from evidence and record the rationale
- the UI direction is already locked by `DESIGN.md`, Figma/screenshots, strong existing components, or explicit references
- the implementation is a small component/state/spacing/type repair
- waiting would add process without reducing visual risk

Use a lightweight Direction Assumption instead of pausing when the direction is clear enough:

```text
Direction assumed:
Why this follows the user's request:
Evidence used:
Risk:
Proceeding with:
```

## Simplified Design Direction Advisor

When the direction is vague and no strong local or user-provided reference exists, propose three differentiated directions instead of asking a long preference survey.

Use `style-anchor-recipes.md` to ground each option in a lightweight Style Anchor Card. The user should be choosing between real visual strategies, not three names for the same "clean modern" result.

Each option must include:

```text
Direction name:
Best fit:
Style anchor:
Visual stance:
Layout/composition move:
Medium/motion approach:
Type ceiling:
What to borrow:
What to avoid:
Misuse risk:
Risk:
```

Rules:

- Choose directions from genuinely different schools such as quiet precision, kinetic product, visual object, editorial authority, instrument panel, consumer character, information architecture, motion/experimental, or warm humanist.
- Do not offer three versions of "clean modern premium."
- Every option must name an anchor, signature move, avoid list, applicable scene, and misuse risk. If none of the lightweight anchors fit, create a custom anchor card instead of using a vague style label.
- At least one option should be restrained and one can be more expressive when the scene allows it.
- Use concrete anchors from inspected references, user-provided examples, project visual memory, or known design systems. If an anchor must be verified online, verify it before relying on it.
- Tie every option to the product job, content/media readiness, device, and implementation cost.
- Make the three options materially different in at least three dimensions: layout model, visual anchor, medium/motion behavior, density, type ceiling, or interaction stance.

After presenting the three options, ask the user to choose, combine, or reject them. Do not start implementation until the direction is selected unless the user explicitly tells you to choose.

## Required Checkpoints

### Checkpoint 1: Direction Lock

Use before implementation when the combined checkpoint decision says confirmation is necessary.

Show a compact decision block:

```text
Requirement Frame:
Local evidence:
Missing evidence:
Direction options or selected direction:
Style anchor:
Recommended direction:
Why:
Rejected alternatives:
Implementation impact:
```

Then stop and wait for confirmation.

### Checkpoint 2: v0 Direction Preview

Use when the build is broad enough that a wrong layout or visual stance would waste substantial work.

Create a quick viewable v0 or low-cost preview before full build. It can be a running page, screenshot, rough route, static HTML, component shell, or clear text sketch when rendering is not possible.

The v0 should include:

- layout skeleton
- type scale and density direction
- color/material direction
- selected style anchor and signature move
- primary visual anchor or medium decision
- signature interaction or motion plan
- known placeholders and missing assets

Stop after v0 if the user has not already approved the direction. Do not polish a wrong v0 into a full build.

### Checkpoint 3: Major Deviation

Pause again if implementation reveals that the agreed plan no longer fits:

- content does not fit the selected layout
- assets/media are unavailable or too weak
- performance/accessibility makes the selected animation, 3D, or motion medium unsuitable
- the project component system blocks the intended design
- a better direction becomes obvious from real rendered evidence

Show the problem, revised recommendation, and tradeoff. Then wait for confirmation unless the fix is small and clearly improves the agreed direction.

## No-Checkpoint Fast Path

When no trigger is present, proceed directly:

1. state the visible problem and intended correction briefly
2. implement using local evidence and existing patterns
3. verify the visible result

Do not slow down routine UI work with artificial checkpoints.
