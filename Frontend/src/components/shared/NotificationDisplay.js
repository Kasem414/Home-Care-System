import React, { useState, useEffect, useRef } from "react";
import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { notificationService } from "../../services/notificationService";
import { getUserIdFromToken, getUserRoleFromToken } from "../../services/api";
import "./NotificationDisplay.css";

const NotificationDisplay = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const userId = getUserIdFromToken();
  let userRole = getUserRoleFromToken();
  if (userRole === "service_provider") {
    userRole = "provider";
  }

  const panelRef = useRef(null);

  // Fetch notifications when component mounts
  useEffect(() => {
    fetchNotifications();

    // Set up polling to check for new notifications every minute
    const intervalId = setInterval(() => {
      fetchNotifications();
    }, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  // Fetch notifications from the API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications({
        user_id: userId,
        user_role: userRole,
      });
      const data = response && response.data ? response.data : [];
      setNotifications(data);
      // Count unread notifications
      const unread = data.filter(
        (notification) => !notification.is_read
      ).length;
      setUnreadCount(unread);
      setError(null);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Toggle notification panel
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);

    // If opening the panel, mark notifications as read
  //   if (!showNotifications && unreadCount > 0) {
  //     markAllAsRead();
  //   }
  };

  // // Mark all notifications as read
  // const markAllAsRead = async () => {
  //   try {
  //     await notificationService.markAllAsRead({
  //       user_id: userId,
  //       user_role: userRole,
  //     });
  //     setNotifications(
  //       notifications.map((notification) => ({
  //         ...notification,
  //         is_read: true,
  //       }))
  //     );
  //     setUnreadCount(0);
  //   } catch (err) {
  //     console.error("Error marking notifications as read:", err);
  //   }
  // };

  // Mark a single notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(
        `Error marking notification ${notificationId} as read:`,
        err
      );
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "request_created":
        return <FaExclamationCircle className="notification-icon request" />;
      case "offer_created":
        return <FaBell className="notification-icon offer" />;
      case "offer_accepted":
        return <FaCheckCircle className="notification-icon accepted" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="notification-container" ref={panelRef}>
      <div className="notification-bell" onClick={toggleNotifications}>
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {showNotifications && (
        <div className="notification-panel">
          <div className="notification-header">
            <h3>Notifications</h3>
            {/* {unreadCount > 0 && (
              <button className="mark-read-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )} */}
          </div>

          <div className="notification-list">
            {loading && <div className="notification-loading">Loading...</div>}

            {error && <div className="notification-error">{error}</div>}

            {!loading && !error && notifications.length === 0 && (
              <div className="notification-empty">No notifications</div>
            )}

            {!loading &&
              !error &&
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.is_read ? "unread" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  {getNotificationIcon(notification.notification_type)}
                  <div className="notification-content">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <span className="notification-time">
                      {formatDate(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDisplay;
