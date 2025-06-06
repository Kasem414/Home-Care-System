import React, { useState, useEffect, useMemo } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCheck,
  FaUserTimes,
  FaPhone,
  FaEnvelope,
  FaFilter,
  FaUser,
} from "react-icons/fa";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/components/admin/UserManagement.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const checkTokenValidity = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      // Debug token information
      console.log("Token from localStorage:", token);

      const decodedToken = jwtDecode(token);
      console.log("Decoded token:", decodedToken);
      console.log(
        "Token expiration:",
        new Date(decodedToken.exp * 1000).toLocaleString()
      );
      console.log("Current time:", new Date().toLocaleString());

      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {
        throw new Error("Token has expired");
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      if (error.message === "Invalid token specified") {
        console.error("Token format is invalid");
      }
      // logout();
      // navigate("/login");
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/users/users/`, {
        params: {
          page: currentPage,
          search: searchTerm,
        },
        headers: {
          Authorization: undefined,
        },
      });

      setUsers(response.data.results);
      setTotalUsers(response.data.count);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("An error occurred while fetching users");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, newActive) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        `${API_BASE_URL}/users/users/${userId}/`,
        { active: newActive },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, active: newActive } : user
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
    if (name === "role") {
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

  const filteredUsers = useMemo(() => {
    if (roleFilter === "all") return users;
    return users.filter((user) => user.role === roleFilter);
  }, [users, roleFilter]);

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredUsers, sortConfig]);

  const filteredTotalUsers = useMemo(() => {
    return roleFilter === "all" ? totalUsers : filteredUsers.length;
  }, [totalUsers, filteredUsers, roleFilter]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const renderUserCard = (user) => {
    const isProvider = user.role === "service_provider";

    return (
      <div key={user.id} className="user-card">
        <div className="user-header">
          <div className="user-title">
            <h3>
              {user.firstName} {user.lastName}
            </h3>
            <span className="user-role">
              {isProvider ? "Service Provider" : "Customer"}
            </span>
          </div>
          <span
            className={`status-badge ${user.active ? "active" : "inactive"}`}
          >
            {user.active ? "Active" : "Inactive"}
          </span>
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
          {user.payment && (
            <div className="info-item">
              <FaUser />
              <span>Payment: ${user.payment}</span>
            </div>
          )}
        </div>

        <div className="user-actions">
          {user.active ? (
            <button
              className="btn btn-danger"
              onClick={() => handleStatusChange(user.id, false)}
            >
              <FaUserTimes /> Deactivate
            </button>
          ) : (
            <button
              className="btn btn-success"
              onClick={() => handleStatusChange(user.id, true)}
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
        <h2>User Management ({filteredTotalUsers} Users)</h2>
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
          className={`role-tab ${roleFilter === "all" ? "active" : ""}`}
          onClick={() => setRoleFilter("all")}
        >
          All Users ({totalUsers})
        </button>
        <button
          className={`role-tab ${roleFilter === "customer" ? "active" : ""}`}
          onClick={() => setRoleFilter("customer")}
        >
          Customers ({users.filter((u) => u.role === "customer").length})
        </button>
        <button
          className={`role-tab ${
            roleFilter === "service_provider" ? "active" : ""
          }`}
          onClick={() => setRoleFilter("service_provider")}
        >
          Service Providers (
          {users.filter((u) => u.role === "service_provider").length})
        </button>
      </div>

      {showFilters && (
        <div className="filters-panel">
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
                sortConfig.key === "email" ? "active" : ""
              }`}
              onClick={() => handleSort("email")}
            >
              Email {getSortIcon("email")}
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
          Page {currentPage} of {totalPages} ({filteredTotalUsers} total users)
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
