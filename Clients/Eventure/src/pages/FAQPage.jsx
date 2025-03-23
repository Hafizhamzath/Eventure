import { useState } from 'react';
import '../styles/FAQPage.css';

const FAQPage = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
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
      question: "Can I download my tickets later?",
      answer: "Yes! You can log in to your account, navigate to the 'My Tickets' section, and download your ticket anytime before the event."
    },
    {
      question: "What happens if I lose my ticket?",
      answer: "No worries! You can always re-download your ticket from the 'My Tickets' section in your account. Alternatively, check your email for the original ticket."
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

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about using Eventure</p>
      </div>

      <div className="faq-search">
        <input type="text" placeholder="Search for answers..." />
        <button className="search-button">Search</button>
      </div>

      <div className="faq-list">
        {faqData.map((faq, index) => (
          <div className="faq-item" key={index}>
            <div 
              className={`faq-question ${activeIndex === index ? 'active' : ''}`} 
              onClick={() => toggleAccordion(index)}
            >
              <h3>{faq.question}</h3>
              <span className="faq-icon">{activeIndex === index ? '−' : '+'}</span>
            </div>
            <div 
              className={`faq-answer ${activeIndex === index ? 'active' : ''}`}
            >
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="faq-footer">
        <p>Didn't find what you're looking for?</p>
        <button className="contact-button">Contact Support</button>
      </div>
    </div>
  );
};

export default FAQPage;
