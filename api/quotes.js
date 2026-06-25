// Vercel serverless function: proxy CoinMarketCap "listings/latest" so the API
// key stays server-side. Edge-cached for 300s to stay under the free-tier credit
// budget (~288 calls/day) while the browser polls every 60s.
//
// Env var required (set in Vercel → Settings → Environment Variables):
//   CMC_API_KEY = <your CoinMarketCap Pro API key>

const CMC_URL =
  "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest" +
  "?start=1&limit=100&convert=USD";

export default async function handler(req, res) {
  const apiKey = process.env.CMC_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "CMC_API_KEY environment variable is not set." });
    return;
  }

  try {
    const cmcRes = await fetch(CMC_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
    });

    if (!cmcRes.ok) {
      const text = await cmcRes.text();
      res.status(502).json({
        error: `CoinMarketCap returned ${cmcRes.status}`,
        detail: text.slice(0, 300),
      });
      return;
    }

    const json = await cmcRes.json();
    const list = Array.isArray(json && json.data) ? json.data : [];

    // Trim to only what the dashboard needs.
    const data = list.map((c) => {
      const usd = (c.quote && c.quote.USD) || {};
      return {
        symbol: c.symbol,
        name: c.name,
        price: usd.price,
        market_cap: usd.market_cap,
        percent_change_24h: usd.percent_change_24h,
      };
    });

    // Edge cache: serve cached for 300s, allow stale-while-revalidate for 600s more.
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ updated: new Date().toISOString(), data });
  } catch (err) {
    res.status(502).json({ error: "Failed to reach CoinMarketCap", detail: String(err) });
  }
}
