import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createShipment } from '../store/slices/shipmentSlice';
import './CreateShipment.css';

const CreateShipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    containerId: '',
    origin: {
      name: '',
      coordinates: { latitude: '', longitude: '' },
      address: ''
    },
    destination: {
      name: '',
      coordinates: { latitude: '', longitude: '' },
      address: ''
    },
    cargo: {
      description: '',
      weight: '',
      value: '',
      category: ''
    },
    carrier: {
      name: '',
      contact: ''
    },
    estimatedArrival: ''
  });

  const predefinedLocations = [
    { name: 'Port of Los Angeles', lat: 33.7361, lng: -118.2639, address: '425 S Palos Verdes St, San Pedro, CA 90731, USA' },
    { name: 'Port of New York', lat: 40.6892, lng: -74.0445, address: '1 Bay St, Staten Island, NY 10301, USA' },
    { name: 'Port of Seattle', lat: 47.6062, lng: -122.3321, address: 'Seattle, WA, USA' },
    { name: 'Port of Miami', lat: 25.7617, lng: -80.1918, address: 'Miami, FL, USA' },
    { name: 'Port of Houston', lat: 29.7604, lng: -95.3698, address: 'Houston, TX, USA' },
    { name: 'Port of Boston', lat: 42.3601, lng: -71.0589, address: 'Boston, MA, USA' }
  ];

  const cargoCategories = [
    'Electronics',
    'Automotive',
    'Medical',
    'Food & Beverages',
    'Textiles',
    'Machinery',
    'Chemicals',
    'Raw Materials',
    'Consumer Goods',
    'Other'
  ];

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

  const handleLocationSelect = (location, type) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        name: location.name,
        coordinates: {
          latitude: location.lat.toString(),
          longitude: location.lng.toString()
        },
        address: location.address
      }
    }));
  };

  const validateForm = () => {
    const required = [
      'containerId',
      'origin.name',
      'origin.coordinates.latitude',
      'origin.coordinates.longitude',
      'origin.address',
      'destination.name',
      'destination.coordinates.latitude',
      'destination.coordinates.longitude',
      'destination.address',
      'cargo.description',
      'cargo.weight',
      'cargo.value',
      'cargo.category',
      'carrier.name',
      'carrier.contact'
    ];

    for (let field of required) {
      const value = field.split('.').reduce((obj, key) => obj?.[key], formData);
      if (!value || value.toString().trim() === '') {
        return false;
      }
    }

    // Validate coordinates
    const originLat = parseFloat(formData.origin.coordinates.latitude);
    const originLng = parseFloat(formData.origin.coordinates.longitude);
    const destLat = parseFloat(formData.destination.coordinates.latitude);
    const destLng = parseFloat(formData.destination.coordinates.longitude);

    if (isNaN(originLat) || isNaN(originLng) || isNaN(destLat) || isNaN(destLng)) {
      return false;
    }

    if (originLat < -90 || originLat > 90 || destLat < -90 || destLat > 90) {
      return false;
    }

    if (originLng < -180 || originLng > 180 || destLng < -180 || destLng > 180) {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields with valid data');
      return;
    }

    setLoading(true);

    try {
      const shipmentData = {
        ...formData,
        cargo: {
          ...formData.cargo,
          weight: parseFloat(formData.cargo.weight),
          value: parseFloat(formData.cargo.value)
        },
        origin: {
          ...formData.origin,
          coordinates: {
            latitude: parseFloat(formData.origin.coordinates.latitude),
            longitude: parseFloat(formData.origin.coordinates.longitude)
          }
        },
        destination: {
          ...formData.destination,
          coordinates: {
            latitude: parseFloat(formData.destination.coordinates.latitude),
            longitude: parseFloat(formData.destination.coordinates.longitude)
          }
        },
        estimatedArrival: formData.estimatedArrival || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      };

      const result = await dispatch(createShipment(shipmentData)).unwrap();
      navigate(`/shipments/${result._id}`);
    } catch (error) {
      console.error('Failed to create shipment:', error);
      alert('Failed to create shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-shipment">
      <div className="create-header">
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          ← Back to Dashboard
        </button>
        <h1>Create New Shipment</h1>
      </div>

      <form onSubmit={handleSubmit} className="shipment-form">
        {/* Basic Information - Full Width */}
        <div className="form-section full-width">
          <h3>Basic Information</h3>
          <div className="form-group">
            <label htmlFor="containerId">Container ID *</label>
            <input
              type="text"
              id="containerId"
              name="containerId"
              value={formData.containerId}
              onChange={handleInputChange}
              required
              placeholder="e.g., CONT001"
            />
          </div>
        </div>

        {/* Two-column layout for Origin and Destination */}
        <div className="form-sections-container">

        {/* Origin */}
        <div className="form-section">
          <h3>Origin</h3>
          <div className="location-quick-select">
            <label>Quick Select:</label>
            <div className="location-buttons">
              {predefinedLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location, 'origin')}
                  className="btn btn-outline btn-sm"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="originName">Location Name *</label>
            <input
              type="text"
              id="originName"
              name="origin.name"
              value={formData.origin.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Port of Los Angeles"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="originLat">Latitude *</label>
              <input
                type="number"
                id="originLat"
                name="origin.coordinates.latitude"
                value={formData.origin.coordinates.latitude}
                onChange={handleInputChange}
                step="any"
                required
                placeholder="e.g., 33.7361"
              />
            </div>
            <div className="form-group">
              <label htmlFor="originLng">Longitude *</label>
              <input
                type="number"
                id="originLng"
                name="origin.coordinates.longitude"
                value={formData.origin.coordinates.longitude}
                onChange={handleInputChange}
                step="any"
                required
                placeholder="e.g., -118.2639"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="originAddress">Address *</label>
            <input
              type="text"
              id="originAddress"
              name="origin.address"
              value={formData.origin.address}
              onChange={handleInputChange}
              required
              placeholder="Full address"
            />
          </div>
        </div>

          {/* Destination */}
          <div className="form-section">
            <h3>Destination</h3>
          <div className="location-quick-select">
            <label>Quick Select:</label>
            <div className="location-buttons">
              {predefinedLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSelect(location, 'destination')}
                  className="btn btn-outline btn-sm"
                >
                  {location.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="destName">Location Name *</label>
            <input
              type="text"
              id="destName"
              name="destination.name"
              value={formData.destination.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Port of New York"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="destLat">Latitude *</label>
              <input
                type="number"
                id="destLat"
                name="destination.coordinates.latitude"
                value={formData.destination.coordinates.latitude}
                onChange={handleInputChange}
                step="any"
                required
                placeholder="e.g., 40.6892"
              />
            </div>
            <div className="form-group">
              <label htmlFor="destLng">Longitude *</label>
              <input
                type="number"
                id="destLng"
                name="destination.coordinates.longitude"
                value={formData.destination.coordinates.longitude}
                onChange={handleInputChange}
                step="any"
                required
                placeholder="e.g., -74.0445"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="destAddress">Address *</label>
            <input
              type="text"
              id="destAddress"
              name="destination.address"
              value={formData.destination.address}
              onChange={handleInputChange}
              required
              placeholder="Full address"
            />
          </div>
          </div>
        </div>

        {/* Second row - Cargo and Carrier Information */}
        <div className="form-sections-container">
          {/* Cargo Information */}
          <div className="form-section">
          <h3>Cargo Information</h3>
          <div className="form-group">
            <label htmlFor="cargoDesc">Description *</label>
            <input
              type="text"
              id="cargoDesc"
              name="cargo.description"
              value={formData.cargo.description}
              onChange={handleInputChange}
              required
              placeholder="e.g., Electronics and Computer Parts"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="cargoWeight">Weight (kg) *</label>
              <input
                type="number"
                id="cargoWeight"
                name="cargo.weight"
                value={formData.cargo.weight}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                placeholder="e.g., 15000"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cargoValue">Value (USD) *</label>
              <input
                type="number"
                id="cargoValue"
                name="cargo.value"
                value={formData.cargo.value}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
                placeholder="e.g., 250000"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="cargoCategory">Category *</label>
            <select
              id="cargoCategory"
              name="cargo.category"
              value={formData.cargo.category}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              {cargoCategories.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
          </div>
          </div>

          {/* Carrier Information */}
          <div className="form-section">
          <h3>Carrier Information</h3>
          <div className="form-group">
            <label htmlFor="carrierName">Carrier Name *</label>
            <input
              type="text"
              id="carrierName"
              name="carrier.name"
              value={formData.carrier.name}
              onChange={handleInputChange}
              required
              placeholder="e.g., Global Shipping Co."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="carrierContact">Contact *</label>
            <input
              type="text"
              id="carrierContact"
              name="carrier.contact"
              value={formData.carrier.contact}
              onChange={handleInputChange}
              required
              placeholder="e.g., +1-555-0123"
            />
          </div>
          </div>
        </div>

        {/* Delivery Information - Full Width */}
        <div className="form-section full-width">
          <h3>Delivery Information</h3>
          <div className="form-group">
            <label htmlFor="estimatedArrival">Estimated Arrival (Optional)</label>
            <input
              type="datetime-local"
              id="estimatedArrival"
              name="estimatedArrival"
              value={formData.estimatedArrival}
              onChange={handleInputChange}
            />
            <small>If not specified, defaults to 7 days from now</small>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateShipment;
