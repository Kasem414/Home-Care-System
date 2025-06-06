import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import "./RequestItem.css";

const RequestItem = ({ request }) => {
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
    const requestDate = new Date(request.created_at);
    const now = new Date();
    return now - requestDate < 24 * 60 * 60 * 1000;
  };

  // Format budget display
  const formatBudget = () => {
    if (request.budget_type === "fixed") {
      return `$${request.fixed_price_offer} (Fixed)`;
    } else {
      const min = request.budget_min_hourly || "Any";
      const max = request.budget_max_hourly || "Any";
      return `$${min} - $${max} /hr`;
    }
  };

  // Format schedule display
  const formatSchedule = () => {
    if (request.schedule_type === "specific") {
      return `${formatDate(request.preferred_date)} at ${
        request.preferred_time
      }`;
    } else {
      return (
        <>
          <div>Days: {request.flexible_schedule_days.join(", ")}</div>
          <div>Time: {request.flexible_time_slots.join(", ")}</div>
        </>
      );
    }
  };

  const handleCreateOffer = () => {
    navigate(`/provider/request/${request.id}/create-offer`);
  };

  return (
    <div className="request-item">
      <div className="request-header">
        <div className="request-type">
          <h3>{request.service_type}</h3>
          {isNew() && <span className="new-badge">New</span>}
          {request.status === "urgent" && (
            <span className="urgent-badge">Urgent</span>
          )}
        </div>
        <span className="request-time">{getTimeAgo(request.created_at)}</span>
      </div>

      <div className="request-details">
        <div className="detail-row">
          <span className="detail-label">Location:</span>
          <span className="detail-value">
            {request.city}, {request.region}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Schedule:</span>
          <span className="detail-value">{formatSchedule()}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Budget:</span>
          <span className="detail-value budget">{formatBudget()}</span>
        </div>
        {request.preferred_qualifications?.length > 0 && (
          <div className="detail-row">
            <span className="detail-label">Required:</span>
            <span className="detail-value qualifications">
              {request.preferred_qualifications.join(", ")}
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

      {request.attachments?.length > 0 && (
        <div className="request-attachments">
          <span className="attachment-label">Attachments:</span>
          <div className="attachment-thumbnails">
            {request.attachments.slice(0, 3).map((attachment) => (
              <img
                key={attachment.id}
                src={attachment.image}
                alt="Request attachment"
                className="attachment-thumbnail"
              />
            ))}
            {request.attachments.length > 3 && (
              <span className="more-attachments">
                +{request.attachments.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      <div className="request-actions">
        <Link
          to={`/provider/requests/${request.id}`}
          className="btn btn-outlined btn-sm"
        >
          View Details
        </Link>
        <button className="btn btn-primary" onClick={handleCreateOffer}>
          Create Offer
        </button>
      </div>
    </div>
  );
};

RequestItem.propTypes = {
  request: PropTypes.shape({
    id: PropTypes.number.isRequired,
    service_type: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    region: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    preferred_date: PropTypes.string,
    preferred_time: PropTypes.string,
    schedule_type: PropTypes.oneOf(["specific", "flexible"]).isRequired,
    flexible_schedule_days: PropTypes.arrayOf(PropTypes.string),
    flexible_time_slots: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    budget_type: PropTypes.oneOf(["fixed", "hourly"]).isRequired,
    budget_min_hourly: PropTypes.number,
    budget_max_hourly: PropTypes.number,
    fixed_price_offer: PropTypes.string,
    preferred_qualifications: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string.isRequired,
    attachments: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        image: PropTypes.string.isRequired,
        uploaded_at: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
};

export default RequestItem;
