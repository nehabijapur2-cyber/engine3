import React from 'react';
import { X, Sparkles, PawPrint, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const NoticeModal = ({ isOpen, onClose, title, moduleName, description }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '520px',
          width: '100%',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header decoration */}
        <div
          style={{
            background: 'linear-gradient(135deg, #15803d, #166534)',
            padding: '28px 24px 20px',
            color: '#ffffff',
            position: 'relative',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, marginBottom: '12px' }}>
            <Sparkles size={14} /> Roadmap Module
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            {title || `${moduleName} Module`}
          </h3>
          <p style={{ fontSize: '14px', color: '#bbf7d0', opacity: 0.9 }}>
            Part of the Pet Rescue & Animal Welfare Platform
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ea580c',
                flexShrink: 0,
              }}
            >
              <PawPrint size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#1f2937', marginBottom: '4px' }}>
                Development Status: Phase 2 Upcoming
              </h4>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5 }}>
                {description ||
                  `The ${moduleName} module is currently scheduled for development in the upcoming phases of the college project. For Phase 1, our Home Page, Authentication System, and Role Routing are fully operational.`}
              </p>
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '13px',
              color: '#475569',
              marginBottom: '20px',
            }}
          >
            <strong style={{ color: '#0f172a' }}>Currently Available in Phase 1:</strong>
            <ul style={{ paddingLeft: '18px', marginTop: '6px', lineHeight: 1.6 }}>
              <li>Full Landing Page with hero, features, rescue statistics & pet catalog</li>
              <li>Role-based MongoDB & JWT Authentication (Login & Register)</li>
              <li>Support for 5 distinct roles (User, Adopter, Volunteer, Vet, Donor)</li>
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              onClick={onClose}
              className="btn btn-outline"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Understood
            </button>
            <Link
              to="/login"
              onClick={onClose}
              className="btn btn-primary"
              style={{ padding: '10px 20px', fontSize: '14px' }}
            >
              Go to Login <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal;
