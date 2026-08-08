import React, { useState, useEffect } from 'react';
import { 
  UserCheck, AlertCircle, Send, CheckCircle2, Clock, MapPin, 
  ShieldAlert, RefreshCw, Activity, ArrowRight, Building2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createBloodRequest, fetchRequests } from '../services/api';

export default function ReceiverDashboard({ onOpenAadhaarModal }) {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form
  const [bloodGroup, setBloodGroup] = useState('B+');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [urgency, setUrgency] = useState('critical');
  const [notes, setNotes] = useState('Urgent accident surgery requirement');

  useEffect(() => {
    loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);
    try {
      const data = await fetchRequests();
      setRequests(data || []);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await createBloodRequest({
        bloodGroup,
        unitsNeeded,
        urgency,
        notes
      });
      showMessage(res.message, 'success');
      loadRequests();
    } catch (err) {
      showMessage(err.message || 'Failed to create request', 'error');
    }
  };

  function showMessage(text, type = 'info') {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-slate-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold">Patient / Attendant Emergency Portal</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Receiver Role
            </span>
          </div>
          <p className="text-xs text-amber-200">
            Every request auto-attaches to nearest hospital for medical clinical validation before going live.
          </p>
        </div>

        <button
          onClick={onOpenAadhaarModal}
          className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 text-xs font-bold transition flex items-center space-x-1.5"
        >
          <UserCheck className="w-4 h-4 text-amber-400" />
          <span>Aadhaar Verified (XXXX-{user?.aadharLast4 || '7777'})</span>
        </button>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl text-sm font-medium border flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
            : 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (1 Col): Raise Request Wizard */}
        <div className="space-y-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center space-x-2">
              <Send className="w-5 h-5 text-amber-600" />
              <span>Raise Patient Blood Request</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Automatically attached to City General Hospital (Nearest Node)</p>

            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Guardrail:</strong> Self-reported unattached requests are safety risks and are prohibited. Your request will be validated by hospital medical staff.
              </span>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group Required</label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Units Needed</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency Urgency</label>
                <div className="grid grid-cols-3 gap-2">
                  {['critical', 'high', 'normal'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition border ${
                        urgency === u
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Diagnosis / Notes</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs transition shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2"
              >
                <span>Submit & Auto-Attach Request</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Right Column (2 Cols): Live Request Tracking & Cascade Stepper */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <span>Real-Time Request Matching Tracker</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Live progress across Tier 0 $\rightarrow$ Tier 1 $\rightarrow$ Tier 2 matching cascade</p>
              </div>
              <button onClick={loadRequests} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {requests.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                No active requests raised yet. Submit a request using the form to track live progress.
              </div>
            ) : (
              <div className="space-y-6">
                {requests.map((r) => (
                  <div key={r._id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 rounded-xl bg-red-600 text-white font-black text-sm">{r.bloodGroup}</span>
                          <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">{r.notes || 'Emergency Blood Request'}</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 uppercase">{r.urgency}</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Attached Hospital: <strong className="text-slate-800 dark:text-slate-200">{r.hospitalId?.name || 'City General Hospital'}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-black text-slate-900 dark:text-slate-100">{r.unitsFulfilled} / {r.unitsNeeded}</span>
                        <div className="text-[10px] text-slate-400">Units Fulfilled</div>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                      
                      <div className="space-y-1">
                        <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Attached</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Clinical Validated</div>
                      </div>

                      <div className="space-y-1">
                        <div className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 ${
                          ['matching', 'partially_fulfilled', 'fulfilled'].includes(r.status)
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Tier 1 H2H</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Hospital Transfers</div>
                      </div>

                      <div className="space-y-1">
                        <div className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 ${
                          ['matching', 'partially_fulfilled', 'fulfilled'].includes(r.status)
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Tier 2 Donors</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Individual Fallback</div>
                      </div>

                      <div className="space-y-1">
                        <div className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center space-x-1 ${
                          r.status === 'fulfilled'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Fulfilled</span>
                        </div>
                        <div className="text-[10px] text-slate-400">Completed</div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
