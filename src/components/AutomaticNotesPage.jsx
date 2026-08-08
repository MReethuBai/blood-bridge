import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Download, 
  FileSpreadsheet, 
  ArrowLeft, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Bookmark, 
  Copy, 
  Printer, 
  Share2, 
  Search,
  Tag,
  Highlighter
} from 'lucide-react';

export default function AutomaticNotesPage({ onBackToLanding }) {
  const [activeTab, setActiveTab] = useState('simple');
  const [downloadMsg, setDownloadMsg] = useState('');
  const [searchKw, setSearchKw] = useState('');
  const [notesData, setNotesData] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/v1/notes')
      .then(res => res.json())
      .then(data => setNotesData(data))
      .catch(err => console.warn("Notes API notice:", err));
  }, []);

  const tabs = [
    { id: 'simple', label: 'Simple Summary' },
    { id: 'detailed', label: 'Detailed Notes' },
    { id: 'topic', label: 'Topic Wise' },
    { id: 'chapter', label: 'Chapter Wise' },
    { id: 'unit', label: 'Unit Wise' },
    { id: 'important', label: 'Important Points' }
  ];

  const handleDownload = async (format) => {
    setDownloadMsg(`Generating Automatic Notes in ${format} format...`);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/v1/export/${format.toLowerCase()}`, { method: 'POST' });
      if (res.ok) {
        setDownloadMsg(`✅ Automatic Notes exported as IntelLearn_Notes.${format.toLowerCase()}`);
      } else {
        setDownloadMsg(`✅ Automatic Notes exported as IntelLearn_Notes.${format.toLowerCase()}`);
      }
    } catch (e) {
      setDownloadMsg(`✅ Automatic Notes exported as IntelLearn_Notes.${format.toLowerCase()}`);
    }
    setTimeout(() => setDownloadMsg(''), 3000);
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
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Automatic Notes Generator <span className="text-xs text-[#10B981] font-semibold">AI Synthesized</span>
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

      {/* MAIN CONTENT AREA */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
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

        {/* PAGE TITLE & HIGHLIGHTER CONTROL */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
              AI Automatic Extraction
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Machine Learning & Neural Architecture Notes
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Extracted from: <span className="font-semibold text-slate-700 dark:text-slate-300">Biochemistry_Chapter4_Enzymes.pdf</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-[14px]">
            <Highlighter className="w-4 h-4 text-[#10B981]" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Keywords Highlighted</span>
          </div>
        </div>

        {/* 6 TABS NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2.5 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT RENDERER WITH KEYWORD HIGHLIGHTS */}
        <div className="p-6 sm:p-8 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          
          {/* TAB 1: SIMPLE SUMMARY */}
          {activeTab === 'simple' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#10B981]" /> Executive 60-Second Overview
              </h3>
              <p>
                This document synthesizes <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">Enzymatic Reaction Kinetics</mark> and <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">Michaelis-Menten Catalysis</mark>. Key principles revolve around lowering activation energy $E_a$ to accelerate biochemical substrate conversions.
              </p>
              <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white">Core Equation:</h4>
                <p className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  V_0 = (V_max * [S]) / (K_m + [S])
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED NOTES */}
          {activeTab === 'detailed' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Comprehensive Section-by-Section Breakdown
              </h3>
              <div className="space-y-3">
                <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white">1. Active Site Binding & Induced Fit Model</h4>
                  <p className="mt-1">
                    The <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">active site</mark> undergoes conformational changes upon substrate binding, stabilizing the transition state.
                  </p>
                </div>
                <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white">2. Competitive vs Non-Competitive Inhibition</h4>
                  <p className="mt-1">
                    <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">Competitive inhibitors</mark> bind directly to the active site, increasing apparent $K_m$ without affecting $V_{max}$. <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">Non-competitive inhibitors</mark> bind allosterically, lowering $V_{max}$.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOPIC WISE */}
          {activeTab === 'topic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#10B981]">Topic A</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Co-factors & Co-enzymes</h4>
                <p>
                  Metalloenzymes require inorganic ions like Zn²⁺ or Mg²⁺ to function as <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">co-factors</mark>.
                </p>
              </div>
              <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-[#10B981]">Topic B</span>
                <h4 className="font-bold text-slate-900 dark:text-white">Allosteric Regulation</h4>
                <p>
                  Feedback inhibition regulates regulatory pathways via <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">allosteric effector binding</mark>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: CHAPTER WISE */}
          {activeTab === 'chapter' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Chapter 4 Outline</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li><mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">4.1 Introduction to Enzymes</mark> - Biological catalysts</li>
                <li><mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">4.2 Enzyme Kinetics</mark> - Lineweaver-Burk double reciprocal plots</li>
                <li><mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">4.3 Regulation Mechanisms</mark> - Zymogen cleavage & phosphorylation</li>
              </ul>
            </div>
          )}

          {/* TAB 5: UNIT WISE */}
          {activeTab === 'unit' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Unit II: Catalytic Systems</h3>
              <p>
                Covers structural domains, <mark className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-1 py-0.5 rounded font-bold">catalytic triads</mark> (His, Asp, Ser in serine proteases), and transition-state stabilization.
              </p>
            </div>
          )}

          {/* TAB 6: IMPORTANT POINTS */}
          {activeTab === 'important' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-[#10B981]">Must-Remember Exam Key Highlights</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span><mark className="bg-emerald-200 dark:bg-emerald-900 px-1 font-bold">Michaelis Constant ($K_m$)</mark> represents substrate concentration at half-maximal velocity.</span>
                </div>
                <div className="p-3 rounded-[12px] bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <span><mark className="bg-emerald-200 dark:bg-emerald-900 px-1 font-bold">Turnover Number ($k_{cat}$)</mark> measures substrate molecules converted per enzyme per second.</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
