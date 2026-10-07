import express from "express";
import { store } from "../db/store.js";
import { MatchingEngine } from "../services/matchingEngine.js";

const router = express.Router();
const engine = new MatchingEngine(store);

// Get orders based on role/userId
router.get("/", (req, res) => {
  const { userId, role } = req.query;
  const orders = store.getOrdersForUser(userId, role);
  res.json(orders);
});

// Get single order
router.get("/:id", (req, res) => {
  const order = store.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Place new order
router.post("/", (req, res) => {
  const {
    restaurantId,
    items,
    deliveryDate,
    deliveryTimeSlot,
    deliveryAddress,
    isRecurring
  } = req.body;

  if (!restaurantId || !items || !items.length) {
    return res.status(400).json({ error: "Restaurant ID and items are required" });
  }

  const restaurant = store.getUserById(restaurantId) || {
    name: "The Rustic Hearth",
    organization: "The Rustic Hearth",
    address: deliveryAddress || "442 Market Street, Downtown"
  };

  try {
    // Run the matching engine
    const match = engine.matchOrder(items, restaurant);

    const newOrder = store.createOrder({
      restaurantId,
      restaurantName: restaurant.organization || restaurant.name,
      deliveryDate: deliveryDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      deliveryTimeSlot: deliveryTimeSlot || "11:00 AM - 1:00 PM (Kitchen Prep Window)",
      deliveryAddress: deliveryAddress || restaurant.address,
      totalAmount: match.totalAmount,
      redundancyLevel: match.redundancyLevel,
      routeOptimization: match.routeOptimization,
      consolidationScore: match.consolidationScore,
      allocations: match.allocations,
      contributingFarmers: match.contributingFarmers,
      backupPlan: match.backupPlan,
      itemsList: items.map(item => ({
        name: item.name,
        qty: item.qty,
        unit: item.unit || "kg",
        price: item.price || 4.50,
        allocatedFarm: match.allocations.find(a => a.produceName === item.name)?.farmName || "Local Farm"
      })),
      isRecurring: !!isRecurring
    });

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update order status (Confirmed -> Harvesting -> In Transit -> Delivered)
router.patch("/:id/status", (req, res) => {
  const { status, stepIndex } = req.body;
  const order = store.updateOrderStatus(req.params.id, status, stepIndex);
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// 1-click Reorder
router.post("/:id/reorder", (req, res) => {
  const pastOrder = store.getOrderById(req.params.id);
  if (!pastOrder) return res.status(404).json({ error: "Past order not found" });

  const items = pastOrder.itemsList || [];
  const restaurant = store.getUserById(pastOrder.restaurantId);

  try {
    const match = engine.matchOrder(items, restaurant || { organization: pastOrder.restaurantName });

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

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
