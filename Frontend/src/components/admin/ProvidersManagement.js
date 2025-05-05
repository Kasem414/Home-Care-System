import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUserCheck,
  FaUserTimes,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFilter,
} from "react-icons/fa";

const ProvidersManagement = () => {
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "+1 234-567-8901",
      location: "New York, NY",
      rating: 4.8,
      status: "active",
      services: ["Home Nursing", "Elderly Care"],
      joinedDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      phone: "+1 234-567-8902",
      location: "Los Angeles, CA",
      rating: 4.5,
      status: "inactive",
      services: ["Physical Therapy", "Home Care"],
      joinedDate: "2024-02-01",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      phone: "+1 234-567-8903",
      location: "Chicago, IL",
      rating: 4.9,
      status: "active",
      services: ["Medical Care", "Home Nursing"],
      joinedDate: "2024-01-20",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  // Get unique services from all providers
  const availableServices = useMemo(() => {
    const services = new Set();
    providers.forEach((provider) => {
      provider.services.forEach((service) => services.add(service));
    });
    return Array.from(services).sort();
  }, [providers]);

  // Filter providers based on search term, status, and service
  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || provider.status === statusFilter;

    const matchesService =
      serviceFilter === "all" || provider.services.includes(serviceFilter);

    return matchesSearch && matchesStatus && matchesService;
  });

  // Sort providers
  const sortedProviders = React.useMemo(() => {
    if (!sortConfig.key) return filteredProviders;

    return [...filteredProviders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredProviders, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedProviders.length / itemsPerPage);
  const paginatedProviders = sortedProviders.slice(
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

  const handleStatusChange = (providerId, newStatus) => {
    setProviders(
      providers.map((provider) =>
        provider.id === providerId
          ? { ...provider, status: newStatus }
          : provider
      )
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatusFilter(value);
    } else if (name === "service") {
      setServiceFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  return (
    <div className="providers-management">
      <div className="table-header">
        <h2>Providers Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search providers..."
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
          <div className="filter-group">
            <label htmlFor="serviceFilter">Service:</label>
            <select
              id="serviceFilter"
              name="service"
              value={serviceFilter}
              onChange={handleFilterChange}
            >
              <option value="all">All Services</option>
              {availableServices.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
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
                sortConfig.key === "rating" ? "active" : ""
              }`}
              onClick={() => handleSort("rating")}
            >
              Rating {getSortIcon("rating")}
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

      <div className="providers-grid">
        {paginatedProviders.map((provider) => (
          <div key={provider.id} className="provider-card">
            <div className="provider-header">
              <h3>{provider.name}</h3>
              <span className={`status-badge ${provider.status}`}>
                {provider.status}
              </span>
            </div>
            <div className="provider-info">
              <div className="info-item">
                <FaEnvelope />
                <span>{provider.email}</span>
              </div>
              <div className="info-item">
                <FaPhone />
                <span>{provider.phone}</span>
              </div>
              <div className="info-item">
                <FaMapMarkerAlt />
                <span>{provider.location}</span>
              </div>
              <div className="info-item">
                <FaStar />
                <span>{provider.rating} Rating</span>
              </div>
            </div>
            <div className="provider-services">
              {provider.services.map((service, index) => (
                <span key={index} className="service-tag">
                  {service}
                </span>
              ))}
            </div>
            <div className="provider-actions">
              {provider.status === "active" ? (
                <button
                  className="btn btn-danger"
                  onClick={() => handleStatusChange(provider.id, "inactive")}
                >
                  <FaUserTimes /> Deactivate
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => handleStatusChange(provider.id, "active")}
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

export default ProvidersManagement;
