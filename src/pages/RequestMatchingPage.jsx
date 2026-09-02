import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import DonorMap from "../components/DonorMap";
import { Zap, MapPin, CheckCircle2, AlertTriangle, ArrowLeft, ShieldCheck, Info, Award, UserCheck, Phone, Mail, Car, Send } from "lucide-react";

export default function RequestMatchingPage({ requestId, onBack }) {
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [actionToast, setActionToast] = useState("");

  useEffect(() => {
    if (!requestId) return;
    setLoading(true);
    api.getRequestMatches(requestId)
      .then((data) => {
        setMatchData(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to run AI Donor Matching");
      })
      .finally(() => setLoading(false));
  }, [requestId]);

  const handleSendAlert = async (donor, channel) => {
    try {
      const res = await api.sendDonorAlert({
        donor_id: donor.donor_id,
        phone: donor.phone || "+91 98765 43210",
        email: donor.email || "donor@example.com",
        name: donor.name,
        channel: channel,
        request_id: requestId
      });
      setActionToast(res.message);
      setTimeout(() => setActionToast(""), 4000);
    } catch (err) {
      alert("Failed to send alert: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-sm font-bold text-slate-700">Running AI Multi-Factor Donor Matching Engine...</div>
        <p className="text-xs text-slate-400">Evaluating ABO compatibility, Haversine proximity, eligibility & response rates</p>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="py-12 text-center space-y-4">
        <div className="text-red-600 font-bold text-lg">{error || "No match data available"}</div>
        <button onClick={onBack} className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
          Go Back
        </button>
      </div>
    );
  }

  const { request, matches } = matchData;

  return (
    <div className="space-y-6 py-6">
      
      {/* Action Toast Alert Banner */}
      {actionToast && (
        <div className="bg-emerald-600 text-white p-4 rounded-2xl shadow-lg text-xs font-extrabold flex items-center justify-between animate-fade-in sticky top-20 z-50">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
            <span>{actionToast}</span>
          </div>
          <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">REAL-TIME DISPATCH</span>
        </div>
      )}

      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <button 
          onClick={onBack}
          className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hospital Dashboard
        </button>
        <div className="flex items-center gap-2">
          <span className="bg-red-100 text-red-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            🚨 {request.priority} EMERGENCY MATCHING
          </span>
          <span className="text-xs text-slate-500 font-mono">REQ ID: {request._id}</span>
        </div>
      </div>

      {/* Request Target Summary Box */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="text-xs text-red-200 font-bold uppercase tracking-wider">Active Hospital Broadcast Target</div>
          <h1 className="text-2xl font-extrabold">{request.hospital_name}</h1>
          <p className="text-xs text-red-100 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-red-300" /> Location: <strong>{request.city}</strong> &bull; Contact: <strong>{request.contact_phone}</strong>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-xs shrink-0">
          <div className="text-center border-r border-white/20 pr-4">
            <div className="text-[10px] text-red-100 uppercase font-bold">Required Blood</div>
            <div className="text-2xl font-black">{request.blood_group}</div>
          </div>
          <div className="text-center pr-2">
            <div className="text-[10px] text-red-100 uppercase font-bold">Units Needed</div>
            <div className="text-2xl font-black">{request.units_required} Units</div>
          </div>
        </div>
      </div>

      {/* GIS Proximity Radar Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-600" /> Geographic Proximity Radar ({request.city})
            </h2>
            <p className="text-xs text-slate-500">Live geospatial layout showing ranked donor distance vectors to {request.hospital_name}</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
            📍 {matches.length} Donors Geocoded
          </span>
        </div>
        <DonorMap 
          hospitalLocation={matchData?.hospital_location || { lat: request.lat || 12.9716, lng: request.lng || 77.5946 }}
          matchedDonors={matches}
          hospitalName={request.hospital_name}
        />
      </div>

      {/* AI Ranked Donors List & Transparent Reasoning */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> AI Ranked Donors & Direct Dispatch Controls
            </h2>
            <p className="text-xs text-slate-500">Send direct SMS, Email notifications, and arrange free pickup & drop transport for donors</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
            Top {matches.length} Candidates
          </span>
        </div>

        <div className="space-y-4">
          {matches.map((donor, idx) => (
            <div 
              key={donor.donor_id}
              className={`p-5 rounded-2xl border transition-all ${
                selectedDonor?.donor_id === donor.donor_id
                  ? "border-red-500 bg-red-50/20 shadow-sm"
                  : "border-slate-200 bg-slate-50/50 hover:bg-white"
              }`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Donor Basic Details */}
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-black flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-extrabold text-slate-900 text-base">{donor.name}</span>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded">
                      {donor.donor_code}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                      {donor.blood_group}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex flex-wrap items-center gap-3 pt-1">
                    <span>📍 <strong>{donor.distance_km} km</strong> away</span>
                    <span>🟢 Status: <strong>{donor.is_available ? "Available" : "Unavailable"}</strong></span>
                    <span>📱 Mobile: <strong>{donor.phone || "+91 98765 43210"}</strong></span>
                    <span>📧 Email: <strong>{donor.email || "donor@example.com"}</strong></span>
                  </div>

                  {/* Direct Contact & Transport Dispatch Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSendAlert(donor, "SMS")}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Send direct SMS to donor's mobile number"
                    >
                      <Phone className="w-3.5 h-3.5" /> Send SMS Alert ({donor.phone || "+91 98765 43210"})
                    </button>
                    
                    <button
                      onClick={() => handleSendAlert(donor, "EMAIL")}
                      className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Send official emergency notification email"
                    >
                      <Mail className="w-3.5 h-3.5" /> Send Email Alert
                    </button>

                    <button
                      onClick={() => handleSendAlert(donor, "TRANSPORT")}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Dispatch Free Emergency Pickup & Drop Transport Vehicle"
                    >
                      <Car className="w-3.5 h-3.5" /> Dispatch Pickup & Drop Vehicle
                    </button>
                  </div>
                </div>

                {/* Score & Reasons Toggle */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 font-extrabold uppercase">Suitability Score</div>
                    <div className={`text-2xl font-black ${
                      donor.suitability_score >= 80 ? "text-emerald-600" :
                      donor.suitability_score >= 60 ? "text-amber-600" : "text-slate-600"
                    }`}>
                      {donor.suitability_score} <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedDonor(selectedDonor?.donor_id === donor.donor_id ? null : donor)}
                    className="px-3.5 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {selectedDonor?.donor_id === donor.donor_id ? "Hide Breakdown" : "Why Ranked High?"}
                  </button>
                </div>

              </div>

              {/* Transparent AI Suitability Explanation Box */}
              {selectedDonor?.donor_id === donor.donor_id && (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-white p-4 rounded-xl space-y-3">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-500" /> Transparent AI Score Breakdown for {donor.name}:
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {donor.reasons.map((reason, i) => (
                      <div key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-slate-700 font-medium">{reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
