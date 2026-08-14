# KRISHOTATOR Modernization and Optional Login

- [x] Generate a short, clean “bruh” vocal hit suitable for a calculator interaction.
- [x] Generate a subtle low-volume bass drop with a short tail.
- [x] Remove the bass layer and keep only the short “bruh” clip through its natural end.
- [x] Rename CALC//LAB to KRISHOTATOR across UI copy and document metadata.
- [x] Preserve browser-safe playback handling for the shortened cue.
- [x] Verify the shortened audio hook does not block calculation or break production build.
- [x] Add a mute toggle backed by localStorage.
- [x] Convert calculation history into a smooth slide-out panel with accessible controls.
- [x] Verify mute persistence, panel animation, responsive behavior, and production build.
- [x] Add the M keyboard shortcut for sound toggle.
- [x] Add timestamps and date-grouped history sections.
- [x] Add a saved-calculation count badge to the history trigger.
- [x] Modernize the visual system without losing the tactile KRISHOTATOR identity.
- [x] Add optional Google-labeled OAuth sign-in page using the supported secure OAuth flow while preserving guest access.
- [x] Verify guest flow route, optional auth entry point render, responsive behavior, tests, and production build.
- [x] Add authenticated calculation history schema and user-scoped database procedures.
- [x] Keep guest history local while syncing logged-in history to the database.
- [x] Add account settings panel for logout, sound preferences, and history sync.
- [x] Add copy/native-share actions for individual history entries.
- [x] Verify guest and authenticated flows, sharing behavior, responsive UI, tests, and production build.

- [x] Separate guest-local history from account-synced history and restore guest history after logout.
- [x] Add focused tests for first-login merge and logout restoration boundaries.
- [x] Verify share fallback, settings actions, and responsive history states before checkpoint.
