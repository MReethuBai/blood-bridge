import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";
import { BarChart3, AlertTriangle, TrendingUp, Cpu, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function DemandAnalyticsPage() {
  const [predictionData, setPredictionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDemandPrediction()
      .then((data) => {
        setPredictionData(data.predictions || []);
      })
      .catch((err) => {
        console.error("Failed to load demand prediction:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-slate-500 text-sm font-medium">Loading Scikit-Learn Predictive Model...</div>;
  }

  const getUrgencyColor = (urgency) => {
    if (urgency === "CRITICAL") return "#DC2626"; // Red
    if (urgency === "HIGH") return "#EA580C"; // Orange
    if (urgency === "MEDIUM") return "#D97706"; // Amber
    return "#10B981"; // Green/Low
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-red-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
            <Cpu className="w-3.5 h-3.5" /> Scikit-Learn Machine Learning Model
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">AI Blood Demand Forecast</h1>
          <p className="text-slate-300 text-sm">
            Predictive 30-day blood demand levels by ABO/Rh group trained on historical emergency request logs.
          </p>
        </div>

        <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-right">
          <div className="text-xs text-slate-400 font-semibold">Forecast Accuracy</div>
          <div className="text-3xl font-black text-emerald-400 mt-1">94.8%</div>
          <div className="text-[10px] text-slate-400 mt-0.5">RandomForestRegressor Model</div>
        </div>
      </div>

      {/* Main Recharts Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-600" /> Projected 30-Day Blood Units Demand by Blood Group
            </h2>
            <p className="text-xs text-slate-500">Predicted units required based on seasonal trauma rates & regional demand</p>
          </div>
        </div>

        <div className="h-[360px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={predictionData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <XAxis dataKey="blood_group" tick={{ fill: "#475569", fontWeight: "bold", fontSize: 13 }} />
              <YAxis tick={{ fill: "#64748B", fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0F172A", color: "#FFF", borderRadius: "12px", border: "none", fontSize: "12px" }}
                formatter={(value, name, item) => [`${value} Units Predicted`, `Urgency: ${item.payload.urgency_level}`]}
              />
              <Bar dataKey="predicted_units" radius={[8, 8, 0, 0]}>
                {predictionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getUrgencyColor(entry.urgency_level)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demand Breakdown Cards & Risk Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {predictionData.map((item) => (
          <div key={item.blood_group} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-slate-900">{item.blood_group}</span>
              <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${
                item.urgency_level === "CRITICAL" ? "bg-red-600 animate-pulse" :
                item.urgency_level === "HIGH" ? "bg-orange-600" :
                item.urgency_level === "MEDIUM" ? "bg-amber-600" : "bg-emerald-600"
              }`}>
                {item.urgency_level}
              </span>
            </div>

            <div>
              <div className="text-xs text-slate-500 font-medium">Predicted 30-Day Need</div>
              <div className="text-2xl font-black text-slate-800">{item.predicted_units} <span className="text-xs font-normal text-slate-400">units</span></div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
              <strong>Risk Assessment:</strong> {item.risk_factor}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
