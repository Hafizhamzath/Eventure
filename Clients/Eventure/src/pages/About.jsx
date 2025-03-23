import '../styles/About.css';

const AboutUs = () => {
  return (
    <div className="about-container">
      <header className="about-header">
        <h1>About Eventure</h1>
        <div className="header-underline"></div>
      </header>

      <section className="company-intro">
        <div className="intro-content">
          <h2>Welcome to Eventure</h2>
          <p>
            Founded in 2021, Eventure has quickly established itself as Kerala's premier event management solution. 
            We combine innovative technology with exceptional service to transform your vision into unforgettable experiences.
          </p>
        </div>
        <div className="intro-image">
          {/* Company image */}
          <img
            src="https://res.cloudinary.com/dc54r1zx9/image/upload/v1740076446/pmqj5o7rrpthhlcgcdft.png"
            alt="Eventure Company"
            className="company-image"
          />
        </div>
      </section>

      <section className="our-mission">
        <h2>Our Mission</h2>
        <p>
          At Eventure, we strive to redefine event management through seamless digital solutions that empower event organizers
          and delight attendees. Our mission is to make exceptional events accessible, manageable, and memorable for everyone.
        </p>
      </section>

      <section className="our-services">
        <h2>What We Offer</h2>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="icon-calendar"></i>
            </div>
            <h3>Comprehensive Planning</h3>
            <p>End-to-end event planning tools with intuitive interfaces and powerful automation.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <i className="icon-ticket"></i>
            </div>
            <h3>Ticketing Solutions</h3>
            <p>Secure, customizable ticketing systems with real-time analytics and reporting.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <i className="icon-venue"></i>
            </div>
            <h3>Venue Management</h3>
            <p>Streamlined venue selection, booking, and layout optimization tools.</p>
          </div>
          
          <div className="service-card">
            <div className="service-icon">
              <i className="icon-analytics"></i>
            </div>
            <h3>Performance Analytics</h3>
            <p>Detailed insights and metrics to measure success and guide future events.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2>What Our Clients Say</h2>
        <div className="testimonial-slider">
          <div className="testimonial-card">
            <p className="testimonial-text">
              "Eventure transformed our corporate conference from a logistical nightmare into a seamless experience.
              Their platform is intuitive and their support team is exceptional."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Rajesh Menon</span>
              <span className="author-title">Marketing Director, TechCorp India</span>
            </div>
          </div>
          {/* More testimonials would go here */}
        </div>
      </section>

      <section className="contact-section">
        <h2>Get In Touch</h2>
        <div className="contact-details">
          <div className="contact-info">
            <p><strong>Address:</strong> Eventure, B Block, ABC Tower, Kochi, Kerala</p>
            <p><strong>Phone:</strong> 999xxxxxxx870</p>
            <p><strong>Email:</strong> Eventure@gmail.com</p>
          </div>
          <div className="contact-form-container">
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <textarea placeholder="Your Message" required></textarea>
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutUs;