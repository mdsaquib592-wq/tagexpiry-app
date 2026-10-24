const STORAGE_KEY = "tagexpiry_items_v3";
const STATS_KEY = "tagexpiry_consumed_count";

export const triggerHaptic = (duration = 15) => {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Ignore if blocked by browser
    }
  }
};

export const getStoredItems = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const defaultItems = [
        {
          id: "item-101",
          name: "Greek Yogurt (Unopened)",
          category: "Food & Dairy",
          location: "Fridge",
          quantity: "400 g",
          createdDate: new Date(Date.now() - 3 * 86400000)
            .toISOString()
            .split("T")[0],
          expiryDate: new Date(Date.now() + 9 * 86400000)
            .toISOString()
            .split("T")[0],
          notes: "Top shelf, keep chilled below 4°C",
        },
        {
          id: "item-102",
          name: "Organic Baby Spinach",
          category: "Food & Dairy",
          location: "Fridge",
          quantity: "200 g",
          createdDate: new Date(Date.now() - 4 * 86400000)
            .toISOString()
            .split("T")[0],
          expiryDate: new Date(Date.now() + 2 * 86400000)
            .toISOString()
            .split("T")[0],
          notes: "Use for morning smoothie or salad",
        },
        {
          id: "item-103",
          name: "Vitamin C 15% Face Serum",
          category: "Cosmetics",
          location: "Vanity",
          quantity: "30 ml",
          createdDate: new Date(Date.now() - 95 * 86400000)
            .toISOString()
            .split("T")[0],
          expiryDate: new Date(Date.now() - 1 * 86400000)
            .toISOString()
            .split("T")[0],
          notes: "Check if color oxidized to dark amber",
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultItems));
      return defaultItems;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Failed to load items", err);
    return [];
  }
};

export const saveItemsToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Failed to save items", err);
  }
};

export const getConsumedCount = () => {
  return parseInt(localStorage.getItem(STATS_KEY) || "14", 10);
};

export const incrementConsumedCount = () => {
  const current = getConsumedCount() + 1;
  localStorage.setItem(STATS_KEY, String(current));
  return current;
};

export const calculateItemHealth = (createdDate, expiryDate) => {
  const start = new Date(createdDate).setHours(0, 0, 0, 0);
  const end = new Date(expiryDate).setHours(23, 59, 59, 999);
  const now = Date.now();

  const totalDuration = Math.max(86400000, end - start);
  const remainingDuration = end - now;
  const daysLeft = Math.ceil(remainingDuration / 86400000);

  let percentLeft = Math.round((remainingDuration / totalDuration) * 100);
  percentLeft = Math.max(0, Math.min(100, percentLeft));

  let status = "good";
  if (daysLeft <= 0) {
    status = "expired";
  } else if (daysLeft <= 7) {
    status = "expiring";
  }

  return { daysLeft, percentLeft, status };
};
