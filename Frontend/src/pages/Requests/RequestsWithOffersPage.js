import React from "react";
import { motion } from "framer-motion";
import RequestsWithOffers from "../../components/requests/RequestsWithOffers";

const RequestsWithOffersPage = () => {
  return (
    <motion.div 
      className="requests-with-offers-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-container">
        {/* <div className="page-header">
          <h1>Your Service Requests & Offers</h1>
          <p className="page-description">
            View all your service requests and the offers you've received from service providers.
            You can expand each request to see its offers and accept or reject them.
          </p>
        </div> */}
        
        <RequestsWithOffers />
      </div>
    </motion.div>
  );
};

export default RequestsWithOffersPage;