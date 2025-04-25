import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import axios from "axios";
import "../styles/Eventcheckout.css";
import API from "../services/api";

const EventCheckout = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(1);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", city: "" });
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event details from the backend
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Use your centralized API instance instead of direct axios
        const response = await API.get(`/events/${eventId}`);
        setEventDetails(response.data);
  
      } catch (err) {
        // Enhanced error handling
        if (err.response) {
          if (err.response.status === 401) {
            // Token expired - the interceptor should have handled refresh
            setError("Session expired. Please login again.");
            // Redirect to login after delay
            setTimeout(() => window.location.href = "/login", 2000);
          } else if (err.response.status === 404) {
            setError("Event not found");
          } else {
            setError(err.response.data?.message || "Failed to fetch event");
          }
        } else if (err.request) {
          setError("Network error - please check your connection");
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchEventDetails();
  }, [eventId]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateTotal = () => {
    if (!eventDetails) return { subtotal: 0, tax: 0, total: 0 };
    const subtotal = eventDetails.price * ticketCount;
    const tax = subtotal * 0.18; // 18% tax
    return { subtotal: subtotal.toFixed(2), tax: tax.toFixed(2), total: (subtotal + tax).toFixed(2) };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post(
        "/bookings",
        {
          event: eventDetails._id,
          user: formData,
          tickets: ticketCount,
          totalAmount: calculateTotal().total,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      const bookingId = response.data.booking._id;

      navigate("/payment", {
        state: { event: eventDetails, formData, ticketCount, totals: calculateTotal(), bookingId },
      });
    } catch (error) {
      console.error("Booking creation failed:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  if (loading) return <div className="center">Loading...</div>;
  if (error) return <div className="center error">Error: {error}</div>;
  if (!eventDetails) return <div className="center">Event not found.</div>;

  const totals = calculateTotal();

  return (
    <div className="checkout-container">
      {/* Hero Section */}
      <div
        className="hero-section"
        style={{ backgroundImage: `url(${eventDetails.image || "https://via.placeholder.com/1200x400"})` }}
      >
        <div className="overlay">
          <h1>{eventDetails.title}</h1>
          <p>{new Date(eventDetails.date).toLocaleDateString()} | {eventDetails.category}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="checkout-content">
        {/* Left Section - Event Details and Form */}
        <div className="left-section">
          {/* Event Details */}
          <div className="event-details">
            <h2>About the Event</h2>
            <p>{eventDetails.description}</p>
            <p><strong>Venue:</strong> {eventDetails.venue}</p>
            <p><strong>City:</strong> {eventDetails.city}</p>
          </div>

          {/* Attendee Form */}
          <div className="attendee-form">
            <h2>Enter Your Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="New York"
                  required
                />
              </div>
              <button type="submit">Proceed to Payment</button>
            </form>
          </div>
        </div>

        {/* Right Section - Ticket Selection and Order Summary */}
        <div className="right-section">
          {/* Ticket Selection */}
          <div className="ticket-summary-card">
            <h2>Tickets & Pricing</h2>
            <div className="ticket-selector">
              <button onClick={() => setTicketCount(ticketCount > 1 ? ticketCount - 1 : 1)}>
                <Minus size={18} />
              </button>
              <span>{ticketCount}</span>
              <button onClick={() => setTicketCount(ticketCount + 1)}>
                <Plus size={18} />
              </button>
            </div>
            <div className="price-breakdown">
              <p>Subtotal: ₹{totals.subtotal}</p>
              <p>Tax (18%): ₹{totals.tax}</p>
              <h3>Total: ₹{totals.total}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCheckout;