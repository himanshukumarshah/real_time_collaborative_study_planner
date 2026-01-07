import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login as apiLogin } from "../api/auth.js";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";
import { Mail, Lock, Loader2, AlertCircle, Zap, ArrowRight, RefreshCcw } from "lucide-react";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // login({ token, user })

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!form.email || !form.password) {
      setError("Email and password are required.");
      return false;
    }
    if (!emailRegex.test(form.email)) {
      setError("Enter a valid email address.");
      return false;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleChange = (e) =>
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await apiLogin({
        email: form.email,
        password: form.password,
      });

      if (!data?.token || !data?.user) {
        throw new Error("Invalid response from server");
      }

      // Persist via context
      login({ token: data.token, user: data.user });

      toast.success(`Hey ${data.user.name}!`);

      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        "Login failed. Check credentials and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFF] px-4 relative overflow-hidden">
      {/* Dynamic Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] right-[-5%] w-[50%] h-[50%] bg-indigo-50/60 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-15%] left-[-5%] w-[50%] h-[50%] bg-blue-50/60 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-110 bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_rgba(79,70,229,0.05)] p-8 md:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-500">

        {/* Brand Header */}

        <div className="text-center mb-10">
          <div className="group relative inline-flex mb-4">
            <div className="absolute inset-0 bg-indigo-400 blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
            <div className="relative bg-indigo-600 p-3 rounded-2xl text-white shadow-lg shadow-indigo-100 flex items-center justify-center h-14 w-14 transform group-hover:rotate-12 transition-all duration-300">
              <RefreshCcw size={27} strokeWidth={2.9} />
            </div>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium mt-2">Enter your Zync credentials to continue.</p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 text-sm text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle size={18} />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-[0.2em] font-black text-slate-400 ml-1">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[11px] uppercase tracking-[0.2em] font-black text-slate-400">
                Password
              </label>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium placeholder-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white transition-all outline-none"
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full group flex justify-center items-center py-4 px-6 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8 text-sm font-black uppercase tracking-widest "
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
          <p className="text-sm text-slate-500 font-medium">
            New to Zync?{" "}
            <Link to="/auth/register" className="font-bold text-indigo-600 hover:text-indigo-700 underline-offset-4 decoration-2 hover:underline transition-all">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
