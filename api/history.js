// Vercel serverless function: real historical market data WITHOUT CoinGecko.
// Sources (both from the project's own API list):
//   - CoinMarketCap  : current market caps + total (same basis as the live top bar)
//   - DeFiLlama      : historical prices (one call for all coins, no rate limits)
// Market cap history is reconstructed as current_mcap * price_t / price_now
// (circulating supply changes slowly), so totals/dominance match the live KPIs.
// Edge-cached 6h.

export const config = { maxDuration: 30 };

const CMC = 'https://pro-api.coinmarketcap.com';
const LLAMA = 'https://coins.llama.fi';
const COINS = [
  { sym: 'BTC',  id: 'coingecko:bitcoin' },
  { sym: 'ETH',  id: 'coingecko:ethereum' },
  { sym: 'XRP',  id: 'coingecko:ripple' },
  { sym: 'SOL',  id: 'coingecko:solana' },
  { sym: 'LINK', id: 'coingecko:chainlink' },
  { sym: 'AVAX', id: 'coingecko:avalanche-2' },
];

async function jget(url, opts) {
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error(r.status + ' ' + url.split('?')[0]);
  return r.json();
}
// DeFiLlama chart -> { SYM: {ts:[ms...], price:[...]} } for coins that resolved
function parseChart(resp) {
  const out = {};
  COINS.forEach((c) => {
    const o = resp.coins && resp.coins[c.id];
    if (o && o.prices && o.prices.length) {
      out[c.sym] = { ts: o.prices.map((p) => p.timestamp * 1000), price: o.prices.map((p) => p.price) };
    }
  });
  return out;
}
const annVol = (logrets, k) => {
  if (logrets.length < 2) return 0;
  const m = logrets.reduce((a, b) => a + b, 0) / logrets.length;
  const v = logrets.reduce((a, b) => a + (b - m) * (b - m), 0) / (logrets.length - 1);
  return Math.sqrt(v) * Math.sqrt(k) * 100;
};

export default async function handler(req, res) {
  try {
    const key = process.env.CMC_API_KEY;
    if (!key) { res.status(500).json({ error: 'CMC_API_KEY not set' }); return; }

    // 1) CMC: current market caps for the majors + total (top-100 sum = same basis as top bar)
    const lst = await jget(`${CMC}/v1/cryptocurrency/listings/latest?start=1&limit=100&convert=USD`,
      { headers: { 'X-CMC_PRO_API_KEY': key, Accept: 'application/json' } });
    const bySym = {};
    lst.data.forEach((c) => { bySym[c.symbol] = c.quote.USD; });
    const cmcTotal = lst.data.reduce((s, c) => s + (c.quote.USD.market_cap || 0), 0);
    const vol24h_now = lst.data.reduce((s, c) => s + (c.quote.USD.volume_24h || 0), 0);
    const curMcap = {};
    COINS.forEach((c) => { curMcap[c.sym] = bySym[c.sym] ? bySym[c.sym].market_cap : null; });

    // 2) DeFiLlama: 1y weekly + 30d daily prices (one call each, all coins)
    const ids = COINS.map((c) => c.id).join(',');
    const wk = parseChart(await jget(`${LLAMA}/chart/${ids}?span=52&period=1w&searchWidth=600`, { headers: { Accept: 'application/json' } }));
    const dl = parseChart(await jget(`${LLAMA}/chart/${ids}?span=30&period=1d&searchWidth=600`, { headers: { Accept: 'application/json' } }));

    const syms = COINS.map((c) => c.sym).filter((s) => wk[s] && curMcap[s] != null);
    if (!syms.length) throw new Error('no price history');

    // reconstruct per-coin market cap from price ratio
    const mcapOf = (S, s, i) => curMcap[s] * (S[s].price[i] / S[s].price[S[s].price.length - 1]);

    const fmtDay = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const fmtMon = (t) => { const d = new Date(t); return d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) + " ’" + String(d.getUTCFullYear()).slice(2); };

    // ---- 1-year monthly (sample 12 points from the weekly series) ----
    const Lw = Math.min(...syms.map((s) => wk[s].price.length));
    const wts = wk[syms[0]].ts;
    const wTotal = [];
    for (let i = 0; i < Lw; i++) { let t = 0; syms.forEach((s) => (t += mcapOf(wk, s, i))); wTotal.push(t); }
    const wScale = wTotal[Lw - 1] ? cmcTotal / wTotal[Lw - 1] : 1;
    const NM = 12, months = [], total1y = [], dom = {}, vol = {}, mcap1y = {};
    syms.forEach((s) => { dom[s] = []; vol[s] = []; mcap1y[s] = []; });
    for (let k = 0; k < NM; k++) {
      const j = Math.round(k * (Lw - 1) / (NM - 1));
      months.push(fmtMon(wts[j]));
      total1y.push(+(wTotal[j] * wScale / 1e12).toFixed(3));
      const dispTotal = (wTotal[j] * wScale) || 1;
      const hi = Math.max(j, 6), lo = Math.max(0, hi - 6); // ≥6 weekly returns
      syms.forEach((s) => {
        const mc = mcapOf(wk, s, j);
        dom[s].push(+(mc / dispTotal * 100).toFixed(2));
        mcap1y[s].push(+(mc / 1e9).toFixed(2));
        const rets = [];
        for (let i = lo + 1; i <= hi; i++) { const p0 = wk[s].price[i - 1], p1 = wk[s].price[i]; if (p0 > 0 && p1 > 0) rets.push(Math.log(p1 / p0)); }
        vol[s].push(+annVol(rets, 52).toFixed(0));
      });
    }

    // ---- 30-day daily ----
    const dsyms = syms.filter((s) => dl[s]);
    const Ld = dsyms.length ? Math.min(...dsyms.map((s) => dl[s].price.length)) : 0;
    const days30 = [], total30 = [], mcap30 = {};
    dsyms.forEach((s) => (mcap30[s] = []));
    if (Ld) {
      const dts = dl[dsyms[0]].ts;
      const dTotal = [];
      for (let i = 0; i < Ld; i++) { let t = 0; dsyms.forEach((s) => (t += mcapOf(dl, s, i))); dTotal.push(t); }
      const dScale = dTotal[Ld - 1] ? cmcTotal / dTotal[Ld - 1] : 1;
      for (let i = 0; i < Ld; i++) {
        days30.push(fmtDay(dts[i]));
        total30.push(+(dTotal[i] * dScale / 1e12).toFixed(3));
        dsyms.forEach((s) => mcap30[s].push(+(mcapOf(dl, s, i) / 1e9).toFixed(2)));
      }
    }

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      updated: new Date().toISOString(), source: 'CoinMarketCap + DeFiLlama',
      coins: syms, total_now: cmcTotal, vol24h_now,
      days30, total30, mcap30, months, total1y, dom, vol, mcap1y,
    });
  } catch (e) {
    res.status(502).json({ error: 'history unavailable', detail: String(e) });
  }
}
