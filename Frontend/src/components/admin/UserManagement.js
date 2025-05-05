import React, { useState, useMemo } from "react";
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
} from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 234-567-8902",
      location: "Los Angeles, CA",
      role: "customer",
      status: "active",
      joinedDate: "2024-02-01",
    },
    {
      id: 2,
      name: "Emily Davis",
      email: "emily.d@example.com",
      phone: "+1 234-567-8904",
      location: "Miami, FL",
      role: "customer",
      status: "active",
      joinedDate: "2024-02-15",
    },
    {
      id: 3,
      name: "Robert Wilson",
      email: "robert.w@example.com",
      phone: "+1 234-567-8905",
      location: "Seattle, WA",
      role: "customer",
      status: "inactive",
      joinedDate: "2024-03-01",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // Filter users based on search term and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort users
  const sortedUsers = React.useMemo(() => {
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

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="user-management">
      <div className="table-header">
        <h2>Client Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="sort-options">
            <span>Sort by:</span>
            <button
              className={`sort-btn ${
                sortConfig.key === "name" ? "active" : ""
              }`}
              onClick={() => handleSort("name")}
            >
              Name {getSortIcon("name")}
            </button>
            <button
              className={`sort-btn ${
                sortConfig.key === "joinedDate" ? "active" : ""
              }`}
              onClick={() => handleSort("joinedDate")}
            >
              Join Date {getSortIcon("joinedDate")}
            </button>
          </div>
        </div>
      )}

      <div className="users-grid">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-title">
                <h3>{user.name}</h3>
              </div>
              <span className={`status-badge ${user.status}`}>
                {user.status}
              </span>
            </div>
            <div className="user-info">
              <div className="info-item">
                <FaEnvelope />
                <span>{user.email}</span>
              </div>
              <div className="info-item">
                <FaPhone />
                <span>{user.phone}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <span>{user.location}</span>
              </div>
            </div>
            <div className="user-actions">
              {user.status === "active" ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleStatusChange(user.id, "inactive")}
                >
                  <FaUserTimes /> Deactivate
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusChange(user.id, "active")}
                >
                  <FaUserCheck /> Activate
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
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
