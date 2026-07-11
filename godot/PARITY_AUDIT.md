# Atomize Godot/Web Parity Audit

Date: 2026-07-11

## Checked Surface

- Godot project settings and export presets for mobile renderer, portrait sizing, texture compression, and export filters.
- Godot main scene and `main.gd` screen flow: home, tutorial, solo, leaderboard, CPU battle, realtime lobby presence, persistence, input, audio, haptics, and VFX.
- Godot core parity coverage for random generation, solo rules, timing constants, and battle room rules.
- Web app routes and surfaces: menu, tutorial, solo, battle picker/play, auth, account, friends, leaderboard, local progression, and Supabase-backed sync.

## Filled In This Pass

- Godot now persists local EXP and shows the current level on the home screen, matching the web level formula.
- Godot now awards solo and CPU battle EXP instead of only displaying earned EXP in result dialogs.
- Godot best-record persistence now saves max combo independently from high score, matching the web helper semantics.
- Godot now handles mobile background lifecycle by throttling FPS, muting audio, pausing solo play, and restoring foreground state.
- Android hardware Back now uses the same navigation path as `ui_cancel` instead of relying on default app quit behavior.
- Godot critical mobile UI now respects `DisplayServer.get_display_safe_area()` for top controls, page headers, battle/solo HUDs, bottom keypads, and tutorial cards.
- Godot runtime version display now reads `application/config/version`, Android export enables vibration permission, and the export/project version is aligned to `0.1.0`.
- Added a headless Godot screen smoke runner for every `--atomize-screen` entry and exposed it through `bun run godot:smoke`.
- Godot now speaks the same Supabase Realtime lobby and room broadcast protocol as the web app for online presence, invites, accept/decline, room state, ready state, and ordered battle actions.

## Remaining Gaps

- **Auth/account/friends are web-only.** Godot only has anonymous Supabase access for leaderboard and realtime presence. Native mobile account and friends parity needs a Supabase Auth session flow first.
- **UI is a monolith.** `scripts/screens/main.gd` owns layout, state, persistence, realtime, audio, haptics, VFX, and gameplay orchestration. Split future work into feature scenes/scripts before adding larger account or multiplayer flows.
- **Realtime still needs live cross-client QA.** Godot now implements the web broadcast protocol, but web-to-Godot and Godot-to-web invite/gameplay should be exercised against a configured Supabase project on real devices.
- **Save/progression tests are still mostly implicit.** Core parity and screen smoke run headlessly, but local file persistence should get focused tests once persistence is split out of `main.gd`.

## Recommended Next Enhancements

1. Add a small `SaveManager` script for best score, tutorial completion, player name, and EXP so persistence stops living in `main.gd`.
2. Decide whether mobile should support account/friends natively or intentionally remain guest-first. If native, implement Supabase Auth before friends.
3. Run a live Supabase device matrix: web host to Godot guest, Godot host to web guest, ready/start, combo actions, finish, decline, reconnect.
4. Split battle lobby/room networking into a dedicated script before adding auth-bound friend invites.
5. Add focused save/progression tests for best score, max combo, EXP, and tutorial completion.
