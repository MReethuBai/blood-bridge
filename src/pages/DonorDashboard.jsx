import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { HeartPulse, Bell, CheckCircle2, XCircle, Clock, MapPin, Calendar, Activity, AlertTriangle, LogOut } from "lucide-react";

export default function DonorDashboard({ onLogout }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const fetchDonorData = async () => {
    try {
      const p = await api.getDonorProfile();
      setProfile(p);
      const n = await api.getDonorNotifications();
      setNotifications(n);
    } catch (err) {
      console.error("Failed to load donor data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const toggleAvailability = async () => {
    if (!profile) return;
    const newStatus = !profile.is_available;
    try {
      await api.updateDonorProfile({ is_available: newStatus });
      setProfile({ ...profile, is_available: newStatus });
      setActionMessage(`Status updated to ${newStatus ? "AVAILABLE 🟢" : "UNAVAILABLE 🔴"}`);
      setTimeout(() => setActionMessage(""), 3000);
    } catch (err) {
      alert("Failed to update availability");
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await api.respondToRequest(requestId, action);
      setActionMessage(`Successfully ${action.toLowerCase()}ed blood request.`);
      fetchDonorData();
      setTimeout(() => setActionMessage(""), 4000);
    } catch (err) {
      alert("Failed to respond to request: " + err.message);
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm font-medium">Loading Donor Dashboard...</div>;
  }

  const isEligible = profile?.last_donation_date ? 
    (new Date() - new Date(profile.last_donation_date)) / (1000 * 60 * 60 * 24) >= 56 : true;

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <HeartPulse className="w-3.5 h-3.5" /> Donor Code: {profile?.donor_code || "D001"}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Welcome, {user?.name || "Donor"}</h1>
          <p className="text-red-100 text-sm">
            Location: {profile?.city || "Bangalore"} &bull; Last Donated: {profile?.last_donation_date || "N/A"}
          </p>
        </div>

        {/* Right Header Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Toggle Switch */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-4">
            <div>
              <div className="text-xs text-red-100 font-semibold uppercase">Callout Availability</div>
              <div className="text-lg font-bold">
                {profile?.is_available ? "🟢 Available for Calls" : "🔴 Marked Unavailable"}
              </div>
            </div>
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                profile?.is_available 
                  ? "bg-white text-red-600 hover:bg-red-50" 
                  : "bg-red-500 text-white hover:bg-red-400"
              }`}
            >
              {profile?.is_available ? "Set Unavailable" : "Set Available"}
            </button>
          </div>

          <button
            onClick={handleSignOut}
            className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-2xl backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs font-bold text-emerald-800 text-center animate-fade-in">
          {actionMessage}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Blood Group</div>
          <div className="text-3xl font-black text-red-600 mt-1">{profile?.blood_group || "O+"}</div>
          <div className="text-[11px] text-slate-400 mt-1">ABO / Rh Tested</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Eligibility Status</div>
          <div className={`text-lg font-extrabold mt-1 ${isEligible ? "text-emerald-600" : "text-amber-600"}`}>
            {isEligible ? "Eligible to Donate" : "Rest Period Active"}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Minimum 56 days between red cell donations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Response Rate</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{profile?.response_rate || 95}%</div>
          <div className="text-[11px] text-slate-400 mt-1">Emergency accept history</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-500 uppercase">Total Donations</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">{profile?.total_donations || 6}</div>
          <div className="text-[11px] text-slate-400 mt-1">Lives impacted</div>
        </div>
      </div>

      {/* Emergency Notifications / Request Inbox */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-slate-900">Incoming Emergency Requests</h2>
          </div>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">
            {notifications.filter(n => n.status === "PENDING").length} Action Needed
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs font-medium">
            No active emergency blood requests at your location right now.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif._id} 
                className={`p-5 rounded-2xl border transition-all ${
                  notif.priority === "CRITICAL" ? "bg-red-50/50 border-red-200" : "bg-slate-50 border-slate-200"
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        notif.priority === "CRITICAL" ? "bg-red-600 text-white animate-pulse" : "bg-amber-500 text-white"
                      }`}>
                        {notif.priority} EMERGENCY
                      </span>
                      <span className="font-bold text-slate-900 text-base">{notif.hospital_name}</span>
                    </div>
                    <p className="text-xs text-slate-600 font-medium">{notif.message}</p>
                    
                    {/* Alert Dispatch Badges */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        📱 SMS Sent: {notif.sms_phone || profile?.phone || "+91 98765 43210"}
                      </span>
                      <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        📧 Email Sent: {notif.email_address || user?.email || "donor@example.com"}
                      </span>
                    </div>

                    {/* Transport Pickup & Drop Service Box */}
                    <div className="mt-2.5 p-3 bg-amber-50/90 border border-amber-200 rounded-xl text-xs space-y-1">
                      <div className="font-extrabold text-amber-950 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          🚖 Free Pickup & Drop Transport Provided
                        </span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 font-black px-2 py-0.5 rounded uppercase">
                          {notif.status === "ACCEPT" || notif.status === "ACCEPTED" ? "EN-ROUTE TO DONOR" : "DISPATCH READY"}
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-900 flex flex-wrap items-center gap-3 pt-0.5">
                        <span>🚘 <strong>Vehicle:</strong> EV Ambulance (KA-01-EA-2026)</span>
                        <span>👨‍✈️ <strong>Driver:</strong> Ramesh Kumar (+91 98450 12345)</span>
                        <span>⏱️ <strong>ETA:</strong> 15 Mins</span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                      <span>🩸 Needed: <strong>{notif.blood_group}</strong></span>
                      <span>📅 Requested: {notif.created_at ? new Date(notif.created_at).toLocaleTimeString() : "Just now"}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0">
                    {notif.status === "PENDING" ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRespond(notif.request_id, "ACCEPT")}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" /> Accept Callout
                        </button>
                        <button
                          onClick={() => handleRespond(notif.request_id, "DECLINE")}
                          className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 font-semibold text-xs border border-red-200 rounded-xl transition-colors cursor-pointer"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 ${
                          notif.status === "ACCEPT" || notif.status === "ACCEPTED" 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}>
                          {notif.status === "ACCEPT" || notif.status === "ACCEPTED" ? "✓ YOU ACCEPTED THIS REQUEST" : "✕ YOU DECLINED THIS REQUEST"}
                        </span>
                        {(notif.status === "DECLINE" || notif.status === "DECLINED") && (
                          <button
                            onClick={() => handleRespond(notif.request_id, "ACCEPT")}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                          >
                            Change to Accept
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
