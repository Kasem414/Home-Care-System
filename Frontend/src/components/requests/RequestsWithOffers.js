import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import OffersList from "./OffersList";

// API endpoints
const API_BASE_URL = "http://127.0.0.1:9000/api";
const REQUESTS_ENDPOINT = `${API_BASE_URL}/service-requests`;
const OFFERS_ENDPOINT = `${API_BASE_URL}/offers`;

const RequestsWithOffers = () => {
  const [requests, setRequests] = useState([]);
  const [expandedRequests, setExpandedRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    fetchRequests();
  }, [pagination.page, pagination.limit]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch service requests from the API
      const requestsResponse = await axios.get(
        `${REQUESTS_ENDPOINT}/?page=${pagination.page}&limit=${pagination.limit}`
      );

      if (requestsResponse.data && requestsResponse.data.data) {
        const requestsData = requestsResponse.data.data;
        setPagination(requestsResponse.data.pagination);
        
        // Fetch all offers at once since the API doesn't support filtering by requestId
        let allOffers = [];
        try {
          const offersResponse = await axios.get(
            `${OFFERS_ENDPOINT}/?page=1&limit=100`
          );
          allOffers = offersResponse.data?.data?.offers || [];
        } catch (error) {
          console.error("Error fetching offers:", error);
        }
        
        // Map offers to their respective requests
        const requestsWithOffers = requestsData.map(request => {
          // Filter offers that belong to this request
          const requestOffers = allOffers.filter(offer => offer.requestId === request.id);
          
          return {
            ...request,
            offers: requestOffers || [],
          };
        });
        
        setRequests(requestsWithOffers);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      setError("Failed to load requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const toggleRequestExpansion = (requestId) => {
    setExpandedRequests((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const handleAcceptOffer = async (requestId, offerId) => {
    try {
      // Call the API to accept the offer
      await axios.put(`${OFFERS_ENDPOINT}/${offerId}/accept`);

      // Update the local state
      setRequests(
        requests.map((request) => {
          if (request.id === requestId) {
            return {
              ...request,
              offers: request.offers.map((offer) =>
                offer.id === offerId ? { ...offer, status: "accepted" } : offer
              ),
              status: "in_progress", // Update request status as well
            };
          }
          return request;
        })
      );
    } catch (err) {
      console.error("Error accepting offer:", err);
      alert("Failed to accept offer. Please try again.");
    }
  };

  const handleRejectOffer = async (requestId, offerId) => {
    try {
      // Call the API to reject the offer
      await axios.put(`${OFFERS_ENDPOINT}/${offerId}/reject`);

      // Update the local state
      setRequests(
        requests.map((request) => {
          if (request.id === requestId) {
            return {
              ...request,
              offers: request.offers.map((offer) =>
                offer.id === offerId ? { ...offer, status: "rejected" } : offer
              ),
            };
          }
          return request;
        })
      );
    } catch (err) {
      console.error("Error rejecting offer:", err);
      alert("Failed to reject offer. Please try again.");
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge details
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "submitted":
      case "pending":
        return {
          className: "status-pending",
          label: "Pending",
        };
      case "in_progress":
      case "approved":
      case "accepted":
        return {
          className: "status-approved",
          label: "In Progress",
        };
      case "completed":
        return {
          className: "status-completed",
          label: "Completed",
        };
      case "cancelled":
        return {
          className: "status-cancelled",
          label: "Cancelled",
        };
      default:
        return {
          className: "",
          label: status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
        };
    }
  };

  if (loading && requests.length === 0) {
    return <div className="requests-loading">Loading requests...</div>;
  }

  if (error && requests.length === 0) {
    return <div className="requests-error">{error}</div>;
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="requests-empty">
        <p>You haven't made any service requests yet.</p>
      </div>
    );
  }

  return (
    <div className="requests-with-offers-container">
      <h1>Your Service Requests</h1>

      <div className="requests-list">
        {requests.map((request) => {
          const statusDetails = getStatusDetails(request.status);
          const isExpanded = expandedRequests[request.id] || false;
          const hasOffers = request.offers && request.offers.length > 0;

          return (
            <motion.div
              key={request.id}
              className="request-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="request-header"
                onClick={() => toggleRequestExpansion(request.id)}
              >
                <div className="request-info">
                  <h3>{request.service_type}</h3>
                  <p className="request-date">
                    {request.schedule_type === "specific" ? (
                      <>Scheduled: {formatDate(request.preferred_date)} at {request.preferred_time && request.preferred_time.substring(0, 5)}</>
                    ) : (
                      <>Flexible Schedule: {request.flexible_schedule_days?.join(", ")}</>
                    )}
                  </p>
                  <p className="request-address">{request.city}, {request.region}</p>
                </div>

                <div className="request-meta">
                  <span className={`status-badge ${statusDetails.className}`}>
                    {statusDetails.label}
                  </span>

                  <div className="offers-count">
                    {hasOffers ? (
                      <span>
                        {request.offers.length} offer
                        {request.offers.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span>No offers yet</span>
                    )}
                  </div>

                  <button className="expand-button">
                    {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="request-offers"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4>Offers for this Request</h4>
                    {hasOffers ? (
                      <OffersList
                        requestId={request.id}
                        offers={request.offers}
                        onAcceptOffer={(offerId) =>
                          handleAcceptOffer(request.id, offerId)
                        }
                        onRejectOffer={(offerId) =>
                          handleRejectOffer(request.id, offerId)
                        }
                      />
                    ) : (
                      <div className="no-offers-message">
                        <p>
                          No offers have been received for this request yet.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

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
    </div>
  );
};

export default RequestsWithOffers;