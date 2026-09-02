import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MedicalDisclaimer from "./components/MedicalDisclaimer";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DonorDashboard from "./pages/DonorDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import BloodBankDashboard from "./pages/BloodBankDashboard";
import RequestMatchingPage from "./pages/RequestMatchingPage";
import AdminDashboard from "./pages/AdminDashboard";
import DemandAnalyticsPage from "./pages/DemandAnalyticsPage";

function MainContent() {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const { user, token, logout, loading } = useAuth();

  // Handle Sign Out cleanly across all components
  const handleLogout = () => {
    logout();
    setActiveTab("auth_login");
    try {
      window.history.pushState(null, "", window.location.pathname);
    } catch (e) {}
  };

  // Protected route enforcement
  useEffect(() => {
    if (loading) return;
    const protectedTabs = ["donor_dashboard", "hospital_dashboard", "blood_bank_dashboard", "admin_dashboard", "request_matching"];
    if (protectedTabs.includes(activeTab)) {
      if (!user || !token) {
        setActiveTab("auth_login");
        try {
          window.history.replaceState(null, "", window.location.pathname);
        } catch (e) {}
      } else {
        // Enforce role-based authorization
        if (activeTab === "donor_dashboard" && user.role !== "DONOR") {
          setActiveTab("auth_login");
        } else if (activeTab === "hospital_dashboard" && user.role !== "HOSPITAL") {
          setActiveTab("auth_login");
        } else if (activeTab === "blood_bank_dashboard" && user.role !== "BLOOD_BANK") {
          setActiveTab("auth_login");
        } else if (activeTab === "admin_dashboard" && user.role !== "ADMIN") {
          setActiveTab("auth_login");
        }
      }
    }
  }, [user, token, activeTab, loading]);

  // Prevent browser back navigation from opening protected dashboards after logout
  useEffect(() => {
    const handlePopState = () => {
      const protectedTabs = ["donor_dashboard", "hospital_dashboard", "blood_bank_dashboard", "admin_dashboard", "request_matching"];
      if (!user || !token) {
        if (protectedTabs.includes(activeTab)) {
          setActiveTab("auth_login");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [user, token, activeTab]);

  const handleSelectRequestForMatching = (reqId) => {
    setSelectedRequestId(reqId);
    setActiveTab("request_matching");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Banner Medical Disclaimer */}
      <MedicalDisclaimer />

      {/* Navigation Header */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Page Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === "home" && <LandingPage setActiveTab={setActiveTab} />}

        {activeTab === "auth_login" && <AuthPage initialMode="login" setActiveTab={setActiveTab} />}
        {activeTab === "auth_register" && <AuthPage initialMode="register" setActiveTab={setActiveTab} />}

        {activeTab === "donor_dashboard" && (user && token ? <DonorDashboard onLogout={handleLogout} /> : <AuthPage initialMode="login" setActiveTab={setActiveTab} />)}

        {activeTab === "hospital_dashboard" && (user && token ? (
          <HospitalDashboard onLogout={handleLogout} onSelectRequestForMatching={handleSelectRequestForMatching} />
        ) : <AuthPage initialMode="login" setActiveTab={setActiveTab} />)}

        {activeTab === "blood_bank_dashboard" && (user && token ? (
          <BloodBankDashboard onLogout={handleLogout} />
        ) : <AuthPage initialMode="login" setActiveTab={setActiveTab} />)}

        {activeTab === "request_matching" && (user && token ? (
          <RequestMatchingPage
            requestId={selectedRequestId}
            onBack={() => setActiveTab("hospital_dashboard")}
          />
        ) : <AuthPage initialMode="login" setActiveTab={setActiveTab} />)}

        {activeTab === "admin_dashboard" && (user && token ? <AdminDashboard onLogout={handleLogout} /> : <AuthPage initialMode="login" setActiveTab={setActiveTab} />)}

        {activeTab === "demand_analytics" && <DemandAnalyticsPage />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2 text-xs text-slate-500">
          <div className="font-bold text-slate-700">
            BloodBridge AI &copy; 2026 – Intelligent Blood Donor Matching & Emergency Response
          </div>
          <p className="max-w-2xl mx-auto text-[11px] text-slate-400">
            BloodBridge AI does not replace professional medical judgment. All blood cross-matching, donor eligibility verification, and clinical transfusion procedures must be confirmed by authorized medical staff.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
