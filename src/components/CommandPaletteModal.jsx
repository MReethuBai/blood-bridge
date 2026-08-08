import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  FlaskConical, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Table, 
  HelpCircle, 
  Mic, 
  ArrowRight,
  Command,
  BookOpen
} from 'lucide-react';

export default function CommandPaletteModal({ isOpen, onClose, initialQuery = '', onSelectAction }) {
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Run IEEE Paper Analysis',
      desc: 'Verify citations & extract methodology structure',
      category: 'Research Mode',
      icon: FlaskConical,
      color: 'text-[#5B4BFF]'
    },
    {
      title: 'Generate MCQ Quiz Deck',
      desc: 'Create 15 interactive practice questions',
      category: 'Study Mode',
      icon: GraduationCap,
      color: 'text-[#10B981]'
    },
    {
      title: 'Build Algorithm Comparison Matrix',
      desc: 'Benchmark Paper A vs Paper B side-by-side',
      category: 'Research Mode',
      icon: Table,
      color: 'text-[#5B4BFF]'
    },
    {
      title: 'Generate NotebookLM Voice Podcast',
      desc: 'Synthesize 2-host audio overview of uploaded notes',
      category: 'Study Mode',
      icon: Mic,
      color: 'text-[#10B981]'
    }
  ];

  const filteredActions = query.trim()
    ? actions.filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()))
    : actions;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/70 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-[24px] shadow-2xl overflow-hidden p-4"
        >
          {/* Search Header */}
          <div className="relative flex items-center px-3 py-2 bg-slate-800/80 rounded-[16px] border border-slate-700">
            <Search className="w-4 h-4 text-slate-400 mr-3" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI capabilities, research papers, or study decks..."
              className="w-full bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none"
            />
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Action Items List */}
          <div className="mt-3 space-y-1.5 max-h-80 overflow-y-auto">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Quick AI Actions
            </div>
            {filteredActions.map((act, idx) => {
              const IconComp = act.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectAction(act);
                    onClose();
                  }}
                  className="flex items-center justify-between p-3 rounded-[14px] hover:bg-slate-800/80 cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-[10px] bg-slate-800 ${act.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white group-hover:text-[#5B4BFF] transition-colors">
                        {act.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block">{act.desc}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {act.category}
                  </span>
                </div>
              );
            })}
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
