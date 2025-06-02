import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import "../../../styles/components/requests/Requirements.css";

const Requirements = ({ data, onUpdate, onNext, onBack }) => {
  // Available qualifications for checkbox selection
  const availableQualifications = [
    { id: "certified", label: "Certified Professional", icon: "🎓" },
    { id: "licensed", label: "Licensed", icon: "📜" },
    { id: "insured", label: "Insured", icon: "🛡️" },
    { id: "background_check", label: "Background Checked", icon: "🔍" },
    { id: "experienced", label: "5+ Years Experience", icon: "⭐" },
    { id: "emergency", label: "Emergency Response Trained", icon: "🚨" },
  ];

  const [requirements, setRequirements] = useState({
    description: data.description || "",
    budget_type: data.budget_type || "hourly",
    budget_min_hourly: data.budget_min_hourly || "",
    budget_max_hourly: data.budget_max_hourly || "",
    fixed_price_offer: data.fixed_price_offer || "",
    preferred_qualifications: data.preferred_qualifications || [],
    attachments: data.attachments || [],
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (!requirements.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (requirements.budget_type === "hourly") {
      if (!requirements.budget_min_hourly) {
        newErrors.budget_min_hourly = "Minimum hourly rate is required";
      }
      if (!requirements.budget_max_hourly) {
        newErrors.budget_max_hourly = "Maximum hourly rate is required";
      }
      if (
        Number(requirements.budget_min_hourly) >
        Number(requirements.budget_max_hourly)
      ) {
        newErrors.budget_range =
          "Minimum rate cannot be greater than maximum rate";
      }
    } else if (requirements.budget_type === "fixed") {
      if (!requirements.fixed_price_offer) {
        newErrors.fixed_price_offer = "Fixed price offer is required";
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [requirements]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Format budget values as valid numbers
    let formattedValue = value;
    if (
      name === "budget_min_hourly" ||
      name === "budget_max_hourly" ||
      name === "fixed_price_offer"
    ) {
      // Remove any non-numeric characters except decimal point
      formattedValue = value.replace(/[^\d.]/g, "");

      // Ensure only one decimal point
      const parts = formattedValue.split(".");
      if (parts.length > 2) {
        formattedValue = parts[0] + "." + parts.slice(1).join("");
      }

      // Convert to number if valid
      const numValue = parseFloat(formattedValue);
      if (!isNaN(numValue)) {
        formattedValue = numValue.toString();
      }
    }

    setRequirements((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  // Handle budget type change
  const handleBudgetTypeChange = (type) => {
    setRequirements((prev) => ({
      ...prev,
      budget_type: type,
      budget_min_hourly: type === "hourly" ? prev.budget_min_hourly : "0",
      budget_max_hourly: type === "hourly" ? prev.budget_max_hourly : "0",
      fixed_price_offer: type === "fixed" ? prev.fixed_price_offer : "0",
    }));
  };

  // Handle qualification toggle
  const handleQualificationToggle = (qualificationId) => {
    setRequirements((prev) => {
      const qualifications = prev.preferred_qualifications.includes(
        qualificationId
      )
        ? prev.preferred_qualifications.filter((q) => q !== qualificationId)
        : [...prev.preferred_qualifications, qualificationId];
      return {
        ...prev,
        preferred_qualifications: qualifications,
      };
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload({ target: { files } });
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setRequirements((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  // Remove attachment
  const handleAttachmentRemove = (index) => {
    setRequirements((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate(requirements);
      onNext();
    }
  };

  return (
    <div className="requirements-form">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Service Requirements</h2>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={requirements.description}
              onChange={handleChange}
              className={errors.description ? "error" : ""}
              placeholder="Please provide detailed requirements for your service request..."
              rows="4"
            />
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="form-group">
            <h3>Budget</h3>
            <div className="budget-type-selector">
              <button
                type="button"
                className={`budget-type-btn ${
                  requirements.budget_type === "hourly" ? "active" : ""
                }`}
                onClick={() => handleBudgetTypeChange("hourly")}
              >
                <span className="icon">⏱️</span>
                <span>Hourly Rate</span>
              </button>
              <button
                type="button"
                className={`budget-type-btn ${
                  requirements.budget_type === "fixed" ? "active" : ""
                }`}
                onClick={() => handleBudgetTypeChange("fixed")}
              >
                <span className="icon">💰</span>
                <span>Fixed Price</span>
              </button>
            </div>

            {requirements.budget_type === "hourly" ? (
              <div className="budget-inputs">
                <div className="input-group">
                  <label htmlFor="budget_min_hourly">
                    Minimum Rate ($/hr) *
                  </label>
                  <input
                    type="number"
                    id="budget_min_hourly"
                    name="budget_min_hourly"
                    value={requirements.budget_min_hourly}
                    onChange={handleChange}
                    className={errors.budget_min_hourly ? "error" : ""}
                    placeholder="0"
                    min="0"
                  />
                  {errors.budget_min_hourly && (
                    <div className="error-message">
                      {errors.budget_min_hourly}
                    </div>
                  )}
                </div>
                <div className="input-group">
                  <label htmlFor="budget_max_hourly">
                    Maximum Rate ($/hr) *
                  </label>
                  <input
                    type="number"
                    id="budget_max_hourly"
                    name="budget_max_hourly"
                    value={requirements.budget_max_hourly}
                    onChange={handleChange}
                    className={errors.budget_max_hourly ? "error" : ""}
                    placeholder="0"
                    min="0"
                  />
                  {errors.budget_max_hourly && (
                    <div className="error-message">
                      {errors.budget_max_hourly}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="budget-inputs">
                <div className="input-group">
                  <label htmlFor="fixed_price_offer">Fixed Price ($) *</label>
                  <input
                    type="number"
                    id="fixed_price_offer"
                    name="fixed_price_offer"
                    value={requirements.fixed_price_offer}
                    onChange={handleChange}
                    className={errors.fixed_price_offer ? "error" : ""}
                    placeholder="Enter your fixed price offer"
                    min="0"
                  />
                  {errors.fixed_price_offer && (
                    <div className="error-message">
                      {errors.fixed_price_offer}
                    </div>
                  )}
                </div>
              </div>
            )}

            {errors.budget_range && (
              <div className="error-message">{errors.budget_range}</div>
            )}
          </div>

          <div className="form-group">
            <h3>Preferred Provider Qualifications</h3>
            <div className="qualifications-grid">
              {availableQualifications.map((qualification) => (
                <div
                  key={qualification.id}
                  className={`qualification-card ${
                    requirements.preferred_qualifications.includes(
                      qualification.id
                    )
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => handleQualificationToggle(qualification.id)}
                >
                  <span className="qualification-icon">
                    {qualification.icon}
                  </span>
                  <span className="qualification-label">
                    {qualification.label}
                  </span>
                  {requirements.preferred_qualifications.includes(
                    qualification.id
                  ) && (
                    <span className="check-icon">
                      <FaCheck />
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <h3>Attachments</h3>
            <div
              className={`file-upload-container ${
                isDragging ? "dragging" : ""
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileUpload}
                multiple
                className="file-input"
              />
              <label htmlFor="attachments" className="file-upload-label">
                <FaUpload className="upload-icon" />
                <span>Drag & drop files here or click to browse</span>
                <span className="file-upload-hint">Max 5 files, 5MB each</span>
              </label>
            </div>

            {requirements.attachments.length > 0 && (
              <div className="attachments-list">
                {requirements.attachments.map((file, index) => (
                  <div key={index} className="attachment-item">
                    <div className="attachment-info">
                      <span className="attachment-icon">
                        {file.type.startsWith("image/") ? "🖼️" : "📄"}
                      </span>
                      <div className="attachment-details">
                        <span className="attachment-name">{file.name}</span>
                        <span className="attachment-size">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="attachment-remove"
                      onClick={() => handleAttachmentRemove(index)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
            className="btn btn-primary next-button"
            disabled={!isValid}
          >
            Next: Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default Requirements;
