import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const RequestStatusTimeline = ({ statusHistory }) => {
  // Format datetime for display
  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateTimeString).toLocaleString(undefined, options);
  };

  // Get status details for styling
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

  // Sort status history by date
  const sortedHistory = [...statusHistory].sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  return (
    <div className="status-timeline">
      {sortedHistory.map((item, index) => {
        const statusDetails = getStatusDetails(item.status);

        return (
          <motion.div
            key={`${item.status}-${item.date}`}
            className="timeline-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="timeline-icon">
              <i className={`fas ${statusDetails.icon}`}></i>
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <span className={`timeline-badge ${statusDetails.className}`}>
                  {statusDetails.label}
                </span>
                <span className="timeline-date">
                  {formatDateTime(item.date)}
                </span>
              </div>
              {item.note && <p className="timeline-note">{item.note}</p>}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

RequestStatusTimeline.propTypes = {
  statusHistory: PropTypes.arrayOf(
    PropTypes.shape({
      status: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      note: PropTypes.string,
    })
  ).isRequired,
};

export default RequestStatusTimeline;
