import { useState, useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ✅ Check localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setIsLoggedIn(true);
      setUserRole(user.role);
    }
  }, []);

  // ✅ Handle Login/Logout
  const handleAuthToggle = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserRole(null);
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  // ✅ Handle Create Events Click
  const handleCreateEventsClick = () => {
    if (!isLoggedIn) {
      toast.info("Please log in first.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (userRole === "attendee") {
      toast.warning("Only accessible for organizers.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (userRole === "organizer") {
      navigate("/create-event");
    }
  };

  // ✅ Check if the current page is one of the organizer pages
  const organizerPages = ["/create-event", "/register-event", "/organizer-dashboard"];
  const isOrganizerPage = organizerPages.includes(location.pathname);

  return (
    <>
      <Navbar expand="lg" className="navbar navbar-light bg-white shadow-sm fixed-top">
        <Container>
          <Navbar.Brand href="/" className="fw-bold text-primary">Eventure</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto d-flex align-items-center gap-3">
              {/* 🟢 "Events" link */}
              <Nav.Link onClick={() => navigate("/events")} className="text-dark fw-medium" style={{ cursor: "pointer" }}>
                Events
              </Nav.Link>

              {/* 🟡 "Create Events" link (visible if not on organizer pages) */}
              {!isOrganizerPage && (
                <Nav.Link
                  onClick={handleCreateEventsClick}
                  className="text-dark fw-medium"
                  style={{ cursor: "pointer" }}
                >
                  Create Events
                </Nav.Link>
              )}

              {/* 🟣 "Manage Events" dropdown (visible on organizer pages) */}
              {isOrganizerPage && (
                <NavDropdown title="Manage Events" className="fw-medium">
                  <NavDropdown.Item onClick={() => navigate("/register-event")}>
                    Register Events
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => navigate("/organizer-dashboard")}>
                    Dashboard
                  </NavDropdown.Item>
                </NavDropdown>
              )}

              {/* 🔴 Login/Logout Button */}
              {!isLoggedIn ? (
                <button className="btn btn-primary px-3 rounded-pill text-white" onClick={handleAuthToggle}>
                  Login
                </button>
              ) : userRole === "attendee" ? (
                <button className="btn btn-success px-3 rounded-pill text-white" onClick={() => navigate("/profile")}>
                  Profile
                </button>
              ) : (
                <button className="btn btn-danger px-3 rounded-pill text-white" onClick={handleAuthToggle}>
                  Logout
                </button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Toast Container for Notifications */}
      <ToastContainer />
    </>
  );
};

export default NavbarComponent;