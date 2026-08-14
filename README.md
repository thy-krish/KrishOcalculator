# KRISHOTATOR

A deployable React scientific calculator with a tactile Gen Z / lab-notebook visual system. Built with React 19, Vite, Express, tRPC, Drizzle ORM, and MySQL.

## Features

- **Scientific Calculator**: Full scientific functions (sin, cos, tan, log, ln, etc.), DEG/RAD mode, inverse functions
- **Memory Controls**: M+, M-, MR, MC with visual feedback
- **Keyboard Support**: Full keyboard input for all operations
- **Calculation History**: Persistent local guest history with optional cloud sync
- **Authentication**: Optional Google OAuth login (guest mode always works)
- **Sound Effects**: Tactile "bruh" audio cue on equals with mute toggle (M key shortcut)
- **Sharing**: Native share API with clipboard fallback for individual calculations
- **Responsive Design**: Works on desktop and mobile with slide-out history panel
- **Reduced Motion**: Respects `prefers-reduced-motion` accessibility setting

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4 |
| Backend | Express, tRPC, TypeScript |
| Database | MySQL (Drizzle ORM) |
| Auth | OAuth (Manus/Google) |
| Testing | Vitest |
| Deploy | Vercel |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── pages/          # Home (calculator), Login
│       ├── lib/            # History utilities & tests
│       ├── hooks/          # Custom React hooks
│       └── index.css       # Visual system (KRISHOTATOR theme)
├── server/                 # Express + tRPC backend
│   ├── _core/              # Core server utilities (auth, db, llm, etc.)
│   ├── routers.ts          # tRPC procedures
│   └── db.ts               # Database helpers
├── shared/                 # Shared types & constants
├── drizzle/                # Database schema & migrations
├── api/index.ts            # Vercel serverless entry point
└── vercel.json             # Vercel deployment config
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+ (enabled via corepack)
- MySQL database

### Installation

```bash
# Enable pnpm via corepack
corepack enable

# Install dependencies
pnpm install

# Set up environment variables (see .env.example)
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server (client + server) |
| `pnpm build` | Production build (Vite + esbuild) |
| `pnpm start` | Run production build |
| `pnpm check` | TypeScript type check |
| `pnpm test` | Run Vitest tests |
| `pnpm format` | Format with Prettier |
| `pnpm db:push` | Generate & run Drizzle migrations |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | MySQL connection string |
| `JWT_SECRET` | Secret for JWT tokens |
| `VITE_APP_ID` | Application identifier |
| `OAUTH_SERVER_URL` | OAuth server endpoint |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL for login |
| `OWNER_OPEN_ID` | Owner's OpenID for admin access |
| `BUILT_IN_FORGE_API_URL` | AI forge API URL (server) |
| `BUILT_IN_FORGE_API_KEY` | AI forge API key (server) |
| `VITE_FRONTEND_FORGE_API_URL` | AI forge API URL (client) |
| `VITE_FRONTEND_FORGE_API_KEY` | AI forge API key (client) |

> **Never commit `.env` files or expose secrets.** Use Vercel's environment variable configuration for production.

## Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Add all required environment variables in Vercel dashboard
3. Deploy - `vercel.json` handles the build configuration

The `installCommand` uses `corepack enable && pnpm install` to ensure pnpm is available.

## Database Schema

Main table: `calculationHistory`
- `id` - Primary key
- `userId` - Foreign key to user (nullable for guest)
- `expression` - Math expression string
- `result` - Calculated result
- `mode` - DEG/RAD mode
- `createdAt` - Timestamp

Run migrations:
```bash
pnpm db:push
```

## Testing

```bash
# Run all tests
pnpm test

# Run with UI
pnpm test --ui
```

Current baseline: 3 test files, 10 passing tests covering:
- History merge logic (guest ↔ account)
- Share behavior (native + clipboard fallback)
- Sync toast trigger conditions

## Architecture Notes

- **Guest-first**: All features work without authentication
- **User-scoped data**: Authenticated history isolated per user via tRPC procedures
- **Optimistic UI**: Local state updates immediately, syncs to server in background
- **Schema-first DB**: Drizzle schema → migration → apply (never destructive)

## License

MIT