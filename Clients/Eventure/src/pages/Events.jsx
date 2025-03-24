import  { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import "../styles/events.css"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';



const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    axios.get('https://eventure-backend-1ewk.onrender.com/api/events/public') // Public API for all users
      .then(response => {
        setEvents(response.data);
        setFilteredEvents(response.data);
      })
      .catch(error => console.error('Error fetching events:', error));
  }, []);
  

  const handleFilter = () => {
    let filtered = events;
  
    // Filter by event name (search query)
    if (search) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(search.toLowerCase())
      );
    }
  
    // Filter by category
    if (category) {
      filtered = filtered.filter(event => event.category.toLowerCase() === category.toLowerCase());
    }
  
    // Filter by location
    if (location) {
      filtered = filtered.filter(event => event.city.toLowerCase().includes(location.toLowerCase()));
    }
  
    setFilteredEvents(filtered);
  };
  useEffect(() => {
    handleFilter();
  }, [search, category, location]); // Runs when search, category, or location changes
  
  
  

  return (
    <>
      <div className="events-hero-section text-center text-white">
        <Container>
          <h1>Explore Exciting Events</h1>
          <p>Find and book events near you.</p>
        </Container>
      </div>

      <Container className="my-5">
        {/* Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={4}>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Food">Food</option>
            </Form.Select>
          </Col>
          <Col md={4}>
          <Form.Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All Locations</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Cochin">Cochin</option>
              <option value="Delhi">Delhi</option>
              <option value="Goa">Goa</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Mumbai">Mumbai</option>
            </Form.Select>
          </Col>
        </Row>
        <Button variant="primary" onClick={handleFilter}>Apply Filters</Button>

        {/* Events List */}
        <Row className="mt-4">
          {filteredEvents.length > 0 ? filteredEvents.map(event => (
            <Col md={4} key={event._id} className="mb-4">
              <Card className="event-card">
                <Card.Img variant="top" src={event.image || 'https://via.placeholder.com/300'} />
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Text>{format(new Date(event.date), "MMMM dd, yyyy hh:mm a")} - {event.venue}</Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => {
                      const user = localStorage.getItem("user"); // Check if user is logged in
                      if (user) {
                        window.location.href = `/events/${event._id}`; // Redirect if logged in
                      } else {
                        toast.warn("Login First", {
                          position: "top-right", // Toast position
                          autoClose: 2000, // Auto close after 2 seconds
                          hideProgressBar: false, // Show progress bar
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          theme: "light",
                        });
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          )) : <p className="text-center w-100">No events found.</p>}
        </Row>
      </Container>
    </>
  );
};

export default Events;
