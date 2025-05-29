import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";

// Available service categories
const serviceCategories = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "cleaning", label: "Cleaning" },
  { value: "painting", label: "Painting" },
  { value: "gardening", label: "Gardening" },
  { value: "carpentry", label: "Carpentry" },
  { value: "hvac", label: "HVAC" },
  { value: "roofing", label: "Roofing" },
  { value: "flooring", label: "Flooring" },
];

// Available regions
const availableRegions = [
  "Damascus Governorate",
  "Aleppo Governorate",
  "Homs Governorate",
  "Latakia Governorate",
  "Hama Governorate",
  "Tartus Governorate",
  "Deir ez-Zor Governorate",
  "Al-Hasakah Governorate",
  "Raqqa Governorate",
  "Daraa Governorate",
  "Idlib Governorate",
  "Quneitra Governorate",
  "As-Suwayda Governorate",
];

const ProviderAccountSettings = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Form state for basic profile
  const [basicProfileData, setBasicProfileData] = useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    region: "",
    bio: "",
  });

  // Form state for services
  const [servicesData, setServicesData] = useState({
    serviceCategories: [],
    serviceRegions: [],
    yearsInBusiness: "",
    employeeCount: "",
  });

  // Form state for availability
  const [availabilityData, setAvailabilityData] = useState({
    monday: { available: false, from: "09:00", to: "17:00" },
    tuesday: { available: false, from: "09:00", to: "17:00" },
    wednesday: { available: false, from: "09:00", to: "17:00" },
    thursday: { available: false, from: "09:00", to: "17:00" },
    friday: { available: false, from: "09:00", to: "17:00" },
    saturday: { available: false, from: "09:00", to: "17:00" },
    sunday: { available: false, from: "09:00", to: "17:00" },
  });

  // Form state for security
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (user && user.role === "provider") {
      // Get provider profile from API if available
      // For now, using the user data directly
      const providerProfile = user.provider_profile || {};

      // Parse availability if it's stored as comma-separated string
      let parsedAvailability = availabilityData;
      if (user.availability && typeof user.availability === "string") {
        const availabilityItems = user.availability.split(",");
        availabilityItems.forEach((item) => {
          const [day, time] = item.split(":");
          if (day && time) {
            const [from, to] = time.trim().split("-");
            if (from && to && parsedAvailability[day.trim().toLowerCase()]) {
              parsedAvailability[day.trim().toLowerCase()] = {
                available: true,
                from: from.trim(),
                to: to.trim(),
              };
            }
          }
        });
      }

      // Parse service categories if stored as comma-separated string
      let parsedCategories = [];
      if (
        providerProfile.serviceCategories &&
        typeof providerProfile.serviceCategories === "string"
      ) {
        parsedCategories = providerProfile.serviceCategories
          .split(",")
          .map((c) => c.trim());
      } else if (Array.isArray(providerProfile.serviceCategories)) {
        parsedCategories = providerProfile.serviceCategories;
      }

      // Parse service regions if stored as comma-separated string
      let parsedRegions = [];
      if (
        providerProfile.serviceRegions &&
        typeof providerProfile.serviceRegions === "string"
      ) {
        parsedRegions = providerProfile.serviceRegions
          .split(",")
          .map((r) => r.trim());
      } else if (Array.isArray(providerProfile.serviceRegions)) {
        parsedRegions = providerProfile.serviceRegions;
      }

      // Basic profile data
      setBasicProfileData({
        companyName: providerProfile.companyName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
        region: user.region || "",
        bio: providerProfile.bio || "",
      });

      // Services data
      setServicesData({
        serviceCategories: parsedCategories,
        serviceRegions: parsedRegions,
        yearsInBusiness: providerProfile.yearsInBusiness || "",
        employeeCount: providerProfile.employeeCount || "",
      });

      // Availability data
      setAvailabilityData(parsedAvailability);
    }
  }, [user]);

  // Handle basic profile field changes
  const handleBasicProfileChange = (e) => {
    const { name, value } = e.target;
    setBasicProfileData({
      ...basicProfileData,
      [name]: value,
    });
  };

  // Handle security field changes
  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData({
      ...securityData,
      [name]: value,
    });
  };

  // Handle service category selection
  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setServicesData({
        ...servicesData,
        serviceCategories: [...servicesData.serviceCategories, value],
      });
    } else {
      setServicesData({
        ...servicesData,
        serviceCategories: servicesData.serviceCategories.filter(
          (category) => category !== value
        ),
      });
    }
  };

  // Handle service region selection
  const handleRegionChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setServicesData({
        ...servicesData,
        serviceRegions: [...servicesData.serviceRegions, value],
      });
    } else {
      setServicesData({
        ...servicesData,
        serviceRegions: servicesData.serviceRegions.filter(
          (region) => region !== value
        ),
      });
    }
  };

  // Handle other service data changes
  const handleServiceDataChange = (e) => {
    const { name, value } = e.target;
    setServicesData({
      ...servicesData,
      [name]: value,
    });
  };

  // Handle availability change
  const handleAvailabilityChange = (day, field, value) => {
    setAvailabilityData({
      ...availabilityData,
      [day]: {
        ...availabilityData[day],
        [field]:
          field === "available" ? !availabilityData[day].available : value,
      },
    });
  };

  // Handle basic profile update
  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use the context function to update profile
      const result = await updateProfile({
        ...basicProfileData,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your profile has been successfully updated!",
        });
        toast.success("Profile updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
      toast.error(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Handle services update
  const handleServicesUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use the context function to update services
      const result = await updateProfile({
        ...servicesData,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your services have been successfully updated!",
        });
        toast.success("Services updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update services");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update services. Please try again.",
      });
      toast.error(error.message || "Failed to update services");
    } finally {
      setLoading(false);
    }
  };

  // Handle availability update
  const handleAvailabilityUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Convert availability to array format for API
      const availabilityArray = [];
      Object.entries(availabilityData).forEach(([day, value]) => {
        if (value.available) {
          availabilityArray.push(`${day}: ${value.from}-${value.to}`);
        }
      });

      // Use the context function to update availability
      const result = await updateProfile({
        availability: availabilityArray,
      });

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your availability has been successfully updated!",
        });
        toast.success("Availability updated successfully!");
      } else {
        throw new Error(result.error || "Failed to update availability");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message || "Failed to update availability. Please try again.",
      });
      toast.error(error.message || "Failed to update availability");
    } finally {
      setLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Password validation
    if (securityData.newPassword !== securityData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    if (securityData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      toast.error("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // Use the context function to change password
      const result = await changePassword(
        securityData.currentPassword,
        securityData.newPassword
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your password has been successfully changed!",
        });
        toast.success("Password changed successfully!");
        setSecurityData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        throw new Error(result.error || "Failed to change password");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to change password. Please try again.",
      });
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const result = await deleteAccount();

      if (result.success) {
        toast.success("Account successfully deleted");
        navigate("/");
      } else {
        throw new Error(result.error || "Failed to delete account");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete account. Please try again.",
      });
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
      setShowDeleteConfirmation(false);
    }
  };

  if (!user || user.role !== "provider") {
    return (
      <div className="account-settings">
        <div className="account-settings-container">
          <h1 className="page-title">Provider Account Settings</h1>
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> You must be logged in
            as a service provider to view this page
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-settings provider-settings">
      <div className="account-settings-container">
        <h1 className="page-title">Provider Account Settings</h1>

        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="settings-tabs">
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            Services
          </button>
          <button
            className={`tab-btn ${
              activeTab === "availability" ? "active" : ""
            }`}
            onClick={() => setActiveTab("availability")}
          >
            Availability
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            Security
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="settings-section">
            <h2>Basic Information</h2>
            <form onSubmit={handleBasicProfileUpdate}>
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={basicProfileData.companyName}
                  onChange={handleBasicProfileChange}
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
                    value={basicProfileData.firstName}
                    onChange={handleBasicProfileChange}
                    required
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={basicProfileData.lastName}
                    onChange={handleBasicProfileChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={basicProfileData.email}
                  onChange={handleBasicProfileChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={basicProfileData.phone}
                  onChange={handleBasicProfileChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={basicProfileData.city}
                    onChange={handleBasicProfileChange}
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="region">Region</label>
                  <input
                    type="text"
                    id="region"
                    name="region"
                    value={basicProfileData.region}
                    onChange={handleBasicProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio / About</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={basicProfileData.bio}
                  onChange={handleBasicProfileChange}
                  rows="4"
                ></textarea>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "services" && (
          <div className="settings-section">
            <h2>Services Information</h2>
            <form onSubmit={handleServicesUpdate}>
              <div className="form-group">
                <label>Service Categories</label>
                <div className="checkbox-group">
                  {serviceCategories.map((category) => (
                    <div className="checkbox-item" key={category.value}>
                      <input
                        type="checkbox"
                        id={`category-${category.value}`}
                        value={category.value}
                        checked={servicesData.serviceCategories.includes(
                          category.value
                        )}
                        onChange={handleCategoryChange}
                      />
                      <label htmlFor={`category-${category.value}`}>
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Service Regions</label>
                <div className="checkbox-group">
                  {availableRegions.map((region) => (
                    <div className="checkbox-item" key={region}>
                      <input
                        type="checkbox"
                        id={`region-${region}`}
                        value={region}
                        checked={servicesData.serviceRegions.includes(region)}
                        onChange={handleRegionChange}
                      />
                      <label htmlFor={`region-${region}`}>{region}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="yearsInBusiness">Years in Business</label>
                  <input
                    type="text"
                    id="yearsInBusiness"
                    name="yearsInBusiness"
                    value={servicesData.yearsInBusiness}
                    onChange={handleServiceDataChange}
                  />
                </div>
                <div className="form-group half">
                  <label htmlFor="employeeCount">Number of Employees</label>
                  <input
                    type="text"
                    id="employeeCount"
                    name="employeeCount"
                    value={servicesData.employeeCount}
                    onChange={handleServiceDataChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Services"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="settings-section">
            <h2>Availability</h2>
            <form onSubmit={handleAvailabilityUpdate}>
              <div className="availability-grid">
                {Object.entries(availabilityData).map(([day, data]) => (
                  <div className="availability-day" key={day}>
                    <div className="day-header">
                      <input
                        type="checkbox"
                        id={`available-${day}`}
                        checked={data.available}
                        onChange={() =>
                          handleAvailabilityChange(day, "available")
                        }
                      />
                      <label htmlFor={`available-${day}`}>
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </label>
                    </div>

                    {data.available && (
                      <div className="time-range">
                        <div className="time-input">
                          <label htmlFor={`from-${day}`}>From</label>
                          <input
                            type="time"
                            id={`from-${day}`}
                            value={data.from}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                day,
                                "from",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="time-input">
                          <label htmlFor={`to-${day}`}>To</label>
                          <input
                            type="time"
                            id={`to-${day}`}
                            value={data.to}
                            onChange={(e) =>
                              handleAvailabilityChange(
                                day,
                                "to",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Availability"}
              </button>
            </form>
          </div>
        )}

        {activeTab === "security" && (
          <div className="settings-section">
            <h2>Security Settings</h2>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={securityData.currentPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={securityData.newPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={securityData.confirmPassword}
                  onChange={handleSecurityChange}
                  required
                />
              </div>

              <button
                type="submit"
                className={`btn btn-primary ${loading ? "loading" : ""}`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>

            <div className="danger-zone">
              <h2>Delete Account</h2>
              <p>
                This action cannot be undone. All of your data will be
                permanently removed.
              </p>

              {!showDeleteConfirmation ? (
                <button
                  className="btn btn-danger"
                  onClick={() => setShowDeleteConfirmation(true)}
                >
                  Delete Account
                </button>
              ) : (
                <div className="delete-confirmation">
                  <p>Are you sure you want to delete your account?</p>
                  <div className="button-group">
                    <button
                      className="btn btn-outline"
                      onClick={() => setShowDeleteConfirmation(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={`btn btn-danger ${loading ? "loading" : ""}`}
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Confirm Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderAccountSettings;
