import React from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
} from "lucide-react";

export default function StatsGrid({
  stats,
  consumedCount,
  activeStatus,
  onSelectStatus,
}) {
  const cards = [
    {
      id: "all",
      label: "Active Stock",
      value: stats.total,
      icon: Package,
      textColor: "text-slate-900 dark:text-white",
      badgeBg:
        "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
      ringColor: "ring-slate-400",
    },
    {
      id: "good",
      label: "Fresh (>7d)",
      value: stats.good,
      icon: CheckCircle2,
      textColor: "text-emerald-600 dark:text-emerald-400",
      badgeBg:
        "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400",
      ringColor: "ring-emerald-500",
    },
    {
      id: "expiring",
      label: "Expiring Soon",
      value: stats.expiring,
      icon: Clock,
      textColor: "text-amber-600 dark:text-amber-400",
      badgeBg:
        "bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400",
      ringColor: "ring-amber-500",
    },
    {
      id: "expired",
      label: "Expired Alert",
      value: stats.expired,
      icon: AlertTriangle,
      textColor: "text-rose-600 dark:text-rose-400",
      badgeBg:
        "bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400",
      ringColor: "ring-rose-500",
    },
  ];

  return (
    <div className="space-y-3 mb-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map((card) => {
          const IconComponent = card.icon;
          const isSelected = activeStatus === card.id;
          return (
            <motion.button
              whileTap={{ scale: 0.97 }}
              key={card.id}
              onClick={() => onSelectStatus(card.id)}
              className={`text-left p-4 rounded-2xl bg-white dark:bg-slate-900 border transition-all flex items-center justify-between ${
                isSelected
                  ? `border-transparent ring-2 ${card.ringColor} shadow-md`
                  : "border-slate-200/90 dark:border-slate-800 shadow-sm hover:border-slate-300"
              }`}
            >
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                  {card.label}
                </p>
                <p
                  className={`text-2xl sm:text-3xl font-black tracking-tight ${card.textColor}`}
                >
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${card.badgeBg}`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Zero-Waste Score Banner */}
      <div className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-emerald-500 text-white">
            <Award className="w-4 h-4" />
          </div>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            Zero-Waste Score:{" "}
            <strong className="text-emerald-600 dark:text-emerald-400">
              {consumedCount} items
            </strong>{" "}
            consumed before expiry!
          </span>
        </div>
        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hidden sm:inline">
          Keep it up!
        </span>
      </div>
    </div>
  );
}
