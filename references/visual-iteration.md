# Screenshot And Image Iteration

Use this workflow for a substantial build or redesign, especially when feedback says bland, incomplete, or unlike the supplied reference. It applies to any design form. Keep the user's subject, content, scope, and chosen direction as the authority.

## Start With The Real Render

For an existing target, capture its current state before redesigning it. For a new target, implement the chosen composition with real content, run it, and capture a baseline as soon as it is inspectable. A browser, device, or platform-native capture is the implementation evidence; an image-generation output is a proposal or asset.

Use the project's existing browser or device tooling. Save and actually inspect the captures; an HTTP response, screenshot command, or build result alone does not establish how the surface looks. Record the route, viewport, state, scroll position, and capture path. Allow fonts and assets to load; exercise lazy content before judging missing regions.

Capture the declared scope at desktop and target mobile. For a long page, combine a full-page capture for rhythm with readable viewport captures of the opening, middle, ending, and any region under review. For a tool or multi-route experience, capture its important routes and states. Include relevant fallback or reduced-motion behavior. A still image cannot prove motion quality: exercise the trigger and inspect start, transition, final state, interruption, and replay when applicable.

## Screenshot To Code Loop

1. Inspect the baseline beside the inspected reference, selected concept, or recorded design thesis at a comparable viewport and state.
2. Name the largest visible problems with their region, consequence, and intended repair. Start with broken content, incomplete scope, composition, hierarchy, and media; then type, spacing, edges, and detail.
3. Change the relevant code or asset. Keep established strengths unless the new direction deliberately replaces them.
4. Run the changed surface, repeat the same capture conditions, and inspect before/after. Check nearby regions, mobile, and relevant states for regressions.
5. Keep changes supported by the render and repeat for remaining material issues. A second screenshot with no inspected comparison is not an iteration.

Fix ordinary text fit, overflow, control behavior, and responsive defects directly in code. If the issue is the visual thesis, media, or composition itself, use the image loop to explore a better relationship. Do not keep tuning shadows around a failed direction.

## Screenshot To Image To Code Loop

For a visually open request or weak first render, use available image generation to produce or edit a concrete visual target. The agent handles the generation and translation within the task; the user should not have to run another service. Skip image generation when a local code fix or existing authoritative design already resolves the issue.

When a real screenshot exists, inspect it first and use it as the edit target. Label other inputs as reference or asset, rather than allowing their brand, content, or layout to silently replace the target. For a new direction with no render, generate a concept from the real brief, content, and available media. Explore structural alternatives only when the direction is unresolved; refine a selected image for a focused repair.

Use the available image-generation skill and built-in tool by default. Use returned paths for subsequent edits, preserve the source image, and save siblings for revisions. If generation is unavailable, continue screenshot-to-code work and state that limitation. Do not claim a generated round happened or silently switch to a paid API workflow.

Useful prompt scaffold; keep only fields needed for this iteration:

```text
Use case: ui-mockup
Role: a visual revision proposal, not an implementation screenshot
Inputs: current browser screenshot as edit target; other inputs with named roles
Subject, real content, and intended scope:
Viewport and state being revised:
Observed defects: <specific visible problems and their locations>
Change: <the composition, type/media relationship, material, or asset being explored>
Preserve: <real content, subject identity, working relationships, and user direction>
Completion: <include the relevant middle, ending, or neighboring region>
Output: <one inspectable revision of the requested surface>
```

Inspect the generated revision. Reject hallucinated content, illegible type, missing regions, impossible controls, or a new generic template. Select a revision by its visible improvement, content fit, and feasibility. Record an assumption and continue when selection is reversible; a concept pass does not introduce a new approval requirement.

Translate the selected revision into specific implementation changes: reading order, alignment, type roles, proportions, media crop, surface/edge relationships, asset choice, and responsive restaging. Keep the layout free to follow the work. Obtain or generate individual usable media where needed; a mockup image is not automatically a production asset.

Implement real text, semantic controls, content, states, and layout. Do not ship the mockup as a flattened webpage. Re-run the browser and compare the actual render against the selected revision. Generated-image typography or a decorative control is not proof that its coded counterpart works. When the render fails to carry the chosen relationship, correct the implementation or revise the concept and repeat.

## Convergence And Evidence

Stop when the declared scope is complete, material visible defects are resolved, the selected thesis survives desktop/mobile, and the relevant interactions or authored ending work. Do not prescribe a universal style or a fixed number of aesthetic rounds. If successive rounds stop improving, return to the weak direction or missing asset instead of producing near-identical revisions. Report actual tooling or content blockers without claiming acceptance.

Keep a compact ledger in [the evidence template](../templates/EVIDENCE.md): baseline capture, inspected defects, proposal image and prompt if used, accepted implementation delta, new capture, resolved issues, and remaining issues. Preserve the selected concept separately from runtime proof. This workflow requires real tool execution by the implementing agent; the local CLI only emits the plan.
