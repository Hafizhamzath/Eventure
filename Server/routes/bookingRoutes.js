const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const { protect } = require("../middleware/authMiddleware"); 
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const router = express.Router();

// Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Book an Event
router.post("/", protect, async (req, res) => {
  try {
    const { event, user, tickets, totalAmount } = req.body;

    // Debugging: Log the request body
    console.log("Request Body:", req.body);

    // Check if event exists
    const eventDetails = await Event.findById(event);
    if (!eventDetails) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Debugging: Log the event details
    console.log("Event Details:", eventDetails);

    // Ensure authenticated user exists
    if (!req.user || !req.user.id) {
      return res.status(400).json({ message: "User not authenticated!" });
    }

    // Debugging: Log the authenticated user
    console.log("Authenticated User:", req.user);

    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id, // Use authenticated user's ID
      event: event, // Use event ID from request body
      tickets: tickets, // Use ticket count from request body
      totalAmount: totalAmount, // Use total amount from request body
      paymentStatus: "pending", // Default status
    });

    // Debugging: Log the new booking object
    console.log("New Booking:", newBooking);

    // Save the booking
    await newBooking.save().catch((err) => {
      console.error("Error saving booking:", err);
      throw err; // Re-throw the error to be caught by the outer try-catch
    });

    // Debugging: Log success message
    console.log("Booking saved successfully:", newBooking);

    // Generate QR Code as a Buffer
    const qrData = `Event: ${eventDetails.title}, User: ${req.user.name}, Booking ID: ${newBooking._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrData); // Base64 QR Code

    // Send Confirmation Email with QR Code as an Attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email, // Use authenticated user's email
      subject: `🎟 Booking Confirmation - ${eventDetails.title}`,
      html: `
        <h3>Hello ${req.user.name},</h3>
        <p>You have successfully booked the event: <strong>${eventDetails.title}</strong></p>
        <p><strong>Date:</strong> ${new Date(eventDetails.date).toDateString()}</p>
        <p><strong>Venue:</strong> ${eventDetails.venue}</p>
        <p><strong>Payment Status:</strong> ${newBooking.paymentStatus}</p>
        <h4>Your QR Code (Show this at entry):</h4>
        <img src="cid:qrcode" alt="QR Code" width="200"/>
        <br/>
        <p>Thank you for choosing our platform!</p>
      `,
      attachments: [
        {
          filename: "qrcode.png",
          content: qrCodeImage.split(";base64,").pop(),
          encoding: "base64",
          cid: "qrcode", // Attach as Content-ID for inline display
        },
      ],
    };

    // Send email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("❌ Error sending email:", err);
        return res.status(500).json({ message: "Error sending email", error: err });
      } else {
        console.log("✅ Email Sent: " + info.response);
      }
    });

    // Return success response
    res.status(201).json({
      message: "Booking confirmed & email sent!",
      booking: newBooking,
      qrCode: qrCodeImage,
    });

  } catch (error) {
    console.error("❌ Error in booking:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

// Get all bookings for the authenticated user
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("event", "title date venue");

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found for this user." });
    }

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ message: "Server Error", error });
  }
});

module.exports = router;