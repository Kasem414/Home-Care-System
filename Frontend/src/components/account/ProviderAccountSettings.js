import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Mock provider user data for testing without authentication
const mockProviderUser = {
  id: "provider123",
  name: "Provider Test User",
  email: "provider@example.com",
  phone: "555-123-4567",
  address: "123 Provider Street, Test City, 12345",
  role: "provider",
  bio: "Experienced professional with 5+ years in home care services.",
  services: ["Cleaning", "Gardening", "Home Repair"],
  qualifications: ["Certified Cleaner", "First Aid Certified"],
  hourlyRate: 35,
  availability: {
    monday: { available: true, from: "09:00", to: "17:00" },
    tuesday: { available: true, from: "09:00", to: "17:00" },
    wednesday: { available: true, from: "09:00", to: "17:00" },
    thursday: { available: true, from: "09:00", to: "17:00" },
    friday: { available: true, from: "09:00", to: "17:00" },
    saturday: { available: false, from: "", to: "" },
    sunday: { available: false, from: "", to: "" },
  },
};

// Available service categories
const serviceCategories = [
  { value: "Cleaning", label: "Cleaning" },
  { value: "Gardening", label: "Gardening" },
  { value: "Home Repair", label: "Home Repair" },
  { value: "Electrical", label: "Electrical" },
  { value: "Plumbing", label: "Plumbing" },
  { value: "Painting", label: "Painting" },
  { value: "Meal Preparation", label: "Meal Preparation" },
];

const ProviderAccountSettings = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Use actual user data or mock data if no user is authenticated
  const userData = user?.role === "provider" ? user : mockProviderUser;

  // Form state for basic profile
  const [basicProfileData, setBasicProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  // Form state for services
  const [servicesData, setServicesData] = useState({
    services: [],
    qualifications: [],
    hourlyRate: 0,
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
    if (userData) {
      // Basic profile data
      setBasicProfileData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        bio: userData.bio || "",
      });

      // Services data
      setServicesData({
        services: userData.services || [],
        qualifications: userData.qualifications || [],
        hourlyRate: userData.hourlyRate || 0,
      });

      // Availability data
      if (userData.availability) {
        setAvailabilityData(userData.availability);
      }
    }
  }, [userData]);

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

  // Handle service selection
  const handleServiceChange = (e) => {
    const { value, checked } = e.target;

    if (checked) {
      setServicesData({
        ...servicesData,
        services: [...servicesData.services, value],
      });
    } else {
      setServicesData({
        ...servicesData,
        services: servicesData.services.filter((service) => service !== value),
      });
    }
  };

  // Handle qualification field
  const handleQualificationAdd = () => {
    const qualificationInput = document.getElementById("qualification-input");
    const qualification = qualificationInput.value.trim();

    if (qualification && !servicesData.qualifications.includes(qualification)) {
      setServicesData({
        ...servicesData,
        qualifications: [...servicesData.qualifications, qualification],
      });
      qualificationInput.value = "";
    }
  };

  const handleQualificationRemove = (qualification) => {
    setServicesData({
      ...servicesData,
      qualifications: servicesData.qualifications.filter(
        (q) => q !== qualification
      ),
    });
  };

  // Handle hourly rate change
  const handleRateChange = (e) => {
    setServicesData({
      ...servicesData,
      hourlyRate: parseFloat(e.target.value),
    });
  };

  // Handle availability change
  const handleAvailabilityChange = (day, field, value) => {
    setAvailabilityData({
      ...availabilityData,
      [day]: {
        ...availabilityData[day],
        [field]: field === "available" ? value : value,
      },
    });
  };

  // Handle basic profile update
  const handleBasicProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Mock successful update if no real provider user
      if (!user || user.role !== "provider") {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Your profile has been successfully updated! (Development Mode)",
          });
          setLoading(false);
        }, 1000);
        return;
      }

      // Use the context function to update profile
      const profileData = {
        ...basicProfileData,
      };

      const result = await updateProfile(profileData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your profile has been successfully updated!",
        });
      } else {
        throw new Error(result.error || "Failed to update profile");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update profile. Please try again.",
      });
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
      // Mock successful update if no real provider user
      if (!user || user.role !== "provider") {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Your services have been successfully updated! (Development Mode)",
          });
          setLoading(false);
        }, 1000);
        return;
      }

      // Use the context function to update profile with services data
      const servicesProfileData = {
        services: servicesData.services,
        qualifications: servicesData.qualifications,
        hourlyRate: servicesData.hourlyRate,
      };

      const result = await updateProfile(servicesProfileData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your services have been successfully updated!",
        });
      } else {
        throw new Error(result.error || "Failed to update services");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to update services. Please try again.",
      });
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
      // Mock successful update if no real provider user
      if (!user || user.role !== "provider") {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Your availability has been successfully updated! (Development Mode)",
          });
          setLoading(false);
        }, 1000);
        return;
      }

      // Use the context function to update profile with availability data
      const availabilityProfileData = {
        availability: availabilityData,
      };

      const result = await updateProfile(availabilityProfileData);

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your availability has been successfully updated!",
        });
      } else {
        throw new Error(result.error || "Failed to update availability");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error.message || "Failed to update availability. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
      setLoading(false);
      return;
    }

    if (securityData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      // Mock successful password change if no real provider user
      if (!user || user.role !== "provider") {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Your password has been successfully changed! (Development Mode)",
          });
          setSecurityData({
            ...securityData,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          setLoading(false);
        }, 1000);
        return;
      }

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
        setSecurityData({
          ...securityData,
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      // Mock successful account deletion if no real provider user
      if (!user || user.role !== "provider") {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Account would be deleted in production mode.",
          });
          setLoading(false);
          setShowDeleteConfirmation(false);
        }, 1000);
        return;
      }

      // Use the context function to delete account
      const result = await deleteAccount();

      if (result.success) {
        navigate("/");
      } else {
        throw new Error(result.error || "Failed to delete account");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.message || "Failed to delete account. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="account-settings provider-account-settings">
      <div className="account-settings-container">
        <h1 className="page-title">Provider Account Settings</h1>

        {(!user || user.role !== "provider") && (
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i> Development Mode: Using mock
            provider data for testing
          </div>
        )}

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
            <i className="fas fa-user"></i> Basic Profile
          </button>
          <button
            className={`tab-btn ${activeTab === "services" ? "active" : ""}`}
            onClick={() => setActiveTab("services")}
          >
            <i className="fas fa-tools"></i> Services
          </button>
          <button
            className={`tab-btn ${
              activeTab === "availability" ? "active" : ""
            }`}
            onClick={() => setActiveTab("availability")}
          >
            <i className="fas fa-calendar-alt"></i> Availability
          </button>
          <button
            className={`tab-btn ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <i className="fas fa-shield-alt"></i> Security
          </button>
        </div>

        {/* Basic Profile Tab */}
        {activeTab === "profile" && (
          <div className="settings-section">
            <h2>Basic Profile Information</h2>
            <form onSubmit={handleBasicProfileUpdate}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={basicProfileData.name}
                  onChange={handleBasicProfileChange}
                  required
                />
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

              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={basicProfileData.address}
                  onChange={handleBasicProfileChange}
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="bio">Professional Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={basicProfileData.bio}
                  onChange={handleBasicProfileChange}
                  rows="5"
                  placeholder="Describe your experience, specialties, and background..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="settings-section">
            <h2>Services & Qualifications</h2>
            <form onSubmit={handleServicesUpdate}>
              <div className="form-group">
                <label>Services You Provide</label>
                <div className="services-grid">
                  {serviceCategories.map((service) => (
                    <div className="service-checkbox" key={service.value}>
                      <input
                        type="checkbox"
                        id={`service-${service.value}`}
                        value={service.value}
                        checked={servicesData.services.includes(service.value)}
                        onChange={handleServiceChange}
                      />
                      <label htmlFor={`service-${service.value}`}>
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Qualifications & Certifications</label>
                <div className="qualification-input-container">
                  <input
                    type="text"
                    id="qualification-input"
                    placeholder="Add a qualification or certification..."
                  />
                  <button
                    type="button"
                    className="btn btn-outlined btn-sm"
                    onClick={handleQualificationAdd}
                  >
                    Add
                  </button>
                </div>

                {servicesData.qualifications.length > 0 && (
                  <div className="qualifications-list">
                    {servicesData.qualifications.map((qualification, index) => (
                      <div className="qualification-tag" key={index}>
                        <span>{qualification}</span>
                        <button
                          type="button"
                          className="remove-btn"
                          onClick={() =>
                            handleQualificationRemove(qualification)
                          }
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate (USD)</label>
                <div className="rate-input-container">
                  <span className="rate-currency">$</span>
                  <input
                    type="number"
                    id="hourlyRate"
                    min="0"
                    step="0.01"
                    value={servicesData.hourlyRate}
                    onChange={handleRateChange}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Services"}
              </button>
            </form>
          </div>
        )}

        {/* Availability Tab */}
        {activeTab === "availability" && (
          <div className="settings-section">
            <h2>Availability Schedule</h2>
            <form onSubmit={handleAvailabilityUpdate}>
              <div className="availability-container">
                {Object.keys(availabilityData).map((day) => (
                  <div className="availability-day" key={day}>
                    <div className="day-header">
                      <label htmlFor={`available-${day}`}>
                        <input
                          type="checkbox"
                          id={`available-${day}`}
                          checked={availabilityData[day].available}
                          onChange={(e) =>
                            handleAvailabilityChange(
                              day,
                              "available",
                              e.target.checked
                            )
                          }
                        />
                        <span className="day-name">
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </span>
                      </label>
                    </div>

                    {availabilityData[day].available && (
                      <div className="time-range">
                        <div className="time-input">
                          <label>From</label>
                          <input
                            type="time"
                            value={availabilityData[day].from}
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
                          <label>To</label>
                          <input
                            type="time"
                            value={availabilityData[day].to}
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
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Availability"}
              </button>
            </form>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <>
            <div className="settings-section">
              <h2>Change Password</h2>
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
                    minLength="8"
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
                    minLength="8"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Changing..." : "Change Password"}
                </button>
              </form>
            </div>

            <div className="settings-section danger-zone">
              <h2>Delete Account</h2>
              <p>
                Once you delete your account, there is no going back. Please be
                certain.
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
                  <p>
                    Are you sure you want to delete your account? All your data
                    will be permanently removed.
                  </p>
                  <div className="confirmation-buttons">
                    <button
                      className="btn btn-danger"
                      onClick={handleDeleteAccount}
                      disabled={loading}
                    >
                      {loading ? "Deleting..." : "Yes, Delete My Account"}
                    </button>
                    <button
                      className="btn btn-outlined"
                      onClick={() => setShowDeleteConfirmation(false)}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderAccountSettings;
