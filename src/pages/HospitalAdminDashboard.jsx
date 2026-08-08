import React, { useState, useEffect } from 'react';
import { 
  Building2, Package, ArrowUpRight, AlertTriangle, Plus, RefreshCw, 
  CheckCircle2, Clock, MapPin, Send, ShieldCheck, HeartHandshake, UserCheck 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchCurrentUser, updateInventory, fetchHospitalTransfers, 
  acceptTransferApi, createBloodRequest, fetchRequests, confirmWalkInDonationApi 
} from '../services/api';

export default function HospitalAdminDashboard({ onOpenLicenseModal }) {
  const { hospital, notifications, removeNotification } = useAuth();
  const [inventory, setInventory] = useState(hospital?.inventory || []);
  const [transfers, setTransfers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Form states
  const [selectedGroup, setSelectedGroup] = useState('B+');
  const [unitCount, setUnitCount] = useState(2);
  const [urgency, setUrgency] = useState('critical');
  const [requestNotes, setRequestNotes] = useState('Emergency surgery requirement');

  // Walk-in donation state
  const [walkInRequestId, setWalkInRequestId] = useState('');
  const [walkInDonorId, setWalkInDonorId] = useState('');
  const [walkInUnits, setWalkInUnits] = useState(1);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoading(true);
    try {
      const res = await fetchCurrentUser();
      if (res.hospital) {
        setInventory(res.hospital.inventory || []);
      }
      const tData = await fetchHospitalTransfers();
      setTransfers(tData || []);
      const reqData = await fetchRequests();
      setRequests(reqData || []);
    } catch (err) {
      console.error('Error loading dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStockAdjust = async (bloodGroup, currentUnits, delta) => {
    const newUnits = Math.max(0, currentUnits + delta);
    try {
      const res = await updateInventory(bloodGroup, delta, delta > 0 ? 'add' : 'subtract');
      setInventory(res.inventory);
      showMessage(`Updated ${bloodGroup} stock to ${newUnits} units.`, 'success');
    } catch (err) {
      showMessage(err.message || 'Failed to adjust stock', 'error');
    }
  };

  const handleAcceptTransfer = async (transferId) => {
    try {
      const res = await acceptTransferApi(transferId);
      showMessage(res.message, 'success');
      loadDashboardData();
    } catch (err) {
      showMessage(err.message || 'Failed to accept transfer', 'error');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await createBloodRequest({
        bloodGroup: selectedGroup,
        unitsNeeded: unitCount,
        urgency,
        notes: requestNotes
      });
      showMessage(res.message, 'success');
      loadDashboardData();
    } catch (err) {
      showMessage(err.message || 'Failed to create request', 'error');
    }
  };

  const handleConfirmWalkIn = async (e) => {
    e.preventDefault();
    if (!walkInRequestId || !walkInDonorId) {
      showMessage('Request ID and Donor User ID are required.', 'error');
      return;
    }
    try {
      const res = await confirmWalkInDonationApi(walkInRequestId, walkInDonorId, null, walkInUnits);
      showMessage(res.message, 'success');
      setWalkInRequestId('');
      setWalkInDonorId('');
      loadDashboardData();
    } catch (err) {
      showMessage(err.message || 'Failed to confirm walk-in', 'error');
    }
  };

  function showMessage(text, type = 'info') {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">{hospital?.name || 'Hospital Admin Control Node'}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Verified Node</span>
            </span>
          </div>
          <p className="text-xs text-slate-300 flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-blue-400 inline" />
            <span>License: <code className="font-mono text-blue-200">{hospital?.licenseNumber || 'LIC-2026-10001'}</code></span>
            <span>•</span>
            <span>Govt Reg: <code className="font-mono text-blue-200">{hospital?.govtRegId || 'KA-GOVT-001'}</code></span>
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenLicenseModal}
            className="px-3.5 py-2 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 text-xs font-semibold transition"
          >
            Check License Details
          </button>
          <button
            onClick={loadDashboardData}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
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
        
        {/* Left Column (2 Cols): Live Stock Grid & H2H Transfers */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Inventory Stock Grid */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-red-600" />
                  <span>Hospital Blood Bank Inventory</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Guarded atomic inventory management</p>
              </div>
              <span className="text-xs font-semibold text-slate-400">8 Blood Types Tracked</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {bloodGroups.map((group) => {
                const item = inventory.find(inv => inv.bloodGroup === group);
                const units = item ? item.units : 0;

                let badgeColor = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300';
                if (units === 0) badgeColor = 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300';
                else if (units <= 3) badgeColor = 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300';

                return (
                  <div 
                    key={group} 
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{group}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${badgeColor}`}>
                        {units === 0 ? 'Out of Stock' : (units <= 3 ? 'Low Stock' : 'Sufficient')}
                      </span>
                    </div>

                    <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                      {units} <span className="text-xs font-normal text-slate-500">units</span>
                    </div>

                    <div className="flex items-center space-x-1 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                      <button
                        onClick={() => handleStockAdjust(group, units, -1)}
                        disabled={units <= 0}
                        className="flex-1 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition disabled:opacity-30"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => handleStockAdjust(group, units, +1)}
                        className="flex-1 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
                      >
                        +1
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incoming H2H Transfer Alerts & History */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <ArrowUpRight className="w-5 h-5 text-blue-600" />
                  <span>Tier 1 Hospital-to-Hospital (H2H) Transfers</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Direct hospital stock transfer requests</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                {transfers.length} Transfers
              </span>
            </div>

            {transfers.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active hospital-to-hospital transfer requests at this moment.
              </div>
            ) : (
              <div className="space-y-3">
                {transfers.map((t) => {
                  const isIncomingSupplier = t.fromHospitalId?._id === hospital?._id;
                  const isRequested = t.status === 'requested';

                  return (
                    <div 
                      key={t._id} 
                      className={`p-4 rounded-2xl border ${
                        isRequested && isIncomingSupplier
                          ? 'border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'
                      } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                            {t.units} units of {t.bloodGroup}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                            t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' : (t.status === 'requested' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-slate-200 text-slate-700')
                          }`}>
                            {t.status}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 dark:text-slate-300">
                          {isIncomingSupplier ? (
                            <span>Requested by: <strong className="text-slate-900 dark:text-slate-100">{t.toHospitalId?.name}</strong></span>
                          ) : (
                            <span>Requested from supplier: <strong className="text-slate-900 dark:text-slate-100">{t.fromHospitalId?.name}</strong></span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Timestamp: {new Date(t.createdAt).toLocaleTimeString()}
                        </div>
                      </div>

                      {isRequested && isIncomingSupplier && (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleAcceptTransfer(t._id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/30"
                          >
                            Accept & Transfer Stock
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Raise Request & Walk-In Confirmation */}
        <div className="space-y-8">
          
          {/* Raise Emergency Request Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center space-x-2">
              <Send className="w-5 h-5 text-red-600" />
              <span>Raise Emergency Request</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Initiates Tier 0 $\rightarrow$ Tier 1 $\rightarrow$ Tier 2 matching cascade</p>

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Units Required</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={unitCount}
                  onChange={(e) => setUnitCount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-bold focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Emergency Urgency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['critical', 'high', 'normal'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUrgency(u)}
                      className={`py-2 rounded-xl text-xs font-bold uppercase transition border ${
                        urgency === u
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Clinical Notes</label>
                <input
                  type="text"
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-xs transition shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2"
              >
                <span>Initiate Two-Tier Cascade Search</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Confirm Walk-In Donor Donation Tab */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 flex items-center space-x-2">
              <HeartHandshake className="w-5 h-5 text-emerald-600" />
              <span>Confirm Walk-In Donor</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">Confirms donation, adds inventory, sets 90-day donor cooldown</p>

            <form onSubmit={handleConfirmWalkIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Active Request</label>
                <select
                  value={walkInRequestId}
                  onChange={(e) => setWalkInRequestId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                >
                  <option value="">-- Choose Request --</option>
                  {requests.map(r => (
                    <option key={r._id} value={r._id}>
                      [{r.bloodGroup}] {r.notes || 'Emergency Request'} ({r.unitsFulfilled}/{r.unitsNeeded} units)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Donor User ID / Rahul Verma</label>
                <input
                  type="text"
                  placeholder="Enter Donor User Mongo ID"
                  value={walkInDonorId}
                  onChange={(e) => setWalkInDonorId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setWalkInDonorId('6793f1112233445566778899')}
                  className="mt-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
                >
                  + Use Demo Donor ID (Rahul Verma)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Units Donated</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={walkInUnits}
                  onChange={(e) => setWalkInUnits(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
              >
                <UserCheck className="w-4 h-4" />
                <span>Confirm Walk-in & Recalculate Cooldown</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}
