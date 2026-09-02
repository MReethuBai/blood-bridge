import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Cpu, BookOpen, Layers, ArrowRight, Zap, ShieldCheck } from 'lucide-react';

export default function Hero({ activeMode, setActiveMode, onOpenResearch, onOpenStudy }) {
  return (
    <section className="relative pt-12 pb-10 md:pt-16 md:pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      
      {/* Background Decorative Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-96 h-96 bg-[#5B4BFF]/15 dark:bg-[#5B4BFF]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-10 right-1/4 translate-x-1/2 w-96 h-96 bg-[#10B981]/15 dark:bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="text-center max-w-3xl mx-auto space-y-6">
        
        {/* Top Floating Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-emerald-500/20 border border-indigo-200/50 dark:border-indigo-800/50 backdrop-blur-md shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-[#5B4BFF]" />
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            Powered by Next-Gen Multi-Agent Reasoning Engine
          </span>
          <span className="flex h-2 w-2 rounded-full bg-[#10B981] animate-ping" />
        </motion.div>

        {/* Large Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]"
        >
          Welcome Back,{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#5B4BFF] via-[#7B6DFF] to-[#10B981]">
            Researcher
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto"
        >
          Choose a specialized workspace to begin your AI-powered learning journey.
        </motion.p>

        {/* Live Workspace Capability Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
        >
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <Brain className="w-3.5 h-3.5 text-[#5B4BFF]" />
            <span>NotebookLM Synthesis</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
            <span>IEEE Verified Citations</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] bg-slate-100 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant MCQ & Flashcards</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
