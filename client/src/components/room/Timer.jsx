import React, { useEffect, useMemo, useRef, useState } from "react";
import formatTime from "../../utils/formatTime";
import { Clock, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

export default function Timer({
  startTime = null,  // in milliSec
  duration = 0,   // in sec
  onEnd = () => { },
  className = "",
}) {
  const [remaining, setRemaining] = useState(null);
  const endedRef = useRef(false);

  // Recompute remaining whenever inputs change
  useEffect(() => {
    if (!startTime || duration <= 0) {
      setRemaining(null);
      endedRef.current = false;
      return;
    }
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const rem = Math.max(0, duration - elapsed);
    setRemaining(rem);
    endedRef.current = rem === 0;

  }, [startTime, duration]);

  // UI tick
  useEffect(() => {
    if (remaining === null) return;

    if (remaining === 0 && !endedRef.current) {
      endedRef.current = true;
      onEnd?.();
      return;
    }

    const t = setInterval(() => {
      setRemaining((r) => (r === null ? null : Math.max(0, r - 1)));
    }, 1000);

    return () => clearInterval(t);
  }, [remaining]);

  const progress = useMemo(() => {
    if (remaining === null || duration <= 0) return 0;
    const used = Math.max(0, duration - remaining);
    return Math.min(100, Math.round((used / duration) * 100));
  }, [remaining, duration]);

  const minutesLeft = remaining !== null ? Math.ceil(remaining / 60) : null;
  const isEndingSoon = remaining !== null && remaining > 0 && remaining <= 60;

  // ---- UI states ----

  if (startTime === null) {
    return (
      <div className={`bg-white p-4 rounded shadow-sm text-center ${className}`}>
        <div className="text-sm text-gray-500">No active session</div>
        <div className="mt-3">
          <button
            disabled
            className="px-3 py-1 rounded bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
          >
            Waiting
          </button>
        </div>
      </div>
    );
  }

  if (remaining === null) {
    return (
      <div className={`p-4 ${className}`}>
        <Loader2 size={28} className="animate-spin mr-2" />
      </div>
    );
  }

  return (

    <div className={`bg-white rounded-2xl p-8 ${className}`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Left Side: Time Display */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <Clock size={16} className={isEndingSoon ? "text-red-500" : "text-indigo-500"} />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Focus Period
            </span>
          </div>

          <div
            className={`text-6xl md:text-7xl font-black tracking-tighter tabular-nums leading-none ${isEndingSoon ? "text-red-600 animate-pulse" : "text-slate-900"
              }`}
            aria-live="polite"
          >
            {formatTime(remaining)}
          </div>
        </div>

        {/* Right Side: Statistics */}
        <div className="flex flex-row md:flex-col items-center md:items-end justify-center gap-6 md:gap-1 text-right">
          <div className="text-center md:text-right">
            <div className="text-2xl font-bold text-slate-800 leading-none">
              {minutesLeft}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Minutes Left
            </div>
          </div>

          <div className="h-8 w-px bg-gray-100 md:hidden" /> {/* Divider for mobile */}

          <div className="text-center md:text-right">
            <div className="text-lg font-semibold text-gray-400 leading-none">
              {Math.ceil(duration / 60)}
            </div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
              Total Mins
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar Area */}
      <div className="mt-8 relative">
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-1000 ease-linear rounded-full shadow-sm ${isEndingSoon
              ? "bg-linear-to-r from-red-500 to-orange-500 shadow-red-200"
              : "bg-linear-to-r from-indigo-600 to-indigo-400 shadow-indigo-200"
              }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Marker */}
        <div
          className="absolute top-5 transition-all duration-1000 ease-linear -translate-x-1/2"
          style={{ left: `${progress}%` }}
        >
          <div className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
            {Math.round(progress)}%
          </div>
        </div>
      </div>

      {/* Completion / Warning State */}
      {remaining === 0 ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-green-600 bg-green-50 py-3 rounded-xl border border-green-100 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={18} />
          <span className="text-sm font-bold uppercase tracking-wide">Session Complete. Take a break!</span>
        </div>
      ) : isEndingSoon ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-red-600 bg-red-50 py-3 rounded-xl border border-red-100">
          <AlertTriangle size={18} className="animate-bounce" />
          <span className="text-sm font-bold uppercase tracking-wide">Wrapping up soon...</span>
        </div>
      ) : null}
    </div>
  );
}
