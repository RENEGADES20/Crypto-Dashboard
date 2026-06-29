import { OVERVIEW_ASSETS, OVERVIEW_KEPT } from '../data/overview-assets.js';
import { SECTOR_LABELS, SECTOR_ORDER, sectorColor, fmtCap } from '../state.js';

export let anchorOverviewReady=false;
export let overviewFilterOn=false;
export let overviewSelectedAsset=null;

export function initAnchorageOverview(){
  if(anchorOverviewReady) return;
  anchorOverviewReady=true;
  const toggle=document.getElementById('overview-filter-toggle');
  const status=document.getElementById('overview-filter-status');
  if(toggle){
    toggle.addEventListener('click',()=>{
      overviewFilterOn=!overviewFilterOn;
      toggle.classList.toggle('active',overviewFilterOn);
      toggle.setAttribute('aria-pressed',overviewFilterOn?'true':'false');
      toggle.textContent=overviewFilterOn?'Show full 683':'Show 54 kept';
      renderAnchorageOverview();
    });
  }
  // defer one frame so the card has real width/height before layout
  requestAnimationFrame(()=>renderAnchorageOverview());
}

export function getOverviewAssets(){
  if(overviewFilterOn) return Array.isArray(OVERVIEW_KEPT)?OVERVIEW_KEPT:[];
  return Array.isArray(OVERVIEW_ASSETS)?OVERVIEW_ASSETS:[];
}
export let ovState=null;

export function renderAnchorageOverview(){
  const container=document.getElementById('overview-bubbles');
  const status=document.getElementById('overview-filter-status');
  const panel=document.getElementById('overview-rules-panel');
  if(!container)return;
  const fullN=(typeof OVERVIEW_ASSETS!=='undefined'?OVERVIEW_ASSETS:[]).length;
  const keptN=(typeof OVERVIEW_KEPT!=='undefined'?OVERVIEW_KEPT:[]).length;
  if(status){status.textContent=overviewFilterOn?`Filtered view · ${keptN} kept assets · drag bubbles to rearrange`:`Full universe · ${fullN} assets · scroll to zoom, drag to pan`;}

  if(container._ovCleanup) container._ovCleanup();
  container.innerHTML='';
  const stage=document.createElement('div');
  stage.className='overview-stage';
  container.appendChild(stage);

  const assets=getOverviewAssets().slice().sort((a,b)=>(b.marketCap||0)-(a.marketCap||0));
  const n=assets.length||1;
  // icon size is linear in log10(market cap): smallest-cap -> floor, largest -> floor+span
  const caps=assets.map(a=>a.marketCap).filter(Boolean);
  const lmax=Math.log10(Math.max(10,...caps)), lmin=Math.log10(Math.min(...caps,lmax>0?Math.pow(10,lmax):1));
  const cfg=overviewFilterOn?{floor:34,span:66,pad:4}:{floor:15,span:46,pad:3};
  const sizeFor=c=>c?cfg.floor+(Math.log10(c)-lmin)/((lmax-lmin)||1)*cfg.span:cfg.floor;
  const GA=Math.PI*(3-Math.sqrt(5));
  // single cluster: golden-angle spiral seed (biggest near centre), settled by physics
  const nodes=assets.map((a,i)=>{
    const jit=a.marketCap?0:(((i*1373)%100)/100*4-2);
    return {a,r:sizeFor(a.marketCap)/2+jit,x:0,y:0,vx:0,vy:0,dragging:false,el:null};
  });
  const maxR=Math.max(...nodes.map(nd=>nd.r)), cell=2*maxR+cfg.pad+1;
  // Fibonacci (golden-angle) seed into a wide horizontal ellipse, biggest near the centre.
  const area=nodes.reduce((s,nd)=>s+Math.PI*nd.r*nd.r,0);
  const AR=1.62, RY=Math.sqrt(area/(0.56*Math.PI*AR)), RX=RY*AR;
  nodes.forEach((nd,i)=>{const t=Math.sqrt((i+0.5)/n), ang=i*GA; nd.x=Math.cos(ang)*t*RX; nd.y=Math.sin(ang)*t*RY;});

  // grid-bucketed collision -> O(n), keeps 683 smooth. Size-weighted so big bubbles barely move.
  function collide(){
    const grid=new Map();
    for(let i=0;i<n;i++){const nd=nodes[i]; nd._cx=Math.floor(nd.x/cell); nd._cy=Math.floor(nd.y/cell);
      const k=nd._cx+','+nd._cy; (grid.get(k)||grid.set(k,[]).get(k)).push(i);}
    for(let i=0;i<n;i++){const A=nodes[i];
      for(let gx=A._cx-1;gx<=A._cx+1;gx++)for(let gy=A._cy-1;gy<=A._cy+1;gy++){
        const arr=grid.get(gx+','+gy); if(!arr)continue;
        for(const j of arr){ if(j<=i)continue; const B=nodes[j];
          let dx=B.x-A.x,dy=B.y-A.y,d=Math.sqrt(dx*dx+dy*dy)||0.01,min=A.r+B.r+cfg.pad;
          if(d<min){const k2=(min-d)/d,ox=dx*k2,oy=dy*k2,tot=A.r+B.r,wa=B.r/tot,wb=A.r/tot;
            if(!A.dragging){A.x-=ox*wa;A.y-=oy*wa;} if(!B.dragging){B.x+=ox*wb;B.y+=oy*wb;}}
        }
      }
    }
  }
  // ---- settle ----
  // 683: pack to a non-overlapping ellipse, then viewed statically via pan/zoom.
  // 54 : light pre-settle; a live gravity loop (below) keeps it organic & re-packs.
  function gravStep(G){
    for(const nd of nodes){if(nd.dragging)continue; nd.vx+=-nd.x*G; nd.vy+=-nd.y*G*1.55;}
    collide();
    for(const nd of nodes){if(nd.dragging)continue; nd.x+=nd.vx; nd.y+=nd.vy; nd.vx*=0.84; nd.vy*=0.84;}
  }
  if(!overviewFilterOn){
    // 683: keep the Fibonacci ellipse — collision only (no gravity) preserves the wide
    // horizontal spiral while driving overlaps to zero. Static, viewed via pan/zoom.
    for(let s=0;s<340;s++) collide();
  } else {
    // 54: gravity pre-settle; the live loop below keeps it organic & re-packs after drags.
    for(let s=0;s<90;s++) gravStep(0.02);
    for(let s=0;s<160;s++) collide();
  }

  const LOGO=id=>`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
  const RING=overviewFilterOn?'4.5px':'3px';
  // build bare bubbles — logo vs category-colour disc is decided later by level-of-detail
  nodes.forEach(nd=>{
    const a=nd.a, size=nd.r*2;
    const b=document.createElement('button');
    b.type='button'; b.className='overview-bubble'; b._node=nd;
    b.style.width=`${size.toFixed(1)}px`; b.style.height=`${size.toFixed(1)}px`;
    b.style.opacity='0';
    b.title=`${a.name} · ${SECTOR_LABELS[a.sector]||a.sector}${a.marketCap?' · '+fmtCap(a.marketCap):''}`;
    b.addEventListener('mouseenter',()=>{if(!mode)updateOverviewRule(a);});
    b.addEventListener('focus',()=>updateOverviewRule(a));
    nd.el=b; nd._st=undefined; nd._img=null; nd._broken=!a.logo;
    stage.appendChild(b);
    requestAnimationFrame(()=>{b.style.opacity='1';});
  });
  // Set a node's visual state: 'logo' (white disc + ring + icon), 'disc' (solid category colour),
  // or 'hidden' (culled off-screen, icon unloaded to save memory).
  function applyState(nd,want){
    if(want===nd._st) return; nd._st=want;
    const b=nd.el, color=sectorColor(nd.a.sector);
    if(want==='hidden'){ b.style.display='none'; if(nd._img){nd._img.style.display='none'; nd._img.removeAttribute('src');} return; }
    b.style.display='';
    if(want==='logo'){
      b.style.background='#fff'; b.style.borderColor=color; b.style.borderWidth=RING;
      if(!nd._img){
        const img=document.createElement('img'); img.alt=nd.a.ticker; img.draggable=false;
        img.addEventListener('error',()=>{nd._broken=true; nd._st=null; applyState(nd,'disc');});
        nd._img=img; b.appendChild(img);
      }
      if(!nd._img.getAttribute('src')) nd._img.setAttribute('src',LOGO(nd.a.logo));
      nd._img.style.display='';
    } else { // disc — category colour replaces the icon
      if(nd._img){nd._img.style.display='none'; nd._img.removeAttribute('src');}
      b.style.background=`radial-gradient(circle at 33% 30%, ${color}, ${color}C8)`; b.style.borderWidth='0';
    }
  }

  // Controls differ by view:
  //   683 (filter off): map — wheel-zoom + drag-pan + viewport culling; bubbles static.
  //   54  (filter on):  draggable bubbles with a live gravity loop; no zoom/pan; auto-fit.
  const interactiveBubbles=overviewFilterOn;
  const mapControls=!overviewFilterOn;
  const view={x:0,y:0,zoom:1};
  let minZoom=0.3, maxZoom=6, mode=null, last=null, dragNode=null, downBubble=null, moved=false, raf=0, idle=0;
  const apply=()=>{stage.style.transform=`translate(${view.x.toFixed(1)}px,${view.y.toFixed(1)}px) scale(${view.zoom.toFixed(4)})`;};
  const paint=()=>{for(const nd of nodes){nd.el.style.left=`${nd.x.toFixed(1)}px`; nd.el.style.top=`${nd.y.toFixed(1)}px`;}};
  function fit(){
    let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9;
    for(const nd of nodes){mnx=Math.min(mnx,nd.x-nd.r);mxx=Math.max(mxx,nd.x+nd.r);mny=Math.min(mny,nd.y-nd.r);mxy=Math.max(mxy,nd.y+nd.r);}
    const W=container.clientWidth||760, H=container.clientHeight||520;
    const z=Math.min(W/Math.max(1,mxx-mnx), H/Math.max(1,mxy-mny))*0.94;
    minZoom=z*0.5; maxZoom=z*16; view.zoom=z;
    view.x=W/2-((mnx+mxx)/2)*z; view.y=H/2-((mny+mxy)/2)*z;
  }
  // Level-of-detail (683 map): a coin's logo loads only when its on-screen radius is big
  // enough; smaller / peripheral bubbles show a plain category-colour disc, so the default
  // view isn't a dense wall of icons. Zoom in -> more logos load. Off-screen -> culled.
  const LOGO_PX=13;
  function lod(){
    const W=container.clientWidth, H=container.clientHeight, m=140;
    for(const nd of nodes){
      const sx=nd.x*view.zoom+view.x, sy=nd.y*view.zoom+view.y, sr=nd.r*view.zoom;
      const vis=(sx+sr>-m)&&(sx-sr<W+m)&&(sy+sr>-m)&&(sy-sr<H+m);
      applyState(nd, !vis?'hidden':((nd.a.logo&&!nd._broken&&sr>=LOGO_PX)?'logo':'disc'));
    }
  }
  paint(); fit(); apply();
  if(mapControls){ container.classList.add('ov-map'); lod(); }
  else { container.classList.remove('ov-map'); nodes.forEach(nd=>applyState(nd, nd.a.logo?'logo':'disc')); }

  // ---- 54 live gravity loop: organic settle that re-packs after drags, sleeps when calm ----
  function loop(){
    raf=0;
    const px=nodes.map(nd=>nd.x), py=nodes.map(nd=>nd.y);
    const G=dragNode?0.0035:0.006;   // gentle: just holds the cluster together
    for(const nd of nodes){if(nd.dragging)continue; nd.vx+=-nd.x*G; nd.vy+=-nd.y*G*1.25; nd.x+=nd.vx; nd.y+=nd.vy; nd.vx*=0.82; nd.vy*=0.82;}
    for(let s=0;s<5;s++) collide();   // collision dominates each frame
    let move=0; for(let i=0;i<n;i++) move+=Math.abs(nodes[i].x-px[i])+Math.abs(nodes[i].y-py[i]);
    paint();
    if(dragNode) idle=0; else if(move/n<0.08) idle++; else idle=0;
    if(idle<24){ raf=requestAnimationFrame(loop); }
    else { for(let s=0;s<90;s++) collide(); paint(); }   // clean-up burst on sleep -> no overlap at rest
  }
  function wake(){ if(!interactiveBubbles) return; idle=0; if(!raf) raf=requestAnimationFrame(loop); }

  function onWheel(e){
    e.preventDefault();
    const rect=container.getBoundingClientRect();
    const mx=e.clientX-rect.left, my=e.clientY-rect.top;
    const wx=(mx-view.x)/view.zoom, wy=(my-view.y)/view.zoom;
    view.zoom=Math.max(minZoom,Math.min(maxZoom,view.zoom*Math.exp(-e.deltaY*0.0015)));
    view.x=mx-wx*view.zoom; view.y=my-wy*view.zoom; apply(); lod();
  }
  function onDown(e){
    if(e.button) return;
    const bub=e.target.closest('.overview-bubble');
    moved=false; last={x:e.clientX,y:e.clientY}; downBubble=bub;
    if(interactiveBubbles && bub && bub._node){mode='drag'; dragNode=bub._node; dragNode.dragging=true; wake();}
    else if(mapControls){mode='pan'; container.classList.add('ov-panning');}
    else { mode='tap'; }
    window.addEventListener('pointermove',onMove);
    window.addEventListener('pointerup',onUp);
    e.preventDefault();
  }
  function onMove(e){
    const dx=e.clientX-last.x, dy=e.clientY-last.y; last={x:e.clientX,y:e.clientY};
    if(Math.abs(dx)+Math.abs(dy)>1) moved=true;
    if(mode==='pan'){view.x+=dx; view.y+=dy; apply(); lod();}
    else if(mode==='drag'&&dragNode){dragNode.x+=dx/view.zoom; dragNode.y+=dy/view.zoom; wake();}
  }
  function onUp(){
    if(mode==='drag'&&dragNode){dragNode.dragging=false; wake();}   // release -> gravity re-packs
    if(!moved && downBubble && downBubble._node) updateOverviewRule(downBubble._node.a);
    mode=null; dragNode=null; downBubble=null; container.classList.remove('ov-panning');
    window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',onUp);
  }
  if(mapControls) container.addEventListener('wheel',onWheel,{passive:false});
  container.addEventListener('pointerdown',onDown);
  if(interactiveBubbles) wake();   // start the live loop (settles then sleeps)
  container._ovCleanup=()=>{if(raf)cancelAnimationFrame(raf); container.removeEventListener('wheel',onWheel); container.removeEventListener('pointerdown',onDown); window.removeEventListener('pointermove',onMove); window.removeEventListener('pointerup',onUp); container.classList.remove('ov-map','ov-panning');};

  ovState={nodes,view,fit,apply,paint};
  renderOverviewLegend(assets);
  updateOverviewRule(null);
  if(panel) panel.classList.toggle('is-collapsed',!overviewFilterOn);
}

export function renderOverviewLegend(assets){
  const el=document.getElementById('overview-legend');
  if(!el)return;
  const counts={};
  assets.forEach(a=>{counts[a.sector]=(counts[a.sector]||0)+1;});
  el.innerHTML=SECTOR_ORDER.filter(s=>counts[s]).map(s=>
    `<span class="ov-leg"><i style="background:${sectorColor(s)}"></i>${SECTOR_LABELS[s]||s} <b>${counts[s]}</b></span>`
  ).join('');
}

export function updateOverviewRule(asset){
  const title=document.getElementById('overview-rule-title');
  const body=document.getElementById('overview-rule-body');
  if(!title||!body)return;
  if(!asset){
    title.textContent=overviewFilterOn?'The 54 kept assets':'From 683 to 54';
    body.innerHTML=overviewFilterOn
      ? 'These 54 assets pass every screening rule and are the ones our research process studies most closely. Hover any bubble for its sector, market cap, and role.'
      : 'Hover any bubble for its sector, market cap, and role. Toggle <strong>Show 54 kept</strong> to narrow the map to the investable subset.';
    return;
  }
  overviewSelectedAsset=asset;
  const color=sectorColor(asset.sector);
  const keptBadge=asset.kept?`<span class="ov-badge ov-kept">✓ Kept (in the 54)</span>`:`<span class="ov-badge ov-out">Filtered out</span>`;
  title.textContent=`${asset.name} · ${asset.ticker}`;
  body.innerHTML=`<div class="ov-rule-meta">`
    +`<span class="ov-sector" style="background:${color}1a;color:${color}"><i style="background:${color}"></i>${SECTOR_LABELS[asset.sector]||asset.sector}</span>`
    +`<span class="ov-mc">${fmtCap(asset.marketCap)}</span>${keptBadge}</div>`
    +`<div class="ov-summary">${asset.summary||''}</div>`;
}
