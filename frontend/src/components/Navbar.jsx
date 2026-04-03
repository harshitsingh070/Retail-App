import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('cart');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-title">Meridian Home & Lifestyle</h1>
      </div>

      <div className="navbar-center">
        <a href="/inventory" className="nav-link">Inventory</a>
        <a href="/billing" className="nav-link">Billing</a>
        <a href="/ai" className="nav-link recommendations-link">Recommendations</a>
        {role === 'admin' && <a href="/admin" className="nav-link admin-link">📊 Admin Panel</a>}
      </div>

      <div className="navbar-right">
        <span className="user-info">
          {username} <span className="role-badge">{role}</span>
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}
