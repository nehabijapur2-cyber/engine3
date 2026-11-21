import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  Search,
  Filter,
  RotateCcw,
  MapPin,
  Heart,
  Eye,
  Activity,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  Shield,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_FILTER_OPTIONS = [
  { value: 'All', label: 'All Statuses' },
  { value: 'Available for Adoption', label: 'Available for Adoption' },
  { value: 'Rescued', label: 'Rescued' },
  { value: 'Reported', label: 'Reported' },
  { value: 'Under Treatment', label: 'Under Treatment' },
  { value: 'In Shelter', label: 'In Shelter / Sanctuary' },
];

const HEALTH_FILTER_OPTIONS = [
  { value: 'All', label: 'All Health Conditions' },
  { value: 'Healthy', label: 'Healthy' },
  { value: 'Under Treatment', label: 'Under Treatment' },
  { value: 'Recovered', label: 'Recovered' },
];

const AnimalSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Filter states initialized from URL params if present
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || 'All');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [selectedHealth, setSelectedHealth] = useState(searchParams.get('health') || 'All');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'All');

  // Data states
  const [animals, setAnimals] = useState([]);
  const [locationsList, setLocationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch distinct locations for filter dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/animals/locations');
        if (res.data.success && Array.isArray(res.data.data)) {
          setLocationsList(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      }
    };
    fetchLocations();
  }, []);

  // Fetch animals with combined search and multi-filtering
  const fetchAnimals = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) {
        params.append('search', searchQuery.trim());
      }
      if (selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (selectedGender !== 'All') {
        params.append('gender', selectedGender);
      }
      if (selectedStatus !== 'All') {
        params.append('status', selectedStatus);
      }
      if (selectedHealth !== 'All') {
        params.append('health_condition', selectedHealth);
      }
      if (selectedLocation !== 'All') {
        params.append('location', selectedLocation);
      }

      const res = await axios.get(`http://localhost:5000/api/animals?${params.toString()}`);
      if (res.data.success) {
        setAnimals(res.data.data || []);
      } else {
        setAnimals([]);
      }
    } catch (err) {
      console.error('Error fetching animals:', err);
      setErrorMsg('Failed to load animal records. Please verify the server connection.');
      setAnimals([]);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch on filter change
  useEffect(() => {
    fetchAnimals();
  }, [selectedCategory, selectedGender, selectedStatus, selectedHealth, selectedLocation]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAnimals();
  };

  // Check if any filter is actively applied
  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedGender !== 'All' ||
    selectedStatus !== 'All' ||
    selectedHealth !== 'All' ||
    selectedLocation !== 'All';

  // Clear all filters handler
  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGender('All');
    setSelectedStatus('All');
    setSelectedHealth('All');
    setSelectedLocation('All');
    setSearchParams({});

    // Immediate reload with empty query
    axios
      .get('http://localhost:5000/api/animals')
      .then((res) => {
        if (res.data.success) setAnimals(res.data.data || []);
      })
      .catch((e) => console.error(e));
  };

  // Helper for status badge styling
  const getStatusBadge = (animal) => {
    const s = animal.status || animal.adoption_eligibility || 'Available for Adoption';
    if (s.toLowerCase().includes('available')) {
      return <span className="badge bg-success text-white px-2 py-1 rounded-pill">Available for Adoption</span>;
    }
    if (s.toLowerCase().includes('treatment')) {
      return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">🩺 Under Treatment</span>;
    }
    if (s.toLowerCase().includes('adopted')) {
      return <span className="badge text-white px-2 py-1 rounded-pill" style={{ backgroundColor: '#9333ea' }}>❤️ Adopted</span>;
    }
    if (s.toLowerCase().includes('shelter') || s.toLowerCase().includes('sanctuary')) {
      return <span className="badge text-white px-2 py-1 rounded-pill" style={{ backgroundColor: '#0284c7' }}>🏡 In Shelter / Sanctuary</span>;
    }
    if (s.toLowerCase().includes('reported')) {
      return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">⚠️ Reported</span>;
    }
    return <span className="badge bg-info text-dark px-2 py-1 rounded-pill">🚑 Rescued</span>;
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '36px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>

        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Animal Search & Registry</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              to="/adoption"
              className="btn btn-outline-success btn-sm"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              🐾 Adoption Categories
            </Link>
            <Link
              to="/report-animal"
              className="btn btn-outline-danger btn-sm"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              🚨 Report Animal in Need
            </Link>
          </div>
        </div>

        {/* Header Hero Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
            borderRadius: '24px',
            padding: '36px 40px',
            color: '#ffffff',
            marginBottom: '32px',
            boxShadow: '0 12px 28px rgba(20, 83, 45, 0.16)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '780px', position: 'relative', zIndex: 2 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255,255,255,0.16)',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '12px',
              }}
            >
              🔍 Animal Search & Multi-Field Filtering
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.2 }}>
              Find & Rescue Shelter Animals
            </h1>
            <p style={{ color: '#dcfce7', fontSize: '16px', margin: 0, lineHeight: 1.6 }}>
              Search our live database of rescued Indian street dogs, desi cows, and community cats by name, breed, gender, health condition, and shelter location.
            </p>
          </div>
        </div>

        {/* SEARCH AND MULTI-FILTER CONTROL CONSOLE */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '24px 28px',
            border: '1px solid #e2e8f0',
            marginBottom: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          }}
        >
          {/* Main Search Input Form */}
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search by animal name, category (Dog, Cat, Cow), breed, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  borderRadius: '14px',
                  paddingLeft: '44px',
                  paddingRight: '120px',
                  height: '48px',
                  fontSize: '15px',
                  borderColor: '#cbd5e1',
                }}
              />
              <Search
                size={20}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '14px',
                  color: '#94a3b8',
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchAnimals();
                  }}
                  style={{
                    position: 'absolute',
                    right: '84px',
                    top: '14px',
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                  }}
                  title="Clear search input"
                >
                  <X size={18} />
                </button>
              )}
              <button
                type="submit"
                className="btn btn-success"
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '6px',
                  backgroundColor: '#15803d',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  padding: '7px 18px',
                }}
              >
                Search
              </button>
            </div>
          </form>

          {/* 5 Dropdown Filters Row */}
          <div className="row g-3 align-items-center">
            {/* 1. Category Filter */}
            <div className="col-lg col-md-4 col-sm-6">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Category
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ borderRadius: '10px', height: '40px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">🐾 All Categories</option>
                <option value="Dog">🐶 Dogs</option>
                <option value="Cat">🐱 Cats</option>
                <option value="Cow">🐮 Cows</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* 2. Gender Filter */}
            <div className="col-lg col-md-4 col-sm-6">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Gender
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                style={{ borderRadius: '10px', height: '40px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* 3. Status Filter */}
            <div className="col-lg col-md-4 col-sm-6">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Animal Status
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ borderRadius: '10px', height: '40px', fontSize: '13px', fontWeight: 600 }}
              >
                {STATUS_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Health Condition Filter */}
            <div className="col-lg col-md-4 col-sm-6">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Health Condition
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedHealth}
                onChange={(e) => setSelectedHealth(e.target.value)}
                style={{ borderRadius: '10px', height: '40px', fontSize: '13px', fontWeight: 600 }}
              >
                {HEALTH_FILTER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Location Filter */}
            <div className="col-lg col-md-4 col-sm-6">
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>
                Shelter Location
              </label>
              <select
                className="form-select form-select-sm"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{ borderRadius: '10px', height: '40px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">All Locations</option>
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear All Filters Button */}
            {hasActiveFilters && (
              <div className="col-lg-auto col-md-4 col-sm-6 d-flex align-items-end">
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="btn btn-outline-danger btn-sm w-100"
                  style={{
                    borderRadius: '10px',
                    height: '40px',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    marginTop: '19px',
                  }}
                  title="Clear all active filters"
                >
                  <RotateCcw size={14} /> Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Active Filter Tags Row */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Active Filters:</span>

              {searchQuery && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Search: "{searchQuery}"
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                </span>
              )}
              {selectedCategory !== 'All' && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Category: {selectedCategory}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedCategory('All')} />
                </span>
              )}
              {selectedGender !== 'All' && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Gender: {selectedGender}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedGender('All')} />
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Status: {selectedStatus}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedStatus('All')} />
                </span>
              )}
              {selectedHealth !== 'All' && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Health: {selectedHealth}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedHealth('All')} />
                </span>
              )}
              {selectedLocation !== 'All' && (
                <span className="badge bg-light text-dark border px-2 py-1 rounded-pill d-flex align-items-center gap-1" style={{ fontSize: '12px' }}>
                  Location: {selectedLocation}
                  <X size={12} style={{ cursor: 'pointer' }} onClick={() => setSelectedLocation('All')} />
                </span>
              )}

              <button
                type="button"
                onClick={handleClearAllFilters}
                className="btn btn-link btn-sm text-danger p-0 ms-auto"
                style={{ fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* RESULTS HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              Matching Animal Profiles
            </h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>
              Showing {animals.length} {animals.length === 1 ? 'animal' : 'animals'} from sanctuary database
            </span>
          </div>
        </div>

        {/* ERROR ALERT */}
        {errorMsg && (
          <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center gap-2" role="alert">
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ANIMAL CARDS GRID */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <PawPrint size={40} className="animate-spin text-success mb-2" />
            <div style={{ fontSize: '15px', fontWeight: 600 }}>Loading animal profiles...</div>
          </div>
        ) : animals.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px dashed #cbd5e1',
            }}
          >
            <PawPrint size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
            <h4 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>No Animals Found</h4>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              No animals in our database match your current search and filter criteria. Try clearing your filters.
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearAllFilters}
                className="btn btn-success"
                style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, padding: '10px 24px' }}
              >
                <RotateCcw size={16} className="me-2" /> Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {animals.map((animal) => {
              const isCow = animal.category === 'Cow';
              const isAdopted = animal.status === 'Adopted' || animal.adoption_eligibility === 'Adopted';
              const isAvailable = animal.status === 'Available for Adoption' || animal.adoption_eligibility === 'Available for Adoption';

              return (
                <div className="col-lg-4 col-md-6 col-12" key={animal._id}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 18px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    }}
                  >
                    {/* Animal Photo with Status Badge Overlay */}
                    <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden' }}>
                      <img
                        src={animal.image_url || '/assets/images/pet_rocky.jpg'}
                        alt={animal.name}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease',
                        }}
                        onError={(e) => {
                          e.target.src = '/assets/images/pet_rocky.jpg';
                        }}
                      />
                      {/* Floating Status Badge */}
                      <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                        {getStatusBadge(animal)}
                      </div>
                      {/* Floating Category Badge */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '14px',
                          left: '14px',
                          backgroundColor: 'rgba(20, 83, 45, 0.88)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                        }}
                      >
                        {animal.category === 'Dog' ? '🐶 Dog' : animal.category === 'Cat' ? '🐱 Cat' : '🐮 Desi Cow'}
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div style={{ padding: '22px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Name & Breed */}
                      <div style={{ marginBottom: '12px' }}>
                        <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '0 0 2px 0' }}>
                          {animal.name}
                        </h4>
                        <div style={{ fontSize: '13px', color: '#64748b' }}>
                          {animal.breed || 'Indian Indie'}
                        </div>
                      </div>

                      {/* 4 Quick Info Pills Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
                        <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Age</span>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>{animal.age || 'Unknown'}</span>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Gender</span>
                          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#1e293b' }}>{animal.gender || 'Unknown'}</span>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Condition</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#15803d', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {animal.health_condition || 'Healthy'}
                          </span>
                        </div>
                        <div style={{ backgroundColor: '#f8fafc', padding: '8px 10px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                          <span style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>Vaccine</span>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                            {animal.vaccination_status || 'Pending'}
                          </span>
                        </div>
                      </div>

                      {/* Location Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748b', marginBottom: '18px' }}>
                        <MapPin size={15} color="#15803d" style={{ flexShrink: 0 }} />
                        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {animal.location || 'Bengaluru Sanctuary Shelter'}
                        </span>
                      </div>

                      {/* Actions Footer */}
                      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {/* View Details Button (Always Available) */}
                        <Link
                          to={`/adoption/animal/${animal._id}`}
                          className="btn btn-outline-success btn-sm w-100"
                          style={{
                            borderRadius: '12px',
                            fontWeight: 700,
                            padding: '9px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontSize: '13px',
                          }}
                        >
                          <Eye size={15} /> View Full Profile & Details
                        </Link>

                        {/* Adoption / Sanctuary Action */}
                        {isAdopted ? (
                          <div
                            style={{
                              backgroundColor: '#f3e8ff',
                              color: '#6b21a8',
                              borderRadius: '12px',
                              padding: '8px',
                              textAlign: 'center',
                              fontSize: '12px',
                              fontWeight: 700,
                            }}
                          >
                            ❤️ Happily Adopted to Forever Family
                          </div>
                        ) : isCow ? (
                          <Link
                            to={`/adoption/animal/${animal._id}`}
                            className="btn btn-sm w-100"
                            style={{
                              backgroundColor: '#d97706',
                              color: '#ffffff',
                              borderRadius: '12px',
                              fontWeight: 700,
                              padding: '9px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              fontSize: '13px',
                            }}
                          >
                            <Heart size={15} /> Sanctuary & Cow Rehabilitation
                          </Link>
                        ) : isAvailable ? (
                          <Link
                            to={`/adoption/animal/${animal._id}`}
                            className="btn btn-success btn-sm w-100"
                            style={{
                              backgroundColor: '#15803d',
                              borderRadius: '12px',
                              fontWeight: 700,
                              padding: '9px 14px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              fontSize: '13px',
                            }}
                          >
                            <PawPrint size={15} /> Adopt {animal.name}
                          </Link>
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              borderRadius: '12px',
                              padding: '8px',
                              textAlign: 'center',
                              fontSize: '12px',
                              fontWeight: 600,
                            }}
                          >
                            🩺 Active Shelter Medical Care
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
    </div>
  );
};

export default AnimalSearch;
