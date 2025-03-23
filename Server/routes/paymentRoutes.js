const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { protect } = require("../middleware/authMiddleware"); 
const Booking = require("../models/Booking");

const router = express.Router();

// 📌 Process Payment
router.post("/pay", protect, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    console.log("📌 Payment Request Received:", { amount, bookingId });

    if (!amount || amount <= 0) {
      console.log("⚠ Invalid amount received:", amount);
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const amountInCents = Math.round(amount * 100);

    const booking = await Booking.findById(bookingId).populate("user").populate("event");
    if (!booking) {
      console.log("⚠ Booking not found for ID:", bookingId);
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // ✅ Include metadata (bookingId) to track payments properly
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents, 
      currency: "usd",
      payment_method_types: ["card"],
      metadata: { bookingId: String(bookingId) }, // <-- Ensure it's a string
    });
    

    console.log("✅ Payment Intent Created:", paymentIntent.id);

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("❌ Payment Processing Error:", error);
    res.status(500).json({ success: false, message: "Payment Failed", error });
  }
});

module.exports = router;
