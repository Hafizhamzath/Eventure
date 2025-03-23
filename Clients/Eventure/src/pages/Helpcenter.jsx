import React, { useState } from 'react';
import '../styles/Helpcenter.css';

const HelpCenter = () => {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // Toggle FAQ expansion
  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [faqId]: !prev[faqId]
    }));
  };

  // Categories and FAQs data
  const categories = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'account-billing', name: 'Account & Billing' },
    { id: 'events-management', name: 'Events Management' },
    { id: 'tickets-registrations', name: 'Tickets & Registrations' },
    { id: 'troubleshooting', name: 'Troubleshooting' },
  ];

  const faqs = {
    'getting-started': [
      {
        id: 'gs-1',
        question: 'How do I create an account on Eventure?',
        answer: 'To create an account, click on the "Sign Up" button on the top right corner of our homepage. You can register using your email address or sign up with your Google or Facebook account. Follow the prompts to complete your profile setup.'
      },
      {
        id: 'gs-2',
        question: 'What subscription plans does Eventure offer?',
        answer: 'Eventure offers several subscription tiers: Free, Basic, Professional, and Enterprise. Each plan includes different features and event limits. You can view a detailed comparison of our plans on our Pricing page.'
      },
      {
        id: 'gs-3',
        question: 'How do I create my first event?',
        answer: 'After logging in, navigate to your Dashboard and click on "Create New Event." Fill in the event details including title, date, time, location, and description. You can also add custom fields, ticket types, and promotional images before publishing your event.'
      },
    ],
    'account-billing': [
      {
        id: 'ab-1',
        question: 'How do I update my account information?',
        answer: 'You can update your account information by clicking on your profile icon in the top right corner and selecting "Account Settings." From there, you can edit your personal information, change your password, and manage notification preferences.'
      },
      {
        id: 'ab-2',
        question: 'How do I change my subscription plan?',
        answer: 'To change your subscription plan, go to "Account Settings" and select the "Billing" tab. You\'ll see your current plan and options to upgrade or downgrade. Changes to your subscription will take effect at the beginning of your next billing cycle.'
      },
      {
        id: 'ab-3',
        question: 'What payment methods do you accept?',
        answer: 'We accept major credit and debit cards including Visa, Mastercard, American Express, and RuPay. We also support payments via UPI, net banking, and digital wallets like PayTM and Google Pay for users in India.'
      },
    ],
    'events-management': [
      {
        id: 'em-1',
        question: 'How do I edit an event after publishing it?',
        answer: 'To edit a published event, go to your Dashboard, find the event you wish to edit, and click on "Manage Event." From there, you can make changes to most event details. Note that certain changes to ticket pricing or event dates after tickets have been sold may require notifying your attendees.'
      },
      {
        id: 'em-2',
        question: 'Can I create recurring events?',
        answer: 'Yes! On the event creation page, select "Create Recurring Event" and specify your frequency (daily, weekly, monthly) and the end date for the series. You can also create individual sessions with unique details while maintaining the series connection.'
      },
      {
        id: 'em-3',
        question: 'How do I promote my event through Eventure?',
        answer: 'Eventure offers several promotional tools. In your event management dashboard, navigate to the "Promotion" tab where you can create custom discount codes, set up affiliate programs, generate social media posts, and enable email marketing campaigns to your subscriber list.'
      },
    ],
    'tickets-registrations': [
      {
        id: 'tr-1',
        question: 'How do I set up different ticket types?',
        answer: 'When creating or editing an event, go to the "Tickets" section. Click "Add Ticket Type" and specify details like name, price, available quantity, sale dates, and any special descriptions or restrictions. You can create multiple ticket types like Early Bird, VIP, or Standard.'
      },
      {
        id: 'tr-2',
        question: 'How can attendees get their tickets?',
        answer: 'After purchasing, attendees automatically receive tickets via email. They can also access their tickets through their Eventure account under "My Tickets." Each ticket includes a unique QR code that can be scanned at the event using our mobile app or web-based check-in system.'
      },
      {
        id: 'tr-3',
        question: 'How do I process refunds for ticket purchases?',
        answer: 'To process a refund, go to your Dashboard, select the relevant event, then navigate to "Attendees." Find the attendee requesting a refund, click on the options menu, and select "Process Refund." Follow the prompts to complete the refund according to your event\'s refund policy.'
      },
    ],
    'troubleshooting': [
      {
        id: 'ts-1',
        question: 'The ticket scanner isn\'t working at my event. What should I do?',
        answer: 'First, ensure you have a stable internet connection. If problems persist, try these steps: 1) Refresh the check-in page, 2) Clear your browser cache or restart the app, 3) Switch to manual check-in mode by entering ticket codes manually. If issues continue, contact our support team for immediate assistance.'
      },
      {
        id: 'ts-2',
        question: 'My event page isn\'t loading properly. How can I fix this?',
        answer: 'Try clearing your browser cache and cookies, then reload the page. If the issue persists, verify that all your event images are in the supported formats (JPG, PNG, GIF) and within the size limits (under 5MB per image). You may also want to check your internet connection or try a different browser.'
      },
      {
        id: 'ts-3',
        question: 'I\'m having issues with payments. What should I do?',
        answer: 'For payment issues, check that your payment information is current and that you have sufficient funds. If problems persist, contact your bank to ensure they are not blocking transactions. For platform-specific payment issues, navigate to "Help Center" > "Contact Support" and select "Payment Issues" from the dropdown menu for specialized assistance.'
      },
    ],
  };

  // Filter FAQs based on search query
  const filteredFaqs = searchQuery.trim() === '' 
    ? faqs[activeCategory] 
    : Object.values(faqs)
        .flat()
        .filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <div className="help-container">
      <header className="help-header">
        <h1>Help Center</h1>
        <div className="header-underline"></div>
        <p className="help-subtitle">Find answers to common questions about Eventure</p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search for help topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="help-content">
        {searchQuery.trim() === '' && (
          <div className="categories-nav">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}

        <div className="faqs-container">
          <h2>{searchQuery.trim() === '' ? categories.find(c => c.id === activeCategory).name : 'Search Results'}</h2>
          
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => (
              <div key={faq.id} className="faq-item">
                <div 
                  className={`faq-question ${expandedFaqs[faq.id] ? 'active' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <h3>{faq.question}</h3>
                  <span className="expand-icon">{expandedFaqs[faq.id] ? '−' : '+'}</span>
                </div>
                {expandedFaqs[faq.id] && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No results found for "{searchQuery}". Please try a different search term or browse categories.</p>
            </div>
          )}
        </div>
      </div>

      <div className="help-contact">
        <h2>Still need help?</h2>
        <p>Our support team is available to assist you with any questions or issues.</p>
        <div className="contact-options">
          <div className="contact-option">
            <div className="contact-icon email-icon">✉️</div>
            <h3>Email Support</h3>
            <p>Send us a message at Eventure@gmail.com</p>
            <p>We typically respond within 24 hours</p>
          </div>
          <div className="contact-option">
            <div className="contact-icon phone-icon">📞</div>
            <h3>Phone Support</h3>
            <p>Call us at 999xxxxxxx870</p>
            <p>Available Mon-Fri, 9AM-6PM IST</p>
          </div>
          <div className="contact-option">
            <div className="contact-icon chat-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Chat with our support team</p>
            <button className="chat-btn">Start Chat</button>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default HelpCenter;