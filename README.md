# 🌾 Harvest Route

**Harvest Route** is a full-stack platform that connects independent restaurants with a coordinated, redundant network of regional local farmers. Instead of relying on a single, distant industrial supplier, Harvest Route pools certified local farms into a decentralized network to ensure chef-grade freshness, zero menu disruptions from single-supplier failures, and consolidated single-vehicle drop-offs.

---

## 🌟 Key Features

### 1. Earthy Artisanal Landing Page
- **Palette**: Forest green (`#153329`, `#235A48`), soil brown (`#543F2D`, `#8E6F52`), harvest gold (`#E09F3E`), and warm cream off-white (`#FAF7F2`).
- **Typography**: Editorial serif display headings (`Playfair Display`) paired with clean sans-serif body text (`Inter`).
- **Header**: Logo badge, quick nav, multilingual switcher, and instant demo login shortcuts.
- **Hero**: *"Fresh produce, delivered on time — from farms near your kitchen"*.
- **Problem vs. Solution**: 3-column breakdown comparing single distant suppliers with decentralized multi-farm networks.
- **4-Step Flow**: Order Placed → Matched to Nearby Farmers → Dawn Harvest Confirmed → Consolidated Single-Vehicle Delivery.
- **Split Benefits**: Dedicated value propositions for both regional farmers and chef kitchens.
- **Trust Metrics**: 48+ Local Farms, 130+ Kitchens, 3.8-hour farm-to-kitchen transit, 99.4% on-time delivery rate.
- **Multi-Language Selector**: Seamless live switching between **English (EN)**, **Español (ES)**, **Français (FR)**, and **Italiano (IT)**.

### 2. Multi-Role Authentication & 1-Click Demo Logins
- **Restaurant Profile**: Kitchen name, cuisine type, prep receiving window, weekly volume.
- **Farmer Profile**: Farm name, distance, crops grown, weekly capacity, Stripe Connect status.
- **Demo Quick Access**:
  - 👨‍🍳 **Demo Restaurant**: Chef Marcus Vance (*The Rustic Hearth*, Bistro)
  - 🌾 **Demo Farmer**: Elena Rostova (*Green Meadow Organics*, 99.4% on-time)
  - 🛡️ **Demo Admin**: Central Logistics Coordinator

### 3. Intelligent Matching & Redundancy Engine
- **Composite Scoring**: Evaluates candidate farms by weighted criteria:
  $$\text{Score} = (0.45 \times \text{On-Time \%}) + \left(0.35 \times \frac{\text{Rating}}{5} \times 100\right) + (0.20 \times \max(0, 100 - \text{Miles} \times 3.5))$$
- **Automatic Multi-Farm Split**: Splits order quantities across 2–4 nearby farms to prevent over-burdening any single farm and eliminate single points of failure.
- **Pre-Designated Backup Standby**: Automatically reserves standby inventory at high-capacity regional co-ops (e.g., *Riverbend Co-Op*).
- **Automated Shortfall Failover**: If a grower flags frost or yield shortfall, the engine automatically re-routes the quota to the standby farm in seconds without customer disruption.
- **Consolidated Route Optimization**: Combines farm pickups into a single temperature-controlled van route for a single kitchen drop-off.

### 4. Restaurant Kitchen Dashboard
- **Produce Marketplace**: Browse vegetables with a live **Local Farm Price Comparison Matrix** showing distance, prices, and stock across growers.
- **Redundancy Allocation Preview**: Shows how the order will be split between farms before checkout.
- **Live Order Tracker**: Real-time visual progress across 4 stages (Confirmed → Harvesting → In Transit → Delivered).
- **Standing & Recurring Orders**: Set automated weekly or daily pantry replenishment.
- **Itemized Invoices**: Complete breakdown showing exact amounts paid to each contributing farmer.
- **Farmer Ratings & Reviews**: Rate produce quality and on-time performance post-delivery.

### 5. Regional Farmer Dashboard
- **Crop Inventory Hub**: List produce, specify harvest-ready dates, set crate prices, and update stock.
- **Matched Order Requests**: Accept orders or test the **⚠️ Simulate Shortfall** trigger to watch automated backup failover in real-time.
- **Delivery Calendar**: Upcoming harvest commitments and pickup slots.
- **Earnings & Stripe Connect**: Real-time balance, pending escrow funds, and 95% net payout ledger.

### 6. Admin Logistics Dashboard
- **Live Network Operations**: Monitor all orders across the region with live route and redundancy status.
- **Dispute & Shortfall Management**: Quick manual and automated failover logging.
- **Farmer Scorecards & KPIs**: Track on-time rates, quality stars, and platform volume.

### 7. Notifications & Alerts
- Simulated SMS & Email alerts dispatched to kitchens and farmers upon order matching, van departure, and failover protection.

### 8. Stripe Test Mode Checkout
- Interactive test-card modal (`4242 •••• •••• 4242`) with automated 95% farmer payout splitting and 5% network coordination fee.

---

## 🚀 How to Run the Application

The project is located at:
`C:\Users\saksh\.gemini\antigravity\scratch\harvest-route`

> [!TIP]
> **Recommended Workspace**: Set `C:\Users\saksh\.gemini\antigravity\scratch\harvest-route` as your active workspace in Antigravity.

### Option A: Instant Zero-Dependency Browser Launch
Double-click or open `client/index.html` in your web browser. Everything (React 18, Tailwind styling, translation engine, full matching simulator, Stripe test checkout, and all dashboards) runs instantly with zero npm setup needed!

### Option B: Run with the Node.js Server
From terminal:
```bash
cd server
node server.js
```
The server will start at:
- **Web Interface**: `http://localhost:5000`
- **REST APIs**: `http://localhost:5000/api/...`
  - `/api/produce`
  - `/api/matching/preview`
  - `/api/orders`
  - `/api/farmers`
  - `/api/admin/overview`
  - `/api/notifications`

---

## 📁 Project Structure

```
harvest-route/
├── package.json
├── README.md
├── server/
│   ├── package.json
│   ├── server.js              # Universal Node.js HTTP server & API router
│   ├── db/
│   │   └── store.js           # Relational persistent store & JSON file sync
│   ├── data/
│   │   ├── seedData.js        # Seed records for farms, kitchens, catalog, orders
│   │   └── harvest_route.json # Persistent state file
│   ├── services/
│   │   └── matchingEngine.js  # Redundancy, scoring, and shortfall failover algorithm
│   └── routes/
│       ├── auth.js            # Authentication & demo logins
│       ├── produce.js         # Produce marketplace & price comparisons
│       ├── orders.js          # Order placement, status tracking & reorders
│       ├── matching.js        # Redundancy split preview & shortfall triggers
│       ├── farmers.js         # Farmer commitments, inventory & earnings
│       ├── restaurants.js     # Recurring orders, invoices & reviews
│       ├── admin.js           # Analytics, scorecard & disputes
│       ├── notifications.js   # Alerts stream & SMS logs
│       └── payments.js        # Stripe test checkout & payout splitting
└── client/
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── index.html             # Master standalone responsive SPA with complete features
    └── src/
        ├── index.css
        ├── App.jsx            # Modular React application
        ├── main.jsx
        └── data/
            └── translations.js # Multi-language dictionaries (EN, ES, FR, IT)
```
