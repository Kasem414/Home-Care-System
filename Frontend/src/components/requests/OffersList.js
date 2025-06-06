import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaStar,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";

// API endpoints
const API_BASE_URL = "http://127.0.0.1:9000/api";
const OFFERS_ENDPOINT = `${API_BASE_URL}/offers`;

const OffersList = ({
  requestId,
  offers: initialOffers,
  onAcceptOffer,
  onRejectOffer,
}) => {
  const [offers, setOffers] = useState(initialOffers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (!initialOffers) {
      fetchOffers();
    }
  }, [pagination.page, requestId, initialOffers]);

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = requestId
        ? `http://127.0.0.1:9000/api/offers/?requestId=${requestId}&page=${pagination.page}&limit=${pagination.limit}`
        : `http://127.0.0.1:9000/api/offers/?page=${pagination.page}&limit=${pagination.limit}`;

      const response = await axios.get(url);

      if (response.data && response.data.data && response.data.data.offers) {
        setOffers(response.data.data.offers);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error("Error fetching offers:", err);
      setError("Failed to load offers. Please try again later.");
      // // Fallback to sample data in development
      // if (process.env.NODE_ENV === "development") {
      //   setOffers(sampleOffers);
      // }
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      // Call the API to accept the offer
      await axios.put(`http://127.0.0.1:9000/api/offers/${offerId}/accept`);

      // Update the local state
      setOffers(
        offers.map((offer) =>
          offer.id === offerId ? { ...offer, status: "accepted" } : offer
        )
      );

      // Call the parent component callback if provided
      if (onAcceptOffer) {
        onAcceptOffer(offerId);
      }
    } catch (err) {
      console.error("Error accepting offer:", err);
      setError("Failed to accept offer. Please try again.");
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      // Call the API to reject the offer
      await axios.put(`http://127.0.0.1:9000/api/offers/${offerId}/reject`);

      // Update the local state
      setOffers(
        offers.map((offer) =>
          offer.id === offerId ? { ...offer, status: "rejected" } : offer
        )
      );

      // Call the parent component callback if provided
      if (onRejectOffer) {
        onRejectOffer(offerId);
      }
    } catch (err) {
      console.error("Error rejecting offer:", err);
      setError("Failed to reject offer. Please try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return <div className="offers-loading">Loading offers...</div>;
  }

  if (error) {
    return <div className="offers-error">{error}</div>;
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="offers-empty">
        <p>No offers have been received yet.</p>
      </div>
    );
  }

  // Format date and time for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
  };

  return (
    <motion.div
      className="offers-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {offers.map((offer) => (
        <motion.div
          key={offer.id}
          className="offer-card"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="offer-header">
            <div className="provider-info">
              <div className="provider-details">
                <h3 className="provider-name">
                  Provider ID: {offer.providerId}
                </h3>
                <div className="service-type">
                  <span>Service: {offer.serviceType}</span>
                </div>
              </div>
            </div>
            <div className="offer-status">
              {offer.status === "pending" && (
                <span className="status-badge pending">Pending</span>
              )}
              {offer.status === "accepted" && (
                <span className="status-badge accepted">Accepted</span>
              )}
              {offer.status === "rejected" && (
                <span className="status-badge rejected">Rejected</span>
              )}
            </div>
          </div>

          <div className="offer-details">
            <div className="offer-price">
              <FaDollarSign />
              <span className="price">{offer.price}</span>
              <span className="price-type">/hour</span>
            </div>

            <div className="offer-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Available Date: {formatDate(offer.availableDate)}</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>Available Time: {formatTime(offer.availableTime)}</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>Estimated Duration: {offer.estimatedDuration} hours</span>
              </div>
            </div>

            <div className="offer-description">
              <p>{offer.description}</p>
            </div>

            {offer.materials && (
              <div className="offer-materials">
                <h4>Materials:</h4>
                <p>{offer.materials}</p>
              </div>
            )}
          </div>

          {offer.status === "pending" && (
            <div className="offer-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleAcceptOffer(offer.id)}
              >
                Accept Offer
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleRejectOffer(offer.id)}
              >
                Reject
              </button>
            </div>
          )}
        </motion.div>
      ))}

      {pagination.total > pagination.limit && (
        <div className="pagination-controls">
          <button
            disabled={pagination.page === 1}
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            className="btn btn-secondary"
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of{" "}
            {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            disabled={
              pagination.page >= Math.ceil(pagination.total / pagination.limit)
            }
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default OffersList;
