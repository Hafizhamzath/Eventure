import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile, updateUserProfile } from "../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/profile.css";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [eventDates, setEventDates] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data.user);
        setName(data.user.name);
        setEmail(data.user.email);
        setPhoneNumber(data.user.phoneNumber || "");
        setBookings(data.bookings || []);

        const dates = data.bookings.map((booking) => new Date(booking.event.date));
        setEventDates(dates);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to fetch profile. Please try again.");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const updatedUser = await updateUserProfile({ name, email, phoneNumber });
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const tileClassName = ({ date }) => {
    const isEventDate = eventDates.some(
      (eventDate) => date.toDateString() === eventDate.toDateString()
    );
    return isEventDate ? "event-date" : null;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="profile-header">
        <h1>Welcome back, {user?.name}</h1>
      </div>

      <div className="profile-grid">
        <div className="left-sidebar">
          <div className="user-details-card">
            <h2>Personal Information</h2>
            
            <div className="detail-row">
              <div className="detail-label">Name</div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                  />
                ) : (
                  user?.name
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Email</div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="email"
                    className="edit-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                ) : (
                  user?.email
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Phone Number</div>
              <div className="detail-value">
                {isEditing ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  user?.phoneNumber || "Not provided"
                )}
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-label">Role</div>
              <div className="detail-value">{user?.role}</div>
            </div>

            <div className="actions">
              {isEditing ? (
                <button className="button button-primary" onClick={handleSave}>
                  Save Changes
                </button>
              ) : (
                <button className="button button-secondary" onClick={handleEdit}>
                  Edit Profile
                </button>
              )}
            </div>

            <button className="button button-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>

          <div className="calendar-section">
            <h2>Event Calendar</h2>
            <Calendar tileClassName={tileClassName} />
          </div>
        </div>

        <div className="bookings-section">
          <h2>Your Bookings</h2>
          {bookings && bookings.length > 0 ? (
            <ul className="booking-list">
              {bookings.map((booking) => (
                <li key={booking._id} className="booking-item">
                  <p className="booking-detail">
                    <strong>Event:</strong> {booking.event.title}
                  </p>
                  <p className="booking-detail">
                    <strong>Date:</strong> {new Date(booking.event.date).toDateString()}
                  </p>
                  <p className="booking-detail">
                    <strong>Venue:</strong> {booking.event.venue}
                  </p>
                  <p className="booking-detail">
                    <strong>Tickets:</strong> {booking.tickets}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-bookings">No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;