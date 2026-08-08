import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Sun, 
  Moon, 
  Palette, 
  Globe, 
  Save, 
  Bell, 
  Cpu, 
  ShieldCheck, 
  User, 
  HardDrive, 
  ArrowLeft, 
  Check, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { getSettings, updateSettings } from '../services/settingsService';

export default function SettingsPage({ onBackToLanding, isDark, toggleDarkMode }) {
  const [activeSection, setActiveSection] = useState('appearance');
  const [accentColor, setAccentColor] = useState('#5B4BFF');
  const [language, setLanguage] = useState('English (US)');
  const [autosave, setAutosave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-3.5-flash');
  const [privacyTelemetry, setPrivacyTelemetry] = useState(false);

  useEffect(() => {
    getSettings()
      .then(s => {
        if (s.accent_color) setAccentColor(s.accent_color);
        if (s.language) setLanguage(s.language);
        if (s.autosave !== undefined) setAutosave(s.autosave);
        if (s.notifications !== undefined) setNotifications(s.notifications);
        if (s.ai_model) setAiModel(s.ai_model);
        if (s.privacy_telemetry !== undefined) setPrivacyTelemetry(s.privacy_telemetry);
      })
      .catch(e => console.warn("Settings fetch notice:", e));
  }, []);

  const saveSetting = (key, value) => {
    updateSettings({ [key]: value }).catch(e => console.error("Error saving setting:", e));
  };

  const sections = [
    { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
    { id: 'preferences', label: 'Preferences & Language', icon: Globe },
    { id: 'ai', label: 'AI Model Engine', icon: Cpu },
    { id: 'privacy', label: 'Privacy & Telemetry', icon: ShieldCheck },
    { id: 'account', label: 'Account & Storage', icon: User }
  ];

  const colorOptions = [
    { name: 'Research Purple', hex: '#5B4BFF' },
    { name: 'Study Emerald', hex: '#10B981' },
    { name: 'Amber Glow', hex: '#F59E0B' },
    { name: 'Electric Pink', hex: '#EC4899' },
    { name: 'Ocean Blue', hex: '#3B82F6' }
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
            <div className="w-8 h-8 rounded-[10px] bg-slate-800 text-white flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">
              IntelLearn Settings <span className="text-xs text-slate-400 font-normal">Notion Style Workspace Config</span>
            </span>
          </div>
        </div>
      </header>

      {/* NOTION STYLE TWO-PANEL SETTINGS BODY */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* LEFT SETTINGS SIDEBAR (NOTION STYLE) */}
        <aside className="w-full md:w-64 bg-white/80 dark:bg-slate-900/80 p-3 rounded-[20px] border border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0 h-fit space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            Workspace Settings
          </div>
          {sections.map(sec => {
            const IconComp = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-[#5B4BFF]' : 'text-slate-400'}`} />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </aside>

        {/* RIGHT SETTINGS DETAILS PANEL */}
        <main className="flex-1 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[24px] border border-slate-200/80 dark:border-slate-800 shadow-md space-y-8">
          
          {/* SECTION 1: APPEARANCE & THEME */}
          {activeSection === 'appearance' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Appearance & Theme</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Customize workspace visual style and primary accent color.</p>
              </div>

              {/* Mode Switcher */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Theme Mode</label>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    onClick={toggleDarkMode}
                    className={`p-4 rounded-[18px] border cursor-pointer transition-all flex items-center justify-between ${!isDark ? 'border-[#5B4BFF] bg-indigo-50/50' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Light Mode</span>
                    </div>
                    {!isDark && <Check className="w-4 h-4 text-[#5B4BFF]" />}
                  </div>

                  <div 
                    onClick={toggleDarkMode}
                    className={`p-4 rounded-[18px] border cursor-pointer transition-all flex items-center justify-between ${isDark ? 'border-[#5B4BFF] bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-indigo-400" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">Dark Mode</span>
                    </div>
                    {isDark && <Check className="w-4 h-4 text-[#5B4BFF]" />}
                  </div>
                </div>
              </div>

              {/* Accent Color Selection */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map(c => (
                    <button
                      key={c.hex}
                      onClick={() => setAccentColor(c.hex)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-[12px] border text-xs font-bold transition-all ${accentColor === c.hex ? 'border-slate-900 dark:border-white shadow-sm' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: PREFERENCES */}
          {activeSection === 'preferences' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Preferences & Language</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage language, autosave, and desktop notifications.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Workspace Language</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select display language for AI summaries.</p>
                  </div>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-[10px] px-3 py-1.5 focus:outline-none"
                  >
                    <option>English (US)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Autosave Generated Notes</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Automatically sync study decks to local storage.</p>
                  </div>
                  <button onClick={() => setAutosave(!autosave)} className="text-[#5B4BFF]">
                    {autosave ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                  <div>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">Desktop Notifications</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Receive alerts when IEEE paper synthesis finishes.</p>
                  </div>
                  <button onClick={() => setNotifications(!notifications)} className="text-[#5B4BFF]">
                    {notifications ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: AI MODEL CONFIG */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">AI Model Engine Configuration</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Select active LLM engine powering synthesis and chat.</p>
              </div>

              <div className="space-y-3">
                {[
                  'GPT-4o (Reasoning & IEEE Synthesis)',
                  'Claude 3.5 Sonnet (High Precision Research)',
                  'DeepSeek-R1 (Math & Code Generation)',
                  'Llama 3 70B (Open Weights Engine)'
                ].map(model => (
                  <div
                    key={model}
                    onClick={() => setAiModel(model)}
                    className={`p-4 rounded-[18px] border cursor-pointer transition-all flex items-center justify-between ${aiModel === model ? 'border-[#5B4BFF] bg-indigo-50/50 dark:bg-indigo-950/40' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Cpu className="w-5 h-5 text-[#5B4BFF]" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{model}</span>
                    </div>
                    {aiModel === model && <Check className="w-4 h-4 text-[#5B4BFF]" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 4: PRIVACY */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Privacy & Telemetry</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage data collection and IEEE paper privacy.</p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">Anonymous Telemetry</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Share anonymous diagnostic logs to improve accuracy.</p>
                </div>
                <button onClick={() => setPrivacyTelemetry(!privacyTelemetry)} className="text-[#5B4BFF]">
                  {privacyTelemetry ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8 text-slate-400" />}
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: ACCOUNT & STORAGE */}
          {activeSection === 'account' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Account & Cloud Storage</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Manage storage limits and account credentials.</p>
              </div>

              <div className="p-4 rounded-[18px] bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-3">
                <div className="flex justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                  <span>Cloud Storage Usage</span>
                  <span className="text-[#5B4BFF]">4.2 GB / 50 GB (8.4%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-[#5B4BFF]" style={{ width: '8.4%' }} />
                </div>
              </div>
            </div>
          )}

        </main>

      </div>

    </div>
  );
}
