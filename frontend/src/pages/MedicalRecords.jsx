import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  PawPrint,
  Plus,
  Search,
  Filter,
  Edit3,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  Heart,
  Activity,
  Shield,
  Clock,
  User,
  Lock,
  ArrowLeft,
  RefreshCw,
  FileText,
  Check,
  ChevronRight,
  Info,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const MedicalRecords = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, token } = useAuth();

  const isVet = user?.role === 'Veterinarian';
  const isAdmin = user?.role === 'Admin';
  const hasAccess = isAuthenticated && (isVet || isAdmin);

  // States
  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [searchAnimal, setSearchAnimal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [feedback, setFeedback] = useState(null);

  // Modal State for Add / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [activeRecordId, setActiveRecordId] = useState(null);

  const initialFormState = {
    examination_date: new Date().toISOString().split('T')[0],
    health_condition: '',
    symptoms: '',
    treatment_provided: '',
    medicines_prescribed: '',
    vaccination_details: '',
    medical_notes: '',
    recovery_status: 'Under Treatment',
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  // Fetch all animals
  const fetchAnimals = async () => {
    setLoadingAnimals(true);
    try {
      const res = await axios.get('http://localhost:5000/api/animals');
      if (res.data.success) {
        setAnimals(res.data.data || []);
        // Automatically select first animal if none selected
        if (!selectedAnimal && res.data.data && res.data.data.length > 0) {
          setSelectedAnimal(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching animals:', err);
      setFeedback({ type: 'error', message: 'Failed to load animals list.' });
    } finally {
      setLoadingAnimals(false);
    }
  };

  // Fetch medical records for the selected animal
  const fetchRecordsForAnimal = async (animalId) => {
    if (!animalId || !token) return;
    setLoadingRecords(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/medical?animal_id=${animalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setMedicalRecords(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching medical records:', err);
      // Fallback: If animal-specific query returns empty, fetch all to check
      try {
        const allRes = await axios.get('http://localhost:5000/api/medical', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (allRes.data.success) {
          const filtered = (allRes.data.data || []).filter(
            (r) =>
              r.animal_id === animalId ||
              r.animal_id?._id === animalId ||
              r.animal_name?.toLowerCase() === selectedAnimal?.name?.toLowerCase()
          );
          setMedicalRecords(filtered);
        }
      } catch (e) {
        console.error('Fallback fetch error:', e);
      }
    } finally {
      setLoadingRecords(false);
    }
  };

  useEffect(() => {
    if (hasAccess) {
      fetchAnimals();
    }
  }, [hasAccess]);

  useEffect(() => {
    if (selectedAnimal && hasAccess) {
      fetchRecordsForAnimal(selectedAnimal._id);
    }
  }, [selectedAnimal, hasAccess]);

  // Handle Animal selection
  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
    setFeedback(null);
  };

  // Open Add Record Modal
  const openAddModal = () => {
    if (!isVet) {
      alert('Only authorized licensed Veterinarians can add clinical medical records.');
      return;
    }
    setModalMode('add');
    setActiveRecordId(null);
    setFormData({
      examination_date: new Date().toISOString().split('T')[0],
      health_condition: selectedAnimal?.health_condition || '',
      symptoms: '',
      treatment_provided: '',
      medicines_prescribed: '',
      vaccination_details: selectedAnimal?.vaccination_status || '',
      medical_notes: '',
      recovery_status: 'Under Treatment',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Open Edit Record Modal
  const openEditModal = (record) => {
    if (!isVet) {
      alert('Only authorized licensed Veterinarians can edit clinical medical records.');
      return;
    }
    setModalMode('edit');
    setActiveRecordId(record._id);
    setFormData({
      examination_date: record.examination_date || record.treatment_date || new Date().toISOString().split('T')[0],
      health_condition: record.health_condition || '',
      symptoms: record.symptoms || record.injury_details || '',
      treatment_provided: record.treatment_provided || record.treatment_details || '',
      medicines_prescribed: record.medicines_prescribed || '',
      vaccination_details: record.vaccination_details || record.vaccination_status || '',
      medical_notes: record.medical_notes || record.medical_history || '',
      recovery_status: record.recovery_status || 'Under Treatment',
    });
    setFormError('');
    setModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.health_condition.trim()) {
      setFormError('Health condition / diagnosis is required.');
      return;
    }

    if (!formData.treatment_provided.trim()) {
      setFormError('Treatment provided details are required.');
      return;
    }

    setSubmitting(true);
    try {
      if (modalMode === 'add') {
        const payload = {
          animal_id: selectedAnimal._id,
          examination_date: formData.examination_date,
          health_condition: formData.health_condition.trim(),
          symptoms: formData.symptoms.trim(),
          treatment_provided: formData.treatment_provided.trim(),
          medicines_prescribed: formData.medicines_prescribed.trim(),
          vaccination_details: formData.vaccination_details.trim(),
          medical_notes: formData.medical_notes.trim(),
          recovery_status: formData.recovery_status,
        };

        const res = await axios.post('http://localhost:5000/api/medical', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setFeedback({
            type: 'success',
            message: `Medical examination record for ${selectedAnimal.name} saved successfully!`,
          });
          setModalOpen(false);
          fetchRecordsForAnimal(selectedAnimal._id);
          fetchAnimals(); // refresh animal status & health
        }
      } else {
        // Edit Mode
        const payload = {
          examination_date: formData.examination_date,
          health_condition: formData.health_condition.trim(),
          symptoms: formData.symptoms.trim(),
          treatment_provided: formData.treatment_provided.trim(),
          medicines_prescribed: formData.medicines_prescribed.trim(),
          vaccination_details: formData.vaccination_details.trim(),
          medical_notes: formData.medical_notes.trim(),
          recovery_status: formData.recovery_status,
        };

        const res = await axios.put(`http://localhost:5000/api/medical/${activeRecordId}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setFeedback({
            type: 'success',
            message: `Medical record for ${selectedAnimal.name} updated successfully!`,
          });
          setModalOpen(false);
          fetchRecordsForAnimal(selectedAnimal._id);
          fetchAnimals();
        }
      }
    } catch (err) {
      console.error('Error saving medical record:', err);
      setFormError(err.response?.data?.message || 'Failed to save medical record. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered animals list
  const filteredAnimals = animals.filter((animal) => {
    const matchesCategory = selectedCategory === 'All' || animal.category === selectedCategory;
    const matchesSearch =
      !searchAnimal.trim() ||
      animal.name.toLowerCase().includes(searchAnimal.toLowerCase()) ||
      animal.breed?.toLowerCase().includes(searchAnimal.toLowerCase()) ||
      animal.health_condition?.toLowerCase().includes(searchAnimal.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Access Control Gates
  if (!isAuthenticated) {
    return (
      <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', maxWidth: '480px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <Lock size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>
            Authentication Required
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
            Animal medical and veterinary records contain confidential clinical treatments. Please log in with your authorized credentials to continue.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/login" className="btn btn-success" style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, padding: '10px 24px' }}>
              Log In to Portal
            </Link>
            <Link to="/veterinary-care" className="btn btn-outline-secondary" style={{ borderRadius: '12px', fontWeight: 600, padding: '10px 20px' }}>
              Emergency Info
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '60px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', padding: '40px', maxWidth: '520px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', border: '1px solid #fed7aa' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fff7ed', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto' }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#9a3412', marginBottom: '10px' }}>
            Access Restricted (FR-10 / A6)
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
            Your account role is <strong>{user?.role}</strong>. Clinical veterinary records and treatment updates are strictly restricted to authorized <strong>Veterinarians</strong> and <strong>Administrators</strong>. General users and other roles cannot modify medical records.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/veterinary-care" className="btn btn-success" style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, padding: '10px 20px' }}>
              View Public Veterinary Info
            </Link>
            <Link to="/dashboard" className="btn btn-outline-secondary" style={{ borderRadius: '12px', fontWeight: 600, padding: '10px 20px' }}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '32px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <Link to="/veterinary-care" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
              Veterinary Care
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Animal Medical Records (FR-10)</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => {
                fetchAnimals();
                if (selectedAnimal) fetchRecordsForAnimal(selectedAnimal._id);
              }}
              className="btn btn-outline-secondary btn-sm"
              style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loadingAnimals || loadingRecords ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <Link
              to="/veterinary-care"
              className="btn btn-outline-success btn-sm"
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              Emergency Info Guide
            </Link>
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
            padding: '28px 36px',
            color: '#ffffff',
            marginBottom: '28px',
            boxShadow: '0 10px 25px rgba(20, 83, 45, 0.15)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '5px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
              🩺 Clinical Medical Records (FR-10 / AC-A6)
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px 0' }}>
              Veterinary Clinical Workstation & Treatment Logs
            </h1>
            <p style={{ color: '#dcfce7', fontSize: '14px', margin: 0, maxWidth: '680px' }}>
              {isVet
                ? `Authorized Veterinarian Session: ${user?.fullName || user?.name || 'Dr. Veterinarian'}. You have full clinical authorization to add and update patient records.`
                : 'Administrator Oversight Mode: Viewing medical histories and treatment logs in read-only audit mode.'}
            </p>
          </div>

          <div>
            {isVet && selectedAnimal && (
              <button
                type="button"
                onClick={openAddModal}
                className="btn btn-light"
                style={{
                  color: '#14532d',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
              >
                <Plus size={18} /> Add Medical Record
              </button>
            )}
          </div>
        </div>

        {/* 2-COLUMN CLINICAL LAYOUT: LEFT = ANIMAL LIST, RIGHT = CLINICAL RECORDS */}
        <div className="row g-4">
          
          {/* LEFT COLUMN: ANIMAL REGISTRY SELECTOR */}
          <div className="col-lg-4 col-md-5">
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                position: 'sticky',
                top: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#1e293b', margin: 0 }}>
                  Select Animal Patient
                </h3>
                <span className="badge bg-success text-white px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                  {filteredAnimals.length} Animals
                </span>
              </div>

              {/* Search input */}
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search animal name, condition..."
                  value={searchAnimal}
                  onChange={(e) => setSearchAnimal(e.target.value)}
                  style={{ borderRadius: '10px', paddingLeft: '34px', fontSize: '13px' }}
                />
                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              </div>

              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                {['All', 'Dog', 'Cat', 'Cow'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`btn btn-sm ${selectedCategory === cat ? 'btn-success' : 'btn-outline-secondary'}`}
                    style={{
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      backgroundColor: selectedCategory === cat ? '#15803d' : 'transparent',
                    }}
                  >
                    {cat === 'All' ? 'All' : cat === 'Dog' ? '🐶 Dogs' : cat === 'Cat' ? '🐱 Cats' : '🐮 Cows'}
                  </button>
                ))}
              </div>

              {/* Scrollable Animal Cards List */}
              <div style={{ maxHeight: '620px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '4px' }}>
                {loadingAnimals ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748b' }}>
                    <PawPrint size={28} className="animate-spin text-success mb-2" />
                    <div style={{ fontSize: '12px' }}>Loading shelter animals...</div>
                  </div>
                ) : filteredAnimals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 0', color: '#94a3b8', fontSize: '13px' }}>
                    No matching animals found.
                  </div>
                ) : (
                  filteredAnimals.map((animal) => {
                    const isSelected = selectedAnimal?._id === animal._id;
                    return (
                      <div
                        key={animal._id}
                        onClick={() => handleSelectAnimal(animal)}
                        style={{
                          borderRadius: '14px',
                          padding: '12px',
                          border: isSelected ? '2px solid #15803d' : '1px solid #e2e8f0',
                          backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          transition: 'all 0.15s ease-in-out',
                        }}
                      >
                        <img
                          src={animal.image_url || '/assets/images/vet_mimi.jpg'}
                          alt={animal.name}
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: '1px solid #cbd5e1',
                            flexShrink: 0,
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/images/vet_mimi.jpg';
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {animal.name}
                            </div>
                            <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>
                              {animal.category}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600, marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            🩺 {animal.health_condition || 'Healthy'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                            {animal.gender} • {animal.age || 'Age Unknown'}
                          </div>
                        </div>
                        {isSelected && <ChevronRight size={18} color="#15803d" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: SELECTED ANIMAL CLINICAL DOSSIER & RECORDS */}
          <div className="col-lg-8 col-md-7">
            {selectedAnimal ? (
              <div>
                {/* Animal Patient Header Card */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '24px 28px',
                    border: '1px solid #bbf7d0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '20px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <img
                      src={selectedAnimal.image_url || '/assets/images/vet_mimi.jpg'}
                      alt={selectedAnimal.name}
                      style={{
                        width: '84px',
                        height: '84px',
                        borderRadius: '20px',
                        objectFit: 'cover',
                        border: '2px solid #bbf7d0',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
                      }}
                      onError={(e) => {
                        e.target.src = '/assets/images/vet_mimi.jpg';
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                          {selectedAnimal.name}
                        </h2>
                        <span className="badge bg-success text-white px-2 py-1 rounded-pill" style={{ fontSize: '11px' }}>
                          {selectedAnimal.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                        <strong>ID:</strong> <code style={{ color: '#15803d' }}>{selectedAnimal._id}</code> • {selectedAnimal.breed || 'Indie'} • {selectedAnimal.gender} • {selectedAnimal.age}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '12px' }}>
                        <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                          Condition: {selectedAnimal.health_condition}
                        </span>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                          Vaccine: {selectedAnimal.vaccination_status || 'Pending'}
                        </span>
                        <span style={{ backgroundColor: '#fef3c7', color: '#92400e', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                          Status: {selectedAnimal.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isVet && (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="btn btn-success"
                      style={{
                        backgroundColor: '#15803d',
                        borderRadius: '12px',
                        fontWeight: 700,
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 18px',
                        boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
                      }}
                    >
                      <Plus size={16} /> New Examination
                    </button>
                  )}
                </div>

                {/* Medical Records History Section */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#15803d" /> Clinical Medical Records & History
                  </h3>
                  <span style={{ fontSize: '13px', color: '#64748b' }}>
                    {medicalRecords.length} {medicalRecords.length === 1 ? 'consultation' : 'consultations'} logged
                  </span>
                </div>

                {loadingRecords ? (
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
                    <Activity size={32} className="animate-spin text-success mb-2" />
                    <div>Loading clinical medical records...</div>
                  </div>
                ) : medicalRecords.length === 0 ? (
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      padding: '50px 20px',
                      textAlign: 'center',
                      border: '1px dashed #cbd5e1',
                    }}
                  >
                    <FileText size={44} color="#94a3b8" style={{ marginBottom: '14px' }} />
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '6px' }}>
                      No Medical Records Logged Yet
                    </h4>
                    <p style={{ color: '#64748b', fontSize: '13px', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                      No clinical checkups or treatment logs have been recorded for {selectedAnimal.name} in MongoDB.
                    </p>
                    {isVet ? (
                      <button
                        type="button"
                        onClick={openAddModal}
                        className="btn btn-success"
                        style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, fontSize: '13px' }}
                      >
                        <Plus size={16} className="me-1" /> Log First Medical Examination
                      </button>
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                        Only authorized veterinarians can log new examinations.
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {medicalRecords.map((record) => {
                      return (
                        <div
                          key={record._id}
                          style={{
                            backgroundColor: '#ffffff',
                            borderRadius: '20px',
                            padding: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
                            position: 'relative',
                          }}
                        >
                          {/* Record Top Bar */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#15803d' }}>
                                  {record.health_condition}
                                </span>
                                <span
                                  className={`badge ${
                                    record.recovery_status === 'Recovered'
                                      ? 'bg-success'
                                      : record.recovery_status === 'Under Critical Observation'
                                      ? 'bg-danger'
                                      : 'bg-warning text-dark'
                                  } px-2 py-1 rounded-pill`}
                                  style={{ fontSize: '11px' }}
                                >
                                  {record.recovery_status || 'Under Treatment'}
                                </span>
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Calendar size={13} color="#15803d" /> Examined: {record.examination_date || record.treatment_date}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <User size={13} color="#0369a1" /> Vet: <strong>{record.veterinarian_name}</strong>
                                </span>
                                <span style={{ color: '#94a3b8' }}>
                                  Record ID: <code>{record._id}</code>
                                </span>
                              </div>
                            </div>

                            {isVet && (
                              <button
                                type="button"
                                onClick={() => openEditModal(record)}
                                className="btn btn-outline-secondary btn-sm"
                                style={{ borderRadius: '8px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
                                title="Update Medical Details"
                              >
                                <Edit3 size={13} /> Update Record
                              </button>
                            )}
                          </div>

                          {/* Record Body Grid */}
                          <div className="row g-3" style={{ fontSize: '13px' }}>
                            {/* Symptoms */}
                            <div className="col-md-6">
                              <div style={{ backgroundColor: '#fafaf9', padding: '12px 16px', borderRadius: '12px', border: '1px solid #f5f5f4', height: '100%' }}>
                                <div style={{ fontSize: '11px', color: '#78716c', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Reported Symptoms / Clinical Signs
                                </div>
                                <div style={{ color: '#292524', lineHeight: 1.5 }}>
                                  {record.symptoms || record.injury_details || 'No acute symptoms reported.'}
                                </div>
                              </div>
                            </div>

                            {/* Treatment Provided */}
                            <div className="col-md-6">
                              <div style={{ backgroundColor: '#f0fdf4', padding: '12px 16px', borderRadius: '12px', border: '1px solid #dcfce7', height: '100%' }}>
                                <div style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Treatment Provided
                                </div>
                                <div style={{ color: '#14532d', lineHeight: 1.5, fontWeight: 600 }}>
                                  {record.treatment_provided || record.treatment_details}
                                </div>
                              </div>
                            </div>

                            {/* Medicines Prescribed */}
                            <div className="col-md-6">
                              <div style={{ backgroundColor: '#eff6ff', padding: '12px 16px', borderRadius: '12px', border: '1px solid #dbeafe', height: '100%' }}>
                                <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Medicines Prescribed & Dosage
                                </div>
                                <div style={{ color: '#1e3a8a', lineHeight: 1.5 }}>
                                  {record.medicines_prescribed || 'None prescribed.'}
                                </div>
                              </div>
                            </div>

                            {/* Vaccination Details */}
                            <div className="col-md-6">
                              <div style={{ backgroundColor: '#fef3c7', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fde68a', height: '100%' }}>
                                <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                                  Vaccination Details
                                </div>
                                <div style={{ color: '#78350f', lineHeight: 1.5 }}>
                                  {record.vaccination_details || record.vaccination_status || 'Up to date'}
                                </div>
                              </div>
                            </div>

                            {/* Additional Medical Notes */}
                            {(record.medical_notes || record.medical_history) && (
                              <div className="col-12">
                                <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>
                                    Additional Medical Notes & Follow-up Instructions
                                  </div>
                                  <div style={{ color: '#334155', lineHeight: 1.5 }}>
                                    {record.medical_notes || record.medical_history}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
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
                <h4 style={{ fontWeight: 800, color: '#1e293b' }}>Select an Animal</h4>
                <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '0 auto' }}>
                  Choose an animal from the left registry to view complete clinical consultations and log veterinary treatments.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* MODAL: ADD / UPDATE MEDICAL RECORD */}
        {modalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.5)',
              zIndex: 1050,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              backdropFilter: 'blur(3px)',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '680px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
                border: '1px solid #cbd5e1',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '20px 28px',
                  borderBottom: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f8fafc',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                }}
              >
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                    {modalMode === 'add' ? '🩺 Add Medical Record' : '📝 Update Medical Record'}
                  </h4>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Patient: <strong>{selectedAnimal?.name}</strong> (ID: <code>{selectedAnimal?._id}</code>)
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="btn btn-sm btn-light"
                  style={{ borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmitForm} style={{ padding: '24px 28px' }}>
                {formError && (
                  <div className="alert alert-danger py-2 px-3 rounded-3 mb-3 d-flex align-items-center gap-2" style={{ fontSize: '13px' }}>
                    <AlertCircle size={16} />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="row g-3">
                  {/* Examination Date */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Examination Date *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.examination_date}
                      onChange={(e) => setFormData({ ...formData, examination_date: e.target.value })}
                      required
                      style={{ borderRadius: '10px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Recovery Status */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Clinical / Recovery Status *
                    </label>
                    <select
                      className="form-select"
                      value={formData.recovery_status}
                      onChange={(e) => setFormData({ ...formData, recovery_status: e.target.value })}
                      style={{ borderRadius: '10px', fontSize: '14px' }}
                    >
                      <option value="Under Treatment">Under Treatment</option>
                      <option value="Under Critical Observation">Under Critical Observation</option>
                      <option value="Stable">Stable</option>
                      <option value="Recovered">Recovered</option>
                    </select>
                  </div>

                  {/* Health Condition / Diagnosis */}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Health Condition or Diagnosis *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Fracture Splint Healed, Dehydration, Tick Fever"
                      value={formData.health_condition}
                      onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                      required
                      style={{ borderRadius: '10px', fontSize: '14px' }}
                    />
                  </div>

                  {/* Symptoms */}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Symptoms / Observed Clinical Signs
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Mild limping on right forelimb, loss of appetite, low energy..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      style={{ borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Treatment Provided */}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Treatment Provided *
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="e.g. Radiograph taken. Splint replaced with light support wrap. Administered pain relief injection..."
                      value={formData.treatment_provided}
                      onChange={(e) => setFormData({ ...formData, treatment_provided: e.target.value })}
                      required
                      style={{ borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Medicines Prescribed */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Medicines Prescribed
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Meloxicam 0.1mg/kg OD x 3 days, Calcium syrup"
                      value={formData.medicines_prescribed}
                      onChange={(e) => setFormData({ ...formData, medicines_prescribed: e.target.value })}
                      style={{ borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Vaccination Details */}
                  <div className="col-md-6">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Vaccination Details
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Core DHLPP Booster administered / Rabies Done"
                      value={formData.vaccination_details}
                      onChange={(e) => setFormData({ ...formData, vaccination_details: e.target.value })}
                      style={{ borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>

                  {/* Additional Medical Notes */}
                  <div className="col-12">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                      Additional Medical Notes
                    </label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Patient friendly and cooperative. Re-examination scheduled after 7 days..."
                      value={formData.medical_notes}
                      onChange={(e) => setFormData({ ...formData, medical_notes: e.target.value })}
                      style={{ borderRadius: '10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '18px' }}>
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="btn btn-outline-secondary"
                    style={{ borderRadius: '10px', fontSize: '14px', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-success"
                    style={{
                      backgroundColor: '#15803d',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      padding: '8px 24px',
                    }}
                  >
                    {submitting ? 'Saving to Database...' : modalMode === 'add' ? 'Save Medical Record' : 'Save Updates'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MedicalRecords;
