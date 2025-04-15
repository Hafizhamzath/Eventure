import axios from "axios";

const API = axios.create({
  baseURL: "https://eventure-backend-1ewk.onrender.com/api",
});

// ✅ Function to handle API errors consistently
const handleApiError = (error, defaultMessage) => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw error.response?.data || { message: defaultMessage };
};

// ✅ Token Expiration Check
const checkTokenExpiration = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// ✅ Refresh Token Function
const refreshAuthToken = async () => {
  try {
    const response = await API.post("/auth/refresh");
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token); // Store new token in localStorage
      return response.data.token;
    }
  } catch (error) {
    console.error("Token refresh failed", error);
  }
  return null;
};

// ✅ Request Interceptor
API.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem("token");

    if (token && checkTokenExpiration(token)) {
      console.log("🔄 Token expired, refreshing...");
      token = await refreshAuthToken();

      if (token) {
        localStorage.setItem("token", token);
      } else {
        console.warn("⚠️ Refresh failed. Logging out.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login
        return Promise.reject("Unable to refresh token");
      }
    }

    if (token) {
      console.log("🚀 Sending Token:", `Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("❌ No valid token found");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor for handling 401 errors
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and the request has not been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken();
      if (newToken) {
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return API(originalRequest); // Retry the original request with the new token
      }
    }
    return Promise.reject(error);
  }
);

// ✅ User Authentication API Calls
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

export const fetchUserProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw handleApiError(error, "Failed to fetch profile");
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const { data } = await API.put("/auth/profile", profileData);
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw handleApiError(error, "Failed to update profile");
  }
};

// ✅ Admin-Specific API Calls
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

// ✅ Event Management API Calls
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

// ✅ Booking & Payment API Calls
export const fetchAllBookings = async () => {
  try {
    const { data } = await API.get("/admin/bookings");
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
