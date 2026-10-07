import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Get full platform overview & metrics
router.get("/overview", (req, res) => {
  const analytics = store.getAnalytics();
  const allOrders = store.getOrders();
  const farmers = store.getFarmers();
  const restaurants = store.getUsers().filter(u => u.role === "restaurant");

  // Farmer reliability scorecard
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

  // Restaurant volume tracker
  const restaurantStats = restaurants.map(r => {
    const rOrders = allOrders.filter(o => o.restaurantId === r.id);
    const totalSpent = rOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    return {
      id: r.id,
      name: r.organization || r.name,
      cuisine: r.cuisine,
      address: r.address,
      ordersPlaced: rOrders.length,
      totalSpent: Math.round(totalSpent * 100) / 100,
      typicalVolume: r.volume
    };
  });

  res.json({
    analytics,
    farmerScorecards,
    restaurantStats,
    liveOrders: allOrders
  });
});

// Flag or resolve a dispute / delay
router.post("/disputes/resolve", (req, res) => {
  const { disputeId, orderId, resolution } = req.body;
  
  if (orderId) {
    const order = store.getOrderById(orderId);
    if (order) {
      order.disputeStatus = "resolved_by_admin";
      order.adminNotes = resolution || "Dispute resolved by platform coordinator";
      store.saveOrder(order);
    }
  }

  store.addNotification({
    userId: "usr_rest_1",
    role: "restaurant",
    title: "Platform Coordinator Update",
    message: `Resolution applied to Order #${orderId || 'Active'}: ${resolution || 'Shipment status verified.'}`,
    type: "admin_action",
    channel: "In-App & Email"
  });

  res.json({ success: true, message: "Dispute handled and logged" });
});

export default router;
