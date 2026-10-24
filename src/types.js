export const PRESETS = [
  {
    name: "Fresh Milk (Opened)",
    category: "Food & Dairy",
    location: "Fridge",
    days: 5,
    quantity: "1 L",
    barcode: "8901262010016",
  },
  {
    name: "Farm Eggs (12 Pack)",
    category: "Food & Dairy",
    location: "Fridge",
    days: 28,
    quantity: "12 pcs",
    barcode: "8904004400125",
  },
  {
    name: "Artisan Brown Bread",
    category: "Food & Dairy",
    location: "Pantry",
    days: 4,
    quantity: "1 Loaf",
    barcode: "8906001023419",
  },
  {
    name: "Sunscreen Gel SPF 50",
    category: "Cosmetics",
    location: "Vanity",
    days: 180,
    quantity: "50 g",
    barcode: "8901030849213",
  },
  {
    name: "Omega-3 Multivitamins",
    category: "Medicine",
    location: "Cabinet",
    days: 120,
    quantity: "60 Caps",
    barcode: "8901148291042",
  },
  {
    name: "Pasta Marinara Sauce",
    category: "Pantry",
    location: "Fridge",
    days: 7,
    quantity: "350 g",
    barcode: "8902109843121",
  },
  {
    name: "Frozen Green Peas",
    category: "Food & Dairy",
    location: "Freezer",
    days: 90,
    quantity: "500 g",
    barcode: "8901725121044",
  },
];

export const CATEGORIES = [
  "All",
  "Food & Dairy",
  "Cosmetics",
  "Medicine",
  "Pantry",
  "Other",
];

export const LOCATIONS = [
  "All",
  "Fridge",
  "Freezer",
  "Pantry",
  "Cabinet",
  "Vanity",
];

export const SORT_OPTIONS = [
  { value: "urgent", label: "Urgency (Expiring First)" },
  { value: "fresh", label: "Freshest First" },
  { value: "alpha", label: "Name (A - Z)" },
];
