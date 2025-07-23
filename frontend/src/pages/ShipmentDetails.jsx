import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShipmentById, updateShipmentLocation, fetchShipmentETA } from '../store/slices/shipmentSlice';
import ShipmentMap from '../components/ShipmentMap';
import LocationUpdateForm from '../components/LocationUpdateForm';
import LoadingSpinner from '../components/LoadingSpinner';
import './ShipmentDetails.css';

const ShipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentShipment, loading, error, eta } = useSelector(state => state.shipments);
  const [showLocationForm, setShowLocationForm] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchShipmentById(id));
      dispatch(fetchShipmentETA(id));
    }
  }, [dispatch, id]);

  const handleLocationUpdate = async (locationData) => {
    try {
      await dispatch(updateShipmentLocation({ id, locationData })).unwrap();
      setShowLocationForm(false);
      // Refresh ETA after location update
      dispatch(fetchShipmentETA(id));
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  if (loading) {
    return <LoadingSpinner message="Loading shipment details..." />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Shipment</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!currentShipment) {
    return (
      <div className="error-container">
        <h2>Shipment Not Found</h2>
        <p>The requested shipment could not be found.</p>
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="shipment-details">
      <div className="details-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          ← Back to Dashboard
        </button>
        <h1>Shipment Details</h1>
        <button 
          onClick={() => setShowLocationForm(true)}
          className="btn btn-primary"
          disabled={currentShipment.status === 'delivered' || currentShipment.status === 'cancelled'}
        >
          Update Location
        </button>
      </div>

      <div className="details-grid">
        {/* Basic Information */}
        <div className="info-card">
          <h3>Basic Information</h3>
          <div className="info-row">
            <label>Shipment ID:</label>
            <span>{currentShipment.shipmentId}</span>
          </div>
          <div className="info-row">
            <label>Container ID:</label>
            <span>{currentShipment.containerId}</span>
          </div>
          <div className="info-row">
            <label>Status:</label>
            {getStatusBadge(currentShipment.status)}
          </div>
          <div className="info-row">
            <label>Created:</label>
            <span>{formatDate(currentShipment.createdAt)}</span>
          </div>
        </div>

        {/* Cargo Information */}
        <div className="info-card">
          <h3>Cargo Information</h3>
          <div className="info-row">
            <label>Description:</label>
            <span>{currentShipment.cargo.description}</span>
          </div>
          <div className="info-row">
            <label>Weight:</label>
            <span>{currentShipment.cargo.weight.toLocaleString()} kg</span>
          </div>
          <div className="info-row">
            <label>Value:</label>
            <span>{formatCurrency(currentShipment.cargo.value)}</span>
          </div>
          <div className="info-row">
            <label>Category:</label>
            <span>{currentShipment.cargo.category}</span>
          </div>
        </div>

        {/* Carrier Information */}
        <div className="info-card">
          <h3>Carrier Information</h3>
          <div className="info-row">
            <label>Carrier:</label>
            <span>{currentShipment.carrier.name}</span>
          </div>
          <div className="info-row">
            <label>Contact:</label>
            <span>{currentShipment.carrier.contact}</span>
          </div>
        </div>

        {/* ETA Information */}
        <div className="info-card">
          <h3>Delivery Information</h3>
          <div className="info-row">
            <label>Estimated Arrival:</label>
            <span>{formatDate(currentShipment.estimatedArrival)}</span>
          </div>
          {currentShipment.actualArrival && (
            <div className="info-row">
              <label>Actual Arrival:</label>
              <span className="delivered">{formatDate(currentShipment.actualArrival)}</span>
            </div>
          )}
          {eta && (
            <div className="info-row">
              <label>Distance Remaining:</label>
              <span>{eta.distanceRemaining} km</span>
            </div>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="map-container">
        <h3>Route Map</h3>
        <ShipmentMap shipment={currentShipment} />
      </div>

      {/* Tracking History */}
      <div className="tracking-history">
        <h3>Tracking History</h3>
        <div className="timeline">
          {currentShipment.trackingHistory.map((entry, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="timeline-header">
                  <strong>{entry.status}</strong>
                  <span className="timeline-date">{formatDate(entry.timestamp)}</span>
                </div>
                <div className="timeline-location">
                  📍 {entry.location.name}
                </div>
                {entry.notes && (
                  <div className="timeline-notes">{entry.notes}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Location Update Modal */}
      {showLocationForm && (
        <LocationUpdateForm
          onSubmit={handleLocationUpdate}
          onCancel={() => setShowLocationForm(false)}
          currentLocation={currentShipment.currentLocation}
        />
      )}
    </div>
  );
};

export default ShipmentDetails;
