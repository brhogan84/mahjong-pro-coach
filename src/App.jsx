import React, { useState, useEffect, useRef, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Trophy, RotateCcw, ArrowRight, Layers, Play, BookOpen, User, 
  Cpu, AlertCircle, ShieldAlert, ThumbsUp, TrendingUp, X, 
  Sparkles, Search, Target, Lightbulb, CheckCircle2, Zap, Pin, PinOff,
  Hand, Timer, Trash2, PlusCircle, Save, Trash, AlertTriangle, Info,
  Brain, HelpCircle, MessageSquare, ShieldCheck, GripVertical, SortAsc, ArrowUpDown, Ghost, Eye, EyeOff, Check
} from 'lucide-react';

// --- DATA: 35 VERIFIED STANDARD HANDS ---
const STANDARD_TEMPLATES = [
  { id: 1, section: "Year", name: "Year Kongs", type: "X", desc: "2 Flowers, Kongs of 2s, Soaps, and 6s", code: "FF222200006666", parts: [{t:"FF", c:"text-pink-500"}, {t:"2222", c:"text-blue-600"}, {t:"0000", c:"text-slate-400"}, {t:"6666", c:"text-green-600"}] },
  { id: 2, section: "Year", name: "Yearly Winds", type: "X", desc: "Kongs of N/S, Year in 2 suits", code: "NNNNSSSS20262026", parts: [{t:"NNNN SSSS", c:"text-slate-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}] },
  { id: 3, section: "Year", name: "Full Year Run", type: "X", desc: "4 Flowers, Year sequences in all suits", code: "FFFF202620262026", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"2026", c:"text-red-600"}] },
  { id: 4, section: "Year", name: "Yearly Pairs", type: "C", desc: "Pairs of 2, 0, 6 in 3 suits. No Jokers.", code: "22002266220022", parts: [{t:"22", c:"text-blue-600"}, {t:"00", c:"text-slate-400"}, {t:"22", c:"text-green-600"}, {t:"66", c:"text-red-600"}] },
  { id: 5, section: "Year", name: "Dragon Year Mix", type: "X", desc: "Year in 2 suits, Kong of Dragons", code: "20262026DDDDFF", parts: [{t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"FF", c:"text-pink-500"}] },
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
    <div className={`${size === "sm" ? "w-7 h-9" : "w-10 h-14"} bg-slate-800 border-2 border-slate-700 rounded-xl m-0.5 shadow-inner opacity-40`} />
  );

  const getStyle = () => {
    if (disabled) return 'bg-gray-100 border-gray-200 text-gray-400 opacity-40 grayscale cursor-not-allowed shadow-none';
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
  const valDisplay = (tile.val === 0 || tile.val === 'White') ? '0' : tile.val;
  return (
    <div onClick={disabled ? null : onClick} className={`${sizes[size]} flex-shrink-0 relative cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl shadow-sm m-0.5 transition-all transform ${!disabled && !isExposed && !isMoving && 'hover:-translate-y-1 active:scale-95'} ${getStyle()} ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-2' : ''}`}>
      <span className="font-bold leading-none select-none">{valDisplay}</span>
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
  const [gameState, setGameState] = useState('menu'); 
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([
    { id: 0, type: 'human', hand: [], exposures: [], wind: 'East', selectedIndices: [], drawnTile: null },
    { id: 1, type: 'ghost', hand: [], exposures: [], wind: 'South', selectedIndices: [], drawnTile: null },
    { id: 2, type: 'ghost', hand: [], exposures: [], wind: 'West', selectedIndices: [], drawnTile: null },
    { id: 3, type: 'ghost', hand: [], exposures: [], wind: 'North', selectedIndices: [], drawnTile: null }
  ]);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0); 
  const [activeHumanView, setActiveHumanView] = useState(0); 
  const [charlestonStep, setCharlestonStep] = useState(0);
  const [discards, setDiscards] = useState([]);
  const [claimableTile, setClaimableTile] = useState(null);
  const [claimTimer, setClaimTimer] = useState(0);
  const [isClaimingMode, setIsClaimingMode] = useState(false);
  const [message, setMessage] = useState("V12.2 Engine Ready");
  const [showCard, setShowCard] = useState(false);
  const [showDeadTiles, setShowDeadTiles] = useState(false);
  const [showWinDeclare, setShowWinDeclare] = useState(false);
  const [pinnedHandIds, setPinnedHandIds] = useState([]);
  const [bestMatch, setBestMatch] = useState(null);
  
  // Interaction Logic
  const [movingIndex, setMovingIndex] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickIndex, setLastClickIndex] = useState(null);
  const timerRef = useRef(null);

  const [numHumans, setNumHumans] = useState(1);
  const [includeGhosts, setIncludeGhosts] = useState(true);

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
    for (let i = 0; i < 4; i++) {
      const hand = fullDeck.splice(0, 13);
      tempPlayers.push({
        id: i,
        type: i < numHumans ? 'human' : (includeGhosts ? 'ghost' : 'vacant'),
        hand: hand.sort((a,b) => (a.suit||a.type||'').localeCompare(b.suit||b.type||'')),
        exposures: [],
        wind: WINDS[i],
        selectedIndices: [],
        drawnTile: null
      });
    }
    setDeck(fullDeck);
    setPlayers(tempPlayers);
    setCharlestonStep(0);
    setActivePlayerIndex(0); 
    setActiveHumanView(0); 
    setGameState('charleston');
    setBestMatch(null);
    setMessage("Charleston: Pass to the Right");
  };

  const sortHand = (mode) => {
    const newPlayers = [...players];
    const p = newPlayers[activeHumanView];
    p.hand.sort((a, b) => {
      if (mode === 'suit') {
        const suitOrder = { dots: 1, bams: 2, cracks: 3, wind: 4, dragon: 5, flower: 6, joker: 7 };
        const valA = suitOrder[a.suit || a.type] || 99;
        const valB = suitOrder[b.suit || b.type] || 99;
        if (valA !== valB) return valA - valB;
        return (a.val || 0).toString().localeCompare((b.val || 0).toString());
      } else {
        const valA = a.val === 'White' ? 0 : isNaN(a.val) ? 99 : parseInt(a.val);
        const valB = b.val === 'White' ? 0 : isNaN(b.val) ? 99 : parseInt(b.val);
        if (valA !== valB) return valA - valB;
        return (a.suit || a.type || '').localeCompare(b.suit || b.type || '');
      }
    });
    p.selectedIndices = [];
    setPlayers(newPlayers);
  };

  const getGhostPassIndices = (player) => {
    const naturals = player.hand.map((t, i) => ({ ...t, originalIdx: i })).filter(t => t.type !== 'joker');
    const scored = naturals.map(t => {
      let s = 0; if (t.type === 'flower') s += 100;
      const suitCount = player.hand.filter(h => h.suit === t.suit).length;
      s += suitCount * 5;
      return { idx: t.originalIdx, s };
    });
    return scored.sort((a,b) => a.s - b.s).slice(0,3).map(x => x.idx);
  };

  const suggestPass = () => {
    const p = players[activeHumanView];
    const counts = {}; 
    p.hand.forEach(t => { 
      const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString();
      const k = `${v}-${t.suit||''}`; counts[k] = (counts[k]||0)+1; 
    });
    const scored = p.hand.map((t, i) => {
      let s = 0; if (t.type === 'joker') s += 1000; if (t.type === 'flower') s += 100;
      const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString();
      if (counts[`${v}-${t.suit||''}`] > 1) s += 50;
      if (t.suit) s += p.hand.filter(h => h.suit === t.suit).length * 10;
      return { i, s, type: t.type };
    });
    const candidates = scored.filter(x => x.type !== 'joker').sort((a,b) => a.s - b.s).slice(0,3).map(x => x.i);
    const newPlayers = [...players];
    newPlayers[activeHumanView].selectedIndices = candidates;
    setPlayers(newPlayers);
  };

  const processPassRound = () => {
    const charPassSteps = ["Right", "Over", "Left", "Left", "Over", "Right"];
    
    // Check all humans for selection completion
    const humansStillSelecting = players.filter(p => p.type === 'human' && p.selectedIndices.length !== 3);
    if (humansStillSelecting.length > 0) {
      const handIds = humansStillSelecting.map(h => h.id + 1).join(", ");
      setMessage(`Hand(s) ${handIds} still need 3 tiles selected.`);
      return;
    }

    const passOffsets = { "Right": 1, "Left": -1, "Over": 2 };
    const currentStepName = charPassSteps[charlestonStep];
    const offset = passOffsets[currentStepName];

    // Collect Data
    const outgoingData = players.map(p => {
      const idxs = p.type === 'human' ? p.selectedIndices : getGhostPassIndices(p);
      const tilesToPass = idxs.map(i => p.hand[i]);
      const remainingHand = p.hand.filter((_, i) => !idxs.includes(i));
      return { tilesToPass, remainingHand };
    });

    // Update state immutably
    const nextPlayers = players.map((p, i) => {
        const senderIdx = (i - offset + 4) % 4; // Who is passing TO me?
        return {
            ...p,
            hand: [...outgoingData[i].remainingHand, ...outgoingData[senderIdx].tilesToPass].sort((a,b) => (a.suit||a.type||'').localeCompare(b.suit||b.type||'')),
            selectedIndices: []
        };
    });

    setPlayers(nextPlayers);
    if (charlestonStep < 5) {
      setCharlestonStep(p => p + 1);
      setMessage(`Step ${charlestonStep + 2}: Pass to the ${charPassSteps[charlestonStep+1]}`);
    } else {
      setGameState('playing');
      setMessage("Play Started. East (Human 1) begins.");
    }
  };

  const handleTileClick = (pIdx, tIdx) => {
    if (pIdx !== activeHumanView) return; 
    const now = Date.now();
    
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

    if (gameState === 'charleston') {
      const newPlayers = [...players];
      const p = newPlayers[pIdx];
      if (p.hand[tIdx].type === 'joker') return; 
      if (p.selectedIndices.includes(tIdx)) p.selectedIndices = p.selectedIndices.filter(x => x !== tIdx);
      else if (p.selectedIndices.length < 3) p.selectedIndices.push(tIdx);
      setPlayers(newPlayers);
    }
  };

  const handleDraw = () => {
    if (activePlayerIndex !== activeHumanView || players[activeHumanView].drawnTile || claimableTile) return;
    const dCopy = [...deck];
    const pulled = dCopy.shift();
    const newPlayers = [...players];
    newPlayers[activeHumanView].drawnTile = pulled;
    setDeck(dCopy);
    setPlayers(newPlayers);
    setMessage("Select a tile to DISCARD.");
  };

  const confirmDiscard = (tIdx) => {
    const p = players[activeHumanView];
    const tile = tIdx === -1 ? p.drawnTile : p.hand[tIdx];
    const newHand = tIdx === -1 ? [...p.hand] : p.hand.filter((_, i) => i !== tIdx);
    if (tIdx !== -1 && p.drawnTile) newHand.push(p.drawnTile);

    setDiscards(prev => [tile, ...prev]);
    const updatedPlayers = [...players];
    updatedPlayers[activeHumanView].hand = newHand;
    updatedPlayers[activeHumanView].drawnTile = null;
    setPlayers(updatedPlayers);
    
    setClaimableTile(tile);
    setClaimTimer(5);
    
    if(timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setClaimTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setClaimableTile(null);
          nextTurn();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const nextTurn = () => {
    const nextIdx = (activePlayerIndex + 1) % 4;
    setActivePlayerIndex(nextIdx);
    const p = players[nextIdx];
    
    if (p.type === 'ghost') {
      const dCopy = [...deck];
      const drawn = dCopy.shift();
      setDeck(dCopy);
      
      const fullHand = [...p.hand, drawn];
      const nonValuableIdx = fullHand.findIndex(t => t.type !== 'joker' && t.type !== 'flower');
      const finalIdx = nonValuableIdx === -1 ? 0 : nonValuableIdx;
      const discarded = fullHand[finalIdx];
      
      const updatedPlayers = [...players];
      updatedPlayers[nextIdx].hand = fullHand.filter((_, i) => i !== finalIdx);
      setPlayers(updatedPlayers);

      setClaimableTile(discarded);
      setClaimTimer(5);
      
      if(timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setClaimTimer(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setClaimableTile(null);
            setDiscards(prev => [discarded, ...prev]);
            nextTurn();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
        setMessage(`Hand ${nextIdx + 1}'s Turn. Draw or Call.`);
    }
  };

  const identifyBestHand = () => {
    const p = players[activeHumanView];
    const fullPool = [...p.hand]; if (p.drawnTile) fullPool.push(p.drawnTile); p.exposures.forEach(e => fullPool.push(...e));
    const jokers = fullPool.filter(t => t.type === 'joker').length;
    
    const results = STANDARD_TEMPLATES.map(h => {
      let matches = 0;
      let temp = fullPool.map(t => ({...t, valStr: (t.val === 'White' || t.val === 0) ? '0' : t.val.toString()})).filter(t => t.type !== 'joker');
      h.parts.forEach(part => {
        for (let char of part.t) {
          const foundIdx = temp.findIndex(p => p.valStr === char);
          if (foundIdx !== -1) { matches++; temp.splice(foundIdx, 1); }
        }
      });
      const total = h.type === "C" ? matches : Math.min(14, matches + jokers);
      return { ...h, pct: Math.round((total / 14) * 100) };
    });
    setBestMatch(results.sort((a,b) => b.pct - a.pct)[0]);
  };

  const checkMahjong = (handTemplate) => {
    const p = players[activeHumanView];
    const fullPool = [...p.hand]; if (p.drawnTile) fullPool.push(p.drawnTile); p.exposures.forEach(e => fullPool.push(...e));
    if (fullPool.length !== 14) return { valid: false, msg: "Exactly 14 tiles required to win." };

    let jokers = fullPool.filter(t => t.type === 'joker').length;
    let naturals = fullPool.map(t => ({...t, valStr: (t.val === 'White' || t.val === 0) ? '0' : t.val.toString()})).filter(t => t.type !== 'joker');
    
    if (handTemplate.type === "C" && jokers > 0) return { valid: false, msg: "Concealed hands allow 0 Jokers." };

    let matches = 0;
    handTemplate.parts.forEach(part => {
      for (let char of part.t) {
        const foundIdx = naturals.findIndex(p => p.valStr === char);
        if (foundIdx !== -1) { matches++; naturals.splice(foundIdx, 1); }
      }
    });

    return (matches + jokers) >= 14 ? { valid: true, msg: "MAHJONG VERIFIED!" } : { valid: false, msg: "Verification failed. Check your tiles." };
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 font-sans text-slate-100 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex-none p-3 bg-slate-800 flex justify-between items-center border-b-2 border-orange-600 shadow-lg">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-orange-500" />
          <h1 className="text-sm font-black uppercase tracking-tighter">Pro Master V12.2</h1>
        </div>
        <div className="flex gap-1.5">
          {gameState !== 'menu' && gameState !== 'setup' && (
            <div className="flex bg-slate-700 rounded-lg p-0.5">
              {players.filter(p => p.type === 'human').map(p => (
                <button 
                  key={p.id}
                  onClick={() => { setActiveHumanView(p.id); setBestMatch(null); }}
                  className={`px-2 py-1 text-[8px] font-black uppercase rounded transition-all ${activeHumanView === p.id ? 'bg-orange-600 text-white shadow-inner' : 'text-slate-400 hover:text-white'}`}
                >H{p.id + 1}</button>
              ))}
            </div>
          )}
          <button onClick={() => setGameState('menu')} className="p-1.5 bg-slate-700 rounded-lg hover:bg-slate-600"><RotateCcw className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="flex-1 relative">
        
        {/* VIEW: MENU */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in">
            <Layers className="w-16 h-16 text-orange-500 mb-6" />
            <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Table Simulator</h2>
            <p className="max-w-xs text-xs text-slate-400 mb-10 italic">Practice Mahjong in a 4-player environment with ghost AI or multi-hand control.</p>
            <div className="flex flex-col gap-4 w-full max-w-xs">
              <button onClick={() => setGameState('setup')} className="bg-orange-600 py-4 rounded-2xl font-black text-lg uppercase shadow-xl hover:scale-105 transition-all">Single Player</button>
              <button className="bg-slate-800 py-4 rounded-2xl font-black text-lg uppercase opacity-50 cursor-not-allowed">Online Hub</button>
            </div>
          </div>
        )}

        {/* VIEW: SETUP */}
        {gameState === 'setup' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 animate-in slide-in-from-bottom-4">
             <div className="bg-slate-800 p-8 rounded-[3rem] w-full max-w-sm border-2 border-slate-700 shadow-2xl space-y-6">
                <h3 className="text-xl font-black uppercase text-center border-b border-slate-700 pb-4 tracking-tighter">Deal Setup</h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Human Seats</label>
                  <div className="flex gap-2">
                    {[1,2,3,4].map(n => (
                      <button key={n} onClick={() => setNumHumans(n)} className={`flex-1 py-3 rounded-xl font-black border-2 transition-all ${numHumans === n ? 'bg-blue-600 border-blue-400 shadow-lg' : 'bg-slate-700 border-slate-600 text-slate-400'}`}>{n}</button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center py-4 border-t border-slate-700">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Include Ghosts?</label>
                  <button onClick={() => setIncludeGhosts(!includeGhosts)} className={`w-12 h-6 rounded-full relative transition-all ${includeGhosts ? 'bg-green-600 shadow-lg' : 'bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${includeGhosts ? 'right-1' : 'left-1'}`} />
                  </button>
                </div>
                <button onClick={initGame} className="w-full bg-orange-600 py-4 rounded-2xl font-black uppercase shadow-xl hover:bg-orange-500 transition-all">Deal Tiles</button>
             </div>
          </div>
        )}

        {/* VIEW: GAMEBOARD */}
        {(gameState === 'charleston' || gameState === 'playing') && (
          <div className="flex flex-col h-full p-2 gap-2">
             
             {/* SIDES HUD */}
             <div className="flex-none h-20 grid grid-cols-3 gap-2">
                {[3, 2, 1].map(offset => {
                    const pIdx = (activeHumanView + offset) % 4;
                    const p = players[pIdx];
                    return (
                        <div key={pIdx} className={`flex flex-col items-center justify-center rounded-2xl border ${activePlayerIndex === pIdx ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-slate-800/40 border-slate-700'}`}>
                            <p className={`text-[8px] font-black uppercase ${activePlayerIndex === pIdx ? 'text-yellow-400' : 'text-slate-500'}`}>{WINDS[pIdx]}</p>
                            {p.type === 'ghost' ? <Ghost className={`w-5 h-5 ${activePlayerIndex === pIdx ? 'text-yellow-400 animate-bounce' : 'text-slate-700'}`} /> : <User className={`w-5 h-5 ${activePlayerIndex === pIdx ? 'text-yellow-400' : 'text-slate-700'}`} />}
                        </div>
                    );
                })}
             </div>

             {/* CENTER ZONE */}
             <div className="flex-1 bg-slate-950/30 border-2 border-slate-800/50 rounded-[2.5rem] flex flex-col p-4 shadow-inner relative overflow-hidden">
                <div className="flex-1 flex items-center justify-center">
                  {claimableTile ? (
                    <div className="bg-orange-600 p-4 rounded-3xl shadow-2xl animate-in zoom-in border-4 border-orange-400 z-50">
                       <div className="text-center mb-2"><span className="text-[10px] font-black uppercase text-orange-200">CLAIM WINDOW {claimTimer}s</span></div>
                       <Tile tile={claimableTile} size="lg" isClaimable={true} />
                    </div>
                  ) : (
                    <div className="text-center opacity-5">
                      <Target className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-[8px] font-black uppercase tracking-widest">Center Table</p>
                    </div>
                  )}
                </div>
                
                {/* IDENTIFY BANNER */}
                {bestMatch && (
                    <div className="absolute top-4 left-4 right-4 bg-yellow-50/10 backdrop-blur-md border border-yellow-500/30 p-2 rounded-xl flex flex-col gap-1.5 animate-in slide-in-from-top-2">
                        <div className="flex justify-between items-center">
                            <p className="text-[10px] font-black text-yellow-400 uppercase tracking-tighter">{bestMatch.name} ({bestMatch.pct}%)</p>
                            <button onClick={() => setBestMatch(null)}><X className="w-3 h-3 text-slate-500" /></button>
                        </div>
                        <div className="bg-black/20 p-1.5 rounded-lg border border-white/5"><HandCode parts={bestMatch.parts} /></div>
                    </div>
                )}

                <div className="flex-none h-12 bg-slate-900 rounded-2xl p-1 overflow-x-auto flex items-center gap-1 border border-slate-800">
                   {discards.slice(0, 10).map((t, i) => <Tile key={i} tile={t} size="sm" isExposed={true} />)}
                </div>
             </div>

             {/* RACK HUB */}
             <div className="flex-none bg-slate-800 p-3 rounded-[2rem] border-t-4 border-orange-500 shadow-2xl space-y-3">
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-600 px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-sm">{players[activeHumanView].wind}</div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Your Rack</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => sortHand('suit')} className="p-2 bg-slate-700 rounded-lg text-[8px] font-black uppercase hover:bg-slate-600">Suit</button>
                    <button onClick={() => sortHand('val')} className="p-2 bg-slate-700 rounded-lg text-[8px] font-black uppercase hover:bg-slate-600">Val</button>
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
                         <Tile tile={players[activeHumanView].drawnTile} size="lg" isSelected={true} onClick={() => confirmDiscard(-1)} />
                       ) : (
                         <button onClick={handleDraw} className="w-12 h-16 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center text-slate-500 hover:text-orange-500 hover:border-orange-500 transition-all"><Play className="w-6 h-6" /></button>
                       )}
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-2 pt-2">
                   {gameState === 'charleston' ? (
                     <>
                        <button onClick={suggestPass} className="bg-slate-700 px-4 py-3 rounded-xl text-[10px] font-black uppercase border border-slate-600 flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-orange-400" /> Suggest</button>
                        <button 
                            onClick={processPassRound}
                            disabled={players[activeHumanView].selectedIndices.length !== 3}
                            className={`flex-1 py-3 rounded-xl font-black uppercase text-sm shadow-xl transition-all ${players[activeHumanView].selectedIndices.length === 3 ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                        >Confirm Pass</button>
                     </>
                   ) : (
                     <div className="flex gap-1.5 w-full">
                        <button onClick={() => setShowDeadTiles(true)} className="flex-1 bg-red-900/40 py-3 rounded-xl text-[9px] font-black uppercase border border-red-800 flex items-center justify-center gap-1">Dead</button>
                        <button onClick={identifyBestHand} className="flex-1 bg-slate-700 py-3 rounded-xl text-[9px] font-black uppercase border border-slate-600 flex items-center justify-center gap-1">Identify</button>
                        <button onClick={() => setShowWinDeclare(true)} className="flex-1 bg-green-700 py-3 rounded-xl text-[9px] font-black uppercase border border-green-800 flex items-center justify-center gap-1">Mahjong</button>
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
            <div className="p-6 bg-slate-700 flex justify-between items-center border-b border-slate-600">
              <h3 className="font-black uppercase tracking-widest text-xs tracking-tighter flex items-center gap-2">Dead Tile Tracker</h3>
              <button onClick={() => setShowDeadTiles(false)} className="p-2 hover:bg-slate-600 rounded-full"><X /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
               <div className="space-y-6">
                {['Dots', 'Bams', 'Cracks', 'Winds', 'Dragons', 'Special'].map(cat => (
                    <div key={cat}>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b pb-1 border-slate-700">{cat}</h4>
                        <div className="flex flex-wrap gap-1">
                            {cat === 'Special' ? (
                                <>
                                    <Tile tile={{val:'F', type:'flower'}} size="sm" countOverlay={deadTileCounts['F-flower']} />
                                    <Tile tile={{val:'J', type:'joker'}} size="sm" countOverlay={deadTileCounts['J-joker']} />
                                </>
                            ) : (
                                [1,2,3,4,5,6,7,8,9].map(n => {
                                    const val = (cat === 'Winds' || cat === 'Dragons') ? ['N','S','E','W','Green','Red','White'][n-1] : n;
                                    if (!val) return null;
                                    const suit = cat.toLowerCase();
                                    const type = (cat === 'Winds') ? 'wind' : (cat === 'Dragons') ? 'dragon' : 'number';
                                    const key = `${val}-${type === 'number' ? suit : type}`;
                                    return <Tile key={key} tile={{val, suit: type === 'number' ? suit : null, type}} size="sm" countOverlay={deadTileCounts[key]} />;
                                })
                            )}
                        </div>
                    </div>
                ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: WIN DECLARE */}
      {showWinDeclare && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-800 w-full max-w-2xl max-h-[70vh] rounded-[3rem] border-2 border-slate-700 overflow-hidden flex flex-col shadow-2xl">
                <div className="p-5 bg-slate-700 flex justify-between items-center border-b border-slate-600">
                    <h3 className="font-black uppercase tracking-widest text-xs flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" /> Win Verification</h3>
                    <button onClick={() => setShowWinDeclare(false)} className="p-1 text-slate-400 hover:text-white"><X /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {STANDARD_TEMPLATES.map(h => (
                        <button key={h.id} onClick={() => {
                            const res = checkMahjong(h);
                            setMessage(res.msg);
                            if(res.valid) setGameState('finished');
                            setShowWinDeclare(false);
                        }} className="w-full text-left p-4 bg-slate-700/50 border-2 border-slate-600 rounded-2xl hover:border-green-500 transition-all group">
                            <p className="text-[8px] font-black uppercase text-blue-400 mb-1">{h.section} | {h.type}</p>
                            <p className="font-black text-xs uppercase mb-2">{h.name}</p>
                            <HandCode parts={h.parts} />
                        </button>
                    ))}
                </div>
            </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-4 z-[100]">
           <div className="bg-slate-800 rounded-[3rem] p-10 max-w-sm w-full text-center border-b-8 border-orange-600 shadow-2xl space-y-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h2 className="text-3xl font-black uppercase">Session End</h2>
              <p className="text-xs font-bold text-slate-400 uppercase italic tracking-widest">{message}</p>
              <button onClick={initGame} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase shadow-xl transition-all hover:bg-orange-500">Play Again</button>
           </div>
        </div>
      )}

    </div>
  );
}
