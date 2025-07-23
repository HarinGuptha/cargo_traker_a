// MongoDB initialization script for Docker
db = db.getSiblingDB('cargo_tracker');

// Create collections
db.createCollection('shipments');

// Create indexes for better performance
db.shipments.createIndex({ "shipmentId": 1 }, { unique: true });
db.shipments.createIndex({ "containerId": 1 });
db.shipments.createIndex({ "status": 1 });
db.shipments.createIndex({ "createdAt": -1 });
db.shipments.createIndex({ "estimatedArrival": 1 });

print('Database initialized successfully');
