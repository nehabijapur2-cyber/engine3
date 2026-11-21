import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TopNavbar = ({ onSearch, onToggleMobileMenu, onOpenProfile }) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const userName = user?.fullName || 'Sneha Kiranagi';
  const userRole = user?.role || 'Admin';

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header className="dashboard-topbar">
      {/* Mobile Toggle Button */}
      <button
        type="button"
        className="btn btn-outline-success d-lg-none me-2"
        onClick={onToggleMobileMenu}
        style={{ borderRadius: '10px' }}
      >
        <i className="bi bi-list fs-5"></i>
      </button>

      {/* Global Search Pill Input */}
      <form className="topbar-search-form" onSubmit={handleSearchSubmit}>
        <div className="search-pill-container">
          <input
            type="text"
            className="search-pill-input"
            placeholder="Search for animals, reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-pill-btn" title="Search">
            <i className="bi bi-search"></i>
          </button>
        </div>
      </form>

      {/* Center Decorative Green Paw */}
      <div className="d-none d-md-block topbar-paw" title="Animal Welfare First">
        🐾
      </div>

      {/* Right Side Actions */}
      <div className="topbar-right-actions">
        {/* Notification Bell with Badge 3 */}
        <div className="topbar-bell" title="3 Active Emergency Rescue Notifications">
          <i className="bi bi-bell-fill"></i>
          <span className="topbar-bell-badge">3</span>
        </div>

        {/* User Profile Pill */}
        <div className="topbar-user-pill" onClick={onOpenProfile} title={`Profile: ${userName} (${userRole})`}>
          <img
            src="/assets/images/avatar_sneha.jpg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
            }}
            alt={userName}
            className="topbar-user-avatar"
          />
          <span className="d-none d-sm-inline topbar-user-name">
            {userName} <i className="bi bi-chevron-down small text-muted ms-1"></i>
          </span>
        </div>

        {/* Logout Green Pill Button */}
        <button type="button" className="topbar-logout-btn" onClick={handleLogout} title="Sign Out">
          <span>Logout</span> <i className="bi bi-arrow-right-short fs-5"></i>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
