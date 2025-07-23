import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          🚢 Cargo Tracker
        </Link>
        
        <div className="navbar-menu">
          <Link 
            to="/" 
            className={`navbar-item ${location.pathname === '/' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/create" 
            className={`navbar-item ${location.pathname === '/create' ? 'active' : ''}`}
          >
            Create Shipment
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
