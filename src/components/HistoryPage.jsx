import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  FlaskConical, 
  GraduationCap, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  ArrowLeft,
  FileCheck2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { getHistoryData } from '../services/dashboardService';

export default function HistoryPage({ onBackToLanding }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      title: 'IEEE_Transformer_V3_Benchmark_Report.pdf',
      category: 'reports',
      date: 'Today, 2:15 PM',
      size: '4.8 MB',
      type: 'Research Report',
      icon: FlaskConical,
      color: 'text-[#5B4BFF]'
    },
    {
      id: 2,
      title: 'Biochemistry_Chapter4_Notes.docx',
      category: 'notes',
      date: 'Yesterday, 5:40 PM',
      size: '1.2 MB',
      type: 'Generated Notes',
      icon: FileText,
      color: 'text-[#10B981]'
    },
    {
      id: 3,
      title: 'Organic_Chemistry_Practice_Quiz_Deck.pdf',
      category: 'mcqs',
      date: 'July 28, 2026',
      size: '2.1 MB',
      type: 'MCQ Quiz',
      icon: HelpCircle,
      color: 'text-amber-500'
    }
  ]);

  useEffect(() => {
    getHistoryData()
      .then(items => {
        if (items && items.length > 0) {
          setHistoryItems(items.map(it => ({
            id: it.id,
            title: it.title,
            category: 'reports',
            date: it.date,
            size: it.size,
            type: it.type,
            icon: FlaskConical,
            color: 'text-[#5B4BFF]'
          })));
        }
      })
      .catch(e => console.warn("History API notice:", e));
  }, []);

  const filteredItems = historyItems.filter(item => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <div className="w-8 h-8 rounded-[10px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Download History & Generated Decks
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* HEADER & SEARCH BAR */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Activity & Download Log
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Search and re-download generated research reports, notes, quizzes, and summaries.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search History Logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
            />
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200/80 dark:border-slate-800">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'reports', label: 'Research Reports' },
            { id: 'notes', label: 'Generated Notes' },
            { id: 'mcqs', label: 'MCQs & Quizzes' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'summaries', label: 'Summaries' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`px-4 py-2 text-xs font-bold rounded-[14px] transition-all whitespace-nowrap ${
                activeFilter === f.id
                  ? 'bg-[#5B4BFF] text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* HISTORY ITEMS LIST */}
        <div className="space-y-3">
          {filteredItems.map(item => {
            const IconComponent = item.icon || FlaskConical;
            return (
              <div 
                key={item.id}
                className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 truncate">
                  <div className="p-3 rounded-[14px] bg-slate-100 dark:bg-slate-800 shrink-0">
                    <IconComponent className={`w-5 h-5 ${item.color || 'text-[#5B4BFF]'}`} />
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {item.type} • {item.size} • {item.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button className="px-3 py-1.5 text-xs font-bold rounded-[12px] bg-[#5B4BFF] text-white hover:bg-[#4b3be6] shadow-sm transition-colors flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Re-Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </main>

    </div>
  );
}
