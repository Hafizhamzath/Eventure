import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/OrganizerDashboard.css";

const API = axios.create({
  baseURL: "https://eventure-backend-1ewk.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function OrganizerDashboard() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
    totalTicketsSold: 0,
    totalRevenue: 0, // Add total revenue to stats
  });
  const [activeView, setActiveView] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    city: "",
    ticketsSold: 0,
    price: 0, // Use "price" instead of "ticketPrice"
    status: "upcoming",
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper function to calculate total revenue
  const calculateTotalRevenue = (events) => {
    return events.reduce((sum, event) => {
      const ticketsSold = parseInt(event.ticketsSold) || 0;
      const price = parseFloat(event.price) || 0; // Use "price" instead of "ticketPrice"
      return sum + ticketsSold * price;
    }, 0);
  };

  // Fetch events and statistics
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch events for the logged-in organizer
        const eventsResponse = await API.get("/events/my-events");
        const statsResponse = await API.get("/events/stats");

        console.log("Events Response:", eventsResponse.data);
        console.log("Stats Response:", statsResponse.data);

        // Calculate total revenue
        const totalRevenue = calculateTotalRevenue(eventsResponse.data);
        console.log("Calculated Total Revenue:", totalRevenue);

        // Update events and stats
        setEvents(eventsResponse.data);
        setStats({
          ...statsResponse.data,
          totalRevenue, // Add total revenue to stats
        });
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: name === "ticketsSold" || name === "price" ? parseFloat(value) || 0 : value,
    });
  };

  // Add new event
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/events", newEvent);
      const updatedEvents = [...events, response.data];
      setEvents(updatedEvents);

      // Recalculate total revenue
      const totalRevenue = calculateTotalRevenue(updatedEvents);
      setStats((prevStats) => ({
        ...prevStats,
        totalRevenue,
      }));

      setShowForm(false);
      setNewEvent({
        title: "",
        date: "",
        city: "",
        ticketsSold: 0,
        price: 0, // Use "price" instead of "ticketPrice"
        status: "upcoming",
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  // Delete an event
  const handleDeleteEvent = async (id) => {
    try {
      await API.delete(`/events/${id}`);
      const updatedEvents = events.filter((event) => event._id !== id);
      setEvents(updatedEvents);

      // Recalculate total revenue
      const totalRevenue = calculateTotalRevenue(updatedEvents);
      setStats((prevStats) => ({
        ...prevStats,
        totalRevenue,
      }));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  // Edit an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  // Update an event
  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await API.put(`/events/${editingEvent._id}`, editingEvent);
      const updatedEvents = events.map((event) =>
        event._id === response.data._id ? response.data : event
      );
      setEvents(updatedEvents);

      // Recalculate total revenue
      const totalRevenue = calculateTotalRevenue(updatedEvents);
      setStats((prevStats) => ({
        ...prevStats,
        totalRevenue,
      }));

      setEditingEvent(null);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // Filter events based on activeView
  const filteredEvents = activeView === "all"
    ? events
    : events.filter((event) => {
        const eventDate = new Date(event.date);
        const currentDate = new Date();
        const status = eventDate >= currentDate ? "upcoming" : "completed";
        return status === activeView;
      });

  // Calculate revenue for individual events
  const calculateRevenue = (ticketsSold, price) => {
    const ticketsSoldNum = parseInt(ticketsSold) || 0;
    const priceNum = parseFloat(price) || 0; // Use "price" instead of "ticketPrice"
    return ticketsSoldNum * priceNum;
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <h1>Welcome, Organizer</h1>
        <div className="header-actions">
          <button
            className="add-event-btn"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "Add New Event"}
          </button>
        </div>
      </header>

      {/* Stats Section */}
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Events</h3>
          <p className="stat-value">{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Upcoming</h3>
          <p className="stat-value">{stats.upcomingEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{stats.completedEvents}</p>
        </div>
        <div className="stat-card">
          <h3>Total Tickets Sold</h3>
          <p className="stat-value">{stats.totalTicketsSold.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Event Filter Tabs */}
      <div className="event-filters">
        <button
          className={activeView === "all" ? "active" : ""}
          onClick={() => setActiveView("all")}
        >
          All Events
        </button>
        <button
          className={activeView === "upcoming" ? "active" : ""}
          onClick={() => setActiveView("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={activeView === "completed" ? "active" : ""}
          onClick={() => setActiveView("completed")}
        >
          Completed
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <form className="event-form" onSubmit={handleAddEvent}>
          <h2>Add New Event</h2>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={newEvent.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Tickets Sold</label>
            <input
              type="number"
              name="ticketsSold"
              value={newEvent.ticketsSold}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Price (₹)</label>
            <input
              type="number"
              name="price"
              value={newEvent.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={newEvent.status}
              onChange={handleInputChange}
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Add Event</button>
        </form>
      )}

      {/* Edit Event Form */}
      {editingEvent && (
        <form className="event-form" onSubmit={handleUpdateEvent}>
          <h2>Edit Event</h2>
          <div className="form-group">
            <label>Event Title</label>
            <input
              type="text"
              name="title"
              value={editingEvent.title}
              onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={editingEvent.date}
              onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              name="city"
              value={editingEvent.city}
              onChange={(e) => setEditingEvent({ ...editingEvent, city: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Tickets Sold</label>
            <input
              type="number"
              name="ticketsSold"
              value={editingEvent.ticketsSold}
              onChange={(e) => setEditingEvent({ ...editingEvent, ticketsSold: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Ticket Price (₹)</label>
            <input
              type="number"
              name="price"
              value={editingEvent.price}
              onChange={(e) => setEditingEvent({ ...editingEvent, price: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={editingEvent.status}
              onChange={(e) => setEditingEvent({ ...editingEvent, status: e.target.value })}
            >
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button type="submit" className="submit-btn">Update Event</button>
          <button type="button" onClick={() => setEditingEvent(null)}>Cancel</button>
        </form>
      )}

      {/* Events List */}
      <div className="events-container">
        <h2>{activeView === "all" ? "All Events" : activeView === "upcoming" ? "Upcoming Events" : "Completed Events"}</h2>
        {isLoading ? (
          <p>Loading events...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : filteredEvents.length === 0 ? (
          <p className="no-events">No events to display</p>
        ) : (
          <div className="events-list">
            {filteredEvents.map((event) => {
              const eventDate = new Date(event.date);
              const currentDate = new Date();
              const status = eventDate >= currentDate ? "upcoming" : "completed";
              const revenue = calculateRevenue(event.ticketsSold, event.price);

              return (
                <div className="event-card" key={event._id}>
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <span className={`status-badge ${status.toLowerCase()}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </div>
                  <div className="event-details">
                    <p><strong>Date:</strong> {eventDate.toLocaleDateString()}</p>
                    <p><strong>City:</strong> {event.city}</p>
                    <p><strong>Tickets Sold:</strong> {(event.ticketsSold || 0).toLocaleString()}</p>
                    <p><strong>Revenue:</strong> ₹{revenue.toLocaleString()}</p>
                  </div>
                  <div className="event-actions">
                    <button className="edit-btn" onClick={() => handleEditEvent(event)}>Edit</button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEvent(event._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrganizerDashboard;