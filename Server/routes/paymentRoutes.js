const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const authMiddleware = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");

const router = express.Router();

// 📌 Process Payment
router.post("/pay", authMiddleware, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    console.log("📌 Payment Request Received:", { amount, bookingId });

    // Validate amount
    if (!amount || amount <= 0) {
      console.log("⚠ Invalid amount received:", amount);
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Check if booking exists
    const booking = await Booking.findById(bookingId).populate("user").populate("event");
    if (!booking) {
      console.log("⚠ Booking not found for ID:", bookingId);
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    console.log("✅ Payment Intent Created:", paymentIntent.id);

    // Update booking status
    await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "completed" });

    // 📌 Construct a detailed response
    res.json({
      success: true,
      message: "Payment Successful",
      transactionId: paymentIntent.id,
      amountPaid: amount,
      currency: "USD",
      paymentStatus: "completed",
      user: {
        id: booking.user._id,
        name: booking.user.name,
        email: booking.user.email,
      },
      event: {
        id: booking.event._id,
        title: booking.event.title,
        date: booking.event.date,
        venue: booking.event.venue,
      },
      bookingId: booking._id,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("❌ Payment Processing Error:", error);
    res.status(500).json({ success: false, message: "Payment Failed", error });
  }
});

module.exports = router;
