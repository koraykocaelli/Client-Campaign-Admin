import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/Navbar.css';

const Navbar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
      localStorage.removeItem('role'); // Remove role from localStorage
      navigate('/'); // Redirect to Login page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={role === 'admin' ? '/dashboard' : '/add-campaign'} className="navbar-logo">
          {role === 'admin' ? 'Admin Dashboard' : 'Add Campaign'}
        </Link>
        {role === 'admin' && (
          <div className="navbar-tabs">
            <Link to="/clients" className={`navbar-item ${location.pathname === '/clients' ? 'active' : ''}`}>
              Clients
            </Link>
            <Link to="/staff" className={`navbar-item ${location.pathname === '/staff' ? 'active' : ''}`}>
              Staff
            </Link>
            <Link to="/campaigns" className={`navbar-item ${location.pathname === '/campaigns' ? 'active' : ''}`}>
              Campaigns
            </Link>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
