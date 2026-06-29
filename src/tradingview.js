import { TV, SECTOR_ORDER, uSectorMeta } from './state.js';
import { uniAsset } from './universe-store.js';

export let tvInterval='W',tvTicker='BTC';
/* ── TradingView ── */
export function buildKlineDropdown(){
  const sel=document.getElementById('kline-sel');
  // chartable assets = those with a TradingView symbol mapping, grouped by universe sector
  const bySec={};
  Object.keys(TV).forEach(tk=>{const a=uniAsset(tk);if(!a)return;(bySec[a.sector]=bySec[a.sector]||[]).push(a);});
  SECTOR_ORDER.forEach(sk=>{
    if(!bySec[sk])return;
    const og=document.createElement('optgroup');og.label=uSectorMeta(sk).label;
    bySec[sk].sort((a,b)=>b.marketCap-a.marketCap).forEach(a=>{
      const o=document.createElement('option');o.value=a.ticker;o.textContent=`${a.ticker}  —  ${a.name}`;og.appendChild(o);
    });sel.appendChild(og);
  });
}
export let tvScriptLoaded=false;
export function loadTV(cb){
  if(typeof TradingView!=='undefined'){cb();return;}
  if(tvScriptLoaded){setTimeout(()=>loadTV(cb),200);return;}
  tvScriptLoaded=true;
  const s=document.createElement('script');s.src='https://s3.tradingview.com/tv.js';s.onload=cb;document.head.appendChild(s);
}
export function renderTV(ticker,interval,containerId='tv-embed'){
  tvTicker=ticker;tvInterval=interval;
  if(containerId==='tv-embed')document.getElementById('kline-sel').value=ticker;
  const c=document.getElementById(containerId);c.innerHTML=`<div class="tv-placeholder">Loading ${ticker} price chart...</div>`;
  try{new TradingView.widget({container_id:containerId,symbol:TV[ticker]||`BINANCE:${ticker}USDT`,interval,autosize:true,theme:'light',style:'1',locale:'en',toolbar_bg:'#ffffff',enable_publishing:false,allow_symbol_change:false,save_image:false,withdateranges:true});}
  catch(e){c.innerHTML=`<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#8a96aa;font-size:12px">Chart unavailable for ${ticker}</div>`;}
}
export function klineChange(){renderTV(document.getElementById('kline-sel').value,tvInterval);}
export function setIv(iv,el){document.querySelectorAll('.kiv').forEach(b=>b.classList.toggle('on',b===el));tvInterval=iv;renderTV(tvTicker,iv);}
