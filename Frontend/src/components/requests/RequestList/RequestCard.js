import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const RequestCard = ({ request, onCancelRequest, onLeaveReview }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Status badge color classes and icons
  const getStatusDetails = (status) => {
    switch (status) {
      case "pending":
        return {
          className: "status-pending",
          icon: "fa-clock",
          label: "Pending",
        };
      case "approved":
        return {
          className: "status-approved",
          icon: "fa-check-circle",
          label: "Approved",
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
      default:
        return {
          className: "",
          icon: "fa-question-circle",
          label: status.charAt(0).toUpperCase() + status.slice(1),
        };
    }
  };

  const statusDetails = getStatusDetails(request.status);

  return (
    <motion.div
      className="request-card card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <div className="request-info">
        <h3>{request.serviceType}</h3>
        <p className="request-address">
          <i className="fas fa-map-marker-alt"></i> {request.address}
        </p>
      </div>
      <div className="request-date">
        <p className="scheduled-date">
          <i className="fas fa-calendar-alt"></i>{" "}
          {formatDate(request.scheduledDate)}
        </p>
        <p className="scheduled-time">
          <i className="fas fa-clock"></i> {request.scheduledTime}
        </p>
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
        {request.status === "pending" && (
          <motion.button
            className="btn btn-danger btn-sm"
            onClick={() => onCancelRequest(request.id)}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-ban"></i> Cancel
          </motion.button>
        )}
        {request.status === "completed" && (
          <motion.button
            className="btn btn-secondary btn-sm"
            onClick={() => onLeaveReview(request.id)}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-star"></i> Leave Review
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

RequestCard.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
    scheduledTime: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
  }).isRequired,
  onCancelRequest: PropTypes.func.isRequired,
  onLeaveReview: PropTypes.func.isRequired,
};

export default RequestCard;
