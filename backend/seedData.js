const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shipment = require('./models/Shipment');

dotenv.config();

const sampleShipments = [
  {
    shipmentId: 'SH001',
    containerId: 'CONT001',
    origin: {
      name: 'Port of Los Angeles',
      coordinates: { latitude: 33.7361, longitude: -118.2639 },
      address: '425 S Palos Verdes St, San Pedro, CA 90731, USA'
    },
    destination: {
      name: 'Port of New York',
      coordinates: { latitude: 40.6892, longitude: -74.0445 },
      address: '1 Bay St, Staten Island, NY 10301, USA'
    },
    currentLocation: {
      name: 'Denver, Colorado',
      coordinates: { latitude: 39.7392, longitude: -104.9903 },
      address: 'Denver, CO, USA'
    },
    route: [
      {
        name: 'Port of Los Angeles',
        coordinates: { latitude: 33.7361, longitude: -118.2639 },
        address: '425 S Palos Verdes St, San Pedro, CA 90731, USA'
      },
      {
        name: 'Phoenix, Arizona',
        coordinates: { latitude: 33.4484, longitude: -112.0740 },
        address: 'Phoenix, AZ, USA'
      },
      {
        name: 'Denver, Colorado',
        coordinates: { latitude: 39.7392, longitude: -104.9903 },
        address: 'Denver, CO, USA'
      }
    ],
    status: 'in_transit',
    estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    cargo: {
      description: 'Electronics and Computer Parts',
      weight: 15000,
      value: 250000,
      category: 'Electronics'
    },
    carrier: {
      name: 'Global Shipping Co.',
      contact: '+1-555-0123'
    },
    trackingHistory: [
      {
        location: {
          name: 'Port of Los Angeles',
          coordinates: { latitude: 33.7361, longitude: -118.2639 },
          address: '425 S Palos Verdes St, San Pedro, CA 90731, USA'
        },
        status: 'Shipment created',
        notes: 'Container loaded and ready for transport',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        location: {
          name: 'Phoenix, Arizona',
          coordinates: { latitude: 33.4484, longitude: -112.0740 },
          address: 'Phoenix, AZ, USA'
        },
        status: 'In transit',
        notes: 'Passed through Phoenix distribution center',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        location: {
          name: 'Denver, Colorado',
          coordinates: { latitude: 39.7392, longitude: -104.9903 },
          address: 'Denver, CO, USA'
        },
        status: 'In transit',
        notes: 'Currently at Denver hub',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    shipmentId: 'SH002',
    containerId: 'CONT002',
    origin: {
      name: 'Port of Seattle',
      coordinates: { latitude: 47.6062, longitude: -122.3321 },
      address: 'Seattle, WA, USA'
    },
    destination: {
      name: 'Port of Miami',
      coordinates: { latitude: 25.7617, longitude: -80.1918 },
      address: 'Miami, FL, USA'
    },
    currentLocation: {
      name: 'Chicago, Illinois',
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      address: 'Chicago, IL, USA'
    },
    route: [
      {
        name: 'Port of Seattle',
        coordinates: { latitude: 47.6062, longitude: -122.3321 },
        address: 'Seattle, WA, USA'
      },
      {
        name: 'Chicago, Illinois',
        coordinates: { latitude: 41.8781, longitude: -87.6298 },
        address: 'Chicago, IL, USA'
      }
    ],
    status: 'in_transit',
    estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    cargo: {
      description: 'Automotive Parts',
      weight: 22000,
      value: 180000,
      category: 'Automotive'
    },
    carrier: {
      name: 'Express Logistics',
      contact: '+1-555-0456'
    },
    trackingHistory: [
      {
        location: {
          name: 'Port of Seattle',
          coordinates: { latitude: 47.6062, longitude: -122.3321 },
          address: 'Seattle, WA, USA'
        },
        status: 'Shipment created',
        notes: 'Container picked up from port',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        location: {
          name: 'Chicago, Illinois',
          coordinates: { latitude: 41.8781, longitude: -87.6298 },
          address: 'Chicago, IL, USA'
        },
        status: 'In transit',
        notes: 'Arrived at Chicago sorting facility',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ]
  },
  {
    shipmentId: 'SH003',
    containerId: 'CONT003',
    origin: {
      name: 'Port of Houston',
      coordinates: { latitude: 29.7604, longitude: -95.3698 },
      address: 'Houston, TX, USA'
    },
    destination: {
      name: 'Port of Boston',
      coordinates: { latitude: 42.3601, longitude: -71.0589 },
      address: 'Boston, MA, USA'
    },
    currentLocation: {
      name: 'Port of Boston',
      coordinates: { latitude: 42.3601, longitude: -71.0589 },
      address: 'Boston, MA, USA'
    },
    route: [
      {
        name: 'Port of Houston',
        coordinates: { latitude: 29.7604, longitude: -95.3698 },
        address: 'Houston, TX, USA'
      },
      {
        name: 'Atlanta, Georgia',
        coordinates: { latitude: 33.7490, longitude: -84.3880 },
        address: 'Atlanta, GA, USA'
      },
      {
        name: 'Port of Boston',
        coordinates: { latitude: 42.3601, longitude: -71.0589 },
        address: 'Boston, MA, USA'
      }
    ],
    status: 'delivered',
    estimatedArrival: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    actualArrival: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    cargo: {
      description: 'Medical Equipment',
      weight: 8500,
      value: 500000,
      category: 'Medical'
    },
    carrier: {
      name: 'MedTrans Logistics',
      contact: '+1-555-0789'
    },
    trackingHistory: [
      {
        location: {
          name: 'Port of Houston',
          coordinates: { latitude: 29.7604, longitude: -95.3698 },
          address: 'Houston, TX, USA'
        },
        status: 'Shipment created',
        notes: 'Medical equipment loaded for urgent delivery',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      },
      {
        location: {
          name: 'Atlanta, Georgia',
          coordinates: { latitude: 33.7490, longitude: -84.3880 },
          address: 'Atlanta, GA, USA'
        },
        status: 'In transit',
        notes: 'Passed through Atlanta hub',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        location: {
          name: 'Port of Boston',
          coordinates: { latitude: 42.3601, longitude: -71.0589 },
          address: 'Boston, MA, USA'
        },
        status: 'Delivered',
        notes: 'Successfully delivered to destination',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ]
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cargo_tracker', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await Shipment.deleteMany({});
    console.log('Cleared existing shipments');

    // Insert sample data
    await Shipment.insertMany(sampleShipments);
    console.log('Sample shipments inserted successfully');

    // Close connection
    await mongoose.connection.close();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleShipments };
