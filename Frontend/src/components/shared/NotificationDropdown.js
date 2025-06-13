import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { notificationService } from "../../services/notificationService";
import "../../styles/components/NotificationDropdown.css";
import { FaBell, FaCheck, FaEnvelope, FaTools, FaHandshake } from "react-icons/fa";

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch notifications on component mount and when user changes
  useEffect(() => {
    if (user) {
      fetchNotifications();
      
      // Set up polling for new notifications every 30 seconds
      const intervalId = setInterval(fetchNotifications, 30000);
      
      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await notificationService.getMyNotifications();
      if (response && response.data) {
        setNotifications(response.data);
        // Count unread notifications
        const unread = response.data.filter(note => !note.is_read).length;
        setUnreadCount(unread);
      }
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
      await notificationService.updateNotificationState(notificationId, true);
      // Update local state
      setNotifications(notifications.map(note => 
        note.id === notificationId ? { ...note, is_read: true } : note
      ));
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    
    // Navigate based on notification type
    switch (notification.type) {
      case "service_request":
        navigate(`/provider/request/${notification.entity_id}`);
        break;
      case "new_offer":
        navigate(`/requests/${notification.entity_id}`);
        break;
      case "offer_accepted":
        navigate(`/provider/offers`);
        break;
      default:
        // Default action for other notification types
        break;
    }
    
    // Close dropdown after clicking
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "service_request":
        return <FaTools className="notification-icon request" />;
      case "new_offer":
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
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
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
            {loading && <div className="loading-message">Loading notifications...</div>}
            
            {error && <div className="error-message">{error}</div>}
            
            {!loading && !error && notifications.length === 0 && (
              <div className="empty-message">No notifications</div>
            )}
            
            {!loading && !error && notifications.length > 0 && (
              <ul className="notifications-list">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`notification-item ${!notification.is_read ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="notification-content">
                      {getNotificationIcon(notification.type)}
                      <div className="notification-text">
                        <p>{notification.message}</p>
                        <span className="notification-time">
                          {formatTimeAgo(notification.created_at)}
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
              onClick={async () => {
                // Mark all as read
                const unreadNotifications = notifications.filter(note => !note.is_read);
                for (const note of unreadNotifications) {
                  await markAsRead(note.id);
                }
              }}
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