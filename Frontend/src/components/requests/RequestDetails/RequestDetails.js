import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import RequestStatusTimeline from "./RequestStatusTimeline";
import RequestActionButtons from "./RequestActionButtons";
import RequestComments from "./RequestComments";
import requestService from "../../../services/requestService";

const mapBackendToUI = (data) => {
  // Map backend fields to UI fields
  return {
    id: data.id,
    serviceType: data.service_type || data.serviceType,
    serviceName: data.service_type || data.serviceName,
    status: data.status,
    createdAt: data.created_at || data.createdAt,
    scheduleType: data.schedule_type || data.scheduleType,
    scheduledDate: data.preferred_date || data.scheduledDate,
    scheduledTime: data.preferred_time || data.scheduledTime,
    flexible_schedule_days: data.flexible_schedule_days || [],
    flexible_time_slots: data.flexible_time_slots || [],
    address: `${data.region ? data.region + ", " : ""}${data.city || ""}`,
    pricing: {
      min: data.budget_min_hourly ? Number(data.budget_min_hourly) : 0,
      type: data.budget_type || "hourly",
      max: data.budget_max_hourly ? Number(data.budget_max_hourly) : 0,
      fixed: data.fixed_price_offer ? Number(data.fixed_price_offer) : 0,
      currency: "USD",
    },
    client: {
      name: data.customer_id ? `Customer #${data.customer_id}` : "",
      phone: "",
      email: "",
    },
    serviceProvider: data.matched_provider_id
      ? {
          name: `Provider #${data.matched_provider_id}`,
          phone: "",
          specialization: "",
          rating: "",
          qualifications: data.preferred_qualifications || [],
          servicesProvided: [],
        }
      : null,
    details: {
      description: data.description || "",
      duration: "",
      notes: data.additional_info || "",
      specialRequirements: "",
    },
    statusHistory: [],
    comments: [],
  };
};

const RequestDetails = ({ request: requestProp, onCancelRequest }) => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(
    requestProp ? mapBackendToUI(requestProp) : null
  );
  const [loading, setLoading] = useState(!requestProp);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (requestProp) {
      setRequest(mapBackendToUI(requestProp));
      setLoading(false);
      setError(null);
      return;
    }
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Example: const response = await axios.get(`/api/requests/${requestId}`);
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        // Mocked data for the selected request
        const mockRequest = {
          id: requestId,
          serviceType: "maintenance",
          serviceName: "Plumbing Repair",
          status: "approved",
          createdAt: "2023-10-28T15:45:00Z",
          scheduledDate: "2023-11-10",
          scheduledTime: "10:00",
          address: "456 Oak Ave, Boston, MA 02109",
          pricing: {
            rate: 85,
            type: "hourly",
            estimatedTotal: 170,
            currency: "USD",
          },
          client: {
            name: "Jane Doe",
            phone: "(617) 555-1234",
            email: "jane.doe@example.com",
          },
          serviceProvider: {
            name: "Mike Thompson",
            phone: "(617) 555-5678",
            specialization: "Master Plumber",
            rating: 4.8,
            qualifications: [
              "Licensed Plumber",
              "5+ years experience",
              "Emergency repairs",
              "Certified in water conservation",
            ],
            servicesProvided: [
              "Pipe repairs",
              "Fixture installation",
              "Leak detection",
              "Drain cleaning",
            ],
          },
          details: {
            description: "Leaky kitchen sink and slow draining bathroom tub",
            duration: "2 hours",
            notes:
              "The kitchen sink has been leaking for a week. The bathroom tub is draining very slowly.",
            specialRequirements:
              "Need to have access to under-sink area. Will need to bring drain snake equipment.",
          },
          statusHistory: [
            {
              status: "pending",
              date: "2023-10-28T15:45:00Z",
              note: "Request submitted",
            },
            {
              status: "approved",
              date: "2023-10-29T09:20:00Z",
              note: "Request approved, service provider assigned",
            },
          ],
          comments: [
            {
              id: 1,
              author: "System",
              text: "Request received and processing",
              date: "2023-10-28T15:45:00Z",
            },
            {
              id: 2,
              author: "Mike Thompson",
              text: "I'll bring all necessary tools for the job",
              date: "2023-10-29T10:15:00Z",
            },
            {
              id: 3,
              author: "Jane Doe",
              text: "Thank you! Do I need to clear out under the sink?",
              date: "2023-10-29T11:30:00Z",
            },
            {
              id: 4,
              author: "Mike Thompson",
              text: "Yes, please clear out under the sink for easier access. Also, please don't use the tub before I arrive",
              date: "2023-10-29T13:45:00Z",
            },
          ],
        };
        setRequest(mockRequest);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details. Please try again.");
        setLoading(false);
      }
    };
    fetchRequestDetails();
  }, [requestId, requestProp]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const handleCancelRequest = async () => {
    try {
      // Call the backend API to cancel the request
      await requestService.cancelRequest(request.id);

      // Update the local state
      setRequest((prev) => ({
        ...prev,
        status: "cancelled",
        statusHistory: [
          ...(prev.statusHistory || []),
          {
            status: "cancelled",
            date: new Date().toISOString(),
            note: "Request cancelled by client",
          },
        ],
      }));

      // Call the parent component's cancel handler if provided
      if (onCancelRequest) {
        onCancelRequest(request.id);
      }

      // Show a success message (would use a toast in a real app)
      alert(`Request ${request.id} has been cancelled.`);
    } catch (err) {
      console.error("Error cancelling request:", err);
      alert("Failed to cancel request. Please try again.");
    }
  };

  // Handle adding a new comment
  const handleAddComment = (text) => {
    const newComment = {
      id: request.comments.length + 1,
      author: "Jane Doe", // In a real app, this would be the logged-in user
      text,
      date: new Date().toISOString(),
    };

    setRequest((prev) => ({
      ...prev,
      comments: [...prev.comments, newComment],
    }));
  };

  // Get service category icon
  const getServiceCategoryIcon = (serviceType) => {
    switch (serviceType) {
      case "homecare":
        return "fa-home";
      case "healthcare":
        return "fa-heartbeat";
      case "cleaning":
        return "fa-broom";
      case "maintenance":
        return "fa-tools";
      case "homemaking":
        return "fa-utensils";
      case "personalcare":
        return "fa-hands-helping";
      case "transportation":
        return "fa-car";
      default:
        return "fa-concierge-bell";
    }
  };

  if (loading) {
    return (
      <div className="request-details-loading">
        <div className="spinner"></div>
        <p>Loading request details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="request-details-error">
        <i className="fas fa-exclamation-circle"></i>
        <h3>Error Loading Request</h3>
        <p>{error}</p>
        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left"></i> Go Back
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <i className="fas fa-redo"></i> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="request-details-not-found">
        <i className="fas fa-search"></i>
        <h3>Request Not Found</h3>
        <p>The request you're looking for doesn't exist or has been removed.</p>
        <Link to="/requests" className="btn btn-primary">
          <i className="fas fa-list"></i> View All Requests
        </Link>
      </div>
    );
  }

  // Get status badge details
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

  const statusDetails = getStatusDetails(request.status);
  const serviceIcon = getServiceCategoryIcon(request.serviceType);

  return (
    <div className="request-details-container">
      <motion.div
        className="request-details-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="header-content">
          <div className="back-link">
            <Link to="/requests">
              <i className="fas fa-arrow-left"></i> Back to Requests
            </Link>
          </div>
          <h1>Service Request Details</h1>
          <div className="request-id-display">Request ID: {request.id}</div>
          <div className={`status-badge ${statusDetails.className}`}>
            <i className={`fas ${statusDetails.icon}`}></i>{" "}
            {statusDetails.label}
          </div>
        </div>
      </motion.div>

      <div className="request-details-content">
        <div className="request-details-grid">
          <motion.section
            className="request-summary-det card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <h2>
              <i className={`fas ${serviceIcon}`}></i> Service Details
            </h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Service Name</span>
                <span className="value">{request.serviceName}</span>
              </div>
              {/* Schedule Type */}
              <div className="summary-item">
                <span className="label">Schedule Type</span>
                <span className="value">
                  {request.scheduleType === "specific"
                    ? "Specific Date & Time"
                    : request.scheduleType === "flexible"
                    ? "Flexible"
                    : "-"}
                  {console.log(request)}
                  {console.log(request.scheduleType)}
                </span>
              </div>
              {/* Schedule Details */}
              {request.scheduleType === "specific" && (
                <>
                  <div className="summary-item">
                    <span className="label">Scheduled Date</span>
                    <span className="value">
                      {request.scheduledDate || "-"}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Scheduled Time</span>
                    <span className="value">
                      {request.scheduledTime || "-"}
                    </span>
                  </div>
                </>
              )}
              {request.scheduleType === "flexible" && (
                <>
                  <div className="summary-item">
                    <span className="label">Available Days</span>
                    <span className="value">
                      {Array.isArray(request.flexible_schedule_days)
                        ? request.flexible_schedule_days.join(", ")
                        : "-"}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="label">Preferred Time Slots</span>
                    <span className="value">
                      {Array.isArray(request.flexible_time_slots)
                        ? request.flexible_time_slots.join(", ")
                        : "-"}
                    </span>
                  </div>
                </>
              )}
              <div className="summary-item full-width">
                <span className="label">Address</span>
                <span className="value address">
                  <i className="fas fa-map-marker-alt"></i> {request.address}
                </span>
              </div>
              <div className="summary-item full-width">
                <span className="label">Description</span>
                <span className="value">{request.details.description}</span>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="pricing-details card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <h2>
              <i className="fas fa-money-bill-wave"></i> Pricing Details
            </h2>
            <div className="pricing-info">
              <div className="pricing-item">
                <span className="label">Budget Type</span>
                <span className="value">
                  {request.pricing.type === "hourly"
                    ? "Hourly Rate"
                    : request.pricing.type === "fixed"
                    ? "Fixed Price"
                    : "-"}
                </span>
              </div>
              {request.pricing.type === "hourly" && (
                <>
                  <div className="pricing-item">
                    <span className="label">Min Rate</span>
                    <span className="value">
                      {request.pricing.min
                        ? formatCurrency(request.pricing.min)
                        : "-"}
                    </span>
                  </div>
                  <div className="pricing-item">
                    <span className="label">Max Rate</span>
                    <span className="value">
                      {request.pricing.max
                        ? formatCurrency(request.pricing.max)
                        : "-"}
                    </span>
                  </div>
                </>
              )}
              {request.pricing.type === "fixed" && (
                <div className="pricing-item">
                  <span className="label">Fixed Price</span>
                  <span className="value">
                    {request.pricing.fixed
                      ? formatCurrency(request.pricing.fixed)
                      : "-"}
                  </span>
                </div>
              )}
              <div className="pricing-note">
                <i className="fas fa-info-circle"></i>
                <p>
                  The final amount may vary based on actual service duration and
                  any additional services provided.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="request-notes card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <h2>
              <i className="fas fa-sticky-note"></i> Additional Notes
            </h2>
            <div className="notes-content">
              <p>{request.details.notes}</p>
              {request.details.specialRequirements && (
                <div className="special-requirements">
                  <h3>Special Requirements</h3>
                  <p>{request.details.specialRequirements}</p>
                </div>
              )}
            </div>
          </motion.section>

          <motion.section
            className="request-timeline card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <h2>
              <i className="fas fa-history"></i> Request Timeline
            </h2>
            <RequestStatusTimeline statusHistory={request.statusHistory} />
          </motion.section>

          <motion.section
            className="request-actions card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <h2>
              <i className="fas fa-tasks"></i> Actions
            </h2>
            <RequestActionButtons
              request={request}
              onCancelRequest={handleCancelRequest}
            />
          </motion.section>

          {/* <motion.section
            className="request-comments card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <h2>
              <i className="fas fa-comments"></i> Communication
            </h2>
            <RequestComments
              comments={request.comments}
              onAddComment={handleAddComment}
              formatDateTime={formatDateTime}
            />
          </motion.section> */}

          {/* {request.serviceProvider && request.status !== "cancelled" && (
            <motion.a
              href={`tel:${request.serviceProvider.phone}`}
              className="btn btn-outlined"
              whileTap={{ scale: 0.95 }}
            >
              <i className="fas fa-phone"></i> Call Service Provider
            </motion.a>
          )} */}
        </div>
      </div>
    </div>
  );
};

RequestDetails.propTypes = {
  request: PropTypes.object,
  onCancelRequest: PropTypes.func,
};

export default RequestDetails;
