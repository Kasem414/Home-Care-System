import React, { useState, useEffect, useMemo } from "react";
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
  FaBuilding,
  FaCalendarAlt,
  FaTags,
} from "react-icons/fa";
import { adminService } from "../../services/api";

const ProvidersManagement = () => {
  const [providers, setProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProviders, setTotalProviders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch providers data
  useEffect(() => {
    fetchProviders();
  }, [currentPage, statusFilter, categoryFilter, cityFilter, searchTerm]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const response = await adminService.getProviders(
        currentPage,
        itemsPerPage,
        categoryFilter,
        cityFilter,
        statusFilter,
        searchTerm
      );

      if (response.success) {
        setProviders(response.data.providers);
        setTotalProviders(response.data.total);
        setTotalPages(response.data.pages);
      } else {
        setError("Failed to load providers");
      }
    } catch (err) {
      setError("An error occurred while fetching providers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories and cities from providers for filter options
  const categories = useMemo(() => {
    if (!providers.length) return [];
    const categoriesSet = new Set();
    providers.forEach((provider) => {
      if (provider.serviceCategories) {
        provider.serviceCategories.forEach((category) =>
          categoriesSet.add(category)
        );
      }
    });
    return Array.from(categoriesSet).sort();
  }, [providers]);

  const cities = useMemo(() => {
    if (!providers.length) return [];
    const citiesSet = new Set();
    providers.forEach((provider) => {
      if (provider.city) {
        citiesSet.add(provider.city);
      }
    });
    return Array.from(citiesSet).sort();
  }, [providers]);

  const activateProvider = async (providerId) => {
    try {
      const response = await adminService.activateUser(providerId);
      if (response.success) {
        // Update the provider in the local state
        setProviders(
          providers.map((provider) =>
            provider.id === providerId
              ? { ...provider, status: "active" }
              : provider
          )
        );
      } else {
        setError("Failed to activate provider");
      }
    } catch (err) {
      setError("An error occurred while activating provider");
      console.error(err);
    }
  };

  const deactivateProvider = async (providerId) => {
    try {
      const response = await adminService.deactivateUser(providerId);
      if (response.success) {
        // Update the provider in the local state
        setProviders(
          providers.map((provider) =>
            provider.id === providerId
              ? { ...provider, status: "inactive" }
              : provider
          )
        );
      } else {
        setError("Failed to deactivate provider");
      }
    } catch (err) {
      setError("An error occurred while deactivating provider");
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStatusFilter(value);
    } else if (name === "category") {
      setCategoryFilter(value);
    } else if (name === "city") {
      setCityFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    // Reset to first page when search term changes
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sort providers (client-side sorting for properties not handled by API)
  const sortedProviders = useMemo(() => {
    if (!sortConfig.key) return providers;

    return [...providers].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [providers, sortConfig]);

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading && providers.length === 0) {
    return <div className="loading-spinner">Loading providers...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

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
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="categoryFilter">Category:</label>
            <select
              id="categoryFilter"
              name="category"
              value={categoryFilter}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="cityFilter">City:</label>
            <select
              id="cityFilter"
              name="city"
              value={cityFilter}
              onChange={handleFilterChange}
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="sort-options">
            <span>Sort by:</span>
            <button
              className={`sort-btn ${
                sortConfig.key === "companyName" ? "active" : ""
              }`}
              onClick={() => handleSort("companyName")}
            >
              Company {getSortIcon("companyName")}
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
                sortConfig.key === "createdAt" ? "active" : ""
              }`}
              onClick={() => handleSort("createdAt")}
            >
              Join Date {getSortIcon("createdAt")}
            </button>
          </div>
        </div>
      )}

      <div className="providers-grid">
        {sortedProviders.length === 0 ? (
          <div className="no-results">
            No providers found matching your criteria
          </div>
        ) : (
          sortedProviders.map((provider) => (
            <div key={provider.id} className="provider-card">
              <div className="provider-header">
                <h3>{provider.companyName}</h3>
                <span className={`status-badge ${provider.status || "active"}`}>
                  {provider.status || "Active"}
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
                  <span>
                    {provider.city}, {provider.region}
                  </span>
                </div>
                <div className="info-item">
                  <FaStar />
                  <span>
                    {provider.rating || "No ratings"}{" "}
                    {provider.rating && "Rating"}
                  </span>
                </div>
                <div className="info-item">
                  <FaCalendarAlt />
                  <span>Total Bookings: {provider.totalBookings || 0}</span>
                </div>
                <div className="info-item">
                  <FaBuilding />
                  <span>
                    Joined: {new Date(provider.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {provider.serviceCategories &&
                provider.serviceCategories.length > 0 && (
                  <div className="provider-services">
                    <div className="info-item">
                      <FaTags />
                      <span>Services:</span>
                    </div>
                    <div className="service-tags">
                      {provider.serviceCategories.map((service, idx) => (
                        <span key={idx} className="service-tag">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              <div className="provider-actions">
                {(!provider.status || provider.status === "inactive") && (
                  <button
                    className="btn-success"
                    onClick={() => activateProvider(provider.id)}
                  >
                    <FaUserCheck /> Activate
                  </button>
                )}
                {(!provider.status || provider.status === "active") && (
                  <button
                    className="btn-danger"
                    onClick={() => deactivateProvider(provider.id)}
                  >
                    <FaUserTimes /> Deactivate
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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
          Page {currentPage} of {totalPages} ({totalProviders} total providers)
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
