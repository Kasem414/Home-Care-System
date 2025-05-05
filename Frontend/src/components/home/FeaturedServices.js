import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaWrench,
  FaBolt,
  FaBroom,
  FaPaintBrush,
  FaLeaf,
  FaHammer,
} from "react-icons/fa";

const FeaturedServices = () => {
  const services = [
    {
      id: 1,
      name: "Plumbing",
      icon: <FaWrench />,
      description:
        "Professional plumbing services including repairs, installations, and maintenance for your home.",
      popular: true,
      color: "#6366f1",
    },
    {
      id: 2,
      name: "Electrical",
      icon: <FaBolt />,
      description:
        "Licensed electricians providing safe and reliable electrical services for all your needs.",
      popular: true,
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "Cleaning",
      icon: <FaBroom />,
      description:
        "Thorough cleaning services to keep your home spotless and hygienic with professional standards.",
      popular: true,
      color: "#ec4899",
    },
    {
      id: 4,
      name: "Painting",
      icon: <FaPaintBrush />,
      description:
        "Transform your space with our expert painting services, both interior and exterior.",
      popular: false,
      color: "#f43f5e",
    },
    {
      id: 5,
      name: "Gardening",
      icon: <FaLeaf />,
      description:
        "Keep your outdoor spaces beautiful with our professional gardening and landscaping services.",
      popular: false,
      color: "#14b8a6",
    },
    {
      id: 6,
      name: "Carpentry",
      icon: <FaHammer />,
      description:
        "Custom woodworking, repairs, and installations by skilled carpenters for your home projects.",
      popular: false,
      color: "#f59e0b",
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
    <section className="section featured-services-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">Featured Services</h2>
          <p className="section-subtitle">
            Discover our most popular home services
          </p>
        </motion.div>

        <motion.div
          className="services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              className="service-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              style={{ "--service-color": service.color }}
            >
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.name}</h3>
              <p className="service-description">{service.description}</p>
              <Link to={`/services/${service.id}`} className="service-link">
                Learn More
                <span className="arrow-icon">→</span>
              </Link>
              {service.popular && <div className="popular-badge">Popular</div>}
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
          <Link to="/services" className="btn btn-primary">
            View All Services
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedServices;
