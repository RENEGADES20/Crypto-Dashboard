import { OVERVIEW_ASSETS, OVERVIEW_KEPT } from './data/overview-assets.js';

/* ══ STATIC DATA ══ */
export const SECTORS = {
  'L1 Platforms':          {label:'L1 Platforms',     color:'#f7931a',bg:'#fff8f0',desc:'Foundation-layer blockchains powering smart contracts, DeFi, and ecosystem development. Core exposure to on-chain adoption and chain-level network effects. BTC and ETH are the bedrock; newer L1s compete for developer and user activity.'},
  'DeFi Core':             {label:'DeFi Core',         color:'#00d395',bg:'#edfaf4',desc:'Permissionless lending, trading, and financial primitives. The on-chain equivalents of exchanges, banks, and market makers — operating 24/7 without intermediaries. TVL and fee revenue are the key operating metrics.'},
  'Payments & Settlement': {label:'Payments',          color:'#3861fb',bg:'#eff3ff',desc:'Fast, borderless value transfer and cross-border settlement infrastructure. Crypto rails offer 24/7 global settlement that outpaces legacy correspondent banking on cost and speed. XRP leads with deep institutional partnerships.'},
  'Identity & Social':     {label:'Identity & Social', color:'#ef5350',bg:'#fff5f5',desc:'Digital identity, fan engagement, gaming, and social layer primitives. Early-stage exposure to on-chain consumer and community applications. High optionality, higher risk — sized accordingly.'},
  'AI & Compute':          {label:'AI & Compute',      color:'#9945ff',bg:'#f7f0ff',desc:'Decentralized GPU networks and AI coordination protocols creating open markets for compute — at the intersection of crypto incentive design and surging AI infrastructure demand.'},
  'Oracles & Data':        {label:'Oracles & Data',    color:'#2775ca',bg:'#eff5ff',desc:'Verified real-world data feeds for smart contracts. Critical middleware: every DeFi protocol relying on price feeds depends on this layer. Chainlink\'s dominant position creates a deep network-effect moat.'},
  'DeFi Staking/Yield':    {label:'Staking & Yield',   color:'#f97316',bg:'#fff7ed',desc:'Liquid staking, restaking, and yield tokenization protocols. Abstracts staking complexity, unlocks capital efficiency on locked assets, and creates new yield markets. LSD/LRT ecosystem exposure.'},
  'Infrastructure':        {label:'Infrastructure',    color:'#64748b',bg:'#f8fafc',desc:'Storage, interoperability, privacy, and exchange infrastructure. Diversified exposure to critical blockchain plumbing without single-chain dependency. Lower beta, more defensive within crypto.'},
  'BTC/ETH L2s':           {label:'BTC/ETH L2s',       color:'#7c3aed',bg:'#f5f0ff',desc:'Ethereum scaling via optimistic and ZK rollups — inheriting L1 security while delivering lower fees and higher throughput. The battleground for application activity as Ethereum matures.'},
};
export const DESCS={BTC:'Proof-of-work digital gold; the global crypto reserve asset with the highest liquidity and institutional adoption. A foundational benchmark for digital asset market structure.',ETH:'Programmable smart contract platform and foundation of DeFi, NFTs, and the L2 ecosystem. Transitioning to deflationary issuance via EIP-1559; ultrasound money thesis.',SOL:'High-throughput L1 optimized for speed and low fees. A thriving DeFi and consumer crypto ecosystem; primary competitor to Ethereum for developer and user activity.',XRP:'Enterprise-grade payments network focused on cross-border settlement with 100+ financial institution partnerships via RippleNet. SEC lawsuit resolution unlocked institutional re-engagement.',LINK:'The dominant oracle network providing verified real-world data to 1,000+ DeFi protocols across all major chains. Critical infrastructure with deep network-effect moats.',SUI:'Move-language L1 from ex-Meta engineers; object-centric data model designed for high parallelism and consumer-grade UX with sub-second finality.',AVAX:'L1 with customizable subnet architecture enabling chain-specific environments. Strong in institutional tokenization and gaming verticals; hosts major TradFi pilots.',LTC:'One of the earliest Bitcoin forks with 12+ years of proven uptime. Broad exchange and merchant adoption; simple payments use case without smart contract complexity.',CRO:'Native token of the Cronos EVM chain. Powers the Crypto.com ecosystem including exchange, card, and consumer DeFi products serving 80M+ users.',MNT:'Governance and gas token of Mantle Network, a modular Ethereum L2 backed by the former BitDAO treasury. Focus on gaming and institutional DeFi.',UNI:'Governance token of Uniswap, the leading DEX by cumulative volume. Near-monopoly in on-chain spot trading; V4 introduces custom liquidity hooks and fee structures.',ONDO:'Tokenized US Treasuries and money market funds on-chain. The leading RWA protocol bridging TradFi yield to DeFi; regulatory clarity a key catalyst.',SKY:'Governance of Sky (formerly MakerDAO), issuer of USDS/DAI — the oldest and most battle-tested decentralized stablecoin with $6B+ in circulation.',BGB:'Exchange token of Bitget, a top-5 global derivatives exchange. Revenue sharing, fee discounts, and ecosystem utility tied to platform growth.',AAVE:'Blue-chip lending protocol with $10B+ TVL across 12+ networks. Expanding with GHO stablecoin and cross-chain liquidity. The money market of DeFi.',WLD:'Iris-scan proof-of-personhood by Sam Altman. Building the world\'s largest verified human identity network on-chain; dual utility as AI-era identity layer.',RENDER:'Decentralized GPU rendering network connecting idle GPU owners with creators and AI workloads. Network effects strongest in 3D/VFX; pivoting into broader AI inference.',MORPHO:'Modular lending protocol built on top of Aave/Compound, improving rates for both borrowers and lenders via peer-to-peer matching. Composable credit infrastructure.',ATOM:'The "internet of blockchains" hub. IBC protocol enables sovereign blockchains to communicate; ATOM captures ecosystem fees and secures interchain security consumers.',ENA:'USDe — synthetic dollar backed by delta-neutral ETH derivatives. Ethena generates yield from funding rates and distributes it to stakers; sUSDe is the yield-bearing form.',QNT:'Overledger OS enabling interoperability between enterprise blockchains and legacy banking systems. Deep SWIFT partnership; positioned for regulated institutional blockchain adoption.',APT:'Move-language L1 from Aptos Labs (ex-Meta). Prioritizes safety and reliability for large-scale consumer applications; strong in Southeast Asia and gaming.',FIL:'Decentralized storage network incentivizing miners to offer verifiable, persistent data storage. Complementary to IPFS; growing use in AI data storage and archiving.',JUP:'The leading DEX aggregator on Solana, routing trades across all Solana DEXs for optimal execution. Also expanding into perps and a Solana-native stablecoin.',ARB:'Leading Ethereum optimistic rollup by TVL and activity. Rich DeFi ecosystem and Arbitrum Orbit framework enabling custom L3 chains. Strong sequencer revenue.',FET:'AI agent coordination network (ASI Alliance with OCEAN + AGIX). Enables autonomous AI agents to transact on-chain; largest AI-crypto merger to date.',VIRTUAL:'Infrastructure for creating and deploying autonomous AI agents on-chain. The leading agent launchpad on Base; AI-agent-as-a-product business model.',NIGHT:'Privacy-focused sidechain of Cardano enabling confidential DeFi and regulatory-compliant private transactions via ZK proofs.',SEI:'Purpose-built L1 optimized for trading with native order matching engine and parallelized execution. Targeting on-chain exchanges and high-frequency DeFi.',STX:'Bitcoin L2 enabling smart contracts and DeFi anchored to Bitcoin\'s security via the sBTC peg and Proof of Transfer consensus mechanism.',TIA:'Modular data availability layer. Rollups post transaction data to Celestia rather than Ethereum, significantly reducing costs. First modular DA blockchain in production.',CRV:'Governance token of Curve Finance, the dominant DEX for stablecoin and pegged-asset swaps. The "veCRV wars" make it central to DeFi liquidity routing.',ETHFI:'Liquid restaking protocol built on EigenLayer. Generates additional yield from native ETH staking by enabling restaked ETH; largest LRT by TVL.',IMX:'Ethereum L2 specialized for NFTs and gaming using StarkEx ZK proofs. Zero gas for NFT minting with Ethereum security; home to Gods Unchained and others.',PENDLE:'Interest rate derivatives protocol allowing users to separate and trade yield from principal. Pioneering on-chain yield tokenization; core infrastructure for LSD yield markets.',PYTH:'High-frequency oracle network publishing real-time price feeds from 90+ first-party providers including Binance, OKX, and Jump. Lower latency than Chainlink for DeFi.',GRT:'Decentralized indexing protocol for querying blockchain data via GraphQL. Critical Web3 infrastructure described as "Google for blockchains"; core infra for dApp development.',GNO:'Governance token of the Gnosis ecosystem: Gnosis Chain (formerly xDAI), Safe multisig, and Gnosis Pay Visa debit card for real-world spending.',LDO:'Governance of Lido, the largest liquid staking protocol managing $20B+ in stETH and ~30% of all staked ETH. Beneficiary of restaking narrative via EigenLayer.',ZBCN:'Payments and streaming protocol on Solana enabling per-second salary payments, subscriptions, and real-time institutional treasury management.',OP:'Governance token of the Optimism Superchain. Sequencer fee revenue funds RetroPGF grants and ecosystem public goods. Base, Zora, and others use OP Stack.',STRK:'Governance and gas token of StarkNet, Ethereum\'s ZK-rollup using STARK proofs for computational integrity at scale. Fastest-growing zkEVM ecosystem.',JTO:'Governance of Jito Labs, the largest MEV-aware liquid staking protocol on Solana. JitoSOL captures MEV (block tips) revenue for stakers in addition to base yield.',ENS:'Ethereum Name Service — decentralized naming for wallets, websites, and on-chain identity. The standard for human-readable crypto addresses; ~3M registered names.',SYRUP:'Governance of Maple Finance, an institutional credit marketplace offering undercollateralized on-chain loans to vetted institutions. Bridges TradFi credit to DeFi.',POL:'Governance of the AggLayer, Polygon\'s ZK interoperability framework unifying L2s with shared liquidity. Former MATIC; rebranded for the ZK-centric modular future.',RAY:'Governance of Raydium, the leading AMM and concentrated liquidity DEX on Solana. Captures fees from the majority of Solana DeFi trading volume.',CHZ:'Fan token infrastructure for 150+ professional sports clubs globally. Socios.com enables voting rights and exclusive fan engagement via on-chain tokens.',SAND:'Governance token of The Sandbox metaverse platform. 200+ brand partnerships including Adidas, HSBC, and Warner Music. Virtual real estate and user-generated content.',AXS:'Governance of Axie Infinity, the pioneering play-to-earn NFT game. Ronin sidechain processes gaming transactions at near-zero cost; rebuilding after a 2021-era peak.'};
export const TV={BTC:'BINANCE:BTCUSDT',ETH:'BINANCE:ETHUSDT',SOL:'BINANCE:SOLUSDT',XRP:'BINANCE:XRPUSDT',LINK:'BINANCE:LINKUSDT',SUI:'BINANCE:SUIUSDT',AVAX:'BINANCE:AVAXUSDT',LTC:'BINANCE:LTCUSDT',CRO:'BINANCE:CROUSDT',MNT:'BYBIT:MNTUSDT',UNI:'BINANCE:UNIUSDT',ONDO:'BINANCE:ONDOUSDT',SKY:'COINBASE:SKYUSD',BGB:'BITGET:BGBUSDT',AAVE:'BINANCE:AAVEUSDT',WLD:'BINANCE:WLDUSDT',MORPHO:'COINBASE:MORPHOUSD',ATOM:'BINANCE:ATOMUSDT',RENDER:'BINANCE:RENDERUSDT',ENA:'BINANCE:ENAUSDT',QNT:'BINANCE:QNTUSDT',APT:'BINANCE:APTUSDT',FIL:'BINANCE:FILUSDT',JUP:'BINANCE:JUPUSDT',ARB:'BINANCE:ARBUSDT',FET:'BINANCE:FETUSDT',VIRTUAL:'BINANCE:VIRTUALUSDT',NIGHT:'BINANCE:NIGHTUSDT',SEI:'BINANCE:SEIUSDT',STX:'BINANCE:STXUSDT',TIA:'BINANCE:TIAUSDT',CRV:'BINANCE:CRVUSDT',ETHFI:'BINANCE:ETHFIUSDT',IMX:'BINANCE:IMXUSDT',PENDLE:'BINANCE:PENDLEUSDT',PYTH:'BINANCE:PYTHUSDT',GRT:'BINANCE:GRTUSDT',GNO:'KRAKEN:GNOUSD',LDO:'BINANCE:LDOUSDT',ZBCN:'BYBIT:ZBCNUSDT',OP:'BINANCE:OPUSDT',STRK:'BINANCE:STRKUSDT',JTO:'BINANCE:JTOUSDT',ENS:'BINANCE:ENSUSDT',SYRUP:'BINANCE:SYRUPUSDT',POL:'BINANCE:POLUSDT',RAY:'BINANCE:RAYUSDT',CHZ:'BINANCE:CHZUSDT',SAND:'BINANCE:SANDUSDT',AXS:'BINANCE:AXSUSDT'};
export const DATA=[
  {t:'BTC',n:'Bitcoin',              s:'L1 Platforms',         m:1560000000000,p:'$77,651'},
  {t:'ETH',n:'Ethereum',             s:'L1 Platforms',         m:257570000000, p:'$2,134'},
  {t:'XRP',n:'Ripple',               s:'Payments & Settlement',m:84030000000,  p:'$1.36'},
  {t:'SOL',n:'Solana',               s:'L1 Platforms',         m:49530000000,  p:'$85.66'},
  {t:'LINK',n:'Chainlink',           s:'Oracles & Data',       m:7000000000,   p:'$9.63'},
  {t:'SUI',n:'Sui',                  s:'L1 Platforms',         m:4210000000,   p:'$1.05'},
  {t:'AVAX',n:'Avalanche',           s:'L1 Platforms',         m:4080000000,   p:'$9.44'},
  {t:'LTC',n:'Litecoin',             s:'Payments & Settlement',m:4080000000,   p:'$52.87'},
  {t:'CRO',n:'Cronos',               s:'L1 Platforms',         m:3070000000,   p:'$0.0684'},
  {t:'MNT',n:'Mantle',               s:'L1 Platforms',         m:2140000000,   p:'$0.6468'},
  {t:'UNI',n:'Uniswap',              s:'DeFi Core',            m:2140000000,   p:'$3.36'},
  {t:'ONDO',n:'Ondo Finance',        s:'DeFi Staking/Yield',   m:2030000000,   p:'$0.4171'},
  {t:'SKY',n:'Sky (Maker)',           s:'DeFi Core',            m:1630000000,   p:'$0.0703'},
  {t:'BGB',n:'Bitget Token',         s:'Infrastructure',       m:1410000000,   p:'$2.02'},
  {t:'AAVE',n:'Aave',                s:'DeFi Core',            m:1350000000,   p:'$87.95'},
  {t:'WLD',n:'Worldcoin',            s:'Identity & Social',    m:1320000000,   p:'$0.3856'},
  {t:'RENDER',n:'Render',            s:'AI & Compute',         m:1250000000,   p:'$2.41'},
  {t:'MORPHO',n:'Morpho',            s:'DeFi Core',            m:1120000000,   p:'$2.28'},
  {t:'ATOM',n:'Cosmos',              s:'L1 Platforms',         m:1160000000,   p:'$2.28'},
  {t:'ENA',n:'Ethena',               s:'DeFi Core',            m:927000000,    p:'$0.1027'},
  {t:'QNT',n:'Quant',                s:'Infrastructure',       m:934000000,    p:'$77.38'},
  {t:'APT',n:'Aptos',                s:'L1 Platforms',         m:820000000,    p:'$0.9999'},
  {t:'FIL',n:'Filecoin',             s:'Infrastructure',       m:817000000,    p:'$1.04'},
  {t:'JUP',n:'Jupiter',              s:'DeFi Core',            m:693000000,    p:'$0.2088'},
  {t:'ARB',n:'Arbitrum',             s:'BTC/ETH L2s',          m:700000000,    p:'$0.1119'},
  {t:'FET',n:'Fetch.ai / ASI',       s:'AI & Compute',         m:570000000,    p:'$0.2522'},
  {t:'VIRTUAL',n:'Virtual Protocol', s:'AI & Compute',         m:558000000,    p:'$0.8499'},
  {t:'NIGHT',n:'Midnight',           s:'Infrastructure',       m:561000000,    p:'$0.0338'},
  {t:'SEI',n:'Sei',                  s:'L1 Platforms',         m:469000000,    p:'$0.0660'},
  {t:'STX',n:'Stacks',               s:'L1 Platforms',         m:457000000,    p:'$0.2520'},
  {t:'TIA',n:'Celestia',             s:'L1 Platforms',         m:443000000,    p:'$0.4813'},
  {t:'CRV',n:'Curve DAO',            s:'DeFi Core',            m:342000000,    p:'$0.2262'},
  {t:'ETHFI',n:'ether.fi',           s:'DeFi Staking/Yield',   m:344000000,    p:'$0.3908'},
  {t:'IMX',n:'Immutable X',          s:'BTC/ETH L2s',          m:344000000,    p:'$0.1720'},
  {t:'PENDLE',n:'Pendle',            s:'DeFi Core',            m:333000000,    p:'$1.95'},
  {t:'PYTH',n:'Pyth Network',        s:'Oracles & Data',       m:332000000,    p:'$0.0421'},
  {t:'GRT',n:'The Graph',            s:'Oracles & Data',       m:324000000,    p:'$0.0299'},
  {t:'GNO',n:'Gnosis',               s:'Infrastructure',       m:314000000,    p:'$119.10'},
  {t:'LDO',n:'Lido DAO',             s:'DeFi Staking/Yield',   m:301000000,    p:'$0.3541'},
  {t:'ZBCN',n:'Zebec Network',       s:'Payments & Settlement',m:292000000,    p:'$0.0029'},
  {t:'OP',n:'Optimism',              s:'BTC/ETH L2s',          m:287000000,    p:'$0.1333'},
  {t:'STRK',n:'StarkNet',            s:'BTC/ETH L2s',          m:264000000,    p:'$0.0420'},
  {t:'JTO',n:'Jito',                 s:'DeFi Staking/Yield',   m:258000000,    p:'$0.5422'},
  {t:'ENS',n:'Ethereum Name Service',s:'Infrastructure',       m:258000000,    p:'$6.38'},
  {t:'SYRUP',n:'Maple Finance',      s:'DeFi Core',            m:241000000,    p:'$0.2023'},
  {t:'POL',n:'Polygon',              s:'BTC/ETH L2s',          m:989000000,    p:'$0.0929'},
  {t:'RAY',n:'Raydium',              s:'DeFi Core',            m:209000000,    p:'$0.7755'},
  {t:'CHZ',n:'Chiliz',               s:'Identity & Social',    m:373000000,    p:'$0.0359'},
  {t:'SAND',n:'The Sandbox',         s:'Identity & Social',    m:213000000,    p:'$0.0724'},
  {t:'AXS',n:'Axie Infinity',        s:'Identity & Social',    m:200000000,    p:'$1.15'},
].sort((a,b)=>b.m-a.m);
DATA.forEach((d,i)=>d.r=i+1);

/* ── CHART / TIME-SERIES DATA (real history, loaded from /api/history) ──
   These start empty and are filled by applyHistory() once /api/history data
   arrives (CoinMarketCap + DeFiLlama). No more hardcoded/synthetic series. */
export const COIN_COLORS={BTC:'#f7931a',ETH:'#627eea',XRP:'#3461fb',SOL:'#9945ff',LINK:'#2a5ada',AVAX:'#e84142'};
export const ALL_COINS=['BTC','ETH','XRP','SOL','LINK','AVAX'];

// Sparkline data for ticker strip (20 relative data points)
export const SPARKLINES={
  BTC: [77,78,80,82,84,82,80,79,81,83,85,83,81,79,78,79,81,80,79,78],
  ETH: [95,94,93,92,90,89,88,89,90,91,90,89,88,87,86,85,84,83,82,81],
  SOL: [100,98,96,94,92,90,88,87,88,89,90,88,86,84,82,81,82,83,84,85],
  XRP: [100,102,104,106,105,104,103,102,104,106,107,106,105,104,103,104,105,106,107,108],
  LINK:[100,101,102,101,100,101,102,103,104,103,102,101,100,101,102,103,104,105,106,107],
};
export const TICKER_ASSETS=[
  {t:'BTC', pct:'+2.1%',pos:true},
  {t:'ETH', pct:'-0.8%',pos:false},
  {t:'SOL', pct:'-1.5%',pos:false},
  {t:'XRP', pct:'+1.3%',pos:true},
  {t:'LINK',pct:'+0.6%',pos:true},
];
// Live 24h % change keyed by ticker, populated by refreshLiveData().
export const LIVE_CHANGE={};

/* ── UTILS ── */
export let total  =0;
export let exTotal=0;
export let secTot={},secTotEx={};
// Recompute the cap aggregates from the (possibly live-updated) DATA array.
export function recomputeAggregates(){
  total  =DATA.reduce((s,a)=>s+a.m,0);
  exTotal=DATA.filter(a=>a.t!=='BTC'&&a.t!=='ETH').reduce((s,a)=>s+a.m,0);
  secTot={};secTotEx={};
  DATA.forEach(a=>{secTot[a.s]=(secTot[a.s]||0)+a.m;if(a.t!=='BTC'&&a.t!=='ETH')secTotEx[a.s]=(secTotEx[a.s]||0)+a.m;});
}
recomputeAggregates();
export function fmt(v){if(v>=1e12)return'$'+(v/1e12).toFixed(2)+'T';if(v>=1e9)return'$'+(v/1e9).toFixed(2)+'B';return'$'+(v/1e6).toFixed(0)+'M';}
export function pct(v,b){return(v/b*100).toFixed(1)+'%'}

// SVG sparkline generator
export function sparkSVG(pts,color,w=80,h=38){
  const mn=Math.min(...pts),mx=Math.max(...pts),rng=mx-mn||1,pad=3;
  const coords=pts.map((v,i)=>{
    const x=pad+(i/(pts.length-1))*(w-2*pad);
    const y=pad+(1-(v-mn)/rng)*(h-2*pad);
    return x.toFixed(1)+','+y.toFixed(1);
  }).join(' ');
  return`<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block"><polyline points="${coords}" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`;
}
/* ── CHART.JS SETUP ── */
Chart.defaults.font.family="'Inter',system-ui,sans-serif";
Chart.defaults.color='#8a96aa';
Chart.defaults.maintainAspectRatio=false;
export const DESKTOP_ZOOM=window.matchMedia('(min-width:901px)').matches?1.1:1;
Chart.defaults.devicePixelRatio=(window.devicePixelRatio||1)*DESKTOP_ZOOM;
export const zoomPointerFix={id:'zoomPointerFix',beforeEvent(chart,args){
  if(DESKTOP_ZOOM===1)return;
  const e=args.event;
  if(typeof e.x==='number')e.x/=DESKTOP_ZOOM;
  if(typeof e.y==='number')e.y/=DESKTOP_ZOOM;
}};
export const crosshair={id:'crosshair',beforeDatasetsDraw(chart){
  if(!chart.tooltip._active?.length)return;
  const ctx=chart.ctx,x=chart.tooltip._active[0].element.x;
  const{top,bottom}=chart.chartArea;
  ctx.save();ctx.beginPath();ctx.moveTo(x,top);ctx.lineTo(x,bottom);
  ctx.lineWidth=1;ctx.strokeStyle='#d8dce8';ctx.setLineDash([4,3]);ctx.stroke();ctx.restore();
}};
Chart.register(zoomPointerFix,crosshair);
export const TOOLTIP_BASE={mode:'index',intersect:false,backgroundColor:'#fff',titleColor:'#0d1421',titleFont:{size:11,weight:'700'},bodyColor:'#3d4f6e',bodyFont:{size:11},borderColor:'#e8ecf2',borderWidth:1,padding:{x:12,y:10},boxPadding:5,usePointStyle:true,pointStyle:'circle'};
export const SECTOR_LABELS={L1:'L1 Platforms',L2:'L2 Rollups',DeFi:'DeFi',DePIN:'DePIN',
  Infrastructure:'Infrastructure',AI:'AI',Payments:'Payments',Stablecoin:'Stablecoin',
  Gaming:'Gaming',Meme:'Meme',RWA:'RWA',NFT:'NFT',Other:'Other'};
export const SECTOR_PALETTE={L1:'#3861fb',L2:'#7c3aed',DeFi:'#16a34a',DePIN:'#0ea5e9',
  Infrastructure:'#64748b',AI:'#d946ef',Payments:'#0f766e',Stablecoin:'#f59e0b',
  Gaming:'#ef4444',Meme:'#f97316',RWA:'#d97706',NFT:'#8b5cf6',Other:'#94a3b8',
  'L1 Platforms':'#3861fb','L2 Rollups':'#7c3aed'};
export const SECTOR_ORDER=['L1','L2','DeFi','Infrastructure','AI','DePIN','Payments','RWA','Stablecoin','Gaming','Meme','NFT','Other'];
export function sectorColor(sector){return SECTOR_PALETTE[sector]||'#64748b';}
export function fmtCap(v){if(!v)return'—';if(v>=1e12)return'$'+(v/1e12).toFixed(2)+'T';if(v>=1e9)return'$'+(v/1e9).toFixed(2)+'B';if(v>=1e6)return'$'+(v/1e6).toFixed(0)+'M';return'$'+v.toLocaleString();}

/* ════════════════════ UNIVERSE LAYER ════════════════════
   Single source of truth for the Dashboard + Sectors tabs: the 683-asset Anchorage
   universe (OVERVIEW_ASSETS), de-duplicated to one row per ticker, classified into
   the 13-sector taxonomy. The live /api/quotes feed (top-100 from CoinMarketCap,
   built in api/quotes.js) overlays price/marketCap/24h onto matching tickers via
   refreshLiveData(). DATA[]/SECTORS{} above still power the historical charts and
   ticker strip only.                                                              */

// Re-classification fixes (keep 13 sectors, fix the flagged "Other"). Keyed by ticker
// (no cross-sector ticker collisions for these). TODO: port upstream into the classifier.
export const SECTOR_OVERRIDES={ASTER:'DeFi',GWEI:'Infrastructure',STZAMAZAMAKMS:'Infrastructure',TEN:'Payments'};
[typeof OVERVIEW_ASSETS!=='undefined'?OVERVIEW_ASSETS:[],typeof OVERVIEW_KEPT!=='undefined'?OVERVIEW_KEPT:[]]
  .forEach(arr=>arr.forEach(a=>{if(SECTOR_OVERRIDES[a.ticker])a.sector=SECTOR_OVERRIDES[a.ticker];}));

export const USECTOR_DESC={
  L1:'Foundational settlement blockchains with their own consensus and security. Core exposure to on-chain adoption and chain-level network effects — BTC and ETH anchor the group.',
  L2:'Rollups and scaling networks that inherit L1 security while lowering fees and raising throughput. The battleground for application activity as base layers mature.',
  DeFi:'Permissionless lending, trading, derivatives and liquidity protocols — the on-chain equivalents of exchanges, banks and market makers. TVL and fee revenue are the key metrics.',
  Infrastructure:'Oracles, bridges, indexing, data availability, identity and middleware — the plumbing every other protocol depends on. Lower beta, more defensive within crypto.',
  AI:'Decentralized compute, GPU networks and AI-agent coordination protocols building open markets for intelligence at the intersection of crypto incentives and AI demand.',
  DePIN:'Decentralized physical-infrastructure networks — storage, wireless, sensors and compute — that coordinate real hardware with token incentives.',
  Payments:'Value transfer, cross-border settlement and exchange/CeFi platform tokens. Crypto rails offer 24/7 global settlement that outpaces legacy correspondent banking.',
  Stablecoin:'Fiat-pegged and stability-focused assets used for liquidity, settlement and on-chain cash management — the dollar layer of the market.',
  Gaming:'Game, metaverse and consumer-entertainment tokens built around player ownership, in-game economies and creator monetization.',
  Meme:'Community- and culture-driven tokens whose value is shaped mainly by attention, internet-native narratives and liquidity cycles. Highest volatility, sized accordingly.',
  RWA:'Tokenized real-world assets — treasuries, credit, funds and commodities — bringing off-chain yield and collateral on-chain.',
  NFT:'Collectibles, marketplaces and NFT-infrastructure tokens tied to digital ownership and royalty economies.',
  Other:'Cross-functional or early-stage assets that do not yet map cleanly to a single category. Flagged for ongoing reclassification review.'
};
export const USECTORS={};
SECTOR_ORDER.forEach(k=>{const c=sectorColor(k);USECTORS[k]={label:SECTOR_LABELS[k]||k,color:c,bg:c+'14',desc:USECTOR_DESC[k]||''};});
export function uSectorMeta(k){return USECTORS[k]||{label:k,color:'#64748b',bg:'#f1f3f7',desc:''};}

export const cmcLogo=id=>`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`;
export function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
export function cleanName(n){return String(n||'').replace(/\s+on\s+[A-Za-z0-9 .\-]+$/,'').trim()||n;}
export function logoTag(a,cls){
  const c=sectorColor(a.sector);
  if(a.logo) return `<img class="${cls}" src="${cmcLogo(a.logo)}" alt="${esc(a.ticker)}" loading="lazy" data-tk="${esc(a.ticker)}" data-c="${c}" onerror="cmcLogoFail(this)">`;
  return `<span class="${cls} lf" style="background:${c}1a;color:${c}">${esc(a.ticker).slice(0,3)}</span>`;
}
export function cmcLogoFail(img){
  const tk=img.dataset.tk||'',c=img.dataset.c||'#94a3b8';
  const s=document.createElement('span');
  s.className=img.className+(img.className.includes('lf')?'':' lf');
  s.style.cssText=img.style.cssText;s.style.background=c+'1a';s.style.color=c;s.textContent=tk.slice(0,3);
  img.replaceWith(s);
}
export function animVal(el,to,fmtFn,dur){
  if(!el)return;dur=dur||650;
  const from=(typeof el._v==='number')?el._v:0;
  const seeded=el._seeded; el._seeded=true; el._v=to;
  // flash up/down tint only on genuine post-load updates (skip the initial count-up)
  if(seeded && to!==from && el.classList.contains('num-anim')){
    el.classList.remove('val-up','val-dn');
    void el.offsetWidth;
    el.classList.add(to>from?'val-up':'val-dn');
  }
  const t0=performance.now();
  function step(now){const k=Math.min(1,(now-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=fmtFn(from+(to-from)*e);if(k<1)requestAnimationFrame(step);}
  requestAnimationFrame(step);
}
export function fmtUsd(v){
  if(v==null||isNaN(v))return'—';
  if(v>=1000)return'$'+v.toLocaleString('en-US',{maximumFractionDigits:0});
  if(v>=1)return'$'+v.toFixed(2);
  if(v>=0.01)return'$'+v.toFixed(4);
  return'$'+v.toPrecision(2);
}
export function coinColor(ticker){
  const a=DATA.find(x=>x.t===ticker);
  return COIN_COLORS[ticker] || (a&&SECTORS[a.s]?.color) || '#64748b';
}
