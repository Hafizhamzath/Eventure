import  { useState } from 'react';
import { Calendar, Users, BarChart3, CreditCard, CheckCircle, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../styles/CreationHome.css';



function CreationHome() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    eventType: '',
    requirements: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setFormSubmitted(true);
    
    // Reset form after 5 seconds and close modal
    setTimeout(() => {
      setFormSubmitted(false);
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        eventType: '',
        requirements: ''
      });
    }, 5000);
  };

  return (
    <div className="eventure-homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Host Your Next Event with Ease!</h1>
          <p>Seamless event management, powerful promotion, and a growing audience – all in one platform.</p>
          <button className="cta-button" onClick={() => navigate("/register-event")}>
  Get Started
</button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="section-header">
          <h2>Why Choose Eventure?</h2>
          <p>Everything you need to create successful events</p>
        </div>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <Calendar size={32} />
            </div>
            <h3>Easy Setup</h3>
            <p>Create and manage events in minutes with our intuitive platform.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <Users size={32} />
            </div>
            <h3>Powerful Promotion</h3>
            <p>Get visibility through Eventure's marketing channels and reach your target audience.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <BarChart3 size={32} />
            </div>
            <h3>Insights & Analytics</h3>
            <p>Track ticket sales, attendance, and engagement with detailed reports.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <CreditCard size={32} />
            </div>
            <h3>Secure Payments</h3>
            <p>Hassle-free ticketing with secure transactions and instant payouts.</p>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="success-section">
        <div className="section-header">
          <h2>Success Stories</h2>
          <p>Join thousands of successful event organizers</p>
        </div>
        
        <div className="stats-container">
          <div className="stat-item">
            <h3>5,000+</h3>
            <p>Events Hosted</p>
          </div>
          <div className="stat-item">
            <h3>1M+</h3>
            <p>Attendees</p>
          </div>
          <div className="stat-item">
            <h3>98%</h3>
            <p>Satisfaction Rate</p>
          </div>
        </div>
        
        <div className="testimonials-container">
          <div className="testimonial-card">
            <p>"Eventure transformed how we manage our annual conference. The platform is intuitive, and the analytics helped us understand our audience better."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="Sarah Johnson" />
              <div>
                <h4>Sarah Johnson</h4>
                <p>Tech Conference Organizer</p>
              </div>
            </div>
          </div>
          
          <div className="testimonial-card">
            <p>"We increased our ticket sales by 45% after switching to Eventure. The promotion tools are game-changing for reaching new attendees."</p>
            <div className="testimonial-author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" alt="David Chen" />
              <div>
                <h4>David Chen</h4>
                <p>Music Festival Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>Four simple steps to event success</p>
        </div>
        
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Sign Up & Create</h3>
            <p>Create your account and set up your first event in minutes.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Customize & Set Up</h3>
            <p>Customize your event page and configure ticketing options.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Promote & Track</h3>
            <p>Share your event and monitor performance with real-time analytics.</p>
          </div>
          
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Host & Engage</h3>
            <p>Run your event smoothly and engage with attendees.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section">
        <div className="cta-content">
          <h2>Ready to Host Your Next Successful Event?</h2>
          <p>Join thousands of event organizers who trust Eventure for their events.</p>
          <div className="cta-buttons">
          <button className="cta-button primary" onClick={() => navigate("/register-event")}>
  Start Hosting Now
</button>
            <button className="cta-button secondary" onClick={() => setShowModal(true)}>Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* Demo Request Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{formSubmitted ? 'Thank You!' : 'Schedule a Demo'}</h3>
              <button className="close-button" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            {!formSubmitted ? (
              <form className="demo-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required 
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required 
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="companyName">Company/Organization Name</label>
                  <input 
                    type="text" 
                    id="companyName" 
                    name="companyName" 
                    value={formData.companyName}
                    onChange={handleInputChange}
                    placeholder="Your Company Ltd."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="eventType">Type of Events You Host</label>
                  <select 
                    id="eventType" 
                    name="eventType" 
                    value={formData.eventType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select an event type</option>
                    <option value="conference">Conferences</option>
                    <option value="concert">Concerts & Performances</option>
                    <option value="workshop">Workshops & Classes</option>
                    <option value="corporate">Corporate Events</option>
                    <option value="social">Social Gatherings</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="requirements">Specific Requirements</label>
                  <textarea 
                    id="requirements" 
                    name="requirements" 
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Tell us about your event needs and any specific features you're looking for..."
                    rows={4}
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-button">Request Demo</button>
                
                <p className="form-disclaimer">
                By submitting this form, you agree to our <Link to="/privacy-policy">Privacy Policy</Link> and <Link to="/terms-of-service">Terms of Service</Link>.
                </p>
              </form>
            ) : (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle size={48} />
                </div>
                <h4>We've received your request!</h4>
                <p>Our team will contact you shortly to schedule your personalized demo of the Eventure platform.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CreationHome;
