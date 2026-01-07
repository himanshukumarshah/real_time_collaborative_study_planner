import toast from 'react-hot-toast';
import { Zap, Sparkles, Trophy, Rocket, RefreshCcw } from 'lucide-react';

export const WelcomeNotification = (userName) => {
  const firstName = userName.split(' ')[0];

  toast.custom((t) => (
    <div
      className={`${t.visible ? 'animate-in fade-in slide-in-from-top-4' : 'animate-out fade-out slide-out-to-top-2'
        } max-w-sm w-full bg-white rounded-[2.5rem] p-0.5 shadow-[0_25px_50px_-12px_rgba(79,70,229,0.2)] pointer-events-auto relative overflow-hidden group transition-all`}
    >
      {/* 1. The Animated Shimmer Border */}
      <div className="absolute inset-0 bg-linear-to-r from-indigo-500 via-purple-400 to-pink-500 animate-shimmer" />

      <div className="relative flex-1 px-5 py-5 bg-white rounded-[2.4rem] overflow-hidden">

        {/* Subtle Background Blur Decoration */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-60" />

        <div className="flex items-center gap-4 relative z-10">

          {/* Avatar / Icon Section */}
          <div className="relative shrink-0">
            <div className="flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-xl shadow-indigo-100 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 h-12 w-12">
              <RefreshCcw size={25} strokeWidth={2.5} />
            </div>
            {/* Achievement Badge */}
            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-md border border-slate-50">
              <Rocket size={14} className="text-amber-500" fill="currentColor" />
            </div>
          </div>

          {/* Greeting Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-black text-slate-900 leading-tight">
              Hey, {firstName}! <span className="animate-wave">👋</span>
            </h3>
            <h4 className="text-lg font-semibold text-slate-800 leading-tight">
              Welcome to the room! <span className="animate-wave">💐</span>
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles size={14} className="text-purple-500" />
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                Session Mode: Active
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>

      </div>
    </div>
  ), {
    position: 'top-center',
    duration:6000,  //! change to 6000
  });
};