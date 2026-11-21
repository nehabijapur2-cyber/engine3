import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  Heart,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Eye,
  PlusCircle,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AdoptionFormModal from '../components/AdoptionFormModal';
import AdminAnimalModal from '../components/AdminAnimalModal';

const AdoptionGallery = () => {
  const { category: categoryParam } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  // Map route param to DB category
  const resolvedCategory =
    categoryParam?.toLowerCase() === 'dogs'
      ? 'Dog'
      : categoryParam?.toLowerCase() === 'cows'
      ? 'Cow'
      : categoryParam?.toLowerCase() === 'cats'
      ? 'Cat'
      : 'Dog';

  const categoryTitle =
    resolvedCategory === 'Dog'
      ? 'Indian Street Dogs & Puppies'
      : resolvedCategory === 'Cow'
      ? 'Indian Desi Cows & Calves (Gaushala Sanctuary)'
      : 'Indian Street Cats & Kittens';

  const categorySubtitle =
    resolvedCategory === 'Dog'
      ? 'Devoted, resilient Indie pariah dogs waiting for compassionate forever homes.'
      : resolvedCategory === 'Cow'
      ? 'Protected indigenous cattle sheltered under Gaushala rehabilitation and fodder sponsorship.'
      : 'Sweet domestic stray cats and rescued kittens looking for safe indoor companions.';

  const isCowCategory = resolvedCategory === 'Cow';

  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');

  // Modals state
  const [selectedAnimalForAdopt, setSelectedAnimalForAdopt] = useState(null);
  const [animalToEdit, setAnimalToEdit] = useState(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const fetchAnimals = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/animals?category=${resolvedCategory}`
      );
      if (res.data.success) {
        setAnimals(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching animals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, [resolvedCategory]);

  const handleDelete = async (id, name) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/animals/${id}`);
      if (res.data.success) {
        setDeleteConfirmation(null);
        fetchAnimals();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete animal record');
    }
  };

  // Filtered animals
  const filteredAnimals = animals.filter((animal) => {
    const matchesSearch =
      animal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      animal.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = genderFilter === 'All' || animal.gender === genderFilter;
    const matchesHealth = healthFilter === 'All' || animal.health_condition.includes(healthFilter);

    return matchesSearch && matchesGender && matchesHealth;
  });

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '32px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
          <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Dashboard
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <Link to="/adoption" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Adoption Portal
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>{categoryTitle}</span>
        </div>

        {/* Gallery Header Banner */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            border: '1px solid #e7e3db',
            boxShadow: '0 8px 24px rgba(27, 43, 31, 0.05)',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ fontSize: '28px' }}>
                {resolvedCategory === 'Dog' ? '🐶' : resolvedCategory === 'Cow' ? '🐮' : '🐱'}
              </span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                {categoryTitle}
              </h1>
            </div>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0, maxWidth: '680px' }}>
              {categorySubtitle}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/adoption"
              className="btn btn-outline-success"
              style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} /> All Categories
            </Link>

            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setAnimalToEdit(null);
                  setAdminModalOpen(true);
                }}
                className="btn btn-success"
                style={{
                  backgroundColor: '#15803d',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <PlusCircle size={18} /> Add {resolvedCategory}
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid #e7e3db',
            marginBottom: '32px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '260px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder={`Search ${resolvedCategory}s by name, breed, location...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 16px 10px 42px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>

          {/* Gender Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Gender:</span>
            <div className="btn-group" role="group">
              {['All', 'Male', 'Female'].map((gen) => (
                <button
                  key={gen}
                  type="button"
                  className={`btn btn-sm ${genderFilter === gen ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setGenderFilter(gen)}
                  style={{ borderRadius: '8px', padding: '6px 14px', fontSize: '13px' }}
                >
                  {gen}
                </button>
              ))}
            </div>
          </div>

          {/* Category Switcher Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Link
              to="/adoption/dogs"
              className={`btn btn-sm ${resolvedCategory === 'Dog' ? 'btn-dark' : 'btn-light'}`}
              style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}
            >
              Dogs
            </Link>
            <Link
              to="/adoption/cows"
              className={`btn btn-sm ${resolvedCategory === 'Cow' ? 'btn-dark' : 'btn-light'}`}
              style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}
            >
              Cows
            </Link>
            <Link
              to="/adoption/cats"
              className={`btn btn-sm ${resolvedCategory === 'Cat' ? 'btn-dark' : 'btn-light'}`}
              style={{ borderRadius: '9999px', fontSize: '12px', fontWeight: 600 }}
            >
              Cats
            </Link>
          </div>
        </div>

        {/* Animals Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <PawPrint size={40} className="animate-spin" style={{ color: '#15803d', marginBottom: '12px' }} />
            <h4>Loading {resolvedCategory} profiles from MongoDB...</h4>
          </div>
        ) : filteredAnimals.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e7e3db',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🐾</div>
            <h4 style={{ color: '#1f2937', fontWeight: 700 }}>No animals found matching criteria</h4>
            <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              Try clearing your search query or gender filter to view available {resolvedCategory.toLowerCase()}s.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setGenderFilter('All');
              }}
              className="btn btn-outline-success"
              style={{ borderRadius: '12px' }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {filteredAnimals.map((animal) => {
              const isAdopted = animal.adoption_eligibility === 'Adopted';
              const isSanctuary = animal.adoption_eligibility === 'Shelter & Rehabilitation';

              return (
                <div className="col-lg-4 col-md-6" key={animal._id}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #e7e3db',
                      boxShadow: '0 8px 24px rgba(27, 43, 31, 0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px)';
                      e.currentTarget.style.boxShadow = '0 18px 35px rgba(27, 43, 31, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(27, 43, 31, 0.06)';
                    }}
                  >
                    {/* Animal Photograph */}
                    <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                      <img
                        src={animal.image_url}
                        alt={animal.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.35s ease',
                        }}
                      />

                      {/* Eligibility Status Pill */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          backgroundColor: isAdopted
                            ? 'rgba(75, 85, 99, 0.9)'
                            : isSanctuary
                            ? 'rgba(180, 83, 9, 0.9)'
                            : 'rgba(21, 128, 61, 0.9)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {animal.adoption_eligibility}
                      </span>

                      {/* Age & Gender Pill */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          backgroundColor: 'rgba(15, 23, 42, 0.85)',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 600,
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          backdropFilter: 'blur(4px)',
                        }}
                      >
                        {animal.age} • {animal.gender}
                      </span>
                    </div>

                    {/* Animal Card Details */}
                    <div
                      style={{
                        padding: '24px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        flexGrow: 1,
                      }}
                    >
                      <div>
                        {/* Name & Breed */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div>
                            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                              {animal.name}
                            </h3>
                            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
                              {animal.breed}
                            </div>
                          </div>
                          <span
                            style={{
                              backgroundColor: '#ecfdf5',
                              color: '#15803d',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              border: '1px solid #bbf7d0',
                            }}
                          >
                            {animal.category}
                          </span>
                        </div>

                        {/* Location */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#64748b',
                            fontSize: '13px',
                            marginBottom: '14px',
                          }}
                        >
                          <MapPin size={14} color="#dc2626" />
                          <span>{animal.location}</span>
                        </div>

                        {/* Health & Vaccination Badges */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                          <span
                            style={{
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            🩺 {animal.health_condition}
                          </span>
                          <span
                            style={{
                              backgroundColor: '#dcfce7',
                              color: '#166534',
                              fontSize: '11px',
                              fontWeight: 600,
                              padding: '4px 10px',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <ShieldCheck size={12} /> {animal.vaccination_status}
                          </span>
                        </div>

                        {/* Description excerpt */}
                        <p
                          style={{
                            color: '#4b5563',
                            fontSize: '13px',
                            lineHeight: 1.5,
                            marginBottom: '20px',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {animal.description}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: isAdmin ? '10px' : 0 }}>
                          <Link
                            to={`/adoption/animal/${animal._id}`}
                            className="btn btn-outline-success"
                            style={{
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '13px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                            }}
                          >
                            <Eye size={15} /> View Details
                          </Link>

                          <button
                            type="button"
                            disabled={isAdopted}
                            onClick={() => setSelectedAnimalForAdopt(animal)}
                            className="btn btn-success"
                            style={{
                              backgroundColor: isAdopted ? '#94a3b8' : isCowCategory ? '#b45309' : '#15803d',
                              borderColor: isAdopted ? '#94a3b8' : isCowCategory ? '#b45309' : '#15803d',
                              borderRadius: '12px',
                              fontWeight: 700,
                              fontSize: '13px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              cursor: isAdopted ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {isAdopted ? (
                              'Adopted'
                            ) : isCowCategory ? (
                              <>
                                <Heart size={15} /> Apply Care
                              </>
                            ) : (
                              <>
                                <PawPrint size={15} /> Adopt Now
                              </>
                            )}
                          </button>
                        </div>

                        {/* Admin Controls */}
                        {isAdmin && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              paddingTop: '10px',
                              borderTop: '1px solid #f1f5f9',
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setAnimalToEdit(animal);
                                setAdminModalOpen(true);
                              }}
                              className="btn btn-sm btn-outline-primary"
                              style={{ flex: 1, borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            >
                              <Edit size={14} /> Edit Record
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmation(animal)}
                              className="btn btn-sm btn-outline-danger"
                              style={{ borderRadius: '8px', fontSize: '12px', padding: '6px 12px' }}
                              title="Delete Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Adoption Form Modal */}
      {selectedAnimalForAdopt && (
        <AdoptionFormModal
          animal={selectedAnimalForAdopt}
          isOpen={!!selectedAnimalForAdopt}
          onClose={() => setSelectedAnimalForAdopt(null)}
          onSuccess={() => {
            fetchAnimals();
          }}
        />
      )}

      {/* Admin Edit/Create Animal Modal */}
      {isAdmin && (
        <AdminAnimalModal
          animalToEdit={animalToEdit}
          isOpen={adminModalOpen}
          onClose={() => {
            setAdminModalOpen(false);
            setAnimalToEdit(null);
          }}
          onSaved={() => {
            fetchAnimals();
          }}
        />
      )}

      {/* Admin Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1070,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '440px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
              }}
            >
              <Trash2 size={28} />
            </div>
            <h4 style={{ fontWeight: 800, color: '#1f2937', marginBottom: '8px' }}>
              Confirm Removal
            </h4>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              Are you sure you want to remove <strong>{deleteConfirmation.name}</strong> from the shelter registry?
              This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-outline-secondary w-100"
                style={{ borderRadius: '12px' }}
                onClick={() => setDeleteConfirmation(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger w-100"
                style={{ borderRadius: '12px', fontWeight: 700 }}
                onClick={() => handleDelete(deleteConfirmation._id, deleteConfirmation.name)}
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionGallery;
