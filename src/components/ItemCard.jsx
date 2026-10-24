import React from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Trash2,
  Edit3,
  Calendar,
  MapPin,
  Check,
  Layers,
} from "lucide-react";
import { calculateItemHealth } from "../utils/storage.js";

export default function ItemCard({
  item,
  onConsume,
  onRenew,
  onEdit,
  onDelete,
}) {
  const { daysLeft, percentLeft, status } = calculateItemHealth(
    item.createdDate,
    item.expiryDate,
  );

  const getStatusBadge = () => {
    if (status === "expired") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/90 text-rose-600 dark:text-rose-400 border border-rose-500/20 animate-pulse">
          Expired {Math.abs(daysLeft)}d ago
        </span>
      );
    }
    if (status === "expiring") {
      return (
        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 dark:bg-amber-950/90 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          {daysLeft === 0 ? "Expires Today!" : `${daysLeft}d left`}
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-100 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
        {daysLeft} days left
      </span>
    );
  };

  const getBarColor = () => {
    if (status === "expired") return "bg-rose-500";
    if (status === "expiring")
      return "bg-gradient-to-r from-amber-500 to-orange-400";
    return "bg-gradient-to-r from-emerald-500 to-teal-400";
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden"
    >
      <div>
        {/* Top Metadata Row */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              {item.category}
            </span>
            {item.location && (
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <MapPin className="w-2.5 h-2.5" />
                {item.location}
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>

        {/* Title & Quantity */}
        <div className="flex items-baseline justify-between gap-2 mt-1">
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base leading-snug">
            {item.name}
          </h3>
          {item.quantity && (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
              <Layers className="w-3 h-3" />
              {item.quantity}
            </span>
          )}
        </div>

        {item.notes && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
            {item.notes}
          </p>
        )}

        {/* Animated Degradation Progress Bar */}
        <div className="my-4">
          <div className="flex justify-between items-center text-[11px] font-bold mb-1.5">
            <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Shelf-Life Remaining
            </span>
            <span
              className={
                status === "expired"
                  ? "text-rose-500"
                  : "text-slate-700 dark:text-slate-300"
              }
            >
              {percentLeft}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentLeft}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full ${getBarColor()}`}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Added: {item.createdDate}
          </span>
          <span className="font-semibold text-slate-600 dark:text-slate-400">
            Exp: {item.expiryDate}
          </span>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onConsume(item)}
            className="flex items-center gap-1 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500 hover:text-white text-emerald-600 dark:text-emerald-400 py-1.5 px-3 rounded-xl transition active:scale-95"
            title="Mark item as consumed before expiry"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Used Up</span>
          </button>

          <button
            onClick={() => onRenew(item.id)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-500 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition active:scale-95"
            title="Reset timer from today"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Renew</span>
          </button>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Edit"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
