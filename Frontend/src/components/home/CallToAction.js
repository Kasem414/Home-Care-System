import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaCheck, FaArrowRight } from "react-icons/fa";

const CallToAction = () => {
  const benefits = [
    {
      id: 1,
      text: "Vetted Professionals",
      icon: <FaCheck />,
    },
    {
      id: 2,
      text: "100% Satisfaction Guarantee",
      icon: <FaCheck />,
    },
    {
      id: 3,
      text: "Flexible Scheduling",
      icon: <FaCheck />,
    },
    {
      id: 4,
      text: "Competitive Pricing",
      icon: <FaCheck />,
    },
  ];

  return (
    <section className="section cta-section">
      <div className="container">
        <motion.div
          className="cta-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="cta-content">
            <h2 className="cta-title">Ready to Get Started?</h2>
            <p className="cta-description">
              Join thousands of satisfied customers who have transformed their
              homes with our trusted service providers. Sign up today and get a
              special discount on your first service booking!
            </p>

            <div className="cta-benefits">
              {benefits.map((benefit) => (
                <motion.div
                  key={benefit.id}
                  className="benefit-item"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: benefit.id * 0.1 }}
                >
                  <span className="benefit-icon">{benefit.icon}</span>
                  <span className="benefit-text">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary cta-btn">
                Sign Up Now
                <FaArrowRight className="btn-icon" />
              </Link>
              <Link to="/how-it-works" className="btn btn-outlined cta-btn">
                Learn More
              </Link>
            </div>
          </div>

          <motion.div
            className="cta-image-container"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="cta-image" style={{  'background': `url("/images/home/cta.png") center/cover`}}>
              <div className="cta-image-overlay"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
