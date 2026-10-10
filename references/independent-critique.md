# Independent Visual Critique

Use this after a meaningful implementation capture and before accepting a visual round. The critic should inspect the current render, the declared scope, the selected reference or concept, and the quality rubric without reading the implementation history first. A fresh reviewer may be another agent, a clean context, or a deliberately reset critique pass.

## Review Input

Record the route, viewport, scroll position, state, capture path, reference or concept path, and the last accepted direction. Review the same viewport and state before comparing other sizes. A screenshot is evidence of a render; it does not explain why the render feels weak.

## Review Order

1. **Thumbnail and first glance**: identify the dominant object, counterweight, silhouette, and attention path before reading details.
2. **Subject and truth**: check whether the content, assets, copy, data, and material belong to the actual product or authored experience.
3. **Composition and hierarchy**: find the largest proportion, alignment, rhythm, or scope failure before looking at shadows and radii.
4. **Type and density**: inspect measure, role contrast, language fit, wrapping, reading distance, and content credibility.
5. **Material and geometry**: inspect surface budget, edge character, corner hierarchy, separation, line policy, crop, and depth.
6. **Interaction and states**: exercise the primary interaction and one non-default state; inspect continuity, feedback, focus, cleanup, reduced motion, and fallback.
7. **Responsive re-staging**: compare desktop, tablet when relevant, and target mobile; check the composition's silhouette and priority order rather than only scaled coordinates.
8. **Originality and template risk**: ask what could be removed or swapped without changing the page; if the answer is everything, return to subject vernacular and direction synthesis.

## Finding Format

Every finding must contain:

```text
Severity: P0 | P1 | P2 | P3
Region: route / section / component / viewport / state
Observation: what is visibly or deterministically wrong
Consequence: why it weakens use, meaning, hierarchy, or credibility
Evidence: capture path, comparison, source path, or runtime observation
Repair: one concrete next change
Confidence: code-certain | render-certain | aesthetic-judgment
```

P0 blocks use or destroys the intended subject. P1 materially weakens the visual thesis, scope, responsive behavior, or important state. P2 is a visible craft defect. P3 is a refinement opportunity. Fix the highest-impact finding first; do not hide a P1 composition problem inside a list of P3 polish notes.

## Verdict

End with exactly one of:

- **CURRENT WINS**: the implementation is stronger for the declared goal; name the accepted delta.
- **REFERENCE WINS**: the chosen reference or concept still solves the target relationship better; name the gap to repair.
- **INCONCLUSIVE**: evidence is insufficient or the comparison is not equivalent; name the next capture needed.

Then name the largest remaining gap, the next operation, the affected round, and the regression check. A clean anti-pattern scan is useful evidence, but it cannot certify taste, originality, or visual quality by itself.
