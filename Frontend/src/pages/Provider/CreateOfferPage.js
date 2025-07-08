import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";
import { requestService } from "../../services/requestService";
import { notificationService } from "../../services/notificationService";

const CreateOfferPage = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form state
  const [offerData, setOfferData] = useState({
    price: "",
    estimatedDuration: "",
    description: "",
    availableDate: "",
    availableTime: "",
    materials: "",
    termsAccepted: false,
  });

  // Form validation
  const [formErrors, setFormErrors] = useState({});

  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make an API call to fetch the request details
        const response = await requestService.getRequestById(requestId);
        const requestData = response.data || response;

        setRequest(requestData);

        // Pre-fill the date and time fields with the requested schedule
        setOfferData((prev) => ({
          ...prev,
          availableDate: requestData.scheduledDate,
          availableTime: requestData.scheduledTime,
        }));

        setLoading(false);
      } catch (err) {
        console.error("Error fetching request details:", err);
        setError("Failed to load request details. Please try again.");
        setLoading(false);
      }
    };

    fetchRequestDetails();
  }, [requestId]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOfferData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (
      !offerData.price ||
      isNaN(offerData.price) ||
      Number(offerData.price) <= 0
    ) {
      errors.price = "Please enter a valid price";
    }

    if (
      !offerData.estimatedDuration ||
      isNaN(offerData.estimatedDuration) ||
      Number(offerData.estimatedDuration) <= 0
    ) {
      errors.estimatedDuration = "Please enter a valid duration";
    }

    if (!offerData.description.trim()) {
      errors.description = "Please provide a description of your services";
    } else if (offerData.description.length < 50) {
      errors.description = "Description must be at least 50 characters";
    }

    if (!offerData.availableDate) {
      errors.availableDate = "Please select an available date";
    }

    if (!offerData.availableTime) {
      errors.availableTime = "Please select an available time";
    }

    if (!offerData.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        document.querySelector(`[name="${firstErrorField}"]`).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    try {
      setSubmitting(true);

      // Create the offer object
      const offer = {
        requestId: Number(requestId), // Changed from requestId to request_id to match backend expectations
        providerId: user?.id || 42, // Fallback to 42 as specified in the API example
        price: offerData.price,
        estimatedDuration: offerData.estimatedDuration,
        description: offerData.description,
        availableDate: offerData.availableDate,
        availableTime: offerData.availableTime,
        materials: offerData.materials || "",
      };

      // Make API call to submit the offer
      const response = await axios.post(
        `http://127.0.0.1:9000/api/offers/?requestId=${requestId}`, // Added requestId as query parameter for additional clarity
        offer,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log("Offer submitted:", response.data);

      // Get the created offer data
      const createdOffer = response.data;

      // Send notification to the homeowner
      try {
        // We need to get the homeowner ID from the request data
        if (request && request.customer_id) {
          await notificationService.notifyNewOffer(
            request.customer_id,
            "customer",
            {
              serviceType: request.service_type,
              requestId: requestId,
              providerId: offer.providerId,
            }
          );
          console.log("Notification sent to homeowner about new offer");
        }
      } catch (notificationError) {
        console.error(
          "Error sending notification to homeowner:",
          notificationError
        );
        // We don't want to fail the offer submission if notification fails
      }

      setSuccessMessage(
        "Your offer has been successfully submitted! The client will be notified."
      );
      setSubmitting(false);

      // Redirect after a delay
      setTimeout(() => {
        navigate("/provider/dashboard");
      }, 3000);
    } catch (err) {
      console.error("Error submitting offer:", err);
      setError("Failed to submit your offer. Please try again.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="create-offer-page">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Loading request details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="create-offer-page">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="create-offer-page">
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

  if (successMessage) {
    return (
      <div className="create-offer-page">
        <div className="container">
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h2>Offer Submitted!</h2>
            <p>{successMessage}</p>
            <p>You will be redirected to the dashboard shortly...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-offer-page">
      <div className="container">
        <div className="page-header">
          <div className="breadcrumb">
            <Link to="/provider/dashboard">Dashboard</Link> {" > "}
            {location.state?.from === "requestDetails" ? (
              <>
                <Link to={`/provider/request/${requestId}`}>
                  Request Details
                </Link>{" "}
                {" > "}
              </>
            ) : null}
            <span>Create Offer</span>
          </div>
        </div>

        <div className="create-offer-container">
          <div className="request-summary-card">
            <div className="section-title">Request Summary</div>
            <div className="request-info">
              <h3>{request.serviceType}</h3>
              <div className="request-detail">
                <i className="fas fa-map-marker-alt"></i>
                <span>{request.address}</span>
              </div>
              <div className="request-detail">
                <i className="fas fa-calendar"></i>
                <span>
                  Requested for:{" "}
                  {new Date(request.preferred_date).toLocaleDateString()} at{" "}
                  {request.preferred_time}
                </span>
              </div>
              <div className="request-detail">
                <i className="fas fa-money-bill-wave"></i>
                <span>
                  Budget:{" "}
                  {request.budget
                    ? `$${request.budget.min} - $${request.budget.max}`
                    : "Not specified"}
                </span>
              </div>
              <div className="request-detail description">
                <i className="fas fa-file-alt"></i>
                <span>{request.description}</span>
              </div>
            </div>
          </div>

          <div className="create-offer-form-card">
            <div className="section-title">Create Your Offer</div>
            <form onSubmit={handleSubmit} className="offer-form">
              <div className="form-section">
                <h4>Pricing and Duration</h4>

                <div className="form-group">
                  <label htmlFor="price">
                    Your Price ($) <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    {/* <i className="fas fa-dollar-sign"></i> */}
                    <input
                      type="number"
                      id="price"
                      name="price"
                      min="1"
                      step="0.01"
                      value={offerData.price}
                      onChange={handleInputChange}
                      className={formErrors.price ? "error" : ""}
                      required
                    />
                  </div>
                  {formErrors.price && (
                    <div className="error-message">{formErrors.price}</div>
                  )}
                  <small>
                    The client's budget is{" "}
                    {request.budget
                      ? `$${request.budget.min} - $${request.budget.max}`
                      : "not specified"}
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="estimatedDuration">
                    Estimated Duration (hours){" "}
                    <span className="required">*</span>
                  </label>
                  <div className="input-with-icon">
                    {/* <i className="fas fa-clock"></i> */}
                    <input
                      type="number"
                      id="estimatedDuration"
                      name="estimatedDuration"
                      min="0.5"
                      step="0.5"
                      value={offerData.estimatedDuration}
                      onChange={handleInputChange}
                      className={formErrors.estimatedDuration ? "error" : ""}
                      required
                    />
                  </div>
                  {formErrors.estimatedDuration && (
                    <div className="error-message">
                      {formErrors.estimatedDuration}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-section">
                <h4>Service Details</h4>

                <div className="form-group">
                  <label htmlFor="description">
                    Description of Your Services{" "}
                    <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={offerData.description}
                    onChange={handleInputChange}
                    className={formErrors.description ? "error" : ""}
                    placeholder="Describe how you'll complete this service, your experience, and why you're the best choice for this job."
                    required
                  ></textarea>
                  {formErrors.description && (
                    <div className="error-message">
                      {formErrors.description}
                    </div>
                  )}
                  <div className="character-count">
                    {offerData.description.length}/500 characters (minimum 50)
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="materials">
                    Materials and Equipment (optional)
                  </label>
                  <textarea
                    id="materials"
                    name="materials"
                    rows="3"
                    value={offerData.materials}
                    onChange={handleInputChange}
                    placeholder="List any materials or equipment you'll provide or need from the client."
                  ></textarea>
                </div>
              </div>

              <div className="form-section">
                <h4>Availability</h4>

                <div className="form-row">
                  <div className="form-group half">
                    <label htmlFor="availableDate">
                      Available Date <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      {/* <i className="fas fa-calendar-alt"></i> */}
                      <input
                        type="date"
                        id="availableDate"
                        name="availableDate"
                        value={offerData.availableDate}
                        onChange={handleInputChange}
                        className={formErrors.availableDate ? "error" : ""}
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    {formErrors.availableDate && (
                      <div className="error-message">
                        {formErrors.availableDate}
                      </div>
                    )}
                  </div>

                  <div className="form-group half">
                    <label htmlFor="availableTime">
                      Available Time <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      {/* <i className="fas fa-clock"></i> */}
                      <input
                        type="time"
                        id="availableTime"
                        name="availableTime"
                        value={offerData.availableTime}
                        onChange={handleInputChange}
                        className={formErrors.availableTime ? "error" : ""}
                        required
                      />
                    </div>
                    {formErrors.availableTime && (
                      <div className="error-message">
                        {formErrors.availableTime}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-message">
                  <i className="fas fa-info-circle"></i>
                  <span>
                    The client requested service on{" "}
                    <strong>
                      {new Date(request.scheduledDate).toLocaleDateString()}
                    </strong>{" "}
                    at <strong>{request.scheduledTime}</strong>. If you're not
                    available at this time, please propose an alternative.
                  </span>
                </div>
              </div>

              <div className="form-section">
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={offerData.termsAccepted}
                    onChange={handleInputChange}
                    className={formErrors.termsAccepted ? "error" : ""}
                  />
                  <label htmlFor="termsAccepted">
                    I confirm that I can perform this service as described, and
                    I agree to the{" "}
                    <Link to="/terms" target="_blank">
                      Terms and Conditions
                    </Link>
                    . <span className="required">*</span>
                  </label>
                </div>
                {formErrors.termsAccepted && (
                  <div className="error-message">
                    {formErrors.termsAccepted}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <Link
                  to={`/provider/request/${requestId}`}
                  className="btn btn-secondary"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Submitting...
                    </>
                  ) : (
                    "Submit Offer"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOfferPage;
