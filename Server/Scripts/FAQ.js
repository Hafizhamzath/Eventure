require('dotenv').config({ path: '../.env' }); // Adjust path if needed
const mongoose = require('mongoose');
const FAQ = require('../models/FAQ');



// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Sample FAQs
const sampleFAQs = [
  {
    question: "How do I register for an event?",
    answer: "To register for an event, log in to your account, browse the available events (Music, Tech, or Food), and select the one you'd like to attend. Click 'Book Tickets' and proceed with the booking process."
  },
  {
    question: "Can I book multiple tickets at once?",
    answer: "Yes! When selecting an event, you can choose the number of tickets you need. The system will automatically calculate the total cost before you proceed to payment."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept multiple payment methods, including credit/debit cards, PayPal, and digital wallets. Select your preferred payment method during checkout."
  },
  {
    question: "How do I receive my tickets after payment?",
    answer: "Once your payment is successful, your tickets will be available for download on the success page. Additionally, a copy will be sent to your registered email."
  },
  {
    question: "Can I cancel or refund my ticket?",
    answer: "Ticket cancellations and refunds are subject to the event organizer's policy. Please check the event details or contact support for more information."
  },
  {
    question: "How do I check in at the event?",
    answer: "Simply show your digital ticket at the event entry. Some events may have QR code scanning for faster check-ins."
  },
  {
    question: "Can I change the details on my ticket after booking?",
    answer: "No, ticket details cannot be changed after booking. Make sure to enter the correct details during the registration process."
  },
  {
    question: "Where can I get support if I face any issues?",
    answer: "You can reach our support team through the 'Contact Support' button on this page, via live chat, or by emailing us at support@eventure.com."
  }
];

// Insert sample FAQs
FAQ.insertMany(sampleFAQs)
  .then(() => {
    console.log('FAQs added successfully!');
    mongoose.connection.close(); // Close DB connection after execution
  })
  .catch(err => console.error('Failed to add FAQs:', err));