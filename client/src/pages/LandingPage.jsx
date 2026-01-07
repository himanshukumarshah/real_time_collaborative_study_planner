import React from "react";
import { Link } from "react-router";
import {
  Users,
  Timer,
  ShieldCheck,
  Target,
  Zap,
  ChevronRight,
  CheckCircle2,
  LayoutDashboard
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">

      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Subtle Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[30%] h-[40%] bg-indigo-50 blur-[120px] rounded-full opacity-60" />
          <div className="absolute bottom-0 left-[-5%] w-[25%] h-[30%] bg-blue-50 blur-[100px] rounded-full opacity-60" />
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Real-time Study Rooms are live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            Study Better. Together. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">In Real Time.</span>
          </h1>

          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            The collaborative study planner that keeps you focused and accountable.
            Study together in real-time focus sessions — no distractions, just progress.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/auth/register"
              className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-indigo-200"
            >
              Start Studying Now
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/rooms"
              className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all shadow-sm"
            >
              Browse Active Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Studying Alone Often Fails</h2>
            <p className="text-slate-500">The friction that stops you from being consistent.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { text: "Lack of consistency and discipline", icon: "📉" },
              { text: "No accountability leads to procrastination", icon: "⏰" },
              { text: "Studying alone feels boring and demotivating", icon: "🕯️" },
              { text: "No clear tracking of focused study time", icon: "📊" },
            ].map((point, index) => (
              <div
                key={index}
                className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition"
              >
                <span className="text-2xl bg-slate-50 w-12 h-12 flex items-center justify-center rounded-xl">{point.icon}</span>
                <span className="font-medium text-slate-700">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Serious Focus</h2>
            <div className="h-1.5 w-20 bg-indigo-600 mx-auto rounded-full" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <Users />, title: "Live Study Rooms", desc: "Instantly jump into collaborative spaces with students worldwide." },
              { icon: <Timer />, title: "Shared Timer", desc: "Stay perfectly synced. Break and focus as a group." },
              { icon: <Target />, title: "Session Control", desc: "Manage sessions as a room owner." },
              { icon: <ShieldCheck />, title: "Secure & Private", desc: "Focus on your work knowing your data is encrypted." },
              { icon: <LayoutDashboard />, title: "Personal Stats", desc: "See your focused time and track your productivity levels." },
              { icon: <CheckCircle2 />, title: "Zero Distractions", desc: "A clean, ad-free environment designed purely for work." },
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-slate-100 bg-white hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                <div className="w-12 h-12 text-indigo-600 mb-6 bg-indigo-50 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How to Get Started</h2>
            <p className="text-slate-500">From zero to focused in less than two minutes.</p>
          </div>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {/* Connecting Line (Desktop Only) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-indigo-100 -translate-y-8 z-0" />

            {[
              { step: "01", title: "Sign Up", desc: "Create your free account." },
              { step: "02", title: "Join Room", desc: "Pick an active study group." },
              { step: "03", title: "Set Goals", desc: "List your tasks for the session." },
              { step: "04", title: "Study", desc: "Focus with the shared timer." },
              { step: "05", title: "Finish", desc: "Review progress and reset." },
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full bg-white border-4 border-[#FDFDFF] shadow-xl shadow-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

          <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10 leading-tight">
            Ready to change the way <br /> you study?
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link
              to="/auth/register"
              className="px-10 py-4 bg-white text-slate-900 rounded-2xl font-bold hover:bg-indigo-50 transition-all shadow-lg"
            >
              Get Started for Free
            </Link>
            <Link
              to="/rooms"
              className="px-10 py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-all border border-slate-700"
            >
              View Active Rooms
            </Link>
          </div>

          {/* <p className="mt-8 text-slate-400 text-sm relative z-10 uppercase tracking-widest font-semibold">
            Join 1,200+ active learners
          </p> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}