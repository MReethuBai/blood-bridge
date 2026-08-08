import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Sparkles, 
  ShieldCheck, 
  UploadCloud, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Filter, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ArrowLeft, 
  Plus, 
  Table as TableIcon, 
  Award, 
  Layers, 
  BrainCircuit, 
  Compass, 
  Zap, 
  TrendingUp,
  Share2,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function PremiumAnalyticsDashboard({ onBackToLanding }) {
  const [selectedSort, setSelectedSort] = useState('accuracy');
  const [filterQuery, setFilterQuery] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  // Dimensions for Research Score
  const scoreDimensions = [
    { name: 'Novelty', score: 96, color: 'bg-[#5B4BFF]', text: 'text-[#5B4BFF]' },
    { name: 'Methodology', score: 98, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { name: 'Writing', score: 92, color: 'bg-indigo-500', text: 'text-indigo-500' },
    { name: 'Experiments', score: 95, color: 'bg-[#5B4BFF]', text: 'text-[#5B4BFF]' },
    { name: 'References', score: 99, color: 'bg-emerald-500', text: 'text-emerald-500' },
    { name: 'Innovation', score: 97, color: 'bg-[#5B4BFF]', text: 'text-[#5B4BFF]' },
    { name: 'Technical Depth', score: 99, color: 'bg-purple-500', text: 'text-purple-500' }
  ];

  // AI Suggestions
  const aiSuggestions = [
    {
      title: 'Improve Literature Review',
      desc: 'Add 3 recent 2025/2026 IEEE citations regarding state-space model hybridizations to strengthen baseline coverage.',
      impact: 'High Impact (+2.4 Score)',
      icon: AlertCircle
    },
    {
      title: 'Increase Dataset Diversity',
      desc: 'Include multimodal evaluation benchmarks (e.g. DocVQA) alongside standard WikiText-103 to validate cross-domain generalization.',
      impact: 'Medium Impact (+1.8 Score)',
      icon: Layers
    },
    {
      title: 'Better Empirical Experiments',
      desc: 'Conduct ablation studies isolating kernel feature dimension ($d_k = 64, 128, 256$) to demonstrate exact latency trade-offs.',
      impact: 'High Impact (+3.1 Score)',
      icon: Sparkles
    }
  ];

  // Interactive Comparison Matrix Papers Data
  const [comparisonPapers, setComparisonPapers] = useState([
    {
      id: 1,
      name: 'IEEE Transformer-V3 (Proposed)',
      dataset: '1.2T Tokens (IEEE + RedPajama)',
      algorithm: 'Kernelized Multi-Head Attention',
      accuracy: 98.4,
      advantages: 'Sub-linear O(N log N) latency, zero accuracy loss',
      limitations: 'Requires CUDA warp sync hardware support',
      futureScope: 'FP4 quantization & multimodal video tokens',
      novelty: '96%'
    },
    {
      id: 2,
      name: 'Vaswani Standard Transformer (2017)',
      dataset: 'WMT 2014 En-De (4.5M pairs)',
      algorithm: 'Scaled Dot-Product Softmax',
      accuracy: 84.2,
      advantages: 'Baseline benchmark standard, simple implementation',
      limitations: 'Quadratic O(N²) memory wall bottleneck',
      futureScope: 'Replaced by flash/linear attention variants',
      novelty: '78%'
    },
    {
      id: 3,
      name: 'Mamba SSM Variant (2024)',
      dataset: 'SlimPajama 620B',
      algorithm: 'Selective State Space Model',
      accuracy: 91.5,
      advantages: 'Linear execution speed during generation',
      limitations: 'Degrades on complex multi-hop reasoning tasks',
      futureScope: 'Hybrid Attention-SSM layer interleaving',
      novelty: '92%'
    }
  ]);

  // Handle sorting comparison matrix
  const sortedPapers = [...comparisonPapers].sort((a, b) => {
    if (selectedSort === 'accuracy') return b.accuracy - a.accuracy;
    if (selectedSort === 'novelty') return parseInt(b.novelty) - parseInt(a.novelty);
    return a.name.localeCompare(b.name);
  }).filter(p => 
    p.name.toLowerCase().includes(filterQuery.toLowerCase()) || 
    p.algorithm.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleExport = (type) => {
    setExportMessage(`Generating Analytics Report & Comparison Matrix in ${type} format...`);
    setTimeout(() => {
      setExportMessage(`✅ Analytics Report exported as Research_Analytics.${type.toLowerCase()}`);
      setTimeout(() => setExportMessage(''), 3000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* TOP HEADER NAV */}
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
              <BarChart3 className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Premium Analytics Dashboard <span className="text-xs text-[#5B4BFF] font-semibold">IEEE SciSpace Engine</span>
            </span>
          </div>
        </div>

        {/* EXPORT REPORT BUTTONS (PDF, DOCX, EXCEL) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleExport('DOCX')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>DOCX</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Excel</span>
          </button>
        </div>
      </header>

      {/* TWO COLUMN MAIN ANALYTICS CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* EXPORT BANNER */}
        <AnimatePresence>
          {exportMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 rounded-[16px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold text-center shadow-md"
            >
              {exportMessage}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: RESEARCH SCORE, RADAR CHART, BAR CHART, DIMENSIONS */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* CIRCULAR SCORE CARD & RADAR SIMULATION */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white">Research Score</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Quantitative IEEE Rigor Benchmark</p>
                </div>
                <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                  Top 2% Globally
                </span>
              </div>

              {/* Circular Score Meter */}
              <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="72" cy="72" r="58" stroke="currentColor" strokeWidth="12" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                  <circle 
                    cx="72" 
                    cy="72" 
                    r="58" 
                    stroke="#5B4BFF" 
                    strokeWidth="12" 
                    strokeDasharray="364" 
                    strokeDashoffset="14" 
                    className="transition-all duration-1000" 
                    fill="transparent" 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">98</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Out of 100</span>
                </div>
              </div>

              {/* Radar Chart Multi-Axis Polygon Visualizer */}
              <div className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-800 text-center space-y-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#5B4BFF]" /> 7-Axis Dimension Radar Analysis
                </span>

                <div className="relative w-44 h-44 mx-auto flex items-center justify-center">
                  {/* Outer Polygon Radar Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-200/50 dark:border-indigo-900/50 animate-pulse" />
                  <div className="absolute inset-4 rounded-full border border-indigo-300/40 dark:border-indigo-800/40" />
                  <div className="absolute inset-8 rounded-full border border-indigo-400/30 dark:border-indigo-700/30" />
                  
                  {/* Radar Polygon Filled Area */}
                  <div className="w-28 h-28 bg-[#5B4BFF]/20 border-2 border-[#5B4BFF] rounded-[24px] transform rotate-12 flex items-center justify-center backdrop-blur-sm">
                    <Sparkles className="w-6 h-6 text-[#5B4BFF]" />
                  </div>
                </div>
              </div>

              {/* 7 Dimension Ratings Breakdown Bar Chart */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  Dimension Ratings
                </h4>
                
                <div className="space-y-2.5">
                  {scoreDimensions.map((dim, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>{dim.name}</span>
                        <span className={dim.text}>{dim.score} / 100</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${dim.color} transition-all duration-500`} style={{ width: `${dim.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ========================================================= */}
          {/* RIGHT PANEL: SUGGESTIONS & INTERACTIVE COMPARISON MATRIX */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* AI IMPROVEMENT SUGGESTIONS CARD */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  AI Research Improvement Suggestions
                </h3>
              </div>

              <div className="space-y-3">
                {aiSuggestions.map((sug, idx) => {
                  const IconComponent = sug.icon;
                  return (
                    <div key={idx} className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-1.5 hover:border-[#5B4BFF]/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          <IconComponent className="w-4 h-4 text-[#5B4BFF]" /> {sug.title}
                        </h4>
                        <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">
                          {sug.impact}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {sug.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* INTERACTIVE MULTI-PAPER COMPARISON MATRIX */}
            <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-5">
              
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <TableIcon className="w-5 h-5 text-[#5B4BFF]" /> Multi-Paper Comparison Matrix
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Side-by-side benchmark comparison across Dataset, Algorithm, Accuracy & Novelty
                  </p>
                </div>

                {/* Upload Multiple Papers button */}
                <button
                  onClick={() => {
                    const newPaper = {
                      id: Date.now(),
                      name: 'Uploaded IEEE Paper B (2026)',
                      dataset: '800B OpenWebText',
                      algorithm: 'Linear State Space Fusion',
                      accuracy: 94.8,
                      advantages: 'Zero KV cache overhead',
                      limitations: 'Requires warmup tuning',
                      futureScope: 'Multimodal vision integration',
                      novelty: '94%'
                    };
                    setComparisonPapers(prev => [...prev, newPaper]);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-[14px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Upload Paper to Matrix</span>
                </button>
              </div>

              {/* Sorting & Filtering Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-[16px] border border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Filter papers by name or algorithm..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full sm:w-64 px-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-[12px] focus:outline-none focus:ring-1 focus:ring-[#5B4BFF]"
                  />
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                  <ArrowUpDown className="w-4 h-4 text-[#5B4BFF]" />
                  <span>Sort by:</span>
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-[10px] px-2.5 py-1 focus:outline-none"
                  >
                    <option value="accuracy">Accuracy Score</option>
                    <option value="novelty">Novelty Rating</option>
                    <option value="name">Paper Title</option>
                  </select>
                </div>
              </div>

              {/* Interactive Comparison Table */}
              <div className="overflow-x-auto rounded-[18px] border border-slate-200/80 dark:border-slate-800">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800 font-extrabold uppercase text-[10px] text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="p-3">Paper Title</th>
                      <th className="p-3">Dataset</th>
                      <th className="p-3">Algorithm</th>
                      <th className="p-3">Accuracy</th>
                      <th className="p-3">Advantages</th>
                      <th className="p-3">Limitations</th>
                      <th className="p-3">Future Scope</th>
                      <th className="p-3">Novelty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
                    {sortedPapers.map((paper) => (
                      <tr key={paper.id} className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/20 transition-colors">
                        <td className="p-3 font-bold text-slate-900 dark:text-white max-w-[150px]">{paper.name}</td>
                        <td className="p-3 max-w-[130px]">{paper.dataset}</td>
                        <td className="p-3 font-semibold text-[#5B4BFF] max-w-[140px]">{paper.algorithm}</td>
                        <td className="p-3 font-extrabold text-emerald-600 dark:text-emerald-400">{paper.accuracy}%</td>
                        <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-[140px]">{paper.advantages}</td>
                        <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-[140px]">{paper.limitations}</td>
                        <td className="p-3 text-[11px] text-slate-600 dark:text-slate-400 max-w-[140px]">{paper.futureScope}</td>
                        <td className="p-3 font-bold text-indigo-500">{paper.novelty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
