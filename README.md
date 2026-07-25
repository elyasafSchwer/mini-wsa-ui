# WSA UI — Web Security Analytics Dashboard

A modern React dashboard for the **[MiniWSA](https://github.com/elyasafSchwer/mini-wsa-pipeline)**
web-security analytics backend. It visualizes enriched security events — attack
categories, threat scores, enforcement actions, top attackers, and repeat
offenders — with a live-polling overview and a filter-driven event explorer.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · TanStack Query · React Router · Recharts

---

## Features

- **Overview** (`/`) — live-polling KPIs, an events-over-time chart, category and
  action breakdowns, an average-threat-score gauge, and top attacker / targeted-path
  tables. Auto-refreshes on a configurable interval (pause/resume from the header).
- **Event Explorer** (`/events`) — paginated, filterable table of individual enriched
  events. Filter by config, time range, category, action, **client IP**, and
  **repeat-offender** status. Click an IP to filter by it.
- **Dev Data Tools** — an in-app panel (visible when the backend runs the `dev`
  profile) to **generate** synthetic attack data, **upload** a JSON/CSV file, or
  **clear** the index.
- **Shareable filters** — all filters live in the URL, so any view is bookmarkable and
  survives a refresh.
- **Dark / light theme** — toggled from the header, persisted across sessions.

---

## Prerequisites

- **Node.js ≥ 20** (developed on Node 23) and **npm ≥ 10**
- The **MiniWSA backend** running on `http://localhost:8080`, with **Elasticsearch**
  (`:9200`) and **Redis** (`:6379`). See the
  [backend README](https://github.com/elyasafSchwer/mini-wsa-pipeline) for setup.
  Run the backend with the `dev` profile to enable the in-app Data Tools.

> The UI is read-only against the analytics endpoints; it does not require the backend,
> but charts and tables will show empty/error states until the backend is reachable.

---

## Install & run locally

```bash
# 1. Clone
git clone https://github.com/elyasafSchwer/mini-wsa-ui.git
cd mini-wsa-ui

# 2. Install dependencies
npm install

# 3. (Optional) configure environment — defaults work out of the box
cp .env.example .env

# 4. Start the dev server
npm run dev
```

Then open the URL Vite prints — **http://localhost:5173** (it picks the next free
port, e.g. `5174`, if `5173` is taken).

### Make sure the backend is up

The dashboard talks to the backend through a dev proxy (see below), so no CORS setup
is needed. Start the backend first — the quickest path, from the backend repo:

```bash
docker compose up -d redis elasticsearch          # databases
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev   # app on :8080 (dev profile)
```

With no data yet, open the **Overview → Dev Data Tools** panel and click
**Generate & Ingest**, or seed from the backend:

```bash
curl -X POST "http://localhost:8080/api/dev/generate?count=5000&seed=42&waveRatio=0.3"
```

---

## Configuration

All configuration is optional — the defaults target a local backend. Values are read
from Vite env vars (`.env`). See `.env.example`:

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `""` (same-origin, uses the dev proxy) | Base URL for backend calls. Leave empty in dev to use the Vite proxy; set to e.g. `https://api.example.com` in other environments. |
| `VITE_POLL_INTERVAL_MS` | `10000` | Default live-refresh interval, in milliseconds. Also adjustable at runtime from the header. |

### Dev proxy

In development, Vite proxies API calls to the backend so the browser stays same-origin
(no CORS). Configured in `vite.config.ts`:

- `/v1/*`  → `http://localhost:8080`
- `/api/*` → `http://localhost:8080`

To point at a backend on a different host/port, edit the `server.proxy` targets in
`vite.config.ts`.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR. |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint over the project. |

---

## Project structure

```
src/
├── app/            # App wiring: providers, router, QueryClient
├── components/
│   ├── charts/     # Recharts wrappers (timeseries, category, action, gauge)
│   ├── dev/        # Dev Data Tools panel (generate / upload / clear)
│   ├── filters/    # FilterBar (scoped to endpoint filter support)
│   ├── kpi/        # KPI cards
│   ├── layout/     # AppShell, Sidebar, Header, ThemeToggle
│   ├── tables/     # Event samples, top attackers, top paths, pagination
│   └── ui/         # Design-system primitives (Card, Button, Badge, …)
├── config/         # env + static domain constants (categories, colors, …)
├── features/       # Page-level composition (overview, explorer)
├── hooks/          # TanStack Query hooks + URL-synced filter state + theme/polling
├── lib/            # apiClient, query keys, formatters, cn()
├── services/       # Pure HTTP calls, one module per backend resource
└── types/          # API DTOs, domain enums, filter types
```

**Architecture:** `services/` (pure HTTP) → `hooks/` (TanStack Query + polling) →
`features/` (pages). Filters are the URL's search params, giving shareable, refresh-safe
views. The `FilterBar` is scoped per page because the backend honors different filters
per endpoint (summary ignores category/action; samples honors the full set).
