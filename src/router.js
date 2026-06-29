import { initAnchorageOverview } from './views/overview.js';
import { initOverview } from './views/dashboard.js';
import { initSectors } from './views/sectors.js';

/* -- TAB SWITCHING -- */
export function switchTab(id,btn){
  document.querySelectorAll('.pane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('pane-'+id).classList.add('active');
  if(!btn)btn=document.querySelector(`.tab-btn[data-tab="${id}"]`);
  if(btn)btn.classList.add('active');
  if(id==='overview')initAnchorageOverview();
  if(id==='dashboard')initOverview();
  if(id==='sectors')initSectors();
}
