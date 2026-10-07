import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Get all farmers with profiles and metrics
router.get("/", (req, res) => {
  const farmers = store.getFarmers();
  res.json(farmers);
});

// Get farmer dashboard summary (earnings, upcoming commitments, inventory)
router.get("/:id/dashboard", (req, res) => {
  const farmer = store.getUserById(req.params.id);
  if (!farmer) return res.status(404).json({ error: "Farmer not found" });

  const allOrders = store.getOrders();
  const farmerOrders = allOrders.filter(o => 
    o.contributingFarmers?.some(f => f.farmerId === farmer.id)
  );

  const pendingCommitments = farmerOrders.filter(o => o.status !== "delivered");
  const pastDeliveries = farmerOrders.filter(o => o.status === "delivered");

  // Calculate earnings
  let totalEarned = 0;
  const payoutHistory = [];

  farmerOrders.forEach(o => {
    const contribution = o.contributingFarmers?.find(f => f.farmerId === farmer.id);
    if (contribution) {
      totalEarned += contribution.amount;
      payoutHistory.push({
        orderId: o.id,
        restaurantName: o.restaurantName,
        deliveryDate: o.deliveryDate,
        amount: contribution.amount,
        items: contribution.items,
        status: o.status === "delivered" ? "Deposited" : "In Escrow / Pending Delivery",
        payoutMethod: "Stripe Direct Connect"
      });
    }
  });

  // Collect active produce listings for this farmer
  const catalog = store.getProduceCatalog();
  const myListings = [];
  catalog.forEach(item => {
    const pEntry = item.farmPrices.find(fp => fp.farmerId === farmer.id);
    if (pEntry) {
      myListings.push({
        produceId: item.id,
        name: item.name,
        category: item.category,
        unit: item.unit,
        price: pEntry.price,
        stock: pEntry.stock,
        harvestReady: pEntry.harvestReady,
        imageUrl: item.imageUrl
      });
    }
  });

  res.json({
    farmer,
    metrics: {
      totalEarnings: Math.round(totalEarned * 100) / 100,
      activeDeliveries: pendingCommitments.length,
      completedOrders: pastDeliveries.length,
      onTimeRate: farmer.onTimeRate || 99.0,
      qualityRating: farmer.qualityRating || 4.9
    },
    upcomingCommitments: pendingCommitments.map(o => ({
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
});

export default router;
