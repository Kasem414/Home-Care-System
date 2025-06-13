import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { notificationService } from "../../services/notificationService";
import { getUserIdFromToken, getUserRoleFromToken } from "../../services/api";
import "../../styles/components/NotificationDropdown.css";
import {
  FaBell,
  FaCheck,
  FaEnvelope,
  FaTools,
  FaHandshake,
} from "react-icons/fa";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const userId = getUserIdFromToken();
  const userRole = getUserRoleFromToken();

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const intervalId = setInterval(fetchNotifications, 30000);
      return () => clearInterval(intervalId);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications({
        user_id: userId,
        user_role: userRole,
      });
      const data = response && response.data ? response.data : [];
      setNotifications(data);
      const unread = data.filter((note) => !note.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(
        notifications.map((note) =>
          note.id === notificationId ? { ...note, is_read: true } : note
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead({
        user_id: userId,
        user_role: userRole,
      });
      setNotifications(
        notifications.map((note) => ({ ...note, is_read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    switch (notification.notification_type) {
      case "request_created":
        navigate(`/provider/request/${notification.related_object_id}`);
        break;
      case "offer_created":
        navigate(`/requests/${notification.related_object_id}`);
        break;
      case "offer_accepted":
        navigate(`/provider/offers`);
        break;
      default:
        break;
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "request_created":
        return <FaTools className="notification-icon request" />;
      case "offer_created":
        return <FaEnvelope className="notification-icon offer" />;
      case "offer_accepted":
        return <FaHandshake className="notification-icon accepted" />;
      default:
        return <FaBell className="notification-icon" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div className="notification-dropdown" ref={dropdownRef}>
      <button
        className="notification-button"
        onClick={toggleDropdown}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} unread</span>
            )}
          </div>
          <div className="dropdown-content">
            {loading && (
              <div className="loading-message">Loading notifications...</div>
            )}
            {error && <div className="error-message">{error}</div>}
            {!loading && !error && notifications.length === 0 && (
              <div className="empty-message">No notifications</div>
            )}
            {!loading && !error && notifications.length > 0 && (
              <ul className="notifications-list">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`notification-item ${
                      !notification.is_read ? "unread" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-content">
                      {getNotificationIcon(notification.notification_type)}
                      <div className="notification-text">
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      {!notification.is_read && (
                        <span className="unread-indicator"></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="dropdown-footer">
            <button
              className="mark-all-read"
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <FaCheck /> Mark all as read
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
