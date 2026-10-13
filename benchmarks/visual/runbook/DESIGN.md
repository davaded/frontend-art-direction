# Runbook Direction

Alternatives considered: a calendar puts dates ahead of the task; a kanban board spends narrow-screen space on lanes; a compact queue with a detail reader puts actual work first. Choose the queue. This is a direction for this brief, not a universal operational template.

Composition: horizontal identity strip, a short task heading and search/action row, a quiet list occupying most of the width, and an unframed detail reader. Mobile replaces the side reader with a native dialog. Task names dominate; the heading stays 24px. Sora carries the UI; Space Mono carries date metadata. Cool white, near-black ink, coral for the active view, and a muted blue working-state marker give functional distinctions. Separate with whitespace first; use a light row rule for scan alignment, no repeating decorative card grid.

Use native inputs and dialogs plus the locally licensed Lucide icons. Motion is a brief state feedback transition, with static reduced-motion behavior. Scope includes long names, search with no result, edit/create validation, completion, recoverable removal, local persistence, real JSON export, and responsive detail/focus behavior.

## Composition Map

- Header: identity and workspace label share the start edge; export remains an isolated utility at the end edge.
- Task heading: the title and add action form a short command row; search and filters remain below it because they operate on the queue.
- Queue: the list owns most of the width and uses open rows with one local selected fill. The due column has a stable end edge for scanning.
- Detail: the selected task is an unframed reading rail with a local start edge; it is not a second card grid. On mobile it becomes a native dialog opened from the selected row.
- Empty space: the page leaves working room below a short queue so the surface remains calm; it does not invent summary tiles to fill the viewport.
- Intermediate / narrow: the reader collapses before the queue becomes cramped, filters and search regroup into a vertical command path, and task rows preserve title, state, and due-date relationships.
