import React, { useState } from "react";
import { Link } from "react-router-dom";
import RequestsFeed from "./RequestsFeed/RequestsFeed";
import { useAuth } from "../../../contexts/AuthContext";

const ProviderDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("requests");

  // Mock statistics for dashboard overview
  const stats = {
    activeOffers: 4,
    completedServices: 12,
    earnings: 1250,
    rating: 4.8,
    totalReviews: 15,
    newRequests: 6,
  };

  return (
    <div className="provider-dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="dashboard-welcome">
            <h1>Provider Dashboard</h1>
            <p>Welcome back, {user?.name || "Provider"}!</p>
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-value">${stats.earnings}</div>
              <div className="stat-label">Earned this month</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.completedServices}</div>
              <div className="stat-label">Completed services</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.activeOffers}</div>
              <div className="stat-label">Active offers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {stats.rating} <span className="star">★</span>
              </div>
              <div className="stat-label">
                Rating ({stats.totalReviews} reviews)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-nav container">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === "requests" ? "active" : ""}`}
            onClick={() => setActiveTab("requests")}
          >
            <i className="fas fa-clipboard-list"></i> Available Requests
            {stats.newRequests > 0 && (
              <span className="notification-badge">{stats.newRequests}</span>
            )}
          </button>
          <button
            className={`tab-btn ${activeTab === "offers" ? "active" : ""}`}
            onClick={() => setActiveTab("offers")}
          >
            <i className="fas fa-file-contract"></i> My Offers
          </button>
          <button
            className={`tab-btn ${activeTab === "schedule" ? "active" : ""}`}
            onClick={() => setActiveTab("schedule")}
          >
            <i className="fas fa-calendar-alt"></i> Schedule
          </button>
          <button
            className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <i className="fas fa-user-circle"></i> Profile
          </button>
        </div>

        <div className="dashboard-actions">
          <Link to="/account/provider/settings" className="btn btn-outlined">
            <i className="fas fa-cog"></i> Settings
          </Link>
          <Link to="/provider/inbox" className="btn btn-outlined">
            <i className="fas fa-inbox"></i> Messages
          </Link>
        </div>
      </div>

      <div className="dashboard-content container">
        {activeTab === "requests" && <RequestsFeed />}

        {activeTab === "offers" && (
          <div className="placeholder-content">
            <h2>My Offers</h2>
            <p>This section will display your active and past offers.</p>
          </div>
        )}

        {activeTab === "schedule" && (
          <div className="placeholder-content">
            <h2>My Schedule</h2>
            <p>This section will display your upcoming service appointments.</p>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="placeholder-content">
            <h2>Provider Profile</h2>
            <p>
              This section will allow you to manage your provider profile and
              qualifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;
