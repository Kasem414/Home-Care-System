import React, { useState, useEffect } from "react";
import "../../../styles/components/requests/LocationDetails.css";
import syrianLocations from "../../../data/syrianLocations.json";

const LocationDetails = ({ data, onUpdate, onNext, onBack }) => {
  const [locationData, setLocationData] = useState({
    city: data.city || "",
    region: data.region || "",
    additional_info: data.additional_info || "",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState({
    city: false,
    region: false,
  });

  const [availableRegions, setAvailableRegions] = useState([]);

  // Update available regions when city changes
  useEffect(() => {
    if (locationData.city) {
      const cityData = syrianLocations.cities.find(
        (c) => c.name === locationData.city
      );
      if (cityData) {
        setAvailableRegions(cityData.regions);
        // Reset region if it's not in the new list of regions
        if (!cityData.regions.some((r) => r.name === locationData.region)) {
          setLocationData((prev) => ({ ...prev, region: "" }));
        }
      }
    } else {
      setAvailableRegions([]);
    }
  }, [locationData.city]);

  // Validate form
  useEffect(() => {
    const newErrors = {};

    if (touched.city && !locationData.city) {
      newErrors.city = "Please select a city";
    }
    if (touched.region && !locationData.region) {
      newErrors.region = "Please select a region";
    }

    setErrors(newErrors);
    setIsValid(locationData.city && locationData.region);
  }, [locationData, touched]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setLocationData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({
      city: true,
      region: true,
    });

    if (isValid) {
      onUpdate(locationData);
      onNext();
    }
  };

  return (
    <div className="location-details">
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Location Details</h2>

          <div className="form-group">
            <label htmlFor="city">City *</label>
            <select
              id="city"
              name="city"
              value={locationData.city}
              onChange={handleChange}
              className={errors.city ? "error" : ""}
            >
              <option value="">Select a city</option>
              {syrianLocations.cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="region">Region *</label>
            <select
              id="region"
              name="region"
              value={locationData.region}
              onChange={handleChange}
              className={errors.region ? "error" : ""}
              disabled={!locationData.city}
            >
              <option value="">Select a region</option>
              {availableRegions.map((region) => (
                <option key={region.id} value={region.name}>
                  {region.name}
                </option>
              ))}
            </select>
            {errors.region && (
              <div className="error-message">{errors.region}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="additional_info">
              Additional Location Information
            </label>
            <textarea
              id="additional_info"
              name="additional_info"
              value={locationData.additional_info}
              onChange={handleChange}
              placeholder="Enter any additional location details that might help the service provider..."
              rows="4"
            />
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
