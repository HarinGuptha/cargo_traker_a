import React, { useState } from 'react';
import './LocationUpdateForm.css';

const LocationUpdateForm = ({ onSubmit, onCancel, currentLocation }) => {
  const [formData, setFormData] = useState({
    location: {
      name: '',
      coordinates: {
        latitude: '',
        longitude: ''
      },
      address: ''
    },
    status: 'in_transit',
    notes: ''
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandchild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild ? {
            ...prev[parent][child],
            [grandchild]: value
          } : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate coordinates
      const lat = parseFloat(formData.location.coordinates.latitude);
      const lng = parseFloat(formData.location.coordinates.longitude);

      if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid coordinates');
        return;
      }

      if (lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90');
        return;
      }

      if (lng < -180 || lng > 180) {
        alert('Longitude must be between -180 and 180');
        return;
      }

      const locationData = {
        ...formData,
        location: {
          ...formData.location,
          coordinates: {
            latitude: lat,
            longitude: lng
          }
        }
      };

      await onSubmit(locationData);
    } catch (error) {
      console.error('Error updating location:', error);
      alert('Failed to update location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const predefinedLocations = [
    { name: 'Los Angeles Port', lat: 33.7361, lng: -118.2639, address: '425 S Palos Verdes St, San Pedro, CA 90731, USA' },
    { name: 'New York Port', lat: 40.6892, lng: -74.0445, address: '1 Bay St, Staten Island, NY 10301, USA' },
    { name: 'Chicago Hub', lat: 41.8781, lng: -87.6298, address: 'Chicago, IL, USA' },
    { name: 'Denver Hub', lat: 39.7392, lng: -104.9903, address: 'Denver, CO, USA' },
    { name: 'Atlanta Hub', lat: 33.7490, lng: -84.3880, address: 'Atlanta, GA, USA' },
    { name: 'Phoenix Hub', lat: 33.4484, lng: -112.0740, address: 'Phoenix, AZ, USA' }
  ];

  const handlePredefinedLocation = (location) => {
    setFormData(prev => ({
      ...prev,
      location: {
        name: location.name,
        coordinates: {
          latitude: location.lat.toString(),
          longitude: location.lng.toString()
        },
        address: location.address
      }
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update Shipment Location</h2>
          <button onClick={onCancel} className="close-button">×</button>
        </div>

        <form onSubmit={handleSubmit} className="location-form">
          <div className="form-section">
            <h3>Quick Select Location</h3>
            <div className="predefined-locations">
              {predefinedLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handlePredefinedLocation(location)}
                  className="btn btn-outline"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Location Details</h3>
            
            <div className="form-group">
              <label htmlFor="locationName">Location Name *</label>
              <input
                type="text"
                id="locationName"
                name="location.name"
                value={formData.location.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Chicago Distribution Center"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="latitude">Latitude *</label>
                <input
                  type="number"
                  id="latitude"
                  name="location.coordinates.latitude"
                  value={formData.location.coordinates.latitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-90"
                  max="90"
                  required
                  placeholder="e.g., 41.8781"
                />
              </div>
              <div className="form-group">
                <label htmlFor="longitude">Longitude *</label>
                <input
                  type="number"
                  id="longitude"
                  name="location.coordinates.longitude"
                  value={formData.location.coordinates.longitude}
                  onChange={handleInputChange}
                  step="any"
                  min="-180"
                  max="180"
                  required
                  placeholder="e.g., -87.6298"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="location.address"
                value={formData.location.address}
                onChange={handleInputChange}
                required
                placeholder="Full address of the location"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Status Update</h3>
            
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="delayed">Delayed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                placeholder="Additional notes about this location update..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Updating...' : 'Update Location'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationUpdateForm;
