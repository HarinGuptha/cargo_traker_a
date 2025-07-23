import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './ShipmentMap.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const originIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const currentIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const routeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
  popupAnchor: [1, -28],
  shadowSize: [32, 32]
});

const ShipmentMap = ({ shipment }) => {
  const mapRef = useRef();

  // Calculate map bounds to fit all markers
  const calculateBounds = () => {
    const points = [
      [shipment.origin.coordinates.latitude, shipment.origin.coordinates.longitude],
      [shipment.destination.coordinates.latitude, shipment.destination.coordinates.longitude],
      [shipment.currentLocation.coordinates.latitude, shipment.currentLocation.coordinates.longitude],
      ...shipment.route.map(location => [location.coordinates.latitude, location.coordinates.longitude])
    ];
    return points;
  };

  const bounds = calculateBounds();
  
  // Calculate center point
  const center = [
    bounds.reduce((sum, point) => sum + point[0], 0) / bounds.length,
    bounds.reduce((sum, point) => sum + point[1], 0) / bounds.length
  ];

  // Create route line coordinates
  const routeCoordinates = shipment.route.map(location => [
    location.coordinates.latitude,
    location.coordinates.longitude
  ]);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      // Fit map to show all markers
      const leafletBounds = L.latLngBounds(bounds);
      map.fitBounds(leafletBounds, { padding: [20, 20] });
    }
  }, [bounds]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="shipment-map">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={6}
        style={{ height: '400px', width: '100%' }}
        className="leaflet-container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin Marker */}
        <Marker
          position={[shipment.origin.coordinates.latitude, shipment.origin.coordinates.longitude]}
          icon={originIcon}
        >
          <Popup>
            <div className="map-popup">
              <h4>🟢 Origin</h4>
              <p><strong>{shipment.origin.name}</strong></p>
              <p>{shipment.origin.address}</p>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker
          position={[shipment.destination.coordinates.latitude, shipment.destination.coordinates.longitude]}
          icon={destinationIcon}
        >
          <Popup>
            <div className="map-popup">
              <h4>🔴 Destination</h4>
              <p><strong>{shipment.destination.name}</strong></p>
              <p>{shipment.destination.address}</p>
            </div>
          </Popup>
        </Marker>

        {/* Current Location Marker */}
        <Marker
          position={[shipment.currentLocation.coordinates.latitude, shipment.currentLocation.coordinates.longitude]}
          icon={currentIcon}
        >
          <Popup>
            <div className="map-popup">
              <h4>🔵 Current Location</h4>
              <p><strong>{shipment.currentLocation.name}</strong></p>
              <p>{shipment.currentLocation.address}</p>
              <p><small>Last updated: {formatDate(shipment.currentLocation.timestamp || shipment.updatedAt)}</small></p>
            </div>
          </Popup>
        </Marker>

        {/* Route Points */}
        {shipment.route.map((location, index) => {
          // Skip if it's the same as current location, origin, or destination
          const isCurrent = location.coordinates.latitude === shipment.currentLocation.coordinates.latitude &&
                           location.coordinates.longitude === shipment.currentLocation.coordinates.longitude;
          const isOrigin = location.coordinates.latitude === shipment.origin.coordinates.latitude &&
                          location.coordinates.longitude === shipment.origin.coordinates.longitude;
          const isDestination = location.coordinates.latitude === shipment.destination.coordinates.latitude &&
                               location.coordinates.longitude === shipment.destination.coordinates.longitude;

          if (isCurrent || isOrigin || isDestination) {
            return null;
          }

          return (
            <Marker
              key={index}
              position={[location.coordinates.latitude, location.coordinates.longitude]}
              icon={routeIcon}
            >
              <Popup>
                <div className="map-popup">
                  <h4>🟠 Route Point {index + 1}</h4>
                  <p><strong>{location.name}</strong></p>
                  <p>{location.address}</p>
                  {location.timestamp && (
                    <p><small>Passed: {formatDate(location.timestamp)}</small></p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Route Line */}
        {routeCoordinates.length > 1 && (
          <Polyline
            positions={routeCoordinates}
            color="#3498db"
            weight={3}
            opacity={0.7}
            dashArray="5, 10"
          />
        )}
      </MapContainer>

      {/* Map Legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-marker green"></span>
          <span>Origin</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker blue"></span>
          <span>Current Location</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker orange"></span>
          <span>Route Points</span>
        </div>
        <div className="legend-item">
          <span className="legend-marker red"></span>
          <span>Destination</span>
        </div>
        <div className="legend-item">
          <span className="legend-line"></span>
          <span>Route</span>
        </div>
      </div>
    </div>
  );
};

export default ShipmentMap;
