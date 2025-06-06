import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestItem from "./RequestItem";
import RequestFilters from "./RequestFilters";
import { useAuth } from "../../../../contexts/AuthContext";
import providerService from "../../../../services/providerService";

const RequestsFeed = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [filters, setFilters] = useState({
    serviceType: "all",
    timeframe: "any",
    minBudget: 0,
    showNewOnly: false,
  });

  // Log initial mount and auth state
  useEffect(() => {
    console.log("RequestsFeed mounted");
    console.log("Auth state:", { isAuthenticated, user });
  }, []);

  // Service categories for filtering
  const serviceCategories = [
    { value: "cleaning", label: "Cleaning" },
    { value: "gardening", label: "Gardening" },
    { value: "home_repair", label: "Home Repair" },
    { value: "electrical", label: "Electrical" },
    { value: "plumbing", label: "Plumbing" },
    { value: "painting", label: "Painting" },
    { value: "meal_preparation", label: "Meal Preparation" },
  ];

  // Fetch available requests
  useEffect(() => {
    console.log("Fetch effect triggered with:", {
      isAuthenticated,
      userId: user?.id,
      filters,
      pagination,
    });

    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        console.log("Starting request fetch with user:", user);
        if (!user?.id) {
          console.log("No user ID available, aborting fetch");
          throw new Error("User ID not available");
        }

        // Log the request parameters
        const requestParams = {
          providerId: user.id,
          serviceType: filters.serviceType,
          showNewOnly: filters.showNewOnly,
          page: pagination.page,
          limit: pagination.limit,
        };
        console.log("Making request with params:", requestParams);

        const response = await providerService.getRequests(requestParams);

        console.log("API Response received:", response);

        if (response && response.data) {
          setRequests(response.data);
          setFilteredRequests(response.data);
          setPagination((prev) => ({
            ...prev,
            total: response.pagination?.total || 0,
          }));
        } else {
          console.log("Invalid response format:", response);
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error in fetchRequests:", err);
        setError(
          err.message ||
            "Failed to load available requests. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated && user?.id) {
      console.log(
        "Conditions met, calling fetchRequests with user_id:",
        user.id
      );
    fetchRequests();
    } else {
      console.log("Skipping fetch - not authenticated or no user ID", {
        isAuthenticated,
        userId: user?.id,
      });
    }
  }, [
    filters.serviceType,
    filters.showNewOnly,
    pagination.page,
    pagination.limit,
    user?.id,
    isAuthenticated,
  ]);

  // Apply filters when they change
  useEffect(() => {
    if (requests.length === 0) return;

    setIsLoading(true);

    // Filter the requests based on criteria
    let result = [...requests];

    // Filter by timeframe
    if (filters.timeframe !== "any") {
      const now = new Date();
      const nowDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      const oneDay = 24 * 60 * 60 * 1000;

      switch (filters.timeframe) {
        case "upcoming":
          // Next 7 days
          const sevenDaysLater = new Date(nowDate.getTime() + 7 * oneDay);
          result = result.filter(
            (req) =>
              new Date(req.preferred_date) <= sevenDaysLater &&
              new Date(req.preferred_date) >= nowDate
          );
          break;
        case "thisWeek":
          // This week (until Sunday)
          const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ...
          const daysUntilEndOfWeek = 7 - currentDay;
          const endOfWeek = new Date(
            nowDate.getTime() + daysUntilEndOfWeek * oneDay
          );
          result = result.filter(
            (req) =>
              new Date(req.preferred_date) <= endOfWeek &&
              new Date(req.preferred_date) >= nowDate
          );
          break;
        case "nextWeek":
          // Next week (Monday to Sunday)
          const currentDay2 = now.getDay();
          const daysUntilNextWeek = 7 - currentDay2 + 1; // +1 to start from Monday
          const startOfNextWeek = new Date(
            nowDate.getTime() + daysUntilNextWeek * oneDay
          );
          const endOfNextWeek = new Date(
            startOfNextWeek.getTime() + 6 * oneDay
          );
          result = result.filter(
            (req) =>
              new Date(req.preferred_date) >= startOfNextWeek &&
              new Date(req.preferred_date) <= endOfNextWeek
          );
          break;
        case "thisMonth":
          // This month
          const lastDayOfMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0
          );
          result = result.filter(
            (req) =>
              new Date(req.preferred_date) >= nowDate &&
              new Date(req.preferred_date) <= lastDayOfMonth
          );
          break;
        default:
          break;
      }
    }

    // Filter by budget
    if (filters.minBudget > 0) {
      result = result.filter((req) => {
        if (req.budget_type === "fixed") {
          return parseFloat(req.fixed_price_offer) >= filters.minBudget;
        } else {
          return (
            (req.budget_max_hourly &&
              parseFloat(req.budget_max_hourly) >= filters.minBudget) ||
            (req.budget_min_hourly &&
              parseFloat(req.budget_min_hourly) >= filters.minBudget)
          );
        }
      });
    }

    setFilteredRequests(result);
    setIsLoading(false);
  }, [requests, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination({ ...pagination, page: 1 }); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPagination({ ...pagination, page: newPage });
  };

  const handleCreateOffer = (requestId) => {
    navigate(`/provider/requests/${requestId}/create-offer`);
  };

  if (!isAuthenticated) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        Please log in to view service requests.
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <i className="fas fa-exclamation-circle"></i>
        {error}
      </div>
    );
  }

  return (
    <div className="requests-feed">
          <RequestFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            serviceCategories={serviceCategories}
          />

          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
          Loading requests...
        </div>
      ) : (
        <>
          <div className="requests-list">
            {filteredRequests.length === 0 ? (
              <div className="no-requests">
                <i className="fas fa-inbox"></i>
                <p>No requests match your filters.</p>
              </div>
            ) : (
              filteredRequests.map((request) => (
                <RequestItem
                  key={request.id}
                  request={request}
                  onCreateOffer={() => handleCreateOffer(request.id)}
                />
              ))
            )}
            </div>

          {/* Pagination */}
          {pagination.total > pagination.limit && (
            <div className="pagination">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </button>
              <span>
                Page {pagination.page} of{" "}
                {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                disabled={
                  pagination.page ===
                  Math.ceil(pagination.total / pagination.limit)
                }
                onClick={() => handlePageChange(pagination.page + 1)}
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

export default RequestsFeed;
