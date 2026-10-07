import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Get restaurant profile and overview
router.get("/:id", (req, res) => {
  const restaurant = store.getUserById(req.params.id);
  if (!restaurant) return res.status(404).json({ error: "Restaurant not found" });
  res.json(restaurant);
});

// Get recurring orders
router.get("/:id/recurring", (req, res) => {
  const recurring = store.getRecurringOrders(req.params.id);
  res.json(recurring);
});

// Create recurring order
router.post("/:id/recurring", (req, res) => {
  const { title, frequency, deliveryDays, timeSlot, items } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: "Items are required for recurring orders" });
  }

  const recOrder = store.createRecurringOrder({
    restaurantId: req.params.id,
    title: title || "Weekly Farm Replenishment",
    frequency: frequency || "weekly",
    deliveryDays: deliveryDays || ["Tuesday", "Friday"],
    timeSlot: timeSlot || "10:30 AM",
    items
  });

  res.status(201).json(recOrder);
});

// Submit farmer review
router.post("/reviews", (req, res) => {
  const { orderId, restaurantName, farmerId, farmName, rating, comment } = req.body;
  if (!orderId || !farmerId || !rating) {
    return res.status(400).json({ error: "Missing required review fields" });
  }

  const review = store.addReview({
    orderId,
    restaurantName: restaurantName || "The Rustic Hearth",
    farmerId,
    farmName: farmName || "Local Farm",
    rating: Number(rating),
    comment: comment || "Great produce quality."
  });

  res.status(201).json(review);
});

// Get invoices breakdown
router.get("/:id/invoices", (req, res) => {
  const orders = store.getOrdersForUser(req.params.id, "restaurant");
  
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
      payoutStatus: "Disbursed"
    })) || []
  }));

  res.json(invoices);
});

export default router;
