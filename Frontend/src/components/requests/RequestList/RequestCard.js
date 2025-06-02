import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const RequestCard = ({ request, onCancel }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "Flexible";
    return timeString;
  };

  // Status badge color classes and icons
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          className: "status-pending",
          icon: "fa-clock",
          label: "Pending",
        };
      case "matched":
        return {
          className: "status-matched",
          icon: "fa-handshake",
          label: "Matched",
        };
      case "in_progress":
        return {
          className: "status-in-progress",
          icon: "fa-spinner",
          label: "In Progress",
        };
      case "completed":
        return {
          className: "status-completed",
          icon: "fa-check-double",
          label: "Completed",
        };
      case "cancelled":
        return {
          className: "status-cancelled",
          icon: "fa-times-circle",
          label: "Cancelled",
        };
      case "expired":
        return {
          className: "status-expired",
          icon: "fa-calendar-times",
          label: "Expired",
        };
      default:
        return {
          className: "",
          icon: "fa-question-circle",
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const statusDetails = getStatusDetails(request.status);
  const address = `${request.street_address}, ${request.city}, ${request.region}`;

  return (
    <motion.div
      className="request-card card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="request-info">
        <h3>{request.service_type}</h3>
        <p className="request-address">
          <i className="fas fa-map-marker-alt"></i> {address}
        </p>
        {request.is_urgent && (
          <span className="urgent-badge">
            <i className="fas fa-exclamation-circle"></i> Urgent
          </span>
        )}
      </div>
      <div className="request-schedule">
        {request.schedule_type === "specific" ? (
          <>
            <p className="scheduled-date">
              <i className="fas fa-calendar-alt"></i>{" "}
              {formatDate(request.preferred_date)}
            </p>
            <p className="scheduled-time">
              <i className="fas fa-clock"></i>{" "}
              {formatTime(request.preferred_time)}
            </p>
          </>
        ) : (
          <div className="flexible-schedule">
            <p>
              <i className="fas fa-calendar-week"></i> Flexible Schedule
            </p>
            <small>{request.flexible_schedule_days.join(", ")}</small>
          </div>
        )}
      </div>
      <div className="request-status">
        <span className={`status-badge ${statusDetails.className}`}>
          <i className={`fas ${statusDetails.icon}`}></i> {statusDetails.label}
        </span>
        <p className="request-id">ID: {request.id}</p>
      </div>
      <div className="request-actions">
        <Link
          to={`/requests/${request.id}`}
          className="btn btn-outlined btn-sm"
        >
          <i className="fas fa-eye"></i> View Details
        </Link>
        {request.status.toLowerCase() === "pending" && (
          <motion.button
            className="btn btn-danger btn-sm"
            onClick={() => onCancel(request.id)}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-ban"></i> Cancel
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    service_type: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    is_urgent: PropTypes.bool,
    street_address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    schedule_type: PropTypes.oneOf(["specific", "flexible"]).isRequired,
    preferred_date: PropTypes.string,
    preferred_time: PropTypes.string,
    flexible_schedule_days: PropTypes.arrayOf(PropTypes.string),
    flexible_time_slots: PropTypes.arrayOf(PropTypes.string),
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default RequestCard;
