import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { 
  Palette, 
  Type, 
  Grid, 
  Square, 
  MousePointer, 
  Sparkles, 
  BarChart2, 
  CheckCircle2, 
  ArrowLeft, 
  Layers, 
  Cpu, 
  Database, 
  Bot, 
  FileText, 
  Loader2, 
  Zap, 
  Sun, 
  Moon, 
  Eye, 
  ShieldCheck,
  Command
} from 'lucide-react';

export default function DesignSystemShowcase({ onBackToLanding }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('desktop');

  // AI Processing Steps
  const aiSteps = [
    { title: 'Reading Document', desc: 'Parsing PDF byte structure and page layout...', icon: FileText },
    { title: 'Extracting Text', desc: 'Running OCR text & formula extractions...', icon: Layers },
    { title: 'Generating Embeddings', desc: 'Generating 1536-dim vector embeddings...', icon: Database },
    { title: 'Analyzing', desc: 'Synthesizing IEEE DOIs and cross-referencing citations...', icon: Cpu },
    { title: 'Generating Response', desc: 'Formulating structured markdown & LaTeX answers...', icon: Sparkles },
    { title: 'Done', desc: 'AI processing complete with 98.4% confidence score!', icon: CheckCircle2 }
  ];

  // Start AI Pipeline demo
  const triggerAiPipeline = () => {
    setIsProcessing(true);
    setActiveStep(0);

    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= aiSteps.length - 1) {
          clearInterval(interval);
          setIsProcessing(false);
          return aiSteps.length - 1;
        }
        return prev + 1;
      });
    }, 900);
  };

  // Recharts Mock Data
  const chartData = [
    { name: 'Vaswani 2017', latency: 28.5, accuracy: 84.2 },
    { name: 'Mamba 2024', latency: 18.1, accuracy: 91.5 },
    { name: 'IEEE Linear V3', latency: 14.2, accuracy: 98.4 }
  ];

  const pieData = [
    { name: 'IEEE Papers', value: 57, color: '#5B4BFF' },
    { name: 'arXiv Papers', value: 26, color: '#10B981' },
    { name: 'ACM Digital', value: 17, color: '#F59E0B' }
  ];

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
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#5B4BFF] to-[#10B981] flex items-center justify-center text-white shadow-md">
              <Palette className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              IntelLearn AI Design System <span className="text-xs text-[#5B4BFF] font-semibold">Pixel-Perfect Spec</span>
            </span>
          </div>
        </div>

        {/* Device Responsive Controls */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-[14px]">
          {['desktop', 'tablet', 'mobile'].map(dev => (
            <button
              key={dev}
              onClick={() => setSelectedDevice(dev)}
              className={`px-3 py-1 text-xs font-bold capitalize rounded-[10px] transition-all ${selectedDevice === dev ? 'bg-[#5B4BFF] text-white shadow-sm' : 'text-slate-500'}`}
            >
              {dev}
            </button>
          ))}
        </div>
      </header>

      {/* MAIN DESIGN SYSTEM CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 flex-1 w-full">
        
        {/* HERO TITLE */}
        <div className="p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
          <span className="px-3 py-1 text-[10px] font-black uppercase rounded-full bg-indigo-50 text-[#5B4BFF] dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200">
            NotebookLM + SciSpace + Perplexity UI Architecture
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            IntelLearn AI Component Library & Design Tokens
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
            Built with 8px baseline grid layout, 20px rounded corners, glassmorphism, Recharts visualization, 300ms Framer Motion transitions, and full ARIA keyboard accessibility.
          </p>
        </div>

        {/* 1. TYPOGRAPHY & SPACING SCALE */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Type className="w-5 h-5 text-[#5B4BFF]" /> 1. Typography & 8px Spacing Grid
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Typography Hierarchy */}
            <div className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Inter / Plus Jakarta Sans Hierarchy</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">H1 • 36px / Black (900)</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">Welcome Back, Researcher</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">H2 • 24px / Bold (700)</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">IEEE Research Workspace</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">Body • 14px / Medium (500)</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Synthesizing equations, pseudocode, and benchmark graphs.</span>
                </div>
              </div>
            </div>

            {/* 8px Spacing Grid */}
            <div className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">8px Baseline Spacing Scale</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950 rounded-[10px] border border-indigo-200 text-xs font-bold text-[#5B4BFF]">8px (1rem)</div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-950 rounded-[12px] border border-indigo-200 text-xs font-bold text-[#5B4BFF]">16px (2rem)</div>
                <div className="p-6 bg-indigo-50 dark:bg-indigo-950 rounded-[16px] border border-indigo-200 text-xs font-bold text-[#5B4BFF]">24px (3rem)</div>
                <div className="p-8 bg-indigo-50 dark:bg-indigo-950 rounded-[20px] border border-indigo-200 text-xs font-bold text-[#5B4BFF]">32px (4rem)</div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BUTTON MATRIX & CARDS HOVER LIFT */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-[#10B981]" /> 2. Button Matrix & 20px Glassmorphic Cards
          </h2>

          {/* Button Variants */}
          <div className="p-6 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Button Variant Matrix</h3>
            <div className="flex flex-wrap items-center gap-4">
              {/* Primary Button */}
              <button className="px-5 py-2.5 rounded-[16px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white font-bold text-xs shadow-lg shadow-indigo-500/25 hover:scale-105 transition-all">
                Primary Button
              </button>

              {/* Secondary Button */}
              <button className="px-5 py-2.5 rounded-[16px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors">
                Secondary Button
              </button>

              {/* Ghost Button */}
              <button className="px-5 py-2.5 rounded-[16px] hover:bg-indigo-50 dark:hover:bg-indigo-950/50 text-[#5B4BFF] dark:text-indigo-300 font-bold text-xs transition-colors">
                Ghost Button
              </button>

              {/* Outline Button */}
              <button className="px-5 py-2.5 rounded-[16px] border border-[#5B4BFF] text-[#5B4BFF] hover:bg-[#5B4BFF] hover:text-white font-bold text-xs transition-all">
                Outline Button
              </button>
            </div>
          </div>

          {/* Cards with Hover Lift */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -8 }} 
              transition={{ duration: 0.3 }}
              className="p-6 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-indigo-200/60 dark:border-indigo-900/60 shadow-xl space-y-3 cursor-pointer"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-[#5B4BFF] dark:bg-indigo-950">20px Rounded • Glassmorphism</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Research Card with Hover Lift</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Elevates smoothly on hover with ambient indigo glow shadow.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -8 }} 
              transition={{ duration: 0.3 }}
              className="p-6 rounded-[20px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-emerald-200/60 dark:border-emerald-900/60 shadow-xl space-y-3 cursor-pointer"
            >
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#10B981] dark:bg-emerald-950">20px Rounded • Study Mode</span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Study Card with Hover Lift</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Elevates smoothly on hover with emerald glow shadow.</p>
            </motion.div>
          </div>
        </section>

        {/* 3. ANIMATED AI PROCESSING PIPELINE (6 STEPS) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#5B4BFF]" /> 3. Animated AI Processing Pipeline (6 Steps)
            </h2>

            <button
              onClick={triggerAiPipeline}
              disabled={isProcessing}
              className="px-4 py-2 rounded-[14px] bg-[#5B4BFF] text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              <span>{isProcessing ? 'Processing AI Pipeline...' : 'Run Pipeline Demo'}</span>
            </button>
          </div>

          <div className="p-8 rounded-[24px] bg-slate-900 text-white border border-slate-800 space-y-6 shadow-2xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {aiSteps.map((step, idx) => {
                const IconComp = step.icon;
                const isCurrent = activeStep === idx;
                const isCompleted = activeStep > idx;

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-[18px] border transition-all space-y-2 text-center ${
                      isCurrent
                        ? 'bg-[#5B4BFF] border-indigo-400 text-white shadow-lg shadow-indigo-500/40 scale-105'
                        : isCompleted
                        ? 'bg-slate-800/80 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800/40 border-slate-800 text-slate-500'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-950/60 flex items-center justify-center mx-auto">
                      {isCurrent ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <IconComp className="w-4 h-4" />}
                    </div>
                    <span className="text-[11px] font-bold block truncate">{step.title}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-[16px] bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Current Step: <strong className="text-white">{aiSteps[activeStep].title}</strong></span>
              <span className="text-[#5B4BFF] font-mono">{aiSteps[activeStep].desc}</span>
            </div>
          </div>
        </section>

        {/* 4. CHARTS USING RECHARTS */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#5B4BFF]" /> 4. Recharts Data Visualizations
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recharts Area / Bar Chart */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Accuracy vs Latency (Recharts)</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="accuracy" fill="#5B4BFF" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recharts Pie Chart */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">Citations Source Breakdown (Recharts)</h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

      </main>

    </div>
  );
}
