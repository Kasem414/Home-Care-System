import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import requestService from "../../services/requestService";
import { userProfileService } from "../../services/api";
import "../../styles/components/providers/RequestDetail.css";

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

const RequestDetailPage = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequestDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await requestService.getRequestById(requestId);
      setRequest(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load request details.");
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  // Fetch client info after request is loaded
  useEffect(() => {
    if (request && request.customer_id) {
      const fetchClient = async () => {
        try {
          const data = await userProfileService.getProfile(request.customer_id);
          setClient(data);
        } catch (err) {
          setClient(null);
        }
      };
      fetchClient();
    }
  }, [request]);

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
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading request details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-detail-page">
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!request) return null;

  // Status badge class
  const statusClass = `status-badge ${request.status}`;

  return (
    <div className="request-detail-page">
      <div className="container">
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/provider/dashboard">Dashboard</Link> /{" "}
            <span>Request #{request.id}</span>
          </div>
          <div className="header-actions">
            <Link
              to={`/provider/request/${requestId}/create-offer`}
              className="btn btn-primary"
            >
              Make an Offer <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
        <div className="request-detail-container">
          {/* Main Details Card */}
          <div className="request-detail-card">
            <div className="request-header">
              <div className="service-type">
                <h1>{request.service_name || "Service"}</h1>
                <span className={statusClass}>{request.status}</span>
              </div>
              <div className="request-meta">
                <span className="badge new-badge">ID: {request.id}</span>
                {request.urgent && (
                  <span className="badge urgent-badge">Urgent</span>
                )}
              </div>
            </div>
            {/* Client Info */}
            {client && (
              <div className="request-info-section client-info">
                <div className="section-title">Client Information</div>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="info-label">Name</span>
                    <span className="info-value client-name">
                      {client.firstName} {client.lastName}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Email</span>
                    <span className="info-value">{client.email}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Phone</span>
                    <span className="info-value">{client.phone}</span>
                  </div>
                </div>
              </div>
            )}
            {/* Request Details */}
            <div className="request-info-section">
              <div className="section-title">Request Details</div>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Service</span>
                  <span className="info-value">{request.service_type}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Location</span>
                  <span className="info-value">
                    {request.city}, {request.region}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Created</span>
                  <span className="info-value">
                    {new Date(request.created_at).toLocaleString()}
                  </span>
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
            {/* Budget Section */}
            <div className="request-info-section">
              <div className="section-title">Budget</div>
              <div className="info-grid">
                {request.budget_type === "hourly" ? (
                  <>
                    <div className="info-item">
                      <span className="info-label">Min Hourly Rate</span>
                      <span className="info-value budget">
                        ${request.budget_min_hourly}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Max Hourly Rate</span>
                      <span className="info-value budget">
                        ${request.budget_max_hourly}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="info-item">
                    <span className="info-label">Fixed Price</span>
                    <span className="info-value budget">
                      ${request.fixed_price_offer}
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* Schedule Section */}
            <div className="request-info-section">
              <div className="section-title">Schedule</div>
              <div className="info-grid">
                {request.schedule_type === "specific" ? (
                  <>
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">
                        {request.preferred_date}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Time</span>
                      <span className="info-value">
                        {request.preferred_time}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="info-item">
                      <span className="info-label">Available Days</span>
                      <span className="info-value">
                        {(request.flexible_schedule_days || []).join(", ")}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Preferred Time Slots</span>
                      <span className="info-value">
                        {(request.flexible_time_slots || []).join(", ")}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Actions Card */}
          <div className="request-action-card">
            <div className="section-title">Actions</div>
            <p>Take action on this request using the buttons below.</p>
            <Link
              to="/provider/dashboard"
              className="btn btn-primary btn-block"
            >
              <i className="fas fa-arrow-left"></i> Back to Requests
            </Link>
            {/* Add more action buttons as needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailPage;
