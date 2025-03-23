const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Event = require("../models/Event");
const Booking = require("../models/Booking");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Create Event with Image Upload (Single Image)
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    const { title, description, date, venue, category, price, city, email } = req.body;
    let imageUrl = "";

    // Upload image to Cloudinary if provided
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
            }
            imageUrl = result.secure_url;
            resolve();
          }
        );
        stream.end(req.file.buffer);
      });
    }

    // Ensure `req.user.id` is available
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Create the event in MongoDB
    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      category,
      price,
      city,
      email,
      image: imageUrl,
      organizer: req.user.id,
      ticketsSold: 0,
    });
    console.log("Received Data:", req.body); console.log("Uploaded File:", req.file);

    await newEvent.save();
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error Creating Event:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


// Public Route - Get All Events with Status & Tickets Sold
router.get("/public", async (req, res) => {
  try {
    const events = await Event.find();
    const bookings = await Booking.find();

    const updatedEvents = events.map(event => {
      const ticketsSold = bookings
        .filter(booking => booking.event.toString() === event._id.toString())
        .reduce((sum, booking) => sum + (booking.tickets || 0), 0); // Ensure ticketsSold is always a number

      return {
        ...event._doc,
        status: new Date(event.date) > new Date() ? "Upcoming" : "Completed",
        ticketsSold: ticketsSold || 0, // If null, set to 0
      };
    });

    res.json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});


// Private Route - Get Events for the Logged-in Organizer with Status & Tickets Sold
router.get("/my-events", protect, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const bookings = await Booking.find();

    const updatedEvents = events.map(event => {
      const ticketsSold = bookings
        .filter(booking => booking.event.toString() === event._id.toString())
        .reduce((sum, booking) => sum + booking.tickets, 0);

      return {
        ...event._doc,
        status: new Date(event.date) > new Date() ? "Upcoming" : "Completed",
        ticketsSold,
      };
    });

    res.json(updatedEvents);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get Event Statistics for Organizer
// Get Event Statistics for Organizer
router.get("/stats", protect, async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user.id });
    const eventIds = events.map(event => event._id); // Get all event IDs
    const bookings = await Booking.find({ event: { $in: eventIds } }); // Get all bookings for these events

    const totalEvents = events.length;
    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
    const completedEvents = events.filter(event => new Date(event.date) <= new Date()).length;

    // Corrected total tickets sold calculation
    const totalTicketsSold = bookings.reduce((sum, booking) => sum + (booking.tickets || 0), 0);

    res.json({
      totalEvents,
      upcomingEvents,
      completedEvents,
      totalTicketsSold, // Now correctly calculates total tickets sold
    });
  } catch (error) {
    console.error("Error Fetching Stats:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});


// Get Single Event
router.get("/:id", protect, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("organizer", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Public Route - Get Events with Filtering
router.get("/", protect, async (req, res) => {
  try {
    const { category, limit } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const events = await Event.find(query).limit(parseInt(limit) || 10);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Update Event
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, description, date, venue, category, price, city, email, ticketsSold, status } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      { title, description, date, venue, category, price, city, email, ticketsSold, status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Delete Event
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
