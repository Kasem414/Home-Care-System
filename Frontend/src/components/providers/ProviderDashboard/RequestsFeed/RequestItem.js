import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const RequestItem = ({ request, onCreateOffer }) => {
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate time difference to show recency
  const getTimeAgo = (dateString) => {
    const requestDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - requestDate;
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
    }
  };

  // Determine if request is new (less than 24 hours old)
  const isNew = () => {
    const requestDate = new Date(request.createdAt);
    const now = new Date();
    return now - requestDate < 24 * 60 * 60 * 1000;
  };

  return (
    <div className="request-item">
      <div className="request-header">
        <div className="request-type">
          <h3>{request.serviceType}</h3>
          {isNew() && <span className="new-badge">New</span>}
        </div>
        <span className="request-time">{getTimeAgo(request.createdAt)}</span>
      </div>

      <div className="request-details">
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{request.address}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Date:</span>
          <span className="detail-value">
            {formatDate(request.scheduledDate)} at {request.scheduledTime}
          </span>
        </div>
        {request.budget && (
          <div className="detail-row">
            <span className="detail-label">Budget:</span>
            <span className="detail-value budget">
              ${request.budget.min} - ${request.budget.max}
            </span>
          </div>
        )}
      </div>

      {request.description && (
        <div className="request-description">
          <p>
            {request.description.length > 150
              ? `${request.description.substring(0, 150)}...`
              : request.description}
          </p>
        </div>
      )}

      <div className="request-actions">
        <Link
          to={`/provider/request/${request.id}`}
          className="btn btn-outlined btn-sm"
        >
          View Details
        </Link>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => onCreateOffer(request.id)}
        >
          Create Offer
        </button>
      </div>
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    scheduledDate: PropTypes.string.isRequired,
    scheduledTime: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string,
    budget: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
      type: PropTypes.string,
    }),
  }).isRequired,
  onCreateOffer: PropTypes.func.isRequired,
};

export default RequestItem;
