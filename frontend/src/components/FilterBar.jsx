import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange(localFilters);
  };

  const handleClearFilters = () => {
    setLocalFilters({ status: '', containerId: '' });
    onClearFilters();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleApplyFilters();
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="status">Status:</label>
        <select
          id="status"
          name="status"
          value={localFilters.status}
          onChange={handleInputChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_transit">In Transit</option>
          <option value="delivered">Delivered</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="containerId">Container ID:</label>
        <input
          type="text"
          id="containerId"
          name="containerId"
          value={localFilters.containerId}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Search by container ID..."
        />
      </div>

      <div className="filter-actions">
        <button 
          onClick={handleApplyFilters}
          className="btn btn-primary"
        >
          Apply Filters
        </button>
        <button 
          onClick={handleClearFilters}
          className="btn btn-secondary"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
