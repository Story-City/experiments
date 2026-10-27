# Figma ↔ DOM slot contract

Visual target: [MOB-D-C11 Audio Only More Info](https://www.figma.com/design/fjuRfwKKhJQmAAWLjx9qc2/?node-id=5852-410071) (`5852:410071`).
Assets in `assets/` (cafe, Chane, pause, dock fill). Style with CSS; keep Brett’s `DATA_ROOT` in `engine.js`.

| Figma group | DOM | Role |
|-------------|-----|------|
| title / nav | `#topBar` `#pickBtn` | Centered story title (tap → lab sheet) |
| cafe + Chane | `#placeBg` `#sprite` | Figma scene art in `assets/` |
| `player_audio` | `#dock` | Speaker + line + scrub + green pause |
| `textFrame` | `#textFrame` | Speaker + caption + lab speed |
| `player` | `#player` | `time/total` + accent scrub + 40×40 play |

## Chapter / story pick — who is it for?

**Us (designers / QA / lab), not consumers.**

In Brett’s desktop tool, story/chapter pick is part of the alignment lab. In this graphic-novel proto it stays so we can swap sample chapters while designing. A real Story City reader already knows which chapter the user is in — they would not pick from a six-story experiment list.

Speed chips stay tucked under the caption (`#speedToggle` → expand `#speedSeg`), not in the dock player (the app’s AudioPlayer has no speed control).

Dashed outlines and uppercase labels on device are intentional until polish. Hide labels later with:

```css
body[data-skin="default"] .slot-label { display: none; }
```

Alt UIs: set `body data-skin="…"`, override in `app.css`, keep `engine.js`. Bump `?v=` when publishing.
