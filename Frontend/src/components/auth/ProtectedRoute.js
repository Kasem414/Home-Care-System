import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Set this to true during development to bypass authentication requirements
// IMPORTANT: Set to false before production deployment
const DEVELOPMENT_MODE = true;

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // For development purposes only - creates a test user if none exists
  if (DEVELOPMENT_MODE && !isAuthenticated) {
    console.warn("⚠️ Development mode is enabled - bypassing authentication");
    // In development mode, we'll bypass authentication checks
    return children;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to home page if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
 