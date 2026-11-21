import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, PawPrint, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const AdminAnimalModal = ({ animalToEdit, isOpen, onClose, onSaved }) => {
  const isEditing = !!animalToEdit;

  const [formData, setFormData] = useState({
    name: '',
    category: 'Dog',
    breed: '',
    age: '1 Year',
    gender: 'Male',
    location: 'Bengaluru',
    health_condition: 'Healthy',
    vaccination_status: 'Fully Vaccinated',
    adoption_eligibility: 'Available for Adoption',
    image_url: '',
    description: '',
    care_requirements: '',
    rescue_date: new Date().toISOString().split('T')[0],
    rescue_location: 'Bengaluru',
    medical_history: 'Routine intake triage; no chronic ailments.',
    behavior_notes: 'Gentle temperament, affectionate and responsive.',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (animalToEdit) {
      setFormData({
        name: animalToEdit.name || '',
        category: animalToEdit.category || 'Dog',
        breed: animalToEdit.breed || '',
        age: animalToEdit.age || '1 Year',
        gender: animalToEdit.gender || 'Male',
        location: animalToEdit.location || 'Bengaluru',
        health_condition: animalToEdit.health_condition || 'Healthy',
        vaccination_status: animalToEdit.vaccination_status || 'Fully Vaccinated',
        adoption_eligibility: animalToEdit.adoption_eligibility || 'Available for Adoption',
        image_url: animalToEdit.image_url || '',
        description: animalToEdit.description || '',
        care_requirements: animalToEdit.care_requirements || '',
        rescue_date: animalToEdit.rescue_date || '2026-10-15',
        rescue_location: animalToEdit.rescue_location || 'Bengaluru',
        medical_history: animalToEdit.medical_history || 'Routine intake triage; healthy.',
        behavior_notes: animalToEdit.behavior_notes || 'Gentle temperament.',
      });
    } else {
      setFormData({
        name: '',
        category: 'Dog',
        breed: 'Indie / Indian Pariah',
        age: '1 Year',
        gender: 'Male',
        location: 'Bengaluru',
        health_condition: 'Healthy',
        vaccination_status: 'Fully Vaccinated',
        adoption_eligibility: 'Available for Adoption',
        image_url: '',
        description: '',
        care_requirements: '',
        rescue_date: new Date().toISOString().split('T')[0],
        rescue_location: 'Bengaluru',
        medical_history: 'Routine intake triage; healthy.',
        behavior_notes: 'Gentle temperament.',
      });
    }
  }, [animalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!formData.name.trim() || !formData.category) {
      setErrorMessage('Animal Name and Category are required.');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        const res = await axios.put(
          `http://localhost:5000/api/animals/${animalToEdit._id}`,
          formData
        );
        if (res.data.success) {
          if (onSaved) onSaved(res.data.data);
          onClose();
        }
      } else {
        const res = await axios.post('http://localhost:5000/api/animals', formData);
        if (res.data.success) {
          if (onSaved) onSaved(res.data.data);
          onClose();
        }
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to save animal record. Please verify input data.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1060,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #e7e3db',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#14532d',
            color: '#ffffff',
            padding: '20px 24px',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🐾</span>
            <div>
              <h4 style={{ margin: 0, fontWeight: 800 }}>
                {isEditing ? `Edit Animal: ${formData.name}` : 'Register New Rescued Animal'}
              </h4>
              <small style={{ opacity: 0.85 }}>Administrator Animal Management Registry</small>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          {errorMessage && (
            <div className="alert alert-danger rounded-3 mb-3 d-flex align-items-center gap-2">
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Category */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Animal Category *</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setFormData({
                      ...formData,
                      category: cat,
                      adoption_eligibility:
                        cat === 'Cow' ? 'Shelter & Rehabilitation' : 'Available for Adoption',
                    });
                  }}
                >
                  <option value="Dog">🐶 Indian Street Dog</option>
                  <option value="Cat">🐱 Indian Street Cat</option>
                  <option value="Cow">🐮 Indian Desi Cow (Sanctuary)</option>
                </select>
              </div>

              {/* Name */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Animal Name *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="e.g. Rocky"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              {/* Breed */}
              <div className="col-md-4">
                <label className="form-label small fw-bold">Breed / Variety</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Indie / Indian Pariah"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                />
              </div>

              {/* Age */}
              <div className="col-md-3">
                <label className="form-label small fw-bold">Age</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 1 Year or 8 Months"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                />
              </div>

              {/* Gender */}
              <div className="col-md-3">
                <label className="form-label small fw-bold">Gender</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* Health Condition */}
              <div className="col-md-3">
                <label className="form-label small fw-bold">Health Condition</label>
                <select
                  className="form-select"
                  value={formData.health_condition}
                  onChange={(e) => setFormData({ ...formData, health_condition: e.target.value })}
                >
                  <option value="Healthy">Healthy & Energetic</option>
                  <option value="Recovering">Recovering</option>
                  <option value="Under Treatment">Under Clinical Treatment</option>
                  <option value="Vaccinated & Healed">Vaccinated & Healed</option>
                </select>
              </div>

              {/* Vaccination Status */}
              <div className="col-md-3">
                <label className="form-label small fw-bold">Vaccination Status</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Fully Vaccinated"
                  value={formData.vaccination_status}
                  onChange={(e) => setFormData({ ...formData, vaccination_status: e.target.value })}
                />
              </div>

              {/* Availability Status */}
              <div className="col-md-6">
                <label className="form-label small fw-bold">Adoption / Availability Status *</label>
                <select
                  className="form-select"
                  value={formData.adoption_eligibility}
                  onChange={(e) => setFormData({ ...formData, adoption_eligibility: e.target.value })}
                >
                  <option value="Available for Adoption">Available for Adoption</option>
                  <option value="Shelter & Rehabilitation">Shelter & Rehabilitation (Gaushala / Sanctuary)</option>
                  <option value="Adopted">Adopted (Happily in Forever Home)</option>
                  <option value="Under Treatment">Under Treatment</option>
                </select>
              </div>

              {/* Location */}
              <div className="col-md-6">
                <label className="form-label small fw-bold">Current Shelter Location</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Kengeri Shelter, Bengaluru"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Image URL */}
              <div className="col-12">
                <label className="form-label small fw-bold">Animal Photograph URL *</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://images.unsplash.com/... or asset path"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
                <small className="text-muted">Enter a direct high-resolution image URL representing this animal.</small>
              </div>

              {/* Rescue Location & Date */}
              <div className="col-md-6">
                <label className="form-label small fw-bold">Rescue Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.rescue_location}
                  onChange={(e) => setFormData({ ...formData, rescue_location: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label small fw-bold">Rescue Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.rescue_date}
                  onChange={(e) => setFormData({ ...formData, rescue_date: e.target.value })}
                />
              </div>

              {/* Medical History */}
              <div className="col-12">
                <label className="form-label small fw-bold">Medical History & Clinical Notes</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                />
              </div>

              {/* Description */}
              <div className="col-12">
                <label className="form-label small fw-bold">Animal Story / Description</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Tell potential adopters about this animal's background and character..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Care Requirements */}
              <div className="col-12">
                <label className="form-label small fw-bold">Behavior & Care Requirements</label>
                <textarea
                  className="form-control"
                  rows="2"
                  placeholder="Exercise, diet, shelter needs, interaction with kids or other pets..."
                  value={formData.care_requirements}
                  onChange={(e) => setFormData({ ...formData, care_requirements: e.target.value })}
                ></textarea>
              </div>

              <div className="col-12 text-end mt-4">
                <button type="button" className="btn btn-outline-secondary me-2" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success px-4 d-inline-flex align-items-center gap-2"
                  disabled={loading}
                  style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700 }}
                >
                  <Save size={18} /> {loading ? 'Saving...' : isEditing ? 'Update Animal Record' : 'Save Animal Record'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAnimalModal;
