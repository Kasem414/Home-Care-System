import React, { useState, useEffect } from "react";
import "../../../styles/components/requests/LocationDetails.css";

const LocationDetails = ({ data, onUpdate, onNext, onBack }) => {
  // Initialize state with existing data or defaults
  const [location, setLocation] = useState({
    city: data.location?.city || "",
    region: data.location?.region || "",
    additionalInfo: data.location?.additionalInfo || "",
  });
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Syrian cities and regions
  const syrianCities = [
    "Damascus",
    "Aleppo",
    "Homs",
    "Hama",
    "Latakia",
    "Tartus",
    "Daraa",
    "As-Suwayda",
    "Deir ez-Zor",
    "Al-Hasakah",
    "Raqqa",
    "Idlib",
    "Quneitra",
  ];

  const syrianRegions = [
    "Damascus Governorate",
    "Aleppo Governorate",
    "Homs Governorate",
    "Hama Governorate",
    "Latakia Governorate",
    "Tartus Governorate",
    "Daraa Governorate",
    "As-Suwayda Governorate",
    "Deir ez-Zor Governorate",
    "Al-Hasakah Governorate",
    "Raqqa Governorate",
    "Idlib Governorate",
    "Quneitra Governorate",
  ];

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (!location.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!location.region.trim()) {
      newErrors.region = "Region is required";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [location]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocation({
      ...location,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid) {
      onUpdate({ location });
      onNext();
    }
  };

  return (
    <div className="location-details">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Where is the service needed?</h2>
          <p className="section-description">
            Please provide the location where you need the service to be
            performed.
          </p>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <select
                id="city"
                name="city"
                value={location.city}
                onChange={handleChange}
                className={errors.city ? "error" : ""}
                style={{ appearance: "none", padding: "0.5rem" }}
              >
                <option value="">Select a city</option>
                {syrianCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div className="error-message">{errors.city}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="region">Region *</label>
              <select
                id="region"
                name="region"
                value={location.region}
                onChange={handleChange}
                className={errors.region ? "error" : ""}
                style={{ appearance: "none", padding: "0.5rem" }}
              >
                <option value="">Select a region</option>
                {syrianRegions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              {errors.region && (
                <div className="error-message">{errors.region}</div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="additionalInfo">
              Additional Location Information
            </label>
            <textarea
              id="additionalInfo"
              name="additionalInfo"
              value={location.additionalInfo}
              onChange={handleChange}
              placeholder="Building, floor, or any details to help find the location..."
              rows="3"
            ></textarea>
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
            Next: Schedule
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationDetails;
