# EvOS — Event Operating System

> AI-powered operational intelligence platform for event organizations.

## Tech Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Frontend    | Next.js 14 (App Router), TypeScript |
| Backend     | Go (monolith, net/http + chi)       |
| Database    | PostgreSQL via Supabase             |
| Auth        | Supabase Auth (JWT + Google OAuth)  |
| Storage     | Supabase Storage                    |
| AI          | OpenAI GPT-4o / Gemini              |
| Deploy      | Railway / Fly.io                    |

## Monorepo Structure

```
evos/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Go backend (monolith)
├── supabase/         # Supabase config, migrations, edge functions
├── packages/
│   └── shared-types/ # Shared TypeScript types
├── docs/             # PRD, architecture docs
└── scripts/          # Dev & deploy scripts
```

## Quick Start

```bash
# Install frontend deps
cd apps/web && npm install

# Run frontend dev server
npm run dev

# Run Go backend
cd apps/api && go run ./cmd/server/...
```

## Key Features (V1)

- 🧠 **AI Event Setup** — Auto-generate divisions, timeline, KPIs, risk matrix
- 📊 **Dynamic Health Score** — Real-time event health (threshold < 60 = critical)
- 🗺️ **Critical Path Engine** — Dependency graph & cascade impact simulation
- ⚠️ **Risk Escalation Protocol** — Automated escalation chain per risk level
- 💬 **Integrated Chat** — Per-event & per-division rooms with at-rest encryption
- 🏢 **War Room Mode** — Event day command center (auto-activates H-0)
- 🎓 **Org Memory Engine** — 4-layer institutional learning system
- 📋 **Sponsor CRM** — Data-driven relationship management
- 📦 **Vendor Management** — Unified vendor intelligence system

## User Roles

| Role            | Scope                                      |
|-----------------|--------------------------------------------|
| `SUPER_ADMIN`   | Full org access, billing, settings         |
| `EVENT_MANAGER` | Full event access, create/manage events    |
| `DIVISION_HEAD` | Division workspace, partial event view     |
| `CORE_MEMBER`   | Task execution, view-only most areas       |

## Version

**V1.0** — Launch Scope · 2025 · Confidential & Internal
