import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaSearch,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
} from "react-icons/fa";
import EditServiceModal from "./EditServiceModal";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const ServicesManagement = () => {
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Home Nursing",
      category: "Medical",
      price: 150,
      status: "Active",
    },
    {
      id: 2,
      name: "Elderly Care",
      category: "Care",
      price: 120,
      status: "Active",
    },
    {
      id: 3,
      name: "Physical Therapy",
      category: "Medical",
      price: 200,
      status: "Inactive",
    },
    {
      id: 4,
      name: "House Cleaning",
      category: "Home",
      price: 80,
      status: "Active",
    },
    {
      id: 5,
      name: "Meal Preparation",
      category: "Care",
      price: 90,
      status: "Active",
    },
  ]);

  const [editingService, setEditingService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter services based on search term
  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort services
  const sortedServices = React.useMemo(() => {
    if (!sortConfig.key) return filteredServices;

    return [...filteredServices].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredServices, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedServices.length / itemsPerPage);
  const paginatedServices = sortedServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  const confirmDelete = () => {
    setServices(
      services.filter((service) => service.id !== serviceToDelete.id)
    );
    setIsDeleteDialogOpen(false);
    setServiceToDelete(null);
  };

  const handleSave = (updatedService) => {
    setServices(
      services.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setIsEditModalOpen(false);
    setEditingService(null);
  };

  const handleAddService = (newService) => {
    const newId = Math.max(...services.map((service) => service.id), 0) + 1;
    const serviceToAdd = {
      id: newId,
      ...newService,
    };
    setServices([...services, serviceToAdd]);
    setIsAddModalOpen(false);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort />;
    return sortConfig.direction === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

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
              onChange={(e) => setSearchTerm(e.target.value)}
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

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort("name")}>
                Name {getSortIcon("name")}
              </th>
              <th onClick={() => handleSort("category")}>
                Category {getSortIcon("category")}
              </th>
              <th onClick={() => handleSort("price")}>
                Price {getSortIcon("price")}
              </th>
              <th onClick={() => handleSort("status")}>
                Status {getSortIcon("status")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedServices.map((service) => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td>${service.price}</td>
                <td>
                  <span
                    className={`status-badge ${service.status.toLowerCase()}`}
                  >
                    {service.status}
                  </span>
                </td>
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
          Page {currentPage} of {totalPages}
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

      {/* Add Service Modal */}
      {isAddModalOpen && (
        <AddServiceModal
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddService}
        />
      )}

      {/* Delete Confirmation Dialog */}
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

// Add Service Modal Component
const AddServiceModal = ({ onClose, onSave }) => {
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewService({
      ...newService,
      [name]: name === "price" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newService);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content add-service-modal">
        <div className="modal-header">
          <h3>Add New Service</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Service Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={newService.name}
              onChange={handleChange}
              required
              placeholder="Enter service name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={newService.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="Medical">Medical</option>
              <option value="Care">Care</option>
              <option value="Home">Home</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="price">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              value={newService.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="Enter price"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={newService.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Add Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesManagement;
