# DESIGN.md

`DESIGN.md` is a project-level visual memory file. It can preserve art direction, tokens, component language, and cross-device rules so future UI work does not restart from taste alone.

Google Labs' DESIGN.md project is a useful reference format for describing visual identity to coding agents:

- Repository: https://github.com/google-labs-code/design.md
- Specification: https://stitch.withgoogle.com/docs/design-md/specification

Treat the format as optional and evolving. Use it when it helps the project, not as a required output for every UI task.

## When to Create or Update

Create or update `DESIGN.md` when:

- the project will be iterated over time
- a new art direction has been chosen
- multiple screens/components need consistent treatment
- existing styles are inconsistent
- the user asks for a design system, style guide, or persistent UI direction
- future agents or teammates need a stable reference

Skip or postpone it when:

- the task is a one-off prototype
- the user only wants a quick local visual edit
- writing the document would delay requested implementation
- there is not enough real product context to make durable decisions

## Suggested Structure

```markdown
# DESIGN.md

## Product Character
Short description of the intended visual and interaction identity.

## Reference Direction
What to borrow from selected references, and what not to borrow.

## Tokens
- Colors and roles
- Typography scale
- Spacing rhythm
- Radius and shape
- Border, shadow, elevation, material

## Layout
Grid, density, section rhythm, navigation, responsive behavior.

## Components
Buttons, inputs, lists, cards, dialogs, tabs, menus, charts, media, toolbars.

## Motion and Interaction
Feedback, transitions, loading, empty, error, success, and device-specific input.

## Cross-Device Translation
Desktop, mobile, car/head-unit, big screen, embedded, or other target surfaces.
```

## Rule

Do not stop at `DESIGN.md` when the user asked for UI implementation. Use the document to guide the build, then implement and verify the real surface.
