import { DATA, TICKER_ASSETS, SPARKLINES, COIN_COLORS, LIVE_CHANGE, sparkSVG, esc, fmt, fmtUsd, logoTag, uSectorMeta } from '../state.js';
import { UNI, U_TOTAL } from '../universe-store.js';
import { buildDonut, buildMktCapChart, buildMktCapSelect, buildCompTog, buildCompChart, buildVolTog, buildVolChart } from '../charts.js';
import { buildKlineDropdown, loadTV, renderTV } from '../tradingview.js';
import { switchTab } from '../router.js';
import { openAsset } from './sectors.js';

export let overviewInited=false;
export function initOverview(){
  if(overviewInited)return;overviewInited=true;
  buildAssetStrip();
  buildMarketTable();
  buildMktCapSelect();
  buildDonut('ex');
  buildMktCapChart('30d');
  buildCompTog();buildCompChart();
  buildVolTog();buildVolChart();
  buildKlineDropdown();
  loadTV(()=>renderTV('BTC','W'));
}

/* ── Asset ticker strip ── */
export function buildAssetStrip(){
  const el=document.getElementById('asset-strip');
  if(!el)return;
  el.innerHTML='';
  TICKER_ASSETS.forEach(({t,pct:pcStatic,pos:posStatic})=>{
    const d=DATA.find(x=>x.t===t);
    if(!d)return;
    // Prefer live 24h change; fall back to the static seed value.
    const live=LIVE_CHANGE[t];
    const pos=(live!=null)?live>=0:posStatic;
    const pc=(live!=null)?(live>=0?'+':'')+live.toFixed(1)+'%':pcStatic;
    const color=pos?'#16c784':'#ea3943';
    const card=document.createElement('div');
    card.className='asc';
    card.onclick=()=>{switchTab('sectors');setTimeout(()=>openAsset(t,'dashboard'),80);};
    card.innerHTML=`<div>
      <div class="asc-nm">${d.n}</div>
      <div class="asc-sym" style="color:${COIN_COLORS[t]||'#0d1421'}">${t}</div>
      <div class="asc-pr">${d.p}</div>
      <div class="asc-pc" style="color:${color}">${pc}</div>
    </div>
    <div class="asc-spark">${sparkSVG(SPARKLINES[t],color)}</div>`;
    el.appendChild(card);
  });
}
export function buildMarketTable(){
  const tbl=document.getElementById('market-table');
  if(!tbl)return;
  tbl.innerHTML='<thead><tr><th style="width:34px">#</th><th>Asset</th><th class="r">Price</th><th class="r">24h</th><th class="r">Market Cap</th><th class="r">Market Share</th><th class="r">Sector</th></tr></thead>';
  const tbody=document.createElement('tbody');
  UNI.filter(a=>a.marketCap).slice(0,12).forEach((a,i)=>{
    const meta=uSectorMeta(a.sector),share=a.marketCap/U_TOTAL*100;
    const chg=a.change24h,chgTxt=chg==null?'—':(chg>=0?'+':'')+chg.toFixed(1)+'%',chgCol=chg==null?'#b0bac8':(chg>=0?'#16c784':'#ea3943');
    const tr=document.createElement('tr');tr.className='fade-row';tr.style.animationDelay=(i*28)+'ms';
    tr.innerHTML=`<td><span class="rk">${a.rank}</span></td>
      <td><div class="ac">${logoTag(a,'coin-logo')}
        <div><div class="asym">${esc(a.ticker)}</div><div class="aname-s">${esc(a.name)}</div></div></div></td>
      <td class="r mono ${a.price==null?'px-na':''}">${a.price==null?'—':fmtUsd(a.price)}</td>
      <td class="r mono" style="color:${chgCol}">${chgTxt}</td>
      <td class="r mono">${fmt(a.marketCap)}</td>
      <td class="r"><div class="share-cell"><div class="share-bar"><div class="share-fill" style="width:${Math.min(100,share).toFixed(1)}%;background:${meta.color}"></div></div><span class="wpct">${share.toFixed(1)}%</span></div></td>
      <td class="r" style="font-size:11px;color:${meta.color};font-weight:700">${meta.label}</td>`;
    tr.onclick=()=>{switchTab('sectors');setTimeout(()=>openAsset(a.ticker,'dashboard'),60);};
    tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
}
