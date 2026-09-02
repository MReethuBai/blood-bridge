import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { 
  Building2, 
  Box, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Truck, 
  Plus, 
  Minus, 
  Save, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  Phone, 
  LogOut,
  Send,
  Zap
} from "lucide-react";
import DonorMap from "../components/DonorMap";

export default function BloodBankDashboard({ onLogout }) {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [inventory, setInventory] = useState({
    "O+": 14, "A+": 10, "B+": 12, "AB+": 6,
    "O-": 3,  "A-": 2,  "B-": 1,  "AB-": 1
  });
  const [hospitalRequests, setHospitalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dispatchingId, setDispatchingId] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
  };

  const fetchBloodBankData = async () => {
    try {
      setLoading(true);
      const prof = await api.getBloodBankProfile();
      if (prof && prof.name) {
        setProfile(prof);
        if (prof.inventory) {
          setInventory(prof.inventory);
        }
      }
      const reqs = await api.getBloodBankHospitalRequests();
      setHospitalRequests(reqs || []);
    } catch (err) {
      console.error("Failed to load Blood Bank dashboard data:", err);
      setErrorMessage("Could not load Blood Bank data. Please verify network connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBankData();
  }, []);

  const handleStockChange = (bg, delta) => {
    setInventory(prev => {
      const current = prev[bg] || 0;
      const nextVal = Math.max(0, current + delta);
      return { ...prev, [bg]: nextVal };
    });
  };

  const handleSaveInventory = async () => {
    setSaving(true);
    setMessage("");
    setErrorMessage("");
    try {
      const res = await api.updateBloodBankInventory(inventory);
      setMessage("✅ Blood Bank Live Stock Inventory Saved & Sync'd with Bangalore Emergency Network.");
      if (res.blood_bank && res.blood_bank.inventory) {
        setInventory(res.blood_bank.inventory);
      }
    } catch (err) {
      setErrorMessage("Failed to save inventory: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDispatch = async (reqId) => {
    setDispatchingId(reqId);
    setMessage("");
    setErrorMessage("");
    try {
      const res = await api.dispatchBloodBankDelivery(reqId);
      setMessage(`🚚 Express Cold-Chain Blood Transfusion Dispatched! (Driver: Suresh Gowda, ETA: 18 Mins)`);
      await fetchBloodBankData();
    } catch (err) {
      setErrorMessage("Failed to dispatch delivery: " + err.message);
    } finally {
      setDispatchingId(null);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <div className="inline-block w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-600">Loading Blood Bank Emergency Operations Center...</p>
      </div>
    );
  }

  // Calculate Summary Metrics
  const totalStock = Object.values(inventory).reduce((a, b) => a + b, 0);
  const lowStockGroups = Object.entries(inventory).filter(([_, count]) => count <= 3);
  const pendingHospitalOrders = hospitalRequests.filter(r => r.status === "OPEN" || r.status === "SEARCHING_FOR_DONORS");
  const fulfilledOrders = hospitalRequests.filter(r => r.status === "FULFILLED_BY_BLOOD_BANK");

  const bankName = profile?.name || "Red Cross Central Blood Bank";
  const locality = profile?.locality || "MG Road";
  const city = profile?.city || "Bangalore";
  const phone = profile?.phone || "+91 80 2226 8435";
  const address = profile?.address || "26 MG Road, Central Bangalore";
  const lat = profile?.lat || 12.9750;
  const lng = profile?.lng || 77.6010;

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-900/50">
                <Building2 className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{bankName}</h1>
                <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-red-400" /> {address} ({city})
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-extrabold px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Connected Regional Hub (Active)
            </span>
            
            <button
              onClick={handleSignOut}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Quick Contact Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> Dispatch Helpline: <strong className="text-slate-200">{phone}</strong></span>
            <span>📍 Coordinates: <strong className="text-slate-200">{lat.toFixed(4)}, {lng.toFixed(4)}</strong></span>
          </div>
          <div className="text-slate-400">
            Last Inventory Sync: <span className="text-emerald-400 font-semibold">{profile?.updated_at ? new Date(profile.updated_at).toLocaleTimeString() : "Just now"}</span>
          </div>
        </div>
      </div>

      {/* Alert Banners */}
      {message && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> {message}</span>
          <button onClick={() => setMessage("")} className="text-emerald-700 font-black cursor-pointer">✕</button>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-600" /> {errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="text-rose-700 font-black cursor-pointer">✕</button>
        </div>
      )}

      {/* Top Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Total Stock Level</div>
            <div className="text-3xl font-black text-slate-900">{totalStock} <span className="text-sm font-bold text-slate-500">Units</span></div>
            <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> Cold-Chain Reserved
            </div>
          </div>
          <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100">
            <Box className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Low Stock Warnings</div>
            <div className="text-3xl font-black text-amber-600">{lowStockGroups.length} <span className="text-sm font-bold text-slate-500">Groups</span></div>
            <div className="text-[11px] text-amber-700 font-medium">
              {lowStockGroups.length > 0 ? lowStockGroups.map(([g]) => g).join(", ") : "All Groups Stable"}
            </div>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl border border-amber-100">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Pending Hospital Orders</div>
            <div className="text-3xl font-black text-blue-600">{pendingHospitalOrders.length} <span className="text-sm font-bold text-slate-500">Requests</span></div>
            <div className="text-[11px] text-blue-600 font-medium">Awaiting Dispatch</div>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100">
            <Zap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Fulfilled / Dispatched</div>
            <div className="text-3xl font-black text-emerald-600">{fulfilledOrders.length} <span className="text-sm font-bold text-slate-500">Deliveries</span></div>
            <div className="text-[11px] text-emerald-600 font-medium">Express Cold-Chain Active</div>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100">
            <Truck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid: Inventory Manager + Hospital Dispatch Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Live Inventory Manager (1 Column) */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Box className="w-4 h-4 text-red-600" /> Live Blood Inventory Control
              </h2>
              <p className="text-xs text-slate-500">Adjust stock levels per component group</p>
            </div>

            <button
              onClick={handleSaveInventory}
              disabled={saving}
              className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-red-200 transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Save Stock"}
            </button>
          </div>

          <div className="space-y-3">
            {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => {
              const count = inventory[bg] || 0;
              const isCritical = count <= 2;
              const isLow = count > 2 && count <= 5;
              const capacityPct = Math.min(100, Math.round((count / 25) * 100));

              return (
                <div key={bg} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 bg-white border border-slate-200 px-2.5 py-1 rounded-xl shadow-2xs">
                        🩸 {bg}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        isCritical ? "bg-rose-600 text-white animate-pulse" :
                        isLow ? "bg-amber-500 text-white" : "bg-emerald-100 text-emerald-800"
                      }`}>
                        {isCritical ? "CRITICAL LOW" : isLow ? "LOW STOCK" : "STABLE"}
                      </span>
                    </div>

                    {/* Quick Stepper Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleStockChange(bg, -1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="w-9 text-center font-black text-sm text-slate-900">{count}</span>

                      <button
                        onClick={() => handleStockChange(bg, 1)}
                        className="w-7 h-7 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Stock Bar */}
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCritical ? "bg-rose-500" : isLow ? "bg-amber-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${capacityPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-900 rounded-2xl text-white space-y-2 text-xs">
            <div className="font-extrabold flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Automated Stock Synchronization
            </div>
            <p className="text-slate-400 text-[11px]">
              Inventory levels update in real-time across all connected Bangalore hospitals during emergency request evaluations.
            </p>
          </div>
        </div>

        {/* Hospital Dispatch Requests Monitor (2 Columns) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-red-600" /> Hospital Emergency Orders & Express Dispatch
              </h2>
              <p className="text-xs text-slate-500">Fulfill incoming emergency hospital blood requests in Bangalore</p>
            </div>

            <button
              onClick={fetchBloodBankData}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh List
            </button>
          </div>

          {hospitalRequests.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <Building2 className="w-10 h-10 mx-auto text-slate-300" />
              <p>No active hospital emergency requests at this moment.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {hospitalRequests.map((req) => {
                const isFulfilledByBank = req.status === "FULFILLED_BY_BLOOD_BANK";
                const isDispatching = dispatchingId === req._id;
                const availableUnits = inventory[req.blood_group] || 0;
                const canFulfill = availableUnits >= req.units_required;

                return (
                  <div 
                    key={req._id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      isFulfilledByBank 
                        ? "bg-emerald-50/50 border-emerald-200" 
                        : "bg-slate-50/50 border-slate-200 hover:bg-white hover:border-red-200"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            req.priority === "CRITICAL" ? "bg-red-600 text-white animate-pulse" : "bg-amber-500 text-white"
                          }`}>
                            {req.priority}
                          </span>
                          <h3 className="text-base font-extrabold text-slate-900">{req.hospital_name}</h3>
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> Location: {req.city || "Bangalore"} • Contact: {req.contact_phone || "+91 80 2555 0100"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-black text-red-600">{req.blood_group}</div>
                          <div className="text-xs font-bold text-slate-700">{req.units_required} Units Requested</div>
                        </div>
                      </div>
                    </div>

                    {/* Stock Check Indicator */}
                    <div className="flex flex-wrap items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Blood Bank Inventory Check:</span>
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          canFulfill ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {canFulfill ? `✅ ${availableUnits} Units Available in Stock` : `⚠️ Low Stock (${availableUnits} Available)`}
                        </span>
                      </div>

                      <span className="text-slate-400 text-[11px]">
                        Order Ref: {req._id}
                      </span>
                    </div>

                    {/* Dispatch Action Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2 border-t border-slate-100 gap-3">
                      <div className="text-xs text-slate-500">
                        {isFulfilledByBank ? (
                          <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                            🚚 DISPATCHED & RESERVED (Cold-Chain Express EV Ambulance KA-01-BB-8899)
                          </span>
                        ) : (
                          <span>Created: {new Date(req.created_at).toLocaleString()}</span>
                        )}
                      </div>

                      <div>
                        {!isFulfilledByBank && (
                          <button
                            onClick={() => handleDispatch(req._id)}
                            disabled={isDispatching}
                            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center gap-2 shadow-md transition-all ${
                              canFulfill 
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200 cursor-pointer" 
                                : "bg-amber-600 hover:bg-amber-700 shadow-amber-200 cursor-pointer"
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                            {isDispatching ? "Dispatching Delivery..." : "🚚 Dispatch Express Cold-Chain Blood"}
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Regional Hospital Coordination & Map Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" /> Geographic Hospital Network Radar (Bangalore)
            </h2>
            <p className="text-xs text-slate-500">Live geospatial coordinates for regional hospitals and blood bank hub</p>
          </div>
          <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1 rounded-xl">
            📍 Central Bangalore Hub ({lat.toFixed(4)}, {lng.toFixed(4)})
          </span>
        </div>

        <DonorMap 
          hospitalLocation={{ lat, lng }}
          hospitalName={bankName}
          matchedDonors={[]}
        />
      </div>

    </div>
  );
}
