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
  if (requiredRole) {
    // Map the required role to match the backend role names
    const roleMapping = {
      admin: "administrator",
      provider: "service_provider",
      homeowner: "customer",
    };

    const requiredBackendRole = roleMapping[requiredRole] || requiredRole;

    if (user.role !== requiredBackendRole) {
      // Customize based on user role
      switch (user.role) {
        case "customer":
          return <Navigate to="/requests" replace />;
        case "service_provider":
          return <Navigate to="/provider/dashboard" replace />;
        case "administrator":
          return <Navigate to="/admin" replace />;
        default:
          return <Navigate to="/" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
