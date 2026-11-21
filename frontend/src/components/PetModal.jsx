import React from 'react';
import { X, Heart, MapPin, Calendar, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PetModal = ({ pet, isOpen, onClose }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  if (!isOpen || !pet) return null;

  const handleAdoptClick = () => {
    onClose();
    if (isAuthenticated) {
      navigate('/dashboard/adopter');
    } else {
      navigate('/login?redirect=adopter');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(6px)',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '680px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <X size={20} />
        </button>

        {/* Pet Image Banner */}
        <div style={{ position: 'relative', height: '320px', width: '100%' }}>
          <img
            src={pet.image}
            alt={pet.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '24px',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  backgroundColor: '#15803d',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {pet.status || 'Ready for Adoption'}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(4px)',
                  color: '#ffffff',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {pet.gender}
              </span>
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
              {pet.name}
            </h2>
            <p style={{ fontSize: '16px', color: '#e2e8f0', opacity: 0.95 }}>
              {pet.breed} • {pet.age}
            </p>
          </div>
        </div>

        {/* Pet Details Content */}
        <div style={{ padding: '28px' }}>
          {/* Quick Metrics */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '12px', color: '#64748b' }}>Location</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#1e293b' }}>
                <MapPin size={15} color="#15803d" /> {pet.location}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '12px', color: '#64748b' }}>Age</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#1e293b' }}>
                <Calendar size={15} color="#ea580c" /> {pet.age}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '12px 16px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
              }}
            >
              <span style={{ fontSize: '12px', color: '#64748b' }}>Health Vetted</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600, color: '#15803d' }}>
                <ShieldCheck size={16} /> Fully Vaccinated
              </div>
            </div>
          </div>

          {/* About Pet */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
              About {pet.name}
            </h4>
            <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
              {pet.description ||
                `${pet.name} was rescued by our community rapid response team. Loving, playful, and well-socialized with both other animals and children. Looking for an affectionate forever home where they can receive the warmth and care they deserve.`}
            </p>
          </div>

          {/* Personality Tags */}
          <div style={{ marginBottom: '24px' }}>
            <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
              Personality & Traits
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {(pet.traits || ['Affectionate', 'House Trained', 'Vaccinated', 'Friendly', 'Microchipped']).map(
                (trait, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#166534',
                      border: '1px solid #bbf7d0',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <CheckCircle2 size={13} color="#15803d" /> {trait}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Actions */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              onClick={onClose}
              className="btn btn-ghost"
              style={{ padding: '10px 20px', fontSize: '15px' }}
            >
              Close
            </button>
            <button
              onClick={handleAdoptClick}
              className="btn btn-secondary"
              style={{ padding: '12px 28px', fontSize: '15px', fontWeight: 700 }}
            >
              <Heart size={18} fill="#ffffff" /> Apply to Adopt {pet.name}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetModal;
