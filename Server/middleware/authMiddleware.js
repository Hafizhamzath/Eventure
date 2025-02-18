const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) return res.status(401).json({ message: "Access Denied. No token provided." });

  try {
    const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

    // Fetch full user details from database
    const user = await User.findById(verified.id).select("-password");

    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user; // Attach full user object to request
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

module.exports = authMiddleware;
