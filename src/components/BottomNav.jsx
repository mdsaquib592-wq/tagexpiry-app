import React from "react";
import { Home, Clock, AlertTriangle, Plus, ScanLine } from "lucide-react";

export default function BottomNav({
  activeStatus,
  onSelectStatus,
  onOpenAdd,
  onOpenScan,
  expiringCount,
}) {
  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-2 safe-bottom">
      <div className="flex items-center justify-around">
        <button
          onClick={() => onSelectStatus("all")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
            activeStatus === "all"
              ? "text-emerald-600 dark:text-emerald-400 font-bold"
              : "text-slate-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px]">All Stock</span>
        </button>

        <button
          onClick={() => onSelectStatus("expiring")}
          className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
            activeStatus === "expiring"
              ? "text-amber-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px]">Expiring</span>
          {expiringCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center">
              {expiringCount}
            </span>
          )}
        </button>

        {/* Center Floating Action Button */}
        <button
          onClick={onOpenAdd}
          className="w-12 h-12 -mt-5 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition"
        >
          <Plus className="w-6 h-6" />
        </button>

        <button
          onClick={onOpenScan}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-emerald-500"
        >
          <ScanLine className="w-5 h-5" />
          <span className="text-[10px]">Scan Tag</span>
        </button>

        <button
          onClick={() => onSelectStatus("expired")}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl ${
            activeStatus === "expired"
              ? "text-rose-500 font-bold"
              : "text-slate-400"
          }`}
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-[10px]">Expired</span>
        </button>
      </div>
    </div>
  );
}
