import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../styles/eventDetails.css"
import API from "../services/api";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook for navigation
  const [event, setEvent] = useState(null);
  const [relatedEvents, setRelatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchEvent = async () => {
      try {
        const eventResponse = await API.get(`/events/${id}`);
        setEvent(eventResponse.data);
    
        const relatedResponse = await API.get(
          `/events?category=${eventResponse.data.category}&limit=3`
        );
        setRelatedEvents(relatedResponse.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    

    fetchEvent();
  }, [id]);

  // Function to handle "Book Now" button click
  const handleBookNow = () => {
    if (!id) {
      setError("Event ID is missing.");
      return;
    }
    navigate(`/checkout/${id}`); // Navigate to the Checkout page with the event ID
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5">Error: {error}</div>;
  if (!event) return <div className="text-center mt-5">Event not found.</div>;

  return (
    <div>
      {/* Hero Section */}
      <div
        className="hero-section text-white text-center py-5"
        style={{
          backgroundImage: `url(${event.image || "https://via.placeholder.com/1200x400"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "400px", // Fixed height for the hero section
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="overlay bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center">
          <h1 className="display-4 fw-bold">{event.title}</h1>
          <p className="lead fs-4">
            {new Date(event.date).toLocaleDateString()} | {event.category}
          </p>
        </div>
      </div>

      {/* Description Section */}
      <div className="container my-5">
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">About the Event</h3>
            <p className="lead" style={{ lineHeight: "1.8" }}>
              {event.description}
            </p>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="container my-5">
        <div className="row g-4">
          {/* Event Details */}
          <div className="col-md-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Event Details</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-map-marker-alt text-primary"></i>
                    <div>
                      <strong>Venue:</strong> {event.venue}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-user text-primary"></i>
                    <div>
                      <strong>Organizer:</strong> {event.organizer.name}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-city text-primary"></i>
                    <div>
                      <strong>City:</strong> {event.city}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <i className="fas fa-envelope text-primary"></i>
                    <div>
                      <strong>Email:</strong> {event.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Section */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <h3 className="card-title mb-4">Ticket Information</h3>
                <div className="d-flex flex-column gap-3">
                  <div className="text-center">
                    <span className="text-muted">Price per ticket</span>
                    <h2 className="text-primary fw-bold">₹{event.price}</h2>
                  </div>
                  <button
                    className="btn btn-primary w-100 py-3 fs-5"
                    onClick={handleBookNow} // Enable the button and handle click
                  >
                    <i className="fas fa-shopping-cart me-2"></i>Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Events Section */}
      <div className="container my-5">
        <h3 className="mb-4">Related Events</h3>
        <div className="row g-4">
          {relatedEvents.map((relatedEvent) => (
            <div key={relatedEvent._id} className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <img
                  src={relatedEvent.image || "https://via.placeholder.com/400x200"}
                  className="card-img-top"
                  alt={relatedEvent.title}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{relatedEvent.title}</h5>
                  <p className="card-text">{relatedEvent.description}</p>
                  <Link
                    to={`/events/${relatedEvent._id}`}
                    className="btn btn-primary mt-auto"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;