import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Utility functions
const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

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

// Mock data - In a real app, this would come from an API
const mockRequestData = {
  id: "REQ123",
  serviceType: "Home Cleaning",
  status: "open",
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  scheduledDate: "2023-12-15",
  scheduledTime: "14:00",
  address: "123 Main St, Boston, MA 02108",
  description:
    "Need help with deep cleaning of a 2-bedroom apartment, including kitchen and bathrooms. Looking for someone experienced with eco-friendly cleaning products. We have a cat, so the cleaner should be comfortable with pets.",
  budget: { min: 80, max: 120, type: "fixed" },
  isUrgent: false,
  client: {
    id: "client123",
    name: "John Doe",
    rating: 4.7,
    reviewCount: 12,
  },
  requirements: [
    "Eco-friendly cleaning products",
    "Experience with pet households",
    "Deep cleaning experience",
  ],
  requestedTasks: [
    "Kitchen deep cleaning",
    "Bathroom deep cleaning",
    "Dusting and vacuuming",
    "Mopping all floors",
    "Window cleaning",
  ],
};

const RequestDetailPage = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequestDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRequest(mockRequestData);
    } catch (err) {
      console.error("Error fetching request details:", err);
      setError("Failed to load request details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const handleCreateOffer = useCallback(() => {
    navigate(`/provider/create-offer/${requestId}`, {
      state: { from: "requestDetails" },
    });
  }, [navigate, requestId]);

  const handleRetry = useCallback(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  if (loading) {
    return (
      <div className="request-detail-page">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner"></i>
            <span>Loading request details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-detail-page">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="request-detail-page">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>Request not found.</p>
            <Link to="/provider/dashboard" className="btn btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-detail-page">
      <div className="container">
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/provider/dashboard">Dashboard</Link> {" > "}
            <span>Request Details</span>
          </div>

          <div className="header-actions">
            <button className="btn btn-primary" onClick={handleCreateOffer}>
              <i className="fas fa-paper-plane"></i>
              Create Offer
            </button>
          </div>
        </div>

        <div className="request-detail-container">
          <div className="request-detail-card">
            <div className="request-header">
              <div className="service-type">
                <h1>{request.serviceType}</h1>
                {new Date(request.createdAt) >
                  new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                  <span className="new-badge">New</span>
                )}
                {request.isUrgent && (
                  <span className="urgent-badge">Urgent</span>
                )}
              </div>
              <div className="request-meta">
                <div className="request-id">ID: {request.id}</div>
                <div className="request-time">
                  {getTimeAgo(request.createdAt)}
                </div>
              </div>
            </div>

            <div className="request-info-section">
              <div className="section-title">Request Details</div>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Service Date</div>
                  <div className="info-value">
                    {formatDate(request.scheduledDate)}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Service Time</div>
                  <div className="info-value">{request.scheduledTime}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Location</div>
                  <div className="info-value">{request.address}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">Budget</div>
                  <div className="info-value budget">
                    ${request.budget.min} - ${request.budget.max} (
                    {request.budget.type})
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">Status</div>
                  <div className="info-value">
                    <span className={`status-badge ${request.status}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="request-info-section">
              <div className="section-title">Description</div>
              <div className="description-text">{request.description}</div>
            </div>

            <div className="request-info-section">
              <div className="section-title">Tasks Requested</div>
              <ul className="tasks-list">
                {request.requestedTasks.map((task, index) => (
                  <li key={index} className="task-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="request-info-section">
              <div className="section-title">Requirements</div>
              <ul className="requirements-list">
                {request.requirements.map((requirement, index) => (
                  <li key={index} className="requirement-item">
                    <i className="fas fa-star"></i>
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="request-info-section">
              <div className="section-title">Client Information</div>
              <div className="client-info">
                <div className="client-name">{request.client.name}</div>
                <div className="client-rating">
                  <span className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`fas fa-star ${
                          star <= Math.round(request.client.rating)
                            ? "filled"
                            : ""
                        }`}
                      ></i>
                    ))}
                  </span>
                  <span className="rating-value">{request.client.rating}</span>
                  <span className="rating-count">
                    ({request.client.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="request-action-card">
            <div className="section-title">Create an Offer</div>
            <p>
              Ready to help with this request? Create an offer and provide your
              pricing and details.
            </p>
            <button
              className="btn btn-primary btn-block"
              onClick={handleCreateOffer}
            >
              Create Offer
            </button>
            <div className="action-tips">
              <div className="tip-item">
                <i className="fas fa-lightbulb"></i>
                <span>
                  Being prompt with your offer increases your chances of being
                  selected.
                </span>
              </div>
              <div className="tip-item">
                <i className="fas fa-comment-dollar"></i>
                <span>
                  Provide a clear breakdown of your pricing to stand out.
                </span>
              </div>
              <div className="tip-item">
                <i className="fas fa-calendar-check"></i>
                <span>Confirm your availability before making an offer.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
