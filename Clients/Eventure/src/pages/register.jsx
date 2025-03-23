import { useState } from "react";
import { User, Mail, Lock, Check, AlertCircle } from "lucide-react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Registration() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "attendee", // Default role
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const steps = [
    { id: 0, question: "Hi there! What's your name?", field: "name" },
    { id: 1, question: "Nice to meet you! What's your email address?", field: "email" },
    { id: 2, question: "Great! Let's set up a password to keep your account secure.", field: "password" },
    { id: 3, question: "Could you confirm that password for me?", field: "confirmPassword" },
    { id: 4, question: "Last question! How would you like to participate in events? 🎉", field: "role" },
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });

    if (name === "password") {
      calculatePasswordStrength(value);
    }
  };

  const handleRoleSelect = (role) => {
    setFormData({ ...formData, role });
    setErrors({ ...errors, role: "" });
  };

  const validateStep = () => {
    const currentField = steps[currentStep].field;
    const newErrors = {};

    switch (currentField) {
      case "name":
        if (!formData.name.trim()) {
          newErrors.name = "I didn't catch your name. Could you share it with me?";
        }
        break;
      case "email":
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = "That email doesn't look quite right. Mind double-checking?";
        }
        break;
      case "password":
        if (formData.password.length < 8) {
          newErrors.password = "Let's make that password a bit stronger - at least 8 characters!";
        }
        break;
      case "confirmPassword":
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = "Oops! Those passwords don't match. Let's try again.";
        }
        break;
      case "role":
        if (!formData.role) {
          newErrors.role = "Please select how you'd like to participate! 🤗";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) return;
  
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      console.log("Final Form Data Before Sending:", formData); // ✅ Debugging
      try {
        await registerUser(formData);
        alert("Registration successful! Please log in.");
        navigate("/login");
      } catch (error) {
        console.error("Backend Error:", error); // ✅ Debugging
        setErrors({ backend: error.message || "Registration failed. Please try again." });
      }
    }
  };
  

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleNext();
    }
  };

  const getInputType = (field) => {
    switch (field) {
      case "email":
        return "email";
      case "password":
      case "confirmPassword":
        return "password";
      default:
        return "text";
    }
  };

  const renderRoleSelection = () => (
    <div className="role-selection">
      <button
        type="button"
        onClick={() => handleRoleSelect("organizer")} // 🔥 Changed from "host" to "organizer"
        className={`role-button ${formData.role === "organizer" ? "selected" : ""}`}
      >
        <span>🎪</span>
        <h3>Event Organizer</h3>
        <p>Create and manage your own events, set schedules, and connect with attendees</p>
      </button>
  
      <button
        type="button"
        onClick={() => handleRoleSelect("attendee")}
        className={`role-button ${formData.role === "attendee" ? "selected" : ""}`}
      >
        <span>🎭</span>
        <h3>Event Attendee</h3>
        <p>Discover exciting events, book tickets, and join amazing experiences</p>
      </button>
    </div>
  );
  

  return (
    <div className="registration-container">
      <div className="registration-card">
        <div className="header">
          <h1>Event Registration</h1>
          <p>Step {currentStep + 1} of {steps.length}</p>
        </div>

        <div className="step-content">
          <p>{steps[currentStep].question}</p>

          {steps[currentStep].field !== "role" ? (
            <div className="input-container">
              <span className="input-icon">
                {steps[currentStep].field === "name" && <User size={20} />}
                {steps[currentStep].field === "email" && <Mail size={20} />}
                {(steps[currentStep].field === "password" || steps[currentStep].field === "confirmPassword") && 
                  <Lock size={20} />}
              </span>
              <input
                type={getInputType(steps[currentStep].field)}
                name={steps[currentStep].field}
                value={formData[steps[currentStep].field]}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className={errors[steps[currentStep].field] ? "error" : ""}
                placeholder={`Enter your ${steps[currentStep].field}`}
              />
            </div>
          ) : (
            renderRoleSelection()
          )}

          {steps[currentStep].field === "password" && (
            <div className="password-strength">
              <div className="strength-bars">
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className={index < passwordStrength ? "strong" : ""}
                  />
                ))}
              </div>
              <p>
                Password strength: {
                  passwordStrength === 0 ? "Weak" :
                  passwordStrength === 1 ? "Fair" :
                  passwordStrength === 2 ? "Good" :
                  passwordStrength === 3 ? "Strong" : "Very Strong"
                }
              </p>
            </div>
          )}

          {errors[steps[currentStep].field] && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errors[steps[currentStep].field]}</p>
            </div>
          )}

          {errors.backend && (
            <div className="error-message">
              <AlertCircle size={16} />
              <p>{errors.backend}</p>
            </div>
          )}
        </div>

        <button onClick={handleNext} className="button">
          {currentStep === steps.length - 1 ? (
            <>
              Complete Registration
              <Check size={20} />
            </>
          ) : (
            "Next"
          )}
        </button>

        <div className="footer">
          <p>
            Already have an account? <a href="/login">Log in</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Registration;