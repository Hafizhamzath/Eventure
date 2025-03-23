const mongoose = require("mongoose");

const FAQSchema = new mongoose.Schema({
    question: String,
    answer: String
});

const FAQ = mongoose.model("FAQ", FAQSchema);

module.exports = FAQ;
