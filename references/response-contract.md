# Response Contract

The skill should make decisions visible without turning every task into a report.

## Short Mode

Use by default:

```text
Decision: one sentence on the chosen direction or fix.
Changed: files/surface and the main behavior.
Proof: commands, runtime state, viewport, screenshot, or test.
Open: blockers and unverified claims only.
```

Keep it to the smallest useful size. Mention an assumption when it changes the result.

The package enforces this shape in `scripts/audit.mjs`. Its default Markdown output is intentionally bounded: it keeps only the highest-signal graph nodes, resource candidates, quality gates, and open risks. Use JSON when another agent needs the full structured evidence.

## Deep Mode

Use when the user requests a plan/review, the direction is high-risk, or another agent will continue the work:

```text
Requirement frame
Local evidence
Direction and alternatives rejected
Implementation contract
Changed surface
Verification evidence
Risks and next decision
```

Do not repeat the full reference text. Link the relevant local file and quote only the decision it affected.

## Language

Match the user's language. Prefer concrete nouns, exact paths, and explicit uncertainty. Avoid generic praise, invented metrics, and claims that a reference or visual state was inspected when it was not.
