import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import RequestList from "../../components/requests/RequestList/RequestList";
import { useAuth } from "../../contexts/AuthContext";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user (would be used in real app to filter requests)
  const { user } = useAuth();

  // Fetch requests from API (simulated)
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true);

        // In a real app, this would be an API call
        // Example: const response = await axios.get('/api/requests');

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Sample data - in a real app, you'd fetch this from your backend
        const data = [
          {
            id: "req-001",
            serviceType: "Cleaning",
            status: "pending",
            createdAt: "2023-11-01T10:30:00Z",
            scheduledDate: "2023-11-15",
            scheduledTime: "14:00",
            address: "123 Main St, Boston, MA 02108",
          },
          {
            id: "req-002",
            serviceType: "Nursing",
            status: "approved",
            createdAt: "2023-10-28T15:45:00Z",
            scheduledDate: "2023-11-10",
            scheduledTime: "10:00",
            address: "456 Oak Ave, Boston, MA 02109",
          },
          {
            id: "req-003",
            serviceType: "Home Repair",
            status: "completed",
            createdAt: "2023-10-15T09:15:00Z",
            scheduledDate: "2023-10-25",
            scheduledTime: "13:30",
            address: "789 Pine Rd, Boston, MA 02110",
          },
          {
            id: "req-004",
            serviceType: "Elderly Care",
            status: "cancelled",
            createdAt: "2023-10-10T14:20:00Z",
            scheduledDate: "2023-10-20",
            scheduledTime: "09:00",
            address: "101 Elm St, Boston, MA 02111",
          },
          {
            id: "req-005",
            serviceType: "Physical Therapy",
            status: "pending",
            createdAt: "2023-11-03T11:20:00Z",
            scheduledDate: "2023-11-18",
            scheduledTime: "16:30",
            address: "202 Cedar Ln, Boston, MA 02112",
          },
          {
            id: "req-006",
            serviceType: "Meal Preparation",
            status: "approved",
            createdAt: "2023-10-25T16:15:00Z",
            scheduledDate: "2023-11-05",
            scheduledTime: "11:30",
            address: "303 Maple Dr, Boston, MA 02113",
          },
        ];

        setRequests(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests. Please try again.");
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle cancellation
  const handleCancelRequest = async (requestId) => {
    try {
      // In a real app, this would be an API call
      // await axios.patch(`/api/requests/${requestId}`, { status: 'cancelled' });

      // Optimistically update UI
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId
            ? { ...request, status: "cancelled" }
            : request
        )
      );

      // Show a toast notification (would need a toast library)
      // toast.success(`Request ${requestId} has been cancelled`);
    } catch (err) {
      console.error("Error cancelling request:", err);
      // toast.error("Failed to cancel request. Please try again.");
    }
  };

  return (
    <div className="requests-page">
      <motion.div
        className="requests-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container">
          <h1>Your Service Requests</h1>
          <p>Track and manage all your home care service requests</p>
        </div>
      </motion.div>

      <motion.div
        className="requests-content container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="requests-header">
          <h2>My Requests</h2>
          <Link to="/request" className="btn-primary">
            <i className="fas fa-plus"></i> New Request
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading your requests...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button
              className="btn-primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            className="no-requests"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p>You haven't made any service requests yet.</p>
            <Link to="/request" className="btn-primary">
              <i className="fas fa-plus"></i> Request a Service
            </Link>
          </motion.div>
        ) : (
          <RequestList
            requests={requests}
            onCancelRequest={handleCancelRequest}
          />
        )}

        <motion.div
          className="requests-info"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="info-card">
            <h3>Need help with your requests?</h3>
            <p>
              Our customer support team is available to assist you with any
              questions or concerns about your service requests.
            </p>
            <a href="tel:+18005551234" className="phone-link">
              <i className="fas fa-phone"></i> (800) 555-1234
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RequestsPage;
