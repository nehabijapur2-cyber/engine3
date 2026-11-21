import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PawPrint, Menu, X, User, LogOut, LayoutDashboard, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoticeModal from './NoticeModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, title: '', moduleName: '', description: '' });
  const { user, isAuthenticated, logout, getDashboardRoute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (moduleName, description, anchor = null) => {
    setMobileMenuOpen(false);
    if (anchor && location.pathname === '/') {
      const el = document.getElementById(anchor);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    if (anchor && location.pathname !== '/') {
      navigate(`/#${anchor}`);
      return;
    }

    setModalState({
      isOpen: true,
      title: `${moduleName} Module`,
      moduleName,
      description,
    });
  };

  const navLinks = [
    { label: 'Home', path: '/', isRoute: true },
    {
      label: 'About Us',
      action: () => handleNavClick('About Us', null, 'about-section'),
    },
    {
      label: 'Rescue Cases',
      path: '/rescue-reports',
      isRoute: true,
    },
    {
      label: 'Report Animal',
      path: '/report-animal',
      isRoute: true,
    },
    {
      label: 'Adopt a Pet',
      path: '/adoption',
      isRoute: true,
    },
    {
      label: 'Search Animals',
      path: '/search',
      isRoute: true,
    },
    {
      label: 'Animal Registry',
      path: '/animals',
      isRoute: true,
    },
    {
      label: 'Adoption Applications',
      path: '/adoption-applications',
      isRoute: true,
    },
    {
      label: 'Veterinary Care',
      path: '/veterinary-care',
      isRoute: true,
    },
    {
      label: 'Education Hub',
      action: () =>
        handleNavClick(
          'Education Hub',
          'Our Animal Welfare Education Hub features guides on humane care, pet nutrition, school workshops, and legal rights for stray animals.'
        ),
    },
  ];

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(250, 247, 242, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #e7e3db',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '76px',
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textDecoration: 'none',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #15803d, #166534)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(21, 128, 61, 0.3)',
              }}
            >
              <PawPrint size={24} />
            </div>
            <div>
              <span
                style={{
                  fontSize: '21px',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  color: '#143521',
                  letterSpacing: '-0.5px',
                  display: 'block',
                  lineHeight: 1.1,
                }}
              >
                Pet<span style={{ color: '#ea580c' }}>Rescue</span>
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#15803d',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                Animal Welfare
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '28px',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item, idx) =>
              item.isRoute ? (
                <Link
                  key={idx}
                  to={item.path}
                  style={{
                    fontSize: '15px',
                    fontWeight: location.pathname === item.path ? 700 : 500,
                    color: location.pathname === item.path ? '#15803d' : '#374151',
                    transition: 'color 0.2s',
                    position: 'relative',
                    padding: '6px 0',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#15803d')}
                  onMouseLeave={(e) =>
                    (e.target.style.color =
                      location.pathname === item.path ? '#15803d' : '#374151')
                  }
                >
                  {item.label}
                  {location.pathname === item.path && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#15803d',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={item.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: '#374151',
                    cursor: 'pointer',
                    padding: '6px 0',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#15803d')}
                  onMouseLeave={(e) => (e.target.style.color = '#374151')}
                >
                  {item.label}
                </button>
              )
            )}
          </nav>

          {/* Desktop Auth Buttons */}
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '12px',
            }}
            className="desktop-auth"
          >
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Link
                  to={typeof getDashboardRoute === 'function' ? getDashboardRoute(user.role) : '/dashboard'}
                  className="btn btn-outline"
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    borderRadius: '9999px',
                  }}
                >
                  <LayoutDashboard size={16} />
                  <span>{user.role} Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-ghost"
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    color: '#ef4444',
                  }}
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn-ghost"
                  style={{
                    padding: '9px 18px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                  style={{
                    padding: '9px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              color: '#1f2937',
              cursor: 'pointer',
              padding: '8px',
            }}
            className="mobile-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              backgroundColor: '#FAF7F2',
              borderTop: '1px solid #e7e3db',
              padding: '20px 24px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            {navLinks.map((item, idx) =>
              item.isRoute ? (
                <Link
                  key={idx}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: location.pathname === item.path ? '#15803d' : '#374151',
                    padding: '8px 0',
                  }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={item.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#374151',
                    cursor: 'pointer',
                    padding: '8px 0',
                  }}
                >
                  {item.label}
                </button>
              )
            )}

            <hr style={{ borderColor: '#e7e3db', margin: '4px 0' }} />

            {isAuthenticated && user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Signed in as <strong>{user?.fullName}</strong> ({user?.role})
                </div>
                <Link
                  to={typeof getDashboardRoute === 'function' ? getDashboardRoute(user.role) : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <LayoutDashboard size={18} /> Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="btn btn-outline"
                  style={{ width: '100%', borderColor: '#ef4444', color: '#ef4444' }}
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-outline"
                  style={{ flex: 1 }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Responsive media query styling injection */}
      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
      `}</style>

      {/* Module Roadmap Notice Modal */}
      <NoticeModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, title: '', moduleName: '', description: '' })}
        title={modalState.title}
        moduleName={modalState.moduleName}
        description={modalState.description}
      />
    </>
  );
};

export default Navbar;
