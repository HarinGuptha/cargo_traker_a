# Cargo Tracker Backend

Node.js/Express backend API for the Cargo Shipment Tracker application.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

4. **Seed sample data** (optional)
   ```bash
   node seedData.js
   ```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cargo_tracker

# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargo_tracker
```

## 📚 API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Shipments

#### GET /shipments
Get all shipments with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `status` (string): Filter by status
- `containerId` (string): Search by container ID

**Response:**
```json
{
  "shipments": [...],
  "totalPages": 5,
  "currentPage": 1,
  "total": 50
}
```

#### GET /shipments/:id
Get a specific shipment by ID or shipment ID.

**Response:**
```json
{
  "_id": "...",
  "shipmentId": "SH001",
  "containerId": "CONT001",
  "origin": {
    "name": "Port of Los Angeles",
    "coordinates": {
      "latitude": 33.7361,
      "longitude": -118.2639
    },
    "address": "425 S Palos Verdes St, San Pedro, CA 90731, USA"
  },
  "destination": {...},
  "currentLocation": {...},
  "route": [...],
  "status": "in_transit",
  "estimatedArrival": "2024-01-15T10:00:00.000Z",
  "cargo": {
    "description": "Electronics and Computer Parts",
    "weight": 15000,
    "value": 250000,
    "category": "Electronics"
  },
  "carrier": {
    "name": "Global Shipping Co.",
    "contact": "+1-555-0123"
  },
  "trackingHistory": [...],
  "createdAt": "2024-01-08T10:00:00.000Z",
  "updatedAt": "2024-01-08T10:00:00.000Z"
}
```

#### POST /shipments
Create a new shipment.

**Request Body:**
```json
{
  "containerId": "CONT001",
  "origin": {
    "name": "Port of Los Angeles",
    "coordinates": {
      "latitude": 33.7361,
      "longitude": -118.2639
    },
    "address": "425 S Palos Verdes St, San Pedro, CA 90731, USA"
  },
  "destination": {
    "name": "Port of New York",
    "coordinates": {
      "latitude": 40.6892,
      "longitude": -74.0445
    },
    "address": "1 Bay St, Staten Island, NY 10301, USA"
  },
  "cargo": {
    "description": "Electronics and Computer Parts",
    "weight": 15000,
    "value": 250000,
    "category": "Electronics"
  },
  "carrier": {
    "name": "Global Shipping Co.",
    "contact": "+1-555-0123"
  },
  "estimatedArrival": "2024-01-15T10:00:00.000Z"
}
```

#### POST /shipments/:id/update-location
Update the current location of a shipment.

**Request Body:**
```json
{
  "location": {
    "name": "Chicago Hub",
    "coordinates": {
      "latitude": 41.8781,
      "longitude": -87.6298
    },
    "address": "Chicago, IL, USA"
  },
  "status": "in_transit",
  "notes": "Arrived at Chicago distribution center"
}
```

#### GET /shipments/:id/eta
Get ETA information for a shipment.

**Response:**
```json
{
  "estimatedArrival": "2024-01-15T10:00:00.000Z",
  "currentETA": "2024-01-15T10:00:00.000Z",
  "distanceRemaining": 1250,
  "currentLocation": {...},
  "destination": {...}
}
```

#### PUT /shipments/:id
Update shipment details.

#### DELETE /shipments/:id
Delete a shipment.

## 🗄️ Database Schema

### Shipment Model

```javascript
{
  shipmentId: String (unique),
  containerId: String,
  route: [LocationSchema],
  currentLocation: LocationSchema,
  destination: LocationSchema,
  origin: LocationSchema,
  status: String (enum: ['pending', 'in_transit', 'delivered', 'delayed', 'cancelled']),
  estimatedArrival: Date,
  actualArrival: Date,
  cargo: {
    description: String,
    weight: Number,
    value: Number,
    category: String
  },
  carrier: {
    name: String,
    contact: String
  },
  trackingHistory: [{
    location: LocationSchema,
    status: String,
    notes: String,
    timestamp: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Location Schema

```javascript
{
  name: String,
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  address: String,
  timestamp: Date
}
```

## 🔧 Available Scripts

```bash
# Start server in development mode with auto-reload
npm run dev

# Start server in production mode
npm start

# Run tests (if implemented)
npm test

# Seed database with sample data
node seedData.js
```

## 🧪 Sample Data

The `seedData.js` file contains sample shipments for testing:

- **SH001**: Los Angeles → New York (In Transit)
- **SH002**: Seattle → Miami (In Transit)
- **SH003**: Houston → Boston (Delivered)

Run the seeder:
```bash
node seedData.js
```

## 🔍 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

Error responses follow this format:
```json
{
  "message": "Error description"
}
```

## 🚀 Deployment

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Configure proper CORS settings
4. Set up process management (PM2, Docker, etc.)

### MongoDB Atlas Setup

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get the connection string
4. Update `MONGODB_URI` in your environment

### Heroku Deployment

1. Create a Heroku app
2. Set environment variables
3. Deploy the code
4. Scale the dynos

## 🔒 Security Considerations

- Input validation on all endpoints
- CORS configuration for production
- Rate limiting (recommended for production)
- Authentication/authorization (not implemented)
- Data sanitization

## 📊 Performance

- Database indexing on frequently queried fields
- Pagination for large datasets
- Efficient aggregation queries
- Connection pooling with Mongoose

## 🐛 Debugging

Enable debug logging:
```bash
DEBUG=app:* npm run dev
```

Common issues:
- MongoDB connection errors
- Port conflicts
- Missing environment variables
- CORS issues in production
