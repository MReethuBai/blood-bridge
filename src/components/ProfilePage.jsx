import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Clock, 
  Award, 
  ShieldCheck, 
  Download, 
  Share2, 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  Star,
  Trophy
} from 'lucide-react';
import { getUserProfile } from '../services/authService';

export default function ProfilePage({ onBackToLanding }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getUserProfile()
      .then(user => setProfile(user))
      .catch(err => console.warn("Profile fetch notice:", err));
  }, []);

  const stats = [
    { label: 'Research Papers Uploaded', value: `${profile?.papers_uploaded || 14} Papers`, icon: FileText, color: 'text-[#5B4BFF]', bg: 'bg-indigo-50 dark:bg-indigo-950' },
    { label: 'Study Notes Generated', value: `${profile?.notes_generated || 28} Decks`, icon: BookOpen, color: 'text-[#10B981]', bg: 'bg-emerald-50 dark:bg-emerald-950' },
    { label: 'MCQs Generated', value: `${profile?.mcqs_generated || 185} MCQs`, icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950' },
    { label: 'Hours Studied', value: `${profile?.study_hours || 64.5} Hours`, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' }
  ];

  const achievements = [
    { title: 'IEEE Scholar Master', desc: 'Synthesized 10+ IEEE publications with 100% DOI validation.', icon: ShieldCheck, color: 'text-[#5B4BFF]' },
    { title: 'Quiz Machine', desc: 'Scored 100% on 5 consecutive MCQ practice tests.', icon: Trophy, color: 'text-amber-500' },
    { title: '7-Day Study Streak', desc: 'Maintained active daily study session for 7 straight days.', icon: Flame, color: 'text-rose-500' },
    { title: 'NotebookLM Pioneer', desc: 'Generated 10+ two-host AI voice podcast summaries.', icon: Sparkles, color: 'text-[#10B981]' }
  ];

  const certificates = [
    {
      title: 'IEEE Certified AI Researcher - Advanced Level',
      issuedBy: 'IntelLearn AI & IEEE Computer Society',
      date: 'July 2026',
      credentialId: 'ID: IEEE-AI-2026-9842',
      badge: 'Verified'
    },
    {
      title: 'Neural Architecture Mastery & Optimization',
      issuedBy: 'IntelLearn Learning Systems',
      date: 'June 2026',
      credentialId: 'ID: INTEL-MASTER-7741',
      badge: 'Pro Verified'
    }
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
            <div className="w-8 h-8 rounded-[10px] bg-[#5B4BFF] flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <User className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              Researcher Profile & Credentials
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 text-xs font-extrabold rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 fill-amber-500" /> Pro Scholar Tier
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* USER PROFILE HEADER CARD */}
        <div className="p-6 sm:p-8 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Dr. Alex Vance"
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#5B4BFF]/30 shadow-xl"
            />
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-4 ring-white dark:ring-slate-900" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Dr. Alex Vance
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Lead AI Researcher • MIT Computer Science & Artificial Intelligence Lab (CSAIL)
                </p>
              </div>

              <button className="px-4 py-2 text-xs font-bold rounded-[14px] bg-[#5B4BFF] text-white hover:bg-[#4b3be6] shadow-md shadow-indigo-500/20 transition-all">
                Edit Scholar Profile
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Focusing on sub-linear transformer attention architectures, CUDA GPU warp kernel optimizations, and automated IEEE literature synthesis.
            </p>
          </div>
        </div>

        {/* 4 CORE STATISTICS CARDS */}
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Research & Learning Activity Metrics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((st, idx) => {
              const IconComponent = st.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex items-center gap-4"
                >
                  <div className={`p-3 rounded-[16px] ${st.bg} ${st.color} shrink-0`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">{st.label}</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white block mt-0.5">{st.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACHIEVEMENTS GRID */}
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Scholar Badges & Achievements
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ach, idx) => {
              const IconComp = ach.icon;
              return (
                <div key={idx} className="p-4 rounded-[20px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="flex items-center gap-2">
                    <IconComp className={`w-5 h-5 ${ach.color}`} />
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">{ach.title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {ach.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CERTIFICATES SECTION */}
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
            Verified Certificates & Accreditation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert, idx) => (
              <div key={idx} className="p-6 rounded-[22px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-[14px] bg-indigo-50 dark:bg-indigo-950 text-[#5B4BFF]">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{cert.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{cert.issuedBy}</p>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200">
                    {cert.badge}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500">
                  <span>{cert.credentialId}</span>
                  <button className="flex items-center gap-1.5 text-[#5B4BFF] hover:underline font-bold">
                    <Download className="w-3.5 h-3.5" /> Download PDF Certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
