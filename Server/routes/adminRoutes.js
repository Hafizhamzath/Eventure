const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { isAdmin, protect } = require("../middleware/authMiddleware");

// Middleware: Ensure only authenticated admins can access these routes
router.use(protect, isAdmin);

// ✅ Fetch all users (Hide passwords)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // Do not expose passwords
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ✅ Fetch all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// ✅ Fetch all bookings with user and event details
const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("user", "name") // Fetch user name
      .populate({
        path: "event",
        select: "title date organizer",
        populate: {
          path: "organizer",
          model: "User", // Ensure correct model is referenced
          select: "name", // Fetch organizer's name
        },
      });

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};




// ✅ Delete a user (Fix .remove() deprecation)
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    if (!userId || userId === "undefined") {
      console.error("❌ Error: User ID is missing in request params");
      return res.status(400).json({ message: "Invalid User ID" });
    }

    console.log("🗑️ Deleting User with ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.error("⚠️ Error: User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    console.log("✅ User deleted successfully");
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting user:", error.message);
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};
// ✅ Update a user
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (!userId || userId === "undefined") {
      console.error("❌ Error: User ID is missing in request params");
      return res.status(400).json({ message: "Invalid User ID" });
    }

    console.log("📝 Updating User with ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.error("⚠️ Error: User not found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = password; // Ensure hashing is handled in User model
    }

    await user.save();
    console.log("✅ User updated successfully");

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("❌ Error updating user:", error.message);
    res.status(500).json({ message: "Failed to update user", error: error.message });
  }
};





// Routes
router.get("/users",protect, isAdmin, getUsers);
router.get("/events", protect, isAdmin,  getEvents);
router.get("/bookings", protect, isAdmin,  getBookings);
router.delete("/users/:id", protect, isAdmin,  deleteUser);
router.put("/users/:id", protect, isAdmin, updateUser);

module.exports = router;
