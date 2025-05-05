import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

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

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load user data when component mounts
  useEffect(() => {
    if (userData) {
      setFormData({
        ...formData,
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
      });
    }
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
      // Mock successful update if no real user
      if (!user) {
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
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
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
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setMessage({
        type: "error",
        text: "Password must be at least 8 characters long.",
      });
      setLoading(false);
      return;
    }

    try {
      // Mock successful password change if no real user
      if (!user) {
        setTimeout(() => {
          setMessage({
            type: "success",
            text: "Your password has been successfully changed! (Development Mode)",
          });
          setFormData({
            ...formData,
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
        formData.currentPassword,
        formData.newPassword
      );

      if (result.success) {
        setMessage({
          type: "success",
          text: "Your password has been successfully changed!",
        });
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
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      // Mock successful account deletion if no real user
      if (!user) {
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
    <div className="account-settings">
      <div className="account-settings-container">
        <h1 className="page-title">Account Settings</h1>

        {!user && (
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i> Development Mode: Using mock
            data for testing
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

        <div className="settings-section">
          <h2>Profile Information</h2>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
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

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
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
                minLength="8"
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
                Are you sure you want to delete your account? All your data will
                be permanently removed.
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
      </div>
    </div>
  );
};

export default AccountSettings;
