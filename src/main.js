// App entry point. Wires the feature modules together, bridges the handlers used
// by inline HTML on*= attributes onto window, and runs the bootstrap sequence that
// was previously at the bottom of the single-file script.
import { paintHeader } from './universe-store.js';
import { initAnchorageOverview } from './views/overview.js';
import { switchTab } from './router.js';
import { setDonutMode, setMktCapPeriod, setMktCapCoin, setCompMode } from './charts.js';
import { klineChange, setIv } from './tradingview.js';
import { goGrid, backFromAsset, setSdSort } from './views/sectors.js';
import { cmcLogoFail } from './state.js';
import { refreshLiveData } from './live-data.js';
import { loadHistory } from './history-data.js';

// Inline HTML attributes (onclick=, onchange=, onerror=) resolve against window.
Object.assign(window, {
  switchTab, setDonutMode, setMktCapPeriod, setMktCapCoin, setCompMode,
  klineChange, setIv, goGrid, backFromAsset, setSdSort, cmcLogoFail,
});

// ── Bootstrap ──
paintHeader();
if (document.readyState !== 'loading') initAnchorageOverview();
else document.addEventListener('DOMContentLoaded', initAnchorageOverview);
refreshLiveData();
setInterval(refreshLiveData, 60000);
loadHistory();
setInterval(loadHistory, 30 * 60 * 1000);
