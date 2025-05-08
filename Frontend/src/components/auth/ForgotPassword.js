import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
      // Handle password reset logic here
      console.log('Password reset requested for:', email);
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Reset Your Password</h2>
          <p className="auth-subtitle">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>
        
        {!submitted ? (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-icon-wrapper">
                <i className="fas fa-envelope input-icon"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`auth-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Sending...</span>
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Check Your Email</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>. 
              Please check your inbox and follow the instructions to reset your password.
            </p>
            <p>
              If you don't receive an email within a few minutes, check your spam folder or
              <button 
                className="btn-link" 
                onClick={() => setSubmitted(false)}
              >
                try again
              </button>.
            </p>
          </div>
        )}
        
        <div className="auth-footer">
          <p>
            Remember your password?{' '}
            <Link to="/login" className="auth-link">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 