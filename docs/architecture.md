# Architecture

A build-free, statically-deployed single-page app (frontend) backed by two Vercel
serverless functions (web API). A separate Python research pipeline (local, not published)
generates the universe metadata the frontend ships with.

## Repository layout (published)

```
index.html                 # App shell: <head>, markup, and the module entry point.
                           #   Kept at the repo root for Vercel zero-config deploy.
styles/
  base.css                 # Layout, cards, tables, charts, responsive breakpoints
  theme.css                # Liquid-glass theme (gx-*)
  motion.css               # Unified motion / animation layer
src/
  main.js                  # Entry: wires modules, bridges inline handlers to window, bootstraps
  state.js                 # Static taxonomy + illustrative data + formatting/logo utils + Chart.js setup
  universe-store.js        # The 683-asset universe: build, rank, sector aggregation, header/KPI paint
  history-data.js          # /api/history fetch + applyHistory(); owns the historical series
  charts.js                # Chart.js builders: donut, market-cap, composition, volatility
  tradingview.js           # Lazy-loaded TradingView embed + symbol mapping
  router.js                # Tab switching
  live-data.js             # /api/quotes 60s polling + live overlay + LIVE/SNAPSHOT status
  views/
    overview.js            # 683-asset bubble map (Overview tab)
    dashboard.js           # Dashboard tab (KPIs, ticker strip, market table)
    sectors.js             # Sectors grid → sector detail → single-asset detail
  data/
    overview-assets.js     # Generated: OVERVIEW_ASSETS (683) + OVERVIEW_KEPT (54)
api/
  quotes.js                # Vercel function: CoinMarketCap listings proxy (key server-side)
  history.js               # Vercel function: CMC + DeFiLlama history (key server-side)
docs/                      # This documentation
```

Local-only (git-ignored, never published): `pipeline/` (Python research pipeline +
its methodology docs under `pipeline/docs/`), `archive/` (legacy snapshots), the `.env`
and `api.txt` credential files, and `*.xlsx` factor models.

## Module dependency graph

```
data/overview-assets.js
        ↓
     state.js ──► universe-store.js ──► history-data.js ◄──► charts.js
        │              │                     │                  │
        └──────────────┴─────────► views/{overview,dashboard,sectors}.js ◄── tradingview.js
                                            │
                                         router.js
                                            │
        live-data.js ──────────────────────┘
                                            │
                                         main.js  (entry; bootstraps everything)
```

Modules communicate via ES `import`/`export`. Functions referenced by inline HTML
attributes (`onclick=`, `onchange=`, `onerror=`) are bridged onto `window` in `main.js`.
Shared mutable state lives in the module that owns it (e.g. historical series in
`history-data.js`, universe totals in `universe-store.js`) and is read elsewhere through
live bindings, so behavior matches the original single-file app exactly.

## Data flow

1. **Static load.** `state.js` and `universe-store.js` build the universe from
   `overview-assets.js`; `main.js` paints the header with the snapshot.
2. **Live quotes.** `live-data.js` polls `/api/quotes` every 60s (CoinMarketCap top-100),
   overlays price / market cap / 24h onto the universe, re-ranks, and re-renders the
   visible view. LIVE (green) on success, SNAPSHOT (red) on failure.
3. **History.** `history-data.js` fetches `/api/history` (CMC current cap + DeFiLlama
   prices), reconstructs market-cap history, and feeds the Chart.js charts.

## Deployment (Vercel, zero-config)

- Vercel serves `index.html` (and the static `styles/`, `src/` assets) and treats `api/*.js`
  as serverless functions — both must stay at the repo root, which is why the frontend is
  not nested under a subdirectory.
- `CMC_API_KEY` is set as a Vercel environment variable (Production + Preview) and is read
  only inside `api/quotes.js` and `api/history.js`; it never reaches the browser.
- Pushing to `main` triggers a production deploy; pushing to any other branch produces a
  preview deploy (useful for verifying changes before merge).

## Local development

```bash
# ES modules require http(s), not file:// — serve the repo root:
python -m http.server 8765
# open http://127.0.0.1:8765/index.html
```

`/api/*` returns 404 locally (no serverless runtime), so the page shows SNAPSHOT and
falls back to the bundled snapshot — expected. To exercise the live API, use a Vercel
preview deploy.
