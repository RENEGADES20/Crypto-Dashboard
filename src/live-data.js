import { DATA, recomputeAggregates, LIVE_CHANGE } from './state.js';
import { uniAsset, rankUniverse, recomputeUniverse, paintHeader, setLiveState } from './universe-store.js';
import { overviewInited, buildAssetStrip, buildMarketTable } from './views/dashboard.js';
import { buildDonut, donutMode } from './charts.js';
import { sectorsInited, activeSector, renderSectorGrid, renderSectorTable } from './views/sectors.js';

/* ============== LIVE DATA (CoinMarketCap via /api/quotes) ============== */
// Format a USD price to match the dashboard's existing style.
export function fmtPrice(p){
  if(!isFinite(p))return'—';
  if(p>=1000)return'$'+p.toLocaleString('en-US',{maximumFractionDigits:0});
  if(p>=1)return'$'+p.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
  if(p>=0.01)return'$'+p.toFixed(4);
  return'$'+p.toFixed(p>=0.0001?4:6);
}

// Re-render the Sectors tab in place after a live update (only the visible view).
export function refreshSectorsLive(){
  if(!sectorsInited)return;
  const gridVisible=!document.getElementById('sv-grid').classList.contains('hidden');
  const sectorVisible=!document.getElementById('sv-sector').classList.contains('hidden');
  if(gridVisible)renderSectorGrid();
  else if(sectorVisible&&activeSector)renderSectorTable(activeSector);
}

// Overlay live CMC numbers (top-100 from /api/quotes) onto the universe (by ticker)
// and the illustrative DATA[] (by symbol), then re-rank, recompute and re-render.
export async function refreshLiveData(){
  try{
    const res=await fetch('/api/quotes',{cache:'no-store'});
    if(!res.ok)throw new Error('HTTP '+res.status);
    const payload=await res.json();
    const rows=(payload&&payload.data)||[];
    if(!rows.length)throw new Error('empty payload');
    let hits=0;
    rows.forEach(c=>{
      // universe overlay (drives Dashboard + Sectors + topbar)
      const u=uniAsset(c.symbol);
      if(u){
        if(typeof c.market_cap==='number'&&c.market_cap>0)u.marketCap=c.market_cap;
        if(typeof c.price==='number')u.price=c.price;
        if(typeof c.percent_change_24h==='number')u.change24h=c.percent_change_24h;
        hits++;
      }
      // illustrative DATA overlay (ticker strip + chart picker)
      const d=DATA.find(x=>x.t===c.symbol);
      if(d){
        if(typeof c.market_cap==='number'&&c.market_cap>0)d.m=c.market_cap;
        if(typeof c.price==='number')d.p=fmtPrice(c.price);
      }
      if(typeof c.percent_change_24h==='number')LIVE_CHANGE[c.symbol]=c.percent_change_24h;
    });
    if(!hits)throw new Error('no matching assets');
    rankUniverse();recomputeUniverse();
    DATA.sort((a,b)=>b.m-a.m);DATA.forEach((d,i)=>d.r=i+1);recomputeAggregates();
    paintHeader();
    if(overviewInited){buildAssetStrip();buildMarketTable();buildDonut(donutMode);}
    refreshSectorsLive();
    setLiveState(payload.updated,true);
  }catch(err){
    setLiveState(null,false);
  }
}
