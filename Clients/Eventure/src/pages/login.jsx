import { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "That email doesn't look quite right. Mind double-checking?";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Let's make that password a bit stronger - at least 8 characters!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
  
    try {
      const response = await loginUser(formData);
      localStorage.setItem("token", response.token); // Save token
      localStorage.setItem("user", JSON.stringify(response.user)); // Save user data
  
      // Redirect based on role
      if (response.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (response.user.role === "organizer") {
        navigate("/organizer-dashboard");
      } else {
        navigate("/"); // Default homepage for attendees
      }
    } catch (error) {
      setErrors({ backend: error.message || "Login failed. Please try again." });
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="header">
          <h1>Welcome Back!</h1>
          <p>Please log in to continue.</p>
        </div>

        <div className="form-content">
          <div className="input-container">
            <span className="input-icon">
              <Mail size={20} />
            </span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              className={errors.email ? "error" : ""}
            />
          </div>
          {errors.email && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errors.email}</p>
            </div>
          )}

          <div className="input-container">
            <span className="input-icon">
              <Lock size={20} />
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              className={errors.password ? "error" : ""}
            />
          </div>
          {errors.password && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errors.password}</p>
            </div>
          )}

          {errors.backend && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errors.backend}</p>
            </div>
          )}

          <button onClick={handleLogin} className="button">
            Log In
          </button>
        </div>

        <div className="footer">
          <p>
            Don't have an account? <a href="/register">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;