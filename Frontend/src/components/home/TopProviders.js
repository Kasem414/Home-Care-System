import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaStar, FaCheck, FaUser, FaCalendarAlt } from "react-icons/fa";

const TopProviders = () => {
  const providers = [
    {
      id: 1,
      name: "John Smith",
      specialty: "Plumbing",
      rating: 4.9,
      reviews: 124,
      image: "provider1.jpg",
      verified: true,
      completedJobs: 156,
      color: "#6366f1",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      specialty: "Electrical",
      rating: 4.8,
      reviews: 98,
      image: "provider2.jpg",
      verified: true,
      completedJobs: 142,
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "Michael Brown",
      specialty: "Cleaning",
      rating: 4.7,
      reviews: 86,
      image: "provider3.jpg",
      verified: true,
      completedJobs: 128,
      color: "#ec4899",
    },
    {
      id: 4,
      name: "Anna Williams",
      specialty: "Painting",
      rating: 4.9,
      reviews: 112,
      image: "provider4.jpg",
      verified: true,
      completedJobs: 168,
      color: "#14b8a6",
    },
  ];

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

  return (
    <section className="section top-providers-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Top-Rated Providers</h2>
          <p className="section-subtitle">
            Meet our highly rated and trusted service professionals
          </p>
        </motion.div>

        <motion.div
          className="providers-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {providers.map((provider) => (
            <motion.div
              key={provider.id}
              className="provider-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              style={{ "--provider-color": provider.color }}
            >
              <div className="provider-header">
                <div className="provider-image-container">
                  <div className="provider-image-placeholder">
                    {/* <FaUser /> */}
                    <img src="/images/shared/provider.png" />
                  </div>
                </div>
                {provider.verified && (
                  <div className="verified-badge">
                    <FaCheck className="verified-icon" />
                    <span className="verified-text">Verified</span>
                  </div>
                )}
              </div>

              <div className="provider-info">
                <h3 className="provider-name">{provider.name}</h3>
                <p className="provider-specialty">
                  {provider.specialty} Specialist
                </p>

                <div className="provider-stats">
                  <div className="stat-item">
                    <FaStar className="stat-icon" />
                    <span className="stat-value">{provider.rating}</span>
                    <span className="stat-label">Rating</span>
                  </div>
                  <div className="stat-item">
                    <FaCalendarAlt className="stat-icon" />
                    <span className="stat-value">{provider.completedJobs}</span>
                    <span className="stat-label">Jobs</span>
                  </div>
                </div>

                <div className="provider-rating">
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`star ${
                          i < Math.floor(provider.rating) ? "filled" : ""
                        }`}
                      />
                    ))}
                  </div>
                  <span className="reviews-count">
                    ({provider.reviews} reviews)
                  </span>
                </div>
              </div>

              <div className="provider-actions">
                <Link
                  to={`/providers/${provider.id}`}
                  className="btn btn-outlined provider-btn"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book/${provider.id}`}
                  className="btn btn-primary provider-btn"
                >
                  Book Now
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center view-all-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/providers" className="btn btn-primary">
            View All Providers
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default TopProviders;
