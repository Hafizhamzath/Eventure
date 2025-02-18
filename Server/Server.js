require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 



//Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings",bookingRoutes);
app.use("/api/payments", paymentRoutes);





// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅MongoDB Connected"))
  .catch((err) => console.log(err));





// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀The Server is runnig  on the Http://localhost:${PORT}`));
