const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes (authentication)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      console.log("Authenticated User ID:", req.user?._id); // Log the user ID
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.log("Token verification failed:", error);
      res.status(401).json({ message: "Invalid token, access denied" });
    }
  } else {
    res.status(401).json({ message: "No token, authorization denied" });
  }
};



// Middleware to check if the user is an admin
const isAdmin = (req, res, next) => {
  console.log("🛑 Checking admin role:", req.user?.role); // Debug log

  if (!req.user) {
    return res.status(401).json({ message: "Not authorized, user not found" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied, admin privileges required" });
  }

  next();
};


module.exports = { protect, isAdmin };
