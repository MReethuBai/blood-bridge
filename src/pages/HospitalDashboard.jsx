import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Building2, PlusCircle, AlertTriangle, CheckCircle2, Clock, MapPin, Zap, ArrowRight, ShieldCheck, Phone, LogOut } from "lucide-react";

export default function HospitalDashboard({ onSelectRequestForMatching, onLogout }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  // New Request Form state
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [units, setUnits] = useState(3);
  const [priority, setPriority] = useState("CRITICAL");
  const [notes, setNotes] = useState("");
  const [arrangeTransport, setArrangeTransport] = useState(true);

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchHospitalData = async () => {
    try {
      const p = await api.getHospitalProfile();
      setProfile(p);
      const reqs = await api.getHospitalRequests();
      setRequests(reqs);
    } catch (err) {
      console.error("Failed to fetch hospital data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleVerifySelf = async () => {
    try {
      await api.verifyHospitalSelf();
      fetchHospitalData();
    } catch (err) {
      setError("Failed to verify hospital: " + err.message);
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (profile?.status !== "VERIFIED") {
      setError("Only VERIFIED hospitals can create emergency requests. Please click '1-Click Verify Hospital' to activate this demo account.");
      return;
    }

    setCreating(true);
    try {
      const res = await api.createEmergencyRequest({
        blood_group: bloodGroup,
        units_required: units,
        priority: priority,
        notes: notes,
        arrange_transport: arrangeTransport
      });

      setSuccess("Emergency Blood Request Broadcasted! SMS & Email alerts sent to donors and Free Pickup & Drop Vehicle Dispatched.");
      setNotes("");
      await fetchHospitalData();
      
      const reqId = res.request?._id || res.request?.id;
      if (reqId && onSelectRequestForMatching) {
        onSelectRequestForMatching(reqId);
      }

    } catch (err) {
      setError(err.message || "Failed to create emergency request");
    } finally {
      setCreating(false);
    }
  };

  const handleFulfill = async (reqId) => {
    try {
      await api.fulfillRequest(reqId);
      fetchHospitalData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm font-medium">Loading Hospital Dashboard...</div>;
  }

  const isVerified = profile?.status === "VERIFIED";

  return (
    <div className="space-y-8 py-6">
      
      {/* Hospital Header & Verification Badge */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-black uppercase px-2.5 py-1 rounded-md flex items-center gap-1 ${
              isVerified ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
            }`}>
              {isVerified ? <ShieldCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
              {profile?.status || "PENDING"}
            </span>
            <span className="text-xs text-slate-400 font-mono">Reg ID: {profile?.registration_id || "HOSP-BLR-99201"}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{profile?.hospital_name || "Emergency Hospital"}</h1>
          <p className="text-xs text-slate-500 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile?.address || "Medical District"}, {profile?.city || "Bangalore"}
            &bull; <Phone className="w-3.5 h-3.5 text-slate-400" /> {profile?.phone || "+91 80 2555 0100"}
          </p>
        </div>

        {/* Right Header Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Verification Banner Notice */}
          {!isVerified && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl max-w-md text-xs text-amber-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Registration Pending Verification
              </div>
              <p className="text-slate-600">
                Only verified medical centers can issue emergency blood broadcasts. Click below to verify this hospital for testing.
              </p>
              <button
                onClick={handleVerifySelf}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" /> 1-Click Verify Hospital (Demo Mode)
              </button>
            </div>
          )}

          <button
            onClick={handleSignOut}
            className="px-4 py-2.5 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-bold text-xs rounded-2xl border border-slate-200 hover:border-red-200 flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Create Request Form Wizard (1 Column) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 h-fit">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <PlusCircle className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-extrabold text-slate-900">Create Emergency Blood Request</h2>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl text-xs text-red-700 font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-bold">
              {success}
            </div>
          )}

          <form onSubmit={handleCreateRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Required Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-red-600 bg-white focus:ring-2 focus:ring-red-500 outline-none"
              >
                {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map(bg => (
                  <option key={bg} value={bg}>{bg} {bg === "O-" ? "(Universal)" : ""}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={units}
                  onChange={(e) => setUnits(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none"
                >
                  <option value="CRITICAL">🔴 CRITICAL</option>
                  <option value="HIGH">🟠 HIGH</option>
                  <option value="MEDIUM">🟡 MEDIUM</option>
                  <option value="LOW">🔵 LOW</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Surgeon / Ward Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Urgent trauma surgery requirement..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>

            {/* Transport Logistics Service Option */}
            <div className="bg-amber-50/80 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5">
              <input
                type="checkbox"
                id="arrange_transport"
                checked={arrangeTransport}
                onChange={(e) => setArrangeTransport(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-amber-300 cursor-pointer"
              />
              <label htmlFor="arrange_transport" className="text-xs cursor-pointer">
                <span className="font-extrabold text-amber-950 flex items-center gap-1">
                  🚖 Arrange Free Pickup & Drop Transport Service
                </span>
                <span className="text-[11px] text-amber-800 font-medium block">
                  Automatically dispatch a free emergency cab / EV ambulance to pick up the donor & return them after donation.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={creating || !isVerified}
              className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all ${
                isVerified 
                  ? "bg-red-600 hover:bg-red-700 shadow-red-200 cursor-pointer" 
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              <Zap className="w-4 h-4" />
              {creating ? "Running AI Donor Match..." : "Broadcast Emergency Request"}
            </button>
          </form>
        </div>

        {/* Request Tracking & Active Emergency List (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-lg font-extrabold text-slate-900">Hospital Emergency Request History</h2>
            <span className="text-xs text-slate-500 font-medium">Total: {requests.length} Requests</span>
          </div>

          {requests.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No emergency blood requests created yet. Use the form to broadcast a request.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div 
                  key={req._id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-red-200 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        req.priority === "CRITICAL" ? "bg-red-600 text-white animate-pulse" : "bg-amber-500 text-white"
                      }`}>
                        {req.priority}
                      </span>
                      <span className="text-xl font-black text-red-600">{req.blood_group}</span>
                      <span className="text-xs font-bold text-slate-700">({req.units_required} Units)</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        req.status === "DONOR_ACCEPTED" ? "bg-emerald-100 text-emerald-800 border border-emerald-300" :
                        req.status === "FULFILLED" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {req.status === "DONOR_ACCEPTED" ? "🟢 DONOR ACCEPTED" : req.status}
                      </span>
                    </div>
                  </div>

                  {req.status === "DONOR_ACCEPTED" && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 font-medium">
                      🎉 <strong>Matched Donor Accepted:</strong> {req.accepted_donor_name || "Verified Donor"} (Phone: {req.accepted_donor_phone || "+91 98765 43210"})
                    </div>
                  )}

                  <p className="text-xs text-slate-600 font-medium">{req.notes || "No notes attached."}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-slate-400">Created: {new Date(req.created_at).toLocaleString()}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectRequestForMatching(req._id)}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Zap className="w-3.5 h-3.5" /> View AI Matched Donors
                      </button>

                      {req.status !== "FULFILLED" && (
                        <button
                          onClick={() => handleFulfill(req._id)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          Mark FULFILLED
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
