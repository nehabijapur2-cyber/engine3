import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  ArrowRight,
  Heart,
  ShieldCheck,
  Sparkles,
  PlusCircle,
  FileText,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdminAnimalModal from '../components/AdminAnimalModal';

const AdoptionLanding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [categoriesData, setCategoriesData] = useState({
    dogs: { available: 6, total: 7 },
    cows: { available: 6, total: 6 },
    cats: { available: 6, total: 6 },
  });

  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/animals/categories/summary');
      if (res.data.success && res.data.data) {
        setCategoriesData(res.data.data);
      }
    } catch (err) {
      console.warn('Using default category stats:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const CATEGORIES = [
    {
      id: 'dogs',
      name: 'Indian Street Dogs',
      route: '/adoption/dogs',
      photo: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80',
      description:
        'Resilient, highly intelligent and devoted Indie pariah dogs and puppies looking for loving forever homes.',
      availableCount: categoriesData.dogs?.available ?? 6,
      badgeText: 'Household Adoption',
      badgeColor: '#15803d',
      badgeBg: '#dcfce7',
      accentColor: '#166534',
    },
    {
      id: 'cows',
      name: 'Indian Desi Cows',
      route: '/adoption/cows',
      photo: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      description:
        'Indigenous Gir, Sahiwal and Tharparkar cows sheltered in Gaushalas. Support with rehabilitation & fodder sponsorship.',
      availableCount: categoriesData.cows?.available ?? 6,
      badgeText: 'Gaushala Sanctuary Care',
      badgeColor: '#b45309',
      badgeBg: '#fef3c7',
      accentColor: '#92400e',
    },
    {
      id: 'cats',
      name: 'Indian Street Cats',
      route: '/adoption/cats',
      photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      description:
        'Gentle, litter-trained domestic stray cats and affectionate rescue kittens ready to brighten your indoor home.',
      availableCount: categoriesData.cats?.available ?? 6,
      badgeText: 'Indoor Adoption',
      badgeColor: '#0284c7',
      badgeBg: '#e0f2fe',
      accentColor: '#0369a1',
    },
  ];

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '40px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px' }}>
          <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Dashboard
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Adoption Portal</span>
        </div>

        {/* Hero Title Section */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
            borderRadius: '28px',
            padding: '48px 40px',
            color: '#ffffff',
            boxShadow: '0 20px 40px rgba(20, 83, 45, 0.15)',
            marginBottom: '40px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Decorative Paws */}
          <div
            style={{
              position: 'absolute',
              right: '20px',
              top: '10px',
              fontSize: '110px',
              opacity: 0.1,
              userSelect: 'none',
            }}
          >
            🐾
          </div>

          <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.18)',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              🐾 Humane Adoption & Care
            </span>
            <h1
              style={{
                fontSize: '38px',
                fontWeight: 800,
                marginBottom: '12px',
                letterSpacing: '-0.5px',
              }}
            >
              Find Your Perfect Companion
            </h1>
            <p
              style={{
                fontSize: '18px',
                lineHeight: 1.6,
                color: '#dcfce7',
                marginBottom: '28px',
                maxWidth: '640px',
              }}
            >
              Every animal deserves love, care and a safe home. Explore rescued Indian street dogs, desi cows, and
              cats awaiting compassionate human bonds.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
              <Link
                to="/adoption-applications"
                className="btn btn-light"
                style={{
                  borderRadius: '14px',
                  padding: '12px 24px',
                  fontWeight: 700,
                  color: '#14532d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <FileText size={18} /> View My Applications
              </Link>

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="btn btn-warning"
                  style={{
                    borderRadius: '14px',
                    padding: '12px 24px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <PlusCircle size={18} /> Register New Animal (Admin)
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#1f2937', marginBottom: '8px' }}>
            Choose an Animal Category
          </h2>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '580px', margin: '0 auto' }}>
            Select a category below to browse individual animal profiles, rescue details, and start your adoption or
            sanctuary care request.
          </p>
        </div>

        {/* 3 Large Category Cards Grid */}
        <div className="row g-4 mb-5">
          {CATEGORIES.map((cat) => (
            <div className="col-lg-4 col-md-6" key={cat.id}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid #e7e3db',
                  boxShadow: '0 10px 25px rgba(27, 43, 31, 0.06)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-6px)';
                  e.currentTarget.style.boxShadow = '0 18px 35px rgba(27, 43, 31, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(27, 43, 31, 0.06)';
                }}
              >
                {/* Category Photograph */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={cat.photo}
                    alt={cat.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                  />
                  {/* Category Type Badge */}
                  <span
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      backgroundColor: cat.badgeBg,
                      color: cat.badgeColor,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  >
                    {cat.badgeText}
                  </span>

                  {/* Available Count Pill */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      right: '16px',
                      backgroundColor: 'rgba(15, 23, 42, 0.85)',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <PawPrint size={14} color="#86efac" />
                    {cat.availableCount} Available
                  </span>
                </div>

                {/* Card Body */}
                <div
                  style={{
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', marginBottom: '10px' }}>
                      {cat.name}
                    </h3>
                    <p style={{ color: '#4b5563', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                      {cat.description}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '14px',
                        marginBottom: '20px',
                        border: '1px solid #edf2f7',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: '#64748b' }}>Status</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803d' }}>
                        ● Active Shelter Care
                      </span>
                    </div>

                    <Link
                      to={cat.route}
                      className="btn w-100"
                      style={{
                        backgroundColor: '#15803d',
                        color: '#ffffff',
                        padding: '12px',
                        borderRadius: '14px',
                        fontWeight: 700,
                        fontSize: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        textDecoration: 'none',
                        transition: 'background-color 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#166534')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                    >
                      Explore {cat.name} <ArrowRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Welfare Commitment Banner */}
        <div
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '20px',
            padding: '24px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
              }}
            >
              💚
            </div>
            <div>
              <h5 style={{ margin: 0, fontWeight: 700, color: '#14532d' }}>
                Every Indian Street Animal Receives Comprehensive Medical Triage
              </h5>
              <p style={{ margin: 0, fontSize: '13px', color: '#166534' }}>
                All animals are vaccinated, dewormed, behaviorally evaluated, and cared for before entering our
                adoption program.
              </p>
            </div>
          </div>
          <Link
            to="/dashboard"
            className="btn btn-outline-success"
            style={{ borderRadius: '12px', padding: '8px 20px', fontWeight: 600 }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Admin New Animal Modal */}
      {isAdmin && (
        <AdminAnimalModal
          isOpen={adminModalOpen}
          onClose={() => setAdminModalOpen(false)}
          onSaved={() => {
            fetchSummary();
          }}
        />
      )}
    </div>
  );
};

export default AdoptionLanding;
