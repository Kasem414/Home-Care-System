import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequestDetails from "../../components/requests/RequestDetails/RequestDetails";

const RequestDetailsPage = () => {
  const navigate = useNavigate();
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://127.0.0.1:9000/api/service-requests/${requestId}/`
        );
        if (!response.ok) throw new Error("Failed to fetch request details");
        const data = await response.json();
        setRequest(data);
      } catch (err) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const handleCancelRequest = (requestId) => {
    // In a real app, this would have more functionality like updating global state
    console.log(`Request ${requestId} cancelled successfully`);

    // Optionally navigate back to requests list after a short delay
    setTimeout(() => {
      navigate("/requests");
    }, 2000);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="request-details-page">
      <RequestDetails request={request} onCancelRequest={handleCancelRequest} />
    </div>
  );
};

export default RequestDetailsPage;
