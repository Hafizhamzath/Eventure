const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  user: 
  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event:
   { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  paymentStatus:
   { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);
