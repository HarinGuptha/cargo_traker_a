import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ShipmentDetails from './pages/ShipmentDetails';
import CreateShipment from './pages/CreateShipment';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/shipments/:id" element={<ShipmentDetails />} />
              <Route path="/create" element={<CreateShipment />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
