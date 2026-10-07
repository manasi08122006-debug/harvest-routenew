import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Get produce catalog with farm comparisons
router.get("/", (req, res) => {
  const { category, search } = req.query;
  let catalog = store.getProduceCatalog();

  if (category && category !== "All") {
    catalog = catalog.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    catalog = catalog.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q)
    );
  }

  res.json(catalog);
});

// Farmer adds or updates produce item
router.post("/", (req, res) => {
  const { farmerId, name, category, unit, price, stock, harvestReady, description, imageUrl } = req.body;
  if (!farmerId || !name || !price || stock === undefined) {
    return res.status(400).json({ error: "Missing required fields for produce listing." });
  }

  const item = store.addProduceItem(farmerId, {
    name,
    category,
    unit,
    price,
    stock,
    harvestReady,
    description,
    imageUrl
  });

  res.status(201).json(item);
});

// Update stock or price for a farmer
router.patch("/:produceId/stock", (req, res) => {
  const { produceId } = req.params;
  const { farmerId, stock, price } = req.body;
  
  if (!farmerId) return res.status(400).json({ error: "farmerId is required" });

  const updated = store.updateFarmerProduceStock(farmerId, produceId, stock, price);
  if (!updated) {
    return res.status(404).json({ error: "Produce or farmer listing not found" });
  }

  res.json(updated);
});

export default router;
