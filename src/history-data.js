import { buildMktCapChart, buildCompChart, buildVolChart, mktCapPeriod } from './charts.js';
import { overviewInited } from './views/dashboard.js';

export let MONTHS=[];
export let CMC_DAYS_30=[];
export let CMC_MC_30D=[], CMC_MC_1Y=[];
export let DOM={}, EX_TOT=[], EX_NORM={}, EX_OTHERS=[], ALL_OTHERS=[];
export let VOL={};
export let COIN_MCAP_30={}, COIN_MCAP_1Y={};   // per-coin market cap ($B) for the overlay
export let HIST_VOL24H=null, HIST_UPDATED=null, HIST_SOURCE='DeFiLlama';
/* ===== Historical charts: real data from /api/history (CMC + DeFiLlama, cached ~6h) ===== */
export function histStamp(){
  const src=HIST_SOURCE||'DeFiLlama';
  if(!HIST_UPDATED)return'Source: '+src;
  const t=new Date(HIST_UPDATED);
  return'Source: '+src+' · as of '+t.toLocaleDateString('en-US',{month:'short',day:'numeric'})+' '+t.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
}
export function setHistStamp(ok){
  const note=ok?histStamp():'Historical data temporarily unavailable';
  const m=document.getElementById('mktcap-sub');if(m)m.textContent='Top assets, scaled to total market cap · '+note;
  const v=document.getElementById('vol-sub');if(v)v.textContent='Annualized volatility from weekly returns · '+note;
  if(!ok){const c=document.getElementById('comp-note');if(c)c.textContent=note;}
}
export function applyHistory(h){
  MONTHS=h.months;CMC_DAYS_30=h.days30;
  CMC_MC_30D=h.total30;CMC_MC_1Y=h.total1y;
  DOM=h.dom||{};VOL=h.vol||{};
  COIN_MCAP_30=h.mcap30||{};COIN_MCAP_1Y=h.mcap1y||{};
  HIST_VOL24H=h.vol24h_now;HIST_UPDATED=h.updated;HIST_SOURCE=h.source||'DeFiLlama';
  // derive ex-BTC/ETH normalized shares (same formulas as before, now from real DOM)
  const g=(o,k,i)=>((o[k]&&o[k][i])||0);
  EX_TOT=MONTHS.map((_,i)=>+(100-g(DOM,'BTC',i)-g(DOM,'ETH',i)).toFixed(2));
  EX_NORM={};['XRP','SOL','LINK','AVAX'].forEach(c=>{EX_NORM[c]=MONTHS.map((_,i)=>EX_TOT[i]?+(g(DOM,c,i)/EX_TOT[i]*100).toFixed(1):0);});
  EX_OTHERS=MONTHS.map((_,i)=>Math.max(0,+(100-(EX_NORM.XRP[i]||0)-(EX_NORM.SOL[i]||0)-(EX_NORM.LINK[i]||0)-(EX_NORM.AVAX[i]||0)).toFixed(1)));
  ALL_OTHERS=MONTHS.map((_,i)=>Math.max(0,+(100-g(DOM,'BTC',i)-g(DOM,'ETH',i)-g(DOM,'XRP',i)-g(DOM,'SOL',i)).toFixed(1)));
  setHistStamp(true);
  if(overviewInited){buildMktCapChart(mktCapPeriod);buildCompChart();buildVolChart();}
}
export async function loadHistory(){
  try{
    const r=await fetch('/api/history',{cache:'no-store'});
    if(!r.ok)throw new Error('http '+r.status);
    const h=await r.json();
    if(!h.months||!h.months.length)throw new Error('empty');
    applyHistory(h);
  }catch(e){ setHistStamp(false); }
}
