import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Get notifications for user or all
router.get("/", (req, res) => {
  const { userId } = req.query;
  const notifs = store.getNotifications(userId);
  res.json(notifs);
});

// Mark as read
router.patch("/:id/read", (req, res) => {
  const updated = store.markNotificationRead(req.params.id);
  res.json(updated || { success: true });
});

// Post a new test alert (e.g. simulated SMS alert)
router.post("/simulate-alert", (req, res) => {
  const { userId, role, title, message, channel, type } = req.body;
  const notif = store.addNotification({
    userId: userId || "usr_rest_1",
    role: role || "restaurant",
    title: title || "Delivery Dispatch Notice",
    message: message || "Your driver has departed the pickup hub.",
    channel: channel || "SMS (+1 555-234-8901)",
    type: type || "dispatch"
  });
  res.status(201).json(notif);
});

export default router;
