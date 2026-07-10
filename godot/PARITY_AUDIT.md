# Atomize Godot/Web Parity Audit

Date: 2026-07-10

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

## Remaining Gaps

- **Auth/account/friends are web-only.** Godot only has anonymous Supabase access for leaderboard and realtime presence. Native mobile account and friends parity needs a Supabase Auth session flow first.
- **Realtime lobby is presence-only on Godot.** The web side supports invites, accept/decline, and room sync; Godot can list online players but still starts CPU battles only.
- **UI is a monolith.** `scripts/screens/main.gd` owns layout, state, persistence, realtime, audio, haptics, VFX, and gameplay orchestration. Split future work into feature scenes/scripts before adding larger account or multiplayer flows.
- **Safe-area handling is still incomplete.** Project settings are mobile-oriented, but most UI positions are absolute. Add a safe-area margin adapter before testing on notched iPhones and Android devices.
- **Parity tests cover core logic, not screens.** Add headless screen smoke tests for every `--atomize-screen` entry and focused save/progression tests for local files.
- **Version labels are duplicated.** Godot `APP_VERSION_LABEL`, `export_presets.cfg`, and web/package version metadata should be generated from one source.
- **Haptics need export verification.** Godot calls `Input.vibrate_handheld`, but Android export permissions and real-device behavior should be verified before release.

## Recommended Next Enhancements

1. Add a small `SaveManager` script for best score, tutorial completion, player name, and EXP so persistence stops living in `main.gd`.
2. Add a mobile safe-area helper that adjusts the root margins and top-right menu placement from `DisplayServer.get_display_safe_area()`.
3. Decide whether mobile should support account/friends natively or intentionally remain guest-first. If native, implement Supabase Auth before friends.
4. Extend the realtime protocol so Godot can send and receive the same invite messages as the web lobby.
5. Add a scripted Godot smoke test that launches home, tutorial, solo pregame, leaderboard, battle picker, and battle ready through `--atomize-screen`.
