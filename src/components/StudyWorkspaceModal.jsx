import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Mic, 
  CheckCircle2, 
  Play, 
  Pause, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Volume2, 
  Award, 
  ListChecks,
  ChevronRight,
  Brain,
  Zap
} from 'lucide-react';

export default function StudyWorkspaceModal({ isOpen, onClose, selectedItem }) {
  const [activeSubTab, setActiveSubTab] = useState('flashcards');

  // Flashcards state
  const [currentCardIdx, setCurrentCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = [
    {
      question: "What is the primary advantage of Self-Attention over Recurrent Neural Networks (RNNs)?",
      answer: "Self-Attention processes all input tokens simultaneously (parallelization), eliminating sequential bottlenecking and capturing long-range dependencies efficiently.",
      topic: "Machine Learning"
    },
    {
      question: "What is the formula for Scaled Dot-Product Attention?",
      answer: "Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V",
      topic: "Neural Networks"
    },
    {
      question: "Why do we scale by sqrt(d_k) in dot-product attention?",
      answer: "To prevent dot products from growing excessively large in high dimensions, which would push the softmax function into regions with extremely small gradients.",
      topic: "Optimization"
    }
  ];

  // MCQ Quiz state
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const quizQuestion = {
    question: "Which optimizer technique combines momentum with adaptive learning rates per parameter?",
    options: [
      "Stochastic Gradient Descent (SGD)",
      "Adam (Adaptive Moment Estimation)",
      "RMSprop",
      "AdaGrad"
    ],
    correctIndex: 1
  };

  // Voice Learning state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!isOpen) return null;

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentCardIdx((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleSelectAnswer = (idx) => {
    if (quizSubmitted) return;
    setSelectedOption(idx);
    setQuizSubmitted(true);
    if (idx === quizQuestion.correctIndex) {
      setQuizScore(prev => prev + 1);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/70 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-5xl h-[88vh] bg-slate-900 text-white rounded-[24px] border border-emerald-500/30 shadow-2xl overflow-hidden flex flex-col"
        >
          
          {/* TOP HEADER */}
          <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[14px] bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Study Workspace
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#10B981] text-white">
                    Mastery Mode
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedItem ? selectedItem.title : 'Machine Learning Fundamentals'}
                </p>
              </div>
            </div>

            {/* Score & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-bold text-emerald-300">
                <Award className="w-4 h-4 text-[#10B981]" />
                <span>92% Mastery</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WORKSPACE NAV TABS */}
          <div className="px-5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('flashcards')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'flashcards'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Flashcards ({flashcards.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('quiz')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'quiz'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>MCQ Quiz Generator</span>
            </button>

            <button
              onClick={() => setActiveSubTab('notes')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'notes'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Automatic Notes & Summary</span>
            </button>

            <button
              onClick={() => setActiveSubTab('voice')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'voice'
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>Voice Learning (NotebookLM Audio)</span>
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60">
            
            {/* SUB-TAB 1: FLASHCARDS */}
            {activeSubTab === 'flashcards' && (
              <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto space-y-6">
                
                {/* 3D FLIP CARD */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full h-72 cursor-pointer perspective-1000 group"
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
                    className="relative w-full h-full rounded-[24px] bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-emerald-500/40 p-8 flex flex-col justify-between shadow-2xl shadow-emerald-500/10 preserve-3d"
                  >
                    {/* Front Face */}
                    <div className={`absolute inset-0 p-8 flex flex-col justify-between backface-hidden ${isFlipped ? 'hidden' : 'flex'}`}>
                      <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span>Card {currentCardIdx + 1} of {flashcards.length}</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {flashcards[currentCardIdx].topic}
                        </span>
                      </div>

                      <p className="text-lg font-bold text-white text-center">
                        {flashcards[currentCardIdx].question}
                      </p>

                      <div className="text-center text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                        <RotateCw className="w-3.5 h-3.5" /> Click card to reveal answer
                      </div>
                    </div>

                    {/* Back Face */}
                    <div className={`absolute inset-0 p-8 flex flex-col justify-between bg-slate-950 rounded-[24px] border-2 border-[#10B981] ${isFlipped ? 'flex' : 'hidden'}`}>
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                        <span>AI Answer Explanation</span>
                        <Sparkles className="w-4 h-4" />
                      </div>

                      <p className="text-sm font-medium text-slate-200 leading-relaxed text-center">
                        {flashcards[currentCardIdx].answer}
                      </p>

                      <div className="text-center text-xs text-slate-400 font-semibold">
                        Tap again to flip back
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Flashcard Navigation */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrevCard}
                    className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <span className="text-xs font-bold text-slate-300">
                    {currentCardIdx + 1} / {flashcards.length}
                  </span>

                  <button
                    onClick={handleNextCard}
                    className="p-3 rounded-full bg-[#10B981] hover:bg-[#0ea572] text-white shadow-lg shadow-emerald-500/25 transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: MCQ QUIZ MODE */}
            {activeSubTab === 'quiz' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="p-6 rounded-[20px] bg-slate-800/80 border border-slate-700 space-y-4">
                  <div className="flex items-center justify-between text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    <span>Generated MCQ Question 1/10</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">Score: {quizScore}</span>
                  </div>

                  <h4 className="text-base font-bold text-white">
                    {quizQuestion.question}
                  </h4>

                  <div className="space-y-2.5 pt-2">
                    {quizQuestion.options.map((opt, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrect = idx === quizQuestion.correctIndex;
                      
                      let btnStyle = "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600";
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = "bg-emerald-950 border-emerald-500 text-emerald-200";
                        else if (isSelected) btnStyle = "bg-rose-950 border-rose-500 text-rose-200";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full p-3.5 text-left text-xs font-semibold rounded-[14px] border transition-all flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="pt-3 border-t border-slate-700 text-center">
                      <p className="text-xs font-bold text-emerald-400">
                        {selectedOption === quizQuestion.correctIndex ? '🎉 Excellent! Correct Answer.' : '❌ Incorrect. Adam uses both 1st and 2nd raw moments.'}
                      </p>
                      <button
                        onClick={() => { setSelectedOption(null); setQuizSubmitted(false); }}
                        className="mt-3 px-4 py-2 rounded-[12px] bg-[#10B981] text-white font-bold text-xs"
                      >
                        Try Next Question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* SUB-TAB 3: AUTOMATIC NOTES & SUMMARY */}
            {activeSubTab === 'notes' && (
              <div className="max-w-3xl mx-auto space-y-6 text-xs text-slate-300 leading-relaxed">
                <div className="p-6 rounded-[20px] bg-slate-800/50 border border-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-[#10B981] font-bold text-sm">
                    <Sparkles className="w-4 h-4" /> Smart Executive Summary
                  </div>
                  <p>
                    Machine Learning models operate by discovering high-dimensional mathematical representations of data patterns. Key optimization algorithms leverage gradient descent variants to minimize loss functions across parameter space.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-[12px] bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white block">Key Concept 1</span>
                      <span className="text-slate-400 text-[11px]">Backpropagation efficiently computes analytical partial derivatives.</span>
                    </div>
                    <div className="p-3 rounded-[12px] bg-slate-900 border border-slate-800">
                      <span className="font-bold text-white block">Key Concept 2</span>
                      <span className="text-slate-400 text-[11px]">Overfitting is mitigated via L2 Regularization and Dropout.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: VOICE LEARNING */}
            {activeSubTab === 'voice' && (
              <div className="max-w-xl mx-auto space-y-6 text-center">
                <div className="p-8 rounded-[24px] bg-slate-800/70 border border-slate-700 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center justify-center mx-auto">
                    <Mic className="w-8 h-8" />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-base text-white">NotebookLM AI Audio Overview</h4>
                    <p className="text-xs text-slate-400 mt-1">Simulated two-host podcast breakdown of your uploaded notes.</p>
                  </div>

                  {/* Waveform visualizer */}
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    <div className={`w-1.5 bg-[#10B981] rounded-full ${isPlayingAudio ? 'animate-wave-1' : 'h-2'}`} />
                    <div className={`w-1.5 bg-[#10B981] rounded-full ${isPlayingAudio ? 'animate-wave-2' : 'h-3'}`} />
                    <div className={`w-1.5 bg-[#10B981] rounded-full ${isPlayingAudio ? 'animate-wave-3' : 'h-6'}`} />
                    <div className={`w-1.5 bg-[#10B981] rounded-full ${isPlayingAudio ? 'animate-wave-4' : 'h-4'}`} />
                    <div className={`w-1.5 bg-[#10B981] rounded-full ${isPlayingAudio ? 'animate-wave-5' : 'h-2'}`} />
                  </div>

                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="px-6 py-3 rounded-[16px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-lg shadow-emerald-500/25 transition-all"
                  >
                    {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>{isPlayingAudio ? 'Pause AI Voice Overview' : 'Play AI Voice Overview'}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
