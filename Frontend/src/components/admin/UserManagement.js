import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCheck,
  FaUserTimes,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFilter,
  FaUser,
  FaTags,
  FaStar,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import "../../styles/components/admin/UserManagement.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("customer"); // Default to showing customers
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, statusFilter, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          role: roleFilter,
          status: statusFilter,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setUsers(response.data.data);
        setTotalUsers(response.data.total);
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setError("Failed to load users");
      }
    } catch (err) {
      setError("An error occurred while fetching users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/users/${userId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setUsers(
          users.map((user) =>
            user._id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        setError("Failed to update user status");
      }
    } catch (err) {
      setError("An error occurred while updating status");
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatusFilter(value);
    } else if (name === "role") {
      setRoleFilter(value);
    }
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return users;

    return [...users].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [users, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const renderUserCard = (user) => {
    const isProvider = user.role === "service_provider";

    return (
      <div key={user._id} className="user-card">
        <div className="user-header">
          <div className="user-title">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <span className="user-role">
              {user.role === "service_provider"
                ? "Service Provider"
                : "Customer"}
            </span>
          </div>
          <span className={`status-badge ${user.status}`}>{user.status}</span>
        </div>

        <div className="user-info">
          <div className="info-item">
            <FaEnvelope />
            <span>{user.email}</span>
          </div>
          <div className="info-item">
            <FaPhone />
            <span>{user.phone || "Not provided"}</span>
          </div>
          {user.city && (
            <div className="info-item">
              <FaMapMarkerAlt />
              <span>
                {user.city}, {user.region}
              </span>
            </div>
          )}
          <div className="info-item">
            <FaCalendarAlt />
            <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
          {isProvider && (
            <>
              {user.rating && (
                <div className="info-item">
                  <FaStar />
                  <span>Rating: {user.rating}</span>
                </div>
              )}
              {user.serviceCategories && (
                <div className="info-item">
                  <FaTags />
                  <span>
                    Services:{" "}
                    {user.serviceCategories.map((cat) => cat.name).join(", ")}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="user-actions">
          {user.status === "active" ? (
            <button
              className="btn btn-danger"
              onClick={() => handleStatusChange(user._id, "inactive")}
            >
              <FaUserTimes /> Deactivate
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => handleStatusChange(user._id, "active")}
            >
              <FaUserCheck /> Activate
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading && users.length === 0) {
    return <div className="loading-spinner">Loading users...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="user-management">
      <div className="table-header">
        <h2>User Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> Filters
          </button>
        </div>
      </div>

      <div className="role-tabs">
        <button
          className={`role-tab ${roleFilter === "customer" ? "active" : ""}`}
          onClick={() => setRoleFilter("customer")}
        >
          Customers
        </button>
        <button
          className={`role-tab ${
            roleFilter === "service_provider" ? "active" : ""
          }`}
          onClick={() => setRoleFilter("service_provider")}
        >
          Service Providers
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-group">
            <label htmlFor="statusFilter">Status:</label>
            <select
              id="statusFilter"
              name="status"
              value={statusFilter}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="sort-options">
            <span>Sort by:</span>
            <button
              className={`sort-btn ${
                sortConfig.key === "firstName" ? "active" : ""
              }`}
              onClick={() => handleSort("firstName")}
            >
              Name {getSortIcon("firstName")}
            </button>
            <button
              className={`sort-btn ${
                sortConfig.key === "createdAt" ? "active" : ""
              }`}
              onClick={() => handleSort("createdAt")}
            >
              Join Date {getSortIcon("createdAt")}
            </button>
          </div>
        </div>
      )}

      <div className="users-grid">
        {sortedUsers.length === 0 ? (
          <div className="no-results">
            No users found matching your criteria
          </div>
        ) : (
          sortedUsers.map((user) => renderUserCard(user))
        )}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages} ({totalUsers} total users)
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
