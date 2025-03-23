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
  city:
  {
     type:String, required:true
  },
  email:
  {
     type:String, required:true
  },
  image:
   { type: String },
  organizer:
   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
   ticketsSold: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);
