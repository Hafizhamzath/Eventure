const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
  try {
    console.log("🔹 Incoming request to:", req.originalUrl);

    // Check if Authorization header exists
    if (!req.header("Authorization")) {
      console.log("❌ No Authorization header found");
      return res.status(401).json({ message: "Unauthorized: No Token Provided" });
    }

    // Extract Token
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("🚀 Received Token:", token);

    // Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token Decoded:", decoded);

    // Find User in Database
    const user = await User.findById(decoded.id);
    console.log("🔹 User Found:", user);

    // Ensure User is Admin
    if (!user || user.role !== "admin") {
      console.log("❌ Access Denied: User is not admin");
      return res.status(403).json({ message: "Access Denied. Admins Only!" });
    }

    req.user = user; // Attach user to request
    console.log("✅ Access Granted!");
    next();
  } catch (error) {
    console.log("❌ Middleware Error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid Token" });
  }
};

module.exports = adminMiddleware;
