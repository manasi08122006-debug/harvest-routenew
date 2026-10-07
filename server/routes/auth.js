import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Demo login helper
router.post("/demo-login", (req, res) => {
  const { role } = req.body;
  const users = store.getUsers();
  let user = null;

  if (role === "restaurant") {
    user = users.find(u => u.role === "restaurant");
  } else if (role === "farmer") {
    user = users.find(u => u.role === "farmer");
  } else if (role === "admin") {
    user = users.find(u => u.role === "admin");
  }

  if (!user) {
    return res.status(404).json({ error: "Demo user not found" });
  }

  res.json({
    token: `token_${user.id}_${Date.now()}`,
    user
  });
});

// Standard login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = store.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: `token_${user.id}_${Date.now()}`,
    user
  });
});

// Standard registration with role profiles
router.post("/signup", (req, res) => {
  const { email, role, name, organization, phone, address, cuisine, volume, capacity, crops } = req.body;
  if (!email || !role || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const existing = store.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: "An account with this email already exists" });
  }

  const userData = {
    email,
    role,
    name,
    organization: organization || name,
    phone: phone || "+1 (555) 000-0000",
    address: address || "Local Address"
  };

  if (role === "restaurant") {
    userData.cuisine = cuisine || "Modern American";
    userData.volume = volume || "40-60 crates/week";
  } else if (role === "farmer") {
    userData.capacity = capacity || "1,000 kg/week";
    userData.crops = Array.isArray(crops) ? crops : (crops ? crops.split(",").map(s => s.trim()) : ["Vegetables"]);
    userData.onTimeRate = 100;
    userData.qualityRating = 5.0;
    userData.completedOrders = 0;
    userData.stripeConnected = true;
  }

  const newUser = store.createUser(userData);

  res.status(201).json({
    token: `token_${newUser.id}_${Date.now()}`,
    user: newUser
  });
});

export default router;
