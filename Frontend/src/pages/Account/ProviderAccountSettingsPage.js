import React from "react";
import ProviderAccountSettings from "../../components/account/ProviderAccountSettings";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ProviderAccountSettingsPage = () => {
  const { isAuthenticated, user } = useAuth();

  // Set this to true to bypass authentication during development
  const DEVELOPMENT_MODE = true;

  // Check if the user is authenticated and is a provider
  if (!DEVELOPMENT_MODE && (!isAuthenticated || user?.role !== "provider")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-container">
      <ProviderAccountSettings />
    </div>
  );
};

export default ProviderAccountSettingsPage;
