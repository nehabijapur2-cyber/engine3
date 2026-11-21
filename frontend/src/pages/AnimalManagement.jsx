import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  Plus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Archive,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Heart,
  Activity,
  Shield,
  MapPin,
  Calendar,
  Grid,
  List,
  RotateCcw,
  Check,
  Info,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = [
  'Reported',
  'Rescued',
  'Under Treatment',
  'Recovered',
  'Available for Adoption',
  'Adopted',
  'In Shelter',
  'Rehabilitating',
];

const AnimalManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isStaff = isAdmin || user?.role === 'Veterinarian' || user?.role === 'Rescue Volunteer' || user?.role === 'Rescue Volunteer / Administrator';

  // Data states
  const [animals, setAnimals] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    under_treatment: 0,
    rescued: 0,
    adopted: 0,
    in_shelter: 0,
    archived: 0,
  });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  // View state: 'grid' or 'table'
  const [viewMode, setViewMode] = useState('grid');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [showArchived, setShowArchived] = useState(false);

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const initialFormState = {
    name: '',
    category: 'Dog',
    breed: '',
    age: '1 Year',
    gender: 'Male',
    location: 'Bengaluru Sanctuary Shelter',
    health_condition: 'Healthy & Active',
    vaccination_status: 'Vaccinated',
    status: 'Available for Adoption',
    rescue_status: 'Rescued',
    adoption_eligibility: 'Available for Adoption',
    image_url: '',
    description: '',
    care_requirements: '',
    rescue_date: new Date().toISOString().split('T')[0],
    rescue_location: 'Bengaluru',
    medical_history: '',
    behavior_notes: '',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formImagePreview, setFormImagePreview] = useState('');
  const [formError, setFormError] = useState('');

  // Filters active check
  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedStatus !== 'All' ||
    selectedGender !== 'All' ||
    searchQuery.trim() !== '' ||
    showArchived !== false;

  // Clear all filters handler
  const handleClearFilters = () => {
    setSelectedCategory('All');
    setSelectedStatus('All');
    setSelectedGender('All');
    setShowArchived(false);
    setSearchQuery('');
    loadData({
      selectedCategory: 'All',
      selectedStatus: 'All',
      selectedGender: 'All',
      showArchived: false,
      searchQuery: '',
    });
  };

  // Fetch stats and animal records
  const loadData = async (overrideParams = {}) => {
    setLoading(true);
    try {
      // 1. Fetch statistics
      const statsRes = await axios.get('http://localhost:5000/api/animals/stats');
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // 2. Fetch animals
      const queryParams = new URLSearchParams();
      const archived = overrideParams.showArchived !== undefined ? overrideParams.showArchived : showArchived;
      const category = overrideParams.selectedCategory !== undefined ? overrideParams.selectedCategory : selectedCategory;
      const status = overrideParams.selectedStatus !== undefined ? overrideParams.selectedStatus : selectedStatus;
      const gender = overrideParams.selectedGender !== undefined ? overrideParams.selectedGender : selectedGender;
      const search = overrideParams.searchQuery !== undefined ? overrideParams.searchQuery : searchQuery;

      if (archived) {
        queryParams.append('includeArchived', 'true');
      }
      if (category !== 'All') {
        queryParams.append('category', category);
      }
      if (status !== 'All') {
        queryParams.append('status', status);
      }
      if (gender !== 'All') {
        queryParams.append('gender', gender);
      }
      if (search && search.trim()) {
        queryParams.append('search', search.trim());
      }

      const res = await axios.get(`http://localhost:5000/api/animals?${queryParams.toString()}`);
      if (res.data.success) {
        setAnimals(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching animals:', err);
      setFeedback({ type: 'error', message: 'Failed to load animal records. Check server connection.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, selectedStatus, selectedGender, showArchived]);

  // Handle Search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadData();
  };

  // Handle Photo selection with FileReader
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFormError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB. Please choose a smaller photo.');
      return;
    }

    setFormError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormImagePreview(reader.result);
      setFormData((prev) => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Open Add Modal
  const openAddModal = () => {
    setFormData(initialFormState);
    setFormImagePreview('/assets/images/pet_rocky.jpg');
    setFormError('');
    setAddModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (animal) => {
    setSelectedAnimal(animal);
    setFormData({
      name: animal.name || '',
      category: animal.category || 'Dog',
      breed: animal.breed || '',
      age: animal.age || '',
      gender: animal.gender || 'Male',
      location: animal.location || '',
      health_condition: animal.health_condition || 'Healthy',
      vaccination_status: animal.vaccination_status || 'Vaccinated',
      status: animal.status || animal.adoption_eligibility || 'Available for Adoption',
      rescue_status: animal.rescue_status || 'Rescued',
      adoption_eligibility: animal.adoption_eligibility || 'Available for Adoption',
      image_url: animal.image_url || '',
      description: animal.description || '',
      care_requirements: animal.care_requirements || '',
      rescue_date: animal.rescue_date || '',
      rescue_location: animal.rescue_location || '',
      medical_history: animal.medical_history || '',
      behavior_notes: animal.behavior_notes || '',
    });
    setFormImagePreview(animal.image_url || '/assets/images/pet_rocky.jpg');
    setFormError('');
    setEditModalOpen(true);
  };

  // Open Delete / Archive Modal
  const openDeleteModal = (animal) => {
    setSelectedAnimal(animal);
    setDeleteModalOpen(true);
  };

  // Handle Category Change in form (apply Cow rules)
  const handleCategoryChange = (newCat) => {
    let newElig = formData.adoption_eligibility;
    let newStatus = formData.status;

    if (newCat === 'Cow') {
      newElig = 'Shelter & Rehabilitation';
      if (newStatus === 'Available for Adoption') {
        newStatus = 'In Shelter';
      }
    } else {
      if (newElig === 'Shelter & Rehabilitation' && newCat !== 'Other') {
        newElig = 'Available for Adoption';
      }
    }

    setFormData((prev) => ({
      ...prev,
      category: newCat,
      adoption_eligibility: newElig,
      status: newStatus,
    }));
  };

  // Submit Add Animal Form
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Animal name is required.');
      return;
    }
    if (!formData.breed.trim()) {
      setFormError('Breed is required.');
      return;
    }
    if (!formData.age.trim()) {
      setFormError('Age is required.');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Shelter / Sanctuary location is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post('http://localhost:5000/api/animals', formData);
      if (res.data.success) {
        setFeedback({ type: 'success', message: `Animal '${formData.name}' added successfully!` });
        setAddModalOpen(false);
        loadData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save animal record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Edit Animal Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim()) {
      setFormError('Animal name is required.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/animals/${selectedAnimal._id}`, formData);
      if (res.data.success) {
        setFeedback({ type: 'success', message: `Animal '${formData.name}' updated successfully in database!` });
        setEditModalOpen(false);
        loadData();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update animal record.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Archive / Delete Action
  const handleArchiveConfirm = async (isHardDelete = false) => {
    if (!selectedAnimal) return;
    setSubmitting(true);
    try {
      const res = await axios.delete(`http://localhost:5000/api/animals/${selectedAnimal._id}`, {
        data: {
          hard: isHardDelete,
          reason: `Removed from active registry by ${user?.fullName || 'Administrator'}.`,
        },
      });
      if (res.data.success) {
        setFeedback({
          type: 'success',
          message: res.data.message || `${selectedAnimal.name} archived safely to preserve history.`,
        });
        setDeleteModalOpen(false);
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Restore Archived Animal
  const handleRestoreAnimal = async (animalId, animalName) => {
    try {
      const res = await axios.patch(`http://localhost:5000/api/animals/${animalId}/restore`);
      if (res.data.success) {
        setFeedback({ type: 'success', message: `${animalName} restored to active shelter records!` });
        loadData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to restore animal.');
    }
  };

  // Helper for status badge styling
  const getStatusBadge = (status, eligibility) => {
    const s = status || eligibility || 'Available for Adoption';
    switch (s) {
      case 'Available for Adoption':
        return <span className="badge bg-success text-white px-2 py-1 rounded-pill">Available for Adoption</span>;
      case 'Under Treatment':
        return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">🩺 Under Treatment</span>;
      case 'Rescued':
        return <span className="badge bg-info text-dark px-2 py-1 rounded-pill">🚑 Rescued</span>;
      case 'Adopted':
        return <span className="badge bg-purple text-white px-2 py-1 rounded-pill" style={{ backgroundColor: '#9333ea' }}>❤️ Adopted</span>;
      case 'In Shelter':
      case 'Shelter & Rehabilitation':
        return <span className="badge bg-primary text-white px-2 py-1 rounded-pill" style={{ backgroundColor: '#0284c7' }}>🏡 In Shelter</span>;
      case 'Rehabilitating':
        return <span className="badge bg-secondary text-white px-2 py-1 rounded-pill">🌱 Rehabilitating</span>;
      case 'Reported':
        return <span className="badge bg-warning text-dark px-2 py-1 rounded-pill">⚠️ Reported</span>;
      case 'Archived':
        return <span className="badge bg-dark text-white px-2 py-1 rounded-pill">📦 Archived</span>;
      default:
        return <span className="badge bg-light text-dark px-2 py-1 rounded-pill">{s}</span>;
    }
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '32px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1360px', margin: '0 auto' }}>
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Animal Management & Registry</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={loadData}
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>

            {isStaff && (
              <button
                type="button"
                onClick={openAddModal}
                className="btn btn-success"
                style={{
                  backgroundColor: '#15803d',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)',
                }}
              >
                <Plus size={18} /> Add New Animal
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show rounded-3 mb-4 d-flex align-items-center justify-content-between`}
            role="alert"
          >
            <div className="d-flex align-items-center gap-2">
              {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{feedback.message}</span>
            </div>
            <button type="button" className="btn-close" onClick={() => setFeedback(null)} aria-label="Close"></button>
          </div>
        )}

        {/* Header Title Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #15803d 100%)',
            borderRadius: '24px',
            padding: '32px 36px',
            color: '#ffffff',
            marginBottom: '28px',
            boxShadow: '0 10px 25px rgba(20, 83, 45, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
              🐾 Shelter Registry & Welfare Oversight
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 6px 0' }}>
              Animal Management & Registry
            </h1>
            <p style={{ color: '#dcfce7', fontSize: '15px', margin: 0, maxWidth: '640px' }}>
              Manage intake profiles, medical records, vaccination tracking, and adoption eligibility across our shelter sanctum.
            </p>
          </div>

          {/* Quick Category Badges */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', padding: '10px 16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#bbf7d0', fontWeight: 600 }}>DOGS</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats.categories?.dogs || 0}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', padding: '10px 16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#bbf7d0', fontWeight: 600 }}>CATS</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats.categories?.cats || 0}</div>
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(6px)', padding: '10px 16px', borderRadius: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#bbf7d0', fontWeight: 600 }}>COWS</div>
              <div style={{ fontSize: '20px', fontWeight: 800 }}>{stats.categories?.cows || 0}</div>
            </div>
          </div>
        </div>

        {/* 5 KEY STATISTICS METRIC CARDS */}
        <div className="row g-3 mb-4">
          {/* 1. Total Animals */}
          <div className="col-xl col-md-4 col-sm-6">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #bbf7d0',
                boxShadow: '0 4px 14px rgba(22, 101, 52, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534' }}>Total Animals</span>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🐾
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#14532d' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Active in sanctuary records
              </div>
            </div>
          </div>

          {/* 2. Available for Adoption */}
          <div className="col-xl col-md-4 col-sm-6">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #fed7aa',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#9a3412' }}>Available Animals</span>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#ffedd5', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🏡
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#9a3412' }}>
                {stats.available}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Ready for forever homes
              </div>
            </div>
          </div>

          {/* 3. Animals Under Treatment */}
          <div className="col-xl col-md-4 col-sm-6">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #bae6fd',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1' }}>Under Treatment</span>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🩺
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0369a1' }}>
                {stats.under_treatment}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Active clinical veterinary care
              </div>
            </div>
          </div>

          {/* 4. Rescued Animals */}
          <div className="col-xl col-md-4 col-sm-6">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #e9d5ff',
                boxShadow: '0 4px 14px rgba(147, 51, 234, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6b21a8' }}>Rescued Animals</span>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#f3e8ff', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🚑
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#6b21a8' }}>
                {stats.rescued || (stats.total - stats.adopted)}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                Saved from streets & distress
              </div>
            </div>
          </div>

          {/* 5. Adopted Animals */}
          <div className="col-xl col-md-4 col-sm-6">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #fbcfe8',
                boxShadow: '0 4px 14px rgba(219, 39, 119, 0.05)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#9d174d' }}>Adopted Animals</span>
                <span style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  🤝
                </span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#9d174d' }}>
                {stats.adopted}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                United with loving families
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH, FILTERS & CONTROLS BAR */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '20px 24px',
            border: '1px solid #e7e3db',
            marginBottom: '28px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
          }}
        >
          <div className="row g-3 align-items-center">
            {/* Search Input */}
            <div className="col-lg-4 col-md-6">
              <form onSubmit={handleSearchSubmit}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by animal name, breed, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      borderRadius: '12px',
                      paddingLeft: '40px',
                      paddingRight: '14px',
                      height: '42px',
                      fontSize: '14px',
                      borderColor: '#cbd5e1',
                    }}
                  />
                  <Search
                    size={18}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '12px',
                      color: '#94a3b8',
                    }}
                  />
                </div>
              </form>
            </div>

            {/* Category Filter */}
            <div className="col-lg-2 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ borderRadius: '10px', height: '42px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">🐾 All Categories</option>
                <option value="Dog">🐶 Dogs</option>
                <option value="Cat">🐱 Cats</option>
                <option value="Cow">🐮 Cows</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="col-lg-2 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{ borderRadius: '10px', height: '42px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">All Statuses</option>
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
                <option value="Archived">Archived Records</option>
              </select>
            </div>

            {/* Gender Filter */}
            <div className="col-lg-2 col-md-3 col-6">
              <select
                className="form-select form-select-sm"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                style={{ borderRadius: '10px', height: '42px', fontSize: '13px', fontWeight: 600 }}
              >
                <option value="All">Gender: All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* View Mode Toggle & Archive switch */}
            <div className="col-lg-2 col-md-3 col-6 d-flex align-items-center justify-content-end gap-2">
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-outline-danger btn-sm"
                  style={{ borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                  title="Clear all active filters"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              )}
              <div className="btn-group" role="group">
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'grid' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('grid')}
                  style={{ borderRadius: '8px 0 0 8px' }}
                  title="Grid View"
                >
                  <Grid size={16} />
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${viewMode === 'table' ? 'btn-success' : 'btn-outline-secondary'}`}
                  onClick={() => setViewMode('table')}
                  style={{ borderRadius: '0 8px 8px 0' }}
                  title="Table View"
                >
                  <List size={16} />
                </button>
              </div>

              <button
                type="button"
                className={`btn btn-sm ${showArchived ? 'btn-dark' : 'btn-outline-secondary'}`}
                onClick={() => setShowArchived(!showArchived)}
                style={{ borderRadius: '8px', fontSize: '12px' }}
                title="Toggle Archived Records"
              >
                <Archive size={14} className="me-1" />
                {showArchived ? 'Archived: On' : 'Archived'}
              </button>
            </div>
          </div>
        </div>

        {/* ANIMAL RECORDS DISPLAY */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <PawPrint size={36} className="animate-spin text-success mb-2" />
            <div>Loading animal records from database...</div>
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
            <h4 style={{ fontWeight: 800, color: '#1e293b' }}>No Animals Found</h4>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '440px', margin: '0 auto 20px auto' }}>
              No animal records match your current filter selections. Try clearing your search filters or add a new animal.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <RotateCcw size={16} /> Clear All Filters
                </button>
              )}
              {isStaff && (
                <button
                  type="button"
                  onClick={openAddModal}
                  className="btn btn-success"
                  style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Plus size={16} /> Add Animal Record
                </button>
              )}
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID CARDS VIEW */
          <div className="row g-4">
            {animals.map((animal) => {
              const isArchived = animal.is_archived === true || animal.status === 'Archived';
              return (
                <div className="col-lg-4 col-md-6" key={animal._id}>
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: isArchived ? '2px dashed #94a3b8' : '1px solid #e2e8f0',
                      boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      opacity: isArchived ? 0.75 : 1,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                    }}
                  >
                    {/* Animal Photo with Badges */}
                    <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                      <img
                        src={animal.image_url || '/assets/images/pet_rocky.jpg'}
                        alt={animal.name}
                        onError={(e) => {
                          e.target.src = '/assets/images/pet_rocky.jpg';
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      {/* Category Tag */}
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          backgroundColor: 'rgba(20, 83, 45, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#ffffff',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {animal.category === 'Dog' ? '🐶 Dog' : animal.category === 'Cat' ? '🐱 Cat' : animal.category === 'Cow' ? '🐮 Cow' : '🐾 Other'}
                      </span>

                      {/* Status Badge */}
                      <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        {getStatusBadge(animal.status, animal.adoption_eligibility)}
                      </div>

                      {/* Gender icon badge */}
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '12px',
                          right: '12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          padding: '3px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          color: animal.gender === 'Female' ? '#db2777' : '#0284c7',
                        }}
                      >
                        {animal.gender === 'Female' ? '♀ Female' : '♂ Male'}
                      </span>
                    </div>

                    {/* Content Body */}
                    <div style={{ padding: '20px', flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                            {animal.name}
                          </h3>
                          <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                            {animal.breed} • {animal.age}
                          </div>
                        </div>
                      </div>

                      <p
                        style={{
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: 1.5,
                          marginBottom: '14px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {animal.description || 'Gentle rescued companion receiving compassionate shelter care.'}
                      </p>

                      {/* Meta pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px', fontSize: '12px' }}>
                        <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '3px 9px', borderRadius: '8px' }}>
                          🩺 {animal.health_condition || 'Healthy'}
                        </span>
                        <span style={{ backgroundColor: '#ecfdf5', color: '#166534', padding: '3px 9px', borderRadius: '8px' }}>
                          💉 {animal.vaccination_status || 'Vaccinated'}
                        </span>
                        <span style={{ backgroundColor: '#f8fafc', color: '#64748b', padding: '3px 9px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {animal.location || 'Bengaluru'}
                        </span>
                      </div>

                      {/* Actions */}
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '14px',
                          borderTop: '1px solid #f1f5f9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                        }}
                      >
                        <Link
                          to={`/adoption/animal/${animal._id}`}
                          className="btn btn-outline-secondary btn-sm"
                          style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={14} /> View
                        </Link>

                        {isStaff && (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {isArchived ? (
                              <button
                                type="button"
                                onClick={() => handleRestoreAnimal(animal._id, animal.name)}
                                className="btn btn-outline-success btn-sm"
                                style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                              >
                                <RotateCcw size={14} /> Restore
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openEditModal(animal)}
                                  className="btn btn-outline-primary btn-sm"
                                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openDeleteModal(animal)}
                                  className="btn btn-outline-danger btn-sm"
                                  style={{ borderRadius: '10px', fontSize: '12px', fontWeight: 600 }}
                                  title="Archive or Remove Record"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* RESPONSIVE TABLE VIEW */
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 6px 20px rgba(0,0,0,0.03)',
            }}
          >
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0" style={{ fontSize: '13px' }}>
                <thead style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <tr>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: 700 }}>Animal</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Category</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Breed & Age</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Gender</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Health & Vaccines</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '16px 12px', color: '#475569', fontWeight: 700 }}>Location</th>
                    <th style={{ padding: '16px 20px', color: '#475569', fontWeight: 700, textAlign: 'end' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {animals.map((animal) => {
                    const isArchived = animal.is_archived === true || animal.status === 'Archived';
                    return (
                      <tr key={animal._id} style={{ opacity: isArchived ? 0.6 : 1 }}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                              src={animal.image_url || '/assets/images/pet_rocky.jpg'}
                              alt={animal.name}
                              onError={(e) => (e.target.src = '/assets/images/pet_rocky.jpg')}
                              style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 800, color: '#14532d', fontSize: '15px' }}>{animal.name}</div>
                              <div style={{ fontSize: '11px', color: '#64748b' }}>ID: {animal._id?.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className="badge bg-light text-dark border">
                            {animal.category === 'Dog' ? '🐶 Dog' : animal.category === 'Cat' ? '🐱 Cat' : animal.category === 'Cow' ? '🐮 Cow' : '🐾 Other'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: 600, color: '#1e293b' }}>{animal.breed}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{animal.age}</div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span style={{ color: animal.gender === 'Female' ? '#db2777' : '#0284c7', fontWeight: 600 }}>
                            {animal.gender === 'Female' ? '♀ Female' : '♂ Male'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div>{animal.health_condition || 'Healthy'}</div>
                          <small className="text-success fw-bold">{animal.vaccination_status || 'Vaccinated'}</small>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          {getStatusBadge(animal.status, animal.adoption_eligibility)}
                        </td>
                        <td style={{ padding: '14px 12px', color: '#64748b' }}>
                          <MapPin size={12} className="me-1" />
                          {animal.location || 'Bengaluru'}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'end' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <Link
                              to={`/adoption/animal/${animal._id}`}
                              className="btn btn-outline-secondary btn-sm"
                              style={{ borderRadius: '8px' }}
                              title="View Animal Profile"
                            >
                              <Eye size={14} />
                            </Link>

                            {isStaff && (
                              <>
                                {isArchived ? (
                                  <button
                                    type="button"
                                    onClick={() => handleRestoreAnimal(animal._id, animal.name)}
                                    className="btn btn-outline-success btn-sm"
                                    style={{ borderRadius: '8px' }}
                                    title="Restore Record"
                                  >
                                    <RotateCcw size={14} />
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openEditModal(animal)}
                                      className="btn btn-outline-primary btn-sm"
                                      style={{ borderRadius: '8px' }}
                                      title="Edit Animal"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => openDeleteModal(animal)}
                                      className="btn btn-outline-danger btn-sm"
                                      style={{ borderRadius: '8px' }}
                                      title="Archive or Delete"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD ANIMAL MODAL */}
        {/* ========================================================================= */}
        {addModalOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '840px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #14532d, #15803d)',
                  color: '#ffffff',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <PawPrint size={24} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Register New Animal</h4>
                    <small style={{ color: '#dcfce7' }}>Enter animal profile details for shelter intake</small>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleAddSubmit} style={{ padding: '28px' }}>
                {formError && (
                  <div className="alert alert-danger rounded-3 mb-3 d-flex align-items-center gap-2">
                    <AlertCircle size={18} /> {formError}
                  </div>
                )}

                {/* Section 1: Basic Identity */}
                <h5 style={{ fontWeight: 800, color: '#14532d', marginBottom: '16px', fontSize: '16px' }}>
                  1. Animal Identity & Species
                </h5>
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Animal Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Rocky, Bella, Nandini"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Species / Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Dog">🐶 Indian Street Dog / Indie</option>
                      <option value="Cat">🐱 Indian Stray Cat / Kitten</option>
                      <option value="Cow">🐮 Indian Desi Cow / Calf</option>
                      <option value="Other">🐾 Other Domestic Animal</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Breed *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Indie Pariah, Hallikar, Domestic Shorthair"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Approximate Age *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. 1 Year, 6 Months, 3 Years"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Gender *</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Male">♂ Male</option>
                      <option value="Female">♀ Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Shelter / Sanctuary Location *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      placeholder="e.g. Koramangala Care Center, Bengaluru Sanctuary Gaushala"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>

                {/* Section 2: Photograph */}
                <h5 style={{ fontWeight: 800, color: '#14532d', marginBottom: '16px', fontSize: '16px' }}>
                  2. Animal Photograph
                </h5>
                <div className="row g-3 mb-4 align-items-center">
                  <div className="col-md-4 text-center">
                    <div
                      style={{
                        width: '100%',
                        height: '140px',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '2px dashed #cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#f8fafc',
                      }}
                    >
                      {formImagePreview ? (
                        <img
                          src={formImagePreview}
                          alt="Preview"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="text-muted small">No photo selected</div>
                      )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <label className="form-label small fw-bold">Upload Photo or Enter URL</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <label
                        className="btn btn-outline-success btn-sm"
                        style={{ borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <Upload size={14} className="me-1" /> Choose File from Computer
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="Or enter image URL: https://example.com/photo.jpg"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setFormImagePreview(e.target.value);
                      }}
                      style={{ borderRadius: '8px' }}
                    />
                    <small className="text-muted" style={{ fontSize: '11px' }}>
                      Leave empty to use species default sanctuary avatar.
                    </small>
                  </div>
                </div>

                {/* Section 3: Status & Welfare Rules */}
                <h5 style={{ fontWeight: 800, color: '#14532d', marginBottom: '16px', fontSize: '16px' }}>
                  3. Health, Status & Adoption Eligibility
                </h5>

                {formData.category === 'Cow' && (
                  <div
                    style={{
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '12px',
                      padding: '12px 16px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      color: '#1e40af',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <Info size={18} />
                    <span>
                      <strong>Animal Welfare Notice:</strong> Cows are maintained in Gaushala shelter & rehabilitation;
                      they are eligible for sponsorship and shelter care rather than household adoption.
                    </span>
                  </div>
                )}

                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Operational Status *</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Adoption Eligibility *</label>
                    <select
                      className="form-select"
                      value={formData.adoption_eligibility}
                      onChange={(e) => setFormData({ ...formData, adoption_eligibility: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      {formData.category === 'Cow' ? (
                        <>
                          <option value="Shelter & Rehabilitation">🏡 Shelter & Rehabilitation</option>
                          <option value="Sponsorship Only">🌱 Sponsorship Only</option>
                          <option value="Under Treatment">🩺 Under Treatment</option>
                        </>
                      ) : (
                        <>
                          <option value="Available for Adoption">🏡 Available for Adoption</option>
                          <option value="Under Treatment">🩺 Under Treatment</option>
                          <option value="Shelter & Rehabilitation">🏡 Shelter & Rehabilitation</option>
                          <option value="Adopted">❤️ Adopted</option>
                          <option value="Not Eligible">Not Eligible</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Vaccination Status</label>
                    <select
                      className="form-select"
                      value={formData.vaccination_status}
                      onChange={(e) => setFormData({ ...formData, vaccination_status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Vaccinated">Vaccinated (Core Protocol)</option>
                      <option value="Partially Vaccinated">Partially Vaccinated</option>
                      <option value="Not Vaccinated">Not Vaccinated</option>
                      <option value="Pending Medical Checkup">Pending Medical Checkup</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Health Condition</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Healthy & Active, Limping, Healed fracture"
                      value={formData.health_condition}
                      onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Rescue Status</label>
                    <select
                      className="form-select"
                      value={formData.rescue_status}
                      onChange={(e) => setFormData({ ...formData, rescue_status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Rescued">Rescued (Safe at Shelter)</option>
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Recovered">Recovered</option>
                      <option value="In Shelter">In Shelter</option>
                      <option value="Rehabilitating">Rehabilitating</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Description & Personality</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      placeholder="Describe animal temperament, behavioral quirks, and rescue background..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Care Requirements</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Needs fenced yard, gentle walks, special diet"
                      value={formData.care_requirements}
                      onChange={(e) => setFormData({ ...formData, care_requirements: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Medical History Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Dewormed, anti-rabies completed, no chronic illness"
                      value={formData.medical_history}
                      onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-success"
                    style={{
                      backgroundColor: '#15803d',
                      borderRadius: '12px',
                      padding: '10px 28px',
                      fontWeight: 700,
                    }}
                  >
                    {submitting ? 'Registering Animal...' : 'Save Animal to Database'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* EDIT ANIMAL MODAL */}
        {/* ========================================================================= */}
        {editModalOpen && selectedAnimal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '840px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  padding: '20px 28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Edit3 size={24} />
                  <div>
                    <h4 style={{ margin: 0, fontWeight: 800 }}>Edit Animal: {selectedAnimal.name}</h4>
                    <small style={{ color: '#e0f2fe' }}>Update details, medical status, or replace photo</small>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleEditSubmit} style={{ padding: '28px' }}>
                {formError && (
                  <div className="alert alert-danger rounded-3 mb-3 d-flex align-items-center gap-2">
                    <AlertCircle size={18} /> {formError}
                  </div>
                )}

                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Animal Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Category</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Dog">🐶 Dog</option>
                      <option value="Cat">🐱 Cat</option>
                      <option value="Cow">🐮 Cow</option>
                      <option value="Other">🐾 Other</option>
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Breed</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Age</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Gender</label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Male">♂ Male</option>
                      <option value="Female">♀ Female</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>

                {/* Photo Update */}
                <h6 style={{ fontWeight: 800, color: '#0369a1', marginBottom: '12px' }}>
                  Replace Photograph
                </h6>
                <div className="row g-3 mb-4 align-items-center">
                  <div className="col-md-3 text-center">
                    <img
                      src={formImagePreview || '/assets/images/pet_rocky.jpg'}
                      alt="Preview"
                      style={{ width: '100%', height: '110px', borderRadius: '12px', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <label className="btn btn-outline-primary btn-sm" style={{ borderRadius: '8px', cursor: 'pointer' }}>
                        <Upload size={14} className="me-1" /> Select New Photo
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                      </label>
                    </div>
                    <input
                      type="url"
                      className="form-control form-control-sm"
                      placeholder="Or enter new image URL"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setFormImagePreview(e.target.value);
                      }}
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                </div>

                {/* Status & Medical Updates */}
                <h6 style={{ fontWeight: 800, color: '#0369a1', marginBottom: '12px' }}>
                  Medical & Status Updates
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Operational Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Adoption Eligibility</label>
                    <select
                      className="form-select"
                      value={formData.adoption_eligibility}
                      onChange={(e) => setFormData({ ...formData, adoption_eligibility: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      {formData.category === 'Cow' ? (
                        <>
                          <option value="Shelter & Rehabilitation">🏡 Shelter & Rehabilitation</option>
                          <option value="Sponsorship Only">🌱 Sponsorship Only</option>
                          <option value="Under Treatment">🩺 Under Treatment</option>
                        </>
                      ) : (
                        <>
                          <option value="Available for Adoption">🏡 Available for Adoption</option>
                          <option value="Under Treatment">🩺 Under Treatment</option>
                          <option value="Shelter & Rehabilitation">🏡 Shelter & Rehabilitation</option>
                          <option value="Adopted">❤️ Adopted</option>
                          <option value="Not Eligible">Not Eligible</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label small fw-bold">Vaccination Status</label>
                    <select
                      className="form-select"
                      value={formData.vaccination_status}
                      onChange={(e) => setFormData({ ...formData, vaccination_status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Vaccinated">Vaccinated</option>
                      <option value="Partially Vaccinated">Partially Vaccinated</option>
                      <option value="Not Vaccinated">Not Vaccinated</option>
                      <option value="Pending Medical Checkup">Pending Medical Checkup</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Health Condition</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.health_condition}
                      onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Rescue Status</label>
                    <select
                      className="form-select"
                      value={formData.rescue_status}
                      onChange={(e) => setFormData({ ...formData, rescue_status: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    >
                      <option value="Rescued">Rescued</option>
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Recovered">Recovered</option>
                      <option value="In Shelter">In Shelter</option>
                      <option value="Rehabilitating">Rehabilitating</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold">Medical History & Clinical Notes</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.medical_history}
                      onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                      style={{ borderRadius: '10px' }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary"
                    style={{
                      backgroundColor: '#0284c7',
                      borderRadius: '12px',
                      padding: '10px 28px',
                      fontWeight: 700,
                    }}
                  >
                    {submitting ? 'Saving Updates...' : 'Save Updates to MongoDB'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DELETE / ARCHIVE CONFIRMATION MODAL */}
        {/* ========================================================================= */}
        {deleteModalOpen && selectedAnimal && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '540px',
                padding: '32px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                }}
              >
                <Trash2 size={32} />
              </div>

              <h4 style={{ fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                Remove / Archive Animal?
              </h4>

              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                Are you sure you want to remove <strong>{selectedAnimal.name}</strong> ({selectedAnimal.breed}) from
                active shelter registry?
              </p>

              {/* Historical preservation notice */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '14px 18px',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#475569',
                  lineHeight: 1.5,
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Shield size={14} color="#15803d" /> Historical Audit Preservation Policy:
                </div>
                In accordance with shelter guidelines, archiving preserves all associated adoption applications,
                rescue logs, and veterinary histories so historical links remain intact.
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}
                >
                  Cancel
                </button>

                {/* Safe Archive button (Recommended) */}
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => handleArchiveConfirm(false)}
                  className="btn btn-warning"
                  style={{
                    backgroundColor: '#f59e0b',
                    borderColor: '#f59e0b',
                    color: '#ffffff',
                    borderRadius: '12px',
                    padding: '10px 22px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Archive size={16} /> Archive Record (Safe)
                </button>

                {/* Hard delete option for admins */}
                {isAdmin && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={() => handleArchiveConfirm(true)}
                    className="btn btn-danger"
                    style={{ borderRadius: '12px', padding: '10px 18px', fontWeight: 600, fontSize: '13px' }}
                    title="Permanently remove if no references exist"
                  >
                    Delete Permanently
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimalManagement;
