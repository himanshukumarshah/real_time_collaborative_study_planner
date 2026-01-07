import { AlertTriangle } from "lucide-react";

export default function BlockerUI({ proceedHandler, resetHandler }) {
    return (

        <div className="fixed inset-0 z-100 flex justify-center items-start pt-12 px-4">
            {/* 1. Backdrop with Soft Blur */}
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] animate-in fade-in duration-300"
                onClick={resetHandler}
            />

            {/* 2. The Notification Card */}
            <div className="relative z-10 w-full max-w-95 bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 flex flex-col items-center text-center animate-in fade-in slide-in-from-top-4 duration-300">

                {/* Warning Icon with Glow */}
                <div className="mb-4 h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm shadow-amber-100">
                    <AlertTriangle size={24} />
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">
                    Leave Study Room?
                </h3>

                <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    You are currently in an active room. Leaving now will
                    <span className="text-slate-800 font-semibold"> disconnect you</span> from your group.
                </p>

                <div className="flex gap-3 w-full">
                    <button
                        onClick={resetHandler}
                        className="flex-1 h-11 text-sm font-bold bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all active:scale-95"
                    >
                        Stay
                    </button>

                    <button
                        onClick={proceedHandler}
                        className="flex-1 h-11 text-sm font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 active:scale-95"
                    >
                        Leave
                    </button>
                </div>
            </div>
        </div>
    );
}