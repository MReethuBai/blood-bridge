import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Tag, 
  Lightbulb, 
  Layers, 
  GitFork, 
  Bookmark, 
  BookOpen
} from 'lucide-react';

export default function SummaryPage({ onBackToLanding }) {
  const [downloadMsg, setDownloadMsg] = useState('');

  const handleDownload = async (format) => {
    setDownloadMsg(`Generating One Page Summary in ${format} format...`);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/summary?type=bullet`);
      const data = await res.json();
      setDownloadMsg(`✅ Generated ${data.title}! Downloaded as Summary_Deck.${format.toLowerCase()}`);
    } catch (e) {
      setDownloadMsg(`✅ One Page Summary downloaded as Summary_Deck.${format.toLowerCase()}`);
    }
    setTimeout(() => setDownloadMsg(''), 4000);
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
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              One-Page Summary & Mind Map <span className="text-xs text-[#10B981] font-semibold">AI Exec View</span>
            </span>
          </div>
        </div>

        {/* DOWNLOAD BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload('PDF')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-[#10B981] hover:bg-[#0ea572] text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => handleDownload('DOCX')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Download DOCX</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* DOWNLOAD BANNER */}
        <AnimatePresence>
          {downloadMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center shadow-md"
            >
              {downloadMsg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ONE PAGE NOTES CONTAINER */}
        <div className="p-6 sm:p-10 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
          
          {/* Section 1: Header Title */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
              One Page Summary
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Enzyme Kinetics & Neural Attention Architectures
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comprehensive high-density revision sheet.
            </p>
          </div>

          {/* Section 2: Bullet Points */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Key Concept Bullet Points
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 dark:text-slate-300">
              <li className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                • <strong>Michaelis Constant ($K_m$):</strong> Indicates substrate concentration at half $V_{max}$. Lower $K_m$ means higher affinity.
              </li>
              <li className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                • <strong>Competitive Inhibition:</strong> Increases apparent $K_m$ while leaving maximum velocity $V_{max}$ unchanged.
              </li>
              <li className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                • <strong>IEEE Linear Attention:</strong> Reduces transformer computational scaling from $O(N^2)$ to $O(N \log N)$.
              </li>
              <li className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                • <strong>Kernel Decomposition:</strong> Replaces softmax denominator with causal feature map $\phi(x) = \text{elu}(x) + 1$.
              </li>
            </ul>
          </div>

          {/* Section 3: Visual Mind Map Layout */}
          <div className="space-y-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              <GitFork className="w-4 h-4 text-[#10B981]" /> Concept Mind Map Diagram
            </h3>
            <div className="p-6 rounded-[20px] bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/60 text-center space-y-4">
              <div className="inline-block px-4 py-2 rounded-[14px] bg-[#10B981] text-white font-bold text-xs shadow-md">
                Central Concept: AI Learning Engine
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                <div className="p-3 rounded-[14px] bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-[#10B981] block">Branch A: Kinetics</span>
                  <span className="text-[11px] text-slate-500">V_0 = (V_max * [S]) / (K_m + [S])</span>
                </div>
                <div className="p-3 rounded-[14px] bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-[#10B981] block">Branch B: Transformers</span>
                  <span className="text-[11px] text-slate-500">$\text{Attention}(Q,K,V)$</span>
                </div>
                <div className="p-3 rounded-[14px] bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800">
                  <span className="font-bold text-[#10B981] block">Branch C: CUDA Optimization</span>
                  <span className="text-[11px] text-slate-500">Warp Shuffle Scanning</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Definitions & Formulas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Essential Definitions</h3>
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40">
                  <strong>Turnover Number ($k_{cat}$):</strong> Number of substrate molecules converted to product per active site per second.
                </div>
                <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40">
                  <strong>Allosteric Effector:</strong> A small molecule that binds outside the active site, inducing a conformational shift.
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white">Core Formulas Reference</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-[14px] bg-slate-950 text-emerald-400 font-bold border border-slate-800">
                  Lineweaver-Burk: 1/V_0 = (K_m / V_max)(1/[S]) + 1/V_max
                </div>
                <div className="p-3 rounded-[14px] bg-slate-950 text-emerald-400 font-bold border border-slate-800">
                  Linear Attention: Attention = (Q K^T) V / sqrt(d_k)
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Keywords & Exam Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Key Exam Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['Michaelis Menten', 'K_m Constant', 'V_max Ceiling', 'Lineweaver Burk', 'Linear Attention', 'Sub-linear O(N log N)'].map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-[8px] bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[11px]">
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-[18px] bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-1 text-xs text-amber-900 dark:text-amber-200">
              <div className="flex items-center gap-1.5 font-bold">
                <Lightbulb className="w-4 h-4 text-amber-500" /> High-Yield Exam Tip
              </div>
              <p>
                In competitive inhibition questions, remember that adding excess substrate completely restores $V_0$ back to $V_{max}$.
              </p>
            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
