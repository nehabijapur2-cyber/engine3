import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'bi-house-door-fill', roles: ['All'] },
  { id: 'animal_mgmt', label: 'Animal Management', icon: 'bi-collection-play-fill', roles: ['Admin', 'Veterinarian', 'Rescue Volunteer'] },
  { id: 'report', label: 'Report an Animal', icon: 'bi-shield-plus', roles: ['All'] },
  { id: 'available', label: 'Available Animals', icon: 'bi-grid-fill', roles: ['All'] },
  { id: 'search', label: 'Search Animals', icon: 'bi-search-heart', roles: ['All'] },
  { id: 'adoption', label: 'Adoption Applications', icon: 'bi-file-earmark-check-fill', roles: ['Admin', 'Adopter', 'Rescue Volunteer'] },
  { id: 'rescue', label: 'Rescue Management', icon: 'bi-heart-pulse-fill', roles: ['Admin', 'Rescue Volunteer', 'Veterinarian'] },
  { id: 'priority', label: 'Rescue Priority Ranking', icon: 'bi-bar-chart-steps', roles: ['Admin', 'Rescue Volunteer', 'Veterinarian', 'General User'] },
  { id: 'veterinary', label: 'Veterinary & Emergency Care', icon: 'bi-hospital-fill', roles: ['All'] },
  { id: 'education', label: 'Animal Care Guidelines', icon: 'bi-book-half', roles: ['All'] },
  { id: 'donations', label: 'Donations & Expenses', icon: 'bi-wallet2', roles: ['Admin', 'Donor', 'General User'] },
  { id: 'reports', label: 'Reports', icon: 'bi-file-text-fill', roles: ['Admin', 'Veterinarian', 'Rescue Volunteer', 'Donor'] },
  { id: 'users', label: 'User Management', icon: 'bi-people-fill', roles: ['Admin'] },
  { id: 'profile', label: 'My Profile', icon: 'bi-person-circle', roles: ['All'] },
  { id: 'logout', label: 'Logout', icon: 'bi-box-arrow-left', roles: ['All'] },
];

const Sidebar = ({ activeTab, onSelectTab, isOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const userName = user?.fullName || 'Sneha Kiranagi';
  const userRole = user?.role || 'Admin';

  const handleClick = (item) => {
    if (item.id === 'logout') {
      logout();
      window.location.href = '/login';
      return;
    }
    if (item.id === 'available') {
      navigate('/adoption');
      return;
    }
    if (item.id === 'animal_mgmt') {
      navigate('/animals');
      return;
    }
    if (item.id === 'search') {
      navigate('/search');
      return;
    }
    if (item.id === 'adoption') {
      navigate('/adoption-applications');
      return;
    }
    if (item.id === 'report') {
      navigate('/report-animal');
      return;
    }
    if (item.id === 'rescue' || item.id === 'priority') {
      navigate('/rescue-reports');
      return;
    }
    if (item.id === 'veterinary') {
      if (userRole === 'Veterinarian') {
        navigate('/medical-records');
      } else {
        navigate('/veterinary-care');
      }
      return;
    }
    if (item.id === 'education') {
      navigate('/veterinary-care');
      return;
    }
    onSelectTab(item.id);
  };

  return (
    <aside className={`dashboard-sidebar ${isOpen ? 'open' : ''}`}>
      <div>
        {/* Brand / Logo */}
        <div className="sidebar-brand">
          <div className="brand-icon-box">
            🐾
          </div>
          <div>
            <h4 className="brand-name">PetRescue</h4>
            <small className="brand-sub">Rescue • Care • Adopt</small>
          </div>
        </div>

        {/* 14 Navigation Menu Items */}
        <ul className="sidebar-nav-list">
          {NAV_ITEMS.map((item) => {
            const isAllowed = userRole === 'Admin' || item.roles.includes('All') || item.roles.includes(userRole);
            if (!isAllowed) return null;

            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleClick(item)}
                >
                  <i className={`bi ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Decorative Faint Paws */}
      <div className="sidebar-faint-paws">
        <span className="faint-paw p1">🐾</span>
        <span className="faint-paw p2">🐾</span>
        <span className="faint-paw p3">🐾</span>
      </div>

      {/* User Profile Card at Bottom */}
      <div>
        <div className="sidebar-user-card" onClick={() => onSelectTab('profile')} style={{ cursor: 'pointer' }}>
          <img
            src="/assets/images/avatar_sidebar.jpg"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
            }}
            alt={userName}
            className="sidebar-avatar"
          />
          <div style={{ overflow: 'hidden' }}>
            <div className="sidebar-user-name" title={userName}>
              {userName}
            </div>
            <span className="sidebar-user-role-badge">{userRole}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
