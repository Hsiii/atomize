# Atomize Godot Port — Design QA

## Comparison target

- Source visual truth path: `/Users/hsi/.codex/visualizations/2026/07/18/019f7355-2937-7d42-9e92-f770d3490c1c/atomize-port-audit/`
- Source implementation: `src/components/menu/`, `src/components/game/`, `src/base.css`, and `src/theme.css`
- Rendered implementation screenshot path: `/Users/hsi/.codex/visualizations/2026/07/18/019f7355-2937-7d42-9e92-f770d3490c1c/atomize-port-implementation/`
- Viewport: 390 × 844 logical pixels; Godot simulator rendered at 2× with native macOS window chrome outside the compared content region.
- States: first-run home, open home menu, Solo setup, Leaderboard empty, Battle picker empty, Battle ready, tutorial intro, Solo gameplay, and Battle gameplay.

## Full-view comparison evidence

The source and implementation originals were opened together in the same comparison inputs for:

- `01-web-home.png` ↔ `home-first-run.png`
- `05-web-solo-pregame.png` ↔ `solo-pregame.png`
- `13-web-leaderboard.png` ↔ `leaderboard.png`
- `14-web-battle.png` ↔ `battle-picker.png`
- `16-web-battle-ready.png` ↔ `battle-ready.png`
- `03-web-menu.png` ↔ `tutorial.png`
- `18-web-battle-game.png` ↔ `battle-game.png`

The source Battle-game frame is horizontally cropped during an active animation, so it was used only for target scale, color, HP hierarchy, and number-blob treatment. Full gameplay layout fidelity was also checked against `GamePlayScreen.css`, `MultiplayerGameScreen.css`, `NumberBlobDisplay.css`, and `GameControls.tsx`.

## Focused comparison evidence

No separate crops were needed: the original 390 × 844 captures retain readable type, icon strokes, control edges, shadows, and keypad spacing. Header/back controls, hero icons, number blobs, tutorial sheet, disabled keypad controls, avatars, HP labels, and CTAs were inspected at original resolution in the paired comparisons.

## Required fidelity surfaces

- Fonts and typography: passed. Godot now uses Avenir Next with Helvetica Neue/Arial fallbacks, stronger weights, uppercase action/title treatment, readable helper copy, and tabular-feeling metric hierarchy consistent with the source.
- Spacing and layout rhythm: passed. Curved headers, centered hero content, 44px back controls, circular targets/avatars, tighter gameplay composition, and a tutorial sheet above rather than over the keypad match the intended hierarchy. The Solo stat surface and Leaderboard CTA are intentional retained product enhancements.
- Colors and visual tokens: passed. Primary, secondary, page, ink, danger, gold, border, disabled, and shadow colors use the established Atomize palette and remain legible in the inspected states.
- Image quality and asset fidelity: passed. Icons use the existing asset family or source Lucide assets, render with antialiasing and mipmapped linear filtering, and are no longer nearest-neighbor or visibly jagged. The crossed-swords and Play marks match the web icon family.
- Copy and content: passed. Implementation-facing realtime errors were replaced with the product-facing `No players online` state and a clear follow-up. Leaderboard empty copy now gives a next action.
- Interaction and accessibility: passed for implemented scope. Buttons have keyboard focus, visible gold focus styling, explicit names for icon-only controls, reduced-motion guards, 44px+ touch targets, menu dismiss behavior, animated dialogs/game entry, and readable disabled states.

## Findings

No actionable P0, P1, or P2 differences remain in the inspected states.

Accepted intentional differences:

- The Solo personal-best block keeps the added elevated surface rather than reverting to uncontained rows.
- The Leaderboard empty state keeps the added explanatory copy and Play Solo CTA.
- Combat particles, attack trails, impact flashes, healing streams, fault ricochets, perfect halos, score/damage pops, haptics, and related emotional feedback remain in place.
- Godot's native macOS debug window frame is outside the 390 × 844 content comparison and is not a product-surface mismatch.

## Comparison history

### Iteration 1 — blocked

Earlier evidence: `AUDIT.md` and the original `02`, `04`, `06`, `08`, `10`, `12`, `15`, `17`, `19`, and `20` Godot captures.

P1/P2 findings included mismatched monospace typography, square/jagged shapes, flat headers, weak button hierarchy, home-menu overlap, exposed implementation copy, square avatars/targets, excessive gameplay dead space, low-contrast keypad controls, a tutorial card covering controls, absent focus treatment, and no reduced-motion path.

Fixes made:

- Rebuilt shared typography, curves, circles, pills, shadows, icon filtering, focus states, and reduced-motion foundations.
- Rebuilt home/menu layering and first-run Play presentation.
- Rebuilt page headers, setup stats, empty states, battle picker, avatars, and ready staging.
- Rebuilt number-blob composition, HP/score hierarchy, keypad contrast/spacing, tutorial sheet placement, game-entry motion, and dialog motion while preserving the emotional combat layer.
- Added accessible names for icon-only controls and explicit smoke states for first-run home and open-menu rendering.

### Iteration 2 — passed

Post-fix evidence: all screenshots in `/Users/hsi/.codex/visualizations/2026/07/18/019f7355-2937-7d42-9e92-f770d3490c1c/atomize-port-implementation/`, paired with the source captures listed above. No actionable P0/P1/P2 mismatch remained after the paired comparison.

## Verification

- Primary interactions tested: first-run Play state, open/dismissable home menu state, Solo setup CTA, Leaderboard empty CTA, CPU Battle entry, ready state, tutorial actions, Solo controls, and Battle controls.
- Runtime/console errors checked: the expanded Godot screen smoke suite passed all 12 states with no script or parse errors.
- Visual states were captured from the official Godot simulator on Desktop 2.

final result: passed
