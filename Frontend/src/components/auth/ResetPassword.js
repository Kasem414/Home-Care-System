import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    setError("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      // Handle password reset logic here
      console.log("Password reset completed");
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Create New Password</h2>
          <p className="auth-subtitle">
            Your new password must be different from previously used passwords
          </p>
        </div>

        {!submitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}

            <div className="form-group">
              <label htmlFor="password">New Password</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a new password"
                  required
                />
              </div>
              <small className="form-text">
                Password must be at least 8 characters and include a mix of
                letters, numbers and symbols
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-lock input-icon"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>
            </div>

            <div className="password-strength">
              <div className="strength-label">Password Strength</div>
              <div className="strength-meter">
                <div
                  className={`strength-indicator ${
                    password.length === 0
                      ? ""
                      : password.length < 8
                      ? "weak"
                      : password.length < 12
                      ? "medium"
                      : "strong"
                  }`}
                  style={{
                    width:
                      password.length === 0
                        ? "0"
                        : password.length < 8
                        ? "30%"
                        : password.length < 12
                        ? "60%"
                        : "100%",
                  }}
                />
              </div>
              <div className="strength-text">
                {password.length === 0
                  ? ""
                  : password.length < 8
                  ? "Weak"
                  : password.length < 12
                  ? "Medium"
                  : "Strong"}
              </div>
            </div>

            <button
              type="submit"
              className={`auth-btn ${isLoading ? "loading" : ""}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Resetting...</span>
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Password Reset Successful</h3>
            <p>
              Your password has been reset successfully. You can now log in with
              your new password.
            </p>
            <Link to="/login" className="auth-btn">
              Go to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
