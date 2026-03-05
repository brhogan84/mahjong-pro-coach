import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Trophy, RotateCcw, ArrowRight, Layers, Play, BookOpen, User, 
  Cpu, AlertCircle, ShieldAlert, ThumbsUp, TrendingUp, X, 
  Sparkles, Search, Target, Lightbulb, CheckCircle2, Zap, Pin, PinOff,
  Hand, Timer, Trash2, PlusCircle, Save, Trash, AlertTriangle, Info,
  Brain, HelpCircle, MessageSquare, ShieldCheck, GripVertical, SortAsc, ArrowUpDown, Ghost, Eye, EyeOff
} from 'lucide-react';

// --- CONSTANTS & TEMPLATES ---
const STANDARD_TEMPLATES = [
  { id: 1, section: "Year", name: "Year Kongs", type: "X", desc: "2 Flowers, Kongs of 2s, Soaps, and 6s", code: "FF222200006666", parts: [{t:"FF", c:"text-pink-500"}, {t:"2222", c:"text-blue-600"}, {t:"0000", c:"text-slate-400"}, {t:"6666", c:"text-green-600"}] },
  { id: 2, section: "Year", name: "Yearly Winds", type: "X", desc: "Kongs of N/S, Year in 2 suits", code: "NNNNSSSS20262026", parts: [{t:"NNNN SSSS", c:"text-slate-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}] },
  { id: 6, section: "Even", name: "Standard Evens", type: "X", desc: "Pungs of 2/8, Kongs of 4/6 in 2 suits", code: "22288844446666", parts: [{t:"222 888", c:"text-blue-600"}, {t:"4444 6666", c:"text-green-600"}] },
  { id: 11, section: "Odd", name: "Monocolor Odds", type: "X", desc: "Pungs 1/3, Kong 5, Pairs 7/9", code: "11133355557799", parts: [{t:"111 333 5555 77 99", c:"text-blue-600"}] },
  { id: 16, section: "Run", name: "Small Consecutive", type: "X", desc: "Pung/Kong/Pung/Kong 4 consecutive", code: "11122223334444", parts: [{t:"111 2222", c:"text-blue-600"}, {t:"333 4444", c:"text-green-600"}] },
  { id: 23, section: "Winds", name: "The Big Four", type: "X", desc: "Kongs of all four winds", code: "NNNNSSSSEEEEWWWW", parts: [{t:"NNNN SSSS EEEE WWWW", c:"text-slate-500"}] },
  { id: 29, section: "Quints", name: "Quint Run", type: "X", desc: "Quint of 1s and 2s, Flowers", code: "1111122222FFFF", parts: [{t:"11111 22222", c:"text-blue-600"}, {t:"FFFF", c:"text-pink-500"}] },
  { id: 32, section: "Pairs", name: "Big Odds Pair", type: "C", desc: "Pairs of all odds, Flowers, Dragons", code: "FF1133557799DD", parts: [{t:"FF", c:"text-pink-500"}, {t:"11 33 55 77 99", c:"text-blue-600"}, {t:"DD", c:"text-slate-400"}] }
];

const WINDS = ["East", "South", "West", "North"];
const COLORS = [{ name: 'Blue', class: 'text-blue-600' }, { name: 'Green', class: 'text-green-600' }, { name: 'Red', class: 'text-red-600' }, { name: 'Gray', class: 'text-slate-400' }, { name: 'Pink', class: 'text-pink-500' }];

// --- UTILS ---
const createDeck = () => {
  const d = [];
  ['dots', 'bams', 'cracks'].forEach(s => [1,2,3,4,5,6,7,8,9].forEach(n => { for(let i=0; i<4; i++) d.push({id:`${s}-${n}-${i}`, type:'number', val:n, suit:s}) }));
  ['N','S','E','W'].forEach(w => { for(let i=0; i<4; i++) d.push({id:`wind-${w}-${i}`, type:'wind', val:w}) });
  ['Green', 'Red', 'White'].forEach(dr => { for(let i=0; i<4; i++) d.push({id:`drag-${dr}-${i}`, type:'dragon', val:dr}) });
  for(let i=0; i<8; i++) d.push({id:`f-${i}`, type:'flower', val:'F'});
  for(let i=0; i<8; i++) d.push({id:`j-${i}`, type:'joker', val:'J'});
  return d.sort(() => Math.random() - 0.5);
};

const Tile = ({ tile, onClick, isSelected, size = "md", disabled = false, isExposed = false, isMoving = false, hidden = false, countOverlay }) => {
  if (!tile) return null;
  if (hidden && !isExposed) return (
    <div className={`w-10 h-14 bg-slate-800 border-2 border-slate-700 rounded-xl m-0.5 shadow-inner opacity-40`} />
  );

  const getStyle = () => {
    if (disabled) return 'bg-gray-100 border-gray-200 text-gray-400 opacity-40 grayscale cursor-not-allowed';
    if (isMoving) return 'bg-blue-100 border-blue-500 ring-4 ring-blue-300 scale-110 -translate-y-4 z-50 shadow-2xl';
    if (isExposed) return 'bg-slate-200 border-slate-400 text-slate-700 shadow-inner scale-90';
    if (tile.type === 'flower') return 'bg-pink-50 border-pink-300 text-pink-700';
    if (tile.type === 'joker') return 'bg-purple-100 border-purple-400 text-purple-800 font-bold italic';
    if (tile.type === 'wind') return 'bg-gray-50 border-gray-300 text-gray-800';
    if (tile.type === 'dragon') {
      if (tile.val === 'Green') return 'bg-green-50 border-green-300 text-green-700';
      if (tile.val === 'Red') return 'bg-red-50 border-red-300 text-red-700';
      return 'bg-blue-50 border-blue-300 text-blue-700';
    }
    if (tile.suit === 'dots') return 'bg-blue-50 border-blue-200 text-blue-600';
    if (tile.suit === 'bams') return 'bg-green-50 border-green-200 text-green-600';
    return 'bg-red-50 border-red-200 text-red-600';
  };
  
  const sizes = { sm: "w-7 h-9 text-[10px]", md: "w-10 h-14 text-xs", lg: "w-14 h-20 text-lg" };
  return (
    <div onClick={disabled ? null : onClick} className={`${sizes[size]} flex-shrink-0 relative cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl shadow-sm m-0.5 transition-all transform ${!disabled && !isExposed && !isMoving && 'hover:-translate-y-1 active:scale-95'} ${getStyle()} ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-2' : ''}`}>
      <span className="font-bold leading-none select-none">{(tile.val === 0 || tile.val === 'White') ? '0' : tile.val}</span>
      {tile.suit && <span className="text-[10px] uppercase opacity-60 font-black mt-1 select-none">{tile.suit[0]}</span>}
      {countOverlay !== undefined && countOverlay > 0 && (
        <div className="absolute -bottom-1 -right-1 bg-red-600 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white shadow-sm">{countOverlay}</div>
      )}
    </div>
  );
};

const HandCode = ({ parts }) => (
  <div className="flex flex-wrap gap-1 font-mono text-[10px] font-black tracking-widest leading-none">
    {parts?.map((p, i) => <span key={i} className={p.c}>{p.t}</span>)}
  </div>
);

// --- MAIN APP ---
export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, setup, charleston, playing, finished
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([
    { id: 0, type: 'human', hand: [], exposures: [], wind: 'East', selectedIndices: [], drawnTile: null },
    { id: 1, type: 'ghost', hand: [], exposures: [], wind: 'South', selectedIndices: [], drawnTile: null },
    { id: 2, type: 'ghost', hand: [], exposures: [], wind: 'West', selectedIndices: [], drawnTile: null },
    { id: 3, type: 'ghost', hand: [], exposures: [], wind: 'North', selectedIndices: [], drawnTile: null }
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0); // Which player's physical turn it is
  const [activeHumanView, setActiveHumanView] = useState(0); // Which hand the user is currently managing
  const [charlestonStep, setCharlestonStep] = useState(0);
  const [discards, setDiscards] = useState([]);
  const [claimableTile, setClaimableTile] = useState(null);
  const [claimTimer, setClaimTimer] = useState(0);
  const [isClaimingMode, setIsClaimingMode] = useState(false);
  const [message, setMessage] = useState("V12.0 Table Ready");
  const [showCard, setShowCard] = useState(false);
  const [showDeadTiles, setShowDeadTiles] = useState(false);
  const [pinnedHandIds, setPinnedHandIds] = useState([]);
  
  // Interaction Logic
  const [movingIndex, setMovingIndex] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickIndex, setLastClickIndex] = useState(null);
  const timerRef = useRef(null);

  // Configuration
  const [numHumans, setNumHumans] = useState(1);
  const [includeGhosts, setIncludeGhosts] = useState(true);

  // Logic: Dead tiles (derived)
  const deadTileCounts = useMemo(() => {
    const counts = {};
    discards.forEach(t => {
      const v = (t.val === 0 || t.val === 'White') ? '0' : t.val.toString();
      const s = t.suit || t.type;
      counts[`${v}-${s}`] = (counts[`${v}-${s}`] || 0) + 1;
    });
    return counts;
  }, [discards]);

  const initGame = () => {
    const fullDeck = createDeck();
    const tempPlayers = [];
    const charPassSteps = ["Right", "Over", "Left", "Left", "Over", "Right"];
    
    // Assign 13 tiles to each
    for (let i = 0; i < 4; i++) {
      const hand = fullDeck.splice(0, 13);
      tempPlayers.push({
        id: i,
        type: i < numHumans ? 'human' : (includeGhosts ? 'ghost' : 'vacant'),
        hand: hand.sort((a,b) => (a.suit||a.type).localeCompare(b.suit||b.type)),
        exposures: [],
        wind: WINDS[i],
        selectedIndices: [],
        drawnTile: null
      });
    }

    setDeck(fullDeck);
    setPlayers(tempPlayers);
    setCharlestonStep(0);
    setActivePlayerIndex(0); // East starts
    setActiveHumanView(0); // Start with Hand 1
    setGameState('charleston');
    setMessage("Charleston Pass 1: " + charPassSteps[0]);
  };

  // AI Helper: Select 3 outliers for ghost pass
  const getGhostPassIndices = (player) => {
    const counts = {}; 
    player.hand.forEach(t => { const k = `${t.val}-${t.suit||''}`; counts[k] = (counts[k]||0)+1; });
    const scored = player.hand.map((t, i) => {
      if (t.type === 'joker' || t.type === 'flower') return { i, s: 100 };
      let s = (counts[`${t.val}-${t.suit||''}`] > 1) ? 50 : 0;
      s += player.hand.filter(h => h.suit === t.suit).length * 2;
      return { i, s };
    });
    return scored.sort((a,b) => a.s - b.s).slice(0,3).map(x => x.i);
  };

  const processPassRound = () => {
    const charPassSteps = ["Right", "Over", "Left", "Left", "Over", "Right"];
    // 1. Ensure all humans have selected 3
    const humans = players.filter(p => p.type === 'human');
    if (humans.some(h => h.selectedIndices.length !== 3)) {
      setMessage("Wait! All active human hands must select 3 tiles to pass.");
      return;
    }

    // 2. Perform Pass Logic
    const newPlayers = [...players];
    const passOffsets = { "Right": 1, "Left": -1, "Over": 2 };
    const stepName = charPassSteps[charlestonStep];
    const offset = passOffsets[stepName];

    // Collect outgoing tiles
    const outgoing = players.map(p => {
      const idxs = p.type === 'human' ? p.selectedIndices : getGhostPassIndices(p);
      const tiles = idxs.map(i => p.hand[i]);
      const remainingHand = p.hand.filter((_, i) => !idxs.includes(i));
      return { tiles, remainingHand };
    });

    // Distribute incoming tiles
    outgoing.forEach((out, i) => {
      const targetIdx = (i + offset + 4) % 4;
      newPlayers[targetIdx].hand = [...outgoing[targetIdx].remainingHand, ...out.tiles];
      newPlayers[i].selectedIndices = [];
    });

    setPlayers(newPlayers);
    if (charlestonStep < 5) {
      setCharlestonStep(p => p + 1);
      setMessage(`Pass ${charlestonStep + 2}: ${charPassSteps[charlestonStep+1]}`);
    } else {
      setGameState('playing');
      setMessage("Game Started. East's Turn.");
    }
  };

  const handleTileClick = (pIdx, tIdx) => {
    if (pIdx !== activeHumanView) return; // Only interact with visible hand
    const now = Date.now();
    
    // Reorder logic (Double Tap)
    if (movingIndex !== null) {
      if (movingIndex === tIdx) setMovingIndex(null);
      else {
        const newPlayers = [...players];
        const p = newPlayers[pIdx];
        const [moved] = p.hand.splice(movingIndex, 1);
        p.hand.splice(tIdx, 0, moved);
        setPlayers(newPlayers); setMovingIndex(null);
      }
      return;
    }
    if (now - lastClickTime < 350 && lastClickIndex === tIdx) {
      setMovingIndex(tIdx); return;
    }
    setLastClickTime(now); setLastClickIndex(tIdx);

    // Selection Logic
    if (gameState === 'charleston') {
      const newPlayers = [...players];
      const p = newPlayers[pIdx];
      if (p.hand[tIdx].type === 'joker') return; // Cannot pass jokers
      if (p.selectedIndices.includes(tIdx)) p.selectedIndices = p.selectedIndices.filter(x => x !== tIdx);
      else if (p.selectedIndices.length < 3) p.selectedIndices.push(tIdx);
      setPlayers(newPlayers);
    } else if (gameState === 'playing' && activePlayerIndex === pIdx) {
       // Discard Logic? Hand handled via "Discard" button below table
    }
  };

  const nextTurn = () => {
    const nextIdx = (activePlayerIndex + 1) % 4;
    setActivePlayerIndex(nextIdx);
    
    const p = players[nextIdx];
    if (p.type === 'ghost') {
      // Auto Draw for ghost
      const dCopy = [...deck];
      const drawn = dCopy.shift();
      setDeck(dCopy);
      
      // Auto Discard for ghost (Basic Logic: Keep Jokers/Flowers)
      const fullHand = [...p.hand, drawn];
      const discardIdx = fullHand.findIndex(t => t.type !== 'joker' && t.type !== 'flower');
      const finalIdx = discardIdx === -1 ? 0 : discardIdx;
      const discarded = fullHand[finalIdx];
      const newHand = fullHand.filter((_, i) => i !== finalIdx);

      // Trigger Claim Modal for Humans
      setClaimableTile(discarded);
      setClaimTimer(5);
      const updatedPlayers = [...players];
      updatedPlayers[nextIdx].hand = newHand;
      setPlayers(updatedPlayers);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setClaimTimer(t => {
          if (t <= 1) { 
            clearInterval(timerRef.current); 
            setDiscards(prev => [discarded, ...prev]);
            setClaimableTile(null);
            nextTurn(); // Recursively move to next
            return 0; 
          }
          return t - 1;
        });
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex-none p-3 bg-slate-800 flex justify-between items-center border-b-2 border-orange-600">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <h1 className="text-sm font-black uppercase tracking-tighter">Pro Coach V12</h1>
        </div>
        <div className="flex gap-1.5">
          {gameState === 'playing' && (
            <div className="flex bg-slate-700 rounded-lg p-0.5">
              {players.filter(p => p.type === 'human').map(p => (
                <button 
                  key={p.id}
                  onClick={() => setActiveHumanView(p.id)}
                  className={`px-2 py-1 text-[8px] font-black uppercase rounded ${activeHumanView === p.id ? 'bg-orange-600 text-white' : 'text-slate-400'}`}
                >H{p.id + 1}</button>
              ))}
            </div>
          )}
          <button onClick={() => setGameState('menu')} className="p-1.5 bg-slate-700 rounded-lg"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 relative">
        
        {/* VIEW: MENU */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
            <Layers className="w-16 h-16 text-orange-500 mb-6" />
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Table Simulator</h2>
            <p className="max-w-xs text-xs text-slate-400 mb-10 italic">Practice American Mahjong with multi-hand control or Ghost opponents.</p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => setGameState('setup')} className="bg-orange-600 py-4 rounded-2xl font-black text-lg uppercase shadow-xl">Single Player</button>
              <button className="bg-slate-800 py-4 rounded-2xl font-black text-lg uppercase opacity-50 cursor-not-allowed">Online (Coming Soon)</button>
            </div>
          </div>
        )}

        {/* VIEW: SETUP */}
        {gameState === 'setup' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-4">
             <div className="bg-slate-800 p-8 rounded-[3rem] w-full max-w-sm border-2 border-slate-700 shadow-2xl space-y-6">
                <h3 className="text-xl font-black uppercase text-center border-b border-slate-700 pb-4">Table Setup</h3>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500">Human Hands</label>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(n => (
                      <button key={n} onClick={() => setNumHumans(n)} className={`flex-1 py-3 rounded-xl font-black border-2 transition-all ${numHumans === n ? 'bg-blue-600 border-blue-400' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>{n}</button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-slate-700">
                  <label className="text-[10px] font-black uppercase text-slate-500">Include Ghosts?</label>
                  <button onClick={() => setIncludeGhosts(!includeGhosts)} className={`w-12 h-6 rounded-full relative transition-all ${includeGhosts ? 'bg-green-600' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${includeGhosts ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>

                <button onClick={initGame} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-orange-500">Deal Tiles</button>
             </div>
          </div>
        )}

        {/* VIEW: GAMEBOARD */}
        {(gameState === 'charleston' || gameState === 'playing') && (
          <div className="flex flex-col h-full p-2 gap-2">
             
             {/* TOP / SIDES AREA */}
             <div className="flex-none h-24 grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700">
                   <p className="text-[8px] font-black text-slate-500 uppercase">{WINDS[(activeHumanView + 3) % 4]}</p>
                   <Ghost className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700 ring-2 ring-blue-500/20">
                   <p className="text-[8px] font-black text-slate-500 uppercase">{WINDS[(activeHumanView + 2) % 4]}</p>
                   <User className="w-6 h-6 text-slate-600" />
                </div>
                <div className="flex flex-col items-center justify-center bg-slate-800/50 rounded-2xl border border-slate-700">
                   <p className="text-[8px] font-black text-slate-500 uppercase">{WINDS[(activeHumanView + 1) % 4]}</p>
                   <Ghost className="w-6 h-6 text-slate-600" />
                </div>
             </div>

             {/* DISCARD CENTER */}
             <div className="flex-1 bg-slate-950/50 border-2 border-slate-800 rounded-[2.5rem] flex flex-col p-4 shadow-inner relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                  {claimableTile ? (
                    <div className="bg-orange-600 p-4 rounded-3xl shadow-2xl animate-in zoom-in border-4 border-orange-400">
                       <div className="text-center mb-2"><span className="text-[10px] font-black uppercase text-orange-200">CLAIM WINDOW {claimTimer}s</span></div>
                       <Tile tile={claimableTile} size="lg" isClaimable={true} />
                    </div>
                  ) : (
                    <div className="text-center opacity-10">
                      <Search className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-[10px] font-black uppercase">Live Discards</p>
                    </div>
                  )}
                </div>
                
                {/* DISCARD MINI TRAY */}
                <div className="flex-none h-12 bg-slate-900 rounded-2xl p-1 overflow-x-auto flex items-center gap-1 border border-slate-800">
                   {discards.slice(0, 20).map((t, i) => <Tile key={i} tile={t} size="sm" isExposed={true} />)}
                </div>
             </div>

             {/* ACTIVE HUMAN RACK */}
             <div className="flex-none bg-slate-800 p-3 rounded-[2rem] border-t-4 border-blue-500 shadow-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">{players[activeHumanView].wind}</div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hand {activeHumanView + 1}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => sortHand('suit')} className="p-2 bg-slate-700 rounded-lg text-[8px] font-black uppercase">Suit</button>
                    <button onClick={() => sortHand('val')} className="p-2 bg-slate-700 rounded-lg text-[8px] font-black uppercase">Val</button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-0.5 min-h-[60px]">
                  {players[activeHumanView].hand.map((t, i) => (
                    <Tile 
                      key={t.id} 
                      tile={t} 
                      onClick={() => handleTileClick(activeHumanView, i)} 
                      isSelected={players[activeHumanView].selectedIndices.includes(i)}
                      isMoving={movingIndex === i}
                      size="md"
                    />
                  ))}
                  {gameState === 'playing' && activePlayerIndex === activeHumanView && (
                    <div className="ml-2 pl-2 border-l border-slate-600 flex items-center">
                       {players[activeHumanView].drawnTile ? (
                         <Tile tile={players[activeHumanView].drawnTile} size="lg" isSelected={true} />
                       ) : (
                         <button className="w-12 h-16 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-colors"><Play className="w-6 h-6" /></button>
                       )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-2">
                   {gameState === 'charleston' ? (
                     <button 
                       onClick={processPassRound}
                       disabled={players[activeHumanView].selectedIndices.length !== 3}
                       className={`w-full py-3 rounded-xl font-black uppercase text-sm shadow-lg transition-all ${players[activeHumanView].selectedIndices.length === 3 ? 'bg-orange-600' : 'bg-slate-700 text-slate-500'}`}
                     >
                       Confirm Pass
                     </button>
                   ) : (
                     <div className="flex gap-2 w-full">
                        <button onClick={() => setShowDeadTiles(true)} className="flex-1 bg-red-900/40 py-3 rounded-xl text-[10px] font-black uppercase border border-red-800">Dead Tracker</button>
                        <button className="flex-1 bg-slate-700 py-3 rounded-xl text-[10px] font-black uppercase">Identify Path</button>
                        <button className="flex-1 bg-green-600 py-3 rounded-xl text-[10px] font-black uppercase">Mahjong</button>
                     </div>
                   )}
                </div>
             </div>
          </div>
        )}
      </div>

      {/* OVERLAY: DEAD TILES */}
      {showDeadTiles && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-800 w-full max-w-4xl max-h-[85vh] rounded-[3rem] border-2 border-slate-700 overflow-hidden flex flex-col shadow-2xl">
            <div className="p-6 bg-slate-700 flex justify-between items-center">
              <h3 className="font-black uppercase tracking-widest flex items-center gap-2"><Trash2 className="w-5 h-5 text-red-500" /> Dead Tracker</h3>
              <button onClick={() => setShowDeadTiles(false)} className="p-2 hover:bg-slate-600 rounded-full"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
               <DeadTileGrid />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// MOUNTING BRIDGE
const rootElement = document.getElementById('root');
if (rootElement && !rootElement._reactRootContainer) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
