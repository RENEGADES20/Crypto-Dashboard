// Vercel serverless function: real historical market data from CoinGecko (free).
// Replaces the previously hardcoded/synthetic history charts. Heavily edge-cached
// (6h) because history barely moves and the free CoinGecko tier rate-limits bursts.
//
// Optional: set COINGECKO_API_KEY (free "Demo" key) in Vercel env vars for higher,
// more reliable rate limits. Works keyless too (slower: calls are spaced out).

export const config = { maxDuration: 60 };

const CG = 'https://api.coingecko.com/api/v3';
// The six majors the charts actually plot. Order = stacking order.
const COINS = [
  { sym: 'BTC',  id: 'bitcoin' },
  { sym: 'ETH',  id: 'ethereum' },
  { sym: 'XRP',  id: 'ripple' },
  { sym: 'SOL',  id: 'solana' },
  { sym: 'LINK', id: 'chainlink' },
  { sym: 'AVAX', id: 'avalanche-2' },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function headers() {
  const h = { Accept: 'application/json' };
  const k = process.env.COINGECKO_API_KEY;
  if (k) h['x-cg-demo-api-key'] = k;
  return h;
}
async function cg(path, tries = 4) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(CG + path, { headers: headers() });
    if (r.ok) return r.json();
    if (r.status === 429 && i < tries - 1) { await sleep(4000 * (i + 1)); continue; }
    throw new Error('CoinGecko ' + r.status + ' on ' + path);
  }
}

export default async function handler(req, res) {
  try {
    const hasKey = !!process.env.COINGECKO_API_KEY;
    const gap = hasKey ? 300 : 2000; // space out keyless calls to dodge 429s

    const g = await cg('/global');
    const total_now = g.data.total_market_cap.usd;
    const vol24h_now = g.data.total_volume.usd;

    // Fetch each coin's 1y daily history, spaced out.
    const data = {};
    for (let i = 0; i < COINS.length; i++) {
      const c = COINS[i];
      try {
        const m = await cg(`/coins/${c.id}/market_chart?vs_currency=usd&days=365`);
        data[c.sym] = {
          ts: m.market_caps.map((p) => p[0]),
          mcap: m.market_caps.map((p) => p[1]),
          price: m.prices.map((p) => p[1]),
        };
      } catch (e) { /* skip this coin; chart will show one fewer line */ }
      if (i < COINS.length - 1) await sleep(gap);
    }

    const syms = COINS.map((c) => c.sym).filter((s) => data[s]);
    if (!syms.length) throw new Error('no coin history fetched');

    // Align all series to a common length (last L daily points).
    const L = Math.min(...syms.map((s) => data[s].mcap.length));
    syms.forEach((s) => {
      const d = data[s];
      ['ts', 'mcap', 'price'].forEach((k) => { d[k] = d[k].slice(d[k].length - L); });
    });
    const ts = (data.BTC || data[syms[0]]).ts;

    // Basket sum per day, scaled so the latest point equals the real total market cap.
    const dailyTotal = [];
    for (let i = 0; i < L; i++) { let s = 0; syms.forEach((k) => { s += data[k].mcap[i] || 0; }); dailyTotal.push(s); }
    const scale = dailyTotal[L - 1] ? total_now / dailyTotal[L - 1] : 1;

    const fmtDay = (t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    const fmtMon = (t) => { const d = new Date(t); const mo = d.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }); return mo + " ’" + String(d.getUTCFullYear()).slice(2); };

    // 30-day daily slice.
    const n30 = Math.min(30, L), s30 = L - n30;
    const days30 = [], total30 = [], mcap30 = {};
    syms.forEach((s) => (mcap30[s] = []));
    for (let i = s30; i < L; i++) {
      days30.push(fmtDay(ts[i]));
      total30.push(+(dailyTotal[i] * scale / 1e12).toFixed(3));
      syms.forEach((s) => mcap30[s].push(+((data[s].mcap[i] || 0) / 1e9).toFixed(2)));
    }

    // 12 monthly samples across the year.
    const NM = 12, months = [], total1y = [], dom = {}, vol = {}, mcap1y = {};
    syms.forEach((s) => { dom[s] = []; vol[s] = []; mcap1y[s] = []; });
    for (let k = 0; k < NM; k++) {
      const j = Math.round(k * (L - 1) / (NM - 1));
      months.push(fmtMon(ts[j]));
      total1y.push(+(dailyTotal[j] * scale / 1e12).toFixed(3));
      const trueTotal = (dailyTotal[j] * scale) || 1;
      syms.forEach((s) => {
        dom[s].push(+((data[s].mcap[j] || 0) / trueTotal * 100).toFixed(2));
        mcap1y[s].push(+((data[s].mcap[j] || 0) / 1e9).toFixed(2));
        // annualized vol from daily log returns over the trailing ~30 days
        const a = Math.max(1, j - 30), rets = [];
        for (let i = a; i <= j; i++) { const p0 = data[s].price[i - 1], p1 = data[s].price[i]; if (p0 > 0 && p1 > 0) rets.push(Math.log(p1 / p0)); }
        let v = 0;
        if (rets.length > 1) {
          const mean = rets.reduce((x, y) => x + y, 0) / rets.length;
          const varr = rets.reduce((x, y) => x + (y - mean) * (y - mean), 0) / (rets.length - 1);
          v = Math.sqrt(varr) * Math.sqrt(365) * 100;
        }
        vol[s].push(+v.toFixed(0));
      });
    }

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      updated: new Date().toISOString(), source: 'CoinGecko',
      coins: syms, total_now, vol24h_now,
      days30, total30, mcap30, months, total1y, dom, vol, mcap1y,
    });
  } catch (e) {
    res.status(502).json({ error: 'history unavailable', detail: String(e) });
  }
}
