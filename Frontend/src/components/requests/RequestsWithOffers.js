import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";
import OffersList from "./OffersList";
import { notificationService } from "../../services/notificationService";
import "./ResponseDialog.css";

// API endpoints
const API_BASE_URL = "http://127.0.0.1:9000/api";
const REQUESTS_ENDPOINT = `${API_BASE_URL}/service-requests`;
const OFFERS_ENDPOINT = `${API_BASE_URL}/offers`;

// Response Dialog Component
const ResponseDialog = ({ isOpen, onClose, message, type }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="dialog-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className={`response-dialog ${type}`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dialog-header">
            {type === "success" ? (
              <FaCheckCircle className="dialog-icon success" />
            ) : (
              <FaTimesCircle className="dialog-icon error" />
            )}
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <div className="dialog-content">
            <p>{message}</p>
          </div>
          <div className="dialog-actions">
            <button className="btn btn-primary" onClick={onClose}>
              OK
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

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
  // Dialog state
  const [dialog, setDialog] = useState({
    isOpen: false,
    message: "",
    type: "success", // success or error
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
        const requestsWithOffers = requestsData.map((request) => {
          // Filter offers that belong to this request
          const requestOffers = allOffers.filter(
            (offer) => offer.requestId === request.id
          );

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
      // Call the API to accept the offer with the new endpoint format
      const response = await axios.put(
        `${API_BASE_URL}/requests/${requestId}/offers/${offerId}/accept/`
      );

      // Check if the response contains the expected data
      if (
        response.data &&
        response.data.message === "Offer accepted successfully."
      ) {
        // Find the accepted offer and request details for notification
        const currentRequest = requests.find((req) => req.id === requestId);
        const acceptedOffer = currentRequest?.offers.find(
          (offer) => offer.id === offerId
        );

        // Update the local state
        setRequests(
          requests.map((request) => {
            if (request.id === requestId) {
              return {
                ...request,
                offers: request.offers.map((offer) =>
                  offer.id === offerId
                    ? { ...offer, status: "accepted" }
                    : offer
                ),
                status: "in_progress", // Update request status as well
              };
            }
            return request;
          })
        );

        // Send notification to the provider
        try {
          if (acceptedOffer) {
            await notificationService.notifyOfferAccepted(
              acceptedOffer.providerId,
              "provider",
              {
                id: offerId,
                serviceType:
                  currentRequest?.service_type || acceptedOffer.serviceType,
              }
            );
            console.log("Notification sent to provider about accepted offer");
          }
        } catch (notificationError) {
          console.error(
            "Error sending notification to provider:",
            notificationError
          );
          // We don't want to fail the offer acceptance if notification fails
        }

        // Show success dialog
        setDialog({
          isOpen: true,
          message:
            "Offer accepted successfully! The service provider will be notified.",
          type: "success",
        });
      }
    } catch (err) {
      console.error("Error accepting offer:", err);
      // Show error dialog instead of alert
      setDialog({
        isOpen: true,
        message: "Failed to accept offer. Please try again.",
        type: "error",
      });
    }
  };

  // Remove handleRejectOffer function as it's no longer needed
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

      // Show success dialog
      setDialog({
        isOpen: true,
        message: "Offer rejected successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error rejecting offer:", err);
      // Show error dialog instead of alert
      setDialog({
        isOpen: true,
        message: "Failed to reject offer. Please try again.",
        type: "error",
      });
    }
  };

  // Close dialog handler
  const closeDialog = () => {
    setDialog((prev) => ({ ...prev, isOpen: false }));
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
          label:
            status.charAt(0).toUpperCase() + status.slice(1).replace("_", " "),
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

      {/* Response Dialog */}
      <ResponseDialog
        isOpen={dialog.isOpen}
        onClose={closeDialog}
        message={dialog.message}
        type={dialog.type}
      />

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
                      <>
                        Scheduled: {formatDate(request.preferred_date)} at{" "}
                        {request.preferred_time &&
                          request.preferred_time.substring(0, 5)}
                      </>
                    ) : (
                      <>
                        Flexible Schedule:{" "}
                        {request.flexible_schedule_days?.join(", ")}
                      </>
                    )}
                  </p>
                  <p className="request-address">
                    {request.city}, {request.region}
                  </p>
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
