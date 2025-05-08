import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand-col">
            <div className="footer__logo">
              <Link to="/">
                <span className="footer__logo-text">HomeCare</span>
                <span className="footer__logo-accent">Pro</span>
              </Link>
            </div>
            <p className="footer__description">
              Connecting homeowners with trusted service providers for all your
              home care needs.
            </p>
            <div className="footer__social-icons">
              <a href="#" className="footer__social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="footer__social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="footer__social-icon"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="footer__social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Quick Links</h4>
            <ul className="footer__links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/services">Services</Link>
              </li>
              <li>
                <Link to="/providers">Providers</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Services</h4>
            <ul className="footer__links">
              <li>
                <Link to="/services/plumbing">Plumbing</Link>
              </li>
              <li>
                <Link to="/services/electrical">Electrical</Link>
              </li>
              <li>
                <Link to="/services/cleaning">Cleaning</Link>
              </li>
              <li>
                <Link to="/services/painting">Painting</Link>
              </li>
              <li>
                <Link to="/services/gardening">Gardening</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4 className="footer__heading">Contact Us</h4>
            <div className="footer__contact-info">
              <div className="footer__contact-item">
                <i className="fas fa-map-marker-alt"></i>
                <span>123 Main Street, New York, NY 10001</span>
              </div>
              <div className="footer__contact-item">
                <i className="fas fa-phone-alt"></i>
                <span>(123) 456-7890</span>
              </div>
              <div className="footer__contact-item">
                <i className="fas fa-envelope"></i>
                <span>info@homecarepro.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            &copy; {new Date().getFullYear()} HomeCare Pro. All Rights Reserved.
          </div>
          <div className="footer__bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
