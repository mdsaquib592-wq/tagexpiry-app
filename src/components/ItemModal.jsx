import React, { useState, useEffect } from "react";
import { X, Sparkles, CalendarPlus } from "lucide-react";
import { CATEGORIES, LOCATIONS, PRESETS } from "../types.js";

export default function ItemModal({ isOpen, onClose, onSave, editingItem }) {
  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    name: "",
    category: "Food & Dairy",
    location: "Fridge",
    quantity: "1 Unit",
    createdDate: todayStr,
    expiryDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    notes: "",
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name || "",
        category: editingItem.category || "Food & Dairy",
        location: editingItem.location || "Fridge",
        quantity: editingItem.quantity || "1 Unit",
        createdDate: editingItem.createdDate || todayStr,
        expiryDate: editingItem.expiryDate || todayStr,
        notes: editingItem.notes || "",
      });
    } else {
      setFormData({
        name: "",
        category: "Food & Dairy",
        location: "Fridge",
        quantity: "1 Unit",
        createdDate: todayStr,
        expiryDate: new Date(Date.now() + 7 * 86400000)
          .toISOString()
          .split("T")[0],
        notes: "",
      });
    }
  }, [editingItem, isOpen, todayStr]);

  if (!isOpen) return null;

  const handlePresetSelect = (preset) => {
    const start = new Date();
    const expiry = new Date(start.getTime() + preset.days * 86400000);
    setFormData({
      name: preset.name,
      category: preset.category,
      location: preset.location || "Fridge",
      quantity: preset.quantity || "1 Unit",
      createdDate: start.toISOString().split("T")[0],
      expiryDate: expiry.toISOString().split("T")[0],
      notes: `Auto-configured for ${preset.days} days shelf life`,
    });
  };

  const addQuickDays = (days) => {
    const base = new Date(formData.createdDate || Date.now());
    const target = new Date(base.getTime() + days * 86400000);
    setFormData((prev) => ({
      ...prev,
      expiryDate: target.toISOString().split("T")[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">
            {editingItem?.id ? "Update Tracked Item" : "Track New Product"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {!editingItem?.id && (
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                One-Tap Smart Templates
              </label>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePresetSelect(p)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 whitespace-nowrap transition shrink-0"
                  >
                    {p.name} ({p.days}d)
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Almond Milk 1L"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Quantity
              </label>
              <input
                type="text"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="e.g., 500g / 2 pcs"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm focus:outline-none"
              >
                {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Storage Zone
              </label>
              <select
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/90 text-sm focus:outline-none"
              >
                {LOCATIONS.filter((l) => l !== "All").map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Lifespan Calculator Pills */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5">
              <CalendarPlus className="w-3.5 h-3.5 text-emerald-500" />
              Quick Duration (From Start Date)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "+3 Days", days: 3 },
                { label: "+1 Week", days: 7 },
                { label: "+1 Month", days: 30 },
                { label: "+6 Months", days: 180 },
              ].map((btn) => (
                <button
                  key={btn.days}
                  type="button"
                  onClick={() => addQuickDays(btn.days)}
                  className="py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white transition active:scale-95"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Opened / Bought On
              </label>
              <input
                type="date"
                required
                value={formData.createdDate}
                onChange={(e) =>
                  setFormData({ ...formData, createdDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
                Expiration Date *
              </label>
              <input
                type="date"
                required
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">
              Notes / Batch Hint
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="e.g., Keep refrigerated after opening..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition active:scale-95"
            >
              {editingItem?.id ? "Save Changes" : "Start Tracking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
