import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { HeartPulse, Building2, Shield, User, Key, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function AuthPage({ initialMode = "login", setActiveTab }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState(initialMode); // "login" or "register"
  const [role, setRole] = useState("DONOR"); // DONOR, HOSPITAL, ADMIN
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [city, setCity] = useState("Bangalore");
  const [age, setAge] = useState(28);
  const [registrationId, setRegistrationId] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        const user = await login(email, password);
        redirectUser(user.role);
      } else {
        const userData = {
          name,
          email,
          password,
          role,
          phone,
          blood_group: bloodGroup,
          city,
          age,
          registration_id: registrationId,
          address
        };
        const user = await register(userData);
        redirectUser(user.role);
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (demoEmail, demoPassword) => {
    setError("");
    setLoading(true);
    try {
      const user = await login(demoEmail, demoPassword);
      redirectUser(user.role);
    } catch (err) {
      setError(err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  const redirectUser = (userRole) => {
    const role = (userRole || "").toLowerCase();
    if (role === "donor") setActiveTab("donor_dashboard");
    else if (role === "hospitaladmin" || role === "hospital") setActiveTab("hospital_dashboard");
    else if (role === "bloodbank" || role === "blood_bank") setActiveTab("blood_bank_dashboard");
    else if (role === "admin") setActiveTab("admin_dashboard");
    else setActiveTab("home");
  };

  return (
    <div className="max-w-md mx-auto my-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-md shadow-red-200">
          <HeartPulse className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {mode === "login" ? "Sign In to BloodBridge AI" : "Create an Account"}
        </h2>
        <p className="text-xs text-slate-500 font-medium">
          Select your role to access your personalized dashboard.
        </p>
      </div>

      {/* Role Selection Bar */}
      <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-[11px] font-bold">
        <button
          type="button"
          onClick={() => setRole("DONOR")}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            role === "DONOR" ? "bg-white text-red-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <User className="w-3.5 h-3.5" /> Donor
        </button>
        <button
          type="button"
          onClick={() => setRole("HOSPITAL")}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            role === "HOSPITAL" ? "bg-white text-blue-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Hospital
        </button>
        <button
          type="button"
          onClick={() => setRole("BLOOD_BANK")}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            role === "BLOOD_BANK" ? "bg-white text-emerald-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Blood Bank
        </button>
        <button
          type="button"
          onClick={() => setRole("ADMIN")}
          className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
            role === "ADMIN" ? "bg-white text-purple-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Shield className="w-3.5 h-3.5" /> Admin
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {role === "HOSPITAL" ? "Hospital Name" : role === "BLOOD_BANK" ? "Blood Bank Name" : "Full Name"}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "HOSPITAL" ? "Metro General Hospital" : role === "BLOOD_BANK" ? "Red Cross Central Blood Bank" : "Alex Taylor"}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>

        {/* Dynamic Role Fields for Registration */}
        {mode === "register" && role === "DONOR" && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-red-500 outline-none font-bold text-red-600"
              >
                {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
              <input
                type="number"
                min="18"
                max="65"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        )}

        {mode === "register" && role === "HOSPITAL" && (
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registration ID</label>
              <input
                type="text"
                value={registrationId}
                onChange={(e) => setRegistrationId(e.target.value)}
                placeholder="HOSP-BLR-99201"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-red-500 outline-none"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? "Authenticating..." : mode === "login" ? `Sign In as ${role}` : `Register as ${role}`}
        </button>
      </form>

      {/* Mode Switcher */}
      <div className="text-center pt-2 text-xs text-slate-600">
        {mode === "login" ? (
          <p>
            Don't have an account?{" "}
            <button onClick={() => setMode("register")} className="font-bold text-red-600 hover:underline cursor-pointer">
              Register Now
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button onClick={() => setMode("login")} className="font-bold text-red-600 hover:underline cursor-pointer">
              Sign In
            </button>
          </p>
        )}
      </div>

      {/* 1-Click Demo Login Panel */}
      <div className="border-t border-slate-200 pt-4 space-y-2">
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
          ⚡ 1-Click Quick Demo Login
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => quickLogin("hospital@metro.org", "Hospital@123")}
            className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg text-[11px] text-left border border-blue-200 transition-colors cursor-pointer"
          >
            🏥 Verified Hosp
          </button>
          <button
            type="button"
            onClick={() => quickLogin("bloodbank@redcross.org", "Bank@123")}
            className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-lg text-[11px] text-left border border-emerald-200 transition-colors cursor-pointer"
          >
            🏦 Blood Bank Hub
          </button>
          <button
            type="button"
            onClick={() => quickLogin("donor@example.com", "Donor@123")}
            className="p-2 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg text-[11px] text-left border border-red-200 transition-colors cursor-pointer"
          >
            🩸 Demo Donor (O+)
          </button>
          <button
            type="button"
            onClick={() => quickLogin("admin@bloodbridge.ai", "Admin@123")}
            className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg text-[11px] text-left border border-purple-200 transition-colors cursor-pointer"
          >
            🛡️ Chief Admin
          </button>
        </div>
      </div>

    </div>
  );
}
