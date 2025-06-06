import axios from "axios";

const API_BASE_URL = "http://localhost:9000";

export const providerService = {
  getRequests: async (params) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Set the authorization header
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          providerId: params.providerId,
          service_type:
            params.serviceType !== "all" ? params.serviceType : undefined,
          show_new_only: params.showNewOnly,
          page: params.page || 1,
          limit: params.limit || 10,
        },
      };

      console.log("Making request with config:", config);

      const response = await axios.get(
        `${API_BASE_URL}/api/provider/requests/`,
        config
      );

      console.log("Response received:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getRequests:", error.response || error);
      throw error;
    }
  },
};

export default providerService;
