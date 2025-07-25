import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import Select from "react-select";
import syrianLocations from "../../data/syrianLocations.json";

const Register = () => {
  const [activeTab, setActiveTab] = useState("homeowner");
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { registerHomeowner, registerServiceProvider } = useAuth();

  // Homeowner form state
  const [homeownerForm, setHomeownerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    region: "",
    password: "",
    confirmPassword: "",
  });

  // Service provider form state
  const [providerForm, setProviderForm] = useState({
    // Step 1: Basic info
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Step 2: Business details
    city: "",
    region: "",

    // Step 3: Service details
    serviceCategories: [],
    serviceRegions: [],
    yearsInBusiness: "",
    employeeCount: "",
    licenses: [],

    // Step 4: Profile setup
    bio: "",
    hourlyRate: "",
    availability: {
      monday: { available: false, from: "09:00", to: "17:00" },
      tuesday: { available: false, from: "09:00", to: "17:00" },
      wednesday: { available: false, from: "09:00", to: "17:00" },
      thursday: { available: false, from: "09:00", to: "17:00" },
      friday: { available: false, from: "09:00", to: "17:00" },
      saturday: { available: false, from: "09:00", to: "17:00" },
      sunday: { available: false, from: "09:00", to: "17:00" },
    },
    profileImage: null,
    portfolioImages: [],
  });

  // Service categories options
  const serviceCategories = [
    { id: "plumbing", name: "Plumbing" },
    { id: "electrical", name: "Electrical" },
    { id: "cleaning", name: "Cleaning" },
    { id: "painting", name: "Painting" },
    { id: "gardening", name: "Gardening" },
    { id: "carpentry", name: "Carpentry" },
    { id: "hvac", name: "HVAC" },
    { id: "roofing", name: "Roofing" },
    { id: "flooring", name: "Flooring" },
  ];

  // Replace the static arrays with data from JSON
  const cities = syrianLocations.cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  // Function to get regions for a selected city
  const getRegionsForCity = (cityId) => {
    const city = syrianLocations.cities.find((c) => c.id === cityId);
    return city
      ? city.regions.map((region) => ({
          value: region.id,
          label: region.name,
        }))
      : [];
  };

  // State to store available regions based on selected city
  const [availableRegions, setAvailableRegions] = useState([]);

  // Update city selection handler for homeowner
  const handleHomeownerChange = (e) => {
    const { name, value } = e.target;
    if (name === "city") {
      const cityData = syrianLocations.cities.find((c) => c.id === value);
      setHomeownerForm({
        ...homeownerForm,
        city: value,
        region: "", // Reset region when city changes
      });
      setAvailableRegions(cityData ? cityData.regions : []);
    } else {
      setHomeownerForm({
        ...homeownerForm,
        [name]: value,
      });
    }
  };

  // Update city selection handler for provider
  const handleProviderChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "city") {
      const cityData = syrianLocations.cities.find((c) => c.id === value);
      setProviderForm({
        ...providerForm,
        city: value,
        region: "", // Reset region when city changes
      });
      setAvailableRegions(cityData ? cityData.regions : []);
    } else {
      setProviderForm({
        ...providerForm,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  // Handle service category selection
  const handleCategoryChange = (categoryId) => {
    const updatedCategories = [...providerForm.serviceCategories];
    if (updatedCategories.includes(categoryId)) {
      // Remove category if already selected
      const index = updatedCategories.indexOf(categoryId);
      updatedCategories.splice(index, 1);
    } else {
      // Add category if not selected
      updatedCategories.push(categoryId);
    }

    setProviderForm({
      ...providerForm,
      serviceCategories: updatedCategories,
    });
  };

  // Handle service region selection with react-select
  const handleServiceRegionChange = (selectedOptions) => {
    setProviderForm({
      ...providerForm,
      serviceRegions: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    });
  };

  // Handle availability change
  const handleAvailabilityChange = (day, field, value) => {
    setProviderForm({
      ...providerForm,
      availability: {
        ...providerForm.availability,
        [day]: {
          ...providerForm.availability[day],
          [field]:
            field === "available"
              ? !providerForm.availability[day].available
              : value,
        },
      },
    });
  };

  // Add this function at the top level of your component
  const validatePasswords = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  // Update handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Starting registration process...");
      let result;

      if (activeTab === "homeowner") {
        // Validate passwords
        const passwordError = validatePasswords(
          homeownerForm.password,
          homeownerForm.confirmPassword
        );
        if (passwordError) {
          setError(passwordError);
          toast.error(passwordError);
          setIsLoading(false);
          return;
        }

        console.log("Submitting homeowner registration:", homeownerForm);
        result = await registerHomeowner(homeownerForm, (path) => {
          console.log("Navigation callback called with path:", path);
          navigate(path);
          toast.success("Registration and login successful!");
        });
      } else {
        // Validate passwords
        const passwordError = validatePasswords(
          providerForm.password,
          providerForm.confirmPassword
        );
        if (passwordError) {
          setError(passwordError);
          toast.error(passwordError);
          setIsLoading(false);
          return;
        }

        // Format availability data as array of strings
        const availabilityArray = Object.entries(providerForm.availability)
          .filter(([_, value]) => value.available)
          .map(([day, value]) => `${day}:${value.from}-${value.to}`);

        const providerData = {
          companyName: providerForm.companyName,
          firstName: providerForm.firstName,
          lastName: providerForm.lastName,
          email: providerForm.email,
          phone: providerForm.phone,
          password: providerForm.password,
          city: providerForm.city,
          region: providerForm.region,
          serviceCategories: providerForm.serviceCategories,
          serviceRegions: providerForm.serviceRegions,
          yearsInBusiness: providerForm.yearsInBusiness,
          employeeCount: providerForm.employeeCount,
          bio: providerForm.bio,
          availability: availabilityArray,
        };

        console.log(
          "Submitting provider registration with formatted data:",
          providerData
        );
        result = await registerServiceProvider(providerData, (path) => {
          console.log("Navigation callback called with path:", path);
          navigate(path);
          toast.success("Registration and login successful!");
        });
      }

      console.log("Registration result:", result);

      if (result.success) {
        console.log("Registration successful");
      } else {
        console.log("Registration failed:", result.error);
        setError(result.error || "Registration failed. Please try again.");
        toast.error(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Unexpected registration error:", err);
      setError("An unexpected error occurred. Please try again later.");
      toast.error("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Go to next step in provider registration
  const goToNextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  // Go to previous step in provider registration
  const goToPreviousStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Render homeowner registration form
  const renderHomeownerForm = () => {
    return (
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={homeownerForm.firstName}
              onChange={handleHomeownerChange}
              placeholder="John"
              required
            />
          </div>
          <div className="form-group half">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={homeownerForm.lastName}
              onChange={handleHomeownerChange}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={homeownerForm.email}
              onChange={handleHomeownerChange}
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={homeownerForm.phone}
              onChange={handleHomeownerChange}
              placeholder="(123) 456-7890"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={homeownerForm.city}
            onChange={handleHomeownerChange}
            required
          >
            <option value="">Select your city</option>
            {syrianLocations.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={homeownerForm.region}
            onChange={handleHomeownerChange}
            required
            disabled={!homeownerForm.city}
          >
            <option value="">Select your region</option>
            {homeownerForm.city &&
              getRegionsForCity(homeownerForm.city).map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              id="password"
              name="password"
              value={homeownerForm.password}
              onChange={handleHomeownerChange}
              placeholder="Create a password"
              required
            />
          </div>
          <small className="form-text">
            Password must be at least 8 characters long
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={homeownerForm.confirmPassword}
              onChange={handleHomeownerChange}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="form-check">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </label>
        </div>

        <button
          type="submit"
          className={`auth-btn ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              <span>Registering...</span>
            </>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
    );
  };

  // Render provider registration step 1
  const renderProviderStep1 = () => {
    return (
      <div className="step-form">
        <div className="step-header">
          <h3>Basic Information</h3>
          <p>Let's start with your basic details</p>
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company/Business Name</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={providerForm.companyName}
            onChange={handleProviderChange}
            placeholder="Your business name"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={providerForm.firstName}
              onChange={handleProviderChange}
              placeholder="John"
              required
            />
          </div>
          <div className="form-group half">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={providerForm.lastName}
              onChange={handleProviderChange}
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input
              type="email"
              id="email"
              name="email"
              value={providerForm.email}
              onChange={handleProviderChange}
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={providerForm.phone}
              onChange={handleProviderChange}
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              id="password"
              name="password"
              value={providerForm.password}
              onChange={handleProviderChange}
              placeholder="Create a password"
              required
            />
          </div>
          <small className="form-text">
            Password must be at least 8 characters long
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={providerForm.confirmPassword}
              onChange={handleProviderChange}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-next" onClick={goToNextStep}>
            Next Step
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  };

  // Render provider registration step 2
  const renderProviderStep2 = () => {
    return (
      <div className="step-form">
        <div className="step-header">
          <h3>Business Details</h3>
          <p>Tell us more about your business</p>
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <select
            id="city"
            name="city"
            value={providerForm.city}
            onChange={handleProviderChange}
            required
          >
            <option value="">Select your city</option>
            {syrianLocations.cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="region">Region</label>
          <select
            id="region"
            name="region"
            value={providerForm.region}
            onChange={handleProviderChange}
            required
            disabled={!providerForm.city}
          >
            <option value="">Select your region</option>
            {providerForm.city &&
              getRegionsForCity(providerForm.city).map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-prev" onClick={goToPreviousStep}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
          <button type="button" className="btn-next" onClick={goToNextStep}>
            Next Step
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  };

  // Render provider registration step 3
  const renderProviderStep3 = () => {
    // Create all regions options from all cities
    const allRegionsOptions = syrianLocations.cities.flatMap((city) =>
      city.regions.map((region) => ({
        value: `${city.id}-${region.id}`,
        label: `${region.name} (${city.name})`,
        labelAr: `${region.nameAr} (${city.nameAr})`,
      }))
    );

    return (
      <div className="step-form">
        <div className="step-header">
          <h3>Service Details</h3>
          <p>Let's specify what services you offer</p>
        </div>

        <div className="form-group">
          <label>Service Categories</label>
          <div className="category-grid">
            {serviceCategories.map((category) => (
              <div
                key={category.id}
                className={`category-item ${
                  providerForm.serviceCategories.includes(category.id)
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <div className="category-check">
                  {providerForm.serviceCategories.includes(category.id) && (
                    <i className="fas fa-check"></i>
                  )}
                </div>
                <span>{category.name}</span>
              </div>
            ))}
          </div>
          <small className="form-text">Select all that apply</small>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="yearsInBusiness">Years in Business</label>
            <select
              id="yearsInBusiness"
              name="yearsInBusiness"
              value={providerForm.yearsInBusiness}
              onChange={handleProviderChange}
              required
            >
              <option value="">Select experience</option>
              <option value="less-than-1">Less than 1 year</option>
              <option value="1-2">1-2 years</option>
              <option value="3-5">3-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="more-than-10">More than 10 years</option>
            </select>
          </div>
          <div className="form-group half">
            <label htmlFor="employeeCount">Number of Employees</label>
            <select
              id="employeeCount"
              name="employeeCount"
              value={providerForm.employeeCount}
              onChange={handleProviderChange}
              required
            >
              <option value="">Select size</option>
              <option value="just-me">Just me</option>
              <option value="2-5">2-5 employees</option>
              <option value="6-10">6-10 employees</option>
              <option value="11-20">11-20 employees</option>
              <option value="more-than-20">More than 20 employees</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Service Regions</label>
          <Select
            isMulti
            name="serviceRegions"
            options={allRegionsOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            value={allRegionsOptions.filter((option) =>
              providerForm.serviceRegions.includes(option.value)
            )}
            onChange={(selected) => {
              setProviderForm({
                ...providerForm,
                serviceRegions: selected
                  ? selected.map((option) => option.value)
                  : [],
              });
            }}
            placeholder="Select regions where you provide services..."
            noOptionsMessage={() => "No regions found"}
            closeMenuOnSelect={false}
          />
          <small className="form-text">
            Select all regions where you provide services
          </small>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-prev" onClick={goToPreviousStep}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
          <button type="button" className="btn-next" onClick={goToNextStep}>
            Next Step
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    );
  };

  // Render provider registration step 4
  const renderProviderStep4 = () => {
    return (
      <div className="step-form">
        <div className="step-header">
          <h3>Profile Setup</h3>
          <p>Final details to complete your profile</p>
        </div>

        <div className="form-group">
          <label htmlFor="bio">Professional Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={providerForm.bio}
            onChange={handleProviderChange}
            placeholder="Tell potential clients about your experience, expertise, and approach..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hourlyRate">Hourly Rate ($)</label>
          <div className="input-icon-wrapper">
            <i className="fas fa-dollar-sign input-icon"></i>
            <input
              type="number"
              id="hourlyRate"
              name="hourlyRate"
              value={providerForm.hourlyRate}
              onChange={handleProviderChange}
              placeholder="Your hourly rate"
              min="0"
              required
            />
          </div>
          <small className="form-text">
            Enter 0 if you prefer to provide custom quotes
          </small>
        </div>

        <div className="form-group">
          <label>Availability Schedule</label>
          <div className="availability-container">
            {Object.keys(providerForm.availability).map((day) => (
              <div className="availability-day" key={day}>
                <div className="day-header">
                  <input
                    type="checkbox"
                    id={`available-${day}`}
                    checked={providerForm.availability[day].available}
                    onChange={() => handleAvailabilityChange(day, "available")}
                  />
                  <label htmlFor={`available-${day}`}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                </div>
                {providerForm.availability[day].available && (
                  <div className="time-range">
                    <div className="time-input">
                      <label>From</label>
                      <input
                        type="time"
                        value={providerForm.availability[day].from}
                        onChange={(e) =>
                          handleAvailabilityChange(day, "from", e.target.value)
                        }
                      />
                    </div>
                    <div className="time-input">
                      <label>To</label>
                      <input
                        type="time"
                        value={providerForm.availability[day].to}
                        onChange={(e) =>
                          handleAvailabilityChange(day, "to", e.target.value)
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <small className="form-text">
            Set your weekly availability schedule
          </small>
        </div>

        <div className="form-group">
          <label>Portfolio Images (Optional)</label>
          <div className="file-upload">
            <i className="fas fa-cloud-upload-alt"></i>
            <span>Drag & drop images or click to browse</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => console.log("File upload:", e.target.files)}
            />
          </div>
          <small className="form-text">
            You can add up to 5 images of your past work
          </small>
        </div>

        <div className="form-check">
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">
            I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-prev" onClick={goToPreviousStep}>
            <i className="fas fa-arrow-left"></i>
            Previous
          </button>
          <button
            type="submit"
            className={`auth-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Creating Account...</span>
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Render provider registration steps
  const renderProviderForm = () => {
    return (
      <form className="auth-form multi-step-form">
        <div className="step-indicator">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`step ${stepNumber === step ? "active" : ""} ${
                stepNumber < step ? "completed" : ""
              }`}
            >
              <div className="step-number">
                {stepNumber < step ? (
                  <i className="fas fa-check"></i>
                ) : (
                  stepNumber
                )}
              </div>
              <div className="step-label">
                {stepNumber === 1 && "Basic Info"}
                {stepNumber === 2 && "Business Details"}
                {stepNumber === 3 && "Services"}
                {stepNumber === 4 && "Profile"}
              </div>
            </div>
          ))}
        </div>

        {step === 1 && renderProviderStep1()}
        {step === 2 && renderProviderStep2()}
        {step === 3 && renderProviderStep3()}
        {step === 4 && renderProviderStep4()}
      </form>
    );
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${activeTab === "provider" ? "wide" : ""}`}>
        <div className="auth-header">
          <h2 className="auth-title">Create Your Account</h2>
          <p className="auth-subtitle">Join HomeCare Pro today</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "homeowner" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("homeowner");
              setStep(1);
              setError("");
            }}
          >
            I'm a Homeowner
          </button>
          <button
            className={`auth-tab ${activeTab === "provider" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("provider");
              setStep(1);
              setError("");
            }}
          >
            I'm a Service Provider
          </button>
        </div>

        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {activeTab === "homeowner"
          ? renderHomeownerForm()
          : renderProviderForm()}

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
