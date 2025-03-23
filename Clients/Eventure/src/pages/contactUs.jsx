import React, { useState } from 'react';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormError(true);
      return;
    }
    
    // Here you would normally connect to your backend API
    // For demo purposes, we'll just simulate a successful submission
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    setFormError(false);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Please fill out the form below or use our contact information.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <i className="icon-location"></i>
              <div>
                <h3>Our Location</h3>
                <p>Eventure, B Block, ABC Tower, Kochi, Kerala</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="icon-phone"></i>
              <div>
                <h3>Phone</h3>
                <p>999xxxxxxx870</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="icon-email"></i>
              <div>
                <h3>Email</h3>
                <p>Eventure@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item">
              <i className="icon-clock"></i>
              <div>
                <h3>Business Hours</h3>
                <p>Monday - Friday: 9am - 5pm<br />Weekend: Closed</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          {formSubmitted ? (
            <div className="success-message">
              <h2>Thank You!</h2>
              <p>Your message has been received. We'll get back to you shortly.</p>
              <button onClick={() => setFormSubmitted(false)}>Send Another Message</button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h2>Send Message</h2>
              
              {formError && (
                <div className="error-message">
                  Please fill out all required fields.
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject of your message"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message"
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;