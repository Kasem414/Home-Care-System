import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Find Trusted Home Services",
      subtitle:
        "Connect with qualified professionals for all your home service needs.",
      image: "images/home/hero.png",
      category: "All Services",
    },
    {
      id: 2,
      title: "Expert Plumbing Solutions",
      subtitle: "Professional plumbing services for your home and business.",
      image: "images/home/plump.png",
      category: "Plumbing",
    },
    {
      id: 3,
      title: "Electrical Services",
      subtitle: "Certified electricians for all your electrical needs.",
      image: "images/home/elect.png",
      category: "Electrical",
    },
    {
      id: 4,
      title: "Professional Cleaning",
      subtitle: "Thorough cleaning services to keep your space spotless.",
      image: "images/home/clean.png",
      category: "Cleaning",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-section" aria-label="Hero section">
      <div className="hero-carousel">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="carousel-content">
              <span className="carousel-category">{slide.category}</span>
              <h1 className="carousel-title">{slide.title}</h1>
              <p className="carousel-subtitle">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <button
          className="carousel-control prev"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <FaChevronLeft />
        </button>
        <button
          className="carousel-control next"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <FaChevronRight />
        </button>

        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <form
            onSubmit={handleSearch}
            className="search-container"
            role="search"
          >
            <div className="search-wrapper">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search for services"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary search-button"
                aria-label="Search"
              >
                Search
                <FaArrowRight className="search-arrow" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
