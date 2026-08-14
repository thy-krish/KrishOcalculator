# KRISHOTATOR — Secure AI Handoff and Relaunch Guide

**Purpose:** This document is the operating guide for an AI or developer resuming the KRISHOTATOR scientific calculator project. It describes the current product, safe launch procedure, important files, authentication and database boundaries, validation commands, and rules for protecting user data and secrets.

> **Security rule:** Never request, print, commit, or paste secret values into source files, chat messages, screenshots, tests, or documentation. Use the project environment/secrets manager for credentials. Guest mode must continue to work when authentication or database services are unavailable.

## 1. Project identity and current state

KRISHOTATOR is a deployable React scientific calculator with a tactile Gen Z / lab-notebook visual system. It supports scientific functions, DEG/RAD mode, inverse functions, memory controls, keyboard input, persistent sound preferences, an equals-button “bruh” cue, calculation history, optional OAuth login, database-backed account history, settings, sharing, and a post-login history-sync toast.

The current managed project is named `calculator-v2`. The local Windows copy is:

```text
D:\Projects\Kalculator
```

The project was last checkpointed as `776f0d48` after the sync-success toast update. The current validation baseline is **TypeScript passing, 10 Vitest tests passing, and production build passing**.

## 2. Safe local relaunch

Open a terminal in `D:\Projects\Kalculator` and install dependencies using the project’s pinned package manager:

```powershell
cd D:\Projects\Kalculator
pnpm install
```

Start the development server with:

```powershell
pnpm dev
```

Do not hardcode a port in application code. The managed runtime supplies the port. For a production-style local check, run:

```powershell
pnpm check
pnpm test --run
pnpm build
pnpm start
```

The expected test baseline is three test files and ten passing tests. A warning about a large Vite bundle or a runtime-only `/manus-storage/...` asset is non-fatal if TypeScript, tests, and build complete successfully.

## 3. Important project map

| Area | Location | Responsibility |
|---|---|---|
| Main calculator | `client/src/pages/Home.tsx` | Calculator UI, keyboard behavior, sound toggle, guest/account history, settings, sharing, sync toast |
| Login page | `client/src/pages/Login.tsx` | Optional OAuth entry and continue-as-guest route |
| Visual system | `client/src/index.css` | KRISHOTATOR palette, responsive layout, drawer, settings panel, toast, motion and reduced-motion rules |
| Routing | `client/src/App.tsx` | `/` calculator route and `/login` optional login route |
| History helpers | `client/src/lib/history.ts` | Pure merge, active-history selection, share fallback, sync-toast condition and copy helpers |
| History tests | `client/src/lib/history.test.ts` | Guest/account boundaries, share behavior, sync-toast trigger and copy |
| Server API | `server/routers.ts` | Auth, list/add/clear authenticated history procedures |
| Database helpers | `server/db.ts` | User-scoped history reads and writes |
| Schema | `drizzle/schema.ts` | `calculationHistory` table and user relationship/indexing |
| Migration | `drizzle/0000_strong_firelord.sql` | Reviewed non-destructive history-table migration |
| Auth runtime | `server/_core/` and `client/src/_core/hooks/useAuth.ts` | Supported Manus OAuth/session flow |
| Project checklist | `todo.md` | Feature history and completion tracking |

## 4. Data and authentication rules

Guest history is stored locally in the browser and must never be written to the database anonymously. Logged-in history is scoped to the authenticated user through protected server procedures. On login, guest-only calculations may be merged into the account collection without duplicating matching expression/result pairs. On logout, the active view must return to the guest-local collection rather than displaying another user’s account history.

The login experience is optional. The supported flow uses the project’s OAuth portal configuration; the UI labels the entry as Google sign-in, but an AI must not replace the supported OAuth flow with hand-written cookie logic or an unapproved provider integration. `startLogin()` must be called only from an event handler. Never generate login URLs during React render.

Database schema changes require a schema-first workflow: update `drizzle/schema.ts`, generate and inspect the migration, apply non-destructive SQL through the managed database operation, then verify with tests. Never run destructive `DROP`, `TRUNCATE`, or reset commands against user data without explicit authorization.

## 5. Environment and secrets

The runtime may provide values such as `DATABASE_URL`, `JWT_SECRET`, `VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID`, `OWNER_NAME`, `BUILT_IN_FORGE_API_URL`, `BUILT_IN_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`, `VITE_FRONTEND_FORGE_API_KEY`, and analytics identifiers. These names may be referenced through the project runtime, but their values must remain outside the repository.

If a required value is absent, stop and request it through the project’s secure secret configuration flow. Do not fabricate credentials, disable auth checks, expose database URLs, or commit `.env` files. Do not add telemetry or third-party services without documenting the data transmitted and obtaining the required configuration.

## 6. Safe change workflow for another AI

Before editing, read this handoff, `todo.md`, the relevant source file, and any nearest `AGENTS.md`. For a new request, add an unchecked item to `todo.md` before implementation. Reuse the existing tRPC, Drizzle, OAuth, storage, and UI patterns rather than introducing parallel APIs. Keep user-scoped queries protected and keep guest fallback behavior intact.

After implementation, run `pnpm check`, `pnpm test --run`, and `pnpm build`. For visual changes, verify desktop and narrow responsive layouts. Mark checklist items complete only after verification. Save a new project checkpoint before delivery so the user can review or restore the exact state. Never publish automatically; leave publishing to the project’s management UI.

## 7. Current feature acceptance checklist

A safe continuation should preserve all of the following: calculator evaluation and keyboard operation; DEG/RAD and scientific controls; mute toggle plus `M` shortcut; local guest history; authenticated history sync; logout restoration of guest history; settings controls; native-share and clipboard fallback; optional login; sync-success toast shown once after authenticated history data becomes ready; reduced-motion support; responsive drawer and settings behavior; and passing type checks, tests, and production build.

When uncertain, prefer the smallest reversible change, explain the trade-off, preserve existing user data, and ask the user before adding a new external integration or changing authentication/database behavior.
