import express from "express";
import { store } from "../db/store.js";
import { MatchingEngine } from "../services/matchingEngine.js";

const router = express.Router();
const engine = new MatchingEngine(store);

// Preview order matching across local farmers
router.post("/preview", (req, res) => {
  const { items, restaurantId } = req.body;
  if (!items || !items.length) {
    return res.status(400).json({ error: "At least one item is required" });
  }

  const restaurant = store.getUserById(restaurantId) || {
    name: "Demo Kitchen",
    organization: "The Rustic Hearth",
    address: "442 Market St, Downtown"
  };

  try {
    const preview = engine.matchOrder(items, restaurant);
    res.json(preview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Trigger shortfall / failure reassignment
router.post("/simulate-shortfall", (req, res) => {
  const { orderId, farmerId, produceId, shortfallQty, reason } = req.body;
  if (!orderId || !farmerId) {
    return res.status(400).json({ error: "orderId and farmerId are required" });
  }

  try {
    const result = engine.handleShortfall(orderId, farmerId, produceId, shortfallQty, reason);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
