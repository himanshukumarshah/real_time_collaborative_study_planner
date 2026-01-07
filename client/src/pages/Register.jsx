import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register as apiRegister } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import { User, Mail, Lock, Loader2, AlertCircle, Zap, Target, Users, Timer, CheckCircle2, RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth(); // login({ token, user })

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.name.trim()) {
      setError("Name is required.");
      return false;
    }
    if (!form.email || !emailRegex.test(form.email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const { data } = await apiRegister(payload);

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server");
      }

      // Persist via AuthContext
      login({ token: data.token, user: data.user });

      toast.success(`Hey ${payload.name}!`);

      // Navigate to dashboard
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Registration failed. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FDFDFF]">

      {/* LEFT SIDE: Value Proposition (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden items-center justify-center p-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-700 rounded-full blur-[120px] opacity-50" />

        <div className="relative z-10 max-w-lg text-white ">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-8 text-center ">
            <div className="bg-white p-2 rounded-2xl text-indigo-600 shadow-xl inline-flex items-center justify-center h-12 w-12">
              <RefreshCcw size={22} strokeWidth={2.9} />
            </div>
            <span className="text-3xl font-black">Zync</span>
          </div>

          <h2 className="text-5xl font-black leading-[1.1] mb-6 tracking-tight">
            Stop studying alone. <br />
            <span className="text-indigo-200">Start syncing.</span>
          </h2>

          <div className="space-y-6 mt-12">
            <FeatureItem
              icon={<Target size={20} />}
              title="Shared Goals"
              desc="Set your focus duration and let the room keep you accountable."
            />
            <FeatureItem
              icon={<Users size={20} />}
              title="Deep Work Rooms"
              desc="Join students globally in real-time study clusters."
            />
            <FeatureItem
              icon={<Timer size={20} />}
              title="Zero Distraction"
              desc="A clean, minimal interface designed strictly for productivity."
            />
          </div>

        </div>
      </div>

      {/* RIGHT SIDE: The Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 lg:p-12">
        <div className="w-full max-w-110">

          {/* Mobile Only Header */}
          <div className="lg:hidden flex flex-col items-center text-center mb-10">
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="bg-indigo-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                <RefreshCcw size={24} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-slate-900 tracking-tighter">Zync</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Stay Synced
                </span>
              </div>
            </div>

            {/* Main Header */}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Join the community to start focusing.
            </p>
          </div>

          <div className="mb-10 hidden lg:block">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Get Started</h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">It's free and always will be.</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={18} />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormInput
              label="Full Name"
              icon={<User size={18} />}
              placeholder="Enter your name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <FormInput
              label="Email Address"
              icon={<Mail size={18} />}
              placeholder="you@example.com"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Password"
                icon={<Lock size={18} />}
                placeholder="••••••••"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
              <FormInput
                label="Confirm password"
                icon={<Lock size={18} />}
                placeholder="••••••••"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="flex items-center gap-2 px-1">
              <CheckCircle2 size={14} className={form.password.length >= 6 ? "text-emerald-500" : "text-slate-300"} />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">At least 6 characters</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-4 px-6 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-4 text-sm font-black uppercase tracking-widest"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                "Create My Account"
              )}
            </button>
          </form>

          <footer className="mt-10 pt-8 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500 font-medium">
              Already have an account?{" "}
              <Link to="/auth/login" className="font-bold text-indigo-600 hover:text-indigo-700 underline-offset-4 decoration-2 hover:underline">
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 bg-white/10 rounded-lg text-white mt-1">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-lg text-white leading-tight">{title}</h4>
      <p className="text-indigo-100/70 text-sm mt-0.5">{desc}</p>
    </div>
  </div>
);

const FormInput = ({ label, icon, ...props }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] uppercase tracking-widest font-black text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input
        {...props}
        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
        required
      />
    </div>
  </div>
);