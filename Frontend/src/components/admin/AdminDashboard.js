import React, { useState } from "react";
import {
  FaUsers,
  FaUserTie,
  FaClipboardList,
  FaGift,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";

const AdminDashboard = () => {
  const [dateRange, setDateRange] = useState("last7days");

  // Mock data for demonstration
  const kpiData = {
    totalCustomers: 1250,
    totalWorkers: 85,
    totalRequests: 320,
    activePromotions: 3,
    completedServices: 156,
  };

  // Mock data for charts
  const serviceTrendsData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Service Requests",
        data: [65, 59, 80, 81, 56, 55],
        fill: true,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#6366f1",
        pointBorderColor: "#fff",
        pointRadius: 4,
      },
    ],
  };

  const serviceCategoriesData = {
    labels: ["Medical", "Care", "Home", "Other"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#6366f1", "#8b5cf6", "#ec4899", "#f43f5e"],
        borderWidth: 0,
      },
    ],
  };

  const workerPerformanceData = {
    labels: ["John D.", "Sarah M.", "Mike R.", "Lisa K.", "David P."],
    datasets: [
      {
        label: "Average Rating",
        data: [4.8, 4.6, 4.9, 4.7, 4.5],
        backgroundColor: [
          "#6366f1",
          "#8b5cf6",
          "#ec4899",
          "#f43f5e",
          "#14b8a6",
        ],
        borderRadius: 6,
      },
    ],
  };

  const recentActivity = [
    {
      id: 1,
      type: "new_request",
      message: "New service request from Jane Smith",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "registration",
      message: "New worker registration: Michael Brown",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "completion",
      message: "Service completed: Home Nursing for Robert Johnson",
      time: "6 hours ago",
    },
    {
      id: 4,
      type: "review",
      message: "New 5-star review from Emily Davis",
      time: "1 day ago",
    },
  ];

  // Chart options to use consistent styling
  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#64748b",
          font: {
            family: "var(--font-family)",
            size: 12,
          },
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#64748b",
          font: {
            family: "var(--font-family)",
            size: 12,
          },
        },
        grid: {
          color: "#e2e8f0",
          drawBorder: false,
        },
      },
      y: {
        ticks: {
          color: "#64748b",
          font: {
            family: "var(--font-family)",
            size: 12,
          },
        },
        grid: {
          color: "#e2e8f0",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="dashboard-content">
      <header className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <div className="date-filter">
          <FaCalendarAlt />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaUsers />
          </div>
          <div className="kpi-content">
            <h3>Total Customers</h3>
            <p>{kpiData.totalCustomers}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaUserTie />
          </div>
          <div className="kpi-content">
            <h3>Total Workers</h3>
            <p>{kpiData.totalWorkers}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaClipboardList />
          </div>
          <div className="kpi-content">
            <h3>Service Requests</h3>
            <p>{kpiData.totalRequests}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaGift />
          </div>
          <div className="kpi-content">
            <h3>Active Promotions</h3>
            <p>{kpiData.activePromotions}</p>
          </div>
        </div>
        <div className="kpi-card">
          <div className="kpi-icon">
            <FaStar />
          </div>
          <div className="kpi-content">
            <h3>Completed Services</h3>
            <p>{kpiData.completedServices}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Service Request Trends</h3>
          <div className="chart-container">
            <Line data={serviceTrendsData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-card">
          <h3>Service Categories</h3>
          <div className="chart-container">
            <Pie
              data={serviceCategoriesData}
              options={{
                ...chartOptions,
                plugins: {
                  legend: {
                    position: "right",
                    labels: {
                      color: "var(--text-medium)",
                      font: {
                        family: "var(--font-family)",
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <div className="chart-card">
          <h3>Worker Performance</h3>
          <div className="chart-container">
            <Bar data={workerPerformanceData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === "new_request" && <FaClipboardList />}
                {activity.type === "registration" && <FaUserTie />}
                {activity.type === "completion" && <FaStar />}
                {activity.type === "review" && <FaStar />}
              </div>
              <div className="activity-content">
                <p>{activity.message}</p>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
