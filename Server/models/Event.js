const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: 
  { type: String, required: true },
  description:
   { type: String, required: true },
  date:
   { type: Date, required: true },
  venue:
   { type: String, required: true },
  category:
   { type: String, required: true },
  price:
   { type: Number, default: 0 },
  image:
   { type: String },
  organizer:
   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
