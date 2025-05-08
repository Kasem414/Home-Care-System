import React from "react";
import { useNavigate } from "react-router-dom";
import RequestDetails from "../../components/requests/RequestDetails/RequestDetails";

const RequestDetailsPage = () => {
  const navigate = useNavigate();

  const handleCancelRequest = (requestId) => {
    // In a real app, this would have more functionality like updating global state
    console.log(`Request ${requestId} cancelled successfully`);

    // Optionally navigate back to requests list after a short delay
    setTimeout(() => {
      navigate("/requests");
    }, 2000);
  };

  return (
    <div className="request-details-page">
      <RequestDetails onCancelRequest={handleCancelRequest} />
    </div>
  );
};

export default RequestDetailsPage;
