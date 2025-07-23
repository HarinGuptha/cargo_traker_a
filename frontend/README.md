# Cargo Tracker Frontend

React frontend application for the Cargo Shipment Tracker with Redux state management and interactive maps.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Preview production build**
   ```bash
   npm run preview
   ```

## 🛠️ Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Client-side routing
- **React Leaflet** - Interactive maps
- **Leaflet** - Map library
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── FilterBar.jsx   # Shipment filtering
│   ├── LoadingSpinner.jsx
│   ├── LocationUpdateForm.jsx
│   ├── Navbar.jsx      # Navigation bar
│   ├── ShipmentMap.jsx # Interactive map
│   └── ShipmentTable.jsx
├── pages/              # Page components
│   ├── CreateShipment.jsx
│   ├── Dashboard.jsx   # Main dashboard
│   └── ShipmentDetails.jsx
├── store/              # Redux store
│   ├── slices/
│   │   └── shipmentSlice.js
│   └── index.js        # Store configuration
├── App.jsx             # Main app component
├── App.css             # Global styles
└── main.jsx            # Entry point
```

## 🗺️ Map Features

The application uses **React Leaflet** for interactive maps:

### Map Components
- **Origin Marker** (Green): Starting point
- **Destination Marker** (Red): End point
- **Current Location** (Blue): Current position
- **Route Points** (Orange): Intermediate stops
- **Route Line** (Dashed): Path visualization

### Map Interactions
- Click markers for detailed information
- Automatic bounds fitting for optimal view
- Responsive design for mobile devices
- Legend for marker identification

### Map Configuration
```javascript
// Default map settings
center: [calculated from route points]
zoom: 6 (auto-adjusted)
tiles: OpenStreetMap (no API key required)
```

## 🔄 State Management

### Redux Store Structure

```javascript
{
  shipments: {
    shipments: [],           // Array of shipments
    currentShipment: null,   // Selected shipment
    loading: false,          // Loading state
    error: null,             // Error messages
    totalPages: 1,           // Pagination info
    currentPage: 1,
    total: 0,
    filters: {               // Filter state
      status: '',
      containerId: ''
    },
    eta: null               // ETA information
  }
}
```

## 🎨 Styling

### CSS Architecture
- Component-specific CSS files
- Global styles in `App.css`
- Responsive design with CSS Grid and Flexbox
- Mobile-first approach

### Color Scheme
- Primary: `#3498db` (Blue)
- Secondary: `#95a5a6` (Gray)
- Success: `#27ae60` (Green)
- Warning: `#f39c12` (Orange)
- Danger: `#e74c3c` (Red)
- Text: `#2c3e50` (Dark Gray)

## 🚀 Build and Deployment

### Development Build
```bash
npm run dev
```
Starts development server with hot reload at `http://localhost:5173`

### Production Build
```bash
npm run build
```
Creates optimized production build in `dist/` directory

### Preview Production Build
```bash
npm run preview
```
Serves production build locally for testing

## 🔧 Configuration

### API Configuration
Update the API base URL in `src/store/slices/shipmentSlice.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api'; // Development
// const API_BASE_URL = 'https://your-api.com/api'; // Production
```

## 🐛 Troubleshooting

### Common Issues

1. **Map not loading**
   - Check internet connection
   - Verify Leaflet CSS is imported
   - Check browser console for errors

2. **API connection errors**
   - Verify backend server is running
   - Check API base URL configuration
   - Verify CORS settings on backend

3. **Build errors**
   - Clear node_modules and reinstall
   - Check for dependency conflicts
   - Verify Node.js version compatibility
