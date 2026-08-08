import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  ListChecks, 
  BookOpen, 
  Sparkles, 
  HelpCircle, 
  Mic, 
  Calendar, 
  Download, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Plus, 
  Award, 
  Target, 
  CheckCircle2, 
  FileImage, 
  Scan, 
  Play, 
  ArrowRight, 
  ArrowLeft, 
  Bot, 
  Send, 
  Lightbulb, 
  Flame, 
  Share2, 
  RotateCw,
  Zap,
  Volume2
} from 'lucide-react';

export default function StudyDashboard({ onBackToLanding }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Right Panel AI Tutor Chat state
  const [aiMessageInput, setAiMessageInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hello Dr. Vance! I have indexed your notes "Biochemistry_Chapter4_Enzymes.pdf". Ready to generate flashcards or start quiz mode?',
      time: '10:50 AM'
    }
  ]);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  const handleSendAiMessage = () => {
    if (!aiMessageInput.trim()) return;
    const userMsg = { sender: 'user', text: aiMessageInput, time: 'Just now' };
    setAiChatHistory(prev => [...prev, userMsg]);
    setAiMessageInput('');

    setTimeout(() => {
      setAiChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Generated 5 practice MCQs for "${aiMessageInput}": 1. What is the Michaelis-Menten constant ($K_m$)? (A) Substrate concentration at $V_{max}/2$. Great job reviewing!`,
          time: 'Just now'
        }
      ]);
    }, 900);
  };

  // Left sidebar menu definition (Green Study Theme)
  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Notes', icon: UploadCloud },
    { id: 'notes', label: 'Automatic Notes', icon: FileText },
    { id: 'mcq', label: 'MCQ Generator', icon: ListChecks },
    { id: 'flashcards', label: 'Flashcards', icon: BookOpen },
    { id: 'summary', label: 'Summary', icon: Sparkles },
    { id: 'quiz', label: 'Quiz Mode', icon: HelpCircle },
    { id: 'voice', label: 'Voice Learning', icon: Mic },
    { id: 'planner', label: 'Revision Planner', icon: Calendar },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Quick Action Cards Grid
  const quickActions = [
    { id: 'notes', title: 'Generate Notes', desc: 'Auto-outline key concepts & bullet summaries', icon: FileText, color: 'text-[#10B981]' },
    { id: 'mcq', title: 'Generate MCQs', desc: 'Create 15 practice multiple choice questions', icon: ListChecks, color: 'text-[#10B981]' },
    { id: 'flashcards', title: 'Flashcards', desc: '3D flip cards with spaced repetition memory', icon: BookOpen, color: 'text-[#10B981]' },
    { id: 'summary', title: 'Summary', desc: 'Exec 60-second takeaways & formulas', icon: Sparkles, color: 'text-[#10B981]' },
    { id: 'quiz', title: 'Quiz Mode', desc: 'Timed simulated exam with instant score feedback', icon: HelpCircle, color: 'text-[#10B981]' }
  ];

  // Recent Study Decks & Notes
  const recentNotes = [
    {
      id: 1,
      title: 'Biochemistry_Chapter4_Enzymes.pdf',
      type: 'PDF Document',
      flashcardsCount: '32 Cards',
      mastery: 92,
      updated: '2 hours ago'
    },
    {
      id: 2,
      title: 'Machine_Learning_Lecture_Slides.ppt',
      type: 'PPT Presentation',
      flashcardsCount: '24 Cards',
      mastery: 85,
      updated: '1 day ago'
    },
    {
      id: 3,
      title: 'Organic_Chemistry_Synthesis.docx',
      type: 'DOCX Document',
      flashcardsCount: '40 Cards',
      mastery: 96,
      updated: '3 days ago'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP COMPACT HEADER */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-[12px] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Landing Page</span>
          </button>
          <div className="h-4 w-px bg-slate-300 dark:bg-slate-700" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-[#10B981] flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              IntelLearn AI <span className="text-xs text-[#10B981] font-semibold">Study Workspace</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <Flame className="w-3.5 h-3.5 fill-emerald-500" /> 7 Day Study Streak!
          </span>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="User Avatar"
            className="w-8 h-8 rounded-full ring-2 ring-[#10B981]/40 object-cover"
          />
        </div>
      </header>

      {/* THREE COLUMN MAIN DASHBOARD BODY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR (GREEN STUDY THEME) */}
        {/* ========================================================= */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 76 : 260 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between z-30 shrink-0 select-none shadow-sm"
        >
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3.5 top-5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#10B981] shadow-md z-40 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Navigation Items */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className={`px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Study Toolkit
            </div>

            {navMenuItems.map((item) => {
              const IconComp = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-[14px] text-xs font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-[#10B981] text-white shadow-md shadow-emerald-500/25 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#10B981] dark:text-emerald-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  NotebookLM Voice Sync Active
                </span>
              </div>
            </div>
          )}
        </motion.aside>

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER DASHBOARD CONTENT */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-8">
          
          {/* Header & Quick Action Cards */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Study Workspace
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload slides & notes, generate flashcards, MCQs, audio podcasts & timed quizzes.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Study Decks & Notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>
            </div>

            {/* Quick Actions Grid (Generate Notes, MCQs, Flashcards, Summary, Quiz) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 pt-2">
              {quickActions.map((qa) => {
                const IconComp = qa.icon;
                return (
                  <div
                    key={qa.id}
                    onClick={() => setActiveMenu(qa.id)}
                    className="p-4 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:scale-[1.02] hover:border-[#10B981]/50 shadow-sm transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="w-9 h-9 rounded-[12px] bg-emerald-50 dark:bg-emerald-950 text-[#10B981] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-[#10B981] transition-colors">
                        {qa.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {qa.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* LARGE UPLOAD AREA (SUPPORTS PDF, PPT, DOCX, TXT, IMAGES, OCR) */}
          <div className="relative group p-8 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-dashed border-emerald-200 dark:border-emerald-900/60 hover:border-[#10B981] transition-all duration-300 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-[20px] bg-emerald-50 dark:bg-emerald-950/80 text-[#10B981] flex items-center justify-center mx-auto border border-emerald-200/50 dark:border-emerald-800/50 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Drag & Drop Lecture Slides, Notes & Documents
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports <span className="font-bold text-slate-700 dark:text-slate-300">PDF</span>, <span className="font-bold text-slate-700 dark:text-slate-300">PPT</span>, <span className="font-bold text-slate-700 dark:text-slate-300">DOCX</span>, <span className="font-bold text-slate-700 dark:text-slate-300">TXT</span>, <span className="font-bold text-slate-700 dark:text-slate-300">Images</span> with <span className="font-bold text-[#10B981]">OCR Text Recognition</span>
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleSimulateUpload}
                className="px-5 py-2.5 rounded-[14px] bg-[#10B981] hover:bg-[#0ea572] text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Notes / Images</span>
              </button>
            </div>

            {/* Upload Progress Bar Indicator */}
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto pt-4 space-y-2"
              >
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>Extracting OCR Text & Generating Decks...</span>
                  <span className="text-[#10B981]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#10B981] to-emerald-400 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* RECENT NOTES & FLASHCARD DECKS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Recently Uploaded Notes & Study Decks
              </h3>
              <span className="text-xs text-[#10B981] font-bold">3 Active Decks</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-[#10B981] dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                        {note.type}
                      </span>
                      <span className="text-[11px] text-slate-400">{note.updated}</span>
                    </div>

                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                      {note.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span>{note.flashcardsCount}</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{note.mastery}% Mastery</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mr-3">
                      <div className="h-full bg-[#10B981]" style={{ width: `${note.mastery}%` }} />
                    </div>

                    <button 
                      onClick={() => setActiveMenu('flashcards')}
                      className="px-3 py-1.5 text-xs font-bold rounded-[10px] bg-[#10B981] text-white hover:bg-[#0ea572] shrink-0"
                    >
                      Study
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT PANEL (AI TUTOR, STUDY PROGRESS, TODAY GOAL) */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex w-80 xl:w-96 bg-white/90 dark:bg-slate-900/90 border-l border-slate-200/80 dark:border-slate-800/80 flex-col justify-between z-30 shrink-0 p-5 space-y-6 overflow-y-auto">
          
          {/* AI Study Assistant Header with Animated Avatar */}
          <div className="p-4 rounded-[20px] bg-gradient-to-tr from-[#10B981]/10 to-emerald-500/5 dark:from-[#10B981]/20 dark:to-emerald-900/20 border border-[#10B981]/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#10B981] flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  AI Study Tutor
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Personalized Spaced Repetition
                </p>
              </div>
            </div>
          </div>

          {/* AI Chat History Stream */}
          <div className="flex-1 space-y-3 max-h-56 overflow-y-auto pr-1">
            {aiChatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-[16px] text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#10B981] text-white ml-6 rounded-tr-none font-medium'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 mr-4 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] opacity-70 block mt-1 text-right">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Quick AI Question Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Ask AI Study Tutor..."
              value={aiMessageInput}
              onChange={(e) => setAiMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              className="w-full py-2.5 pl-3.5 pr-10 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            />
            <button
              onClick={handleSendAiMessage}
              className="absolute right-2 top-2 p-1 text-[#10B981] hover:scale-110 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Today's Goal & Study Progress */}
          <div className="space-y-3">
            <div className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span className="flex items-center gap-1.5 text-[#10B981]">
                  <Target className="w-4 h-4" /> Today's Goal
                </span>
                <span>3 / 4 Decks</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] w-[75%]" />
              </div>
              <p className="text-[10px] text-slate-400">1 deck remaining to maintain 7-day streak!</p>
            </div>

            {/* Mastery Progress Ring */}
            <div className="p-4 rounded-[18px] bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Overall Mastery</span>
                <span className="text-lg font-black text-[#10B981]">92% Mastered</span>
              </div>
              <Award className="w-8 h-8 text-[#10B981]" />
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Recent Sessions
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>📚 Organic Chemistry Quiz</span>
                <span className="text-[10px] text-slate-400">15/15 Score</span>
              </div>
              <div className="p-2.5 rounded-[12px] bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>🎧 Voice Audio Overview</span>
                <span className="text-[10px] text-slate-400">12 mins</span>
              </div>
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
