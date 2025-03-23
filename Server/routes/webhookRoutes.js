const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");

const router = express.Router();

// Stripe webhook endpoint
router.post("/stripe", express.raw({ type: "application/json" }), async (req, res) => {
  let event;

  try {
    const sig = req.headers["stripe-signature"];
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("📌 Webhook Event Received:", event.type);
  console.log("📌 Full Event Data:", JSON.stringify(event, null, 2));  // NEW LOGGING

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    
    console.log("✅ Payment Successful:", paymentIntent.id);
    console.log("📌 Full Event Data:", JSON.stringify(event, null, 2));
console.log("📌 Metadata Received:", paymentIntent.metadata);


    if (!paymentIntent.metadata || !paymentIntent.metadata.bookingId) {
      console.error("❌ Booking ID missing in metadata");
      return res.status(400).json({ message: "Booking ID not found in metadata" });
    }

    try {
      console.log("🔄 Updating Booking in DB for:", paymentIntent.metadata.bookingId);

      const updatedBooking = await Booking.findOneAndUpdate(
        { _id: paymentIntent.metadata.bookingId },
        { paymentStatus: "completed" },
        { new: true }
      );

      if (!updatedBooking) {
        console.warn("⚠ Booking not found for ID:", paymentIntent.metadata.bookingId);
        return res.status(404).json({ message: "Booking not found" });
      } 

      console.log("✅ Booking updated to 'completed':", updatedBooking);
      res.json({ received: true, booking: updatedBooking });

    } catch (error) {
      console.error("❌ Error updating booking:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    console.log(`ℹ️ Unhandled Event: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
