import { DESCS, esc, fmt, pct, fmtCap, fmtUsd, logoTag, uSectorMeta, USECTORS } from '../state.js';
import { UNI, U_TOTAL, U_SECTOT, uniAsset } from '../universe-store.js';
import { loadTV, renderTV, tvInterval } from '../tradingview.js';
import { switchTab } from '../router.js';

/* ══════════════ SECTORS ══════════════ */
export let sectorsInited=false,activeSector=null,activeAsset=null;
export let sdSort={key:'mc',dir:-1};
// universe assets in a sector: priced first (mcap desc), then unpriced (alpha)
export function secAssets(k){
  return UNI.filter(a=>a.sector===k).sort((a,b)=>(b.marketCap-a.marketCap)||a.ticker.localeCompare(b.ticker));
}
export function initSectors(){
  if(sectorsInited)return;sectorsInited=true;
  renderSectorGrid();
}
export function renderSectorGrid(){
  const grid=document.getElementById('sector-grid-el');
  if(!grid)return;grid.innerHTML='';
  Object.keys(USECTORS).filter(k=>secAssets(k).length).sort((a,b)=>(U_SECTOT[b]||0)-(U_SECTOT[a]||0)).forEach((k,idx)=>{
    const meta=uSectorMeta(k),items=secAssets(k),sm=U_SECTOT[k]||0;
    const share=U_TOTAL?sm/U_TOTAL*100:0;
    const logos=items.filter(a=>a.logo).slice(0,3).map(a=>logoTag(a,'coin-logo')).join('');
    const more=items.length>3?`<span class="sc-more">+${items.length-3}</span>`:'';
    const card=document.createElement('div');
    card.className='sc-card';card.style.borderTopColor=meta.color;card.style.animationDelay=(idx*40)+'ms';
    card.innerHTML=`
      <div class="sc-top">
        <div class="sc-name" style="color:${meta.color}">${meta.label}<span class="sc-cnt" style="background:${meta.bg};color:${meta.color}">${items.length}</span></div>
        <div class="sc-logos">${logos}${more}</div>
      </div>
      <div class="sc-mcl">Market Cap</div>
      <div class="sc-mc num-anim">${fmtCap(sm)}</div>
      <div class="sc-bar"><div class="sc-bar-fill" style="background:${meta.color}"></div></div>
      <div class="sc-row2"><span><b>${share<0.1?'<0.1':share.toFixed(1)}%</b> of market</span><span class="sc-view" style="color:${meta.color}">View →</span></div>
      <div class="sc-desc">${meta.desc}</div>`;
    card.onclick=()=>openSector(k);grid.appendChild(card);
    requestAnimationFrame(()=>{const f=card.querySelector('.sc-bar-fill');if(f)f.style.width=Math.max(2,Math.min(100,share)).toFixed(1)+'%';});
  });
}
export function goGrid(){activeSector=null;activeAsset=null;document.getElementById('sv-grid').classList.remove('hidden');document.getElementById('sv-sector').classList.add('hidden');document.getElementById('sv-asset').classList.add('hidden');}
export function openSector(k){
  activeSector=k;sdSort={key:'mc',dir:-1};
  const meta=uSectorMeta(k),items=secAssets(k),sm=U_SECTOT[k]||0;
  const priced=items.filter(a=>a.marketCap).length;
  document.getElementById('crumb-sector').textContent=meta.label;
  document.getElementById('sd-hdr-el').innerHTML=`
    <div class="sd-title" style="color:${meta.color}">${meta.label}</div>
    <div class="sd-desc-text">${meta.desc}</div>
    <div class="sd-stats">
      <div><div class="sd-stat-l">Sector Mkt Cap</div><div class="sd-stat-v">${fmtCap(sm)}</div></div>
      <div><div class="sd-stat-l">Market Share</div><div class="sd-stat-v">${pct(sm,U_TOTAL)}</div></div>
      <div><div class="sd-stat-l">Assets</div><div class="sd-stat-v">${items.length}</div></div>
      <div><div class="sd-stat-l">Priced</div><div class="sd-stat-v">${priced}</div></div>
      <div><div class="sd-stat-l">Largest</div><div class="sd-stat-v" style="color:${meta.color}">${items[0]?items[0].ticker:'—'}</div></div>
    </div>`;
  renderSectorTable(k);
  document.getElementById('sv-grid').classList.add('hidden');
  document.getElementById('sv-sector').classList.remove('hidden');
  document.getElementById('sv-asset').classList.add('hidden');
}
export function setSdSort(key){if(sdSort.key===key)sdSort.dir*=-1;else sdSort={key,dir:key==='name'?1:-1};renderSectorTable(activeSector);}
export function renderSectorTable(k){
  const meta=uSectorMeta(k),sm=U_SECTOT[k]||0;
  let items=secAssets(k).slice();
  const d=sdSort.dir;
  items.sort((a,b)=>{
    if(sdSort.key==='name')return d*a.ticker.localeCompare(b.ticker);
    if(sdSort.key==='px')return d*(((a.price||-1))-((b.price||-1)));
    if(sdSort.key==='chg')return d*(((a.change24h==null?-1e9:a.change24h))-((b.change24h==null?-1e9:b.change24h)));
    return d*((a.marketCap||0)-(b.marketCap||0));
  });
  const arrow=key=>sdSort.key===key?(sdSort.dir<0?' ▾':' ▴'):'';
  const tbl=document.getElementById('sd-table');
  tbl.innerHTML=`<thead><tr><th style="width:28px">#</th>
    <th style="cursor:pointer" onclick="setSdSort('name')">Asset${arrow('name')}</th>
    <th>Thesis</th>
    <th class="r" style="cursor:pointer" onclick="setSdSort('mc')">Mkt Cap${arrow('mc')}</th>
    <th class="r" style="cursor:pointer" onclick="setSdSort('px')">Price${arrow('px')}</th>
    <th class="r" style="cursor:pointer" onclick="setSdSort('chg')">24h${arrow('chg')}</th>
    <th class="r" style="cursor:pointer" onclick="setSdSort('mc')">Sector Share${arrow('mc')}</th></tr></thead>`;
  const tbody=document.createElement('tbody');
  items.forEach((a,i)=>{
    const thesis=(DESCS[a.ticker]||a.summary||'').split('. ')[0];
    const sh=sm?a.marketCap/sm*100:0;
    const chg=a.change24h,chgTxt=chg==null?'—':(chg>=0?'+':'')+chg.toFixed(1)+'%',chgCol=chg==null?'#b0bac8':(chg>=0?'#16c784':'#ea3943');
    const tr=document.createElement('tr');tr.className='fade-row';tr.style.animationDelay=Math.min(i*16,400)+'ms';
    tr.innerHTML=`<td><span class="rk">${i+1}</span></td>
      <td><div class="ac">${logoTag(a,'coin-logo')}
        <div><div class="asym">${esc(a.ticker)}</div><div class="aname-s">${esc(a.name)}</div></div></div></td>
      <td style="font-size:11px;color:#58667e;max-width:340px;line-height:1.45">${esc(thesis)}${thesis?'.':'—'}</td>
      <td class="r mono">${a.marketCap?fmt(a.marketCap):'—'}</td>
      <td class="r mono ${a.price==null?'px-na':''}">${a.price==null?'—':fmtUsd(a.price)}</td>
      <td class="r mono" style="color:${chgCol}">${chgTxt}</td>
      <td class="r"><div class="wbar-wrap"><div class="wbar"><div class="wbar-fill" style="width:${Math.min(40,sh*0.8).toFixed(0)}px;background:${meta.color}"></div></div>
        <span class="wpct">${a.marketCap?sh.toFixed(1)+'%':'—'}</span></div></td>`;
    tr.onclick=()=>openAsset(a.ticker);tbody.appendChild(tr);
  });
  tbl.appendChild(tbody);
}
export function goSector(){document.getElementById('sv-grid').classList.add('hidden');document.getElementById('sv-sector').classList.remove('hidden');document.getElementById('sv-asset').classList.add('hidden');}
// Where the current asset view was opened from, so "back" returns to the right place.
export let assetOrigin='sector';
export function backFromAsset(){
  if(assetOrigin==='dashboard'){goGrid();switchTab('dashboard');}
  else goSector();
}
export function assetNarrative(a,meta){
  const overview=DESCS[a.ticker]||a.summary||'This asset is part of the Anchorage-supported digital asset universe.';
  const secShareTxt=a.marketCap?pct(a.marketCap,U_SECTOT[a.sector]||1):'—';
  const shareTxt=a.marketCap?pct(a.marketCap,U_TOTAL):'an unpriced position';
  const role=a.marketCap
    ? `${a.name} sits in the ${meta.label} category, which represents ${pct(U_SECTOT[a.sector]||0,U_TOTAL)} of the universe market cap. Within that category, ${a.ticker} accounts for ${secShareTxt}, making it ${a.rank&&a.rank<=10?'one of the primary market-share drivers':'a smaller but still relevant contributor'} in the sector view.`
    : `${a.name} sits in the ${meta.label} category. It currently has no live market cap in the snapshot — typically an early-stage, multi-chain, or non-tradeable listing — so it is shown for classification completeness rather than as a sized position.`;
  return `
    <div class="about-section">
      <div class="about-section-title">Overview</div>
      <div>${esc(overview)}</div>
    </div>
    <div class="about-section">
      <div class="about-section-title">Market Role</div>
      <div>${esc(role)}</div>
    </div>
    <div class="about-section">
      <div class="about-section-title">What to Watch</div>
      <div>For client education, focus on market cap rank, liquidity, sector concentration, and how the asset's use case connects to real network activity. Current market share is ${shareTxt}; changes in this share help show whether attention and capital are consolidating into larger networks or rotating toward smaller thematic assets.</div>
    </div>
    <div class="about-section">
      <div class="about-section-title">Client Framing</div>
      <div>This page is a market-structure explainer: price is only one signal, while market cap, dominance, sector share and the asset's role in the crypto stack give a more complete picture of why the asset matters.</div>
    </div>`;
}
export function openAsset(ticker,origin){
  activeAsset=ticker;
  assetOrigin=origin||'sector';
  const a=uniAsset(ticker);
  if(!a)return;
  const meta=uSectorMeta(a.sector);
  document.getElementById('crumb-back-sector').textContent=assetOrigin==='dashboard'?'Dashboard':meta.label;
  document.getElementById('crumb-asset').textContent=`${a.ticker} — ${a.name}`;
  const pxTxt=a.price==null?'—':fmtUsd(a.price);
  const chg=a.change24h;
  const chgPill=chg==null?'':`<span class="pill" style="background:${chg>=0?'#e7f7ee':'#fdeaec'};color:${chg>=0?'#16a34a':'#ea3943'}">${chg>=0?'+':''}${chg.toFixed(1)}% 24h</span>`;
  document.getElementById('asset-hdr-el').innerHTML=`
    <div class="asset-hdr-top">
      <div class="asset-name-row">
        ${logoTag(a,'coin-logo lg')}
        <div><div class="asset-ticker">${esc(a.ticker)}</div><div class="asset-fullname">${esc(a.name)}</div></div>
      </div>
      <div class="asset-price-col"><div class="asset-price ${a.price==null?'px-na':''}">${pxTxt}</div><div class="asset-mc">Market Cap: ${fmtCap(a.marketCap)}</div></div>
    </div>
    <div class="asset-pills">
      <span class="pill" style="background:${meta.bg};color:${meta.color}"><span class="pdot" style="background:${meta.color}"></span>${meta.label}</span>
      ${a.rank?`<span class="pill rank-pill">Rank #${a.rank} by Mkt Cap</span>`:''}
      ${a.marketCap?`<span class="pill rank-pill">Market Share: ${pct(a.marketCap,U_TOTAL)}</span>`:'<span class="pill rank-pill">Unpriced listing</span>'}
      ${chgPill}
      ${a.kept?'<span class="pill" style="background:#e7f7ee;color:#0f9d58"><span class="pdot" style="background:#0f9d58"></span>In kept 54</span>':''}
    </div>`;
  document.getElementById('asset-about').innerHTML=`<div class="about-title">Asset Overview</div><div class="about-text">${assetNarrative(a,meta)}</div>`;
  document.getElementById('asset-stats').innerHTML=`<div class="about-title" style="margin-bottom:12px">Key Statistics</div>
    ${[['Ticker',a.ticker],['Full Name',esc(a.name)],['Sector',meta.label],['Market Cap',fmtCap(a.marketCap)],['Price (USD)',pxTxt],['24h Change',chg==null?'—':(chg>=0?'+':'')+chg.toFixed(2)+'%'],['Market Cap Rank',a.rank?`#${a.rank}`:'—'],['Market Share',a.marketCap?pct(a.marketCap,U_TOTAL):'—'],['Sector Share',a.marketCap?pct(a.marketCap,U_SECTOT[a.sector]||1):'—'],['Chains listed',a.chains],['In kept 54',a.kept?'Yes':'No']]
      .map(([l,v])=>`<div class="stat-row"><span class="stat-lbl">${l}</span><span class="stat-val">${v}</span></div>`).join('')}`;
  document.getElementById('sv-grid').classList.add('hidden');
  document.getElementById('sv-sector').classList.add('hidden');
  document.getElementById('sv-asset').classList.remove('hidden');
  document.getElementById('tv-asset').innerHTML='';
  loadTV(()=>renderTV(ticker,tvInterval,'tv-asset'));
  window.scrollTo({top:0,behavior:'smooth'});
}
