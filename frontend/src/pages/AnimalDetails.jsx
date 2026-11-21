import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  Heart,
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Activity,
  Home,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdoptionFormModal from '../components/AdoptionFormModal';

const AnimalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [adoptModalOpen, setAdoptModalOpen] = useState(false);

  const fetchAnimal = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.get(`http://localhost:5000/api/animals/${id}`);
      if (res.data.success && res.data.data) {
        setAnimal(res.data.data);
      } else {
        setErrorMessage('Animal record not found.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Error loading animal profile details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimal();
  }, [id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '100px 20px', textAlign: 'center' }}>
        <PawPrint size={48} className="animate-spin" style={{ color: '#15803d', marginBottom: '16px' }} />
        <h3 style={{ color: '#14532d', fontWeight: 800 }}>Retrieving Animal Profile...</h3>
      </div>
    );
  }

  if (errorMessage || !animal) {
    return (
      <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', border: '1px solid #e7e3db' }}>
          <AlertCircle size={48} style={{ color: '#dc2626', marginBottom: '16px' }} />
          <h3 style={{ color: '#1f2937', fontWeight: 800 }}>Profile Unavailable</h3>
          <p style={{ color: '#64748b', marginBottom: '24px' }}>{errorMessage || 'Animal record not found.'}</p>
          <Link to="/adoption" className="btn btn-success" style={{ backgroundColor: '#15803d', borderRadius: '12px' }}>
            <ArrowLeft size={16} /> Return to Adoption Directory
          </Link>
        </div>
      </div>
    );
  }

  const isCow = animal.category === 'Cow';
  const isAdopted = animal.adoption_eligibility === 'Adopted';
  const isSanctuary = animal.adoption_eligibility === 'Shelter & Rehabilitation';

  const galleryRoute =
    animal.category === 'Dog'
      ? '/adoption/dogs'
      : animal.category === 'Cow'
      ? '/adoption/cows'
      : '/adoption/cats';

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '32px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '14px' }}>
          <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Dashboard
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <Link to="/adoption" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Adoption Portal
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <Link to={galleryRoute} style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            {animal.category}s
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>{animal.name}</span>
        </div>

        {/* Back Link */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            to={galleryRoute}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#15803d',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '14px',
            }}
          >
            <ArrowLeft size={18} /> Back to {animal.category} Gallery
          </Link>
        </div>

        {/* Main Profile Grid */}
        <div className="row g-4 mb-4">
          {/* Left Column: Photograph & Badges */}
          <div className="col-lg-5">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '1px solid #e7e3db',
                boxShadow: '0 12px 30px rgba(27, 43, 31, 0.08)',
                position: 'sticky',
                top: '20px',
              }}
            >
              <div style={{ position: 'relative', height: '400px' }}>
                <img
                  src={animal.image_url}
                  alt={animal.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Eligibility Status */}
                <span
                  style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    backgroundColor: isAdopted
                      ? 'rgba(75, 85, 99, 0.95)'
                      : isSanctuary
                      ? 'rgba(180, 83, 9, 0.95)'
                      : 'rgba(21, 128, 61, 0.95)',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 700,
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    backdropFilter: 'blur(4px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {animal.adoption_eligibility}
                </span>
              </div>

              {/* Photo Caption Box */}
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                      {animal.name}
                    </h2>
                    <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>{animal.breed}</span>
                  </div>
                  <span
                    style={{
                      backgroundColor: '#ecfdf5',
                      color: '#15803d',
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      border: '1px solid #a7f3d0',
                    }}
                  >
                    {animal.category}
                  </span>
                </div>

                {/* 4 Mini Stat Pills */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Age</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{animal.age}</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Gender</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{animal.gender}</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Location</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{animal.location}</div>
                  </div>
                  <div style={{ backgroundColor: '#f8fafc', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Vaccine</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803d' }}>{animal.vaccination_status}</div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  disabled={isAdopted}
                  onClick={() => setAdoptModalOpen(true)}
                  className="btn w-100"
                  style={{
                    backgroundColor: isAdopted ? '#94a3b8' : isCow ? '#b45309' : '#15803d',
                    color: '#ffffff',
                    padding: '14px',
                    borderRadius: '16px',
                    fontWeight: 800,
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: isAdopted ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 18px rgba(20, 83, 45, 0.2)',
                  }}
                >
                  {isAdopted ? (
                    'Happily Adopted'
                  ) : isCow ? (
                    <>
                      <Heart size={20} /> Apply for Cow Sanctuary Care / Sponsorship
                    </>
                  ) : (
                    <>
                      <PawPrint size={20} /> Adopt {animal.name} Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Comprehensive Rescue & Care History */}
          <div className="col-lg-7">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* 1. Rescue Story & Background */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e7e3db',
                  boxShadow: '0 6px 18px rgba(27, 43, 31, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#ecfdf5',
                      color: '#15803d',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🐾
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: '#14532d' }}>
                    Rescue Story & Background
                  </h3>
                </div>

                <p style={{ color: '#374151', fontSize: '15px', lineHeight: 1.7, marginBottom: '20px' }}>
                  {animal.description}
                </p>

                <div
                  style={{
                    backgroundColor: '#fafaf9',
                    borderRadius: '14px',
                    padding: '16px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '24px',
                    border: '1px solid #f5f5f4',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                      Rescue Location
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <MapPin size={14} color="#dc2626" />
                      {animal.rescue_location || animal.location}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 600, textTransform: 'uppercase' }}>
                      Rescue Date
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1c1917', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Calendar size={14} color="#15803d" />
                      {animal.rescue_date || 'October 2026'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Health & Veterinary Triage */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e7e3db',
                  boxShadow: '0 6px 18px rgba(27, 43, 31, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      color: '#2563eb',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🩺
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: '#1e3a8a' }}>
                    Health & Veterinary Status
                  </h3>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Clinical Condition</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
                        {animal.health_condition}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div style={{ backgroundColor: '#f0fdf4', padding: '16px', borderRadius: '14px', border: '1px solid #bbf7d0' }}>
                      <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Vaccination Status</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#14532d', marginTop: '4px' }}>
                        {animal.vaccination_status}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Medical & Recovery History:
                  </h5>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {animal.medical_history || 'Routine shelter veterinary intake completed. Full deworming, clinical triage, and rabies immunization recorded.'}
                  </p>
                </div>
              </div>

              {/* 3. Behavior & Care Requirements */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '24px',
                  padding: '28px',
                  border: '1px solid #e7e3db',
                  boxShadow: '0 6px 18px rgba(27, 43, 31, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      backgroundColor: '#fef3c7',
                      color: '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    🏡
                  </div>
                  <h3 style={{ margin: 0, fontWeight: 800, fontSize: '20px', color: '#78350f' }}>
                    Behavior & Care Requirements
                  </h3>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Temperament & Social Behavior:
                  </h5>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6 }}>
                    {animal.behavior_notes || 'Friendly, social, bonds easily with human caregivers and enjoys quiet companionship.'}
                  </p>
                </div>

                <div>
                  <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                    Recommended Care & Living Environment:
                  </h5>
                  <p style={{ color: '#475569', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {animal.care_requirements || 'Nutritious meals twice daily, regular veterinary boosters, gentle interaction and safe shelter.'}
                  </p>
                </div>
              </div>

              {/* 4. Welfare Guarantee Notice */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  borderRadius: '18px',
                  padding: '20px 24px',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <ShieldCheck size={32} color="#15803d" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
                  <strong>Lifelong Animal Welfare Support:</strong> PetRescue provides complimentary post-adoption
                  veterinary consultations and lifetime shelter support for all our rescued companions.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Adoption Form Modal */}
      {adoptModalOpen && (
        <AdoptionFormModal
          animal={animal}
          isOpen={adoptModalOpen}
          onClose={() => setAdoptModalOpen(false)}
          onSuccess={() => {
            fetchAnimal();
          }}
        />
      )}
    </div>
  );
};

export default AnimalDetails;
