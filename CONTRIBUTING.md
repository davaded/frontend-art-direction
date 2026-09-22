# Contributing

Keep this repository useful to another agent six months from now.

## Before A Change

1. Identify the decision or failure the change fixes.
2. Check whether an existing reference, dataset record, or script already owns that decision.
3. Keep the core `SKILL.md` short; put conditional material in `references/`.

## Data Changes

Dataset entries must include keywords, a useful decision, and an explicit misuse or verification note. Do not add a style name without a product scene, signature move, and rejection list.

## Validation

```bash
npm test
npm run pack:check
```

For script changes, run the command directly against this repository and a small temporary fixture. For visual guidance changes, test the skill on a real frontend request and inspect the rendered result, not only the response text.

## Pull Requests

Describe:

- the failure mode;
- the files and behavior changed;
- the evidence that the change works;
- any remaining uncertainty or compatibility impact.
