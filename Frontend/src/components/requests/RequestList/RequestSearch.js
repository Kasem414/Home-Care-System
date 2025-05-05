import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const RequestSearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  // Auto focus the search input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="request-search">
      <form onSubmit={handleSearch}>
        <motion.div
          className={`search-container ${isFocused ? "focused" : ""}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by service, address, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="search-input"
          />
          {searchTerm && (
            <motion.button
              type="button"
              className="clear-button"
              onClick={handleClear}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }}
            >
              <i className="fas fa-times"></i>
            </motion.button>
          )}
          <motion.button
            type="submit"
            className="search-button"
            whileTap={{ scale: 0.9 }}
          >
            <i className="fas fa-search"></i>
          </motion.button>
        </motion.div>
      </form>
    </div>
  );
};

RequestSearch.propTypes = {
  onSearch: PropTypes.func.isRequired,
};

export default RequestSearch;
