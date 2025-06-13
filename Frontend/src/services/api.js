import axios from "axios";
import { jwtDecode } from "jwt-decode";

// API base URL
const API_BASE_URL = "http://localhost:9000";

// Tech Profile API (for provider matching)
const TECH_PROFILE_API_URL = "http://127.0.0.1:8000";

// Function to get user ID from token
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.user_id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  }
  return null;
};

// Create an axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tech Profile API (for provider matching)
const techProfileClient = axios.create({
  baseURL: TECH_PROFILE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Admin API services
export const adminService = {
  // Get all users with pagination and filters
  getUsers: async (
    page = 1,
    limit = 10,
    role = "",
    status = "",
    search = ""
  ) => {
    try {
      const response = await apiClient.get("/api/admin/users", {
        params: { page, limit, role, status, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },

  // Update user status (can be extended for other user operations)
  updateUserStatus: async (userId, status) => {
    try {
      const response = await apiClient.patch(
        `/api/admin/users/${userId}/status`,
        { status }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user status:", error);
      throw error;
    }
  },

  // Get all service providers with pagination and filters
  getProviders: async (
    page = 1,
    limit = 10,
    category = "",
    city = "",
    status = "",
    search = ""
  ) => {
    try {
      const response = await apiClient.get("/api/admin/providers", {
        params: { page, limit, category, city, status, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
    }
  },

  // Activate a user/provider
  activateUser: async (userId) => {
    try {
      const response = await apiClient.post(
        `/api/admin/users/${userId}/activate`
      );
      return response.data;
    } catch (error) {
      console.error("Error activating user:", error);
      throw error;
    }
  },

  // Deactivate a user/provider
  deactivateUser: async (userId) => {
    try {
      const response = await apiClient.post(
        `/api/admin/users/${userId}/deactivate`
      );
      return response.data;
    } catch (error) {
      console.error("Error deactivating user:", error);
      throw error;
    }
  },

  // Get all services with pagination and filters
  getServices: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get("/api/service-categories/", {
        params: { page, limit },
      });
      return {
        success: true,
        data: {
          services: response.data.data,
          total: response.data.pagination.total,
          pages: Math.ceil(
            response.data.pagination.total / response.data.pagination.limit
          ),
          currentPage: response.data.pagination.page,
        },
      };
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // Create a new service
  createService: async (serviceData) => {
    try {
      const response = await apiClient.post(
        "/api/service-categories/",
        serviceData
      );
      return {
        success: response.status === 201,
        data: response.data,
      };
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Update an existing service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await apiClient.put(
        `/api/service-categories/${serviceId}/`,
        serviceData
      );
      return {
        success: response.status === 200,
        data: response.data,
      };
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete a service
  deleteService: async (serviceId) => {
    try {
      const response = await apiClient.delete(
        `/api/service-categories/${serviceId}/`
      );
      return {
        success: response.status === 204,
      };
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },
};

// Service Categories API
export const serviceCategories = {
  // Get all service categories
  getCategories: async () => {
    try {
      const response = await apiClient.get("/api/service-categories/");
      return response.data;
    } catch (error) {
      console.error("Error fetching service categories:", error);
      throw error;
    }
  },
};

// Tech Profile API (for provider matching)
export const techProfileService = {
  // Get all tech profiles
  getAllProfiles: async () => {
    try {
      const response = await techProfileClient.get("/users/tech-profiles/all/");
      return response.data;
    } catch (error) {
      console.error("Error fetching tech profiles:", error);
      throw error;
    }
  },
};

// User Profile API
export const userProfileService = {
  // Get home owner info
  getProfile: async (userId) => {
    try {
      const response = await techProfileClient.get(`/users/me/${userId}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  },
  // Update home owner info
  updateProfile: async (userId, profileData) => {
    try {
      const response = await techProfileClient.put(
        `/users/users/${userId}/update/`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  },
  // Delete home owner account
  deleteProfile: async (userId) => {
    try {
      const response = await techProfileClient.delete(
        `/users/users/${userId}/delete/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting user profile:", error);
      throw error;
    }
  },
};

// Provider Profile API
export const providerProfileService = {
  // Get provider info
  getProfile: async (userId) => {
    try {
      const response = await techProfileClient.get(
        `/users/tech-profiles/by-user/${userId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching provider profile:", error);
      throw error;
    }
  },
  // Update provider info
  updateProfile: async (profileId, profileData) => {
    try {
      const response = await techProfileClient.put(
        `/users/tech-profiles/${profileId}/update/`,
        profileData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating provider profile:", error);
      throw error;
    }
  },
  // Delete provider account
  deleteProfile: async (profileId) => {
    try {
      const response = await techProfileClient.delete(
        `/users/tech-profiles/${profileId}/delete/`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting provider profile:", error);
      throw error;
    }
  },
};

// Export the axios instance for direct use if needed
export default apiClient;
