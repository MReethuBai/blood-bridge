import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck2, 
  FileText, 
  Target, 
  AlertCircle, 
  BookOpen, 
  Layers, 
  Database, 
  Cpu, 
  Zap, 
  TestTube, 
  BarChart3, 
  Award, 
  PieChart as PieChartIcon, 
  CheckCircle2, 
  Compass, 
  Quote, 
  Download, 
  FileSpreadsheet, 
  X, 
  ArrowLeft, 
  ShieldCheck, 
  Share2, 
  Sparkles, 
  TrendingUp,
  Clock,
  Tag,
  BarChart2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function IeeeAnalysisDashboard({ onBackToLanding }) {
  const [selectedCard, setSelectedCard] = useState(null);
  const [exportMessage, setExportMessage] = useState('');

  // 15 IEEE Analysis Cards definition
  const analysisCards = [
    {
      id: 'abstract',
      title: 'Abstract',
      icon: FileText,
      tag: 'Section 1.0',
      summary: 'High-level synthesis of sub-linear attention architecture and empirical 98.4% benchmark accuracy.',
      detail: `The abstract outlines the computational bottleneck of standard $O(N^2)$ self-attention in large language models. To resolve sequence scaling limits, this paper proposes an IEEE-certified kernelized attention mechanism that achieves $O(N \\log N)$ time complexity while retaining multi-head attention expressiveness. Key results demonstrate a 4.2x throughput increase on A100 GPUs.`
    },
    {
      id: 'objectives',
      title: 'Objectives',
      icon: Target,
      tag: 'Section 1.1',
      summary: 'Delineates 3 core research targets: memory reduction, speedup, and IEEE benchmark validation.',
      detail: `1. Reduce peak GPU VRAM consumption by >70% during long-context inference (>32k tokens).\n2. Maintain zero loss in MMLU & GSM8K accuracy scores compared to standard Llama 3 baselines.\n3. Formulate analytical proof for error bounds in kernelized dot-product approximations.`
    },
    {
      id: 'problem',
      title: 'Problem Statement',
      icon: AlertCircle,
      tag: 'Section 1.2',
      summary: 'Addresses memory wall bottlenecks and quadratic attention complexity in long-context models.',
      detail: `Traditional attention requires storing $N \\times N$ attention maps in GPU memory, creating a memory wall for 128k token context windows. Existing linear attention methods suffer from accuracy degradation due to unconstrained matrix multiplication scaling.`
    },
    {
      id: 'literature',
      title: 'Literature Review',
      icon: BookOpen,
      tag: 'Section 2.0',
      summary: 'Compares 42 IEEE, arXiv, and ACM publications across Transformer, Mamba, and FlashAttention models.',
      detail: `Taxonomy of prior work: Vaswani et al. (2017) baseline, Dao et al. (FlashAttention-2), and Gu & Dao (Mamba SSM). This paper bridges the gap between state-space models and kernelized attention layers.`
    },
    {
      id: 'methodology',
      title: 'Methodology',
      icon: Layers,
      tag: 'Section 3.0',
      summary: 'Formulates kernelized feature mapping $\\phi(x) = \\text{elu}(x) + 1$ with causal mask constraints.',
      detail: `The methodology relies on decomposing the softmax operator into linear kernel dot-products. By associativity: $(Q K^T) V = Q (K^T V)$, enabling $O(N)$ associative matrix multiplication.`
    },
    {
      id: 'dataset',
      title: 'Dataset',
      icon: Database,
      tag: 'Section 3.1',
      summary: 'Evaluated on 1.2T token corpus: RedPajama, IEEE Xplore Open Corpus, and WikiText-103.',
      detail: `Dataset composition:\n- 60% Web crawl (Filtered RedPajama)\n- 25% Academic Papers (IEEE Xplore & arXiv)\n- 15% Synthetic Reasoning Decks (GSM8K & MATH)`
    },
    {
      id: 'algorithms',
      title: 'Algorithms',
      icon: Cpu,
      tag: 'Section 3.2',
      summary: 'Provides Algorithm 1 (Causal Kernel Attention) and Algorithm 2 (Parallel Scan Matrix Sum).',
      detail: `Algorithm 1 processes sequence blocks of size 128 with CUDA warp-level synchronization. Algorithm 2 applies parallel prefix sum scanning across GPU streaming multiprocessors.`
    },
    {
      id: 'training',
      title: 'Training',
      icon: Zap,
      tag: 'Section 4.0',
      summary: 'Trained on 64x NVIDIA A100 (80GB) GPUs using PyTorch FSDP & FP16 mixed precision.',
      detail: `Hyperparameters:\n- Learning Rate: 3e-4 with Cosine Decay\n- Warmup Steps: 2,000\n- Global Batch Size: 4.0M tokens\n- Total Training Time: 142 GPU hours`
    },
    {
      id: 'testing',
      title: 'Testing',
      icon: TestTube,
      tag: 'Section 4.1',
      summary: 'A/B benchmarked against Llama 3 8B, Mistral 7B, and Mamba 3B baselines.',
      detail: `Testing protocol evaluated perplexity across 1k to 128k token context lengths. Zero-shot evaluations conducted on MMLU, HumanEval, and GSM8K.`
    },
    {
      id: 'results',
      title: 'Results',
      icon: BarChart3,
      tag: 'Section 5.0',
      summary: 'Demonstrates 4.2x throughput increase and 73% memory reduction with zero accuracy degradation.',
      detail: `Key numerical outcomes:\n- Inference Throughput: 4,210 tokens/sec (vs 1,002 tokens/sec baseline)\n- Perplexity: 5.12 on WikiText-103\n- HumanEval Code Generation: 68.4% pass@1`
    },
    {
      id: 'accuracy',
      title: 'Accuracy',
      icon: Award,
      tag: 'Section 5.1',
      summary: 'Achieves 98.4% IEEE benchmark accuracy matching full dense softmax attention.',
      detail: `Statistical significance verified via 5-fold cross validation. $p$-value $< 0.001$ demonstrating statistically equivalent reasoning capability to 100% dense attention.`
    },
    {
      id: 'graphs',
      title: 'Graphs',
      icon: PieChartIcon,
      tag: 'Section 5.2',
      summary: 'Contains 6 empirical figures: Latency vs Sequence Length, Memory Footprint, and Loss Curves.',
      detail: `Figure 1: Log-log plot of execution latency showing linear slope for IEEE Linear V3.\nFigure 2: Memory footprint ceiling capped at 3.8GB for 128k context.`
    },
    {
      id: 'conclusion',
      title: 'Conclusion',
      icon: CheckCircle2,
      tag: 'Section 6.0',
      summary: 'Confirms theoretical and empirical superiority of IEEE-certified kernelized attention.',
      detail: `The proposed architecture successfully eliminates the quadratic computational bottleneck without compromising multi-step reasoning precision.`
    },
    {
      id: 'future',
      title: 'Future Scope',
      icon: Compass,
      tag: 'Section 6.1',
      summary: 'Proposes extension to multimodal vision-language models and FP4 quantization kernels.',
      detail: `Future work will focus on hardware-native FP4 tensor core implementations and extending kernelized attention to 3D video generation transformers.`
    },
    {
      id: 'references',
      title: 'References',
      icon: Quote,
      tag: 'Section 7.0',
      summary: 'Includes 42 IEEE, arXiv, and ACM verified DOIs with complete citation graph.',
      detail: `Indexed Citations:\n- [1] Vaswani et al., "Attention is all you need," NeurIPS 2017.\n- [2] Dao et al., "FlashAttention-2," ICLR 2024.\n- [3] IEEE TPAMI 2025 DOI: 10.1109/TPAMI.2025.3498210`
    }
  ];

  // Chart data visualizations definitions
  const referenceDistribution = [
    { label: 'IEEE Xplore', count: 24, percent: 57, color: 'bg-[#5B4BFF]' },
    { label: 'arXiv', count: 11, percent: 26, color: 'bg-emerald-500' },
    { label: 'ACM Digital Library', count: 5, percent: 12, color: 'bg-purple-500' },
    { label: 'Springer / Nature', count: 2, percent: 5, color: 'bg-amber-500' }
  ];

  const keywordFrequencies = [
    { word: 'Kernelized Attention', count: 48 },
    { word: 'Linear Complexity', count: 36 },
    { word: 'Positional Encoding', count: 28 },
    { word: 'Memory Bottleneck', count: 22 },
    { word: 'IEEE Benchmark', count: 19 }
  ];

  const publicationTimeline = [
    { year: '2017', papers: 3, label: 'Vaswani Baseline' },
    { year: '2020', papers: 6, label: 'Linear Approximations' },
    { year: '2022', papers: 11, label: 'FlashAttention-1' },
    { year: '2024', papers: 14, label: 'FlashAttention-2 & Mamba' },
    { year: '2025', papers: 8, label: 'IEEE Linear V3 (Current)' }
  ];

  const handleExport = (format) => {
    setExportMessage(`Generating IEEE Paper Analysis Report in ${format} format...`);
    setTimeout(() => {
      setExportMessage(`✅ Report exported successfully as IEEE_Analysis_Report.${format.toLowerCase()}`);
      setTimeout(() => setExportMessage(''), 3000);
    }, 1000);
  };

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
            <div className="w-8 h-8 rounded-[10px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              IEEE Analysis Dashboard <span className="text-xs text-[#5B4BFF] font-semibold">Verified DOI</span>
            </span>
          </div>
        </div>

        {/* EXPORT REPORT BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('PDF')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('DOCX')}
            className="px-3.5 py-2 text-xs font-bold rounded-[12px] bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export DOCX</span>
          </button>
        </div>
      </header>

      {/* MAIN DASHBOARD CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* EXPORT NOTIFICATION BANNER */}
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

        {/* PAPER SUMMARY HEADER CARD */}
        <div className="p-6 rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                IEEE Standard Verified
              </span>
              <span className="text-xs text-slate-400 font-medium">DOI: 10.1109/TPAMI.2025.3498210</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Transformer_Architecture_Deep_Dive_v3.pdf
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Authors: Dr. Alex Vance, Prof. Elena Rostova • Published in IEEE TPAMI 2025
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-3.5 rounded-[18px] bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-100 dark:border-indigo-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Completeness</span>
              <span className="text-xl font-black text-[#5B4BFF]">100%</span>
            </div>
            <div className="text-center p-3.5 rounded-[18px] bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-100 dark:border-emerald-900">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">IEEE Score</span>
              <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">98 / 100</span>
            </div>
          </div>
        </div>

        {/* CHARTS SECTION (COMPLETENESS, REFERENCE DIST, KEYWORDS, TIMELINE) */}
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
            Paper Analytics & Structural Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Chart 1: Paper Structure Completeness */}
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Structure Completeness</span>
                <span className="text-[#5B4BFF]">15/15 Sections</span>
              </div>

              {/* Progress ring meter simulation */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="48" cy="48" r="38" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                  <circle cx="48" cy="48" r="38" stroke="#5B4BFF" strokeWidth="8" strokeDasharray="238" strokeDashoffset="0" className="transition-all duration-1000" fill="transparent" strokeLinecap="round" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-base font-black text-slate-900 dark:text-white">100%</span>
                  <span className="text-[9px] text-slate-400 uppercase font-bold">Passed</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center">
                All 15 IEEE structural requirements fully present and verified.
              </p>
            </div>

            {/* Chart 2: Reference Distribution */}
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Reference Distribution</span>
                <span className="text-emerald-500">42 Citations</span>
              </div>

              <div className="space-y-2 pt-1">
                {referenceDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span>{item.label}</span>
                      <span>{item.count} ({item.percent}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 3: Keyword Frequency */}
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Keyword Frequency</span>
                <Tag className="w-4 h-4 text-[#5B4BFF]" />
              </div>

              <div className="space-y-2 pt-1">
                {keywordFrequencies.map((kw, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-[10px] bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{kw.word}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-[#5B4BFF] dark:bg-indigo-950 dark:text-indigo-300">
                      {kw.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 4: Publication Timeline */}
            <div className="p-5 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Citation Timeline</span>
                <Clock className="w-4 h-4 text-[#5B4BFF]" />
              </div>

              <div className="space-y-2 pt-1">
                {publicationTimeline.map((tl, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#5B4BFF] w-12">{tl.year}</span>
                    <div className="flex-1 mx-2 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#5B4BFF] to-[#10B981]" style={{ width: `${(tl.papers / 14) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">{tl.papers}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 15 ANALYSIS CARDS GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
              15 IEEE Section Breakdown Cards
            </h2>
            <span className="text-xs text-slate-400">Click any card to inspect full detailed breakdown modal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {analysisCards.map((card) => {
              const IconComp = card.icon;
              return (
                <motion.div
                  key={card.id}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedCard(card)}
                  className="group relative p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-[#5B4BFF] cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2.5 rounded-[12px] bg-indigo-50 dark:bg-indigo-950 text-[#5B4BFF] group-hover:scale-110 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {card.tag}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white group-hover:text-[#5B4BFF] transition-colors">
                      {card.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-3 leading-snug">
                      {card.summary}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-[#5B4BFF]">
                    <span>Inspect Details</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </main>

      {/* DETAILED SECTION CARD MODAL */}
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-[14px] bg-[#5B4BFF]/10 text-[#5B4BFF]">
                    <selectedCard.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{selectedCard.tag}</span>
                    <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{selectedCard.title}</h3>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCard(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-96 overflow-y-auto pr-2">
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {selectedCard.summary}
                </p>
                <div className="p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 whitespace-pre-wrap font-sans">
                  {selectedCard.detail}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => setSelectedCard(null)}
                  className="px-5 py-2 rounded-[12px] bg-[#5B4BFF] text-white font-bold text-xs"
                >
                  Close Detailed View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
