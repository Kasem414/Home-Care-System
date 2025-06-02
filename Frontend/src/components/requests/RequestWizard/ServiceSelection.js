import React, { useState, useEffect } from "react";
import { serviceCategories } from "../../../services/api";
import { toast } from "react-toastify";
import "../../../styles/components/requests/ServiceSelection.css";

const ServiceSelection = ({ data, onUpdate, onNext }) => {
  const [serviceData, setServiceData] = useState({
    service_type: data.service_type || "",
    description: data.description || "",
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({
    service_type: false,
    description: false,
  });

  // Fetch service categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await serviceCategories.getCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching service categories:", error);
        toast.error("Failed to load service categories");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (touched.service_type && !serviceData.service_type) {
      newErrors.service_type = "Please select a service type";
    }
    if (touched.description) {
      if (!serviceData.description.trim()) {
        newErrors.description = "Please provide service details";
      } else if (serviceData.description.trim().length < 10) {
        newErrors.description =
          "Please provide more details (at least 10 characters)";
      }
    }

    setErrors(newErrors);
    setIsValid(
      serviceData.service_type && serviceData.description.trim().length >= 10
    );
  }, [serviceData, touched]);

  // Handle service type selection
  const handleServiceTypeChange = (categoryName) => {
    setTouched((prev) => ({ ...prev, service_type: true }));
    setServiceData((prev) => ({
      ...prev,
      service_type: categoryName,
    }));
  };

  // Handle description change
  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setTouched((prev) => ({ ...prev, description: true }));
    setServiceData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ service_type: true, description: true });

    if (isValid) {
      onUpdate(serviceData);
      onNext();
    }
  };

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading services...</span>
      </div>
    );
  }

  return (
    <div className="service-selection">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>What service do you need?</h2>
          <div className="service-category-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`service-category-card ${
                  serviceData.service_type === category.name ? "selected" : ""
                }`}
                onClick={() => handleServiceTypeChange(category.name)}
              >
                {/* <div className="category-icon">
                  <i className={category.icon || "fas fa-concierge-bell"}></i>
                </div> */}
                <div className="category-name">{category.name}</div>
              </div>
            ))}
          </div>
          {errors.service_type && (
            <div className="error-message">{errors.service_type}</div>
          )}
        </div>

        <div className="form-section">
          <h2>Describe what you need</h2>
          <textarea
            className={`service-details-textarea ${
              errors.description ? "error" : ""
            }`}
            value={serviceData.description}
            onChange={handleDescriptionChange}
            placeholder="Please provide details about what you need help with..."
            rows={5}
          ></textarea>
          {errors.description && (
            <div className="error-message">{errors.description}</div>
          )}
          <div className="details-counter">
            {serviceData.description.length} characters
            {serviceData.description.length < 10 && " (minimum 10)"}
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
