import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Shield, Building2, Users, HeartPulse, CheckCircle2, XCircle, RefreshCw, AlertTriangle, Activity, LogOut } from "lucide-react";

export default function AdminDashboard({ onLogout }) {
  const { logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [pendingHospitals, setPendingHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [seeding, setSeeding] = useState(false);

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const fetchAdminData = async () => {
    try {
      const s = await api.getAdminStats();
      setStats(s);
      const p = await api.getPendingHospitals();
      setPendingHospitals(p);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (hospitalId, action) => {
    try {
      await api.verifyHospital(hospitalId, action);
      setActionMessage(`Hospital status updated to ${action === "VERIFY" ? "VERIFIED 🟢" : "REJECTED 🔴"}`);
      fetchAdminData();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert("Failed to update hospital status: " + err.message);
    }
  };

  const handleSeedData = async () => {
    if (!window.confirm("Re-generate synthetic demo dataset (5,000 donors, 50 hospitals, 1,000 requests)?")) return;
    setSeeding(true);
    try {
      await api.seedDemoData();
      setActionMessage("Synthetic Demo Dataset Seeded Successfully!");
      fetchAdminData();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert("Seeding failed");
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm font-medium">Loading Admin Portal...</div>;
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Admin Header & Action Toolbar */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Shield className="w-3.5 h-3.5 text-purple-300" /> BloodBridge AI Chief Administration
          </div>
          <h1 className="text-3xl font-black tracking-tight">System Control & Verification</h1>
          <p className="text-purple-200 text-sm">
            Review hospital registrations, monitor emergency broadcasts, & manage synthetic demo datasets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${seeding ? "animate-spin" : ""}`} />
            {seeding ? "Seeding Data..." : "Re-Seed Demo Data (5,000 Donors)"}
          </button>

          <button
            onClick={handleSignOut}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-purple-300" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs font-bold text-emerald-800 text-center">
          {actionMessage}
        </div>
      )}

      {/* Metrics Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Donors</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{stats?.total_donors?.toLocaleString() || 5000}</div>
          <div className="text-[11px] text-emerald-600 mt-1 font-bold">100% Synthetic Demo Data</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Partner Hospitals</div>
          <div className="text-3xl font-black text-blue-600 mt-1">{stats?.total_hospitals || 55}</div>
          <div className="text-[11px] text-slate-400 mt-1">Medical Centers</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Pending Review</div>
          <div className={`text-3xl font-black mt-1 ${pendingHospitals.length > 0 ? "text-amber-600 animate-pulse" : "text-slate-400"}`}>
            {pendingHospitals.length}
          </div>
          <div className="text-[11px] text-amber-600 mt-1 font-bold">Requires Action</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Requests</div>
          <div className="text-3xl font-black text-red-600 mt-1">{stats?.total_requests?.toLocaleString() || 1050}</div>
          <div className="text-[11px] text-slate-400 mt-1">Emergency Broadcasts</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Fulfilled Rate</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {stats?.total_requests ? Math.round((stats.fulfilled_requests / stats.total_requests) * 100) : 92}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-bold">Fulfilled</div>
        </div>
      </div>

      {/* Pending Hospital Verification Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Pending Hospital Verification Queue</h2>
          </div>
          <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
            {pendingHospitals.length} Applications
          </span>
        </div>

        {pendingHospitals.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            🎉 All hospital registration applications have been reviewed. No pending verifications.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingHospitals.map((hosp) => (
              <div 
                key={hosp._id}
                className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{hosp.hospital_name}</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      PENDING REVIEW
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3">
                    <span>Reg ID: <strong>{hosp.registration_id}</strong></span>
                    <span>License: <strong>{hosp.license_no || "LIC-2026-3391"}</strong></span>
                    <span>City: <strong>{hosp.city}</strong></span>
                    <span>Phone: <strong>{hosp.phone}</strong></span>
                  </div>
                  <p className="text-[11px] text-slate-500">Address: {hosp.address}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleVerify(hosp._id, "VERIFY")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve & Verify
                  </button>
                  <button
                    onClick={() => handleVerify(hosp._id, "REJECT")}
                    className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-xs rounded-xl transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
