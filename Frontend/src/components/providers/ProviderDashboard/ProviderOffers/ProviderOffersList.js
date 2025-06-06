import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../../contexts/AuthContext";
import providerService from "../../../../services/providerService";
import "./ProviderOffersList.css";

const ProviderOffersList = () => {
  const { user } = useAuth();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, accepted, rejected

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await providerService.getOffers();
        console.log("Fetched offers:", response);
        setOffers(response.data.offers || []);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError("Failed to load your offers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    if (filter === "all") return true;
    return offer.status === filter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "status-badge pending";
      case "accepted":
        return "status-badge accepted";
      case "rejected":
        return "status-badge rejected";
      default:
        return "status-badge";
    }
  };

  if (loading) {
    return (
      <div className="provider-offers-list loading">
        <div className="spinner">
          <i className="fas fa-spinner fa-spin"></i>
          Loading your offers...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="provider-offers-list error">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          {error}
        </div>
        <button
          className="btn btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="provider-offers-list">
      <div className="offers-header">
        <h2>My Offers</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`filter-btn ${filter === "pending" ? "active" : ""}`}
            onClick={() => setFilter("pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "accepted" ? "active" : ""}`}
            onClick={() => setFilter("accepted")}
          >
            Accepted
          </button>
          <button
            className={`filter-btn ${filter === "rejected" ? "active" : ""}`}
            onClick={() => setFilter("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {filteredOffers.length === 0 ? (
        <div className="no-offers">
          <i className="fas fa-file-alt"></i>
          <p>No offers found.</p>
          {filter !== "all" && (
            <p>Try changing the filter to see more offers.</p>
          )}
        </div>
      ) : (
        <div className="offers-grid">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <div className="offer-header">
                <span className={getStatusBadgeClass(offer.status)}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
                <span className="service-type">{offer.serviceType}</span>
              </div>

              <div className="offer-details">
                <div className="detail-row">
                  <span className="label">Price:</span>
                  <span className="value">${offer.price}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Duration:</span>
                  <span className="value">{offer.estimatedDuration} hours</span>
                </div>
                <div className="detail-row">
                  <span className="label">Available:</span>
                  <span className="value">
                    {formatDate(offer.availableDate)} at{" "}
                    {formatTime(offer.availableTime)}
                  </span>
                </div>
              </div>

              <div className="offer-description">
                <p>
                  {offer.description.length > 100
                    ? `${offer.description.substring(0, 100)}...`
                    : offer.description}
                </p>
              </div>

              {offer.materials && (
                <div className="offer-materials">
                  <strong>Materials:</strong>
                  <p>{offer.materials}</p>
                </div>
              )}

              <div className="offer-footer">
                <Link
                  to={`/provider/requests/${offer.requestId}`}
                  className="btn btn-outlined"
                >
                  View Request
                </Link>
                {offer.status === "pending" && (
                  <button className="btn btn-secondary" disabled>
                    Awaiting Response
                  </button>
                )}
              </div>

              {offer.auto_expire_at && (
                <div className="offer-expiry">
                  Expires: {formatDate(offer.auto_expire_at)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderOffersList;
