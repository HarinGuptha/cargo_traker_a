import React from 'react';
import { Link } from 'react-router-dom';
import './ShipmentTable.css';

const ShipmentTable = ({ shipments, loading }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'status-pending',
      in_transit: 'status-in-transit',
      delivered: 'status-delivered',
      delayed: 'status-delayed',
      cancelled: 'status-cancelled'
    };

    return (
      <span className={`status-badge ${statusClasses[status] || ''}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="table-loading">
        <p>Loading shipments...</p>
      </div>
    );
  }

  if (shipments.length === 0) {
    return (
      <div className="no-shipments">
        <p>No shipments found.</p>
        <Link to="/create" className="btn btn-primary">
          Create your first shipment
        </Link>
      </div>
    );
  }

  return (
    <div className="shipment-table-container">
      <table className="shipment-table">
        <thead>
          <tr>
            <th>Shipment ID</th>
            <th>Container ID</th>
            <th>Origin</th>
            <th>Destination</th>
            <th>Current Location</th>
            <th>Status</th>
            <th>ETA</th>
            <th>Cargo Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((shipment) => (
            <tr key={shipment._id}>
              <td>
                <Link 
                  to={`/shipments/${shipment._id}`}
                  className="shipment-link"
                >
                  {shipment.shipmentId}
                </Link>
              </td>
              <td>{shipment.containerId}</td>
              <td>
                <div className="location-cell">
                  <strong>{shipment.origin.name}</strong>
                  <small>{shipment.origin.address}</small>
                </div>
              </td>
              <td>
                <div className="location-cell">
                  <strong>{shipment.destination.name}</strong>
                  <small>{shipment.destination.address}</small>
                </div>
              </td>
              <td>
                <div className="location-cell">
                  <strong>{shipment.currentLocation.name}</strong>
                  <small>{shipment.currentLocation.address}</small>
                </div>
              </td>
              <td>{getStatusBadge(shipment.status)}</td>
              <td>
                <div className="eta-cell">
                  {formatDate(shipment.estimatedArrival)}
                  {shipment.actualArrival && (
                    <small className="actual-arrival">
                      Actual: {formatDate(shipment.actualArrival)}
                    </small>
                  )}
                </div>
              </td>
              <td>{formatCurrency(shipment.cargo.value)}</td>
              <td>
                <div className="action-buttons">
                  <Link 
                    to={`/shipments/${shipment._id}`}
                    className="btn btn-sm btn-primary"
                  >
                    View
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShipmentTable;
