import React, { useState, useMemo } from "react";
import { TRANSLATIONS } from "./data/translations.js";

const APP_USERS = {
  restaurant: {
    id: "usr_rest_1",
    email: "chef@spiceroute.in",
    role: "restaurant",
    name: "Chef Ananya Deshmukh",
    organization: "The Spice Route Bistro",
    address: "Plot 42, High Street, Pune-Mumbai Highway",
    cuisine: "Regional Indian & Contemporary Kitchen",
    volume: "50-70 crates/week",
    rating: 4.9
  },
  farmer: {
    id: "usr_farm_1",
    email: "ramesh@sahyadriagro.in",
    role: "farmer",
    name: "Ramesh Patil",
    organization: "Sahyadri Agro Producer Co.",
    address: "Survey 114, Junnar Valley, Pune District (12 km)",
    capacity: "2,500 kg/week",
    crops: ["Desi Tomatoes", "Organic Spinach", "Fresh Coriander", "Fresh Mint"],
    onTimeRate: 99.4,
    qualityRating: 4.95,
    totalEarnings: 184500.00,
    stripeConnected: true
  }
};

const INDIAN_PRODUCE = [
  {
    id: "prod_1",
    name: "Desi Red Tomatoes (गावठी टोमॅटो / देशी टमाटर)",
    category: "Vine Produce",
    unit: "kg",
    description: "Naturally vine-ripened, juicy, firm grading with natural acidity. Picked early morning.",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    farmPrices: [
      { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 38.00, stock: 240, harvestReady: "Today Morning", distance: "12 km" },
      { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 40.00, stock: 160, harvestReady: "Today Afternoon", distance: "18 km" },
      { farmerId: "usr_farm_4", farmName: "Maharashtra Krishi FPC (Standby)", price: 36.00, stock: 800, harvestReady: "Available on Call", distance: "22 km" }
    ]
  },
  {
    id: "prod_2",
    name: "Organic Green Spinach (पालक / Palak)",
    category: "Leafy Greens",
    unit: "kg",
    description: "Broad tender leaves, chemical-free irrigation, zero sand grit, bunched fresh at dawn.",
    imageUrl: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=600&q=80",
    farmPrices: [
      { farmerId: "usr_farm_1", farmName: "Sahyadri Agro Producer Co.", price: 25.00, stock: 180, harvestReady: "Picked 6 AM Today", distance: "12 km" },
      { farmerId: "usr_farm_3", farmName: "Bhimashankar Organic Cluster", price: 26.00, stock: 120, harvestReady: "Today", distance: "15 km" }
    ]
  },
  {
    id: "prod_3",
    name: "Nashik Red Onions (नाशिक कांदा / लाल प्याज)",
    category: "Root Vegetables",
    unit: "kg",
    description: "Lasalgaon grade red onions, cured skin, high pungency, uniform bulb grading (55mm+).",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    farmPrices: [
      { farmerId: "usr_farm_2", farmName: "Godavari Fresh Farms", price: 28.00, stock: 650, harvestReady: "Cured & Ready", distance: "18 km" }
    ]
  }
];

export default function App() {
  const [lang, setLang] = useState("en");
  const [currentView, setCurrentView] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const navigateTo = (view) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(view);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentView(view);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIdx = historyIndex - 1;
      setHistoryIndex(newIdx);
      setCurrentView(history[newIdx]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIdx = historyIndex + 1;
      setHistoryIndex(newIdx);
      setCurrentView(history[newIdx]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2A1E15] font-sans">
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur border-b border-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-earth-200/70 p-1 rounded-xl border border-earth-300">
              <button onClick={goBack} disabled={historyIndex === 0} className={`p-1.5 rounded-lg ${historyIndex > 0 ? 'text-forest-900 hover:bg-earth-300' : 'text-earth-400'}`}>
                &larr;
              </button>
              <button onClick={goForward} disabled={historyIndex >= history.length - 1} className={`p-1.5 rounded-lg ${historyIndex < history.length - 1 ? 'text-forest-900 hover:bg-earth-300' : 'text-earth-400'}`}>
                &rarr;
              </button>
            </div>
            <div className="cursor-pointer" onClick={() => navigateTo('home')}>
              <span className="font-serif text-2xl font-bold tracking-tight text-forest-950 block leading-none">Harvest Route</span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-earth-500">Local Farm Redundancy</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo(currentView === 'home' ? 'restaurant' : 'home')} className="px-3.5 py-2 text-xs font-bold rounded-lg bg-forest-800 text-white">
              {t.nav.dashboard}
            </button>
            <select value={lang} onChange={e => setLang(e.target.value)} className="bg-earth-100 border border-earth-300 text-forest-900 text-xs rounded-lg px-2.5 py-1.5 font-medium">
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-12 w-full">
        {currentView === 'home' ? (
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-bold tracking-widest uppercase">{t.hero.tagline}</span>
            <h1 className="font-serif text-5xl font-bold text-forest-950 leading-tight">{t.hero.headline}</h1>
            <p className="text-earth-700 text-base leading-relaxed">{t.hero.subheadline}</p>
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={() => navigateTo('restaurant')} className="px-6 py-3 bg-forest-800 text-white rounded-xl font-bold text-xs shadow">{t.hero.orderCTA}</button>
              <button onClick={() => navigateTo('farmer')} className="px-6 py-3 bg-earth-200 text-forest-950 rounded-xl font-bold text-xs shadow">{t.hero.farmerCTA}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-earth-300">
              <h2 className="font-serif text-3xl font-bold text-forest-950">
                {currentView === 'restaurant' ? 'The Spice Route Bistro (Kitchen Operations)' : 'Sahyadri Agro Producer Co. (Grower Portal)'}
              </h2>
              <button onClick={() => navigateTo('home')} className="px-3 py-1.5 rounded-lg border border-earth-300 text-xs font-semibold">
                Back to Overview
              </button>
            </div>
            <p className="text-xs text-earth-600">
              For complete full-featured interactive experience with photo upload, filters, crop, edit stock modal, and real-time order tracking, open <code>client/index.html</code>.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
