# apt-keyboard-lens

A static web app for visually comparing **physical keycap legends** with the **software keyboard layout** assigned to the same physical positions.

Live at: **https://mrandreastoth.github.io/apt-keyboard-lens/**

---

## What it does

If, for example, you use a keyboard with Spanish physical legends but, say, a US software layout, or any other mismatch, this tool shows you — key by key — which legends match, which differ, and which are missing.

Each key is colour-coded:

| Colour | Meaning |
|--------|---------|
| Green  | Physical and software legends match |
| Amber  | Physical and software legends differ |
| Red    | Legend defined on only one side |
| Grey   | Not compared (modifier, function key, or no data for current modifier state) |

## Using it

1. Open the app in a browser — no server required, works from `file://`.
2. Choose a **Platform** (PC or Mac) and **Keyboard shape**.
3. Select **Physical** and **Software** layout presets, or enter a custom mapping.
4. Use the **View** toggle to show both layers, physical only, or software only.
5. Click any **modifier key** on the diagram (Shift, Caps, Alt/AltGr, Ctrl) to explore the different character layers.

Hovering over a key shows a tooltip with its full character value — useful when the text is too wide to fit on the key cap.

## Modifier keys

Clicking a modifier key on the keyboard diagram activates it. The diagram immediately updates to show the characters produced under that modifier combination. Click again to deactivate.

| Modifier | Effect |
|----------|--------|
| Shift | Shows shifted characters |
| Caps | Inverts Shift for letter keys |
| Alt / AltGr | Shows AltGr (third-level) characters |
| Ctrl | Shows control codes (^A–^Z and a few others) |

## Built-in layouts

17 layouts are included, all embedded directly in the app (no network requests):

US, UK, BE, BR, CH (Swiss German), CH (Swiss French), DE, DK, ES, FR, HU QWERTZ, HU QWERTY, IT, LA (Latin American), NO, PT, SE

The default loads **US physical + UK software** on an **ISO TKL**.

## Keyboard shapes

**PC**
- ISO TKL — TenKeyLess with ISO Enter and extra key (default)
- ANSI TKL — TenKeyLess with ANSI Enter
- ANSI 60% — Compact, no function row or navigation cluster

**Mac**
- Mac ISO — Full-size Mac with ISO Enter
- Mac ANSI — Full-size Mac with ANSI Enter

## Custom mappings

Select **Custom** from either preset dropdown to enter your own mapping. One key per line:

```
# Comments start with #
AE01 = 1
AC10 = Ñ
TLDE = º
```

Key codes follow the XKB position naming convention:

| Code | Position |
|------|----------|
| `TLDE` | Top-left (tilde/backtick row) |
| `AE01`–`AE12` | Number row keys 1–12 |
| `AD01`–`AD12` | Top alpha row (Q–]) |
| `AC01`–`AC11` | Home row (A–') |
| `AB01`–`AB10` | Bottom row (Z–/) |
| `LSGT` | ISO extra key (left of Z) |
| `BKSL_ISO` | ISO backslash (between ' and Enter) |
| `SPCE` | Space bar |

## Technical notes

- Pure vanilla HTML/CSS/JS — no framework, no build step, no backend.
- All layout data is embedded in `app.js`; the app works from `file://` with no server.
- Runs entirely in the browser; nothing is sent anywhere.
- GitHub Pages compatible: serve the repo root.

## File structure

```
index.html      Main HTML and controls
style.css       Keyboard layout and theme styles
app.js          Geometry definitions, layout data, renderer
layouts/        Source JSON files for each built-in layout
README.md       This file
```

## Licence

MIT
