const express = require("express");
const router = express.Router();
const FAQ = require("../models/FAQ");

// Chatbot Route
router.post("/chatbot", async (req, res) => {
    const userQuestion = req.body.question.toLowerCase();

    // Find the most relevant FAQ
    const faqs = await FAQ.find();
    let bestMatch = faqs.find(faq => userQuestion.includes(faq.question.toLowerCase()));

    if (bestMatch) {
        return res.json({ reply: bestMatch.answer });
    } else {
        return res.json({ reply: "I'm sorry, I don't understand. Please contact support." });
    }
});

module.exports = router;
