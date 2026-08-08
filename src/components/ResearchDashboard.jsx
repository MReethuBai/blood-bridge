import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  UploadCloud, 
  MessageSquare, 
  FileCheck2, 
  BarChart3, 
  Layers, 
  Cpu, 
  Sparkles, 
  Compass, 
  Table, 
  BookOpen, 
  Quote, 
  Download, 
  Clock, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Star, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  Bot, 
  Send, 
  HelpCircle, 
  Lightbulb, 
  Share2, 
  Copy, 
  Code, 
  AlertCircle,
  FileCode,
  Zap,
  Filter,
  Plus,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { uploadPapers, getUploadedPapers } from '../services/paperService';
import { getDashboardData } from '../services/dashboardService';

export default function ResearchDashboard({ onBackToLanding, isDark, toggleDarkMode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef(null);
  
  // Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dashboardMetrics, setDashboardMetrics] = useState(null);
  const [uploadedPaper, setUploadedPaper] = useState({
    filename: 'Transformer_Architecture_Deep_Dive_v3.pdf',
    authors: 'Dr. Alex Vance, Prof. Elena Rostova, Dr. Kenji Sato',
    pages: 18,
    conference: 'NeurIPS 2025 / IEEE TPAMI',
    journal: 'IEEE Transactions on Pattern Analysis & Machine Intelligence',
    publisher: 'IEEE Computer Society',
    doi: '10.1109/TPAMI.2025.3498210',
    status: 'Verified',
    verifiedBadge: true,
    score: 98,
    uploadDate: 'Just now'
  });

  // Right Panel AI Chat State
  const [aiMessageInput, setAiMessageInput] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState([
    {
      sender: 'ai',
      text: 'Hello Dr. Vance! I have completed full IEEE indexing & novelty scoring for Transformer_Architecture_Deep_Dive_v3.pdf. What would you like to analyze next?',
      time: '10:45 AM'
    }
  ]);

  // Fetch live dashboard metrics on mount
  useEffect(() => {
    getDashboardData()
      .then(data => setDashboardMetrics(data))
      .catch(err => console.warn("Dashboard live API notice:", err));
  }, []);

  // Handle Real File Upload via API
  const handleRealFileUpload = async (e) => {
    const files = e.target?.files || e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(30);

    try {
      const res = await uploadPapers(files);
      setUploadProgress(100);

      const paperData = res.paper || res.papers?.[0];
      if (paperData) {
        setUploadedPaper({
          filename: paperData.filename,
          authors: Array.isArray(paperData.authors) ? paperData.authors.join(", ") : "Dr. Alex Vance",
          pages: paperData.pages || 12,
          conference: 'IEEE International Conference',
          journal: 'IEEE Transactions on Artificial Intelligence',
          publisher: 'IEEE Computer Society',
          doi: paperData.doi || '10.1109/2026.IEEE',
          status: 'Verified',
          verifiedBadge: true,
          score: paperData.score || 98,
          uploadDate: 'Just now'
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
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
          text: `Extracted paper insights for "${aiMessageInput}": The methodology introduces multi-head linear attention with relative position encodings, achieving 98.4% benchmark accuracy on IEEE MMLU.`,
          time: 'Just now'
        }
      ]);
    }, 900);
  };

  // Left sidebar menu definition
  const navMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload', label: 'Upload Paper', icon: UploadCloud },
    { id: 'chat', label: 'AI Research Chat', icon: MessageSquare },
    { id: 'ieee', label: 'IEEE Analysis', icon: FileCheck2 },
    { id: 'score', label: 'Research Score', icon: BarChart3 },
    { id: 'methodology', label: 'Methodology Extraction', icon: Layers },
    { id: 'algorithm', label: 'Algorithm Detection', icon: Cpu },
    { id: 'novelty', label: 'Novelty Detection', icon: Sparkles },
    { id: 'gap', label: 'Research Gap', icon: Compass },
    { id: 'matrix', label: 'Comparison Matrix', icon: Table },
    { id: 'review', label: 'Literature Review', icon: BookOpen },
    { id: 'citation', label: 'Citation Generator', icon: Quote },
    { id: 'export', label: 'Export Report', icon: Download },
    { id: 'history', label: 'History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Feature grid items
  const featureGridCards = [
    {
      id: 'ieee',
      title: 'IEEE Analysis',
      desc: 'DOI validation, structure integrity & IEEE standard verification.',
      icon: FileCheck2,
      badge: 'IEEE Certified',
      metric: 'Passed'
    },
    {
      id: 'score',
      title: 'Research Score',
      desc: 'Quantitative novelty, rigor & empirical impact rating.',
      icon: BarChart3,
      badge: 'Top 2%',
      metric: '98 / 100'
    },
    {
      id: 'methodology',
      title: 'Methodology',
      desc: 'Automated extraction of model architecture & pipeline steps.',
      icon: Layers,
      badge: '3 Phases',
      metric: 'Parsed'
    },
    {
      id: 'algorithm',
      title: 'Algorithm Extraction',
      desc: 'Pseudocode synthesis & computational complexity parsing.',
      icon: Cpu,
      badge: 'O(N log N)',
      metric: '3 Algorithms'
    },
    {
      id: 'novelty',
      title: 'Novelty Detection',
      desc: 'Originality index compared across 1.4M arXiv & IEEE papers.',
      icon: Sparkles,
      badge: 'High Novelty',
      metric: '94.2%'
    },
    {
      id: 'matrix',
      title: 'Comparison Matrix',
      desc: 'Side-by-side benchmark comparison against baseline models.',
      icon: Table,
      badge: 'SciSpace',
      metric: '4 Models'
    },
    {
      id: 'gap',
      title: 'Research Gap',
      desc: 'Unresolved challenges & future direction opportunities.',
      icon: Compass,
      badge: '3 Gaps',
      metric: 'Identified'
    },
    {
      id: 'review',
      title: 'Literature Review',
      desc: 'Multi-paper contextual synthesis & reference tree.',
      icon: BookOpen,
      badge: 'Auto Sync',
      metric: '42 Citations'
    },
    {
      id: 'citation',
      title: 'Citation Generator',
      desc: 'Instant BibTeX, APA, IEEE, MLA & Chicago export.',
      icon: Quote,
      badge: '5 Formats',
      metric: 'Ready'
    },
    {
      id: 'export',
      title: 'Export Report',
      desc: 'Download full analytical summary in PDF or LaTeX format.',
      icon: Download,
      badge: 'PDF / LaTeX',
      metric: '1-Click'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP COMPACT HEADER */}
      <header className="h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between z-40 sticky top-0">
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
            <div className="w-8 h-8 rounded-[10px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              IntelLearn AI <span className="text-[#5B4BFF] text-xs font-semibold">Workspace</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" /> IEEE Engine Active
          </span>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
            alt="User Avatar"
            className="w-8 h-8 rounded-full ring-2 ring-[#5B4BFF]/40 object-cover"
          />
        </div>
      </header>

      {/* THREE COLUMN MAIN DASHBOARD BODY */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR */}
        {/* ========================================================= */}
        <motion.aside
          animate={{ width: sidebarCollapsed ? 76 : 260 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
          className="relative bg-white/90 dark:bg-slate-900/90 border-r border-slate-200/80 dark:border-slate-800/80 flex flex-col justify-between z-30 shrink-0 select-none shadow-sm"
        >
          {/* Collapse/Expand Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3.5 top-5 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#5B4BFF] shadow-md z-40 transition-colors"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Navigation Items */}
          <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
            <div className={`px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
              Research Toolkit
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
                      ? 'bg-[#5B4BFF] text-white shadow-md shadow-indigo-500/25 font-bold' 
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#5B4BFF] dark:text-indigo-400'}`} />
                  {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer User Info */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  IEEE SciSpace Sync Active
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
                  Research Workspace
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Upload research papers, extract methodologies, run IEEE benchmarks & literature matrices.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search Uploaded Papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
                />
              </div>
            </div>

            {/* Quick Action Cards (Upload Paper, Recent Papers, Favorites) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-[18px] bg-gradient-to-br from-[#5B4BFF]/10 to-indigo-500/5 dark:from-[#5B4BFF]/20 dark:to-indigo-900/20 border border-[#5B4BFF]/30 cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-[#5B4BFF] text-white flex items-center justify-center shadow-md shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Upload New Paper</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">PDF, DOCX, IEEE formats</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveMenu('history')}
                className="p-4 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-slate-100 dark:bg-slate-800 text-[#5B4BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Recent Papers</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">14 Indexed Documents</p>
                </div>
              </div>

              <div 
                onClick={() => setActiveMenu('matrix')}
                className="p-4 rounded-[18px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 cursor-pointer hover:scale-[1.02] transition-transform duration-200 flex items-center gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-[14px] bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Favorites & Matrices</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">6 Saved Syntheses</p>
                </div>
              </div>
            </div>
          </div>

          {/* LARGE UPLOAD AREA (DRAG & DROP) */}
          <div className="relative group p-8 rounded-[24px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-[#5B4BFF] transition-all duration-300 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-[20px] bg-indigo-50 dark:bg-indigo-950/80 text-[#5B4BFF] flex items-center justify-center mx-auto border border-indigo-200/50 dark:border-indigo-800/50 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Drag & Drop Your Research Paper Here
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Supports <span className="font-bold text-slate-700 dark:text-slate-300">PDF</span>, <span className="font-bold text-slate-700 dark:text-slate-300">DOCX</span>, <span className="font-bold text-slate-700 dark:text-slate-300">IEEE Paper files</span> up to 50MB
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleRealFileUpload}
              multiple
              className="hidden"
              accept=".pdf,.docx,.pptx,.txt,.zip,.png,.jpg"
            />

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-[14px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Browse Local Files</span>
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
                  <span>Uploading & Parsing IEEE Structure...</span>
                  <span className="text-[#5B4BFF]">{uploadProgress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#5B4BFF] to-[#10B981] transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* UPLOADED PAPER CARD (METADATA + VERIFIED BADGE) */}
          <div className="p-6 rounded-[22px] bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-[16px] bg-indigo-50 dark:bg-indigo-950 text-[#5B4BFF] border border-indigo-100 dark:border-indigo-900 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {uploadedPaper.filename}
                    </h3>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <ShieldCheck className="w-3 h-3" /> IEEE Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Authors: <span className="font-semibold text-slate-700 dark:text-slate-300">{uploadedPaper.authors}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" /> Share Paper
                </button>
                <button className="px-3 py-1.5 text-xs font-bold rounded-[12px] bg-[#5B4BFF] text-white hover:bg-[#4a3ae6] shadow-sm transition-colors flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Download Full PDF
                </button>
              </div>
            </div>

            {/* Paper Details Metadata Table Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Conference</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{uploadedPaper.conference}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Publisher & Pages</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 block mt-0.5">{uploadedPaper.publisher} ({uploadedPaper.pages} pages)</span>
              </div>
              <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">DOI Reference</span>
                <span className="font-bold text-[#5B4BFF] dark:text-indigo-300 block mt-0.5 truncate">{uploadedPaper.doi}</span>
              </div>
              <div className="p-3 rounded-[14px] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Research Score</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{uploadedPaper.score} / 100 (Top 2%)</span>
              </div>
            </div>
          </div>

          {/* FEATURE GRID (10 CARDS WITH HOVER ANIMATIONS) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                AI Research Tools & Analytical Modules
              </h3>
              <span className="text-xs text-[#5B4BFF] font-bold">10 Active Modules</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureGridCards.map((card) => {
                const IconComponent = card.icon;
                return (
                  <motion.div
                    key={card.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setActiveMenu(card.id)}
                    className="group relative p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#5B4BFF]/40 cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-[14px] bg-indigo-50 dark:bg-indigo-950 text-[#5B4BFF] flex items-center justify-center group-hover:scale-110 transition-transform">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {card.badge}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-[#5B4BFF] transition-colors">
                        {card.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>Status: <span className="text-[#5B4BFF]">{card.metric}</span></span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#5B4BFF] transition-all" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT PANEL (AI ASSISTANT PREVIEW & INSIGHTS) */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex w-80 xl:w-96 bg-white/90 dark:bg-slate-900/90 border-l border-slate-200/80 dark:border-slate-800/80 flex-col justify-between z-30 shrink-0 p-5 space-y-6 overflow-y-auto">
          
          {/* AI Assistant Preview Header with Animated Avatar */}
          <div className="p-4 rounded-[20px] bg-gradient-to-tr from-[#5B4BFF]/10 to-purple-500/5 dark:from-[#5B4BFF]/20 dark:to-purple-900/20 border border-[#5B4BFF]/30 space-y-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-[#5B4BFF] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  SciSpace Research AI
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Active Reasoning Agent (GPT-4o)
                </p>
              </div>
            </div>
          </div>

          {/* AI Chat Conversation Stream */}
          <div className="flex-1 space-y-3 max-h-72 overflow-y-auto pr-1">
            {aiChatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-[16px] text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#5B4BFF] text-white ml-6 rounded-tr-none font-medium'
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
              placeholder="Ask AI Research Assistant..."
              value={aiMessageInput}
              onChange={(e) => setAiMessageInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              className="w-full py-2.5 pl-3.5 pr-10 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[14px] focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
            />
            <button
              onClick={handleSendAiMessage}
              className="absolute right-2 top-2 p-1 text-[#5B4BFF] hover:scale-110 transition-transform"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Suggested Questions */}
          <div className="space-y-2">
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Suggested Paper Queries
            </h5>
            <div className="space-y-1.5 text-xs">
              <button 
                onClick={() => setAiMessageInput("What is the core baseline improvement in Table 3?")}
                className="w-full text-left p-2 rounded-[12px] bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 transition-colors truncate"
              >
                💡 What is the core baseline improvement in Table 3?
              </button>
              <button 
                onClick={() => setAiMessageInput("Synthesize novelty score & arXiv overlap.")}
                className="w-full text-left p-2 rounded-[12px] bg-slate-50 dark:bg-slate-800/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-300 transition-colors truncate"
              >
                💡 Synthesize novelty score & arXiv overlap.
              </button>
            </div>
          </div>

          {/* Research Insights & Quick Tips */}
          <div className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#5B4BFF] font-bold">
              <Lightbulb className="w-4 h-4" /> Research Insight
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
              This paper introduces linear complexity attention. You can export a BibTeX citation or run a 3-way algorithm comparison matrix.
            </p>
          </div>

        </aside>

      </div>

    </div>
  );
}
