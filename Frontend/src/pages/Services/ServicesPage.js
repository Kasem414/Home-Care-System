import React from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  const serviceCategories = [
    {
      id: "plumbing",
      name: "Plumbing Services",
      icon: "💧",
      services: [
        { id: 1, name: "Plumbing", price: "$150/hr" },
        { id: 2, name: "Electrical", price: "$200/hr" },
        { id: 3, name: "Painting", price: "$100/visit" },
      ],
    },
    {
      id: "gardening",
      name: "Gardening Services",
      icon: "🌳",
      services: [
        { id: 4, name: "Gardening", price: "$120/hr" },
        { id: 5, name: "Planting", price: "$90/hr" },
        { id: 6, name: "Pruning", price: "$80/hr" },
      ],
    },
    {
      id: "home",
      name: "Home Services",
      icon: "🏠",
      services: [
        { id: 7, name: "House Cleaning", price: "$80/hr" },
        { id: 8, name: "Lawn Care", price: "$75/visit" },
        { id: 9, name: "Home Repairs", price: "$95/hr" },
      ],
    },
  ];

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>
            Discover our comprehensive range of home care services designed to
            meet your needs
          </p>
        </div>
      </div>

      <div className="services-content container">
        <div className="services-intro">
          <h2>How We Can Help</h2>
          <p>
            Our team of qualified professionals provides a wide range of
            services to support you or your loved ones at home. From medical
            care to everyday assistance, we're here to help maintain
            independence and quality of life.
          </p>
          <Link to="/request" className="btn btn-primary">
            Request a Service
          </Link>
        </div>

        <div className="services-categories">
          {serviceCategories.map((category) => (
            <div key={category.id} className="category-section">
              <div className="category-header">
                <span className="category-icon">{category.icon}</span>
                <h3>{category.name}</h3>
              </div>
              <div className="service-list">
                {category.services.map((service) => (
                  <div key={service.id} className="service-item card">
                    <h4>{service.name}</h4>
                    <p className="service-price">{service.price}</p>
                    <p className="service-description">
                      Professional {service.name.toLowerCase()} services
                      tailored to your specific needs and preferences.
                    </p>
                    <div className="service-actions">
                      <Link
                        to={`/services/${service.id}`}
                        className="btn btn-outlined btn-sm"
                      >
                        Learn More
                      </Link>
                      <Link
                        to={`/request?service=${service.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Request
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="services-cta">
          <h3>Don't see what you're looking for?</h3>
          <p>
            Contact us to discuss your specific needs or request a custom
            service package.
          </p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn btn-outlined">
              Contact Us
            </Link>
            <Link to="/request" className="btn btn-primary">
              Custom Request
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
