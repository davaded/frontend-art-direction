# Design Production Loop

This is the default high-quality workflow for a substantial frontend surface. It is deliberately longer than a prompt checklist because visual quality comes from repeated decisions and comparisons, not from adding more adjectives to the first prompt.

The loop has 20 checkpoints. They can be batched when their evidence is independent, but they cannot disappear silently. A skipped checkpoint records why it does not apply. The loop does not mean making twenty arbitrary visual rewrites; it means moving from ambiguity to a tested, coherent artifact through twenty kinds of evidence.

## The 20 Checkpoints

1. **Context**: inspect the brief, project, audience, device, and existing authority.
2. **Job**: determine whether this surface persuades, supports operation, supports reading, or creates an experience.
3. **Constraints**: separate hard invariants from taste, risks, and reversible decisions.
4. **Evidence**: inspect the real routes, components, tokens, content, assets, and runtime.
5. **References**: open the research atlas, inspect user references first, compare sources by section, and record borrow, reject, and translate decisions.
6. **Vernacular**: derive visual material from the subject's own artifacts, culture, language, and physical world.
7. **Defaults**: identify first-order and second-order AI defaults before choosing the direction.
8. **Diverge**: generate three to five structurally different directions.
9. **Converge**: choose one direction using subject fit, hierarchy, emotion, feasibility, and responsive viability.
10. **Contract**: write composition, type, geometry, material, motion, asset, and exception decisions.
11. **System**: extract tokens, type roles, component families, icon grammar, and page overrides.
12. **Storyboard**: define the full scope, states, responsive continuation, route transitions, and ending.
13. **Assets**: source or generate usable media and remove placeholders, fake metrics, and weak crops.
14. **Skeleton**: build semantic structure, interaction, and real content before decoration.
15. **Baseline**: run the target and capture actual desktop, mobile, and relevant states.
16. **Macro repair**: fix the largest visible defect first: scope, silhouette, hierarchy, composition, content, or media.
17. **Responsive re-stage**: redesign for mobile, tablet, touch, text wrapping, and input behavior.
18. **State review**: exercise loading, empty, error, success, focus, reduced-motion, transition, and recovery paths.
19. **Fresh-eyes critique**: compare before/after and use [the independent critique protocol](independent-critique.md) without the implementation history.
20. **Sign-off**: verify static, runtime, visual, accessibility, and scope evidence; update durable design memory.

## The Loop's Control Rules

- Create choices early and make choices before implementation becomes expensive.
- Do not polish a weak composition. Return to the direction or replace the missing subject-specific asset.
- One visual idea may be bold; the surrounding system should make that idea legible.
- Every critique names a region, consequence, severity, and concrete repair.
- Separate technical findings from aesthetic judgment. A detector can find a hardcoded color; it cannot decide whether the composition has a point of view.
- Use a fresh screenshot for each meaningful comparison. A generated concept can guide implementation, but a browser render is the proof.
- Preserve accepted direction decisions in a project-owned design memory, then allow page-specific overrides where the page has a different job.
- Stop after the declared scope is complete and material defects are resolved. More iterations are useful only when they answer a new question or fix visible evidence.

## Persist The Loop

For substantial work, create a session in the target project so the loop survives context changes and cannot be replaced by a verbal claim. `design-loop start` also creates a linked research atlas; read [research-atlas.md](research-atlas.md) and close it before sign-off:

```bash
node <skill-root>/scripts/design-loop.mjs start \
  --project <project-root> \
  --query "<one-sentence request>" \
  --format md
```

Use the atlas for each inspected reference, section winner, and synthesis. A named URL without a local capture or research artifact is still only a candidate.

Record each round in order. Early rounds may point to briefs, research notes, direction files, or design memory. From round 15 onward, every completed round needs at least one rendered or verification proof item:

```bash
node <skill-root>/scripts/design-loop.mjs record \
  --project <project-root> --session <id> --round 16 \
  --decision "Rebalanced the dominant object and removed equal-weight cards" \
  --evidence artifacts/round-16-critique.md \
  --proof desktop-capture,mobile-capture \
  --issues "P2:mobile crop"
```

Round 19 must include a fresh-eyes comparison. Round 20 must include all five proof kinds: `static`, `runtime`, `visual`, `accessibility`, and `scope`, plus a score of at least 8/10:

```bash
node <skill-root>/scripts/design-loop.mjs record \
  --project <project-root> --session <id> --round 20 \
  --decision "Scope is complete; remaining P2 crop is documented" \
  --evidence artifacts/signoff.md,artifacts/signoff.png \
  --proof static,runtime,visual,accessibility,scope \
  --verdict "CURRENT WINS" \
  --score 8 \
  --dimensions subject-fit=8,hierarchy=8,composition=8,type-and-content=8,material-and-assets=8,interaction-and-motion=8,responsive-and-states=8,originality=8,completion-and-proof=8
node <skill-root>/scripts/design-loop.mjs close \
  --project <project-root> --session <id> --format md
```

Rounds 15-20 are rendered-proof rounds. `--evidence` must include an existing local screenshot or media capture. Each repair round from 16 through 19 requires both before and after captures plus a local `--comparison` artifact, as well as `--largest-gap` and `--repair`; round 19 requires one of `CURRENT WINS`, `REFERENCE WINS`, or `INCONCLUSIVE`. Round 20 can close only with `--verdict CURRENT WINS`.

Example repair record:

```bash
node <skill-root>/scripts/design-loop.mjs record \
  --project <project-root> --session <id> --round 16 \
  --decision "The first render was too evenly weighted" \
  --largest-gap "The subject lost dominance below the fold" \
  --repair "Removed the duplicate panel and widened the object stage" \
  --evidence artifacts/round-16-before.png,artifacts/round-16-after.png \
  --comparison artifacts/round-16-comparison.md \
  --proof desktop-before,desktop-after
```

The session is a gate and ledger, not a visual oracle. A path proves that an artifact was recorded; the implementing agent still has to open the screenshot, inspect the target, compare the result, and write the observed consequence using [the independent critique protocol](independent-critique.md). `close` accepts P2/P3 follow-ups when they are explicit, but rejects unresolved P0/P1 defects.

## Quality Bar

Use [../data/quality-rubric.json](../data/quality-rubric.json) to score subject fit, hierarchy, composition, type/content, material/assets, interaction/motion, responsive/states, originality, and completion/proof. The score does not replace judgment: a generic page can pass static gates while failing subject fit, composition, or originality. The reviewer must name the largest gap and the next repair before starting another round.

## Research And Critique Memory

Keep user references, inspected URLs, section-level observations, reference winners, rejected traits, concept choices, quality-bar scores, and template-risk decisions in the target project's design memory. A reference name alone is never an inspection record. For a new project, compare references by section and job: a navigation winner, an object or hero winner, a mobile winner, and a motion or state winner can come from different sources. The final direction must synthesize them into its own type, composition, material, interaction language, and subject-specific identity.

## What This Changes In The Skill

The agent should no longer jump from `brief` to code. It runs the 20-round contract for substantial work, uses the `surface-mode` and `design-operation` routers to choose the current job, uses image generation when the visual direction is unresolved, uses the browser when the target is runnable, and records evidence in the visual iteration ledger. Small repairs may batch checkpoints, but they still preserve the same hard invariants and rendered proof boundary.
