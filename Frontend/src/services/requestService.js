import apiClient from "./api";

export const requestService = {
  // Create a new service request
  createRequest: async (requestData) => {
    try {
      // Create FormData object to handle file uploads
      const formData = new FormData();

      // Add all request data except attachments
      Object.keys(requestData).forEach((key) => {
        if (key !== "attachments") {
          if (Array.isArray(requestData[key])) {
            // Handle array fields - send as JSON string
            formData.append(key, JSON.stringify(requestData[key]));
          } else {
            formData.append(key, requestData[key]);
          }
        }
      });

      // Add attachments if any
      if (requestData.attachments && requestData.attachments.length > 0) {
        requestData.attachments.forEach((file) => {
          formData.append("attachments[]", file);
        });
      }

      const response = await apiClient.post(
        "/api/service-requests/create/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error creating service request:", error);
      throw error;
    }
  },

  // Get all service requests for the current user
  getUserRequests: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get("/api/service-requests/", {
        params: { page, limit },
      });
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Error fetching user requests:", error);
      throw error;
    }
  },

  // Get a specific service request by ID
  getRequestById: async (requestId) => {
    try {
      const response = await apiClient.get(
        `/api/service-requests/${requestId}/`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching request details:", error);
      throw error;
    }
  },

  // Update a service request
  updateRequest: async (requestId, updateData) => {
    try {
      const response = await apiClient.put(
        `/api/service-requests/${requestId}/`,
        updateData
      );
      return response.data;
    } catch (error) {
      console.error("Error updating service request:", error);
      throw error;
    }
  },

  // Cancel a service request
  cancelRequest: async (requestId) => {
    try {
      const response = await apiClient.post(
        `/api/service-requests/${requestId}/cancel/`
      );
      return response.data;
    } catch (error) {
      console.error("Error canceling service request:", error);
      throw error;
    }
  },

  // Get all requests with pagination and filters
  getRequests: async (params = {}) => {
    try {
      const {
        page = 1,
        limit = 10,
        status,
        service_type,
        is_urgent,
        schedule_type,
        ...otherParams
      } = params;

      const response = await apiClient.get("/api/service-requests/", {
        params: {
          page,
          limit,
          status,
          service_type,
          is_urgent,
          schedule_type,
          ...otherParams,
        },
      });

      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Error fetching requests:", error);
      throw error;
    }
  },

  // Delete a request
  deleteRequest: async (requestId) => {
    try {
      await apiClient.delete(`/api/service-requests/${requestId}/`);
      return true;
    } catch (error) {
      console.error("Error deleting request:", error);
      throw error;
    }
  },

  // Upload request attachments
  uploadAttachments: async (requestId, files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("attachments[]", file);
      });

      const response = await apiClient.post(
        `/api/service-requests/${requestId}/attachments/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading attachments:", error);
      throw error;
    }
  },

  // Get customer's requests
  getCustomerRequests: async (customerId, params = {}) => {
    try {
      const { page = 1, limit = 10, ...otherParams } = params;
      const response = await apiClient.get(
        `/api/customers/${customerId}/requests/`,
        {
          params: {
            page,
            limit,
            ...otherParams,
          },
        }
      );
      return {
        data: response.data.data,
        pagination: response.data.pagination,
      };
    } catch (error) {
      console.error("Error fetching customer requests:", error);
      throw error;
    }
  },

  // Match request with provider
  matchProvider: async (requestId, providerId) => {
    try {
      const response = await apiClient.post(
        `/api/requests/${requestId}/match/`,
        {
          provider_id: providerId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error matching provider:", error);
      throw error;
    }
  },

  // Update request status
  updateRequestStatus: async (requestId, status) => {
    try {
      const response = await apiClient.patch(
        `/api/requests/${requestId}/status/`,
        {
          status,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating request status:", error);
      throw error;
    }
  },
};

export default requestService;
