const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");
const Booking = require("../models/Booking");

const router = express.Router();

// Register User
router.post("/register", async (req, res) => {
  try {
    console.log("Received Registration Data:", req.body);

    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });

    console.log("Saving user to database...");
    await newUser.save();

    console.log("User registered successfully!");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Login User
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Refresh Token (New Route)
router.post("/refresh", async (req, res) => {
  try {
    // Look for the refresh token in cookies or headers
    const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
    if (!token) return res.status(400).json({ message: "Refresh token missing" });

    // Verify the refresh token
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }

      // Check if the refresh token is valid and not expired
      const user = await User.findById(decoded.id); // Get user by ID from token payload
      if (!user) return res.status(404).json({ message: "User not found" });

      // Create a new access token
      const newAccessToken = jwt.sign(
        { id: user._id, email: user.email, name: user.name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Access token expiry time
      );

      // Send the new access token back to the client
      res.json({ token: newAccessToken });
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User Profile (Protected Route)
router.get("/profile", protect, async (req, res) => {
  try {
    // Fetch user details (excluding password)
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch user's bookings with event details
    const bookings = await Booking.find({ user: req.user.id }).populate("event", "title date venue");

    // Return user and bookings
    res.json({ user, bookings });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update User Profile (Protected Route)
router.put("/profile", protect, async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    // Find the user by ID and update the profile
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phoneNumber },
      { new: true } // Return the updated user
    ).select("-password"); // Exclude password from the response

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
