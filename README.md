# Cargo Shipment Tracker

A full-stack MERN application for tracking cargo shipments with real-time location updates, interactive maps, and comprehensive shipment management.

## 🚀 Features

- **Dashboard**: View all shipments with filtering and sorting capabilities
- **Real-time Tracking**: Track shipment locations with interactive maps
- **Route Visualization**: See complete shipment routes with markers
- **Location Updates**: Manually update shipment locations
- **ETA Calculation**: Automatic estimated time of arrival calculations
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful API**: Complete backend API for shipment management

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Leaflet** - Interactive maps
- **Axios** - HTTP client
- **Vite** - Build tool

## 📁 Project Structure

```
cargo_traker/
├── backend/                 # Node.js/Express backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   ├── seedData.js         # Sample data seeder
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── store/          # Redux store and slices
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cargo_traker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cargo_tracker
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cargo_tracker
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

### Seeding Sample Data

To populate the database with sample shipments:

```bash
cd backend
node seedData.js
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Shipments

- `GET /shipments` - Get all shipments (with pagination and filtering)
- `GET /shipments/:id` - Get shipment by ID
- `POST /shipments` - Create new shipment
- `PUT /shipments/:id` - Update shipment
- `DELETE /shipments/:id` - Delete shipment
- `POST /shipments/:id/update-location` - Update shipment location
- `GET /shipments/:id/eta` - Get shipment ETA information

### Query Parameters

#### GET /shipments
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `status` - Filter by status (pending, in_transit, delivered, delayed, cancelled)
- `containerId` - Search by container ID

## 🗺️ Map Integration

The application uses **Leaflet** with **OpenStreetMap** tiles for interactive maps. Features include:

- **Origin/Destination Markers**: Green for origin, red for destination
- **Current Location**: Blue marker showing current position
- **Route Visualization**: Dashed line showing the shipment route
- **Interactive Popups**: Click markers for detailed information
- **Responsive Design**: Maps adapt to different screen sizes

## 🔧 Configuration

### Backend Configuration

The backend uses the following environment variables:

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

### Frontend Configuration

The frontend is configured to connect to the backend API at `http://localhost:5000/api`. For production, update the API base URL in:

```javascript
// src/store/slices/shipmentSlice.js
const API_BASE_URL = 'your-production-api-url';
```

## 🚢 Usage

### Creating a Shipment

1. Click "Create New Shipment" on the dashboard
2. Fill in the shipment details:
   - Container ID
   - Origin and destination (use quick select or manual entry)
   - Cargo information (description, weight, value, category)
   - Carrier details
   - Estimated arrival (optional)
3. Submit the form

### Tracking a Shipment

1. Click on any shipment ID in the dashboard
2. View the detailed shipment information
3. See the interactive map with route visualization
4. Check tracking history timeline

### Updating Location

1. Open shipment details
2. Click "Update Location"
3. Select from predefined locations or enter custom coordinates
4. Add status update and notes
5. Submit the update

## 🔍 Assumptions Made

1. **Coordinates**: All locations use decimal degrees (latitude/longitude)
2. **Distance Calculation**: Uses Haversine formula for straight-line distance
3. **ETA Calculation**: Simple calculation based on average speed (60 km/h)
4. **Currency**: All monetary values are in USD
5. **Time Zone**: All timestamps are stored in UTC
6. **Map Tiles**: Uses free OpenStreetMap tiles (no API key required)
7. **Authentication**: No authentication implemented (public access)

## 🐳 Docker Support (Optional)

Docker configuration files can be added for containerized deployment:

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/cargo_tracker
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo_data:
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please open an issue in the repository.
