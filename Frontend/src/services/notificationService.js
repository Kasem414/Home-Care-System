import axios from "axios";
import { getUserIdFromToken, getUserRoleFromToken } from "./api";

// Notification API base URL
const NOTIFICATION_API_URL = "http://127.0.0.1:9500/api/notifications";

// Create an axios instance with default config for notifications
const notificationClient = axios.create({
  baseURL: NOTIFICATION_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include auth token in all requests
notificationClient.interceptors.request.use(
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

export const notificationService = {
  // Create/send a notification
  sendNotification: async ({
    user_id,
    user_role,
    title = "",
    message,
    notification_type,
    related_object_id = null,
    extra_data = {},
    is_read = false,
  }) => {
    try {
      const payload = {
        user_id,
        user_role,
        title,
        message,
        notification_type,
        related_object_id,
        extra_data,
        is_read,
      };
      const response = await notificationClient.post("/create/", payload);
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  // Get notifications for a user (with optional is_read param)
  getNotifications: async ({
    user_id,
    user_role,
    is_read = undefined,
    page = 1,
    limit = 20,
  }) => {
    try {
      const params = { user_id, user_role, page, limit };
      if (typeof is_read === "boolean") params.is_read = is_read;
      const response = await notificationClient.get("/", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Mark a single notification as read
  markAsRead: async (notificationId) => {
    try {
      const response = await notificationClient.patch(
        `/${notificationId}/read/`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error marking notification ${notificationId} as read:`,
        error
      );
      throw error;
    }
  },

  // Mark all notifications as read for a user
  markAllAsRead: async ({ user_id, user_role }) => {
    try {
      const response = await notificationClient.patch(`/mark-read-bulk/`, {
        user_id,
        user_role,
      });
      return response.data;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      throw error;
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await notificationClient.delete(`/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting notification ${notificationId}:`, error);
      throw error;
    }
  },

  // Helper: Notify providers about a new service request
  notifyServiceRequest: async (
    providerUserId,
    providerUserRole,
    requestData
  ) => {
    const title = "New Service Request";
    const message = "New service request";
    return notificationService.sendNotification({
      user_id: providerUserId,
      user_role: providerUserRole,
      title,
      message,
      notification_type: "request_created",
      related_object_id: requestData.id,
      extra_data: {},
      is_read: false,
    });
  },

  // Helper: Notify home owner about a new offer
  notifyNewOffer: async (homeOwnerId, homeOwnerRole, offerData) => {
    const title = "New Offer Received";
    const message = `New offer received for your ${offerData.serviceType} request`;
    return notificationService.sendNotification({
      user_id: homeOwnerId,
      user_role: homeOwnerRole,
      title,
      message,
      notification_type: "offer_submitted",
      related_object_id: offerData.requestId,
      extra_data: {},
      is_read: false,
    });
  },

  // Helper: Notify provider about offer acceptance
  notifyOfferAccepted: async (providerId, providerRole, offerData) => {
    const title = "Offer Accepted";
    const message = `Your offer for ${offerData.serviceType} has been accepted!`;
    return notificationService.sendNotification({
      user_id: providerId,
      user_role: providerRole,
      title,
      message,
      notification_type: "offer_accepted",
      related_object_id: offerData.id,
      extra_data: {},
      is_read: false,
    });
  },
};

export default notificationService;
