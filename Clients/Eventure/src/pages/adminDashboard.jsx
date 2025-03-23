import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import { 
  fetchAllUsers, 
  fetchPublicEvents, 
  fetchAllBookings, 
  deleteUser, 
  updateUser, 
  createEvent, 
  updateEvent,
  deleteEvent
} from "../services/api"; // Using your existing API functions
import { 
  FaChartBar, 
  FaUsers, 
  FaCalendarAlt, 
  FaBookmark, 
  FaBars, 
  FaSearch, 
  FaSignOutAlt, 
  FaEdit, 
  FaTrash 
} from 'react-icons/fa';
import "../styles/adminDashboard.css"; 

const AdminDashboard = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
 const [editingUser, setEditingUser] = useState(null); 
 const [roleFilter, setRoleFilter] = useState("all");
 const [userForm, setUserForm] = useState({ name: "", email: "", password: "" });
 const [showModal, setShowModal] = useState(false); // Handle modal visibility
 const [eventData, setEventData] = useState({ title: "", description: "", date: "" });
 const [editingEventId, setEditingEventId] = useState(null); // Store event ID when editing


  const navigate = useNavigate();

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");
  
        const [usersData, eventsData, bookingsData] = await Promise.all([
          fetchAllUsers(token),
          fetchPublicEvents(token),
          fetchAllBookings(token),
        ]);
  
        setUsers(usersData || []);
        setEvents(eventsData || []);
        setBookings(bookingsData || []);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadData();
  }, []);
  
  

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDeleteUserClick = (userId) => {
    console.log("🔍 Received userId for deletion:", userId);
    setUserToDelete(userId);
    setShowDeleteModal(true);
};

const handleSaveEvent = async () => {
  if (!eventData.title || !eventData.date) {
    alert("Title and Date are required!");
    return;
  }

  try {
    const token = localStorage.getItem("token");

    if (editingEventId) {
      await updateEvent(editingEventId, eventData, token);
      setEvents(events.map(event => event._id === editingEventId ? { ...event, ...eventData } : event));
    } else {
      const newEvent = await createEvent(eventData, token);
      setEvents([...events, newEvent]);
    }

    setShowModal(false);
    setEventData({ title: "", description: "", date: "" });
    setEditingEventId(null);
  } catch (error) {
    console.error("Error saving event:", error);
  }
};


  
  const confirmDeleteUser = async () => {
    if (!userToDelete) {
      console.error("❌ Error: No user ID provided for deletion!");
      return;
    }
  
    console.log("🗑️ Attempting to delete user with ID:", userToDelete);
  
    try {
      await deleteUser(userToDelete);
      console.log("✅ User deleted successfully");
      setUsers(users.filter(user => user.id !== userToDelete));
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };
  



  const handleSaveUser = async () => {
    if (!editingUser) {
        console.error("❌ Error: No user is being edited!");
        return;
    }

    console.log("📝 Updating user with ID:", editingUser?._id); // Debugging log
    // console.log("📋 User data being sent:", userForm); // Check the data being passed

    if (!editingUser._id) {
        console.error("❌ Error: User ID is undefined!");
        return;
    }

    try {
        await updateUser(editingUser._id, userForm);
        console.log("✅ User updated successfully");

        setUsers(users.map(u => (u._id === editingUser._id ? { ...u, ...userForm } : u)));
    } catch (error) {
        console.error("❌ Error updating user:", error);
    } finally {
        setShowUserModal(false);
    }
};





  const handleAddUserClick = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "" });
    setShowUserModal(true);
};

const handleEditUserClick = (user) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: "" }); // Password empty for security
    setShowUserModal(true);
};


  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-wrapper">
      {/* Sidebar */}
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          {!isCollapsed && <h3 className="sidebar-brand">Admin Panel</h3>}
          <Button 
            variant="light" 
            className="toggle-btn" 
            onClick={toggleSidebar}
          >
            <FaBars />
          </Button>
        </div>
        
        <Nav className="flex-column sidebar-nav">
          <Nav.Item>
            <Nav.Link 
              className={activeSection === "dashboard" ? "active" : ""} 
              onClick={() => setActiveSection("dashboard")}
            >
              <FaChartBar />
              {!isCollapsed && <span className="ms-2">Dashboard</span>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className={activeSection === "users" ? "active" : ""} 
              onClick={() => setActiveSection("users")}
            >
              <FaUsers />
              {!isCollapsed && <span className="ms-2">Users</span>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className={activeSection === "events" ? "active" : ""} 
              onClick={() => setActiveSection("events")}
            >
              <FaCalendarAlt />
              {!isCollapsed && <span className="ms-2">Events</span>}
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link 
              className={activeSection === "bookings" ? "active" : ""} 
              onClick={() => setActiveSection("bookings")}
            >
              <FaBookmark />
              {!isCollapsed && <span className="ms-2">Bookings</span>}
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <div className="sidebar-footer">
          <Button variant="outline-danger" className="signout-btn" onClick={handleSignOut}>
            <FaSignOutAlt />
            {!isCollapsed && <span className="ms-2">Sign Out</span>}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <h1 className="page-title">
            {activeSection === "dashboard" && "Dashboard Overview"}
            {activeSection === "users" && "User Management"}
            {activeSection === "events" && "Event Management"}
            {activeSection === "bookings" && "Booking Management"}
          </h1>
          <div className="topbar-right">
            <div className="user-profile">
              <div className="avatar">A</div>
              <span className="username">Admin</span>
            </div>
          </div>
        </header>

        <Container fluid className="py-4">
          {isLoading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading data...</p>
            </div>
          ) : (
            <>
              {/* Dashboard Section */}
              {activeSection === "dashboard" && (
                <>
                  {/* Stats Cards */}
                  <Row className="mb-4">
                    <Col lg={4} md={6} className="mb-3">
                      <Card className="stat-card">
                        <Card.Body className="d-flex align-items-center">
                          <div className="stat-icon users-icon">
                            <FaUsers />
                          </div>
                          <div className="ms-3">
                            <Card.Subtitle className="text-muted">Total Users</Card.Subtitle>
                            <Card.Title className="mb-0 display-6">{users.length}</Card.Title>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col lg={4} md={6} className="mb-3">
                      <Card className="stat-card">
                        <Card.Body className="d-flex align-items-center">
                          <div className="stat-icon events-icon">
                            <FaCalendarAlt />
                          </div>
                          <div className="ms-3">
                            <Card.Subtitle className="text-muted">Total Events</Card.Subtitle>
                            <Card.Title className="mb-0 display-6">{events.length}</Card.Title>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    
                    <Col lg={4} md={6} className="mb-3">
                      <Card className="stat-card">
                        <Card.Body className="d-flex align-items-center">
                          <div className="stat-icon bookings-icon">
                            <FaBookmark />
                          </div>
                          <div className="ms-3">
                            <Card.Subtitle className="text-muted">Total Bookings</Card.Subtitle>
                            <Card.Title className="mb-0 display-6">{bookings.length}</Card.Title>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                  
                {/* Recent Activities */}
<Row>
  <Col>
    <Card>
      <Card.Header>
        <Card.Title className="mb-0">Recent Activities</Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="activity-list">
          {bookings
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort latest first
            .slice(0, 5) // Take only the latest 5 bookings
            .map((booking, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">📌</div>
                <div className="activity-details">
                  <p className="activity-title mb-1">New booking #{index + 1}</p>
                  <p className="activity-desc mb-1">
                    {(booking.user?.username || `User ID: ${booking.user?._id}`) || "Unknown User"} booked{" "}
                    {booking.event?.title || "an event"}
                  </p>
                  <p className="activity-time text-muted">
                    {new Date(booking.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </Card.Body>
    </Card>
  </Col>
</Row>




                </>
              )}

              {/* Users Section */}
              {activeSection === "users" && (
  <Card>
    <Card.Header className="d-flex justify-content-between align-items-center">
      <Card.Title className="mb-0">User Management</Card.Title>
      
      {/* Sorting Dropdown */}
      <Form.Select
        className="w-auto"
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
      >
        <option value="all">All Users</option>
        <option value="organizer">Organizers</option>
        <option value="attendee">Attendees</option>
      </Form.Select>
    </Card.Header>

    <Card.Body>
      <div className="table-responsive">
        <Table striped hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th> {/* New Styled Role Column */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers
                .filter((user) => roleFilter === "all" || user.role === roleFilter) // Sorting Logic
                .map((user, index) => (
                  <tr key={user.id || index}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar">{user.name?.charAt(0) || "U"}</div>
                        <div className="ms-2">{user.name || "John Doe"}</div>
                      </div>
                    </td>
                    <td>{user.email || "user@example.com"}</td>

                    {/* Role Column with Styled Badges & Icons */}
                    <td>
                      {user.role === "attendee" && (
                        <Badge bg="info" className="px-3 py-2">
                          🎟️ Attendee
                        </Badge>
                      )}
                      {user.role === "organizer" && (
                        <Badge bg="warning" className="px-3 py-2 text-dark">
                          🎤 Organizer
                        </Badge>
                      )}
                      {user.role === "admin" && (
                        <Badge bg="danger" className="px-3 py-2">
                          🛡️ Admin
                        </Badge>
                      )}
                      {!user.role && (
                        <Badge bg="secondary" className="px-3 py-2">
                          👤 User
                        </Badge>
                      )}
                    </td>

                    <td>
                      <Badge bg="success" pill>Active</Badge>
                    </td>

                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditUserClick(user)}
                      >
                        <FaEdit /> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteUserClick(user._id)}
                      >
                        <FaTrash /> Delete
                      </Button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3">
                  {searchTerm ? "No users match your search" : "No users found"}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing <span className="fw-bold">{filteredUsers.length}</span> users
        </div>
        <div>
          <Button variant="outline-secondary" size="sm" className="me-2" disabled>
            Previous
          </Button>
          <Button variant="outline-secondary" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </Card.Body>
  </Card>
)}




{/* Add/Edit User Modal */}
<Modal show={showUserModal} onHide={() => setShowUserModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>{editingUser ? "Edit User" : "Add User"}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          value={userForm.name} 
          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control 
          type="email" 
          value={userForm.email} 
          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
        />
      </Form.Group>
      {/* <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control 
          type="password" 
          value={userForm.password} 
          onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
        />
      </Form.Group> */}
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowUserModal(false)}>Cancel</Button>
    <Button variant="primary" onClick={handleSaveUser}>
      {editingUser ? "Update User" : "Create User"}
    </Button>
  </Modal.Footer>
</Modal>


            {/* Events Section */}
{activeSection === "events" && (
  <Card>
    <Card.Header>
      <Card.Title className="mb-0">Event Management</Card.Title>
    </Card.Header>
    <Card.Body>
      <Row>
        {events.slice(0, 6).map((event, index) => (
          <Col lg={4} md={6} key={event._id || index} className="mb-4">
            <Card className="h-100">
              {/* Display Event Image */}
              {event.image ? (
                <Card.Img variant="top" src={event.image} alt={event.title} className="event-image" />
              ) : (
                <div className="event-image-placeholder d-flex align-items-center justify-content-center">
                  <FaCalendarAlt size={50} className="text-secondary" />
                </div>
              )}

              <Card.Body>
                <Card.Title>{event.title || `Event ${index + 1}`}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {new Date(event.date).toDateString()}
                </Card.Subtitle>
                <Card.Text>
                  {event.description?.substring(0, 80) || "Event description goes here..."}
                </Card.Text>
              </Card.Body>

              <Card.Footer className="bg-transparent">
                <Button variant="outline-primary" size="sm" className="me-2">
                  <FaEdit /> Edit
                </Button>
                <Button variant="outline-danger" size="sm">
                  <FaTrash /> Delete
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Card.Body>
  </Card>
)}

              {/* Bookings Section */}
              {activeSection === "bookings" && (
              <Card>
              <Card.Header>
                <Card.Title className="mb-0">Booking Management</Card.Title>
              </Card.Header>
              <Card.Body>
                  <div className="table-responsive">
                  <Table striped hover>
                  <thead>
                  <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Event</th>
                  <th>Organizer</th>
                  <th>Date</th>
                  <th>Status</th>
                  </tr>
                  </thead>
                  <tbody>
                  {bookings.slice(0, 8).map((booking, index) => {
                  const eventDate = new Date(booking.event?.date);
                  const currentDate = new Date();
                  const isCompleted = eventDate < currentDate;

                 return (
                  <tr key={booking._id || index}>
                  <td>#{booking._id || index + 1}</td>
                  <td>{booking.user?.name || "Unknown User"}</td>
                  <td>{booking.event?.title || "Unknown Event"}</td>
                  <td>{booking.event?.organizer?.name || "Unknown Organizer"}</td>
                  <td>{eventDate.toLocaleDateString() || "N/A"}</td>
                  <td>
                    <Badge bg={isCompleted ? 'primary' : 'success'} pill>
                      {isCompleted ? 'Completed' : 'Confirmed'}
                    </Badge>
                  </td>
                  </tr>
                );
              })}
            </tbody>
            </Table>
          </div>
          </Card.Body>
        </Card>
          )}
            </>
          )}
        </Container>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete User
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;