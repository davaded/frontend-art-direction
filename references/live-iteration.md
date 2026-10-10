# Live Iteration Protocol

Use this protocol when a target project is running in a development browser and the visual problem is easier to judge through variants than through a static design brief.

## Route First

Resolve the current surface with `surface-mode` and the requested change with `design-operation`. The surface mode controls what counts as improvement:

- `Persuade`: subject proof, value hierarchy, and the next credible action.
- `Operate`: active object, primary action, resulting state, and recovery.
- `Read`: reading order, evidence relationships, and wayfinding.
- `Experience`: subject, attention path, authored transition, and ending.

These modes are per surface. A product can have a persuasive home route, an operational editor, and a reading-oriented changelog.

## Session Contract

Start a development-only session after the target is running:

```bash
frontend-art-direction live start \
  --project /path/to/project \
  --url http://localhost:5173 \
  --target "[data-art-direction-target]" \
  --query "make the editor panel feel more deliberate"
```

The session file is written under `.art-direction/live/`. A browser adapter or the implementing agent records the following sequence:

1. baseline capture at a named viewport and state;
2. selected route, region, or element;
3. two or three bounded variants inside one design operation;
4. comparable captures and observed differences;
5. one accepted or discarded variant;
6. the accepted source diff;
7. after-capture proof at desktop and mobile, plus the relevant state.

Record evidence and variants with `live record` and `live add-variant`, then close the decision:

```bash
frontend-art-direction live add-variant --project /path/to/project \
  --session <id> --id variant-1 --path artifacts/variant-1.png \
  --summary "wider stage, quieter rail, stronger type contrast"

frontend-art-direction live accept --project /path/to/project \
  --session <id> --variant variant-1 \
  --source-diff artifacts/variant-1.diff --path artifacts/after.png
```

`accepted-awaiting-proof` is intentional. Acceptance means a visual direction was chosen; it does not mean the source was applied or the final render passed. The session only becomes proof after the source change and after-capture are recorded.

Close the session only after the browser artifacts exist:

```bash
frontend-art-direction live close --project /path/to/project \
  --session <id> --format md
```

`close` requires at least two valid captured variants, a valid baseline, an after-capture, and a source diff when a variant was accepted. The evidence checker validates common image and video container signatures; a filename or non-empty text file does not count as rendered proof.

## Adapter Boundaries

The protocol is provider-neutral. A browser adapter may use Playwright, the Codex browser, an existing dev-server HMR path, or another project-owned mechanism. It must preserve the target app's CSP and development boundary, keep variants scoped to the selected region, and return a source diff before claiming that an accepted variant is implemented.

Do not inject into production. Do not use a generated mockup as a flattened page. Do not silently start a second dev server when the project already has one. If the browser or image tool is unavailable, keep the session honest and continue with code inspection or a static direction proposal.
