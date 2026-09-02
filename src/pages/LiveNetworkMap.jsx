import React, { useState, useEffect } from 'react';
import { Building2, MapPin, HeartHandshake, ShieldCheck, RefreshCw, Zap, Activity } from 'lucide-react';
import { fetchHospitals, fetchRequests } from '../services/api';

export default function LiveNetworkMap() {
  const [hospitals, setHospitals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMapData();
  }, []);

  async function loadMapData() {
    setLoading(true);
    try {
      const hData = await fetchHospitals();
      setHospitals(hData || []);
      if (hData && hData.length > 0) setSelectedHospital(hData[0]);
      const rData = await fetchRequests();
      setRequests(rData || []);
    } catch (err) {
      console.error('Error loading map data:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Map Header */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-red-500 animate-pulse" />
            <h1 className="text-2xl font-bold">Bangalore Metro Live Supply Network</h1>
          </div>
          <p className="text-xs text-slate-400">
            Real-Time GeoSpatial Node Topology • Hospitals as Primary Nodes, Donors as Fallback Tier
          </p>
        </div>

        <button
          onClick={loadMapData}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-2 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Coordinates</span>
        </button>
      </div>

      {/* Map Interactive Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Interactive Canvas/SVG Node Map */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl min-h-[480px] flex flex-col justify-between">
          
          {/* Simulated Map Coordinates Overlay */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Top Status Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="px-3 py-1.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800 text-xs font-mono">
              GeoJSON 2dsphere Index Active
            </div>
            <div className="px-3 py-1.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-xs font-bold flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>3 Hospitals • 5 Donors Tracked</span>
            </div>
          </div>

          {/* Interactive SVG Node Diagram representing Bangalore Metro Nodes */}
          <div className="relative z-10 my-auto py-12 flex items-center justify-around flex-wrap gap-8">
            
            {/* Hospital Node 1: City General */}
            <div 
              onClick={() => setSelectedHospital(hospitals[0] || null)}
              className="cursor-pointer group flex flex-col items-center space-y-2 transform hover:scale-105 transition"
            >
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-blue-500/20 animate-pulse" />
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 border border-blue-400/40">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-100">City General Hospital</div>
                <div className="text-[10px] text-blue-400 font-mono">MG Road [77.59, 12.97]</div>
              </div>
            </div>

            {/* H2H Transfer Line visualization */}
            <div className="hidden sm:flex flex-col items-center text-slate-600">
              <div className="text-[10px] font-mono text-emerald-400 font-bold mb-1">Tier 1 H2H Transfer (~4 km)</div>
              <div className="w-32 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-400 to-indigo-500" />
            </div>

            {/* Hospital Node 2: Metro Healthcare */}
            <div 
              onClick={() => setSelectedHospital(hospitals[1] || null)}
              className="cursor-pointer group flex flex-col items-center space-y-2 transform hover:scale-105 transition"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 border border-indigo-400/40">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-100">Metro Health Care</div>
                <div className="text-[10px] text-indigo-400 font-mono">Koramangala [77.60, 12.93]</div>
              </div>
            </div>

            {/* Hospital Node 3: St Johns */}
            <div 
              onClick={() => setSelectedHospital(hospitals[2] || null)}
              className="cursor-pointer group flex flex-col items-center space-y-2 transform hover:scale-105 transition"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/40 border border-purple-400/40">
                  <Building2 className="w-8 h-8" />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs font-bold text-slate-100">St. Johns Medical Center</div>
                <div className="text-[10px] text-purple-400 font-mono">HSR Layout [77.62, 12.93]</div>
              </div>
            </div>

          </div>

          {/* Bottom Radius Legend */}
          <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span>Tier 1 Radius: 30km H2H</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Tier 2 Radius: 25km Individual Donors</span>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Selected Hospital Node Inventory Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selected Node Details</span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2 mt-1">
              <Building2 className="w-6 h-6 text-blue-600" />
              <span>{selectedHospital?.name || 'City General Hospital'}</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-blue-500" />
              <span>License: <code className="font-mono">{selectedHospital?.licenseNumber || 'LIC-2026-10001'}</code></span>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Live Inventory Stock</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {(selectedHospital?.inventory || [
                { bloodGroup: 'A+', units: 12 },
                { bloodGroup: 'B+', units: 2 },
                { bloodGroup: 'O+', units: 15 },
                { bloodGroup: 'O-', units: 0 }
              ]).map((item) => (
                <div 
                  key={item.bloodGroup}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">{item.bloodGroup}</span>
                  <span className={`text-sm font-bold ${item.units === 0 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.units} units
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs leading-relaxed">
            <strong>Cascading Architecture Note:</strong> When a request is raised at this hospital node, Tier 0 inspects local inventory. If insufficient, Tier 1 broadcasts an H2H transfer alert to nearby nodes in real-time.
          </div>
        </div>

      </div>
    </div>
  );
}
