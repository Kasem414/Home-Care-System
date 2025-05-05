import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./styles/index.css";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import HomePage from "./pages/Home/HomePage";
import ServicesPage from "./pages/Services/ServicesPage";
import AccountSettingsPage from "./pages/Account/AccountSettingsPage";
import ProviderAccountSettingsPage from "./pages/Account/ProviderAccountSettingsPage";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import ServicesManagement from "./components/admin/ServicesManagement";
import AdminLayout from "./components/admin/AdminLayout";
import DashboardPage from "./components/admin/AdminDashboard";
import RequestWizardTester from "./components/requests/RequestWizardTester";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            
           
           
            {/* Account Routes */}
            <Route
              path="/account/settings"
              element={
                <ProtectedRoute>
                  <AccountSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/account/provider/settings"
              element={
                <ProtectedRoute>
                  <ProviderAccountSettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
           
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute requiredRole="admin">
                  <ServicesManagement />
                </ProtectedRoute>
              }
            />

            {/* Requests Routes */}
            <Route
              path="/request-test"
              element={
                <ProtectedRoute requiredRole="admin">
                  <RequestWizardTester />
                </ProtectedRoute>
              }
            />
            

          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
