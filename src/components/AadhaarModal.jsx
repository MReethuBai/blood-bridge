import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { verifyAadhaarApi } from '../services/api';

export default function AadhaarModal({ isOpen, onClose, onVerified }) {
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [step, setStep] = useState('input'); // 'input' | 'otp' | 'success'
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedData, setVerifiedData] = useState(null);

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyAadhaarApi(aadhaarNumber);
      if (result.valid) {
        setVerifiedData(result);
        setStep('otp');
      } else {
        setError(result.message || 'Invalid Aadhaar number (Verhoeff checksum failed)');
      }
    } catch (err) {
      setError(err.message || 'Verification error');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter 4-digit OTP (e.g. 1234)');
      return;
    }
    setStep('success');
    if (onVerified && verifiedData) {
      onVerified(verifiedData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Identity Verification</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Simulated Aadhaar UIDAI Verification Layer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl font-bold">
            &times;
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2 border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 'input' && (
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Enter 12-Digit Aadhaar Number
              </label>
              <input
                type="text"
                maxLength="12"
                placeholder="e.g. 9999 8888 7777"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono tracking-widest text-center text-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                required
              />
              <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <Lock className="w-3 h-3 text-emerald-500 inline mr-1" />
                Validated via standard Verhoeff algorithm. Raw number is never stored.
              </p>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              <strong>Hackathon Note:</strong> Verification is simulated locally. Stored attributes are masked as <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">aadharHash</code> and <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono">aadharLast4</code>.
            </div>

            <button
              type="submit"
              disabled={loading || aadhaarNumber.length !== 12}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-semibold flex items-center justify-center space-x-2 transition shadow-lg shadow-red-500/25 disabled:opacity-50"
            >
              {loading ? (
                <span>Checking Verhoeff Checksum...</span>
              ) : (
                <>
                  <span>Verify Aadhaar & Send OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="text-center py-2">
              <span className="inline-block p-3 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2">
                <ShieldCheck className="w-8 h-8" />
              </span>
              <h4 className="font-semibold text-sm">Checksum Passed!</h4>
              <p className="text-xs text-slate-500">Enter mock OTP sent to linked mobile number</p>
            </div>

            <div>
              <input
                type="text"
                maxLength="4"
                placeholder="1234"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono tracking-widest text-center text-xl font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition shadow-lg shadow-emerald-600/25"
            >
              Confirm OTP & Complete Verification
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-bold text-lg text-emerald-600 dark:text-emerald-400">Aadhaar Verified</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masked ID: <strong className="font-mono text-slate-800 dark:text-slate-200">XXXX-XXXX-{verifiedData?.aadharLast4 || '7777'}</strong>
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
