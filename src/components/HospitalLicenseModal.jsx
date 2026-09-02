import React, { useState } from 'react';
import { Building2, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function HospitalLicenseModal({ isOpen, onClose, onVerified }) {
  const [licenseNumber, setLicenseNumber] = useState('LIC-2026-10001');
  const [govtRegId, setGovtRegId] = useState('KA-GOVT-001');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);

  if (!isOpen) return null;

  const handleVerify = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      if (onVerified) {
        onVerified({ licenseNumber, govtRegId, status: 'verified' });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 dark:text-slate-100">
        
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Hospital License Check</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simulated Regulatory Lookup (eRaktKosh)</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl font-bold">
            &times;
          </button>
        </div>

        {!verified ? (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical License Number
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="e.g. LIC-2026-10001"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Government Registration ID
              </label>
              <input
                type="text"
                value={govtRegId}
                onChange={(e) => setGovtRegId(e.target.value)}
                placeholder="e.g. KA-GOVT-001"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-[11px] leading-relaxed">
              <ShieldAlert className="w-4 h-4 inline mr-1 text-blue-600" />
              Simulates government clinical registry cross-checking against seeded licensed healthcare facilities.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-600/25 disabled:opacity-50"
            >
              {loading ? (
                <span>Querying Fake Govt Registry...</span>
              ) : (
                <>
                  <span>Verify License</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">License Verified</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Status: <strong className="text-slate-800 dark:text-slate-200">VERIFIED (Karnataka State Registry)</strong>
            </p>
            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-semibold transition"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
