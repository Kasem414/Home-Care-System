import React from "react";
import { serviceCategories } from "../../../services/api";

const RequestSummary = ({ data, onSubmit, onBack, isSubmitting }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return "Not specified";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    const [hours, minutes] = timeString.split(":");
    const time = new Date();
    time.setHours(parseInt(hours));
    time.setMinutes(parseInt(minutes));
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="request-summary">
      <h2>Review Your Request</h2>
      <div className="summary-content">
        <section className="summary-section">
          <h3>Service Details</h3>
          <div className="summary-item">
            <label>Service Type:</label>
            <span>{data.service_type || "Not specified"}</span>
          </div>
          <div className="summary-item">
            <label>Description:</label>
            <p>{data.description || "No description provided"}</p>
          </div>
        </section>

        <section className="summary-section">
          <h3>Location Details</h3>
          <div className="summary-item">
            <label>City:</label>
            <span>{data.city || "Not specified"}</span>
          </div>
          <div className="summary-item">
            <label>Region:</label>
            <span>{data.region || "Not specified"}</span>
          </div>
          <div className="summary-item">
            <label>Additional Information:</label>
            <p>{data.additional_info || "No additional information"}</p>
          </div>
        </section>

        <section className="summary-section">
          <h3>Schedule</h3>
          {data.schedule_type === "specific" ? (
            <>
              <div className="summary-item">
                <label>Date:</label>
                <span>{formatDate(data.preferred_date)}</span>
              </div>
              <div className="summary-item">
                <label>Time:</label>
                <span>{formatTime(data.preferred_time)}</span>
              </div>
            </>
          ) : (
            <>
              <div className="summary-item">
                <label>Available Days:</label>
                <span>
                  {data.flexible_schedule_days?.length > 0
                    ? data.flexible_schedule_days.join(", ")
                    : "No days selected"}
                </span>
              </div>
              <div className="summary-item">
                <label>Time Slots:</label>
                <span>
                  {data.flexible_time_slots?.length > 0
                    ? data.flexible_time_slots.join(", ")
                    : "No time slots selected"}
                </span>
              </div>
            </>
          )}
        </section>

        <section className="summary-section">
          <h3>Budget</h3>
          {data.budget_type === "hourly" ? (
            <>
              <div className="summary-item">
                <label>Budget Type:</label>
                <span>Hourly Rate</span>
              </div>
              <div className="summary-item">
                <label>Rate Range:</label>
                <span>
                  {formatCurrency(data.budget_min_hourly)} -{" "}
                  {formatCurrency(data.budget_max_hourly)} per hour
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="summary-item">
                <label>Budget Type:</label>
                <span>Fixed Price</span>
              </div>
              <div className="summary-item">
                <label>Fixed Price Offer:</label>
                <span>{formatCurrency(data.fixed_price_offer)}</span>
              </div>
            </>
          )}
        </section>

        <section className="summary-section">
          <h3>Requirements</h3>
          <div className="summary-item">
            <label>Preferred Qualifications:</label>
            <div className="qualifications-list">
              {data.preferred_qualifications?.length > 0 ? (
                data.preferred_qualifications.map((qual, index) => (
                  <span key={index} className="qualification-tag">
                    {qual}
                  </span>
                ))
              ) : (
                <span>No specific qualifications required</span>
              )}
            </div>
          </div>
          <div className="summary-item">
            <label>Attachments:</label>
            <div className="attachments-list">
              {data.attachments?.length > 0 ? (
                data.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    {file.name}
                  </div>
                ))
              ) : (
                <span>No attachments</span>
              )}
            </div>
          </div>
        </section>
      </div>

      <div className="wizard-actions">
        <button
          type="button"
          className="btn btn-outlined back-button"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary submit-button"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </button>
      </div>
    </div>
  );
};

export default RequestSummary;
