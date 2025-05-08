import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("homeowner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle login logic here
      console.log("Logging in as", activeTab, { email, password, rememberMe });
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Log in to your account to continue</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "homeowner" ? "active" : ""}`}
            onClick={() => setActiveTab("homeowner")}
          >
            Homeowner
          </button>
          <button
            className={`auth-tab ${activeTab === "provider" ? "active" : ""}`}
            onClick={() => setActiveTab("provider")}
          >
            Service Provider
          </button>
        </div>

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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-icon-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={`auth-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                <span>Logging in...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="auth-divider">
          <span>or login with</span>
        </div>

        <div className="social-auth">
          <button className="social-btn google">
            <i className="fab fa-google"></i>
            <span>Continue with Google</span>
          </button>
          <button className="social-btn facebook">
            <i className="fab fa-facebook-f"></i>
            <span>Continue with Facebook</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
