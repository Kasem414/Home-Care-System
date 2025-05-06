import React from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaCheck,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
} from "react-icons/fa";

// Sample data for testing
const sampleOffers = [
  {
    id: 1,
    providerName: "John Smith",
    providerImage: "https://randomuser.me/api/portraits/men/1.jpg",
    rating: 4.8,
    reviewsCount: 124,
    status: "pending",
    price: 150,
    priceType: "hour",
    availability: "Available tomorrow",
    responseTime: "2 hours",
    description:
      "I have extensive experience in home care services and can provide professional assistance with your needs. I'm certified in first aid and have worked with elderly clients for over 5 years.",
    qualifications: [
      "Certified Professional",
      "First Aid Trained",
      "5+ Years Experience",
      "Background Checked",
    ],
  },
  {
    id: 2,
    providerName: "Sarah Johnson",
    providerImage: "https://randomuser.me/api/portraits/women/2.jpg",
    rating: 4.9,
    reviewsCount: 98,
    status: "pending",
    price: 180,
    priceType: "hour",
    availability: "Available today",
    responseTime: "1 hour",
    description:
      "Professional home care provider with a focus on personalized care. I specialize in elderly care and can provide both medical and non-medical assistance. Available for both short-term and long-term care.",
    qualifications: [
      "Licensed Nurse",
      "Elderly Care Specialist",
      "Emergency Response Trained",
      "Insured",
    ],
  },
  {
    id: 3,
    providerName: "Michael Brown",
    providerImage: "https://randomuser.me/api/portraits/men/3.jpg",
    rating: 4.7,
    reviewsCount: 156,
    status: "accepted",
    price: 165,
    priceType: "hour",
    availability: "Available next week",
    responseTime: "3 hours",
    description:
      "Experienced home care professional with a background in physical therapy. I can help with mobility assistance, exercise programs, and daily living activities. I'm also trained in handling medical equipment.",
    qualifications: [
      "Physical Therapist",
      "Medical Equipment Trained",
      "8+ Years Experience",
      "Background Checked",
    ],
  },
];

const OffersList = ({
  offers = sampleOffers,
  onAcceptOffer,
  onRejectOffer,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (!offers || offers.length === 0) {
    return (
      <div className="offers-empty">
        <p>No offers have been received yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="offers-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {offers.map((offer) => (
        <motion.div
          key={offer.id}
          className="offer-card"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="offer-header">
            <div className="provider-info">
              {/* <img
                src={offer.providerImage || "/images/default-avatar.png"}
                alt={offer.providerName}
                className="provider-avatar"
              /> */}
              <div className="provider-details">
                <h3 className="provider-name">{offer.providerName}</h3>
                <div className="provider-rating">
                  <FaStar className="star-icon" />
                  <span>{offer.rating}</span>
                  <span className="reviews-count">
                    ({offer.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="offer-status">
              {offer.status === "pending" && (
                <span className="status-badge pending">Pending</span>
              )}
              {offer.status === "accepted" && (
                <span className="status-badge accepted">Accepted</span>
              )}
              {offer.status === "rejected" && (
                <span className="status-badge rejected">Rejected</span>
              )}
            </div>
          </div>

          <div className="offer-details">
            <div className="offer-price">
              <FaDollarSign />
              <span className="price">{offer.price}</span>
              <span className="price-type">/{offer.priceType}</span>
            </div>

            <div className="offer-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>Available: {offer.availability}</span>
              </div>
              <div className="meta-item">
                <FaClock />
                <span>Response time: {offer.responseTime}</span>
              </div>
            </div>

            <div className="offer-description">
              <p>{offer.description}</p>
            </div>

            {offer.qualifications && (
              <div className="provider-qualifications">
                {offer.qualifications.map((qualification, index) => (
                  <span key={index} className="qualification-badge">
                    <FaCheck />
                    {qualification}
                  </span>
                ))}
              </div>
            )}
          </div>

          {offer.status === "pending" && (
            <div className="offer-actions">
              <button
                className="btn btn-primary"
                onClick={() => onAcceptOffer(offer.id)}
              >
                Accept Offer
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => onRejectOffer(offer.id)}
              >
                Reject
              </button>
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default OffersList;
