import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { userProfileService } from "../../services/api";
import syrianLocations from "../../data/syrianLocations.json";

// Mock user data for testing without authentication
const mockUser = {
  id: "test123",
  name: "Test User",
  email: "test@example.com",
  phone: "555-123-4567",
  address: "123 Test Street, Test City, 12345",
  role: "client",
};

const AccountSettings = () => {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Use actual user data or mock data if no user is authenticated
  const userData = user || mockUser;

  // Form state for profile information
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    region: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Add state for city/region options
  const [cityOptions] = useState(syrianLocations.cities);
  const [regionOptions, setRegionOptions] = useState([]);

  // Update region options when city changes
  useEffect(() => {
    const selectedCity = cityOptions.find((c) => c.name === formData.city);
    setRegionOptions(selectedCity ? selectedCity.regions : []);
    // If the current region is not in the new city, clear it
    if (
      formData.region &&
      selectedCity &&
      !selectedCity.regions.some((r) => r.name === formData.region)
    ) {
      setFormData((f) => ({ ...f, region: "" }));
    }
  }, [formData.city, cityOptions]);

  // Load user data when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      if (userData && userData.id && userData.role === "customer") {
        try {
          const profile = await userProfileService.getProfile(userData.id);
          setFormData({
            ...formData,
            firstName: profile.firstName || "",
            lastName: profile.lastName || "",
            email: profile.email || "",
            phone: profile.phone || "",
            city: profile.city || "",
            region: profile.region || "",
          });
        } catch (error) {
          // fallback to local userData if API fails
          setFormData({
            ...formData,
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            email: userData.email || "",
            phone: userData.phone || "",
            city: userData.city || "",
            region: userData.region || "",
          });
        }
      } else {
        setFormData({
          ...formData,
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          city: userData.city || "",
          region: userData.region || "",
        });
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Use the context function to update profile
      const profileData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        region: formData.region,
      };

      const result = await updateProfile(profileData);

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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Password validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "New passwords do not match.",
      });
      toast.error("New passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
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
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your password has been successfully changed!",
        });
        toast.success("Password changed successfully!");
        setFormData({
          ...formData,
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
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="account-settings">
        <div className="account-settings-container">
          <h1 className="page-title">Account Settings</h1>
          <div className="alert alert-error">
            <i className="fas fa-exclamation-circle"></i> You must be logged in
            to view this page
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-settings">
      <div className="account-settings-container">
        <h1 className="page-title">Account Settings</h1>

        {message.text && (
          <div
            className={`alert ${
              message.type === "success" ? "alert-success" : "alert-error"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="settings-section">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group half">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group half">
                <label htmlFor="region">Region</label>
                <select
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  disabled={!formData.city}
                >
                  <option value="">Select Region</option>
                  {/* Always show the current region if not in the options */}
                  {formData.region &&
                    !regionOptions.some((r) => r.name === formData.region) && (
                      <option value={formData.region}>
                        {formData.region} (not in list)
                      </option>
                    )}
                  {regionOptions.map((region) => (
                    <option key={region.id} value={region.name}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
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

        <div className="settings-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
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
        </div>

        <div className="settings-section danger-zone">
          <h2>Delete Account</h2>
          <p>
            This action cannot be undone. All of your data will be permanently
            removed.
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
    </div>
  );
};

export default AccountSettings;
