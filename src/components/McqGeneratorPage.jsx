import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ListChecks, 
  Sparkles, 
  Download, 
  FileSpreadsheet, 
  Printer, 
  Share2, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  Eye, 
  EyeOff, 
  Sliders, 
  Copy,
  Zap,
  Award
} from 'lucide-react';

export default function McqGeneratorPage({ onBackToLanding }) {
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionCount, setQuestionCount] = useState(10);
  const [selectedTypes, setSelectedTypes] = useState(['MCQ', 'True False', 'Fill Blank']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Sample generated questions state
  const [generatedQuestions, setGeneratedQuestions] = useState([
    {
      id: 1,
      type: 'MCQ',
      question: 'Which rate constant describes the total catalytic efficiency of an enzyme ($k_{cat} / K_m$)?',
      options: [
        'A) Turnover Efficiency',
        'B) Specificity Constant',
        'C) Dissociation Constant',
        'D) Michaelis Rate'
      ],
      correctIndex: 1,
      explanation: 'The ratio $k_{cat}/K_m$ is defined as the specificity constant, measuring how efficiently an enzyme converts substrate into product at low substrate concentrations.'
    },
    {
      id: 2,
      type: 'True False',
      question: 'Statement: Competitive inhibitors decrease the apparent maximum velocity ($V_{max}$) of an enzymatic reaction.',
      options: ['True', 'False'],
      correctIndex: 1,
      explanation: 'False. Competitive inhibitors increase apparent $K_m$ but do not change $V_{max}$ because high substrate concentrations outcompete the inhibitor.'
    },
    {
      id: 3,
      type: 'Fill Blank',
      question: 'The substrate concentration at which an enzyme operates at half of its maximum velocity is known as the ________ constant.',
      options: ['A) Michaelis-Menten ($K_m$)', 'B) Arrhenius ($A$)', 'C) Boltzmann ($k$)', 'D) Gibbs ($G$)'],
      correctIndex: 0,
      explanation: '$K_m$ represents the substrate concentration required to reach $V_{max}/2$.'
    },
    {
      id: 4,
      type: 'Assertion Reason',
      question: 'Assertion (A): Allosteric enzymes display sigmoidal $V_0$ vs $[S]$ plots.\nReason (R): Cooperativity allows binding at one subunit to alter substrate affinity at adjacent subunits.',
      options: [
        'A) Both A and R are true, and R is the correct explanation of A',
        'B) Both A and R are true, but R is NOT the correct explanation',
        'C) A is true, but R is false',
        'D) A is false, but R is true'
      ],
      correctIndex: 0,
      explanation: 'Cooperativity in multi-subunit allosteric enzymes produces sigmoidal velocity curves.'
    },
    {
      id: 5,
      type: 'Numerical',
      question: 'Calculate $V_0$ when $[S] = 2 K_m$ given $V_{max} = 150\\ \\mu\\text{mol/min}$.',
      options: [
        'A) 50 µmol/min',
        'B) 100 µmol/min',
        'C) 75 µmol/min',
        'D) 120 µmol/min'
      ],
      correctIndex: 1,
      explanation: '$V_0 = \\frac{V_{max} [S]}{K_m + [S]} = \\frac{150 \\times (2 K_m)}{K_m + 2 K_m} = \\frac{300}{3} = 100\\ \\mu\\text{mol/min}$.'
    }
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setNotificationMsg(`Generated ${questionCount} ${difficulty} level questions successfully!`);
      setTimeout(() => setNotificationMsg(''), 3000);
    }, 1200);
  };

  const handleAction = (actionName) => {
    setNotificationMsg(`Action triggered: ${actionName}`);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  const toggleType = (t) => {
    if (selectedTypes.includes(t)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter(item => item !== t));
      }
    } else {
      setSelectedTypes([...selectedTypes, t]);
    }
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
              <ListChecks className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              MCQ & Practice Test Generator <span className="text-xs text-[#10B981] font-semibold">AI Quiz Engine</span>
            </span>
          </div>
        </div>

        {/* EXPORT, PRINT & SHARE CONTROLS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleAction('Download PDF')}
            className="px-3 py-2 text-xs font-bold rounded-[12px] bg-[#10B981] hover:bg-[#0ea572] text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleAction('Download DOCX')}
            className="px-3 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>DOCX</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-500" />
            <span>Print</span>
          </button>
          <button
            onClick={() => handleAction('Share Quiz Link')}
            className="px-3 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Share</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* NOTIFICATION BANNER */}
        <AnimatePresence>
          {notificationMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center shadow-md"
            >
              {notificationMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* GENERATOR CONTROL PANEL */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Quiz & MCQ Generation Settings
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Customize difficulty, question count, and question types to generate practice tests.
              </p>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-6 py-3 rounded-[16px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-xs shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Generating Quiz...' : 'Generate Quiz Deck'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Control 1: Difficulty */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Difficulty Level
              </label>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 text-xs font-bold rounded-[12px] border transition-all ${
                      difficulty === d
                        ? 'bg-[#10B981] text-white border-[#10B981] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Question Count */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Question Count
              </label>
              <div className="flex gap-1.5 overflow-x-auto">
                {[10, 20, 30, 50, 100].map((count) => (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`flex-1 py-2 text-xs font-bold rounded-[12px] border transition-all ${
                      questionCount === count
                        ? 'bg-[#10B981] text-white border-[#10B981] shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Question Types */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Question Types
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['MCQ', 'True False', 'Fill Blank', 'Assertion Reason', 'Numerical'].map((t) => {
                  const isSelected = selectedTypes.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggleType(t)}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-[10px] border transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border-[#10B981]'
                          : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* QUESTION CARDS DISPLAY HEADER & ANSWER KEY TOGGLE */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Generated Practice Questions ({generatedQuestions.length})
            </h2>
            <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
              {difficulty} Mode
            </span>
          </div>

          <button
            onClick={() => setShowAnswerKey(!showAnswerKey)}
            className="flex items-center gap-2 px-4 py-2 rounded-[14px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors"
          >
            {showAnswerKey ? <EyeOff className="w-4 h-4 text-rose-500" /> : <Eye className="w-4 h-4 text-[#10B981]" />}
            <span>{showAnswerKey ? 'Hide Answer Key & Explanations' : 'Show Answer Key & Explanations'}</span>
          </button>
        </div>

        {/* QUESTION CARDS GRID */}
        <div className="space-y-4">
          {generatedQuestions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  Question {idx + 1} • {q.type}
                </span>
                <span className="text-xs text-slate-400 font-semibold">1 Mark</span>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-white whitespace-pre-wrap leading-relaxed">
                {q.question}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {q.options.map((opt, oIdx) => {
                  const isCorrect = oIdx === q.correctIndex;
                  return (
                    <div
                      key={oIdx}
                      className={`p-3 rounded-[14px] border text-xs font-semibold flex items-center justify-between transition-colors ${
                        showAnswerKey && isCorrect
                          ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-200 border-emerald-500 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border-slate-200/60 dark:border-slate-800'
                      }`}
                    >
                      <span>{opt}</span>
                      {showAnswerKey && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                    </div>
                  );
                })}
              </div>

              {/* Answer Key & Explanation Box */}
              {showAnswerKey && (
                <div className="p-4 rounded-[16px] bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
                  <span className="font-extrabold block">💡 Answer Explanation:</span>
                  <p className="leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </main>

    </div>
  );
}
