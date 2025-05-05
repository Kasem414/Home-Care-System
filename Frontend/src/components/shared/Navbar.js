import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser,
  FaCog,
  FaShieldAlt,
  FaBriefcase,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const userMenuRef = useRef(null);
  const menuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-logo">
          <Link to="/">
            <span className="logo-text">HomeCare</span>
            <span className="logo-accent">Pro</span>
          </Link>
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div
          className={`navbar-menu ${isMenuOpen ? "is-active" : ""}`}
          ref={menuRef}
        >
          <div className="navbar-start">
            <Link
              to="/"
              className={`navbar-item ${isActive("/") ? "active" : ""}`}
            >
              Home
            </Link>
            <Link
              to="/services"
              className={`navbar-item ${isActive("/services") ? "active" : ""}`}
            >
              Services
            </Link>
            <Link
              to="/provider/dashboard"
              className={`navbar-item ${
                isActive("/provider/dashboard") ? "active" : ""
              }`}
            >
              Providers
            </Link>
            <Link to="/request-test" className="navbar-item highlight">
              Request Service
            </Link>
            <Link
              to="/admin"
              className={`navbar-item ${isActive("/admin") ? "active" : ""}`}
            >
              Admin
            </Link>
            <Link
              to="/contact"
              className={`navbar-item ${isActive("/contact") ? "active" : ""}`}
            >
              Contact
            </Link>
          </div>

          <div className="navbar-end">
            {isAuthenticated ? (
              <div className="navbar-user" ref={userMenuRef}>
                <button
                  className="user-profile-toggle"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  aria-expanded={isUserMenuOpen}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <FaUser />
                    )}
                  </div>
                  <span className="user-greeting">{user?.name || "User"}</span>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <Link
                      to="/account/settings"
                      className="dropdown-item"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <FaCog /> Account Settings
                    </Link>

                    {user?.role === "admin" && (
                      <Link
                        to="/admin"
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaShieldAlt /> Admin Dashboard
                      </Link>
                    )}

                    {user?.role === "provider" && (
                      <Link
                        to="/provider/dashboard"
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaBriefcase /> Provider Dashboard
                      </Link>
                    )}

                    {user?.role === "client" && (
                      <Link
                        to="/requests"
                        className="dropdown-item"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <FaClipboardList /> My Requests
                      </Link>
                    )}

                    <button onClick={handleLogout} className="dropdown-item">
                      <FaSignOutAlt /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outlined">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
