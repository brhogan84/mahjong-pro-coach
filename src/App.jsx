import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Trophy, RotateCcw, ArrowRight, Layers, Play, BookOpen, User, 
  Cpu, AlertCircle, ShieldAlert, ThumbsUp, TrendingUp, X, 
  Sparkles, Search, Target, Lightbulb, CheckCircle2, Zap, Pin, PinOff,
  Hand, Timer, Trash2, PlusCircle, Save, Trash, AlertTriangle, Info,
  Brain, HelpCircle, MessageSquare, ShieldCheck, GripVertical
} from 'lucide-react';

// --- VERIFIED STANDARD HAND LIBRARY (35 Viable Hands) ---
const STANDARD_TEMPLATES = [
  // YEAR SECTION
  { id: 1, section: "Year", name: "Big Year Kongs", type: "X", desc: "2 Flowers, Kongs of 2s, Soaps (0s), and 6s", code: "FF222200006666", parts: [{t:"FF", c:"text-pink-500"}, {t:"2222", c:"text-blue-600"}, {t:"0000", c:"text-slate-400"}, {t:"6666", c:"text-green-600"}] },
  { id: 2, section: "Year", name: "Yearly Winds", type: "X", desc: "Kongs of North/South, Year in 2 suits", code: "NNNNSSSS20262026", parts: [{t:"NNNN SSSS", c:"text-slate-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}] },
  { id: 3, section: "Year", name: "Full Year Run", type: "X", desc: "4 Flowers, Year sequences in all suits", code: "FFFF202620262026", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"2026", c:"text-red-600"}] },
  { id: 4, section: "Year", name: "Yearly Pairs", type: "C", desc: "Pairs of 2, 0, 6 in 3 suits. No Jokers.", code: "22002266220022", parts: [{t:"22", c:"text-blue-600"}, {t:"00", c:"text-slate-400"}, {t:"22", c:"text-green-600"}, {t:"66", c:"text-red-600"}] },
  { id: 5, section: "Year", name: "Dragon Year Mix", type: "X", desc: "Year in 2 suits, Kong of Dragons", code: "20262026DDDDFF", parts: [{t:"2026", c:"text-blue-600"}, {t:"2026", c:"text-green-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"FF", c:"text-pink-500"}] },
  // EVEN SECTION
  { id: 6, section: "Even", name: "Standard Evens", type: "X", desc: "Pungs of 2/8, Kongs of 4/6 in 2 suits", code: "22288844446666", parts: [{t:"222 888", c:"text-blue-600"}, {t:"4444 6666", c:"text-green-600"}] },
  { id: 7, section: "Even", name: "Even Dragon Kongs", type: "X", desc: "Kongs of 2/4, Kong Dragons, Pairs 6/8", code: "22224444DDDD6688", parts: [{t:"2222 4444", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"66 88", c:"text-blue-600"}] },
  { id: 8, section: "Even", name: "Even Flower Pungs", type: "X", desc: "4 Flowers, Pungs 2, 4, 6, 8", code: "FFFF222444666888", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"222 444 666 888", c:"text-blue-600"}] },
  { id: 9, section: "Even", name: "Mixed Even Set", type: "X", desc: "Kongs 2, 4, 6, 8 in 3 mixed suits", code: "2222444466668888", parts: [{t:"2222", c:"text-blue-600"}, {t:"4444", c:"text-green-600"}, {t:"6666", c:"text-red-600"}, {t:"8888", c:"text-blue-600"}] },
  { id: 10, section: "Even", name: "Even Pair Sequence", type: "C", desc: "Even pairs in 2 suits. No Jokers.", code: "22446688224466", parts: [{t:"22 44 66 88", c:"text-blue-600"}, {t:"22 44 66", c:"text-green-600"}] },
  // ODD SECTION
  { id: 11, section: "Odd", name: "Monocolor Odds", type: "X", desc: "Pungs 1/3, Kong 5, Pairs 7/9", code: "11133355557799", parts: [{t:"111 333 5555 77 99", c:"text-blue-600"}] },
  { id: 12, section: "Odd", name: "Odd Dragon Kongs", type: "X", desc: "Kongs 1, 3, 5 and Dragons", code: "11113333DDDD5555", parts: [{t:"1111 3333", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}, {t:"5555", c:"text-blue-600"}] },
  { id: 13, section: "Odd", name: "Windy Odds", type: "X", desc: "Kongs E/W, 13579 sequence", code: "EEEEWWWW13579", parts: [{t:"EEEE WWWW", c:"text-slate-500"}, {t:"13579", c:"text-blue-600"}] },
  { id: 14, section: "Odd", name: "High Odds Mix", type: "X", desc: "Pungs of 1, 3, 5, 7, 9 mixed", code: "111333555777999", parts: [{t:"111 333 555 777 999", c:"text-blue-600"}] },
  { id: 15, section: "Odd", name: "Flower Odds", type: "X", desc: "Flowers and 13579 in 2 suits", code: "FFFF1357913579", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"13579", c:"text-blue-600"}, {t:"13579", c:"text-green-600"}] },
  // RUN SECTION
  { id: 16, section: "Run", name: "Small Consecutive", type: "X", desc: "Pung/Kong/Pung/Kong 4 consecutive", code: "11122223334444", parts: [{t:"111 2222", c:"text-blue-600"}, {t:"333 4444", c:"text-green-600"}] },
  { id: 17, section: "Run", name: "Big Flowery Run", type: "X", desc: "4 Flowers, 4 Consecutive Pungs", code: "FFFF111222333444", parts: [{t:"FFFF", c:"text-pink-500"}, {t:"111 222 333 444", c:"text-blue-600"}] },
  { id: 18, section: "Run", name: "Four Kong Run", type: "X", desc: "4 Consecutive Kongs in 2 suits", code: "1111222233334444", parts: [{t:"1111 2222", c:"text-blue-600"}, {t:"3333 4444", c:"text-green-600"}] },
  { id: 19, section: "Run", name: "Consecutive Pairs", type: "C", desc: "7 Consecutive Pairs. No Jokers.", code: "11223344556677", parts: [{t:"11 22 33 44 55 66 77", c:"text-blue-600"}] },
  { id: 20, section: "Run", name: "Tricolor Run", type: "C", desc: "1-2-3 in 3 colors plus Flowers", code: "123123123FF", parts: [{t:"123", c:"text-blue-600"}, {t:"123", c:"text-green-600"}, {t:"123", c:"text-red-600"}, {t:"FF", c:"text-pink-500"}] },
  { id: 21, section: "Run", name: "Dragon Run Set", type: "X", desc: "3 Pungs Run, Kong Dragons", code: "111222333DDDD", parts: [{t:"111 222 333", c:"text-blue-600"}, {t:"DDDD", c:"text-slate-500"}] },
  { id: 22, section: "Run", name: "Five Pung Run", type: "X", desc: "5 Consecutive Pungs mixed suits", code: "111222333444555", parts: [{t:"111 222", c:"text-blue-600"}, {t:"333", c:"text-green-600"}, {t:"444 555", c:"text-red-600"}] },
  // WINDS & DRAGONS
  { id: 23, section: "Winds", name: "The Big Four", type: "X", desc: "Kongs of all four winds", code: "NNNNSSSSEEEEWWWW", parts: [{t:"NNNN SSSS EEEE WWWW", c:"text-slate-500"}] },
  { id: 24, section: "Winds", name: "Dragon Breath", type: "X", desc: "Kongs of Green, Red, White Dragons", code: "DDDDDDDDDDDDFF", parts: [{t:"DDDD DDDD DDDD", c:"text-slate-500"}, {t:"FF", c:"text-pink-500"}] },
  { id: 25, section: "Winds", name: "Global Traveler", type: "X", desc: "Single N-E-W-S and 3 Kongs", code: "NEWS111122223333", parts: [{t:"NEWS", c:"text-slate-500"}, {t:"1111 2222 3333", c:"text-blue-600"}] },
  { id: 26, section: "Winds", name: "Dragon Pair Set", type: "C", desc: "Pairs of all Dragons and Flowers", code: "DDDDDDFFFF", parts: [{t:"DD DD DD", c:"text-slate-500"}, {t:"FF FF", c:"text-pink-500"}] },
  { id: 27, section: "Winds", name: "Wind Pung Mix", type: "X", desc: "Pungs of Winds and a Run", code: "NNNSSSEEE123", parts: [{t:"NNN SSS EEE", c:"text-slate-500"}, {t:"123", c:"text-blue-600"}] },
  { id: 28, section: "Winds", name: "Dragon Run X", type: "X", desc: "Kong Dragons, Pungs of Numbers", code: "DDDD111222333", parts: [{t:"DDDD", c:"text-slate-500"}, {t:"111 222 333", c:"text-blue-600"}] },
  // QUINTS
  { id: 29, section: "Quints", name: "Quint Run", type: "X", desc: "Quint of 1s and 2s, Flowers", code: "1111122222FFFF", parts: [{t:"11111 22222", c:"text-blue-600"}, {t:"FFFF", c:"text-pink-500"}] },
  { id: 30, section: "Quints", name: "Quint Dragons", type: "X", desc: "Quint of Dragons, Kong numbers", code: "DDDDD11112222", parts: [{t:"DDDDD", c:"text-slate-500"}, {t:"1111 2222", c:"text-blue-600"}] },
  { id: 31, section: "Quints", name: "Triple Quint Run", type: "X", desc: "Three Quints consecutive numbers", code: "111112222233333", parts: [{t:"11111", c:"text-blue-600"}, {t:"22222", c:"text-green-600"}, {t:"33333", c:"text-red-600"}] },
  // SINGLES & PAIRS
  { id: 32, section: "Pairs", name: "Big Odds Pair", type: "C", desc: "Pairs of all odds, Flowers, Dragons", code: "FF1133557799DD", parts: [{t:"FF", c:"text-pink-500"}, {t:"11 33 55 77 99", c:"text-blue-600"}, {t:"DD", c:"text-slate-400"}] },
  { id: 33, section: "Pairs", name: "Street Run Pairs", type: "C", desc: "Full 1-9 suit sequence. No Jokers.", code: "123456789FF", parts: [{t:"1 2 3 4 5 6 7 8 9", c:"text-blue-600"}, {t:"FF", c:"text-pink-500"}] },
  { id: 34, section: "Pairs", name: "Windy Pair Set", type: "C", desc: "Pairs of all Winds and 3 numbers", code: "NNSS EEWW112233", parts: [{t:"NN SS EE WW", c:"text-slate-500"}, {t:"11 22 33", c:"text-blue-600"}] },
  { id: 35, section: "Pairs", name: "Year Pair Mixed", type: "C", desc: "Pairs of Year in 2 suits, Dragons", code: "22002266DDFF", parts: [{t:"22 00", c:"text-blue-600"}, {t:"22 66", c:"text-green-600"}, {t:"DD", c:"text-slate-400"}, {t:"FF", c:"text-pink-500"}] }
];

const COLORS = [
  { name: 'Blue', class: 'text-blue-600' },
  { name: 'Green', class: 'text-green-600' },
  { name: 'Red', class: 'text-red-600' },
  { name: 'Gray', class: 'text-slate-400' },
  { name: 'Pink', class: 'text-pink-500' }
];

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
  const sizes = { sm: "w-8 h-10 text-[10px]", md: "w-12 h-16 text-sm", lg: "w-16 h-24 text-lg" };
  const valDisplay = (tile.val === 0 || tile.val === 'White') ? '0' : tile.val;
  
  return (
    <div 
      onClick={disabled ? null : onClick} 
      className={`${sizes[size]} relative cursor-pointer flex flex-col items-center justify-center border-2 rounded-xl shadow-sm m-0.5 transition-all transform ${!disabled && !isExposed && !isMoving && 'hover:-translate-y-1 active:scale-95'} ${getStyle()} ${isSelected ? 'ring-4 ring-yellow-400 -translate-y-2' : ''} ${isSuggested ? 'ring-2 ring-red-500 border-red-600' : ''} ${isClaimable ? 'animate-bounce ring-4 ring-orange-500 shadow-xl z-20' : ''}`}
    >
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

// --- MAIN APP ---
export default function App() {
  const [gameState, setGameState] = useState('menu');
  const [deck, setDeck] = useState([]);
  const [hand, setHand] = useState([]);
  const [exposures, setExposures] = useState([]);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [ghostStacks, setGhostStacks] = useState({ left: [], across: [], right: [] });
  const [charlestonStep, setCharlestonStep] = useState(0); 
  const [discards, setDiscards] = useState([]);
  const [message, setMessage] = useState("V10.1 Pro Trainer");
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

  // Analysis Effect (Traffic Light Logic)
  useEffect(() => {
    if (gameState === 'charleston' && showCoach && hand.length === 13) {
      const selected = selectedIndices.map(i => hand[i]).filter(Boolean);
      if (selected.length === 0) { setRealTimeFeedback(null); return; }
      const counts = {}; 
      hand.forEach(t => { if (!t) return; const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString(); const k = `${v}-${t.suit||''}`; counts[k] = (counts[k]||0)+1; });
      const selectedKeys = selected.map(t => { const v = (t.val === 'White' || t.val === 0) ? '0' : t.val.toString(); return `${v}-${t.suit||''}`; });
      const brokePairCount = selectedKeys.filter(k => counts[k] > 1).length;
      const flowerCount = selected.filter(t => t.type === 'flower').length;
      const uniqueSuits = new Set(selected.map(t => t.suit).filter(Boolean)).size;

      let fb = { msg: "Monitoring choices...", color: "blue" };
      if (brokePairCount > 0) fb = { msg: `PAIR BREAKER: you are selecting ${brokePairCount} tile(s) from pairs. try to keep sets together!`, color: "red" };
      else if (flowerCount > 0) fb = { msg: `FLOWER LEAK: passing ${flowerCount} Flower(s). risky unless you're committed.`, color: "yellow" };
      else if (selected.length === 3 && uniqueSuits === 1) fb = { msg: `SUIT DENSITY: passing 3 tiles of one suit helps neighbor build clusters.`, color: "yellow" };
      else if (selected.length === 3) fb = { msg: `CLEAN PASS: strategic outliers selected for shedding.`, color: "green" };
      setRealTimeFeedback(fb);
    }
  }, [selectedIndices, hand, gameState, showCoach]);

  const initGame = () => {
    const fullDeck = createDeck();
    const shuffled = [...fullDeck].sort(() => Math.random() - 0.5);
    const dealtHand = shuffled.splice(0, 13);
    const stacks = { left: [], across: [], right: [] };
    const naturals = shuffled.filter(t => t.type !== 'joker');
    for(let i=0; i<6; i++) { stacks.left.push(naturals.splice(0,3)); stacks.across.push(naturals.splice(0,3)); stacks.right.push(naturals.splice(0,3)); }
    const wall = [...naturals, ...shuffled.filter(t => t.type === 'joker')].sort(() => Math.random() - 0.5);
    
    // Tiered Reset to prevent race conditions
    setSelectedIndices([]); setDiscards([]); setDrawnTile(null);
    setPendingDiscardIdx(null); setClaimableTile(null); setBestMatch(null); 
    setCharlestonStep(0); setAiSuggestionReason(""); setExposures([]);
    setGhostStacks(stacks); setDeck(wall);
    setHand(dealtHand.sort((a,b) => (a.suit || a.type).localeCompare(b.suit || b.type)));
    setGameState('charleston');
    setMessage(`Pass to the ${steps[0]}`);
  };

  const handleTileAction = (i) => {
    const now = Date.now();
    // 1. Double-Tap Reorder Mode
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

    // 2. Selection Logic
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
    const tile = pendingDiscardIdx === -1 ? drawnTile : hand[pendingDiscardIdx];
    const newHand = pendingDiscardIdx === -1 ? [...hand] : hand.filter((_, idx) => idx !== pendingDiscardIdx);
    if (pendingDiscardIdx !== -1 && drawnTile) newHand.push(drawnTile);
    setDiscards(p => [tile, ...p]);
    setHand(newHand); setDrawnTile(null); setPendingDiscardIdx(null);
    if (deck.length > 0) {
      const dCopy = [...deck]; const ghost = dCopy.shift(); setDeck(dCopy);
      setClaimableTile(ghost); setClaimTimer(5);
      if(timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setClaimTimer(p => {
          if (p <= 1) { clearInterval(timerRef.current); setDiscards(prev => [ghost, ...prev]); setClaimableTile(null); return 0; }
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
    <div className="min-h-screen bg-slate-100 p-2 md:p-4 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200">
        
        {/* HEADER */}
        <div className="bg-slate-900 text-white p-5 flex justify-between items-center border-b-4 border-orange-500">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-orange-500" />
            <div>
              <h1 className="text-xl font-black text-yellow-400 uppercase leading-none tracking-tight">Pro Coach V10.1</h1>
              <p className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mt-1 italic tracking-tighter">Hand Persistence Update</p>
            </div>
          </div>
          <div className="flex gap-2">
            {gameState !== 'menu' && <button onClick={() => setShowCard(true)} className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg"><BookOpen className="w-4 h-4" /> Card</button>}
            <button onClick={() => setGameState('menu')} className="p-1.5 bg-slate-800 rounded-lg hover:bg-slate-700 transition-all"><RotateCcw className="w-4 h-4 text-slate-400" /></button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          
          {showTutorial && gameState !== 'menu' && (
            <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl relative shadow-xl border-l-4 border-blue-500 animate-in slide-in-from-top-4">
              <button onClick={() => setShowTutorial(false)} className="absolute top-2 right-2 text-slate-500 hover:text-white"><X className="w-4 h-4" /></button>
              <div className="flex gap-3">
                <HelpCircle className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div className="text-[10px] font-medium uppercase tracking-tight leading-relaxed">
                  <p className="font-black text-blue-300 mb-1">Mobile Organization Tip:</p>
                  <p>• **Double-Tap** a tile to "pick it up".</p>
                  <p>• **Single-Tap** another tile to move it there.</p>
                </div>
              </div>
            </div>
          )}

          {gameState === 'menu' && (
            <div className="text-center py-16 animate-in fade-in zoom-in space-y-8">
              <Zap className="w-14 h-14 text-orange-500 mx-auto" />
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Physical Logic.</h2>
                <p className="max-w-sm mx-auto text-slate-500 text-sm font-medium italic">Integrated coaching feedback, custom hand lab, and rack organization tools.</p>
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button onClick={initGame} className="px-12 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-[2rem] font-black text-lg shadow-xl flex items-center justify-center gap-2 transition-all"><Play className="w-6 h-6 fill-current" /> Start Session</button>
                <button onClick={() => setGameState('creator')} className="px-12 py-5 bg-slate-900 hover:bg-black text-white rounded-[2rem] font-black text-lg shadow-xl transition-all flex items-center justify-center gap-2"><PlusCircle className="w-6 h-6" /> Hand Lab</button>
              </div>
            </div>
          )}

          {gameState === 'creator' && (
            <div className="space-y-4 animate-in slide-in-from-right-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xl font-black uppercase text-slate-700 flex items-center gap-2"><Brain className="w-5 h-5 text-blue-600" /> Designer Lab</h3>
                <button onClick={() => setGameState('menu')} className="text-slate-400 hover:text-red-500"><X /></button>
              </div>
              {creatorError && <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-center gap-3 text-red-600 animate-in shake"><AlertTriangle className="w-5 h-5" /><p className="text-xs font-bold uppercase">{creatorError}</p></div>}
              <div className="bg-slate-50 p-5 rounded-[2rem] border-2 border-slate-200 space-y-4 shadow-inner">
                <div className="flex flex-col md:flex-row gap-3 items-center">
                  <input value={creatorName} onChange={e => setCreatorName(e.target.value)} className="bg-white border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold w-full md:flex-1 outline-blue-500 shadow-sm" placeholder="Set hand name..." />
                  <div className="flex gap-2 bg-white p-2 rounded-xl border-2 border-slate-200 shadow-sm">
                    {COLORS.map(c => <button key={c.name} onClick={() => setCreatorColor(c)} className={`w-7 h-7 rounded-full border-2 ${c.class.replace('text','bg')} ${creatorColor.name === c.name ? 'ring-2 ring-slate-800' : 'opacity-30'}`} />)}
                  </div>
                </div>
                <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5">
                  {[1,2,3,4,5,6,7,8,9,0].map(n => <button key={n} onClick={() => addToCreator(n, 'number')} className="bg-white border-2 border-slate-200 py-3 rounded-xl font-black text-xs hover:bg-blue-50 shadow-sm transition-colors">{n === 0 ? 'Soap' : n}</button>)}
                  {['N','S','E','W'].map(w => <button key={w} onClick={() => addToCreator(w, 'wind')} className="bg-white border-2 border-slate-200 py-3 rounded-xl font-black text-xs hover:bg-blue-50 shadow-sm transition-colors">{w}</button>)}
                  {['Green','Red','White'].map(d => <button key={d} onClick={() => addToCreator(d, 'dragon')} className="bg-white border-2 border-slate-200 py-3 rounded-xl font-black text-[9px] hover:bg-blue-50 shadow-sm transition-colors">{d}</button>)}
                  <button onClick={() => addToCreator('F', 'flower')} className="bg-pink-100 border-2 border-pink-300 py-3 rounded-xl font-black text-pink-700 text-xs col-span-2 shadow-sm uppercase">Flower</button>
                </div>
                <div className="bg-white p-6 rounded-2xl min-h-[100px] flex flex-wrap gap-1.5 items-center justify-center border-2 border-dashed border-slate-300 shadow-inner">
                  {creatorBuffer.map((t, i) => (
                    <div key={i} className={`w-9 h-14 border-2 rounded-lg flex items-center justify-center font-black text-sm relative group bg-white shadow-sm animate-in zoom-in ${t.colorClass}`}>
                      {t.valStr}
                      <button onClick={() => setCreatorBuffer(p => p.filter((_, idx) => idx !== i))} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 shadow-sm"><X className="w-3 h-3" /></button>
                    </div>
                  ))}
                </div>
                <button onClick={saveCustomHand} disabled={creatorBuffer.length !== 14} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:bg-black transition-all"><Save className="w-4 h-4" /> Save Hand</button>
              </div>
            </div>
          )}

          {(gameState === 'charleston' || gameState === 'playing' || gameState === 'finished') && (
            <div className="space-y-4 animate-in fade-in">
              {/* PINNED */}
              <div className="flex justify-center gap-2 min-h-[60px]">
                {pinnedHandIds.map(id => {
                  const h = fullLibrary.find(x => x.id === id);
                  if (!h) return null;
                  return (
                    <div key={id} className="bg-white border-2 border-blue-100 p-2.5 rounded-2xl shadow-md w-72 relative animate-in slide-in-from-top-4">
                      <p className="text-[8px] font-black text-blue-600 uppercase mb-1 flex justify-between"><span>{h.name}</span><PinOff className="w-2.5 h-2.5 text-slate-300 cursor-pointer" onClick={() => togglePin(id)} /></p>
                      <HandCode parts={h.parts} />
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-9 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-center gap-3 shadow-sm">
                  <div className={`p-2 rounded-xl ${gameState === 'charleston' ? 'bg-orange-600' : 'bg-green-600'} text-white shadow-md`}><User className="w-5 h-5" /></div>
                  <div className="overflow-hidden">
                    <p className="text-[8px] font-black text-blue-500 uppercase tracking-widest leading-none mb-1">{gameState === 'charleston' ? `Step: ${steps[charlestonStep]}` : 'Active Play'}</p>
                    <p className="font-black text-slate-800 text-xs truncate uppercase tracking-tighter">{message}</p>
                  </div>
                </div>
                <div className="md:col-span-3 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between shadow-xl">
                  <TrendingUp className="w-4 h-4 text-yellow-400" />
                  <span className="text-2xl font-black tabular-nums tracking-tighter">{deck.length}</span>
                </div>
              </div>

              {/* COACH AI PANEL (TRAFFIC LIGHT) */}
              {gameState === 'charleston' && showCoach && (realTimeFeedback || aiSuggestionReason) && (
                <div className={`p-4 rounded-2xl border-2 flex items-center gap-4 animate-in slide-in-from-top-2 shadow-sm relative ${coachColorStyles[realTimeFeedback?.color || 'green']}`}>
                   <button onClick={() => setShowCoach(false)} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
                   <div className={`p-2 rounded-full text-white shadow-sm ${realTimeFeedback?.color === 'red' ? 'bg-red-500' : realTimeFeedback?.color === 'yellow' ? 'bg-yellow-500' : realTimeFeedback?.color === 'blue' ? 'bg-blue-500' : 'bg-green-500'}`}>
                     {realTimeFeedback?.color === 'red' ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                   </div>
                   <div className="pr-4">
                     <p className="text-[8px] font-black uppercase opacity-60 leading-none mb-1">Coach Logic</p>
                     <p className="text-xs font-bold leading-tight italic">{aiSuggestionReason || realTimeFeedback?.msg}</p>
                   </div>
                </div>
              )}

              {bestMatch && gameState === 'playing' && (
                <div className="bg-yellow-50 border-2 border-yellow-200 p-4 rounded-3xl flex flex-col gap-3 animate-in slide-in-from-left-2 shadow-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Target className="w-5 h-5 text-orange-500" />
                      <p className="font-black text-sm text-slate-800 uppercase tracking-tighter">{bestMatch.name}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-black text-orange-600">{bestMatch.pct}% Match</span>
                      <button onClick={() => setBestMatch(null)} className="text-slate-400 hover:text-red-500"><X className="w-5 h-5" /></button>
                    </div>
                  </div>
                  <div className="bg-white/50 p-3 rounded-xl border border-yellow-100 shadow-inner"><HandCode parts={bestMatch.parts} /></div>
                </div>
              )}

              <div className="bg-slate-50 p-4 md:p-8 rounded-[3rem] border-2 border-slate-200 shadow-inner min-h-[450px] flex flex-col justify-between relative overflow-hidden">
                <div className="flex flex-wrap justify-center gap-3 mb-3 min-h-[30px] border-b border-slate-200 pb-3">
                  {exposures.length === 0 && <span className="text-[8px] font-black uppercase text-slate-300 italic tracking-[0.2em]">Exposures Row</span>}
                  {exposures.map((set, i) => (
                    <div key={i} className="flex bg-white/70 p-1 rounded-lg border border-slate-200 shadow-sm animate-in zoom-in">{set.map(t => <Tile key={t.id} tile={t} size="sm" isExposed={true} />)}</div>
                  ))}
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  {claimableTile ? (
                    <div className="bg-orange-50 border-2 border-orange-500 p-6 rounded-[2rem] flex flex-col items-center gap-3 animate-in zoom-in shadow-2xl z-30">
                      <div className="absolute -top-3 bg-orange-600 text-white px-3 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1.5"><Timer className="w-2.5 h-2.5 animate-spin" /> {claimTimer}s</div>
                      <Tile tile={claimableTile} size="lg" isClaimable={true} />
                      <div className="flex gap-2">
                        {!isClaimingMode ? (
                          <button onClick={() => { setIsClaimingMode(true); clearInterval(timerRef.current); }} className="bg-orange-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-orange-700 shadow-lg flex items-center gap-2 uppercase tracking-widest transition-all"><Hand className="w-3 h-3" /> Call</button>
                        ) : (
                          <button onClick={() => {
                            const sel = selectedIndices.map(i => hand[i]);
                            const matchV = (claimableTile.val === 'White' || claimableTile.val === 0) ? 'White' : claimableTile.val;
                            if(sel.every(t => t.val === matchV || t.type === 'joker') && sel.length >= 2) {
                              setExposures([...exposures, [...sel, claimableTile]]);
                              setHand(hand.filter((_, i) => !selectedIndices.includes(i)));
                              setClaimableTile(null); setIsClaimingMode(false); setSelectedIndices([]);
                              setMessage("Exposure confirmed.");
                            } else { setMessage("Invalid Call."); }
                          }} className="bg-green-600 text-white px-6 py-2 rounded-xl font-black text-xs hover:bg-green-700 shadow-lg flex items-center gap-2 uppercase tracking-widest transition-all"><CheckCircle2 className="w-3 h-3" /> Finish</button>
                        )}
                        <button onClick={() => { setClaimableTile(null); setIsClaimingMode(false); setSelectedIndices([]); }} className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-red-500 transition-colors"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ) : (
                    <div className="opacity-10 flex flex-col items-center gap-2"><div className="w-16 h-24 border-2 border-dashed border-slate-400 rounded-2xl shadow-inner"></div><p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Discard Zone</p></div>
                  )}
                </div>

                <div className="flex flex-wrap justify-center gap-1 mt-6 border-t border-slate-200 pt-6">
                  {hand.map((tile, idx) => (
                    <Tile 
                      key={tile.id} 
                      tile={tile} 
                      onClick={() => handleTileAction(idx)} 
                      isSelected={selectedIndices.includes(idx) || pendingDiscardIdx === idx} 
                      disabled={gameState === 'charleston' && tile.type === 'joker'} 
                      isSuggested={suggestedIndices.includes(idx)} 
                      isMoving={movingIndex === idx}
                    />
                  ))}
                  {gameState === 'playing' && !isClaimingMode && (
                    <div className="ml-2 pl-2 border-l border-slate-200 flex items-center">
                      {drawnTile ? (
                        <Tile tile={drawnTile} size="lg" isSelected={pendingDiscardIdx === -1} onClick={() => setPendingDiscardIdx(-1)} />
                      ) : (
                        <button onClick={() => !claimableTile && setDrawnTile(deck[0])} disabled={deck.length === 0 || !!claimableTile} className="w-14 h-20 border-2 border-blue-300 border-dashed rounded-xl bg-blue-50 text-blue-300 flex items-center justify-center transition-all group shadow-sm"><Play className="w-6 h-6 group-hover:scale-110" /></button>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-center gap-3 min-h-[50px]">
                  {gameState === 'charleston' ? (
                    <div className="flex gap-2">
                      <button onClick={suggestPass} className="px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-black text-[9px] flex items-center gap-2 uppercase tracking-widest hover:bg-slate-50 shadow-md transition-all"><Brain className="w-4 h-4 text-orange-500" /> AI Suggest</button>
                      <button onClick={processPass} disabled={selectedIndices.length !== 3} className={`px-10 py-3 rounded-xl font-black flex items-center gap-3 shadow-xl transition-all text-xs ${selectedIndices.length === 3 ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-200 text-slate-400 cursor-not-allowed uppercase'}`}>Confirm Pass</button>
                    </div>
                  ) : pendingDiscardIdx !== null ? (
                    <div className="flex gap-2 animate-in slide-in-from-bottom-2">
                       <button onClick={() => setPendingDiscardIdx(null)} className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-xs hover:bg-slate-50">Cancel</button>
                       <button onClick={confirmDiscard} className="px-10 py-3 bg-red-600 text-white rounded-xl font-black flex items-center gap-2 shadow-lg text-xs hover:bg-red-700 transition-all uppercase tracking-widest">Discard</button>
                    </div>
                  ) : gameState === 'playing' && (
                    <button onClick={identifyBestHand} className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm flex items-center gap-2 shadow-2xl active:scale-95 uppercase tracking-widest transition-all"><Target className="w-4 h-4 text-yellow-400" /> Hand Identify</button>
                  )}
                </div>
              </div>

              {/* HISTORY */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-24 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
                <h4 className="text-[8px] font-black text-slate-400 uppercase mb-2 tracking-[0.2em] font-black uppercase"><Search className="w-2.5 h-2.5 inline mr-1" /> Discard History</h4>
                <div className="flex flex-wrap gap-1 content-start">{discards.map((t, i) => <div key={i} className="scale-75"><Tile tile={t} size="sm" /></div>)}</div>
              </div>
            </div>
          )}

          {showCard && (
            <div className="fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl max-h-[85vh] rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in">
                <div className="p-5 bg-slate-50 border-b flex justify-between items-center"><h3 className="font-black text-slate-800 uppercase tracking-widest text-sm tracking-tighter flex items-center gap-2"><BookOpen className="w-4 h-4" /> Library</h3><button onClick={() => setShowCard(false)} className="p-1 text-slate-400 hover:text-red-500 transition-colors"><X /></button></div>
                <div className="flex-1 overflow-y-auto p-5 space-y-8 pb-20 scrollbar-hide">
                  {sessionCustomHands.length > 0 && (
                    <div><h4 className="text-blue-600 font-black text-xs uppercase tracking-widest mb-4 border-b-2 border-blue-100 pb-1">Session Custom Targets</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{sessionCustomHands.map(h => (<div key={h.id} className="p-4 bg-blue-50/50 rounded-2xl border-2 border-blue-200 relative shadow-sm"><button onClick={() => togglePin(h.id)} className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${pinnedHandIds.includes(h.id) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}><Pin className="w-3.5 h-3.5" /></button><div className="font-black text-slate-800 text-sm mb-2 uppercase">{h.name}</div><div className="bg-white p-3 rounded-xl border border-slate-200 mb-2 shadow-inner"><HandCode parts={h.parts} /></div><div className="text-[9px] font-bold text-slate-400 uppercase leading-snug">{h.desc}</div><button onClick={() => setSessionCustomHands(p => p.filter(x => x.id !== h.id))} className="mt-3 text-red-400 text-[8px] font-black uppercase flex items-center gap-1 hover:text-red-600"><Trash className="w-2.5 h-2.5" /> Remove</button></div>))}</div></div>
                  )}
                  <div><h4 className="text-slate-400 font-black text-xs uppercase tracking-widest mb-4 border-b-2 border-slate-100 pb-1">Standard Library</h4><div className="grid grid-cols-1 md:grid-cols-2 gap-4">{STANDARD_TEMPLATES.map(h => (<div key={h.id} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100 relative shadow-sm hover:border-blue-300 transition-colors"><button onClick={() => togglePin(h.id)} className={`absolute top-3 right-3 p-1.5 rounded-full transition-all ${pinnedHandIds.includes(h.id) ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400'}`}><Pin className="w-3.5 h-3.5" /></button><div className="flex justify-between font-black text-[8px] text-blue-600 uppercase mb-1"><span>{h.section} | {h.type}</span></div><div className="font-black text-slate-800 text-sm mb-2 uppercase">{h.name}</div><div className="bg-white p-3 rounded-xl border border-slate-200 mb-2 shadow-inner"><HandCode parts={h.parts} /></div><div className="text-[9px] font-bold text-slate-400 uppercase leading-snug">{h.desc}</div></div>))}</div></div>
                </div>
              </div>
            </div>
          )}

          {gameState === 'finished' && (
            <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-4 z-[100]">
              <div className="bg-white rounded-[3rem] p-12 max-w-sm w-full text-center border-b-8 border-orange-600 shadow-2xl">
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6 shadow-sm" />
                <h2 className="text-4xl font-black text-slate-900 leading-none tracking-tighter uppercase">Training Over</h2>
                <button onClick={initGame} className="w-full py-5 bg-orange-600 text-white rounded-[2rem] font-black text-lg hover:bg-orange-700 shadow-xl transition-all">RESTART</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
