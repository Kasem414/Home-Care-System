import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RequestCard from "./RequestCard";
import RequestFilters from "./RequestFilters";
import RequestSearch from "./RequestSearch";
import { requestService } from "../../../services/requestService";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const RequestList = () => {
  const { user } = useAuth();
  const [allRequests, setAllRequests] = useState([]); // All fetched requests
  const [requests, setRequests] = useState([]); // Filtered, searched, sorted, paginated
  const [filters, setFilters] = useState({
    status: "all",
    service_type: "all",
    dateRange: "all",
  });
  const [sortOption, setSortOption] = useState("dateDesc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
  });

  // Fetch all requests once
  useEffect(() => {
    const fetchAllRequests = async () => {
      setIsLoading(true);
      try {
        // Try to fetch a large number of requests (adjust as needed)
        const response = await requestService.getRequests({
          page: 1,
          limit: 1000,
        });
        setAllRequests(response.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
        toast.error("Failed to load requests");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllRequests();
  }, []);

  // Apply filters, search, sort, and pagination on the frontend
  useEffect(() => {
    let filtered = [...allRequests];

    // Filter by status
    if (filters.status !== "all") {
      filtered = filtered.filter(
        (req) =>
          req.status &&
          req.status.toLowerCase() === filters.status.toLowerCase()
      );
    }
    // Filter by service_type
    if (filters.service_type !== "all") {
      filtered = filtered.filter(
        (req) => req.service_type === filters.service_type
      );
    }
    // Filter by dateRange
    if (filters.dateRange !== "all") {
      const now = new Date();
      let fromDate;
      if (filters.dateRange === "past7days") {
        fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 7);
      } else if (filters.dateRange === "past30days") {
        fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 30);
      } else if (filters.dateRange === "past90days") {
        fromDate = new Date(now);
        fromDate.setDate(now.getDate() - 90);
      }
      if (fromDate) {
        filtered = filtered.filter((req) => {
          const created = new Date(req.created_at);
          return created >= fromDate && created <= now;
        });
      }
    }
    // Search
    if (searchTerm.trim() !== "") {
      const term = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(
        (req) =>
          (req.service_type && req.service_type.toLowerCase().includes(term)) ||
          (req.id && req.id.toString().toLowerCase().includes(term)) ||
          (req.city && req.city.toLowerCase().includes(term)) ||
          (req.region && req.region.toLowerCase().includes(term)) ||
          (req.description && req.description.toLowerCase().includes(term))
      );
    }
    // Sort
    let sorted = sortRequests(filtered, sortOption);
    // Pagination
    const total = sorted.length;
    const startIdx = (pagination.page - 1) * pagination.limit;
    const endIdx = startIdx + pagination.limit;
    setRequests(sorted.slice(startIdx, endIdx));
    setPagination((prev) => ({ ...prev, total }));
  }, [
    allRequests,
    filters,
    sortOption,
    searchTerm,
    pagination.page,
    pagination.limit,
  ]);

  // Sort function
  const sortRequests = (requestsToSort, option) => {
    switch (option) {
      case "dateAsc":
        return [...requestsToSort].sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      case "dateDesc":
        return [...requestsToSort].sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      case "serviceAZ":
        return [...requestsToSort].sort((a, b) =>
          a.service_type.localeCompare(b.service_type)
        );
      case "serviceZA":
        return [...requestsToSort].sort((a, b) =>
          b.service_type.localeCompare(a.service_type)
        );
      default:
        return requestsToSort;
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  // Handle sort changes
  const handleSortChange = (option) => {
    setSortOption(option);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when search term changes
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Handle cancel request
  const handleCancelRequest = async (requestId) => {
    try {
      await requestService.updateRequestStatus(requestId, "cancelled");
      toast.success("Request cancelled successfully");
      // Refetch all requests
      const response = await requestService.getRequests({
        page: 1,
        limit: 1000,
      });
      setAllRequests(response.data || []);
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request");
    }
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
      ) : requests.length === 0 ? (
        <div className="no-requests-found">
          <p>No requests found matching your criteria.</p>
          {(filters.status !== "all" ||
            filters.service_type !== "all" ||
            filters.dateRange !== "all" ||
            searchTerm) && (
            <button
              className="btn btn-primary"
              onClick={() => {
                setFilters({
                  status: "all",
                  service_type: "all",
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
          <div className="requests-grid">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                onCancel={handleCancelRequest}
              />
            ))}
          </div>

          {pagination.total > pagination.limit && (
            <div className="pagination">
              <button
                className="btn btn-outlined"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </button>
              <span className="page-info">
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                className="btn btn-outlined"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.limit)
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

RequestList.propTypes = {
  requests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      service_type: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      description: PropTypes.string,
      city: PropTypes.string,
      region: PropTypes.string,
    })
  ),
};

export default RequestList;
