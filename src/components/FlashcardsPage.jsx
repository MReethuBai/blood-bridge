import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  RotateCw, 
  Bookmark, 
  Star, 
  Shuffle, 
  Timer, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Award,
  Play,
  Pause
} from 'lucide-react';

export default function FlashcardsPage({ onBackToLanding }) {
  const [cards, setCards] = useState([
    {
      id: 1,
      question: "What is the Michaelis Constant ($K_m$)?",
      answer: "The substrate concentration at which the reaction velocity is half of its maximum velocity ($V_{max}/2$). Lower $K_m$ indicates higher enzyme-substrate affinity.",
      topic: "Enzyme Kinetics",
      bookmarked: false,
      favorite: false
    },
    {
      id: 2,
      question: "What is the difference between Competitive and Non-Competitive Inhibition?",
      answer: "Competitive inhibitors bind to the active site (increases apparent $K_m$, unchanged $V_{max}$). Non-competitive inhibitors bind allosterically (unchanged $K_m$, decreases $V_{max}$).",
      topic: "Inhibition",
      bookmarked: true,
      favorite: true
    },
    {
      id: 3,
      question: "What defines Scaled Dot-Product Self-Attention?",
      answer: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V. Scaling prevents dot products from vanishing gradients in high dimensions.",
      topic: "Transformers",
      bookmarked: false,
      favorite: true
    },
    {
      id: 4,
      question: "What is the role of CUDA Warp Synchronization in linear attention?",
      answer: "Warp-level shuffle primitives allow threads within a 32-thread GPU warp to exchange intermediate attention sums without shared memory latency.",
      topic: "CUDA Optimization",
      bookmarked: false,
      favorite: false
    }
  ]);

  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentCardIdx(0);
  };

  const toggleBookmark = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, bookmarked: !c.bookmarked } : c));
  };

  const toggleFavorite = (id) => {
    setCards(cards.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c));
  };

  const currentCard = cards[currentCardIdx];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP HEADER */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-[12px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Spaced Repetition Flashcards <span className="text-xs text-[#10B981] font-semibold">3D Flip Engine</span>
            </span>
          </div>
        </div>

        {/* TIMER & SHUFFLE CONTROLS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Timer className="w-4 h-4 text-[#10B981]" />
            <span>{formatTimer(secondsElapsed)}</span>
            <button onClick={() => setIsTimerRunning(!isTimerRunning)} className="ml-1 text-slate-400 hover:text-slate-600">
              {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>
          </div>

          <button
            onClick={handleShuffle}
            className="px-3 py-1.5 text-xs font-bold rounded-[12px] bg-[#10B981] hover:bg-[#0ea572] text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle Cards</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full flex flex-col justify-center">
        
        {/* PROGRESS BAR & CARD COUNT */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Card {currentCardIdx + 1} of {cards.length}</span>
            <span className="text-[#10B981]">Progress: {Math.round(((currentCardIdx + 1) / cards.length) * 100)}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 transition-all duration-300" 
              style={{ width: `${((currentCardIdx + 1) / cards.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 3D FLIP CARD INTERFACE */}
        <div className="w-full h-96 perspective-1000 cursor-pointer">
          <motion.div
            onClick={() => setIsFlipped(!isFlipped)}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full h-full rounded-[28px] bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border-2 border-emerald-500/40 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10 text-white preserve-3d"
          >
            {/* Front Card Face */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {currentCard.topic}
                </span>
                
                {/* Favorite & Bookmark Buttons */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleBookmark(currentCard.id); }}
                    className={`p-2 rounded-full border transition-colors ${currentCard.bookmarked ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 'text-slate-400 border-slate-700'}`}
                  >
                    <Bookmark className={`w-4 h-4 ${currentCard.bookmarked ? 'fill-amber-400' : ''}`} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(currentCard.id); }}
                    className={`p-2 rounded-full border transition-colors ${currentCard.favorite ? 'bg-rose-500/20 text-rose-400 border-rose-500' : 'text-slate-400 border-slate-700'}`}
                  >
                    <Star className={`w-4 h-4 ${currentCard.favorite ? 'fill-rose-400' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="text-center px-4">
                <h3 className="text-xl sm:text-2xl font-bold leading-relaxed">
                  {currentCard.question}
                </h3>
              </div>

              <div className="text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
                <RotateCw className="w-4 h-4" /> Tap card to reveal answer
              </div>
            </div>

            {/* Back Card Face */}
            <div className={`absolute inset-0 p-8 flex flex-col justify-between bg-slate-950 rounded-[28px] border-2 border-[#10B981] ${isFlipped ? 'flex' : 'hidden'}`}>
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase">
                <span>AI Concept Answer</span>
                <Sparkles className="w-4 h-4" />
              </div>

              <p className="text-base sm:text-lg font-medium text-slate-200 text-center leading-relaxed px-4">
                {currentCard.answer}
              </p>

              <div className="text-center text-xs text-slate-400 font-semibold">
                Tap again to flip back
              </div>
            </div>

          </motion.div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => { setIsFlipped(false); setCurrentCardIdx((currentCardIdx - 1 + cards.length) % cards.length); }}
            className="px-5 py-3 rounded-[16px] bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-2 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Card</span>
          </button>

          <button
            onClick={() => { setIsFlipped(false); setCurrentCardIdx((currentCardIdx + 1) % cards.length); }}
            className="px-6 py-3 rounded-[16px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <span>Next Card</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </main>

    </div>
  );
}
