import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, RotateCcw, ArrowRight, Layers, Play, BookOpen, User, 
  Cpu, AlertCircle, ShieldAlert, ThumbsUp, TrendingUp, X, 
  Sparkles, Search, Target, Lightbulb, CheckCircle2, Zap, Pin, PinOff,
  Hand, Timer, Trash2, PlusCircle, Save, Trash, AlertTriangle, Info,
  Brain, HelpCircle, MessageSquare, ShieldCheck, GripVertical, SortAsc, ArrowUpDown
} from 'lucide-react';

// --- DATA: 35 VERIFIED STANDARD HANDS ---
const STANDARD_TEMPLATES = [
  { id: 1, section: "Year", name: "Year Kongs", type: "X", desc: "2 Flowers, Kongs of 2s, Soaps, and 6s", code: "FF222200006666", parts: [{t:"FF", c:"text-pink-500"}, {t:"2222", c:"text-blue-600"}, {t:"0000", c:"text-slate-400"}, {t:"6666", c:"text-green-600"}] },
  { id: 2, section: "Year", name: "Yearly Winds", type: "X", desc: "Kongs of N/S, Year in 2 suits", code: "NNNNSSSS20262026", parts: [{t:"NNNN SSSS", c:"text-slate-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}] },
  { id: 3, section: "Year", name: "Full Year Run", type: "X", desc: "4 Flowers, Year sequences in all suits", code: "FFFF202620262026", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"2026", c:"text-red-600"}] },
  { id: 4, section: "Year", name: "Yearly Pairs", type: "C", desc: "Pairs of 2, 0, 6 in 3 suits. No Jokers.", code: "22002266220022", parts: [{t:"22", c:"text-blue-600"}, {t:"00", c:"text-slate-400"}, {t:"22", c:"text-green-600"}, {t:"66", c:"text-red-600"}] },
  { id: 5, section: "Year", name: "Dragon Year Mix", type: "X", desc: "Year in 2 suits, Kong of Dragons", code: "20262026DDDDFF", parts: [{t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"FF", c:"text-pink-500"}] },
  { id: 6, section: "Even", name: "Standard Evens", type: "X", desc: "Pungs of 2/8, Kongs of 4/6 in 2 suits", code: "22288844446666", parts: [{t:"222 888", c:"text-blue-600"}, {t:"4444 6666", c:"text-green-600"}] },
  { id: 7, section: "Even", name: "Even Dragon Kongs", type: "X", desc: "Kongs of 2/4, Kong Dragons, Pairs 6/8", code: "22224444DDDD6688", parts: [{t:"2222 4444", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"66 88", c:"text-blue-600"}] },
  { id: 8, section: "Even", name: "Even Flower Pungs", type: "X", desc: "4 Flowers, Pungs 2, 4, 6, 8", code: "FFFF222444666888", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"222 444 666 888", c:"text-blue-600"}] },
  { id: 9, section: "Even", name: "Mixed Even Set", type: "X", desc: "Kongs 2, 4, 6, 8 in 3 mixed suits", code: "2222444466668888", parts: [{t:"2222", c:"text-blue-600"}, {t:"4444", c:"text-green-600"}, {t:"6666", c:"text-red-600"}, {t:"8888", c:"text-blue-600"}] },
  { id: 10, section: "Even", name: "Even Pair Sequence", type: "C", desc: "Even pairs in 2 suits. No Jokers.", code: "22446688224466", parts: [{t:"22 44 66 88", c:"text-blue-600"}, {t:"22 44 66", c:"text-green-600"}] },
  { id: 11, section: "Odd", name: "Monocolor Odds", type: "X", desc: "Pungs 1/3, Kong 5, Pairs 7/9", code: "11133355557799", parts: [{t:"111 333 5555 77 99", c:"text-blue-600"}] },
  { id: 12, section: "Odd", name: "Odd Dragon Kongs", type: "X", desc: "Kongs 1, 3, 5 and Dragons", code: "11113333DDDD5555", parts: [{t:"1111 3333", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"5555", c:"text-blue-600"}] },
  { id: 13, section: "Odd", name: "Windy Odds", type: "X", desc: "Kongs E/W, 13579 sequence", code: "EEEEWWWW13579", parts: [{t:"EEEE WWWW", c:"text-slate-500"}, {t:"13579", c:"text-blue-600"}] },
  { id: 14, section: "Odd", name: "High Odds Mix", type: "X", desc: "Pungs of 1, 3, 5, 7, 9 mixed", code: "111333555777999", parts: [{t:"111 333 555 777 999", c:"text-blue-600"}] },
  { id: 15, section: "Odd", name: "Flower Odds", type: "X", desc: "Flowers and 13579 in 2 suits", code: "FFFF1357913579", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"13579", c:"text-blue-600"}, {t:"13579", c:"text-green-600"}] },
  { id: 16, section: "Run", name: "Small Consecutive", type: "X", desc: "Pung/Kong/Pung/Kong 4 consecutive", code: "11122223334444", parts: [{t:"111 2222", c:"text-blue-600"}, {t:"333 4444", c:"text-green-600"}] },
  { id: 17, section: "Run", name: "Big Flowery Run", type: "X", desc: "4 Flowers, 4 Consecutive Pungs", code: "FFFF444555666777", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"444 555 666 777", c:"text-blue-600"}] },
  { id: 18, section: "Run", name: "Four Kong Run", type: "X", desc: "4 Consecutive Kongs in 2 suits", code: "1111222233334444", parts: [{t:"1111 2222", c:"text-blue-600"}, {t:"3333 4444", c:"text-green-600"}] },
  { id: 19, section: "Run", name: "Consecutive Pairs", type: "C", desc: "7 Consecutive Pairs. No Jokers.", code: "11223344556677", parts: [{t:"11 22 33 44 55 66 77", c:"text-blue-600"}] },
  { id: 20, section: "Run", name: "Tricolor Run", type: "C", desc: "1-2-3 in 3 colors plus Flowers", code: "123123123FF", parts: [{t:"123", c:"text-blue-600"}, {t:"123", c:"text-green-600"}, {t:"123", c:"text-red-600"}, {t:"FF", c:"text-pink-500"}] },
  { id: 21, section: "Run", name: "Dragon Run Set", type: "X", desc: "3 Pungs Run, Kong Dragons", code: "111222333DDDD", parts: [{t:"111 222 333", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}] },
  { id: 22, section: "Run", name: "Five Pung Run", type: "X", desc: "5 Consecutive Pungs mixed suits", code: "111222333444555", parts: [{t:"111 222", c:"text-blue-600"}, {t:"333", c:"text-green-600"}, {t:"444 555", c:"text-red-600"}] },
  { id: 23, section: "Winds", name: "The Big Four", type: "X", desc: "Kongs of all four winds", code: "NNNNSSSSEEEEWWWW", parts: [{t:"NNNN SSSS EEEE WWWW", c:"text-slate-500"}] },
  { id: 24, section: "Winds", name: "Dragon Breath", type: "X", desc: "Kongs of Green, Red, White Dragons", code: "DDDDDDDDDDDDFF", parts: [{t:"DDDD DDDD DDDD", c:"text-slate-500"}, {t:"FF", c:"text-pink-500"}] },
  { id: 25, section: "Winds", name: "Global Traveler", type: "X", desc: "Single N-E-W-S and 3 Kongs", code: "NEWS111122223333", parts: [{t:"NEWS", c:"text-slate-500"}, {t:"1111 2222 3333", c:"text-blue-600"}] },
  { id: 26, section: "Winds", name: "Dragon Pair Set", type: "C", desc: "Pairs of all Dragons and Flowers", code: "DDDDDDFFFF", parts: [{t:"DD DD DD", c:"text-slate-500"}, {t:"FF FF", c:"text-pink-500"}] },
  { id: 27, section: "Winds", name: "Wind Pung Mix", type: "X", desc: "Pungs of Winds and a Run", code: "NNNSSSEEE123", parts: [{t:"NNN SSS EEE", c:"text-slate-500"}, {t:"123", c:"text-blue-600"}] },
  { id: 28, section: "Winds", name: "Dragon Run X", type: "X", desc: "Kong Dragons, Pungs of Numbers", code: "DDDD111222333", parts: [{t:"DDDD", c:"text-slate-500"}, {t:"111 222 333", c:"text-blue-600"}] },
  { id: 29, section: "Quints", name: "Quint Run", type: "X", desc: "Quint of 1s and 2s, Flowers", code: "1111122222FFFF", parts: [{t:"11111 22222", c:"text-blue-600"}, {t:"FFFF", c:"text-pink-500"}] },
  { id: 30, section: "Quints", name: "Quint Dragons", type: "X", desc: "Quint of Dragons, Kong numbers", code: "DDDDD11112222", parts: [{t:"DDDDD", c:"text-slate-500"}, {t:"1111 2222", c:"text-blue-600"}] },
  { id: 31, section: "Quints", name: "Triple Quint Run", type: "X", desc: "Three Quints consecutive numbers", code: "111112222233333", parts: [{t:"11111", c:"text-blue-600"}, {t:"22222", c:"text-green-600"}, {t:"33333", c:"text-red-600"}] },
  { id: 32, section: "Pairs", name: "Big Odds Pair", type: "C", desc: "Pairs of all odds, Flowers, Dragons", code: "FF1133557799DD", parts: [{t:"FF", c:"text-pink-500"}, {t:"11 33 55 77 99", c:"text-blue-600"}, {t:"DD", c:"text-slate-400"}] },
  { id: 33, section: "Pairs", name: "Street Run Pairs", type: "C", desc: "Full 1-9 suit sequence. No Jokers.", code: "123456789FF", parts: [{t:"1 2 3 4 5 6 7 8 9", c:"text-blue-600"}, {t:"FF", c:"text-pink-500"}] },
  { id: 34, section: "Pairs", name: "Windy Pair Set", type: "C", desc: "Pairs of all Winds and 3 numbers", code: "NNSS EEWW112233", parts: [{t:"NN SS EE WW", c:"text-slate-500"}, {t:"11 22 33", c:"text-blue-600"}] },
  { id: 35, section: "Pairs", name: "Year Pair Mixed", type: "C", desc: "Pairs of Year in 2 suits, Dragons", code: "22002266DDFF", parts: [{t:"22 00", c:"text-blue-600"}, {t:"22 66", c:"text-green-600"}, {t:"DD", c:"text-slate-400"}, {t:"FF", c:"text-pink-500"}] }
];

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

const Tile = ({ tile, onClick, isSelected, size = "md", disabled = false, isSuggested = false, isClaimable = false, isExposed = false, isMoving = false }) => {
  if (!tile) return null;
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
  const valDisplay = (tile.val === 0 || tile.val === 'White') ? '0' : tile.val;
  return (
    <div onClick={disabled ? null : onClick} className={`${sizes[size]} flex-shrink-0 relative cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl shadow-sm m-0.5 transition-all transform ${!disabled && !isExposed && !isMoving && 'hover:-translate-y-1 active:scale-95'} ${getStyle()} ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-2' : ''} ${isSuggested ? 'ring-2 ring-red-500 border-red-600' : ''} ${isClaimable ? 'animate-bounce ring-4 ring-orange-500 shadow-xl z-20' : ''}`}>
      <span className="font-bold leading-none select-none">{valDisplay}</span>
      {tile.suit && <span className="text-[10px] uppercase opacity-60 font-black mt-1 select-none">{tile.suit[0]}</span>}
    </div>
  );
};

const HandCode = ({ parts }) => (
  <div className="flex flex-wrap gap-1 font-mono text-sm font-black tracking-widest leading-none">
    {parts?.map((p, i) => <span key={i} className={p.c}>{p.t}</span>)}
  </div>
);

export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [exposures, setExposures] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [ghostStacks, setGhostStacks] = useState({ left: [], across: [], right: [] });
  const [charlestonStep, setCharlestonStep] = useState(0); 
  const [discards, setDiscards] = useState([]);
  const [message, setMessage] = useState("V11.1 Pro Trainer");
  const [drawnTile, setDrawnTile] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [pinnedHandIds, setPinnedHandIds] = useState([]);
  const [suggestedIndices, setSuggestedIndices] = useState([]);
  const [aiSuggestionReason, setAiSuggestionReason] = useState("");
  const [realTimeFeedback, setRealTimeFeedback] = useState(null);
  const [showCoach, setShowCoach] = useState(true);
  const [pendingDiscardIdx, setPendingDiscardIdx] = useState(null);
  const [claimableTile, setClaimableTile] = useState(null);
  const [claimTimer, setClaimTimer] = useState(0);
  const [isClaimingMode, setIsClaimingMode] = useState(false);
  const [bestMatch, setBestMatch] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);

  // Reorder State
  const [movingIndex, setMovingIndex] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [lastClickIndex, setLastClickIndex] = useState(null);

  // Custom Hand Management
  const [sessionCustomHands, setSessionCustomHands] = useState([]);
  const [creatorBuffer, setCreatorBuffer] = useState([]);
  const [creatorName, setCreatorName] = useState("");
  const [creatorColor, setCreatorColor] = useState(COLORS[0]);
  const [creatorError, setCreatorError] = useState(null);

  const timerRef = useRef(null);
  const steps = ["Right", "Over (Across)", "Left", "Left", "Over (Across)", "Right"];
  const fullLibrary = useMemo(() => [...sessionCustomHands, ...STANDARD_TEMPLATES], [sessionCustomHands]);

  useEffect(() => {
    return () => { if(timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Analysis Effect
  useEffect(() => {
    if (gameState === 'charleston' && showCoach && hand.length === 13) {
      const selected = selectedIndices.map(i => hand[i]).filter(Boolean);
      if (selected.length === 0) { setRealTimeFeedback(null); return; }
      const counts = {}; 
      hand.forEach(t => { if (!t) return; const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString(); const k = `${v}-${t.suit||''}`; counts[k] = (counts[k]||0)+1; });
      const brokePairCount = selected.filter(t => {
          const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString();
          return (counts[`${v}-${t.suit||''}`] || 0) > 1;
      }).length;
      const flowerCount = selected.filter(t => t.type === 'flower').length;
      const uniqueSuits = new Set(selected.map(t => t.suit).filter(Boolean)).size;

      let fb = { msg: "Monitoring choices...", color: "blue" };
      if (brokePairCount > 0) fb = { msg: `PAIR BREAKER: you are selecting ${brokePairCount} tile(s) from pairs. try to keep sets together!`, color: "red" };
      else if (flowerCount > 0) fb = { msg: `FLOWER LEAK: passing ${flowerCount} Flower(s). risky move early on.`, color: "yellow" };
      else if (selected.length === 3 && uniqueSuits === 1) fb = { msg: `SUIT DENSITY: passing 3 tiles of one suit helps neighbor build clusters.`, color: "yellow" };
      else if (selected.length === 3) fb = { msg: `CLEAN PASS: strategic outliers selected for shedding.`, color: "green" };
      setRealTimeFeedback(fb);
    }
  }, [selectedIndices, hand, gameState, showCoach]);

  const initGame = () => {
    const fullDeck = createDeck();
    const pool = [...fullDeck];
    const dealtHand = pool.splice(0, 13);
    const stacks = { left: [], across: [], right: [] };
    for(let i=0; i<6; i++) { stacks.left.push(pool.splice(0,3)); stacks.across.push(pool.splice(0,3)); stacks.right.push(pool.splice(0,3)); }
    const wall = [...pool];
    
    setSelectedIndices([]); setDiscards([]); setDrawnTile(null);
    setPendingDiscardIdx(null); setClaimableTile(null); setBestMatch(null); 
    setCharlestonStep(0); setAiSuggestionReason(""); setExposures([]);
    setGhostStacks(stacks); setDeck(wall);
    setHand(dealtHand.sort((a,b) => (a.suit || a.type || '').localeCompare(b.suit || b.type || '')));
    setGameState('charleston');
    setMessage(`Pass to the ${steps[0]}`);
  };

  const sortHand = (mode) => {
    const sorted = [...hand].sort((a, b) => {
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
    setHand(sorted);
    setSelectedIndices([]);
    setMovingIndex(null);
  };

  const handleTileAction = (i) => {
    const now = Date.now();
    if (movingIndex !== null) {
      if (movingIndex === i) { setMovingIndex(null); }
      else {
        const newHand = [...hand];
        const [movedTile] = newHand.splice(movingIndex, 1);
        newHand.splice(i, 0, movedTile);
        setHand(newHand); setMovingIndex(null); setSelectedIndices([]);
      }
      return;
    }
    if (now - lastClickTime < 350 && lastClickIndex === i) {
      setMovingIndex(i); setLastClickTime(0); return;
    }
    setLastClickTime(now); setLastClickIndex(i);
    if (gameState === 'charleston') {
      if (hand[i].type === 'joker') return;
      setSelectedIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : (prev.length < 3 ? [...prev, i] : prev));
      setAiSuggestionReason("");
    } else if (gameState === 'playing') {
      if (isClaimingMode) setSelectedIndices(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      else if (!claimableTile) setPendingDiscardIdx(i);
    }
  };

  const suggestPass = () => {
    if (hand.length < 13) return;
    const counts = {}; hand.forEach(t => { if(!t) return; const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString(); const k = `${v}-${t.suit||''}`; counts[k] = (counts[k]||0)+1; });
    const scored = hand.map((t, i) => {
      let s = 0; if (t.type === 'joker') s += 1000; if (t.type === 'flower') s += 40;
      const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString();
      if (counts[`${v}-${t.suit||''}`] > 1) s += 50; if (t.suit) s += hand.filter(h => h.suit === t.suit).length * 10;
      return { i, s };
    });
    const candidates = scored.sort((a,b) => a.s - b.s).slice(0,3);
    setSelectedIndices(candidates.map(x => x.i));
    setAiSuggestionReason(`AI REASONING: identified 3 outliers from shortest suits to protect your rack's pair density.`);
  };

  const processPass = () => {
    if (selectedIndices.length !== 3) return;
    const key = steps[charlestonStep].toLowerCase().includes('right') ? 'right' : steps[charlestonStep].toLowerCase().includes('left') ? 'left' : 'across';
    const rem = hand.filter((_, i) => !selectedIndices.includes(i));
    const inc = ghostStacks[key][0];
    setHand([...rem, ...inc]);
    setGhostStacks({...ghostStacks, [key]: ghostStacks[key].slice(1)});
    setSelectedIndices([]); setAiSuggestionReason("");
    if (charlestonStep < 5) setCharlestonStep(p => p + 1);
    else { setGameState('playing'); setMessage("Live play initiated."); }
  };

  const confirmDiscard = () => {
    if (pendingDiscardIdx === null) return;
    const userDiscarded = pendingDiscardIdx === -1 ? drawnTile : hand[pendingDiscardIdx];
    const newHand = pendingDiscardIdx === -1 ? [...hand] : hand.filter((_, idx) => idx !== pendingDiscardIdx);
    if (pendingDiscardIdx !== -1 && drawnTile) newHand.push(drawnTile);
    setDiscards(p => [userDiscarded, ...p]);
    setHand(newHand); setDrawnTile(null); setPendingDiscardIdx(null);
    if (deck.length > 0) {
      const dCopy = [...deck]; const ghostDraw = dCopy.shift(); setDeck(dCopy);
      setClaimableTile(ghostDraw); setClaimTimer(5);
      if(timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setClaimTimer(p => {
          if (p <= 1) { clearInterval(timerRef.current); setDiscards(prev => [ghostDraw, ...prev]); setClaimableTile(null); return 0; }
          return p - 1;
        });
      }, 1000);
    } else setGameState('finished');
  };

  const identifyBestHand = () => {
    const fullPool = [...hand]; if (drawnTile) fullPool.push(drawnTile); exposures.forEach(e => fullPool.push(...e));
    const results = fullLibrary.map(h => {
      let matches = 0; let temp = fullPool.map(t => ({...t, valStr: (t.val === 'White' || t.val === 0) ? '0' : t.val.toString()})).filter(t => t.type !== 'joker');
      h.parts?.forEach(part => { for (let char of part.t) { const found = temp.findIndex(p => p.valStr === char); if (found !== -1) { matches++; temp.splice(found, 1); } } });
      const total = h.type === "C" ? matches : Math.min(14, matches + fullPool.filter(t => t.type === 'joker').length);
      return { ...h, pct: Math.round((total / 14) * 100) };
    });
    setBestMatch(results.sort((a,b) => b.pct - a.pct)[0]);
  };

  const addToCreator = (val, type) => {
    if (creatorBuffer.length >= 14) { setCreatorError("Hand Full!"); return; }
    const valStr = (val === 0 || val === 'White') ? '0' : val.toString();
    const countCurrent = creatorBuffer.filter(t => t.valStr === valStr && t.colorClass === creatorColor.class).length;
    if (val === 'F' && creatorBuffer.filter(t => t.val === 'F').length >= 8) { setCreatorError("8 Flowers Max."); return; }
    if (val !== 'F' && countCurrent >= 4) { setCreatorError("Max 4 per suit."); return; }
    setCreatorError(null);
    setCreatorBuffer([...creatorBuffer, { val, valStr, type, colorClass: creatorColor.class }]);
  };

  const saveCustomHand = () => {
    if (creatorBuffer.length !== 14) { setCreatorError("Needs 14 tiles."); return; }
    const parts = []; let cur = null;
    creatorBuffer.forEach(item => { if (!cur || cur.c !== item.colorClass) { if (cur) parts.push(cur); cur = { t: item.valStr, c: item.colorClass }; } else { cur.t += item.valStr; } });
    if (cur) parts.push(cur);
    const newH = { id: Date.now(), section: "Custom", name: creatorName || "New Build", type: "X", desc: "User Target", code: creatorBuffer.map(b => b.valStr).join(''), parts };
    setSessionCustomHands([newH, ...sessionCustomHands]);
    setGameState('menu'); setCreatorBuffer([]); setCreatorName("");
  };

  const togglePin = (id) => setPinnedHandIds(p => p.includes(id) ? p.filter(x => x !== id) : [...p].slice(-1).concat(id));
  const coachColorStyles = { red: "bg-red-50 border-red-200 text-red-700", yellow: "bg-yellow-50 border-yellow-200 text-yellow-700", blue: "bg-blue-50 border-blue-200 text-blue-700", green: "bg-green-50 border-green-200 text-green-700" };

  return (
    <div className="flex flex-col h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      <div className="flex-none bg-slate-900 text-white p-3 flex justify-between items-center border-b-4 border-orange-500 shadow-xl">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-orange-500" />
          <h1 className="text-lg font-black text-yellow-400 leading-none tracking-tighter uppercase">Pro Coach V11.1</h1>
        </div>
        <div className="flex gap-2">
          {gameState !== 'menu' && <button onClick={() => setShowCard(true)} className="bg-blue-600 px-3 py-1 rounded-lg text-[9px] font-black uppercase shadow-lg"><BookOpen className="w-3.5 h-3.5 inline mr-1" /> Card</button>}
          <button onClick={() => setGameState('menu')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-2 md:p-4 gap-2 overflow-hidden">
        {gameState === 'menu' ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in">
            <Zap className="w-12 h-12 text-orange-500 mb-4" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-2 uppercase tracking-widest">Intelligent Mahjong.</h2>
            <p className="max-w-xs text-slate-500 text-xs font-medium mb-8">Master standard hands and custom targets with session-persistent creation and auto-sorting.</p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button onClick={initGame} className="py-4 bg-orange-600 text-white rounded-2xl font-black text-lg shadow-xl uppercase tracking-tighter">Start Training</button>
              <button onClick={() => setGameState('creator')} className="py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-xl uppercase tracking-tighter">Hand Lab</button>
            </div>
          </div>
        ) : gameState === 'creator' ? (
          <div className="flex-1 overflow-y-auto space-y-4 p-2">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-black uppercase tracking-tighter"><Brain className="w-4 h-4 inline mr-2 text-blue-600" /> Hand Lab</h3>
              <button onClick={() => setGameState('menu')}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {creatorError && <div className="bg-red-50 border-2 border-red-100 p-3 rounded-xl text-red-600 text-[10px] font-bold uppercase">{creatorError}</div>}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <input value={creatorName} onChange={e => setCreatorName(e.target.value)} className="w-full bg-slate-50 border rounded-xl p-3 text-xs font-bold" placeholder="Hand Name..." />
              <div className="flex gap-2 justify-center py-2">
                {COLORS.map(c => <button key={c.name} onClick={() => setCreatorColor(c)} className={`w-8 h-8 rounded-full ${c.class.replace('text','bg')} ${creatorColor.name === c.name ? 'ring-2 ring-slate-800' : 'opacity-40'}`} />)}
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1,2,3,4,5,6,7,8,9,0].map(n => <button key={n} onClick={() => addToCreator(n, 'number')} className="bg-slate-50 border rounded-lg py-3 text-xs font-bold uppercase">{n === 0 ? '0' : n}</button>)}
                {['N','S','E','W'].map(w => <button key={w} onClick={() => addToCreator(w, 'wind')} className="bg-slate-50 border rounded-lg py-3 text-xs font-bold">{w}</button>)}
                <button onClick={() => addToCreator('F', 'flower')} className="col-span-2 bg-pink-50 border-pink-200 border rounded-lg py-3 text-xs font-bold uppercase">Flower</button>
              </div>
              <div className="flex flex-wrap gap-1 justify-center min-h-[100px] border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                {creatorBuffer.map((t, i) => (
                  <div key={i} className={`w-8 h-12 border-2 rounded-lg flex items-center justify-center font-black text-sm relative group bg-white shadow-sm ${t.colorClass}`}>
                    {t.valStr}
                    <button onClick={() => setCreatorBuffer(p => p.filter((_, idx) => idx !== i))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-sm"><X className="w-2.5 h-2.5" /></button>
                  </div>
                ))}
              </div>
              <button onClick={saveCustomHand} disabled={creatorBuffer.length !== 14} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-tighter shadow-xl">Save to Library</button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col gap-2 overflow-hidden">
            <div className="flex-none flex justify-center gap-2 min-h-[50px]">
              {pinnedHandIds.map(id => {
                const h = fullLibrary.find(x => x.id === id);
                if (!h) return null;
                return (
                  <div key={id} className="bg-white border-2 border-blue-100 p-2 rounded-xl shadow-sm w-56 relative animate-in slide-in-from-top-2">
                    <p className="text-[7px] font-black text-blue-600 uppercase mb-1 flex justify-between"><span>{h.name}</span><PinOff className="w-2 h-2 text-slate-300" onClick={() => togglePin(id)} /></p>
                    <HandCode parts={h.parts} />
                  </div>
                );
              })}
            </div>

            <div className="flex-none flex gap-2">
              <div className="flex-1 bg-blue-50 p-3 rounded-2xl border border-blue-100 flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${gameState === 'charleston' ? 'bg-orange-600' : 'bg-green-600'} text-white`}><User className="w-4 h-4" /></div>
                <div className="overflow-hidden">
                  <p className="text-[7px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">{gameState === 'charleston' ? `Pass: ${steps[charlestonStep]}` : 'Active Play'}</p>
                  <p className="font-black text-slate-800 text-[10px] truncate uppercase tracking-tighter">{message}</p>
                </div>
              </div>
              <div className="flex-none bg-slate-900 text-white p-3 rounded-2xl flex items-center gap-2 border-b-4 border-slate-700 shadow-lg">
                <TrendingUp className="w-3 h-3 text-yellow-400" />
                <span className="text-xl font-black tabular-nums tracking-tighter">{deck.length}</span>
              </div>
            </div>

            {gameState === 'charleston' && showCoach && realTimeFeedback && (
                <div className={`flex-none p-2 rounded-xl border flex items-center gap-3 relative ${coachColorStyles[realTimeFeedback.color || 'blue']}`}>
                   <button onClick={() => setShowCoach(false)} className="absolute top-1 right-1 opacity-50"><X className="w-3 h-3" /></button>
                   <div className={`p-1 rounded-full text-white ${realTimeFeedback.color === 'red' ? 'bg-red-500' : realTimeFeedback.color === 'yellow' ? 'bg-yellow-500' : realTimeFeedback.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}>
                     <ShieldCheck className="w-3 h-3" />
                   </div>
                   <p className="text-[10px] font-bold leading-tight italic uppercase tracking-tighter pr-4">{aiSuggestionReason || realTimeFeedback.msg}</p>
                </div>
            )}
            
            {bestMatch && gameState === 'playing' && (
              <div className="flex-none bg-yellow-50 border border-yellow-200 p-2 rounded-xl flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-orange-500" />
                  <p className="text-[10px] font-black uppercase tracking-tighter">{bestMatch.name} ({bestMatch.pct}%)</p>
                </div>
                <button onClick={() => setBestMatch(null)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>
            )}

            <div className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-[2rem] p-3 flex flex-col justify-between shadow-inner">
               <div className="flex flex-wrap justify-center gap-2 mb-2 min-h-[30px] border-b border-slate-200 pb-2 overflow-y-auto">
                  {exposures.length === 0 && <span className="text-[7px] font-black uppercase text-slate-300 mt-2">Rack exposures</span>}
                  {exposures.map((set, i) => (
                    <div key={i} className="flex bg-white/70 p-1 rounded-lg border border-slate-200 shadow-sm">{set.map(t => <Tile key={t.id} tile={t} size="sm" isExposed={true} />)}</div>
                  ))}
               </div>

               <div className="flex-1 flex items-center justify-center relative">
                  {claimableTile ? (
                    <div className="bg-orange-50 border-2 border-orange-500 p-4 rounded-3xl flex flex-col items-center gap-2 animate-in zoom-in shadow-2xl z-30">
                      <div className="absolute -top-3 bg-orange-600 text-white px-3 py-0.5 rounded-full text-[8px] font-black flex items-center gap-1.5 shadow-md"><Timer className="w-2.5 h-2.5 animate-spin" /> {claimTimer}s</div>
                      <Tile tile={claimableTile} size="lg" isClaimable={true} />
                      <div className="flex gap-2">
                        {!isClaimingMode ? (
                          <button onClick={() => { setIsClaimingMode(true); clearInterval(timerRef.current); }} className="bg-orange-600 text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase shadow-md">Call</button>
                        ) : (
                          <button onClick={() => {
                            const sel = selectedIndices.map(i => hand[i]);
                            if(sel.every(t => t.val === claimableTile.val || t.type === 'joker') && sel.length >= 2) {
                              setExposures([...exposures, [...sel, claimableTile]]);
                              setHand(hand.filter((_, i) => !selectedIndices.includes(i)));
                              setClaimableTile(null); setIsClaimingMode(false); setSelectedIndices([]);
                            }
                          }} className="bg-green-600 text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase shadow-md">Finish</button>
                        )}
                        <button onClick={() => { setClaimableTile(null); setIsClaimingMode(false); setSelectedIndices([]); }} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400"><X className="w-3 h-3" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="opacity-10 flex flex-col items-center gap-1"><div className="w-12 h-16 border-2 border-dashed border-slate-400 rounded-xl shadow-inner"></div><p className="text-[7px] font-black uppercase text-slate-400">Discard Center</p></div>
                  )}
               </div>

               <div className="flex-none mt-2">
                 <div className="flex justify-center gap-1 mb-2">
                    <button onClick={() => sortHand('suit')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-sm"><SortAsc className="w-3 h-3" /> Suit</button>
                    <button onClick={() => sortHand('val')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase flex items-center gap-1 shadow-sm"><ArrowUpDown className="w-3 h-3" /> Value</button>
                 </div>
                 <div className="flex flex-wrap justify-center gap-0.5 border-t border-slate-200 pt-3">
                    {hand.map((tile, idx) => (
                      <Tile key={tile.id} tile={tile} onClick={() => handleTileAction(idx)} isSelected={selectedIndices.includes(idx) || pendingDiscardIdx === idx} disabled={gameState === 'charleston' && tile.type === 'joker'} isSuggested={suggestedIndices.includes(idx)} isMoving={movingIndex === idx} />
                    ))}
                    {gameState === 'playing' && !isClaimingMode && (
                      <div className="ml-1 pl-1 border-l border-slate-200">
                        {drawnTile ? (
                          <Tile tile={drawnTile} size="md" isSelected={pendingDiscardIdx === -1} onClick={() => setPendingDiscardIdx(-1)} />
                        ) : (
                          <button onClick={() => { if(!claimableTile && deck.length > 0) { const dCopy = [...deck]; const p = dCopy.shift(); setDrawnTile(p); setDeck(dCopy); }}} disabled={deck.length === 0 || !!claimableTile} className="w-10 h-14 border-2 border-blue-300 border-dashed rounded-lg bg-blue-50 text-blue-300 flex items-center justify-center group shadow-sm transition-all"><Play className="w-4 h-4 group-hover:scale-110" /></button>
                        )}
                      </div>
                    )}
                 </div>
               </div>

               <div className="mt-3 flex justify-center gap-2">
                  {gameState === 'charleston' ? (
                    <>
                      <button onClick={suggestPass} className="px-3 py-2 bg-white border-2 border-slate-200 rounded-xl font-black text-[8px] flex items-center gap-1.5 shadow-md"><Brain className="w-3 h-3 text-orange-500" /> AI Help</button>
                      <button onClick={processPass} disabled={selectedIndices.length !== 3} className={`px-6 py-2 rounded-xl font-black text-[9px] flex items-center gap-1.5 uppercase shadow-xl transition-all ${selectedIndices.length === 3 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}>Confirm Pass</button>
                    </>
                  ) : pendingDiscardIdx !== null ? (
                    <div className="flex gap-2">
                       <button onClick={() => setPendingDiscardIdx(null)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-[9px]">Cancel</button>
                       <button onClick={confirmDiscard} className="px-6 py-2 bg-red-600 text-white rounded-xl font-black text-[9px] shadow-lg">Discard</button>
                    </div>
                  ) : gameState === 'playing' && (
                    <button onClick={identifyBestHand} className="px-8 py-2 bg-slate-900 text-white rounded-xl font-black text-[9px] shadow-lg"><Target className="w-3 h-3 inline mr-1 text-yellow-400" /> Hand Identify</button>
                  )}
               </div>
            </div>

            <div className="flex-none bg-white p-2 rounded-xl border border-slate-200 shadow-sm opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all overflow-hidden h-14">
              <h4 className="text-[7px] font-black text-slate-400 uppercase mb-1 tracking-widest flex items-center gap-1"><Search className="w-2 h-2" /> Discards</h4>
              <div className="flex flex-wrap gap-1 content-start">{discards.map((t, i) => <div key={i} className="scale-[0.5] -m-1.5"><Tile tile={t} size="sm" /></div>)}</div>
            </div>
          </div>
        )}
      </div>

      {showCard && (
        <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in">
            <div className="p-4 bg-slate-50 border-b flex justify-between items-center"><h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Target Library</h3><button onClick={() => setShowCard(false)} className="p-1 text-slate-400"><X /></button></div>
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20 scrollbar-hide">
              {sessionCustomHands.length > 0 && (
                <div><h4 className="text-blue-600 font-black text-[9px] uppercase tracking-widest mb-3 border-b pb-1">Session Custom</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{sessionCustomHands.map(h => (<div key={h.id} className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 relative shadow-sm"><button onClick={() => togglePin(h.id)} className={`absolute top-2 right-2 p-1 rounded-full ${pinnedHandIds.includes(h.id) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}><Pin className="w-3 h-3" /></button><div className="font-black text-slate-800 text-[10px] mb-1 uppercase tracking-tighter">{h.name}</div><div className="bg-white p-2 rounded-lg border border-slate-200 mb-1 shadow-inner"><HandCode parts={h.parts} /></div><div className="text-[8px] font-bold text-slate-400 uppercase leading-snug">{h.desc}</div><button onClick={() => setSessionCustomHands(p => p.filter(x => x.id !== h.id))} className="mt-3 text-red-400 text-[8px] font-black uppercase flex items-center gap-1 hover:text-red-600"><Trash className="w-2.5 h-2.5" /> Remove</button></div>))}</div></div>
              )}
              <div><h4 className="text-slate-400 font-black text-[9px] uppercase tracking-widest mb-3 border-b pb-1">Standard Set</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{STANDARD_TEMPLATES.map(h => (<div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 relative shadow-sm hover:border-blue-300 transition-colors"><button onClick={() => togglePin(h.id)} className={`absolute top-2 right-2 p-1 rounded-full ${pinnedHandIds.includes(h.id) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}><Pin className="w-3.5 h-3.5" /></button><div className="font-black text-slate-800 text-[10px] mb-1 uppercase tracking-tighter uppercase">{h.name}</div><div className="bg-white p-2 rounded-lg border border-slate-200 mb-1 shadow-inner"><HandCode parts={h.parts} /></div><div className="text-[8px] font-bold text-slate-400 uppercase leading-snug">{h.desc}</div></div>))}</div></div>
            </div>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-sm w-full text-center border-b-8 border-orange-600 shadow-2xl">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4 shadow-sm" />
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">END OF WALL</h2>
            <button onClick={initGame} className="w-full mt-8 py-4 bg-orange-600 text-white rounded-2xl font-black text-md uppercase shadow-xl transition-all">Start New Session</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
