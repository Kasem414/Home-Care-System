import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaHandshake,
  FaCalendarAlt,
  FaCheckCircle,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Request a Service",
      description:
        "Tell us what service you need and provide details about your requirements.",
      icon: <FaClipboardList />,
      color: "#6366f1",
    },
    {
      id: 2,
      title: "Get Offers",
      description:
        "Receive competitive offers from our verified service providers.",
      icon: <FaHandshake />,
      color: "#8b5cf6",
    },
    {
      id: 3,
      title: "Make a Schedule",
      description:
        "Choose your preferred provider and schedule a convenient time.",
      icon: <FaCalendarAlt />,
      color: "#ec4899",
    },
    {
      id: 4,
      title: "Get It Done",
      description:
        "Your provider will arrive on time and complete the job to your satisfaction.",
      icon: <FaCheckCircle />,
      color: "#14b8a6",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section className="section how-it-works-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Get your home services done in four simple steps
          </p>
        </motion.div>

        <motion.div
          className="steps-container"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.id}
              className="step-card"
              variants={itemVariants}
              whileHover={{ y: -5 }}
              style={{ "--step-color": step.color }}
            >
              <div className="step-number">{step.id}</div>
              <div className="step-icon">{step.icon}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </motion.div>
          ))}

          <div className="steps-connection">
            <div className="connection-line"></div>
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/register" className="btn btn-primary">
            Get Started Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
