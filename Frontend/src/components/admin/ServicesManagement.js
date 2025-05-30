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
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalServices, setTotalServices] = useState(0);
  const itemsPerPage = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch services data
  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await adminService.getServices(
        currentPage,
        itemsPerPage
      );

      if (response.success) {
        setServices(response.data.services);
        setTotalServices(response.data.total);
        setTotalPages(response.data.pages);
        setCurrentPage(response.data.currentPage);
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
        // Refresh the services list
        fetchServices();
        setIsDeleteDialogOpen(false);
        setServiceToDelete(null);
        setError(null); // Clear any existing errors
      } else {
        setError("Failed to delete service. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while deleting the service"
      );
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
        description: updatedService.description || "",
      });

      if (response.success) {
        // Refresh the services list
        fetchServices();
        setIsEditModalOpen(false);
        setEditingService(null);
        setError(null); // Clear any existing errors
      } else {
        setError("Failed to update service. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while updating the service"
      );
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
        description: newService.description || "",
      });

      if (response.success) {
        // Add the new service to the state and refresh the list
        fetchServices();
        setIsAddModalOpen(false);
        setError(null); // Clear any existing errors
      } else {
        setError("Failed to create service. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred while creating the service"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <button
            className="add-service-btn"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus /> Add Service
          </button>
        </div>
      </div>

      <div className="table-container">
        {services.length === 0 ? (
          <div className="no-data">No services found</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td>{service.name}</td>
                  <td>{service.description}</td>
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
