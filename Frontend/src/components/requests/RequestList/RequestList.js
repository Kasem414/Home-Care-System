import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RequestCard from "./RequestCard";
import RequestFilters from "./RequestFilters";
import RequestSearch from "./RequestSearch";

const RequestList = ({ requests: initialRequests }) => {
  const [requests, setRequests] = useState(initialRequests);
  const [filteredRequests, setFilteredRequests] = useState(initialRequests);
  const [filters, setFilters] = useState({
    status: "all",
    serviceType: "all",
    dateRange: "all",
  });
  const [sortOption, setSortOption] = useState("dateDesc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Apply filters, search, and sort
  useEffect(() => {
    setIsLoading(true);

    // First, filter the requests
    let result = [...requests];

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((request) => request.status === filters.status);
    }

    // Apply service type filter
    if (filters.serviceType !== "all") {
      result = result.filter(
        (request) => request.serviceType === filters.serviceType
      );
    }

    // Apply date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let daysToSubtract = 0;

      switch (filters.dateRange) {
        case "past7days":
          daysToSubtract = 7;
          break;
        case "past30days":
          daysToSubtract = 30;
          break;
        case "past90days":
          daysToSubtract = 90;
          break;
        default:
          break;
      }

      if (daysToSubtract > 0) {
        const cutoffDate = new Date(now);
        cutoffDate.setDate(now.getDate() - daysToSubtract);

        result = result.filter(
          (request) => new Date(request.createdAt) >= cutoffDate
        );
      }
    }

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (request) =>
          request.serviceType.toLowerCase().includes(term) ||
          request.address.toLowerCase().includes(term) ||
          request.id.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    result = sortRequests(result, sortOption);

    setFilteredRequests(result);
    setIsLoading(false);
  }, [requests, filters, sortOption, searchTerm]);

  // Sort function
  const sortRequests = (requestsToSort, option) => {
    switch (option) {
      case "dateAsc":
        return [...requestsToSort].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "dateDesc":
        return [...requestsToSort].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "serviceAZ":
        return [...requestsToSort].sort((a, b) =>
          a.serviceType.localeCompare(b.serviceType)
        );
      case "serviceZA":
        return [...requestsToSort].sort((a, b) =>
          b.serviceType.localeCompare(a.serviceType)
        );
      default:
        return requestsToSort;
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  // Handle cancel request
  const handleCancelRequest = (requestId) => {
    // In a real app, this would call an API
    const updatedRequests = requests.map((request) =>
      request.id === requestId ? { ...request, status: "cancelled" } : request
    );
    setRequests(updatedRequests);

    // Show success message or notification
    alert(`Request ${requestId} has been cancelled.`);
  };

  // Handle leave review
  const handleLeaveReview = (requestId) => {
    // In a real app, this would navigate to a review form
    alert(`Leave a review for request ${requestId}`);
  };

  return (
    <div className="request-list-component request-list-container">
      <div className="request-list-header">
        <h2>My Service Requests</h2>
        <RequestSearch onSearch={handleSearch} />
      </div>

      <RequestFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        sortOption={sortOption}
        onSortChange={handleSortChange}
      />

      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Loading requests...</span>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="no-requests-found">
          <p>No requests found matching your criteria.</p>
          {(filters.status !== "all" ||
            filters.serviceType !== "all" ||
            filters.dateRange !== "all" ||
            searchTerm) && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setFilters({
                  status: "all",
                  serviceType: "all",
                  dateRange: "all",
                });
                setSearchTerm("");
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="request-count">
            Showing {filteredRequests.length} of {requests.length} requests
          </div>

          <div className="request-header-card card request-card">
            <div className="request-info-header">Service</div>
            <div className="request-date-header">Date</div>
            <div className="request-status-header">Status</div>
            <div className="request-actions-header">Actions</div>
          </div>

          <div className="request-cards">
            {filteredRequests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCancelRequest={handleCancelRequest}
                onLeaveReview={handleLeaveReview}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

RequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      serviceType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      scheduledDate: PropTypes.string.isRequired,
      scheduledTime: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RequestList;
