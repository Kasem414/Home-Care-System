import React from "react";
import ProviderDashboard from "../../components/providers/ProviderDashboard/ProviderDashboard";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
const ProviderDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();

  // In a real app, we would check if the user has the provider role
  const isProvider = user?.role === "provider";

  // Set this to true during development to bypass role check
  const DEVELOPMENT_MODE = true;

  if (!DEVELOPMENT_MODE && (!isAuthenticated || !isProvider)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="provider-dashboard-page">
      <ProviderDashboard />
    </div>
  );
};

export default ProviderDashboardPage;
