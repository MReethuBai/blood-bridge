import React from 'react';
import { Sparkles, Heart, Shield, Terminal, ArrowUpRight, Code2, Globe, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-[10px] bg-gradient-to-tr from-[#5B4BFF] to-[#10B981] p-[1.5px]">
                <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                IntelLearn AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              The premier AI SaaS platform synthesizing IEEE research papers, methodology matrices, automated notes, MCQ decks & voice learning. Inspired by NotebookLM, Perplexity & SciSpace.
            </p>
            <div className="flex items-center gap-2 pt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All AI Models Operational (GPT-4o, Claude 3.5, Llama 3)</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Platform
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#research" className="hover:text-[#5B4BFF] transition-colors">Research Mode</a></li>
              <li><a href="#study" className="hover:text-[#10B981] transition-colors">Study Mode</a></li>
              <li><a href="#ieee" className="hover:text-slate-900 dark:hover:text-white transition-colors">IEEE Analysis</a></li>
              <li><a href="#voice" className="hover:text-slate-900 dark:hover:text-white transition-colors">Voice Learning</a></li>
            </ul>
          </div>

          {/* Required Footer Links */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Company
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li><a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</a></li>
              <li><a href="#privacy" className="hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#terms" className="hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a></li>
              <li><a href="#support" className="hover:text-slate-900 dark:hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          {/* Connect Links */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Connect
            </h5>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li><a href="#contact" className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"><MessageSquare className="w-3.5 h-3.5" /> Contact</a></li>
              <li><a href="#twitter" className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /> Twitter / X</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 IntelLearn AI Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered for scholars and lifelong learners.
          </p>
        </div>
      </div>
    </footer>
  );
}
