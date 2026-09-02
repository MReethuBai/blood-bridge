import React from "react";
import { useAuth } from "../context/AuthContext";
import { HeartPulse, Shield, Building2, User, Activity, LogOut, BarChart3, MapPin } from "lucide-react";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    setActiveTab("auth_login");
    try {
      window.history.pushState(null, "", window.location.pathname);
    } catch (e) {}
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab("home")} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200 group-hover:scale-105 transition-transform">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">BloodBridge</span>
                <span className="bg-red-100 text-red-700 text-xs font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider">AI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">Emergency Matching & Response</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab("home")}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === "home" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              Overview
            </button>

            {user?.role === "DONOR" && (
              <button
                onClick={() => setActiveTab("donor_dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "donor_dashboard" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <User className="w-4 h-4" />
                Donor Dashboard
              </button>
            )}

            {user?.role === "HOSPITAL" && (
              <button
                onClick={() => setActiveTab("hospital_dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "hospital_dashboard" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <Building2 className="w-4 h-4" />
                Hospital Requests
              </button>
            )}

            {user?.role === "BLOOD_BANK" && (
              <button
                onClick={() => setActiveTab("blood_bank_dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "blood_bank_dashboard" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <Building2 className="w-4 h-4 text-emerald-600" />
                Blood Bank Hub
              </button>
            )}

            {user?.role === "ADMIN" && (
              <button
                onClick={() => setActiveTab("admin_dashboard")}
                className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "admin_dashboard" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
              >
                <Shield className="w-4 h-4" />
                Admin Portal
              </button>
            )}

            <button
              onClick={() => setActiveTab("demand_analytics")}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "demand_analytics" ? "bg-red-50 text-red-600 font-semibold" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              <BarChart3 className="w-4 h-4 text-red-500" />
              AI Demand Forecast
            </button>
          </nav>

          {/* User Section & Action Buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-900">{user.name}</div>
                  <span className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    user.role === "HOSPITAL" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign Out"
                  className="px-3 py-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all font-semibold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("auth_login")}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab("auth_register")}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm shadow-red-200 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
