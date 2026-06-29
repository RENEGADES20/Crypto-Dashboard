import { OVERVIEW_ASSETS } from './data/overview-assets.js';
import { cleanName, fmt, fmtUsd, animVal } from './state.js';

// ── de-duplicate OVERVIEW_ASSETS to one row per ticker (multichain folded) ──
export function buildUniverse(){
  const by=new Map();
  (typeof OVERVIEW_ASSETS!=='undefined'?OVERVIEW_ASSETS:[]).forEach(a=>{
    if(!by.has(a.ticker))by.set(a.ticker,[]);by.get(a.ticker).push(a);
  });
  const out=[];
  by.forEach((list,tk)=>{
    const rep=list.find(x=>x.marketCap)||list.find(x=>x.id===tk)||list[0];
    out.push({ticker:tk,name:cleanName(rep.name),sector:rep.sector||'Other',
      marketCap:rep.marketCap||0,logo:rep.logo,kept:list.some(x=>x.kept),
      summary:rep.summary||'',chains:list.length,price:null,change24h:null});
  });
  return out;
}
export const UNI=buildUniverse();
export const UNI_BY_TKR={};UNI.forEach(a=>UNI_BY_TKR[a.ticker]=a);
export function uniAsset(tk){return UNI_BY_TKR[tk];}

export let U_TOTAL=0,U_BTC=0,U_ETH=0,U_SOL=0,U_EX=0,U_PRICED=0;
export const U_SECTOT={};
export function rankUniverse(){UNI.sort((a,b)=>b.marketCap-a.marketCap);let r=0;UNI.forEach(a=>a.rank=a.marketCap?(++r):null);}
export function recomputeUniverse(){
  U_TOTAL=0;U_PRICED=0;Object.keys(U_SECTOT).forEach(k=>delete U_SECTOT[k]);
  UNI.forEach(a=>{U_TOTAL+=a.marketCap;if(a.marketCap)U_PRICED++;U_SECTOT[a.sector]=(U_SECTOT[a.sector]||0)+a.marketCap;});
  U_BTC=(uniAsset('BTC')||{}).marketCap||0;
  U_ETH=(uniAsset('ETH')||{}).marketCap||0;
  U_SOL=(uniAsset('SOL')||{}).marketCap||0;
  U_EX=U_TOTAL-U_BTC-U_ETH;
}
rankUniverse();recomputeUniverse();

// ── topbar + KPI fill (snapshot on load; refreshLiveData() re-runs after each poll) ──
export function paintHeader(){
  animVal(document.getElementById('hdr-tot'),U_TOTAL,fmt);
  animVal(document.getElementById('k-total'),U_TOTAL,fmt);
  animVal(document.getElementById('k-btc'),U_TOTAL?U_BTC/U_TOTAL*100:0,v=>v.toFixed(1)+'%');
  animVal(document.getElementById('hdr-dom'),U_TOTAL?U_BTC/U_TOTAL*100:0,v=>v.toFixed(1)+'%');
  animVal(document.getElementById('k-eth'),U_TOTAL?U_ETH/U_TOTAL*100:0,v=>v.toFixed(1)+'%');
  animVal(document.getElementById('k-ex'),U_EX,fmt);
  const sc=document.getElementById('k-sectors');if(sc)sc.textContent=new Set(UNI.map(a=>a.sector)).size;
  const note=document.getElementById('k-total-note');if(note)note.textContent=`${UNI.length} assets · ${U_PRICED} priced`;
  const setPx=(id,a)=>{const el=document.getElementById(id);if(el)el.textContent=a&&a.price!=null?fmtUsd(a.price):'—';};
  setPx('hdr-btc-px',uniAsset('BTC'));setPx('hdr-eth-px',uniAsset('ETH'));setPx('hdr-sol-px',uniAsset('SOL'));
}
// LIVE light state (green pulse when /api/quotes succeeds, red when it fails)
export function setLiveState(iso,ok){
  const dot=document.getElementById('live-dot'),lbl=document.getElementById('live-lbl');
  if(!dot)return;
  if(ok){
    dot.classList.add('on');dot.classList.remove('off');
    dot.title='Live · CoinMarketCap · updated '+(iso?new Date(iso).toLocaleTimeString():'now');
    if(lbl){lbl.textContent='LIVE';lbl.style.color='#16a34a';}
  }else{
    dot.classList.remove('on');dot.classList.add('off');
    dot.title='Live feed unavailable — showing last snapshot';
    if(lbl){lbl.textContent='SNAPSHOT';lbl.style.color='#ea3943';}
  }
}
