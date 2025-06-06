import React from "react";
import PropTypes from "prop-types";

const RequestFilters = ({ filters, onFilterChange, serviceCategories }) => {
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFilterChange({
      ...filters,
      [name]: checked,
    });
  };

  return (
    <div className="provider-request-filters">
      <h3>Filter Requests</h3>

      <div className="filter-group">
        <label htmlFor="serviceType">Service Type</label>
        <select
          id="serviceType"
          name="serviceType"
          value={filters.serviceType}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="all">All Services</option>
          {serviceCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="timeframe">Schedule Type</label>
        <select
          id="timeframe"
          name="timeframe"
          value={filters.timeframe}
          onChange={handleFilterChange}
          className="filter-select"
        >
          <option value="upcoming">Upcoming (Next 7 days)</option>
          <option value="thisWeek">This Week</option>
          <option value="nextWeek">Next Week</option>
          <option value="thisMonth">This Month</option>
          <option value="any">Any Time</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="budget">Minimum Budget</label>
        <div className="budget-slider-container">
          <input
            type="range"
            id="budget"
            name="minBudget"
            min="0"
            max="500"
            step="25"
            value={filters.minBudget}
            onChange={handleFilterChange}
            className="budget-slider"
          />
          <span className="budget-value">${filters.minBudget}+</span>
        </div>
      </div>

      <div className="filter-group checkbox-group">
        <label className="checkbox-container">
          <input
            type="checkbox"
            name="showNewOnly"
            checked={filters.showNewOnly}
            onChange={handleCheckboxChange}
          />
          <span className="checkmark"></span>
          Show new requests only
        </label>
      </div>

      <button
        className="btn btn-outlined btn-sm filter-reset"
        onClick={() =>
          onFilterChange({
            serviceType: "all",
            timeframe: "any",
            minBudget: 0,
            showNewOnly: false,
          })
        }
      >
        Reset Filters
      </button>
    </div>
  );
};

RequestFilters.propTypes = {
  filters: PropTypes.shape({
    serviceType: PropTypes.string.isRequired,
    timeframe: PropTypes.string.isRequired,
    minBudget: PropTypes.number.isRequired,
    showNewOnly: PropTypes.bool.isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  serviceCategories: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RequestFilters;
