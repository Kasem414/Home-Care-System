import React from "react";
import AccountSettings from "../../components/account/AccountSettings";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";

const AccountSettingsPage = () => {
  const { isAuthenticated } = useAuth();

  // Set this to true to bypass authentication during development
  const DEVELOPMENT_MODE = true;

  if (!DEVELOPMENT_MODE && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="page-container">
      <AccountSettings />
    </div>
  );
};

export default AccountSettingsPage;
