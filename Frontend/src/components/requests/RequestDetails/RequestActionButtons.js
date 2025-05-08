import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const RequestActionButtons = ({ request, onCancelRequest }) => {
  if (!request) return null;

  // Different buttons based on status
  const renderActionButtons = () => {
    switch (request.status) {
      case "pending":
        return (
          <>
            <motion.button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel this request?"
                  )
                ) {
                  onCancelRequest(request.id);
                }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-ban"></i> Cancel Request
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={() => {
                alert("This would reschedule the request in a real app");
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-calendar-alt"></i> Reschedule
            </motion.button>
          </>
        );

      case "approved":
        return (
          <>
            <motion.button
              className="btn btn-danger"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure you want to cancel this request?"
                  )
                ) {
                  onCancelRequest(request.id);
                }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-ban"></i> Cancel Request
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={() => {
                alert("This would reschedule the request in a real app");
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-calendar-alt"></i> Reschedule
            </motion.button>
          </>
        );

      case "completed":
        return (
          <>
            <motion.button
              className="btn btn-primary"
              onClick={() => {
                alert("This would open the review form in a real app");
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-star"></i> Leave a Review
            </motion.button>
            <motion.button
              className="btn btn-secondary"
              onClick={() => {
                alert("This would book a similar service in a real app");
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-redo"></i> Book Again
            </motion.button>
            <motion.a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                request.address
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outlined"
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-map-marked-alt"></i> View on Map
            </motion.a>
          </>
        );

      case "cancelled":
        return (
          <>
            <motion.button
              className="btn btn-primary"
              onClick={() => {
                alert("This would create a new similar request in a real app");
              }}
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-plus"></i> New Similar Request
            </motion.button>
            <Link to="/request" className="btn btn-secondary">
              <i className="fas fa-plus-circle"></i> Create New Request
            </Link>
          </>
        );

      default:
        return (
          <Link to="/requests" className="btn btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Requests
          </Link>
        );
    }
  };

  return (
    <div className="action-buttons">
      {renderActionButtons()}

      {/* Always show these buttons */}
      <Link to="/requests" className="btn btn-outlined">
        <i className="fas fa-list"></i> View All Requests
      </Link>

      {request.serviceProvider && request.status !== "cancelled" && (
        <motion.a
          href={`tel:${request.serviceProvider.phone}`}
          className="btn btn-outlined"
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-phone"></i> Call Service Provider
        </motion.a>
      )}
    </div>
  );
};

RequestActionButtons.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    serviceProvider: PropTypes.shape({
      phone: PropTypes.string,
    }),
  }).isRequired,
  onCancelRequest: PropTypes.func.isRequired,
};

export default RequestActionButtons;
