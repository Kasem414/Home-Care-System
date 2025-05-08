import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ServicesManagement from "./ServicesManagement";
import AdminDashboard from "./AdminDashboard";
import ProvidersManagement from "./ProvidersManagement";
import UserManagement from "./UserManagement";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const menuItems = [
    {
      path: "dashboard",
      icon: "fas fa-tachometer-alt",
      label: "Dashboard",
      component: <AdminDashboard />,
    },
    {
      path: "services",
      icon: "fas fa-tools",
      label: "Services",
      component: <ServicesManagement />,
    },
    {
      path: "providers",
      icon: "fas fa-user-tie",
      label: "Providers",
      component: <ProvidersManagement />,
    },
    {
      path: "Users",
      icon: "fas fa-user",
      label: "Users",
      component: <UserManagement />,
    },
    {
      path: "bookings",
      icon: "fas fa-calendar-check",
      label: "Bookings",
      component: <div>Bookings Management</div>,
    },
  ];

  const handleSectionChange = (path) => {
    setActiveSection(path);
  };

  const activeComponent = menuItems.find(
    (item) => item.path === activeSection
  )?.component;

  return (
    <div className="admin-layout">
      <div className={`admin-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Panel</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <i
              className={`fas fa-chevron-${isSidebarOpen ? "left" : "right"}`}
            ></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className={`sidebar-item ${
                activeSection === item.path ? "active" : ""
              }`}
              onClick={() => handleSectionChange(item.path)}
            >
              <i className={item.icon}></i>
              <span className="sidebar-item-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <main className="admin-main">{activeComponent}</main>
    </div>
  );
};

export default AdminLayout;
