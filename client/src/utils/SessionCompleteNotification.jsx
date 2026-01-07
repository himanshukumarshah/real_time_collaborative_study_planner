import toast from 'react-hot-toast';
import { Trophy, Sparkles } from 'lucide-react';

export const SessionCompleteNotification = (duration) => {

  toast.custom((t) => (
    <div className="relative flex items-center justify-center p-20">

      <div
        className={`${
          t.visible ? 'animate-in fade-in zoom-in-95' : 'animate-out fade-out zoom-out-95'
        } relative z-10 max-w-sm w-full bg-white rounded-[2.5rem] p-0.5 shadow-2xl shadow-amber-200/50 pointer-events-auto overflow-hidden`}
      >
        {/* Shiny Golden Border */}
        <div className="absolute inset-0 bg-linear-to-r from-amber-400 via-yellow-200 to-amber-500" />

        <div className="relative bg-white rounded-[2.4rem] px-8 py-6 text-center">
          <div className="h-16 w-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-4">
            <Trophy size={32} fill="currentColor" className="animate-bounce" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            Session Ended!
          </h3>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Congrats on completing a productive <span className="text-amber-600 font-black">{duration} min</span> session.
          </p>

          <div className="mt-5 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            <Sparkles size={12} fill="currentColor" />
            Productivity +100
          </div>

          {/* Close Button */}
          <button
            onClick={() => toast.dismiss(t.id)}
            className="shrink-0 h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all active:scale-90 mx-auto mt-3"
          >
            <span className="text-sm font-bold">✕</span>
          </button>
        </div>
      </div>
    </div>
  ), {
    position: 'top-center',
    duration: 7000,
  });
};