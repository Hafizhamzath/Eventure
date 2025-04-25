import axios from "axios";

const API = axios.create({
  baseURL: "https://eventure-backend-1ewk.onrender.com/api",
});

// ========================
// 🛠 Utility Functions
// ========================
const handleApiError = (error, defaultMessage = "An error occurred") => {
  console.error(defaultMessage, error.response?.data || error.message);
  throw error.response?.data || { message: defaultMessage };
};

const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  return payload ? payload.exp * 1000 < Date.now() : true;
};

// ========================
// 🔐 Authentication Helpers
// ========================
const storeAuthData = ({ token, refreshToken, user }) => {
  if (token) localStorage.setItem("token", token);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  if (user) localStorage.setItem("user", JSON.stringify(user));
};

const clearAuthData = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

const refreshAuthToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await API.post("/auth/refresh", { refreshToken });
    
    if (response.data?.token) {
      storeAuthData({
        token: response.data.token,
        refreshToken: response.data.refreshToken || refreshToken // Use new refreshToken if provided
      });
      return response.data.token;
    }
  } catch (error) {
    console.error("🔴 Token refresh failed:", error);
    clearAuthData();
    window.location.href = "/login?session_expired=true";
  }
  return null;
};

// ========================
// 🔄 Axios Interceptors
// ========================
API.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");

  if (token) {
    if (isTokenExpired(token)) {
      console.log("🔄 Token expired, attempting refresh...");
      const newToken = await refreshAuthToken();
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
      } else {
        console.warn("⚠️ Proceeding without valid token");
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Auto-retry with new token on 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAuthToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return API(originalRequest);
      }
    }

    // Special handling for token-related errors
    if (error.response?.data?.message?.includes("token")) {
      clearAuthData();
      window.location.href = "/login?session_expired=true";
    }

    return Promise.reject(error);
  }
);

// ========================
// 👤 User Authentication
// ========================
export const registerUser = async (formData) => {
  try {
    const { data } = await API.post("/auth/register", formData);
    storeAuthData(data);
    return data;
  } catch (error) {
    return handleApiError(error, "Registration failed");
  }
};

export const loginUser = async (credentials) => {
  try {
    const { data } = await API.post("/auth/login", credentials);
    storeAuthData(data);
    return data;
  } catch (error) {
    return handleApiError(error, "Login failed");
  }
};

export const logoutUser = async () => {
  try {
    await API.post("/auth/logout");
  } finally {
    clearAuthData();
    window.location.href = "/login";
  }
};

// ========================
// 📱 User Profile
// ========================
export const fetchUserProfile = async () => {
  try {
    const { data } = await API.get("/auth/profile");
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to fetch profile");
  }
};

export const updateUserProfile = async (profileData) => {
  try {
    const { data } = await API.put("/auth/profile", profileData);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  } catch (error) {
    return handleApiError(error, "Failed to update profile");
  }
};

// ========================
// 👑 Admin Functions
// ========================
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

// ========================
// 🎟 Event Management
// ========================
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

// ========================
// 💳 Booking & Payments
// ========================
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