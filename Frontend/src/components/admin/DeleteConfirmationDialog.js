import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const DeleteConfirmationDialog = ({ service, onClose, onConfirm }) => {
  return (
    <div className="delete-dialog-overlay">
      <div className="delete-dialog">
        <div className="delete-dialog-header">
          <FaExclamationTriangle className="warning-icon" />
          <h3>Confirm Delete</h3>
        </div>
        <div className="delete-dialog-body">
          <p>
            Are you sure you want to delete the service "{service?.name}"? This
            action cannot be undone.
          </p>
        </div>
        <div className="delete-dialog-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            className="delete-btn"
            onClick={onConfirm}
            aria-label="Confirm deletion"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationDialog;
