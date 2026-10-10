# Design Production Loop

This is the default high-quality workflow for a substantial frontend surface. It is deliberately longer than a prompt checklist because visual quality comes from repeated decisions and comparisons, not from adding more adjectives to the first prompt.

The loop has 20 checkpoints. They can be batched when their evidence is independent, but they cannot disappear silently. A skipped checkpoint records why it does not apply. The loop does not mean making twenty arbitrary visual rewrites; it means moving from ambiguity to a tested, coherent artifact through twenty kinds of evidence.

## The 20 Checkpoints

1. **Context**: inspect the brief, project, audience, device, and existing authority.
2. **Job**: determine whether this surface persuades, supports operation, supports reading, or creates an experience.
3. **Constraints**: separate hard invariants from taste, risks, and reversible decisions.
4. **Evidence**: inspect the real routes, components, tokens, content, assets, and runtime.
5. **References**: choose references by missing job and record borrow, reject, and translate decisions.
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
19. **Fresh-eyes critique**: compare before/after and use a reviewer without the implementation history.
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

## What This Changes In The Skill

The agent should no longer jump from `brief` to code. It runs the 20-round contract for substantial work, uses the `surface-mode` and `design-operation` routers to choose the current job, uses image generation when the visual direction is unresolved, uses the browser when the target is runnable, and records evidence in the visual iteration ledger. Small repairs may batch checkpoints, but they still preserve the same hard invariants and rendered proof boundary.
