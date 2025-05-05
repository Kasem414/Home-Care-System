import React, { useState } from "react";

const RequestSummary = ({ data, onUpdate, onSubmit, onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Handle terms agreement
  const handleTermsChange = (e) => {
    setAgreeToTerms(e.target.checked);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeToTerms) return;

    setIsSubmitting(true);
    try {
      await onSubmit();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    try {
      // Convert 24-hour format to 12-hour format
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  // Format budget for display
  const formatBudget = () => {
    const { budget } = data.requirements;
    if (budget.type === "hourly") {
      return `$${budget.min} - $${budget.max} per hour`;
    } else {
      return `$${budget.max} fixed price`;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Get service category name
  const getServiceCategoryName = (categoryId) => {
    const categories = {
      homecare: "Home Care",
      healthcare: "Healthcare",
      cleaning: "Cleaning",
      maintenance: "Maintenance",
      homemaking: "Homemaking",
      personalcare: "Personal Care",
      transportation: "Transportation",
      other: "Other",
    };
    return categories[categoryId] || categoryId;
  };

  // Get qualification name
  const getQualificationName = (qualificationId) => {
    const qualifications = {
      certified: "Certified Professional",
      licensed: "Licensed",
      insured: "Insured",
      background_check: "Background Checked",
      experienced: "5+ Years Experience",
      emergency: "Emergency Response Trained",
    };
    return qualifications[qualificationId] || qualificationId;
  };

  return (
    <div className="request-summary">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Review Your Request</h2>
          <p className="section-description">
            Please review your service request details below before submitting.
          </p>

          <div className="summary-container">
            <div className="summary-section">
              <h3>Service Details</h3>
              <div className="summary-item">
                <span className="summary-label">Service Type:</span>
                <span className="summary-value">
                  {getServiceCategoryName(data.serviceType)}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Description:</span>
                <span className="summary-value description">
                  {data.serviceDetails}
                </span>
              </div>
            </div>

            <div className="summary-section">
              <h3>Location</h3>
              <div className="summary-item">
                <span className="summary-label">Address:</span>
                <span className="summary-value">
                  {data.location.address}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">City, State ZIP:</span>
                <span className="summary-value">
                  {data.location.city}, {data.location.state} {data.location.zipCode}
                </span>
              </div>
              {data.location.additionalInfo && (
                <div className="summary-item">
                  <span className="summary-label">Additional Info:</span>
                  <span className="summary-value">
                    {data.location.additionalInfo}
                  </span>
                </div>
              )}
            </div>

            <div className="summary-section">
              <h3>Schedule</h3>
              {data.schedule.flexibility === "exact" ? (
                <>
                  <div className="summary-item">
                    <span className="summary-label">Type:</span>
                    <span className="summary-value">Specific Date & Time</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Date:</span>
                    <span className="summary-value">
                      {formatDate(data.schedule.preferredDate)}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time:</span>
                    <span className="summary-value">
                      {formatTime(data.schedule.preferredTime)}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="summary-item">
                    <span className="summary-label">Type:</span>
                    <span className="summary-value">Flexible Schedule</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Days:</span>
                    <span className="summary-value">
                      {data.schedule.flexibleDays.map((day) => day.charAt(0).toUpperCase() + day.slice(1)).join(", ")}
                    </span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Time Slots:</span>
                    <span className="summary-value">
                      {data.schedule.flexibleTimes.map((time) => {
                        switch (time) {
                          case "morning": return "Morning (8am - 12pm)";
                          case "afternoon": return "Afternoon (12pm - 5pm)";
                          case "evening": return "Evening (5pm - 9pm)";
                          default: return time;
                        }
                      }).join(", ")}
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="summary-section">
              <h3>Requirements</h3>
              <div className="summary-item">
                <span className="summary-label">Budget:</span>
                <span className="summary-value">{formatBudget()}</span>
              </div>
              {data.requirements.preferredQualifications.length > 0 && (
                <div className="summary-item">
                  <span className="summary-label">Preferred Qualifications:</span>
                  <span className="summary-value">
                    {data.requirements.preferredQualifications.map(
                      (qual) => getQualificationName(qual)
                    ).join(", ")}
                  </span>
                </div>
              )}
              
              {data.requirements.attachments.length > 0 && (
                <div className="summary-item">
                  <span className="summary-label">Attachments:</span>
                  <span className="summary-value">
                    <ul className="attachments-summary-list">
                      {data.requirements.attachments.map((file) => (
                        <li key={file.id}>
                          {file.name} ({formatFileSize(file.size)})
                        </li>
                      ))}
                    </ul>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="terms-agreement">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={agreeToTerms}
                onChange={handleTermsChange}
                required
              />
              <label htmlFor="agreeToTerms">
                I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a>
              </label>
          </div>
        </div>

        <div className="wizard-actions">
          <button 
            type="button" 
            className="btn btn-outlined back-button"
            onClick={onBack}
          >
            Back
          </button>
          <button
            type="submit"
            className="btn btn-primary submit-button"
            disabled={!agreeToTerms || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RequestSummary;