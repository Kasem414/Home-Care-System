import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Set this to false to enforce authentication
const DEVELOPMENT_MODE = false;

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // For development purposes only - bypass authentication if needed
  if (DEVELOPMENT_MODE) {
    console.warn("⚠️ Development mode is enabled - bypassing authentication");
    return children;
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  if (requiredRole && user.role !== requiredRole) {
    // Customize based on user role
    if (user.role === "homeowner") {
      return <Navigate to="/homeowner/dashboard" replace />;
    } else if (user.role === "provider") {
      return <Navigate to="/provider/dashboard" replace />;
    } else {
      // Fallback for any other role
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
