# Figma-light design studio (experiments)

Reusable designer tools for StoryCity HTML experiments — a thin “Figma light” rail:

- Look tokens (colour, radius, spacing, type)
- Move mode (select, Shift/Ctrl multi-select, Alt/deep pick, drag, center, lock)
- **Element size** slider for any selected node (generic scale, not gem-only)
- Autosave in **this browser** (`localStorage`) · survives reload
- Undo / Redo

## Reference implementation

Working copy lives in `location-gems/` (right rail: Look + Move).

When adding to another experiment folder:

1. Copy the Look / Move tool-block markup from `location-gems/index.html` (`edition-rail`).
2. Copy the CSS vars + Move / history styles from `location-gems/app.css` (`--btn-radius`, `--space-scale`, `--type-scale`, `.phone.is-design-move`, `.design-history`).
3. Copy the studio functions from `location-gems/app.js` (search `DESIGN_STUDIO_KEY`) and wire your phone root + target selector list.
4. Give each experiment its **own** `storageKey` so looks do not collide.
5. Bump `?v=` and ship via the experiments live-link flow.

## What autosave covers

| Survives reload (same browser) | Does not |
|---|---|
| Accent / radial / background / mid tone | Other people’s browsers |
| Button radius, spacing, type scale | Git / shared prototype until baked into code |
| Moved piece offsets + locks | Undo history stack (session only) |
| Undo/redo of those while the tab is open | Server-side persistence |

## Skill

Agents: use the personal skill `figma-light-design-studio` when Victoria asks to add or port these tools.
