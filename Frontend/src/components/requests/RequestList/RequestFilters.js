import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const RequestFilters = ({
  filters,
  onFilterChange,
  sortOption,
  onSortChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  // Count active filters (non-default)
  React.useEffect(() => {
    let count = 0;
    if (filters.status !== "all") count++;
    if (filters.serviceType !== "all") count++;
    if (filters.dateRange !== "all") count++;
    if (sortOption !== "dateDesc") count++;
    setActiveFilters(count);
  }, [filters, sortOption]);

  // Status filter options
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending", icon: "fa-clock" },
    { value: "approved", label: "Approved", icon: "fa-check-circle" },
    { value: "completed", label: "Completed", icon: "fa-check-double" },
    { value: "cancelled", label: "Cancelled", icon: "fa-times-circle" },
  ];

  // Service type filter options (these could come from API in real app)
  const serviceOptions = [
    { value: "all", label: "All Services" },
    { value: "Cleaning", label: "Cleaning", icon: "fa-broom" },
    { value: "Nursing", label: "Nursing", icon: "fa-user-md" },
    { value: "Home Repair", label: "Home Repair", icon: "fa-tools" },
    {
      value: "Elderly Care",
      label: "Elderly Care",
      icon: "fa-hand-holding-heart",
    },
    {
      value: "Physical Therapy",
      label: "Physical Therapy",
      icon: "fa-walking",
    },
    {
      value: "Meal Preparation",
      label: "Meal Preparation",
      icon: "fa-utensils",
    },
  ];

  // Sort options
  const sortOptions = [
    { value: "dateDesc", label: "Newest First", icon: "fa-sort-amount-down" },
    { value: "dateAsc", label: "Oldest First", icon: "fa-sort-amount-up" },
    { value: "serviceAZ", label: "Service (A-Z)", icon: "fa-sort-alpha-down" },
    { value: "serviceZA", label: "Service (Z-A)", icon: "fa-sort-alpha-up" },
  ];

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  // Reset all filters
  const handleReset = () => {
    onFilterChange({
      status: "all",
      serviceType: "all",
      dateRange: "all",
    });
    onSortChange("dateDesc");
  };

  return (
    <motion.div
      className="request-filters"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="filters-header">
        <div className="filters-title">
          <i className="fas fa-filter"></i>
          <h3>Filters</h3>
          {activeFilters > 0 && (
            <motion.span
              className="active-filters-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {activeFilters}
            </motion.span>
          )}
        </div>
        <motion.button
          type="button"
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          whileTap={{ scale: 0.95 }}
          aria-expanded={isExpanded}
          aria-label={isExpanded ? "Collapse filters" : "Expand filters"}
        >
          <i
            className={`fas ${
              isExpanded ? "fa-chevron-up" : "fa-chevron-down"
            }`}
          ></i>
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </motion.button>
      </div>

      <AnimatePresence>
        {(isExpanded || activeFilters > 0) && (
          <motion.div
            className="filter-section"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-group">
              <label htmlFor="status">Status</label>
              <div className="select-wrapper">
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down select-icon"></i>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="serviceType">Service Type</label>
              <div className="select-wrapper">
                <select
                  id="serviceType"
                  name="serviceType"
                  value={filters.serviceType}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down select-icon"></i>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="dateRange">Date Range</label>
              <div className="select-wrapper">
                <select
                  id="dateRange"
                  name="dateRange"
                  value={filters.dateRange}
                  onChange={handleFilterChange}
                  className="filter-select"
                >
                  <option value="all">All Time</option>
                  <option value="past7days">Past 7 Days</option>
                  <option value="past30days">Past 30 Days</option>
                  <option value="past90days">Past 90 Days</option>
                </select>
                <i className="fas fa-chevron-down select-icon"></i>
              </div>
            </div>

            <div className="filter-group">
              <label htmlFor="sortBy">Sort By</label>
              <div className="select-wrapper">
                <select
                  id="sortBy"
                  name="sortBy"
                  value={sortOption}
                  onChange={(e) => onSortChange(e.target.value)}
                  className="filter-select"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <i className="fas fa-chevron-down select-icon"></i>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeFilters > 0 && (
        <motion.button
          className="btn-outlined filter-reset"
          onClick={handleReset}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileTap={{ scale: 0.95 }}
        >
          <i className="fas fa-undo"></i> Reset Filters
        </motion.button>
      )}
    </motion.div>
  );
};

RequestFilters.propTypes = {
  filters: PropTypes.shape({
    status: PropTypes.string.isRequired,
    serviceType: PropTypes.string.isRequired,
    dateRange: PropTypes.string.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default RequestFilters;
