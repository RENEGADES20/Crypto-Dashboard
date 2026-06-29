import { DATA, COIN_COLORS, ALL_COINS, coinColor, fmt, pct, uSectorMeta, TOOLTIP_BASE } from './state.js';
import { UNI } from './universe-store.js';
import { MONTHS, CMC_DAYS_30, CMC_MC_30D, CMC_MC_1Y, DOM, EX_NORM, EX_OTHERS, ALL_OTHERS, VOL, COIN_MCAP_30, COIN_MCAP_1Y, HIST_VOL24H } from './history-data.js';
import { switchTab } from './router.js';
import { openSector } from './views/sectors.js';

export let donutChart=null,mktCapChart=null,compChart=null,volChart=null;
export const activeVolCoins=new Set(['BTC','ETH','SOL','XRP']);
export const activeCompCoins=new Set(['BTC','ETH','XRP','SOL','LINK','AVAX']);
export let donutMode='ex',mktCapPeriod='30d',mktCapCoin='TOTAL',compMode='ex';
export function buildMktCapSelect(){
  const sel=document.getElementById('mktcap-coin');
  if(!sel)return;
  sel.innerHTML='<option value="TOTAL">Total Market</option>';
  DATA.forEach(a=>{
    const o=document.createElement('option');
    o.value=a.t;o.textContent=`${a.t} - ${a.n}`;
    sel.appendChild(o);
  });
  sel.value=mktCapCoin;
}

/* ── Donut: sector market share over the 13-sector universe ── */
export function buildDonut(mode){
  donutMode=mode;
  const ex=mode==='ex';
  const tots={};
  UNI.forEach(a=>{if(!a.marketCap)return;if(ex&&(a.ticker==='BTC'||a.ticker==='ETH'))return;tots[a.sector]=(tots[a.sector]||0)+a.marketCap;});
  const base=Object.values(tots).reduce((s,v)=>s+v,0)||1;
  const sk=Object.keys(tots).sort((a,b)=>tots[b]-tots[a]);
  const ctr=document.querySelector('#pane-dashboard .donut-ctr');
  if(ctr){ctr.querySelector('.donut-cv').textContent=sk.length;ctr.querySelector('.donut-cl').textContent='Sectors';}
  if(donutChart){donutChart.destroy();donutChart=null;}
  donutChart=new Chart(document.getElementById('donut-canvas'),{
    type:'doughnut',
    data:{labels:sk.map(k=>uSectorMeta(k).label),datasets:[{
      data:sk.map(k=>tots[k]||0),
      backgroundColor:sk.map(k=>uSectorMeta(k).color+'cc'),
      borderColor:sk.map(k=>uSectorMeta(k).color),
      borderWidth:1.5,hoverOffset:6,
    }]},
    options:{cutout:'68%',maintainAspectRatio:false,animation:{duration:450},plugins:{
      legend:{display:false},
      tooltip:{mode:'nearest',intersect:true,backgroundColor:'#fff',titleColor:'#0d1421',titleFont:{size:11,weight:'700'},bodyColor:'#3d4f6e',bodyFont:{size:11},borderColor:'#e8ecf2',borderWidth:1,padding:{x:12,y:8},boxPadding:4,usePointStyle:true,pointStyle:'circle',
        callbacks:{title:ctx=>uSectorMeta(sk[ctx[0].dataIndex]).label,label:ctx=>{const m=tots[sk[ctx.dataIndex]]||0;return`  ${fmt(m)}  ·  ${pct(m,base)}`;}}}
    }}
  });
  const leg=document.getElementById('donut-legend');leg.innerHTML='';
  sk.forEach(k=>{
    const m=tots[k]||0,meta=uSectorMeta(k);
    const r=document.createElement('div');r.className='dl-row';
    r.onclick=()=>{switchTab('sectors');setTimeout(()=>openSector(k),60)};
    r.innerHTML=`<div class="dl-left"><div class="dl-dot" style="background:${meta.color}"></div>
      <div><div class="dl-name">${meta.label}</div>
      <div class="dl-sub">${fmt(m)} · ${pct(m,base)}</div></div></div>`;
    leg.appendChild(r);
  });
}
export function setDonutMode(m,btn){document.querySelectorAll('#donut-tog .tog-btn').forEach(b=>b.classList.toggle('on',b===btn));buildDonut(m);}

/* ── CMC Market Cap chart ── */
export function buildMktCapChart(period){
  mktCapPeriod=period;
  const labels=period==='30d'?CMC_DAYS_30:MONTHS;
  const mc=period==='30d'?CMC_MC_30D:CMC_MC_1Y;
  if(!mc||!mc.length){document.getElementById('mktcap-big').textContent='Loading…';document.getElementById('mktcap-vol').textContent='—';return;}
  const lastV=mc[mc.length-1];
  document.getElementById('mktcap-big').textContent='$'+lastV.toFixed(2)+'T';
  document.getElementById('mktcap-vol').textContent=HIST_VOL24H?fmt(HIST_VOL24H):'—';
  const datasets=[{label:'Total Market Cap',data:mc,fill:true,tension:.3,borderWidth:1.8,pointRadius:0,pointHoverRadius:5,yAxisID:'y',
    borderColor:'#16c784',backgroundColor:'rgba(22,199,132,.08)'}];
  if(mktCapCoin!=='TOTAL'){
    const ov=(period==='30d'?COIN_MCAP_30:COIN_MCAP_1Y)[mktCapCoin];
    if(ov&&ov.length)datasets.push({label:mktCapCoin+' Market Cap',data:ov,fill:false,tension:.35,borderWidth:2,pointRadius:0,pointHoverRadius:5,yAxisID:'y1',
      borderColor:coinColor(mktCapCoin),backgroundColor:coinColor(mktCapCoin)});
  }
  if(mktCapChart){mktCapChart.destroy();mktCapChart=null;}
  mktCapChart=new Chart(document.getElementById('mktcap-canvas'),{
    type:'line',
    data:{labels,datasets},
    options:{maintainAspectRatio:false,animation:{duration:300},interaction:{mode:'index',intersect:false},
      plugins:{legend:{display:true,position:'top',align:'start',labels:{boxWidth:8,boxHeight:8,padding:12,font:{size:11},usePointStyle:true,pointStyle:'circle'}},
        tooltip:{...TOOLTIP_BASE,callbacks:{title:ctx=>labels[ctx[0].dataIndex],label:ctx=>{
          if(ctx.dataset.yAxisID==='y1')return`  ${ctx.dataset.label}: $${ctx.raw.toFixed(2)}B`;
          return`  ${ctx.dataset.label}: $${ctx.raw.toFixed(2)}T`;
        }}}},
      scales:{
        x:{grid:{display:false},ticks:{font:{size:10},maxTicksLimit:period==='30d'?7:12}},
        y:{position:'right',grid:{color:'rgba(0,0,0,.04)'},ticks:{callback:v=>'$'+v.toFixed(1)+'T',font:{size:10}},
          min:Math.min(...mc)*0.97,max:Math.max(...mc)*1.015},
        y1:{display:mktCapCoin!=='TOTAL',position:'left',grid:{drawOnChartArea:false},ticks:{callback:v=>'$'+v+'B',font:{size:10}}}
      }
    }
  });
}
export function setMktCapPeriod(p,btn){document.querySelectorAll('#mktcap-tog .tog-btn').forEach(b=>b.classList.toggle('on',b===btn));buildMktCapChart(p);}
export function setMktCapCoin(ticker){mktCapCoin=ticker;buildMktCapChart(mktCapPeriod);}

/* ── Asset Composition — stacked area (CMC "by Chain" style) ── */
export function buildCompTog(){
  const el=document.getElementById('comp-tog');if(!el)return;
  el.innerHTML='<span class="coin-picker-label">Coins</span>';
  ALL_COINS.forEach(c=>{
    const btn=document.createElement('span');
    btn.className='ctog'+(activeCompCoins.has(c)?' on':'');
    btn.style.setProperty('--cc',coinColor(c));
    btn.textContent=c;
    btn.onclick=()=>{
      if(activeCompCoins.has(c)){if(activeCompCoins.size<=1)return;activeCompCoins.delete(c);btn.classList.remove('on');}
      else{activeCompCoins.add(c);btn.classList.add('on');}
      buildCompChart();
    };
    el.appendChild(btn);
  });
}
export function buildCompChart(){
  if(!MONTHS.length)return;
  const isEx=compMode==='ex';
  const range=MONTHS.length?` (${MONTHS[0]} – ${MONTHS[MONTHS.length-1]})`:'';
  document.getElementById('comp-note').textContent=isEx
    ?'Ex-BTC/ETH · % of ex-BTC/ETH market'+range
    :'All assets · % of total crypto market cap'+range;

  let datasets;
  if(isEx){
    // Bottom→top: XRP (biggest), SOL, LINK, AVAX, Others (gray)
    datasets=[
      {label:'XRP',  data:EX_NORM.XRP,  backgroundColor:COIN_COLORS.XRP+'99', borderColor:COIN_COLORS.XRP},
      {label:'SOL',  data:EX_NORM.SOL,  backgroundColor:COIN_COLORS.SOL+'99', borderColor:COIN_COLORS.SOL},
      {label:'LINK', data:EX_NORM.LINK, backgroundColor:COIN_COLORS.LINK+'99',borderColor:COIN_COLORS.LINK},
      {label:'AVAX', data:EX_NORM.AVAX, backgroundColor:COIN_COLORS.AVAX+'99',borderColor:COIN_COLORS.AVAX},
      {label:'Others',data:EX_OTHERS,   backgroundColor:'#94a3b877',           borderColor:'#94a3b8'},
    ];
  } else {
    // Bottom→top: BTC (biggest), ETH, XRP, SOL, Others
    datasets=[
      {label:'BTC',   data:DOM.BTC,     backgroundColor:COIN_COLORS.BTC+'88', borderColor:COIN_COLORS.BTC},
      {label:'ETH',   data:DOM.ETH,     backgroundColor:COIN_COLORS.ETH+'88', borderColor:COIN_COLORS.ETH},
      {label:'XRP',   data:DOM.XRP,     backgroundColor:COIN_COLORS.XRP+'88', borderColor:COIN_COLORS.XRP},
      {label:'SOL',   data:DOM.SOL,     backgroundColor:COIN_COLORS.SOL+'88', borderColor:COIN_COLORS.SOL},
      {label:'Others',data:ALL_OTHERS,  backgroundColor:'#94a3b866',           borderColor:'#94a3b8'},
    ];
  }
  datasets=datasets.filter(d=>d.label==='Others'||activeCompCoins.has(d.label));
  // Drop any coin whose history wasn't available (avoids flat-zero lines).
  datasets=datasets.filter(d=>d.label==='Others'||(d.data&&d.data.length&&d.data.some(v=>v>0)));
  datasets=datasets.map(d=>({...d,fill:true,tension:.4,borderWidth:0.8,pointRadius:0,pointHoverRadius:4}));

  if(compChart){compChart.destroy();compChart=null;}
  compChart=new Chart(document.getElementById('comp-canvas'),{
    type:'line',
    data:{labels:MONTHS,datasets},
    options:{maintainAspectRatio:false,
      animation:{duration:350},
      interaction:{mode:'index',intersect:false},
      plugins:{
        legend:{display:true,position:'top',align:'start',
          labels:{boxWidth:9,boxHeight:9,padding:12,font:{size:11},usePointStyle:true,pointStyle:'rect'}},
        tooltip:{...TOOLTIP_BASE,callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.raw}%`}}
      },
      scales:{
        x:{grid:{display:false},ticks:{font:{size:10}}},
        y:{stacked:true,grid:{color:'rgba(0,0,0,.04)'},
          ticks:{callback:v=>v+'%',font:{size:10}},min:0,max:100}
      }
    }
  });
}
export function setCompMode(m,btn){compMode=m;document.querySelectorAll('#comp-mode-tog .tog-btn').forEach(b=>b.classList.toggle('on',b===btn));buildCompChart();}

/* ── Volatility with coin toggles ── */
export function buildVolTog(){
  const el=document.getElementById('vol-tog');el.innerHTML='';
  ALL_COINS.forEach(c=>{
    const btn=document.createElement('span');
    btn.className='ctog'+(activeVolCoins.has(c)?' on':'');
    btn.style.setProperty('--cc',COIN_COLORS[c]);
    btn.textContent=c;
    btn.onclick=()=>{
      if(activeVolCoins.has(c)){if(activeVolCoins.size<=1)return;activeVolCoins.delete(c);btn.classList.remove('on');}
      else{activeVolCoins.add(c);btn.classList.add('on');}
      buildVolChart();
    };
    el.appendChild(btn);
  });
}
export function buildVolChart(){
  if(!MONTHS.length)return;
  const datasets=ALL_COINS.filter(c=>activeVolCoins.has(c)&&VOL[c]).map(c=>({
    label:c,data:VOL[c],fill:false,
    borderColor:COIN_COLORS[c],borderWidth:2,tension:.4,pointRadius:0,pointHoverRadius:4,
  }));
  if(volChart){volChart.destroy();volChart=null;}
  volChart=new Chart(document.getElementById('vol-canvas'),{
    type:'line',
    data:{labels:MONTHS,datasets},
    options:{maintainAspectRatio:false,
      animation:{duration:300},interaction:{mode:'index',intersect:false},
      plugins:{legend:{display:false},tooltip:{...TOOLTIP_BASE,callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.raw}% ann. vol`}}},
      scales:{
        x:{grid:{display:false},ticks:{font:{size:10}}},
        y:{grid:{color:'rgba(0,0,0,.04)'},ticks:{callback:v=>v+'%',font:{size:10}},
          title:{display:true,text:'Annualized Vol (%)',font:{size:10},color:'#8a96aa'}}
      }
    }
  });
}
