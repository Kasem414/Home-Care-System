import axios from "axios";
import { getUserIdFromToken } from "./api";

// Notification API base URL
const NOTIFICATION_API_URL = "http://127.0.0.1:9500/notifications";

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
  // Get notifications for the current user
  getMyNotifications: async () => {
    try {
      const response = await notificationClient.get("/my/");
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Send a notification to a user
  sendNotification: async (
    recipientId,
    message,
    type = "general",
    entityId = null
  ) => {
    try {
      const payload = {
        recipient_id: recipientId,
        message,
        type,
        entity_id: entityId,
      };

      const response = await notificationClient.post("/send/", payload);
      return response.data;
    } catch (error) {
      console.error("Error sending notification:", error);
      throw error;
    }
  },

  // Get notifications for a specific user (admin function)
  getUserNotifications: async (userId) => {
    try {
      const response = await notificationClient.get(`/user/${userId}/`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching notifications for user ${userId}:`, error);
      throw error;
    }
  },

  // Mark a notification as read/unread
  updateNotificationState: async (notificationId, isRead = true) => {
    try {
      const response = await notificationClient.patch(
        `/${notificationId}/state/`,
        {
          state: isRead,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating notification ${notificationId} state:`,
        error
      );
      throw error;
    }
  },

  // Helper functions for specific notification events
  notifyServiceRequest: async (providerId, requestData) => {
    const message = `New service request: ${requestData.service_type} in ${requestData.city}`;
    return notificationService.sendNotification(
      providerId,
      message,
      "service_request",
      requestData.id
    );
  },

  notifyNewOffer: async (homeOwnerId, offerData) => {
    const message = `New offer received for your ${offerData.serviceType} request`;
    return notificationService.sendNotification(
      homeOwnerId,
      message,
      "new_offer",
      offerData.requestId
    );
  },

  notifyOfferAccepted: async (providerId, offerData) => {
    const message = `Your offer for ${offerData.serviceType} has been accepted!`;
    return notificationService.sendNotification(
      providerId,
      message,
      "offer_accepted",
      offerData.id
    );
  },
};

export default notificationService;
