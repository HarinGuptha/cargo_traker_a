const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  address: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const shipmentSchema = new mongoose.Schema({
  shipmentId: {
    type: String,
    required: true,
    unique: true
  },
  containerId: {
    type: String,
    required: true
  },
  route: [locationSchema],
  currentLocation: {
    type: locationSchema,
    required: true
  },
  destination: {
    type: locationSchema,
    required: true
  },
  origin: {
    type: locationSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_transit', 'delivered', 'delayed', 'cancelled'],
    default: 'pending'
  },
  estimatedArrival: {
    type: Date,
    required: true
  },
  actualArrival: {
    type: Date
  },
  cargo: {
    description: {
      type: String,
      required: true
    },
    weight: {
      type: Number,
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  },
  carrier: {
    name: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    }
  },
  trackingHistory: [{
    location: locationSchema,
    status: {
      type: String,
      required: true
    },
    notes: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
shipmentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate ETA based on current location and destination
shipmentSchema.methods.calculateETA = function() {
  // Simple calculation - in real world, this would use routing APIs
  const avgSpeed = 60; // km/h
  const distance = this.calculateDistance(this.currentLocation.coordinates, this.destination.coordinates);
  const hoursToDestination = distance / avgSpeed;
  return new Date(Date.now() + (hoursToDestination * 60 * 60 * 1000));
};

// Calculate distance between two coordinates (Haversine formula)
shipmentSchema.methods.calculateDistance = function(coord1, coord2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLon = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

module.exports = mongoose.model('Shipment', shipmentSchema);
