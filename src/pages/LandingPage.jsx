import React from "react";
import { HeartPulse, Shield, Zap, MapPin, Award, ArrowRight, CheckCircle2, AlertTriangle, Users, Building2, BarChart3 } from "lucide-react";

export default function LandingPage({ setActiveTab }) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-red-50/70 via-white to-white rounded-3xl p-8 sm:p-12 border border-red-100 shadow-xs">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5" /> Next-Gen Emergency Healthcare
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Intelligent Blood Donor Matching & Emergency Response
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            BloodBridge AI instantly connects verified emergency hospitals with nearby compatible blood donors using a transparent multi-factor AI scoring algorithm and real-time geocoded maps.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => setActiveTab("auth_login")}
              className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              Access Portal <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("demand_analytics")}
              className="px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold rounded-xl shadow-xs flex items-center gap-2 transition-all"
            >
              <BarChart3 className="w-4 h-4 text-red-500" /> View AI Demand Forecast
            </button>
          </div>
        </div>

        {/* Live Stat Badges */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-200/80">
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-slate-900">5,000+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Verified Donors</div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-red-600">50+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Partner Hospitals</div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-emerald-600">&lt; 3.2 km</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Avg Donor Proximity</div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-100">
            <div className="text-2xl font-black text-indigo-600">98.4%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">Match Accuracy</div>
          </div>
        </div>
      </section>

      {/* Quick Access Demo Credentials Section */}
      <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-3 mb-8">
          <span className="text-xs font-extrabold uppercase text-red-400 tracking-wider">Instant Test Drive</span>
          <h2 className="text-2xl sm:text-3xl font-bold">Try BloodBridge AI with Demo Roles</h2>
          <p className="text-slate-400 text-sm">
            Select a pre-seeded account role below to test the full emergency workflow immediately.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Verified Hospital Card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base">Verified Hospital</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">VERIFIED</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Metro General Emergency Hospital. Create CRITICAL blood requests & view AI matches.</p>
            <button
              onClick={() => setActiveTab("auth_login")}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Login as Hospital
            </button>
          </div>

          {/* Active Donor Card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mb-4">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base">Active Donor</h3>
              <span className="bg-red-500/20 text-red-300 text-[10px] font-bold px-2 py-0.5 rounded">BLOOD: O+</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Demo Donor D001 (Alex Taylor). Receive emergency requests & click Accept.</p>
            <button
              onClick={() => setActiveTab("auth_login")}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Login as Donor
            </button>
          </div>

          {/* System Admin Card */}
          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 hover:border-red-500/50 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-base">System Admin</h3>
              <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">CHIEF ADMIN</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">Review pending hospital registrations, verify/reject, & seed demo data.</p>
            <button
              onClick={() => setActiveTab("auth_login")}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg text-xs transition-colors"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </section>

      {/* How AI Ranking Engine Works */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Transparent Multi-Factor AI</span>
          <h2 className="text-3xl font-extrabold text-slate-900">How AI Ranks Compatible Donors</h2>
          <p className="text-slate-600 text-sm">
            During critical medical emergencies, every minute counts. Our algorithm ranks eligible donors on a transparent 0–100 suitability scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-600 font-extrabold text-lg">35%</div>
            <h3 className="font-bold text-sm text-slate-900">ABO/Rh Match</h3>
            <p className="text-xs text-slate-500">Exact match (O+ → O+) gets 35 pts; compatible universal (O- → O+) gets 28 pts.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-600 font-extrabold text-lg">30%</div>
            <h3 className="font-bold text-sm text-slate-900">Proximity Distance</h3>
            <p className="text-xs text-slate-500">Calculates Haversine distance in km. Nearby donors (&lt;5km) receive top proximity scores.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-600 font-extrabold text-lg">15%</div>
            <h3 className="font-bold text-sm text-slate-900">Live Availability</h3>
            <p className="text-xs text-slate-500">Filters donors with active toggle state set to Available for callouts.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-600 font-extrabold text-lg">10%</div>
            <h3 className="font-bold text-sm text-slate-900">56-Day Eligibility</h3>
            <p className="text-xs text-slate-500">Enforces medical minimum 56 days rest period since last blood donation.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="text-red-600 font-extrabold text-lg">10%</div>
            <h3 className="font-bold text-sm text-slate-900">Response History</h3>
            <p className="text-xs text-slate-500">Rewards donors with high historic acceptance rates for emergency requests.</p>
          </div>
        </div>
      </section>

      {/* Complete Workflow Overview */}
      <section className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
        <h3 className="text-xl font-extrabold text-slate-900 mb-6 text-center">Emergency Request Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-center">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">1</div>
            <div className="text-xs font-bold text-slate-900">Hospital Request</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified hospital creates CRITICAL request</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">2</div>
            <div className="text-xs font-bold text-slate-900">AI Donor Ranking</div>
            <div className="text-[11px] text-slate-500 mt-1">Calculates 0-100 suitability scores</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">3</div>
            <div className="text-xs font-bold text-slate-900">Map Visualization</div>
            <div className="text-[11px] text-slate-500 mt-1">Hospital views donor map & distance</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">4</div>
            <div className="text-xs font-bold text-slate-900">Donor Notification</div>
            <div className="text-[11px] text-slate-500 mt-1">Donor gets alert with hospital location</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">5</div>
            <div className="text-xs font-bold text-slate-900">Donor Accepts</div>
            <div className="text-[11px] text-slate-500 mt-1">Donor clicks ACCEPT in dashboard</div>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-extrabold text-sm flex items-center justify-center mx-auto mb-2">6</div>
            <div className="text-xs font-bold text-emerald-800">DONOR ACCEPTED</div>
            <div className="text-[11px] text-slate-500 mt-1">Hospital receives response & dispatches</div>
          </div>
        </div>
      </section>
    </div>
  );
}
