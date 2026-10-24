import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import Navbar from "./components/Navbar.jsx";
import StatsGrid from "./components/StatsGrid.jsx";
import FilterBar from "./components/FilterBar.jsx";
import ItemCard from "./components/ItemCard.jsx";
import ItemModal from "./components/ItemModal.jsx";
import ScannerModal from "./components/ScannerModal.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";
import {
  getStoredItems,
  saveItemsToStorage,
  calculateItemHealth,
  getConsumedCount,
  incrementConsumedCount,
  triggerHaptic,
} from "./utils/storage.js";

export default function App() {
  const [items, setItems] = useState(() => getStoredItems());
  const [consumedCount, setConsumedCount] = useState(() => getConsumedCount());
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("urgent");

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2600);
  };

  useEffect(() => {
    saveItemsToStorage(items);
  }, [items]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const stats = useMemo(() => {
    let good = 0;
    let expiring = 0;
    let expired = 0;

    items.forEach((item) => {
      const { status } = calculateItemHealth(item.createdDate, item.expiryDate);
      if (status === "good") good++;
      else if (status === "expiring") expiring++;
      else if (status === "expired") expired++;
    });

    return { total: items.length, good, expiring, expired };
  }, [items]);

  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes &&
          item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All" || item.category === selectedCategory;
      const matchesLocation =
        selectedLocation === "All" || item.location === selectedLocation;

      const { status } = calculateItemHealth(item.createdDate, item.expiryDate);
      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesStatus
      );
    });

    return filtered.sort((a, b) => {
      const healthA = calculateItemHealth(a.createdDate, a.expiryDate);
      const healthB = calculateItemHealth(b.createdDate, b.expiryDate);

      if (sortBy === "urgent") return healthA.daysLeft - healthB.daysLeft;
      if (sortBy === "fresh") return healthB.daysLeft - healthA.daysLeft;
      return a.name.localeCompare(b.name);
    });
  }, [
    items,
    searchQuery,
    selectedCategory,
    selectedLocation,
    statusFilter,
    sortBy,
  ]);

  const handleSaveItem = (itemData) => {
    triggerHaptic(20);
    if (editingItem?.id) {
      setItems((prev) =>
        prev.map((it) =>
          it.id === editingItem.id ? { ...it, ...itemData } : it,
        ),
      );
      showToast(`Updated "${itemData.name}"`);
    } else {
      const newItem = {
        ...itemData,
        id: `item-${Date.now()}`,
      };
      setItems((prev) => [newItem, ...prev]);
      showToast(`Added "${itemData.name}" to ${itemData.location}`);
    }
    setIsItemModalOpen(false);
    setEditingItem(null);
  };

  const handleConsumeItem = (item) => {
    triggerHaptic(35);
    const updatedScore = incrementConsumedCount();
    setConsumedCount(updatedScore);
    setItems((prev) => prev.filter((it) => it.id !== item.id));
    showToast(`Marked "${item.name}" as consumed! +1 Zero-Waste Score`);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const handleRenewItem = (id) => {
    triggerHaptic(20);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const start = new Date(item.createdDate).getTime();
          const end = new Date(item.expiryDate).getTime();
          const duration = Math.max(86400000, end - start);

          const newStart = new Date();
          const newEnd = new Date(newStart.getTime() + duration);

          showToast(`Renewed cycle for "${item.name}"`);
          return {
            ...item,
            createdDate: newStart.toISOString().split("T")[0],
            expiryDate: newEnd.toISOString().split("T")[0],
          };
        }
        return item;
      }),
    );
  };

  const handleDeleteItem = (id) => {
    triggerHaptic(15);
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast("Item removed from inventory");
  };

  const handleExportData = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `tagexpiry_backup_${new Date().toISOString().split("T")[0]}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Backup JSON downloaded");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-24 sm:pb-12 transition-colors">
      <Navbar
        onOpenAddModal={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onOpenScanner={() => setIsScannerOpen(true)}
        isDark={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onExport={handleExportData}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        <StatsGrid
          stats={stats}
          consumedCount={consumedCount}
          activeStatus={statusFilter}
          onSelectStatus={setStatusFilter}
        />

        <FilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredAndSortedItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onConsume={handleConsumeItem}
                onRenew={handleRenewItem}
                onEdit={(it) => {
                  setEditingItem(it);
                  setIsItemModalOpen(true);
                }}
                onDelete={handleDeleteItem}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl mt-2">
            <p className="text-base font-extrabold text-slate-700 dark:text-slate-200 mb-1">
              No matching items in this view
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mb-5">
              Switch your category/zone filter or tap below to track a new
              product.
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setSelectedCategory("All");
                setSelectedLocation("All");
                setEditingItem(null);
                setIsItemModalOpen(true);
              }}
              className="text-xs font-bold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition"
            >
              + Track New Item
            </button>
          </div>
        )}
      </main>

      <BottomNav
        activeStatus={statusFilter}
        onSelectStatus={setStatusFilter}
        onOpenAdd={() => {
          setEditingItem(null);
          setIsItemModalOpen(true);
        }}
        onOpenScan={() => setIsScannerOpen(true)}
        expiringCount={stats.expiring}
      />

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
        editingItem={editingItem}
      />

      <ScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onDetected={(detectedData) => {
          setEditingItem(detectedData);
          setIsItemModalOpen(true);
        }}
      />

      <Toast message={toastMsg} />
    </div>
  );
}
