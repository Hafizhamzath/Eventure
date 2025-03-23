import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Function to handle API errors consistently
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw error.response?.data || { message: defaultMessage };
};

// ✅ Token Management - Check Expiry and Refresh if needed
const checkTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const refreshAuthToken = async () => {
  try {
    const response = await API.post("/auth/refresh");
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    }
  } catch (error) {
    console.error("Token refresh failed", error);
  }
  return null;
};


export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  console.log("🚀 Sending Token:", token);

  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user profile");
    }

    const data = await response.json();
    console.log("API Response:", data); // Log the API response
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  console.log("🚀 Sending Token:", token);

  try {
    const response = await fetch("http://localhost:5000/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    const data = await response.json();
    console.log("API Response:", data); // Log the API response
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

// ✅ Add a request interceptor to include the JWT token in headers
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("token");

  if (token) {
    if (checkTokenExpiration(token)) {
      console.log("🔄 Token expired, refreshing...");
      token = await refreshAuthToken();
      if (token) {
        localStorage.setItem("token", token);
      }
    }
    if (token) {
      console.log("🚀 Sending Token:", `Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("⚠️ No valid token found after refresh attempt");
    }
  } else {
    console.log("❌ No token found in localStorage");
  }

  return config;
});

// ✅ Updated User Authentication API Calls
export const registerUser = async (formData) => {
  try {
    const { data } = await API.post("/auth/register", formData);
    return data;
  } catch (error) {
    return handleApiError(error, "Registration Failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await API.post("/auth/login", credentials);

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user details
    }

    return data;
  } catch (error) {
    return handleApiError(error, "Login Failed");
  }
};

// ✅ Updated Admin-Specific API Calls
export const fetchAllUsers = async () => {
  try {
    const { data } = await API.get("/admin/users");
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch users");
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await API.post("/admin/users", userData);
    return data;
  } catch (error) {
    return handleApiError(error, "User creation failed");
  }
};

export const updateUser = async (userId, userData) => {
  try {
    const { data } = await API.put(`/admin/users/${userId}`, userData);
    return data;
  } catch (error) {
    return handleApiError(error, "User update failed");
  }
};

export const deleteUser = async (userId) => {
  try {
    await API.delete(`/admin/users/${userId}`);
    return { success: true };
  } catch (error) {
    return handleApiError(error, "User deletion failed");
  }
};

// ✅ Updated Event Management API Calls
export const fetchPublicEvents = async () => {
  try {
    const { data } = await API.get("/events/public");
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch events");
  }
};

export const createEvent = async (eventData) => {
  try {
    const { data } = await API.post("/events", eventData);
    return data;
  } catch (error) {
    return handleApiError(error, "Event creation failed");
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const { data } = await API.put(`/events/${eventId}`, eventData);
    return data;
  } catch (error) {
    return handleApiError(error, "Event update failed");
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const { data } = await API.delete(`/events/${eventId}`);
    return data;
  } catch (error) {
    return handleApiError(error, "Event deletion failed");
  }
};

// ✅ Updated Booking and Payment API Calls
export const fetchAllBookings = async () => {
  try {
    const { data } = await API.get("/admin/bookings"); // Fetch bookings with populated details
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch bookings");
  }
};




export const fetchAllPayments = async () => {
  try {
    const { data } = await API.get("/payments");
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch payments");
  }
};

export default API;
