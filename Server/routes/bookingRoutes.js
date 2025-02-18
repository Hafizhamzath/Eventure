const express = require("express");
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const router = express.Router();

// 📌 Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📌 Book an Event
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { eventId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Ensure user email is present
    if (!req.user || !req.user.email) {
      return res.status(400).json({ message: "User email not found!" });
    }

    // Create a new booking
    const newBooking = new Booking({
      user: req.user.id,
      event: eventId,
      paymentStatus: "pending", // Default status
    });

    await newBooking.save();

    // 📌 Generate QR Code as a Buffer
    const qrData = `Event: ${event.title}, User: ${req.user.name}, Booking ID: ${newBooking._id}`;
    const qrCodeImage = await QRCode.toDataURL(qrData); // Base64 QR Code

    // 📌 Send Confirmation Email with QR Code as an Attachment
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.user.email, // Ensure email is correctly set
      subject: `🎟 Booking Confirmation - ${event.title}`,
      html: `
        <h3>Hello ${req.user.name},</h3>
        <p>You have successfully booked the event: <strong>${event.title}</strong></p>
        <p><strong>Date:</strong> ${new Date(event.date).toDateString()}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
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

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log("❌ Error sending email:", err);
        return res.status(500).json({ message: "Error sending email", error: err });
      } else {
        console.log("✅ Email Sent: " + info.response);
      }
    });

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

//get events
router.get("/", authMiddleware, async (req, res) => {
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
