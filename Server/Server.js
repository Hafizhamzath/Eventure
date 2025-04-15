require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const webhookRoutes = require("./routes/webhookRoutes")
const adminRoutes = require("./routes/adminRoutes");



const app = express();

const corsOptions = {
  origin: "https://eventure-o8k3.onrender.com",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200 // ✅ Important for legacy browsers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ Handles preflight with correct CORS headers

app.use(express.json());


app.use(
  "/api/webhooks",
  express.raw({ type: "application/json" }), // For Stripe/etc webhooks
  webhookRoutes
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes)

app.get('/',(req,res)=>{
  res.json("Eventure BAckend")
})






// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
