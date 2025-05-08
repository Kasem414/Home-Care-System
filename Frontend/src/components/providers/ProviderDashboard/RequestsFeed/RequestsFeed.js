import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RequestItem from "./RequestItem";
import RequestFilters from "./RequestFilters";
import { useAuth } from "../../../../contexts/AuthContext";

const RequestsFeed = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    serviceType: "all",
    distance: "25",
    timeframe: "any",
    minBudget: 0,
    showNewOnly: false,
    showUrgentOnly: false,
  });

  // Service categories for filtering
  const serviceCategories = [
    { value: "Cleaning", label: "Cleaning" },
    { value: "Gardening", label: "Gardening" },
    { value: "Home Repair", label: "Home Repair" },
    { value: "Electrical", label: "Electrical" },
    { value: "Plumbing", label: "Plumbing" },
    { value: "Painting", label: "Painting" },
    { value: "Meal Preparation", label: "Meal Preparation" },
  ];

  // Fetch available requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // In a real app, this would be an API call
        // For demo, we're using mock data
        const mockRequests = [
          {
            id: "req-001",
            serviceType: "Cleaning",
            status: "open",
            createdAt: "2023-11-01T10:30:00Z",
            scheduledDate: "2023-11-15",
            scheduledTime: "14:00",
            address: "123 Main St, Boston, MA 02108",
            description:
              "Need help with deep cleaning of a 2-bedroom apartment, including kitchen and bathrooms.",
            budget: { min: 80, max: 120, type: "fixed" },
            isUrgent: false,
          },
          {
            id: "req-002",
            serviceType: "Gardening",
            status: "open",
            createdAt: "2023-11-04T15:45:00Z",
            scheduledDate: "2023-11-10",
            scheduledTime: "10:00",
            address: "456 Oak Ave, Boston, MA 02109",
            description:
              "Looking for a nurse to assist with medication management and basic health monitoring for my elderly father.",
            budget: { min: 150, max: 200, type: "hourly" },
            isUrgent: true,
          },
          {
            id: "req-003",
            serviceType: "Home Repair",
            status: "open",
            createdAt: "2023-10-30T09:15:00Z",
            scheduledDate: "2023-11-12",
            scheduledTime: "13:30",
            address: "789 Pine Rd, Boston, MA 02110",
            description:
              "Need to fix several plumbing issues in the bathroom, including a leaky faucet and running toilet.",
            budget: { min: 100, max: 200, type: "fixed" },
            isUrgent: false,
          },
          {
            id: "req-004",
            serviceType: "Electrical",
            status: "open",
            createdAt: Date.now() - 60 * 60 * 1000, // 1 hour ago
            scheduledDate: "2023-11-08",
            scheduledTime: "09:00",
            address: "101 Elm St, Boston, MA 02111",
            description:
              "Looking for a caregiver to provide companionship and light housekeeping for my 85-year-old mother, 3 days per week.",
            budget: { min: 120, max: 150, type: "hourly" },
            isUrgent: true,
          },
          {
            id: "req-005",
            serviceType: "Plumbing",
            status: "open",
            createdAt: Date.now() - 30 * 60 * 1000, // 30 minutes ago
            scheduledDate: "2023-11-18",
            scheduledTime: "16:30",
            address: "202 Cedar Ln, Boston, MA 02112",
            description:
              "Need a physical therapist for post-knee surgery rehabilitation. 2 sessions per week for 4 weeks.",
            budget: { min: 200, max: 250, type: "hourly" },
            isUrgent: false,
          },
          {
            id: "req-006",
            serviceType: "Painting",
            status: "open",
            createdAt: "2023-10-28T16:15:00Z",
            scheduledDate: "2023-11-11",
            scheduledTime: "11:30",
            address: "303 Maple Dr, Boston, MA 02113",
            description:
              "Looking for someone to prepare healthy meals for a family of 4, twice a week. We have specific dietary requirements.",
            budget: { min: 90, max: 120, type: "fixed" },
            isUrgent: false,
          },
        ];

        // Add a random distance for demo purposes
        const requestsWithDistance = mockRequests.map((req) => ({
          ...req,
          distance: Math.floor(Math.random() * 50) + 1, // 1-50 miles
        }));

        setRequests(requestsWithDistance);
        setFilteredRequests(requestsWithDistance);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load available requests. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    if (requests.length === 0) return;

    setIsLoading(true);

    // Filter the requests based on criteria
    let result = [...requests];

    // Filter by service type
    if (filters.serviceType !== "all") {
      result = result.filter((req) => req.serviceType === filters.serviceType);
    }

    // Filter by distance
    if (filters.distance !== "any") {
      const maxDistance = parseInt(filters.distance, 10);
      result = result.filter((req) => req.distance <= maxDistance);
    }

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
              new Date(req.scheduledDate) <= sevenDaysLater &&
              new Date(req.scheduledDate) >= nowDate
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
              new Date(req.scheduledDate) <= endOfWeek &&
              new Date(req.scheduledDate) >= nowDate
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
              new Date(req.scheduledDate) >= startOfNextWeek &&
              new Date(req.scheduledDate) <= endOfNextWeek
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
              new Date(req.scheduledDate) >= nowDate &&
              new Date(req.scheduledDate) <= lastDayOfMonth
          );
          break;
        default:
          break;
      }
    }

    // Filter by budget
    if (filters.minBudget > 0) {
      result = result.filter(
        (req) => req.budget && req.budget.max >= filters.minBudget
      );
    }

    // Filter new requests only (less than 24 hours old)
    if (filters.showNewOnly) {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      result = result.filter(
        (req) => new Date(req.createdAt) >= twentyFourHoursAgo
      );
    }

    // Filter urgent requests only
    if (filters.showUrgentOnly) {
      result = result.filter((req) => req.isUrgent);
    }

    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setFilteredRequests(result);
    setIsLoading(false);
  }, [filters, requests]);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle create offer
  const handleCreateOffer = (requestId) => {
    navigate(`/provider/create-offer/${requestId}`, {
      state: { from: "dashboard" },
    });
  };

  return (
    <div className="requests-feed">
      <div className="feed-header">
        <h2>Available Service Requests</h2>
        <p>Browse service requests that match your skills and location</p>
      </div>

      <div className="feed-content">
        <div className="feed-sidebar">
          <RequestFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            serviceCategories={serviceCategories}
          />
        </div>

        <div className="feed-main">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading requests...</span>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="no-requests">
              <i className="fas fa-search"></i>
              <h3>No matching requests found</h3>
              <p>Try adjusting your filters to see more requests</p>
              <button
                className="btn btn-primary"
                onClick={() =>
                  setFilters({
                    serviceType: "all",
                    distance: "25",
                    timeframe: "upcoming",
                    minBudget: 0,
                    showNewOnly: false,
                    showUrgentOnly: false,
                  })
                }
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div className="results-info">
                Found {filteredRequests.length} matching request
                {filteredRequests.length !== 1 ? "s" : ""}
              </div>
              <div className="request-items">
                {filteredRequests.map((request) => (
                  <RequestItem
                    key={request.id}
                    request={request}
                    onCreateOffer={handleCreateOffer}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestsFeed;
