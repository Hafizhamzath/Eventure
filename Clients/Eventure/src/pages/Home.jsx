import { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Search, Calendar, CreditCard, CheckCircle, Star as StarOutline, Mail } from 'lucide-react';
import '../styles/home.css';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';



// Create a filled star component
const StarFilled = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const steps = [
  { icon: Search, title: "Browse Events", description: "Explore our curated selection of exciting events near you" },
  { icon: Calendar, title: "Select & Book", description: "Choose your preferred event and select your seats" },
  { icon: CreditCard, title: "Make Payment", description: "Secure payment process with multiple payment options" },
  { icon: CheckCircle, title: "Get Confirmation", description: "Receive instant confirmation and e-tickets" }
];

const testimonials = [
  { name: "Sarah Johnson", role: "Event Enthusiast", comment: "EventHub made it so easy to find and book tickets for local events. The process was seamless!", rating: 5 },
  { name: "Michael Chen", role: "Regular Attendee", comment: "I've discovered so many amazing events through this platform. Highly recommended!", rating: 5 },
  { name: "Emily Davis", role: "Music Lover", comment: "The best platform for finding concert tickets. Never missed a show since I started using it.", rating: 4 }
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [isVisible, setIsVisible] = useState({
    events: false,
    howItWorks: false,
    testimonials: false
  });

  useEffect(() => {
    axios.get('https://eventure-backend-1ewk.onrender.com/api/events/public')
      .then(response => setEvents(response.data))
      .catch(error => console.error('Error fetching events:', error));
    
    // Set up intersection observers for scroll animations
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const eventsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(prev => ({ ...prev, events: true }));
      }
    }, observerOptions);

    const howItWorksObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(prev => ({ ...prev, howItWorks: true }));
      }
    }, observerOptions);

    const testimonialsObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(prev => ({ ...prev, testimonials: true }));
      }
    }, observerOptions);

    const eventsSection = document.querySelector('.events-section');
    const howItWorksSection = document.querySelector('.how-it-works-section');
    const testimonialsSection = document.querySelector('.testimonials-section');

    if (eventsSection) eventsObserver.observe(eventsSection);
    if (howItWorksSection) howItWorksObserver.observe(howItWorksSection);
    if (testimonialsSection) testimonialsObserver.observe(testimonialsSection);

    return () => {
      if (eventsSection) eventsObserver.unobserve(eventsSection);
      if (howItWorksSection) howItWorksObserver.unobserve(howItWorksSection);
      if (testimonialsSection) testimonialsObserver.unobserve(testimonialsSection);
    };
  }, []);

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <>
      <div className="hero-section">
        <div className="hero-overlay" />
        <Container className="hero-content text-center">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Discover & Book Exciting Events Near You!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Browse events, book tickets, and enjoy seamless experiences.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button variant="primary" size="lg" href="/events" className="me-3 btn-animated">Browse Events</Button>
            <Button variant="secondary" size="lg" href="/register" className="btn-animated">Sign Up</Button>
          </motion.div>
        </Container>
      </div>

      <Container className="events-section my-5">
        <motion.h2 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={isVisible.events ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          Upcoming Events
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible.events ? "visible" : "hidden"}
        >
          <Row className="mt-4">
          {events.length > 0 ? events.slice(0, 3).map((event, index) => (
              <Col md={4} key={index}>
                <motion.div
                  variants={fadeInUp}
                  className="event-card-container"
                >
                  <Card className="event-card">
                    <Card.Img variant="top" src={event.image || "https://via.placeholder.com/300"} />
                    <Card.Body>
                      <Card.Title>{event.title}</Card.Title>
                      <Card.Text>{format(new Date(event.date), "MMMM dd, yyyy hh:mm a")} - {event.venue}</Card.Text>
                      <Button  variant="primary" onClick={() => {
                          const user = localStorage.getItem("user"); // Check if user is logged in
                          if (user) {
                            window.location.href = `/events/${event._id}`; // Navigate to event page
                          } else {
                            toast.warn("Login First", { position: "top-right",  // Set position to top-right
                              autoClose: 2000,        // Close after 2 seconds
                              hideProgressBar: false, // Show progress bar
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              theme: "light",});
                          }}}>View Details</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            )) : <p className="text-center">No events available</p>}
          </Row>
        </motion.div>
      </Container>

      <Container className="how-it-works-section my-5 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isVisible.howItWorks ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible.howItWorks ? "visible" : "hidden"}
        >
          <Row className="mt-4">
            {steps.map((step, index) => (
              <Col md={3} key={index} className="p-3">
                <motion.div 
                  variants={fadeInUp}
                  className="how-it-works-step"
                >
                  <div className="mb-3 flex justify-center">
                    <div className="icon-container">
                      <step.icon className="h-8 w-8 text-blue-700" />
                    </div>
                  </div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>

      <Container className="testimonials-section my-5 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={isVisible.testimonials ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Users Say
        </motion.h2>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isVisible.testimonials ? "visible" : "hidden"}
        >
          <Row className="mt-4">
            {testimonials.map((testimonial, index) => (
              <Col md={4} key={index}>
                <motion.div 
                  variants={fadeInUp}
                  className="testimonial-card-container"
                >
                  <Card className="testimonial-card p-4">
                    <div className="stars-container">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <StarFilled 
                          key={i} 
                          className="star-icon" 
                          size={20} 
                          style={{ color: '#FFC107', marginRight: '2px', marginLeft: '2px' }}
                        />
                      ))}
                    </div>
                    <p>"{testimonial.comment}"</p>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm">{testimonial.role}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      </Container>
    </>
  );
};

export default Home;