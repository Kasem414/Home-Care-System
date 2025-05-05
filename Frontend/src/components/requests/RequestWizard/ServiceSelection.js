import React, { useState, useEffect } from "react";

const ServiceSelection = ({ data, onUpdate, onNext }) => {
  const [serviceType, setServiceType] = useState(data.serviceType || "");
  const [serviceDetails, setServiceDetails] = useState(data.serviceDetails || "");
  const [isValid, setIsValid] = useState(false);
  const [errors, setErrors] = useState({});

  // Service categories
  const serviceCategories = [
    { id: "homecare", name: "Home Care", icon: "🏠" },
    { id: "healthcare", name: "Healthcare", icon: "⚕️" },
    { id: "cleaning", name: "Cleaning", icon: "🧹" },
    { id: "maintenance", name: "Maintenance", icon: "🔧" },
    { id: "homemaking", name: "Homemaking", icon: "🍲" },
    { id: "personalcare", name: "Personal Care", icon: "👤" },
    { id: "transportation", name: "Transportation", icon: "🚗" },
    { id: "other", name: "Other", icon: "📋" },
  ];

  // Validate the form
  useEffect(() => {
    const newErrors = {};
    if (!serviceType) {
      newErrors.serviceType = "Please select a service type";
    }
    if (!serviceDetails.trim()) {
      newErrors.serviceDetails = "Please provide service details";
    } else if (serviceDetails.trim().length < 10) {
      newErrors.serviceDetails = "Please provide more details (at least 10 characters)";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [serviceType, serviceDetails]);

  // Handle selection of service type
  const handleServiceTypeChange = (type) => {
    setServiceType(type);
  };

  // Handle change in service details
  const handleServiceDetailsChange = (e) => {
    setServiceDetails(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate({ serviceType, serviceDetails });
      onNext();
    }
  };

  return (
    <div className="service-selection">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>What service do you need?</h2>
          <div className="service-category-grid">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className={`service-category-card ${
                  serviceType === category.id ? "selected" : ""
                }`}
                onClick={() => handleServiceTypeChange(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
          {errors.serviceType && (
            <div className="error-message">{errors.serviceType}</div>
          )}
        </div>

        <div className="form-section">
          <h2>Describe what you need</h2>
          <textarea
            className={`service-details-textarea ${
              errors.serviceDetails ? "error" : ""
            }`}
            value={serviceDetails}
            onChange={handleServiceDetailsChange}
            placeholder="Please provide details about what you need help with..."
            rows={5}
          ></textarea>
          {errors.serviceDetails && (
            <div className="error-message">{errors.serviceDetails}</div>
          )}
          <div className="details-counter">
            {serviceDetails.length} characters 
            {serviceDetails.length < 10 && " (minimum 10)"}
          </div>
        </div>

        <div className="wizard-actions">
          <button
            type="submit"
            className="btn btn-primary next-button"
            disabled={!isValid}
          >
            Next: Location Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceSelection;