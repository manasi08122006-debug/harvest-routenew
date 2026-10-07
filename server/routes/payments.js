import express from "express";
import { store } from "../db/store.js";

const router = express.Router();

// Preview or execute Stripe test payout splitting for an order
router.post("/checkout-preview", (req, res) => {
  const { totalAmount, contributingFarmers } = req.body;
  if (!totalAmount) {
    return res.status(400).json({ error: "totalAmount is required" });
  }

  const amount = Number(totalAmount);
  const platformFee = Math.round(amount * 0.05 * 100) / 100; // 5% network coordination fee
  const netFarmerPool = Math.round((amount - platformFee) * 100) / 100;

  // Split payouts proportionally across farmers
  const splits = (contributingFarmers || []).map(f => {
    const rawAmt = Number(f.amount || 0);
    const farmerNet = Math.round((rawAmt * 0.95) * 100) / 100;
    return {
      farmerId: f.farmerId,
      farmName: f.farmName,
      grossAmount: rawAmt,
      platformFeeContribution: Math.round((rawAmt * 0.05) * 100) / 100,
      netPayoutToStripeAccount: farmerNet,
      stripeConnectedStatus: "Connected & Verified"
    };
  });

  res.json({
    grossTotal: amount,
    platformFee,
    netFarmerPool,
    splits,
    currency: "USD",
    stripeMode: "Test Mode (pk_test_harvest_route_demo_key)"
  });
});

// Process simulated Stripe charge
router.post("/process-payment", (req, res) => {
  const { orderId, amount, paymentMethodId, testCardLast4 } = req.body;
  
  if (orderId) {
    const order = store.getOrderById(orderId);
    if (order) {
      order.paymentStatus = "paid_stripe";
      order.stripeChargeId = `ch_test_${Math.random().toString(36).substring(2, 12)}`;
      order.last4 = testCardLast4 || "4242";
      store.saveOrder(order);
    }
  }

  res.json({
    success: true,
    status: "succeeded",
    chargeId: `ch_test_${Date.now()}`,
    receiptUrl: `https://harvestroute.local/receipts/inv-${Date.now()}`,
    amountPaid: amount,
    cardBrand: "Visa Test",
    last4: testCardLast4 || "4242"
  });
});

export default router;
