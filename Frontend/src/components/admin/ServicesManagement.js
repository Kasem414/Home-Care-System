import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaSpinner,
} from "react-icons/fa";
import EditServiceModal from "./EditServiceModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import { adminService } from "../../services/api";

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const itemsPerPage = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  // Fetch services data
  useEffect(() => {
    fetchServices();
  }, [currentPage, categoryFilter, statusFilter, searchTerm]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await adminService.getServices(
        currentPage,
        itemsPerPage,
        categoryFilter,
        statusFilter,
        searchTerm
      );

      if (response.success) {
        setServices(response.data.services);
        setTotalServices(response.data.total);
        setTotalPages(response.data.pages);

        // Extract unique categories from services for the filter
        const uniqueCategories = new Set();
        response.data.services.forEach((service) => {
          if (service.category) {
            uniqueCategories.add(service.category);
          }
        });
        setCategories(Array.from(uniqueCategories).sort());
      } else {
        setError("Failed to load services");
      }
    } catch (err) {
      setError("An error occurred while fetching services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setIsEditModalOpen(true);
  };

  const handleDelete = (service) => {
    setServiceToDelete(service);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      const response = await adminService.deleteService(serviceToDelete.id);
      if (response.success) {
        // Remove the deleted service from the state
        setServices(
          services.filter((service) => service.id !== serviceToDelete.id)
        );
        setIsDeleteDialogOpen(false);
        setServiceToDelete(null);
      } else {
        setError("Failed to delete service");
      }
    } catch (err) {
      setError("An error occurred while deleting the service");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedService) => {
    setLoading(true);
    try {
      const response = await adminService.updateService(updatedService.id, {
        name: updatedService.name,
        category: updatedService.category,
        description: updatedService.description || "",
      });

      if (response.success) {
        // Update the service in the local state
        setServices(
          services.map((service) =>
            service.id === updatedService.id ? response.data : service
          )
        );
        setIsEditModalOpen(false);
        setEditingService(null);
      } else {
        setError("Failed to update service");
      }
    } catch (err) {
      setError("An error occurred while updating the service");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async (newService) => {
    setLoading(true);
    try {
      const response = await adminService.createService({
        name: newService.name,
        category: newService.category,
        description: newService.description || "",
      });

      if (response.success) {
        // Add the new service to the state
        setServices([...services, response.data]);
        setIsAddModalOpen(false);
      } else {
        setError("Failed to create service");
      }
    } catch (err) {
      setError("An error occurred while creating the service");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "category") {
      setCategoryFilter(value);
    } else if (name === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when search term changes
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading && services.length === 0) {
    return (
      <div className="loading-container">
        <FaSpinner className="spinner" />
        <p>Loading services...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="services-management admin-services">
      <div className="table-header">
        <h2>Services Management</h2>
        <div className="action-area">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <button
            className="add-service-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="categoryFilter">Category:</label>
          <select
            id="categoryFilter"
            name="category"
            value={categoryFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            name="status"
            value={statusFilter}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="table-container">
        {services.length === 0 ? (
          <div className="no-data">
            No services found matching your criteria
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")}>
                  Name {getSortIcon("name")}
                </th>
                <th onClick={() => handleSort("category")}>
                  Category {getSortIcon("category")}
                </th>
                <th onClick={() => handleSort("createdAt")}>
                  Created {getSortIcon("createdAt")}
                </th>
                <th onClick={() => handleSort("updatedAt")}>
                  Updated {getSortIcon("updatedAt")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.category}</td>
                  <td>{new Date(service.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(service.updatedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEdit(service)}
                        className="action-btn edit"
                        aria-label={`Edit ${service.name}`}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(service)}
                        className="action-btn delete"
                        aria-label={`Delete ${service.name}`}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages} ({totalServices} total services)
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <EditServiceModal
          service={editingService}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingService(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Add Modal */}
      {isAddModalOpen && (
        <EditServiceModal
          service={null}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddService}
        />
      )}

      {/* Delete Confirmation */}
      {isDeleteDialogOpen && (
        <DeleteConfirmationDialog
          service={serviceToDelete}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setServiceToDelete(null);
          }}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default ServicesManagement;
