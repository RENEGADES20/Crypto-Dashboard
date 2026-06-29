# Crypto Dashboard — rebel Financial

A client-facing **digital asset market education dashboard** by rebel Financial (an RIA).
It visualizes the structure of the crypto market — total market cap, leader dominance,
sector distribution, volatility, and single-asset quotes — to help advisors explain the
market to clients. It is **not** a trading tool and offers no investment advice.

🔗 **Live:** https://crypto-dashboard-beta-mocha.vercel.app/

---

## Tech stack

- **Frontend** — build-free static SPA: `index.html` + CSS + vanilla **ES modules**, with
  [Chart.js](https://www.chartjs.org/) and embedded [TradingView](https://www.tradingview.com/) charts.
- **Web API** — two [Vercel](https://vercel.com/) serverless functions that proxy
  CoinMarketCap and DeFiLlama so the API key stays server-side.
- **Hosting** — Vercel, auto-deployed from `main`.

## Repository structure

```
index.html        # app shell (kept at root for Vercel zero-config)
styles/           # base.css, theme.css, motion.css
src/              # ES modules (state, universe-store, charts, views/, live-data, …)
src/data/         # generated universe metadata (overview-assets.js)
api/              # Vercel serverless functions (quotes.js, history.js)
docs/             # PROJECT.md, architecture.md
```

See **[docs/architecture.md](docs/architecture.md)** for the module graph and data flow,
and **[docs/PROJECT.md](docs/PROJECT.md)** for product context.

> The crypto factor-model **research pipeline** (Python) and research material are
> intentionally kept local and are **not part of this repository** (git-ignored) to protect
> proprietary research and credentials.

## Local development

ES modules require `http(s)` (not `file://`), so serve the repo root:

```bash
python -m http.server 8765
# open http://127.0.0.1:8765/index.html
```

Locally, `/api/*` returns 404 (no serverless runtime), so the page shows **SNAPSHOT** and
uses bundled fallback data — this is expected. Use a Vercel **preview deploy** to exercise
the live API.

## Deployment

Vercel serves `index.html` + static assets and runs `api/*.js` as serverless functions
(zero-config — both stay at the repo root). Set one environment variable:

| Variable | Where | Notes |
|---|---|---|
| `CMC_API_KEY` | Vercel → Settings → Environment Variables | CoinMarketCap Pro key; Sensitive; Production + Preview |

Pushing to `main` deploys to production; any other branch creates a preview deploy.

## Data sources

CoinMarketCap (live quotes) · CoinMarketCap + DeFiLlama (history) · TradingView (price charts).

## Disclaimer

For educational purposes only — not investment advice. Cryptocurrencies are volatile and
speculative; past performance does not indicate future results.

© rebel Financial
