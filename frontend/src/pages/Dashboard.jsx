import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchShipments, setFilters, clearFilters } from '../store/slices/shipmentSlice';
import ShipmentTable from '../components/ShipmentTable';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { shipments, loading, error, totalPages, currentPage, total, filters } = useSelector(
    (state) => state.shipments
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchShipments({ 
      page, 
      limit: 10, 
      status: filters.status, 
      containerId: filters.containerId 
    }));
  }, [dispatch, page, filters]);

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
    setPage(1); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const getStatusStats = () => {
    const stats = {
      total: total,
      pending: 0,
      in_transit: 0,
      delivered: 0,
      delayed: 0,
      cancelled: 0
    };

    shipments.forEach(shipment => {
      if (stats.hasOwnProperty(shipment.status)) {
        stats[shipment.status]++;
      }
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading && shipments.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Cargo Shipment Dashboard</h1>
        <Link to="/create" className="btn btn-primary">
          + Create New Shipment
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Shipments</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card pending">
          <h3>Pending</h3>
          <p className="stat-number">{stats.pending}</p>
        </div>
        <div className="stat-card in-transit">
          <h3>In Transit</h3>
          <p className="stat-number">{stats.in_transit}</p>
        </div>
        <div className="stat-card delivered">
          <h3>Delivered</h3>
          <p className="stat-number">{stats.delivered}</p>
        </div>
        <div className="stat-card delayed">
          <h3>Delayed</h3>
          <p className="stat-number">{stats.delayed}</p>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error Message */}
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
        </div>
      )}

      {/* Shipments Table */}
      <div className="table-container">
        <ShipmentTable 
          shipments={shipments}
          loading={loading}
        />
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
