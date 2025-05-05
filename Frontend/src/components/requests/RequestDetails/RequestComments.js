import React, { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

const RequestComments = ({ comments, onAddComment, formatDateTime }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call
      // await axios.post(`/api/requests/${requestId}/comments`, { text: newComment });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Send the comment to parent component
      onAddComment(newComment);

      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Sort comments chronologically
  const sortedComments = [...comments].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div className="comments-container">
      <div className="comments-list">
        <AnimatePresence>
          {sortedComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              className={`comment-item ${
                comment.author === "System" ? "system-comment" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">
                  {formatDateTime(comment.date)}
                </span>
              </div>
              <div className="comment-text">{comment.text}</div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="comment-form">
        <h3>Add Comment</h3>
        <div className="form-group">
          <textarea
            className="comment-textarea"
            placeholder="Type your message here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            required
          ></textarea>
        </div>
        <motion.button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !newComment.trim()}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Sending...
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i> Send Message
            </>
          )}
        </motion.button>
      </form>
    </div>
  );
};

RequestComments.propTypes = {
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      author: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ).isRequired,
  onAddComment: PropTypes.func.isRequired,
  formatDateTime: PropTypes.func.isRequired,
};

export default RequestComments;
