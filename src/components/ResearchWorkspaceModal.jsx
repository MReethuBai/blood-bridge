import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FlaskConical, 
  Sparkles, 
  FileText, 
  Table, 
  Layers, 
  CheckCircle2, 
  Send, 
  BarChart3, 
  ShieldCheck, 
  Download, 
  Share2, 
  Copy, 
  FileCheck2, 
  ArrowRight,
  ExternalLink,
  Cpu,
  BrainCircuit,
  Search,
  BookOpen
} from 'lucide-react';

export default function ResearchWorkspaceModal({ isOpen, onClose, selectedItem }) {
  const [activeSubTab, setActiveSubTab] = useState('assistant');
  const [userQuery, setUserQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello Dr. Vance! I have indexed "Transformer_Architecture_Deep_Dive.pdf" and verified its IEEE citations. How can I assist your synthesis today?',
      timestamp: '10:42 AM'
    }
  ]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!userQuery.trim()) return;
    const newMsg = { sender: 'user', text: userQuery, timestamp: 'Just now' };
    setChatMessages(prev => [...prev, newMsg]);
    setUserQuery('');

    // Simulate AI response
    setTimeout(() => {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Extracted IEEE insights for: "${userQuery}". The methodology utilizes multi-head attention with linear relative positional embeddings, yielding a 4.2% lower latency compared to standard baseline transformers.`,
          timestamp: 'Just now',
          citations: ['[1] Vaswani et al. (IEEE 2017)', '[2] Vance & Zhang (2025)']
        }
      ]);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-950/70 backdrop-blur-md">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-6xl h-[88vh] bg-slate-900 text-white rounded-[24px] border border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col"
        >
          
          {/* TOP HEADER */}
          <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-[14px] bg-[#5B4BFF]/20 text-[#5B4BFF] border border-[#5B4BFF]/40">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base sm:text-lg text-white">
                    Research Workspace
                  </h3>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#5B4BFF] text-white">
                    IEEE Mode
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedItem ? selectedItem.title : 'Transformer_Architecture_Deep_Dive.pdf'}
                </p>
              </div>
            </div>

            {/* Score & Actions */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800 text-xs font-bold text-indigo-300">
                <ShieldCheck className="w-4 h-4 text-[#5B4BFF]" />
                <span>Research Score: 98/100</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* WORKSPACE NAV TABS */}
          <div className="px-5 bg-slate-950/50 border-b border-slate-800 flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('assistant')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'assistant'
                  ? 'border-[#5B4BFF] text-[#5B4BFF]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>AI Research Assistant</span>
            </button>

            <button
              onClick={() => setActiveSubTab('ieee')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'ieee'
                  ? 'border-[#5B4BFF] text-[#5B4BFF]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>IEEE Analysis</span>
            </button>

            <button
              onClick={() => setActiveSubTab('matrix')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'matrix'
                  ? 'border-[#5B4BFF] text-[#5B4BFF]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Comparison Matrix</span>
            </button>

            <button
              onClick={() => setActiveSubTab('review')}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-bold border-b-2 transition-all ${
                activeSubTab === 'review'
                  ? 'border-[#5B4BFF] text-[#5B4BFF]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Literature Review</span>
            </button>
          </div>

          {/* TAB CONTENT AREA */}
          <div className="flex-1 p-6 overflow-y-auto bg-slate-900/60">
            
            {/* SUB-TAB 1: AI RESEARCH ASSISTANT */}
            {activeSubTab === 'assistant' && (
              <div className="h-full flex flex-col justify-between space-y-4">
                
                {/* Chat Stream */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-[#5B4BFF] flex items-center justify-center text-white shrink-0 mt-1">
                          <Sparkles className="w-4 h-4" />
                        </div>
                      )}
                      <div className={`max-w-2xl p-4 rounded-[18px] text-xs leading-relaxed ${
                        msg.sender === 'user' 
                          ? 'bg-[#5B4BFF] text-white rounded-tr-none font-medium' 
                          : 'bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        {msg.citations && (
                          <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap gap-1.5">
                            {msg.citations.map((c, i) => (
                              <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800">
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="text-[9px] text-slate-400 block mt-1 text-right">{msg.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input Controls */}
                <div className="relative flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask AI Research Assistant to synthesize equations, benchmarks, or IEEE citations..."
                    className="flex-1 py-3 px-4 rounded-[14px] bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5B4BFF]"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-3 rounded-[14px] bg-[#5B4BFF] hover:bg-[#4b3be6] text-white transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

            {/* SUB-TAB 2: IEEE ANALYSIS */}
            {activeSubTab === 'ieee' && (
              <div className="space-y-6">
                <div className="p-4 rounded-[18px] bg-slate-800/60 border border-slate-700/70 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">IEEE Indexing Status</h4>
                    <p className="text-xs text-slate-400">DOIs resolved across IEEE Xplore, arXiv & PubMed</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Verified
                  </span>
                </div>

                {/* Methodology Extraction Tree */}
                <div className="p-5 rounded-[20px] bg-slate-800/40 border border-slate-800 space-y-4">
                  <h4 className="font-bold text-sm text-[#5B4BFF] flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Methodology Extraction Pipeline
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-[14px] bg-slate-800 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Phase 1</span>
                      <h5 className="font-bold text-xs text-white mt-1">Multi-Head Attention Layer</h5>
                      <p className="text-[11px] text-slate-400 mt-1">8 parallel attention heads with scaled dot-product projection.</p>
                    </div>

                    <div className="p-4 rounded-[14px] bg-slate-800 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Phase 2</span>
                      <h5 className="font-bold text-xs text-white mt-1">Positional Encoding</h5>
                      <p className="text-[11px] text-slate-400 mt-1">Sinusoidal position embedding for long-context sequence retention.</p>
                    </div>

                    <div className="p-4 rounded-[14px] bg-slate-800 border border-slate-700">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Phase 3</span>
                      <h5 className="font-bold text-xs text-white mt-1">Optimization Loss</h5>
                      <p className="text-[11px] text-slate-400 mt-1">AdamW optimizer with cosine warmup decay schedule.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-TAB 3: COMPARISON MATRIX */}
            {activeSubTab === 'matrix' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white">Algorithm Benchmark Comparison</h4>
                  <button className="flex items-center gap-1.5 text-xs text-[#5B4BFF] hover:underline font-bold">
                    <Download className="w-3.5 h-3.5" /> Export Matrix CSV
                  </button>
                </div>

                <div className="overflow-x-auto rounded-[16px] border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950 text-slate-400 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Model Architecture</th>
                        <th className="p-3">Param Size</th>
                        <th className="p-3">Accuracy (MMLU)</th>
                        <th className="p-3">Latency (ms)</th>
                        <th className="p-3">IEEE Citation Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                      <tr className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-white">IntelLearn Transformer-V3</td>
                        <td className="p-3">7B</td>
                        <td className="p-3 text-emerald-400 font-bold">89.4%</td>
                        <td className="p-3 text-emerald-400 font-bold">14.2 ms</td>
                        <td className="p-3 text-[#5B4BFF] font-bold">98/100</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-300">Standard Transformer (2017)</td>
                        <td className="p-3">7B</td>
                        <td className="p-3">82.1%</td>
                        <td className="p-3">28.5 ms</td>
                        <td className="p-3 text-slate-400">92/100</td>
                      </tr>
                      <tr className="hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-300">Mamba SSM Variant</td>
                        <td className="p-3">7B</td>
                        <td className="p-3">86.8%</td>
                        <td className="p-3">18.1 ms</td>
                        <td className="p-3 text-slate-400">94/100</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SUB-TAB 4: LITERATURE REVIEW */}
            {activeSubTab === 'review' && (
              <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
                <div className="p-5 rounded-[20px] bg-slate-800/40 border border-slate-800 space-y-3">
                  <h4 className="font-bold text-sm text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#5B4BFF]" /> Multi-Paper Literature Review Summary
                  </h4>
                  <p>
                    Recent advancements in neural architecture design demonstrate a pivot toward hybrid attention-state-space models. By integrating scaled dot-product attention with selective state space blocks, modern research achieves linear compute scaling with respect to sequence length while retaining deep contextual reasoning.
                  </p>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-[10px] bg-[#5B4BFF] text-white font-bold text-[11px] flex items-center gap-1.5">
                      <Copy className="w-3.5 h-3.5" /> Copy Literature Citation Text
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
