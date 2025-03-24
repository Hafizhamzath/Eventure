// src/services/api.js

const API_BASE_URL =  'https://eventure-backend-i38o.onrender.com/api';

// Generic request function with authentication
const makeRequest = async (endpoint, method = 'GET', data = null, token) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle non-successful responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // For DELETE requests or other requests that might not return JSON
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Admin Dashboard API Functions

// User Management
export const fetchUsers = async (token) => {
  return makeRequest('/admin/users', 'GET', null, token);
};

export const createUser = async (userData, token) => {
  return makeRequest('/admin/users', 'POST', userData, token);
};

export const updateUser = async (userId, userData, token) => {
  return makeRequest(`/admin/users/${userId}`, 'PUT', userData, token);
};

export const deleteUser = async (userId, token) => {
  return makeRequest(`/admin/users/${userId}`, 'DELETE', null, token);
};

// Event Management
export const fetchEvents = async (token) => {
  return makeRequest('/admin/events', 'GET', null, token);
};

export const createEvent = async (eventData, token) => {
  return makeRequest('/admin/events', 'POST', eventData, token);
};

export const updateEvent = async (eventId, eventData, token) => {
  return makeRequest(`/admin/events/${eventId}`, 'PUT', eventData, token);
};

export const deleteEvent = async (eventId, token) => {
  return makeRequest(`/admin/events/${eventId}`, 'DELETE', null, token);
};

// Booking Management
export const fetchBookings = async (token) => {
  return makeRequest('/admin/bookings', 'GET', null, token);
};

export const updateBookingStatus = async (bookingId, statusData, token) => {
  return makeRequest(`/admin/bookings/${bookingId}/status`, 'PUT', statusData, token);
};

export const deleteBooking = async (bookingId, token) => {
  return makeRequest(`/admin/bookings/${bookingId}`, 'DELETE', null, token);
};

// Dashboard Statistics
export const fetchDashboardStats = async (token) => {
  return makeRequest('/admin/dashboard/stats', 'GET', null, token);
};

export const fetchRecentActivities = async (token) => {
  return makeRequest('/admin/dashboard/activities', 'GET', null, token);
};

// Authentication
export const adminLogin = async (credentials) => {
  return makeRequest('/auth/admin/login', 'POST', credentials);
};

export const verifyAdminToken = async (token) => {
  return makeRequest('/auth/admin/verify', 'GET', null, token);
};