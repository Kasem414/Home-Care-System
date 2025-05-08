import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaCheck, FaInfoCircle } from "react-icons/fa";

const Requirements = ({ data, onUpdate, onNext, onBack }) => {
  // Initialize state with existing data or defaults
  const [requirements, setRequirements] = useState({
    description: data.requirements?.description || "",
    budget: {
      min: data.requirements?.budget?.min || 0,
      max: data.requirements?.budget?.max || 0,
      type: data.requirements?.budget?.type || "hourly",
    },
    preferredQualifications: data.requirements?.preferredQualifications || [],
    attachments: data.requirements?.attachments || [],
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Available qualifications for checkbox selection
  const availableQualifications = [
    { id: "certified", label: "Certified Professional", icon: "🎓" },
    { id: "licensed", label: "Licensed", icon: "📜" },
    { id: "insured", label: "Insured", icon: "🛡️" },
    { id: "background_check", label: "Background Checked", icon: "🔍" },
    { id: "experienced", label: "5+ Years Experience", icon: "⭐" },
    { id: "emergency", label: "Emergency Response Trained", icon: "🚨" },
  ];

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (!requirements.description.trim()) {
      newErrors.description = "Please provide a description";
    } else if (requirements.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (requirements.budget.type === "fixed") {
      if (!requirements.budget.max || requirements.budget.max <= 0) {
        newErrors.budget = "Please enter a valid budget amount";
      }
    } else {
      if (!requirements.budget.min || requirements.budget.min <= 0) {
        newErrors.budgetMin = "Please enter a minimum hourly rate";
      }
      if (!requirements.budget.max || requirements.budget.max <= 0) {
        newErrors.budgetMax = "Please enter a maximum hourly rate";
      }
      if (requirements.budget.min > requirements.budget.max) {
        newErrors.budgetRange =
          "Maximum rate should be greater than minimum rate";
      }
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [requirements]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "budgetMin" || name === "budgetMax") {
      setRequirements({
        ...requirements,
        budget: {
          ...requirements.budget,
          [name === "budgetMin" ? "min" : "max"]: value ? parseFloat(value) : 0,
        },
      });
    } else {
      setRequirements({
        ...requirements,
        [name]: value,
      });
    }
  };

  // Handle budget type selection
  const handleBudgetTypeChange = (type) => {
    setRequirements({
      ...requirements,
      budget: {
        ...requirements.budget,
        type,
        min: type === "fixed" ? 0 : requirements.budget.min,
      },
    });
  };

  // Handle qualification toggle
  const handleQualificationToggle = (qualificationId) => {
    const updatedQualifications = [...requirements.preferredQualifications];
    if (updatedQualifications.includes(qualificationId)) {
      const index = updatedQualifications.indexOf(qualificationId);
      updatedQualifications.splice(index, 1);
    } else {
      updatedQualifications.push(qualificationId);
    }
    setRequirements({
      ...requirements,
      preferredQualifications: updatedQualifications,
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
    const updatedAttachments = [...requirements.attachments];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      const attachment = {
        id: Date.now() + Math.random().toString(36).substring(2, 10),
        name: file.name,
        size: file.size,
        type: file.type,
        file: file,
      };
      updatedAttachments.push(attachment);
    });

    setRequirements({
      ...requirements,
      attachments: updatedAttachments,
    });
  };

  // Remove attachment
  const handleRemoveAttachment = (attachmentId) => {
    const updatedAttachments = requirements.attachments.filter(
      (attachment) => attachment.id !== attachmentId
    );
    setRequirements({
      ...requirements,
      attachments: updatedAttachments,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate({ requirements });
      onNext();
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="requirements">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Details & Requirements</h2>
          <p className="section-description">
            Provide more details about your requirements and preferences.
          </p>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <div className="input-wrapper">
              <textarea
                id="description"
                name="description"
                value={requirements.description}
                onChange={handleChange}
                className={errors.description ? "error" : ""}
                placeholder="Describe in detail what you need help with, including any specific requirements or expectations..."
                rows="5"
              ></textarea>
              <div className="character-counter">
                {requirements.description.length}/500
              </div>
            </div>
            {errors.description && (
              <div className="error-message">{errors.description}</div>
            )}
          </div>

          <div className="form-group">
            <h3>Budget</h3>
            <p className="section-description">
              What is your budget for this service?
            </p>

            <div className="budget-type-selection">
              <button
                type="button"
                className={`budget-type-option ${
                  requirements.budget.type === "hourly" ? "selected" : ""
                }`}
                onClick={() => handleBudgetTypeChange("hourly")}
              >
                <span className="option-icon">⏱️</span>
                <span className="option-label">Hourly Rate</span>
              </button>

              <button
                type="button"
                className={`budget-type-option ${
                  requirements.budget.type === "fixed" ? "selected" : ""
                }`}
                onClick={() => handleBudgetTypeChange("fixed")}
              >
                <span className="option-icon">💰</span>
                <span className="option-label">Fixed Price</span>
              </button>
            </div>

            {requirements.budget.type === "hourly" ? (
              <div className="hourly-rate-inputs">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budgetMin">Minimum Rate ($/hr) *</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="budgetMin"
                        name="budgetMin"
                        value={requirements.budget.min || ""}
                        onChange={handleChange}
                        className={errors.budgetMin ? "error" : ""}
                        placeholder="0"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    {errors.budgetMin && (
                      <div className="error-message">{errors.budgetMin}</div>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="budgetMax">Maximum Rate ($/hr) *</label>
                    <div className="input-wrapper">
                      <input
                        type="number"
                        id="budgetMax"
                        name="budgetMax"
                        value={requirements.budget.max || ""}
                        onChange={handleChange}
                        className={errors.budgetMax ? "error" : ""}
                        placeholder="0"
                        min="0"
                        step="0.1"
                      />
                    </div>
                    {errors.budgetMax && (
                      <div className="error-message">{errors.budgetMax}</div>
                    )}
                  </div>
                </div>
                {errors.budgetRange && (
                  <div className="error-message">{errors.budgetRange}</div>
                )}
              </div>
            ) : (
              <div className="fixed-price-input">
                <div className="form-group">
                  <label htmlFor="budgetMax">Budget Amount ($) *</label>
                  <div className="input-wrapper">
                    <input
                      type="number"
                      id="budgetMax"
                      name="budgetMax"
                      value={requirements.budget.max || ""}
                      onChange={handleChange}
                      className={errors.budget ? "error" : ""}
                      placeholder="0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  {errors.budget && (
                    <div className="error-message">{errors.budget}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <h3>Preferred Provider Qualifications</h3>
            <p className="section-description">
              Select any specific qualifications you prefer for the service
              provider.
            </p>

            <div className="qualifications-grid">
              {availableQualifications.map((qualification) => (
                <button
                  key={qualification.id}
                  type="button"
                  className={`qualification-option ${
                    requirements.preferredQualifications.includes(
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
                  {requirements.preferredQualifications.includes(
                    qualification.id
                  ) && (
                    <span className="check-icon">
                      <FaCheck />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <h3>Attachments</h3>
            <p className="section-description">
              Upload photos or documents that will help service providers better
              understand your needs.
            </p>

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
                {requirements.attachments.map((attachment) => (
                  <div key={attachment.id} className="attachment-item">
                    <div className="attachment-info">
                      <span className="attachment-icon">
                        {attachment.type.startsWith("image/") ? "🖼️" : "📄"}
                      </span>
                      <div className="attachment-details">
                        <span className="attachment-name">
                          {attachment.name}
                        </span>
                        <span className="attachment-size">
                          {formatFileSize(attachment.size)}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="attachment-remove"
                      onClick={() => handleRemoveAttachment(attachment.id)}
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
