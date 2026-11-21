import React from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Heart,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ShieldAlert,
} from 'lucide-react';

const Footer = ({ onOpenModal }) => {
  return (
    <footer
      style={{
        backgroundColor: '#143521',
        color: '#f1ede4',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '4px solid #15803d',
      }}
    >
      {/* Top Emergency Rescue Banner */}
      <div
        style={{
          backgroundColor: '#ea580c',
          color: '#ffffff',
          padding: '14px 20px',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={22} />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>
              Animal Distress or Emergency Injured Stray?
            </span>
            <span style={{ fontSize: '14px', opacity: 0.9 }}>
              Our 24/7 rescue ambulances are on standby.
            </span>
          </div>
          <a
            href="tel:1800-738-7372"
            style={{
              backgroundColor: '#ffffff',
              color: '#c2410c',
              padding: '6px 18px',
              borderRadius: '9999px',
              fontSize: '14px',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <PhoneCall size={16} /> 1-800-PET-RESCUE (Toll Free)
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container" style={{ padding: '60px 24px 30px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '40px',
            marginBottom: '48px',
          }}
        >
          {/* Column 1: Brand & Mission */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#143521',
                }}
              >
                <PawPrint size={22} />
              </div>
              <span
                style={{
                  fontSize: '22px',
                  fontWeight: 800,
                  fontFamily: 'Outfit, sans-serif',
                  color: '#ffffff',
                }}
              >
                Pet<span style={{ color: '#fb923c' }}>Rescue</span>
              </span>
            </div>

            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#bbf7d0', marginBottom: '20px' }}>
              Every Life Deserves Love and Care. We are dedicated to rescuing stray, abandoned, and injured animals, providing life-saving veterinary treatment, and finding warm forever homes.
            </p>

            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: <Facebook size={18} />, label: 'Facebook' },
                { icon: <Instagram size={18} />, label: 'Instagram' },
                { icon: <Twitter size={18} />, label: 'Twitter' },
                { icon: <Youtube size={18} />, label: 'YouTube' },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#social"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onOpenModal) onOpenModal(social.label, 'Connect with our official community pages.');
                  }}
                  aria-label={social.label}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#e2e8f0',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#22c55e';
                    e.currentTarget.style.color = '#143521';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.color = '#e2e8f0';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                position: 'relative',
                paddingBottom: '8px',
              }}
            >
              Quick Navigation
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#fb923c',
                }}
              />
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Home Page', to: '/' },
                { label: 'About Our Mission', to: '/#about-section' },
                { label: 'Available Pets for Adoption', to: '/#pets-section' },
                { label: 'Login to Portal', to: '/login' },
                { label: 'Register New Account', to: '/register' },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.to}
                    style={{
                      fontSize: '14px',
                      color: '#cbd5e1',
                      transition: 'color 0.2s',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#4ade80')}
                    onMouseLeave={(e) => (e.target.style.color = '#cbd5e1')}
                  >
                    › {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Programs */}
          <div>
            <h4
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                position: 'relative',
                paddingBottom: '8px',
              }}
            >
              Animal Programs
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#fb923c',
                }}
              />
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                'Emergency Animal Rescue',
                'Shelter Rehabilitation Care',
                'Free Stray Vaccination Drives',
                'Community Spay & Neuter',
                'School Animal Welfare Workshops',
              ].map((prog, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      if (onOpenModal) onOpenModal(prog, `Our ${prog} initiative runs throughout the year with dedicated veterinary support and volunteer patrols.`);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#cbd5e1',
                      textAlign: 'left',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#4ade80')}
                    onMouseLeave={(e) => (e.target.style.color = '#cbd5e1')}
                  >
                    › {prog}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h4
              style={{
                fontSize: '17px',
                fontWeight: 700,
                color: '#ffffff',
                marginBottom: '18px',
                position: 'relative',
                paddingBottom: '8px',
              }}
            >
              Contact & Shelter
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '32px',
                  height: '2px',
                  backgroundColor: '#fb923c',
                }}
              />
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <MapPin size={18} color="#4ade80" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>42 Green Haven Sanctuary, Animal Welfare Campus, Cityville</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <PhoneCall size={18} color="#4ade80" style={{ flexShrink: 0 }} />
                <span>+1 (800) 738-7372 / +1 (555) 019-2831</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <Mail size={18} color="#4ade80" style={{ flexShrink: 0 }} />
                <span>help@petrescue-welfare.org</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#cbd5e1' }}>
                <Clock size={18} color="#4ade80" style={{ flexShrink: 0 }} />
                <span>Shelter: 8:00 AM - 7:00 PM | Rescue: 24/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '24px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '14px',
            fontSize: '13px',
            color: '#94a3b8',
          }}
        >
          <div>
            © {new Date().getFullYear()} Pet Rescue and Animal Welfare Platform. Built for College Mini-Project Phase 1.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Crafted with</span>
            <Heart size={14} fill="#ea580c" color="#ea580c" />
            <span>for innocent lives everywhere.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
