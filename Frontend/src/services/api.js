import axios from "axios";

// API base URL
const API_BASE_URL = "http://localhost:8000";

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
  getServices: async (
    page = 1,
    limit = 10,
    category = "",
    status = "",
    search = ""
  ) => {
    try {
      const response = await apiClient.get("/api/admin/services", {
        params: { page, limit, category, status, search },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      throw error;
    }
  },

  // Create a new service
  createService: async (serviceData) => {
    try {
      const response = await apiClient.post("/api/admin/services", serviceData);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw error;
    }
  },

  // Update an existing service
  updateService: async (serviceId, serviceData) => {
    try {
      const response = await apiClient.put(
        `/api/admin/services/${serviceId}`,
        serviceData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw error;
    }
  },

  // Delete a service
  deleteService: async (serviceId) => {
    try {
      const response = await apiClient.delete(
        `/api/admin/services/${serviceId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw error;
    }
  },
};

// Export the axios instance for direct use if needed
export default apiClient;
