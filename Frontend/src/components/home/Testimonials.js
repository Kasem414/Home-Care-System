import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaQuoteLeft,
} from "react-icons/fa";

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Jennifer K.",
      location: "New York, NY",
      image: "testimonial1.jpg",
      rating: 5,
      text: "I was amazed by the quality of service I received. The plumber was punctual, professional, and fixed my issue in no time. I will definitely use HomeCare Pro again!",
      service: "Plumbing",
      color: "#6366f1",
    },
    {
      id: 2,
      name: "Robert T.",
      location: "Chicago, IL",
      image: "testimonial2.jpg",
      rating: 5,
      text: "Finding quality electricians has always been a challenge until I discovered HomeCare Pro. The booking process was simple, and the service was outstanding.",
      service: "Electrical",
      color: "#8b5cf6",
    },
    {
      id: 3,
      name: "Maria S.",
      location: "Los Angeles, CA",
      image: "testimonial3.jpg",
      rating: 4,
      text: "The cleaning service exceeded my expectations. My home has not looked this good in years! The attention to detail was impressive.",
      service: "Cleaning",
      color: "#ec4899",
    },
    {
      id: 4,
      name: "David L.",
      location: "Dallas, TX",
      image: "testimonial4.jpg",
      rating: 5,
      text: "The painting crew was professional and efficient. They completed the job ahead of schedule and the results look fantastic. Highly recommended!",
      service: "Painting",
      color: "#14b8a6",
    },
  ];

  const nextSlide = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  const prevSlide = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  const goToSlide = (index) => {
    setActiveIndex(index);
  };

  return (
    <section className="section testimonials-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="section-title">What Our Customers Say</h2>
          <p className="section-subtitle">
            Read testimonials from our satisfied customers
          </p>
        </motion.div>

        <div className="testimonials-carousel">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              className="testimonial-slide"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="testimonial-card"
                style={{
                  "--testimonial-color": testimonials[activeIndex].color,
                }}
              >
                <FaQuoteLeft className="quote-icon" />
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`star ${
                        i < testimonials[activeIndex].rating ? "filled" : ""
                      }`}
                    />
                  ))}
                </div>

                <p className="testimonial-text">
                  {testimonials[activeIndex].text}
                </p>

                <div className="testimonial-author">
                  <div className="author-image-placeholder">
                    {testimonials[activeIndex].name.charAt(0)}
                  </div>
                  <div className="author-info">
                    <h4 className="author-name">
                      {testimonials[activeIndex].name}
                    </h4>
                    <p className="author-location">
                      {testimonials[activeIndex].location}
                    </p>
                    <p className="service-used">
                      <span className="service-label">Service:</span>{" "}
                      {testimonials[activeIndex].service}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <button
            className="carousel-control prev-btn"
            onClick={prevSlide}
            aria-label="Previous testimonial"
          >
            <FaChevronLeft />
          </button>
          <button
            className="carousel-control next-btn"
            onClick={nextSlide}
            aria-label="Next testimonial"
          >
            <FaChevronRight />
          </button>

          <div className="carousel-indicators">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`indicator ${index === activeIndex ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/testimonials" className="btn btn-primary">
            View All Testimonials
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
