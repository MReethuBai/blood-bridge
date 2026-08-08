import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  FileText, 
  FlaskConical, 
  GraduationCap, 
  UploadCloud, 
  ArrowRight, 
  MoreVertical, 
  FileCheck2, 
  Sparkles, 
  Play, 
  ChevronRight, 
  Download, 
  ExternalLink,
  BookOpen,
  BarChart2,
  CheckCircle,
  FileCode,
  ShieldCheck,
  Brain,
  Mic
} from 'lucide-react';

export default function RecentActivity({ onOpenItem }) {
  const [activeTab, setActiveTab] = useState('all');

  const uploadedFiles = [
    {
      id: 'file-1',
      title: 'Transformer_Architecture_Deep_Dive.pdf',
      type: 'PDF Document',
      size: '4.2 MB',
      updated: '12 mins ago',
      category: 'file',
      mode: 'research',
      badge: 'IEEE Indexed',
      score: '98/100',
      actionText: 'Analyze Methodology'
    },
    {
      id: 'file-2',
      title: 'Quantum_Computing_Algorithms_2026.pdf',
      type: 'PDF Document',
      size: '8.7 MB',
      updated: '1 hour ago',
      category: 'file',
      mode: 'research',
      badge: 'SciSpace Ready',
      score: '95/100',
      actionText: 'Run Synthesis'
    },
    {
      id: 'file-3',
      title: 'Neural_Cognitive_Study_Ch4.docx',
      type: 'Word Document',
      size: '1.4 MB',
      updated: '3 hours ago',
      category: 'file',
      mode: 'study',
      badge: 'Notes Ready',
      score: '15 MCQs',
      actionText: 'Generate Quiz'
    }
  ];

  const researchPapers = [
    {
      id: 'paper-1',
      title: 'Attention Is All You Need - IEEE Benchmark Analysis',
      journal: 'IEEE Transactions on Pattern Analysis',
      updated: 'Yesterday',
      category: 'research',
      mode: 'research',
      citations: '42,100+',
      score: '99/100',
      actionText: 'Open Matrix'
    },
    {
      id: 'paper-2',
      title: 'Generative AI in Higher Education: A Literature Review',
      journal: 'Journal of Higher Ed AI',
      updated: '2 days ago',
      category: 'research',
      mode: 'research',
      citations: '1,240',
      score: '94/100',
      actionText: 'View Literature Tree'
    }
  ];

  const studyNotes = [
    {
      id: 'note-1',
      title: 'Machine Learning Fundamentals - Smart Summary & MCQs',
      deckSize: '24 Flashcards',
      mastery: '88% Mastered',
      updated: '4 hours ago',
      category: 'study',
      mode: 'study',
      audio: true,
      actionText: 'Start Quiz Mode'
    },
    {
      id: 'note-2',
      title: 'Biochemistry Chapter 4: Enzymatic Reactions Deck',
      deckSize: '40 Flashcards',
      mastery: '92% Mastered',
      updated: '3 days ago',
      category: 'study',
      mode: 'study',
      audio: true,
      actionText: 'Flip Flashcards'
    }
  ];

  const allItems = [
    ...uploadedFiles,
    ...researchPapers,
    ...studyNotes
  ];

  const filteredItems = activeTab === 'all' 
    ? allItems 
    : activeTab === 'files' 
    ? uploadedFiles 
    : activeTab === 'papers' 
    ? researchPapers 
    : studyNotes;

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* SECTION HEADER & CONTINUE PREVIOUS SESSION BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#5B4BFF]" />
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Recent Activity
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pick up right where you left off across all your research & study workspaces.
          </p>
        </div>

        {/* Continue Previous Session Quick Action Banner */}
        <div 
          onClick={() => onOpenItem(allItems[0])}
          className="flex items-center justify-between gap-4 p-3.5 px-5 bg-gradient-to-r from-[#5B4BFF]/10 via-purple-500/10 to-[#10B981]/10 dark:from-[#5B4BFF]/20 dark:to-[#10B981]/20 rounded-[18px] border border-[#5B4BFF]/20 cursor-pointer hover:scale-[1.01] transition-transform duration-200 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#5B4BFF] text-white flex items-center justify-center shadow-md shadow-indigo-500/30">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5B4BFF] dark:text-indigo-300 block">
                Continue Previous Session
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs block">
                {allItems[0].title}
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* ACTIVITY CATEGORY TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-200/80 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          All Activity ({allItems.length})
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
            activeTab === 'files'
              ? 'bg-[#5B4BFF] text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <UploadCloud className="w-3.5 h-3.5" />
          Recently Uploaded Files ({uploadedFiles.length})
        </button>

        <button
          onClick={() => setActiveTab('papers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
            activeTab === 'papers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          Recent Research Papers ({researchPapers.length})
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          Recent Study Notes ({studyNotes.length})
        </button>
      </div>

      {/* ITEMS GRID */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const isResearch = item.mode === 'research';
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group relative bg-white dark:bg-slate-900/90 rounded-[20px] p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Item Header / Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      {isResearch ? (
                        <span className="p-2 rounded-[12px] bg-indigo-50 dark:bg-indigo-950 text-[#5B4BFF] border border-indigo-100 dark:border-indigo-900">
                          <FlaskConical className="w-4 h-4" />
                        </span>
                      ) : (
                        <span className="p-2 rounded-[12px] bg-emerald-50 dark:bg-emerald-950 text-[#10B981] border border-emerald-100 dark:border-emerald-900">
                          <GraduationCap className="w-4 h-4" />
                        </span>
                      )}
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        isResearch 
                          ? 'bg-indigo-50 text-[#5B4BFF] dark:bg-indigo-950 dark:text-indigo-300' 
                          : 'bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300'
                      }`}>
                        {item.category.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.updated}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#5B4BFF] dark:group-hover:text-indigo-300 transition-colors">
                    {item.title}
                  </h4>

                  {/* Item Extra Info */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 mb-4">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.citations && <span>Citations: {item.citations}</span>}
                    {item.deckSize && <span>{item.deckSize}</span>}
                    {item.mastery && (
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.mastery}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  {item.score && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#5B4BFF]" />
                      {item.score}
                    </span>
                  )}
                  
                  <button
                    onClick={() => onOpenItem(item)}
                    className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-bold transition-all ${
                      isResearch 
                        ? 'bg-indigo-50 text-[#5B4BFF] hover:bg-[#5B4BFF] hover:text-white dark:bg-indigo-950 dark:text-indigo-300 dark:hover:bg-[#5B4BFF] dark:hover:text-white' 
                        : 'bg-emerald-50 text-[#10B981] hover:bg-[#10B981] hover:text-white dark:bg-emerald-950 dark:text-emerald-300 dark:hover:bg-[#10B981] dark:hover:text-white'
                    }`}
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

    </section>
  );
}
