import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/index.css";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";

// Notification Component
import NotificationDisplay from "./components/shared/NotificationDisplay";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/shared/Navbar";
import Footer from "./components/shared/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
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
import RequestWizard from "./components/requests/RequestWizard/RequestWizard";
import RequestsPage from "./pages/Requests/RequestsPage";
import RequestDetailsPage from "./pages/Requests/RequestDetailsPage";
import ProviderDashboardPage from "./pages/Provider/ProviderDashboardPage";
import ProviderRequestDetailPage from "./pages/Provider/RequestDetailPage";
import CreateOfferPage from "./pages/Provider/CreateOfferPage";
import OffersList from "./components/requests/OffersList";
import ProviderOffersList from "./components/providers/ProviderDashboard/ProviderOffers/ProviderOffersList";
import RequestsWithOffersPage from "./pages/Requests/RequestsWithOffersPage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <Navbar />
          <ToastContainer position="top-right" autoClose={5000} />
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

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="administrator">
                  <AdminLayout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="administrator">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <ProtectedRoute requiredRole="administrator">
                  <ServicesManagement />
                </ProtectedRoute>
              }
            />

            {/* Requests Routes */}
            <Route
              path="/request/new"
              element={
                <ProtectedRoute>
                  <RequestWizard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <RequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:requestId"
              element={
                <ProtectedRoute>
                  <RequestDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Provider Routes */}
            <Route
              path="/provider/dashboard"
              element={
                <ProtectedRoute>
                  <ProviderDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/requests/:requestId"
              element={
                <ProtectedRoute>
                  <ProviderRequestDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/request/:requestId/create-offer"
              element={
                <ProtectedRoute>
                  <CreateOfferPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/provider/offers"
              element={
                <ProtectedRoute>
                  <ProviderOffersList />
                </ProtectedRoute>
              }
            />

            {/* Customer Offers Routes */}
            <Route
              path="/offers"
              element={
                <ProtectedRoute>
                  <OffersList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests-with-offers"
              element={
                <ProtectedRoute>
                  <RequestsWithOffersPage />
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
