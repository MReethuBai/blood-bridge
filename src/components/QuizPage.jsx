import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  HelpCircle, 
  Play, 
  RotateCcw, 
  Award, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Trophy, 
  Sparkles, 
  Users, 
  Flame
} from 'lucide-react';

export default function QuizPage({ onBackToLanding }) {
  const [quizState, setQuizState] = useState('intro'); // 'intro' | 'active' | 'completed'
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [timerSeconds, setTimerSeconds] = useState(120); // 2 minute countdown
  const [timerActive, setTimerActive] = useState(false);

  const questions = [
    {
      id: 1,
      question: "What happens to maximum velocity ($V_{max}$) in competitive inhibition?",
      options: [
        "A) Decreases by 50%",
        "B) Remains completely unchanged",
        "C) Increases linearly with substrate",
        "D) Drops to zero"
      ],
      correctIndex: 1
    },
    {
      id: 2,
      question: "Which computational complexity does IEEE Linear Attention achieve?",
      options: [
        "A) O(N^3)",
        "B) O(N^2)",
        "C) O(N log N)",
        "D) O(1)"
      ],
      correctIndex: 2
    },
    {
      id: 3,
      question: "What is the Michaelis constant ($K_m$) equal to?",
      options: [
        "A) Substrate concentration at V_max",
        "B) Substrate concentration at V_max / 2",
        "C) Enzyme concentration at V_max",
        "D) Inhibitor dissociation constant"
      ],
      correctIndex: 1
    }
  ];

  // Leaderboard mock data
  const leaderboard = [
    { rank: 1, name: "Dr. Alex Vance", score: "3/3 (100%)", time: "0:42" },
    { rank: 2, name: "Elena Rostova", score: "3/3 (100%)", time: "0:55" },
    { rank: 3, name: "Kenji Sato", score: "2/3 (66%)", time: "1:08" }
  ];

  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      handleCompleteQuiz();
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const handleStartQuiz = () => {
    setQuizState('active');
    setCurrentIdx(0);
    setScore({ correct: 0, wrong: 0 });
    setSelectedOption(null);
    setTimerSeconds(120);
    setTimerActive(true);
  };

  const handleAnswerSelect = (optionIdx) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);

    const isCorrect = optionIdx === questions[currentIdx].correctIndex;
    if (isCorrect) {
      setScore(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      setScore(prev => ({ ...prev, wrong: prev.wrong + 1 }));
    }

    setTimeout(() => {
      if (currentIdx + 1 < questions.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
      } else {
        handleCompleteQuiz();
      }
    }, 1000);
  };

  const handleCompleteQuiz = () => {
    setTimerActive(false);
    setQuizState('completed');
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

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
              <Trophy className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Interactive Timed Quiz <span className="text-xs text-[#10B981] font-semibold">Live Leaderboard</span>
            </span>
          </div>
        </div>

        {/* TIMER DISPLAY */}
        {quizState === 'active' && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-[12px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 border border-emerald-200 text-xs font-extrabold">
            <Timer className="w-4 h-4" />
            <span>Time Left: {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        )}
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full flex flex-col justify-center">
        
        {/* VIEW 1: INTRO LANDING */}
        {quizState === 'intro' && (
          <div className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-6">
            <div className="w-20 h-20 rounded-[24px] bg-emerald-50 dark:bg-emerald-950 text-[#10B981] flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
              <Trophy className="w-10 h-10" />
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Ready for the Timed Quiz Challenge?
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                Test your mastery on Enzyme Kinetics & IEEE Linear Attention. Complete the quiz to climb the live leaderboard!
              </p>
            </div>

            <button
              onClick={handleStartQuiz}
              className="px-8 py-4 rounded-[18px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Quiz Challenge</span>
            </button>
          </div>
        )}

        {/* VIEW 2: ACTIVE QUIZ */}
        {quizState === 'active' && (
          <div className="space-y-6">
            {/* Progress Bar & Live Score Trackers */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Question {currentIdx + 1} of {questions.length}</span>
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500">Correct: {score.correct}</span>
                  <span className="text-rose-500">Wrong: {score.wrong}</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#10B981] transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-6">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {questions[currentIdx].question}
              </h3>

              <div className="space-y-3">
                {questions[currentIdx].options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === questions[currentIdx].correctIndex;
                  
                  let style = "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-[#10B981]";
                  if (selectedOption !== null) {
                    if (isCorrect) style = "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border-emerald-500 font-bold";
                    else if (isSelected) style = "bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-500 font-bold";
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(idx)}
                      className={`w-full p-4 text-left text-xs font-semibold rounded-[16px] border transition-all flex items-center justify-between ${style}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-[#10B981]" />}
                      {selectedOption !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: COMPLETED QUIZ WITH CELEBRATION & LEADERBOARD */}
        {quizState === 'completed' && (
          <div className="space-y-6">
            
            {/* Completion Summary Card */}
            <div className="p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950 text-[#10B981] flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  🎉 Quiz Completed! Excellent Effort!
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  You scored <span className="font-bold text-[#10B981]">{score.correct} / {questions.length}</span> correct answers.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="px-6 py-3 rounded-[16px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retry Quiz</span>
                </button>
              </div>
            </div>

            {/* Leaderboard Rankings */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Users className="w-5 h-5 text-[#10B981]" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Live Global Leaderboard
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                {leaderboard.map((user) => (
                  <div key={user.rank} className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between font-semibold">
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-bold text-[#10B981]">#{user.rank}</span>
                      <span>{user.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-500">
                      <span>{user.score}</span>
                      <span>⏱️ {user.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
