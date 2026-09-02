import React from 'react';
import { motion } from 'framer-motion';
import { 
  FlaskConical, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileSearch, 
  BarChart3, 
  Layers, 
  BookOpen, 
  Mic, 
  HelpCircle, 
  BrainCircuit, 
  FileText,
  FileCheck2,
  ListChecks,
  Table,
  Library
} from 'lucide-react';

export default function FeatureCards({ onOpenResearch, onOpenStudy }) {
  
  const researchFeatures = [
    { name: 'AI Research Assistant', desc: 'Autonomous literature breakdown & query engine', icon: BrainCircuit },
    { name: 'IEEE Analysis', desc: 'Deep paper structure verification & standard indexing', icon: FileCheck2 },
    { name: 'Research Score', desc: 'Quantitative novelty & rigor benchmark rating', icon: BarChart3 },
    { name: 'Methodology Extraction', desc: 'Automated pipeline & experimental setup parsing', icon: Layers },
    { name: 'Comparison Matrix', desc: 'Side-by-side benchmark & algorithm comparison table', icon: Table },
    { name: 'Literature Review', desc: 'Multi-paper synthesis with automated reference tree', icon: Library }
  ];

  const studyFeatures = [
    { name: 'Automatic Notes', desc: 'Instant key insight summaries & structured outlines', icon: FileText },
    { name: 'MCQ Generator', desc: 'Smart multiple-choice quizzes tailored to comprehension', icon: ListChecks },
    { name: 'Flashcards', desc: 'Spaced repetition 3D flip card decks', icon: BookOpen },
    { name: 'Quiz Mode', desc: 'Interactive timed exam simulation & score feedback', icon: HelpCircle },
    { name: 'Short Summary', desc: 'Exec-level 60-second key takeaways', icon: Sparkles },
    { name: 'Voice Learning', desc: 'NotebookLM-style interactive audio podcast summaries', icon: Mic }
  ];

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
        
        {/* RESEARCH MODE CARD (PURPLE THEME) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4 }}
          className="relative group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-indigo-100 dark:border-indigo-950/60 rounded-[20px] p-6 sm:p-8 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#5B4BFF]/15 dark:bg-[#5B4BFF]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#5B4BFF] to-transparent opacity-80" />

          <div>
            {/* Header / Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[18px] bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-center text-[#5B4BFF] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <FlaskConical className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Research Mode
                    </h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#5B4BFF]/10 text-[#5B4BFF] dark:bg-[#5B4BFF]/25 dark:text-indigo-300 border border-[#5B4BFF]/20">
                      Scholar AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Designed for paper analysis, IEEE synthesis & literature matrices
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              {researchFeatures.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-[14px] bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 hover:border-indigo-200/60 dark:hover:border-indigo-800/50 transition-all duration-200 group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-[#5B4BFF]/10 text-[#5B4BFF] dark:bg-[#5B4BFF]/20 dark:text-indigo-300 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover/item:text-[#5B4BFF] dark:group-hover/item:text-indigo-300 transition-colors">
                        {feat.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={onOpenResearch}
              className="w-full py-4 px-6 rounded-[16px] bg-[#5B4BFF] hover:bg-[#4a3ae6] text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
            >
              <FlaskConical className="w-4 h-4" />
              <span>Open Research Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* STUDY MODE CARD (GREEN THEME) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative group bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-100 dark:border-emerald-950/60 rounded-[20px] p-6 sm:p-8 shadow-xl shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-300 flex flex-col justify-between overflow-hidden"
        >
          {/* Subtle Ambient Background Gradient Glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#10B981]/15 dark:bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#10B981] to-transparent opacity-80" />

          <div>
            {/* Header / Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[18px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-[#10B981] shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Study Mode
                    </h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/25 dark:text-emerald-300 border border-[#10B981]/20">
                      Mastery AI
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Tailored for automated notes, flashcards, MCQs & audio learning
                  </p>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              {studyFeatures.map((feat, idx) => {
                return (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-[14px] bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-200/60 dark:hover:border-emerald-800/50 transition-all duration-200 group/item"
                  >
                    <div className="p-1.5 rounded-lg bg-[#10B981]/10 text-[#10B981] dark:bg-[#10B981]/20 dark:text-emerald-300 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block group-hover/item:text-[#10B981] dark:group-hover/item:text-emerald-300 transition-colors">
                        {feat.name}
                      </span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5 leading-snug">
                        {feat.desc}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large Action Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <button
              onClick={onOpenStudy}
              className="w-full py-4 px-6 rounded-[16px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group/btn"
            >
              <GraduationCap className="w-4 h-4" />
              <span>Open Study Workspace</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
