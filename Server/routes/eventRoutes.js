const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();  // Store file in memory temporarily
const upload = multer({ storage: storage });

// Create Event with Image Upload (Single Image)
router.post("/", upload.single("image"),authMiddleware, async (req, res) => {
  try {
    const { title, description, date, venue, category, price } = req.body;
    let imageUrl = '';

    // If there is an image uploaded, upload to Cloudinary
    if (req.file) {
      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload_stream(
        { folder: "events" },  // Optional: You can define the folder in Cloudinary
        (error, result) => {
          if (error) {
            return res.status(500).json({ message: "Error uploading image", error });
          }

          // Get the secure URL of the uploaded image
          imageUrl = result.secure_url;
        }
      );

      // Use multer's `stream` to upload the file directly to Cloudinary
      req.file.stream.pipe(result);
    }

    // Create the new event with the image URL (if available)
    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      category,
      price,
      image: imageUrl,  // Store the image URL (if uploaded)
      organizer: req.user.id,  // Assuming the organizer is authenticated
    });

    await newEvent.save();
    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get All Events
router.get("/", authMiddleware, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get Single Event
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;
