/**
 * Harvest Route - Backend Server
 * Supports both Express and native Node.js HTTP fallback for zero-dependency execution.
 */

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { store } from "./db/store.js";
import { MatchingEngine } from "./services/matchingEngine.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;
const CLIENT_DIR = path.join(__dirname, "../client");

const matchingEngine = new MatchingEngine(store);

// Helper to parse JSON body
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on("error", reject);
  });
}

// Universal Router Handler
async function handleRequest(req, res) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const jsonResponse = (statusCode, data) => {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  };

  try {
    // API Routes
    if (pathname.startsWith("/api/")) {

      // Auth
      if (pathname === "/api/auth/demo-login" && method === "POST") {
        const body = await parseJsonBody(req);
        const users = store.getUsers();
        let user = users.find(u => u.role === body.role);
        if (!user) return jsonResponse(404, { error: "User not found" });
        return jsonResponse(200, { token: `token_${user.id}_${Date.now()}`, user });
      }

      if (pathname === "/api/auth/login" && method === "POST") {
        const body = await parseJsonBody(req);
        const user = store.getUserByEmail(body.email || "");
        if (!user) return jsonResponse(401, { error: "Invalid credentials" });
        return jsonResponse(200, { token: `token_${user.id}_${Date.now()}`, user });
      }

      if (pathname === "/api/auth/signup" && method === "POST") {
        const body = await parseJsonBody(req);
        if (!body.email || !body.role || !body.name) {
          return jsonResponse(400, { error: "Missing required fields" });
        }
        const newUser = store.createUser({
          email: body.email,
          role: body.role,
          name: body.name,
          organization: body.organization || body.name,
          phone: body.phone || "+1 (555) 000-0000",
          address: body.address || "Local Address",
          cuisine: body.cuisine,
          volume: body.volume,
          capacity: body.capacity,
          crops: body.crops,
          stripeConnected: true
        });
        return jsonResponse(201, { token: `token_${newUser.id}_${Date.now()}`, user: newUser });
      }

      // Produce
      if (pathname === "/api/produce" && method === "GET") {
        const category = parsedUrl.searchParams.get("category");
        const search = parsedUrl.searchParams.get("search");
        let catalog = store.getProduceCatalog();
        if (category && category !== "All") {
          catalog = catalog.filter(p => p.category.toLowerCase() === category.toLowerCase());
        }
        if (search) {
          const q = search.toLowerCase();
          catalog = catalog.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
        }
        return jsonResponse(200, catalog);
      }

      if (pathname === "/api/produce" && method === "POST") {
        const body = await parseJsonBody(req);
        const item = store.addProduceItem(body.farmerId, body);
        return jsonResponse(201, item);
      }

      if (pathname.match(/^\/api\/produce\/([^/]+)\/stock$/) && method === "PATCH") {
        const produceId = pathname.split("/")[3];
        const body = await parseJsonBody(req);
        const updated = store.updateFarmerProduceStock(body.farmerId, produceId, body.stock, body.price);
        return jsonResponse(200, updated || { error: "Item not found" });
      }

      // Matching Engine
      if (pathname === "/api/matching/preview" && method === "POST") {
        const body = await parseJsonBody(req);
        const restaurant = store.getUserById(body.restaurantId) || {
          organization: "The Rustic Hearth",
          address: "442 Market St, Downtown"
        };
        const match = matchingEngine.matchOrder(body.items || [], restaurant);
        return jsonResponse(200, match);
      }

      if (pathname === "/api/matching/simulate-shortfall" && method === "POST") {
        const body = await parseJsonBody(req);
        const result = matchingEngine.handleShortfall(
          body.orderId,
          body.farmerId,
          body.produceId,
          body.shortfallQty,
          body.reason
        );
        return jsonResponse(200, result);
      }

      // Orders
      if (pathname === "/api/orders" && method === "GET") {
        const userId = parsedUrl.searchParams.get("userId");
        const role = parsedUrl.searchParams.get("role");
        const orders = store.getOrdersForUser(userId, role);
        return jsonResponse(200, orders);
      }

      if (pathname === "/api/orders" && method === "POST") {
        const body = await parseJsonBody(req);
        const restaurant = store.getUserById(body.restaurantId) || {
          organization: "The Rustic Hearth",
          address: body.deliveryAddress || "442 Market St, Downtown"
        };
        const match = matchingEngine.matchOrder(body.items || [], restaurant);
        const newOrder = store.createOrder({
          restaurantId: body.restaurantId,
          restaurantName: restaurant.organization || restaurant.name,
          deliveryDate: body.deliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
          deliveryTimeSlot: body.deliveryTimeSlot || "11:00 AM - 1:00 PM (Lunch Prep Window)",
          deliveryAddress: body.deliveryAddress || restaurant.address,
          totalAmount: match.totalAmount,
          redundancyLevel: match.redundancyLevel,
          routeOptimization: match.routeOptimization,
          consolidationScore: match.consolidationScore,
          allocations: match.allocations,
          contributingFarmers: match.contributingFarmers,
          backupPlan: match.backupPlan,
          itemsList: body.items.map(item => ({
            name: item.name,
            qty: item.qty,
            unit: item.unit || "kg",
            price: item.price || 4.50,
            allocatedFarm: match.allocations.find(a => a.produceName === item.name)?.farmName || "Local Farm"
          })),
          isRecurring: !!body.isRecurring
        });
        return jsonResponse(201, newOrder);
      }

      if (pathname.match(/^\/api\/orders\/([^/]+)\/status$/) && method === "PATCH") {
        const orderId = pathname.split("/")[3];
        const body = await parseJsonBody(req);
        const updated = store.updateOrderStatus(orderId, body.status, body.stepIndex);
        return jsonResponse(200, updated || { error: "Order not found" });
      }

      if (pathname.match(/^\/api\/orders\/([^/]+)\/reorder$/) && method === "POST") {
        const orderId = pathname.split("/")[3];
        const pastOrder = store.getOrderById(orderId);
        if (!pastOrder) return jsonResponse(404, { error: "Order not found" });
        const items = pastOrder.itemsList || [];
        const match = matchingEngine.matchOrder(items, { organization: pastOrder.restaurantName });
        const newOrder = store.createOrder({
          restaurantId: pastOrder.restaurantId,
          restaurantName: pastOrder.restaurantName,
          deliveryDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          deliveryTimeSlot: pastOrder.deliveryTimeSlot,
          deliveryAddress: pastOrder.deliveryAddress,
          totalAmount: match.totalAmount,
          redundancyLevel: match.redundancyLevel,
          routeOptimization: match.routeOptimization,
          consolidationScore: match.consolidationScore,
          allocations: match.allocations,
          contributingFarmers: match.contributingFarmers,
          backupPlan: match.backupPlan,
          itemsList: items,
          isRecurring: false
        });
        return jsonResponse(201, newOrder);
      }

      // Farmers
      if (pathname === "/api/farmers" && method === "GET") {
        return jsonResponse(200, store.getFarmers());
      }

      if (pathname.match(/^\/api\/farmers\/([^/]+)\/dashboard$/) && method === "GET") {
        const farmerId = pathname.split("/")[3];
        const farmer = store.getUserById(farmerId);
        if (!farmer) return jsonResponse(404, { error: "Farmer not found" });

        const allOrders = store.getOrders();
        const farmerOrders = allOrders.filter(o => o.contributingFarmers?.some(f => f.farmerId === farmer.id));
        let totalEarned = 0;
        const payoutHistory = [];

        farmerOrders.forEach(o => {
          const c = o.contributingFarmers?.find(f => f.farmerId === farmer.id);
          if (c) {
            totalEarned += c.amount;
            payoutHistory.push({
              orderId: o.id,
              restaurantName: o.restaurantName,
              deliveryDate: o.deliveryDate,
              amount: c.amount,
              items: c.items,
              status: o.status === "delivered" ? "Deposited" : "In Escrow / Pending Delivery",
              payoutMethod: "Stripe Direct Connect"
            });
          }
        });

        const catalog = store.getProduceCatalog();
        const myListings = [];
        catalog.forEach(item => {
          const p = item.farmPrices.find(fp => fp.farmerId === farmer.id);
          if (p) {
            myListings.push({
              produceId: item.id,
              name: item.name,
              category: item.category,
              unit: item.unit,
              price: p.price,
              stock: p.stock,
              harvestReady: p.harvestReady,
              imageUrl: item.imageUrl
            });
          }
        });

        return jsonResponse(200, {
          farmer,
          metrics: {
            totalEarnings: Math.round(totalEarned * 100) / 100,
            activeDeliveries: farmerOrders.filter(o => o.status !== "delivered").length,
            completedOrders: farmerOrders.filter(o => o.status === "delivered").length,
            onTimeRate: farmer.onTimeRate || 99.4,
            qualityRating: farmer.qualityRating || 4.9
          },
          upcomingCommitments: farmerOrders.filter(o => o.status !== "delivered").map(o => ({
            orderId: o.id,
            restaurantName: o.restaurantName,
            deliveryDate: o.deliveryDate,
            timeSlot: o.deliveryTimeSlot,
            status: o.status,
            myContribution: o.contributingFarmers?.find(f => f.farmerId === farmer.id)
          })),
          payoutHistory,
          myListings
        });
      }

      // Restaurants
      if (pathname.match(/^\/api\/restaurants\/([^/]+)\/invoices$/) && method === "GET") {
        const restId = pathname.split("/")[3];
        const orders = store.getOrdersForUser(restId, "restaurant");
        const invoices = orders.map(order => ({
          invoiceNumber: `INV-${order.id.replace('ORD-', '')}`,
          orderId: order.id,
          date: order.deliveryDate,
          totalAmount: order.totalAmount,
          status: order.paymentStatus === "paid_stripe" ? "Paid" : "Pending",
          paymentMethod: "Stripe Test Card (Visa •••• 4242)",
          consolidatedRoute: order.routeOptimization,
          itemizedFarmerSplits: order.contributingFarmers?.map(cf => ({
            farmName: cf.farmName,
            items: cf.items,
            amount: cf.amount,
            payoutStatus: "Disbursed via Stripe"
          })) || []
        }));
        return jsonResponse(200, invoices);
      }

      if (pathname.match(/^\/api\/restaurants\/([^/]+)\/recurring$/) && method === "GET") {
        const restId = pathname.split("/")[3];
        return jsonResponse(200, store.getRecurringOrders(restId));
      }

      if (pathname.match(/^\/api\/restaurants\/([^/]+)\/recurring$/) && method === "POST") {
        const restId = pathname.split("/")[3];
        const body = await parseJsonBody(req);
        const recOrder = store.createRecurringOrder({
          restaurantId: restId,
          title: body.title || "Weekly Farm Replenishment",
          frequency: body.frequency || "weekly",
          deliveryDays: body.deliveryDays || ["Tuesday", "Friday"],
          timeSlot: body.timeSlot || "10:30 AM",
          items: body.items || []
        });
        return jsonResponse(201, recOrder);
      }

      if (pathname === "/api/restaurants/reviews" && method === "POST") {
        const body = await parseJsonBody(req);
        const review = store.addReview(body);
        return jsonResponse(201, review);
      }

      // Admin
      if (pathname === "/api/admin/overview" && method === "GET") {
        const analytics = store.getAnalytics();
        const allOrders = store.getOrders();
        const farmers = store.getFarmers();
        const restaurants = store.getUsers().filter(u => u.role === "restaurant");

        const farmerScorecards = farmers.map(f => {
          const fOrders = allOrders.filter(o => o.contributingFarmers?.some(cf => cf.farmerId === f.id));
          return {
            id: f.id,
            name: f.organization || f.name,
            address: f.address,
            onTimeRate: f.onTimeRate || 98.0,
            qualityRating: f.qualityRating || 4.8,
            capacity: f.capacity,
            activeOrderCount: fOrders.filter(o => o.status !== "delivered").length,
            totalOrdersHandled: fOrders.length,
            reliabilityRank: f.onTimeRate > 98 ? "Tier 1: Preferred Network" : "Tier 2: Standard Provider",
            isDesignatedStandby: f.organization?.includes("Co-Op") || f.organization?.includes("Standby")
          };
        });

        return jsonResponse(200, {
          analytics,
          farmerScorecards,
          restaurantStats: restaurants.map(r => ({
            id: r.id,
            name: r.organization || r.name,
            cuisine: r.cuisine,
            ordersPlaced: allOrders.filter(o => o.restaurantId === r.id).length,
            totalSpent: allOrders.filter(o => o.restaurantId === r.id).reduce((s, o) => s + (o.totalAmount || 0), 0)
          })),
          liveOrders: allOrders
        });
      }

      // Notifications
      if (pathname === "/api/notifications" && method === "GET") {
        const userId = parsedUrl.searchParams.get("userId");
        return jsonResponse(200, store.getNotifications(userId));
      }

      if (pathname.match(/^\/api\/notifications\/([^/]+)\/read$/) && method === "PATCH") {
        const notifId = pathname.split("/")[3];
        return jsonResponse(200, store.markNotificationRead(notifId) || { success: true });
      }

      // Payments
      if (pathname === "/api/payments/checkout-preview" && method === "POST") {
        const body = await parseJsonBody(req);
        const amount = Number(body.totalAmount || 0);
        const platformFee = Math.round(amount * 0.05 * 100) / 100;
        const netFarmerPool = Math.round((amount - platformFee) * 100) / 100;
        const splits = (body.contributingFarmers || []).map(f => ({
          farmerId: f.farmerId,
          farmName: f.farmName,
          grossAmount: Number(f.amount || 0),
          netPayoutToStripeAccount: Math.round((Number(f.amount || 0) * 0.95) * 100) / 100,
          stripeConnectedStatus: "Connected & Verified"
        }));

        return jsonResponse(200, {
          grossTotal: amount,
          platformFee,
          netFarmerPool,
          splits,
          stripeMode: "Test Mode (pk_test_harvest_route_demo_key)"
        });
      }

      if (pathname === "/api/payments/process-payment" && method === "POST") {
        const body = await parseJsonBody(req);
        if (body.orderId) {
          const order = store.getOrderById(body.orderId);
          if (order) {
            order.paymentStatus = "paid_stripe";
            order.last4 = body.testCardLast4 || "4242";
            store.saveOrder(order);
          }
        }
        return jsonResponse(200, {
          success: true,
          status: "succeeded",
          chargeId: `ch_test_${Date.now()}`,
          receiptUrl: `https://harvestroute.local/receipts/inv-${Date.now()}`
        });
      }
    }

    // Static frontend serving fallback (index.html, assets)
    let filePath = path.join(CLIENT_DIR, pathname === "/" ? "index.html" : pathname);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(CLIENT_DIR, "index.html");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const mimeTypes = {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".svg": "image/svg+xml"
      };
      res.writeHead(200, { "Content-Type": mimeTypes[ext] || "text/plain" });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    return jsonResponse(404, { error: "Not found" });
  } catch (err) {
    console.error("Server Error:", err);
    return jsonResponse(500, { error: err.message });
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🌾 HARVEST ROUTE - Local Farm Redundancy Platform`);
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints live at http://localhost:${PORT}/api/`);
  console.log(`======================================================\n`);
});
