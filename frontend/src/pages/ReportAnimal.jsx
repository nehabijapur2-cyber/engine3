import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldAlert,
  PawPrint,
  MapPin,
  Camera,
  Upload,
  AlertCircle,
  CheckCircle2,
  Navigation,
  Info,
  Clock,
  Phone,
  User,
  Heart,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReportAnimal = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    reporter_name: user?.fullName || '',
    reporter_phone: user?.phone || '',
    reporter_email: user?.email || '',
    animal_category: 'Dog',
    report_type: 'Injured',
    animal_description: '',
    approx_age: 'Young Adult',
    animal_condition: 'Visible injury / pain',
    injury_details: '',
    location: '',
    city: 'Bengaluru',
    additional_info: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageBase64, setImageBase64] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [useUrlMode, setUseUrlMode] = useState(false);

  const [locating, setLocating] = useState(false);
  const [gpsCoordinates, setGpsCoordinates] = useState(null);
  const [locationSuccess, setLocationSuccess] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successReport, setSuccessReport] = useState(null);

  // Sync user info if auth state updates
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        reporter_name: prev.reporter_name || user.fullName || '',
        reporter_phone: prev.reporter_phone || user.phone || '',
        reporter_email: prev.reporter_email || user.email || '',
      }));
    }
  }, [user]);

  // Handle GPS location detection with user permission
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setLocating(true);
    setLocationSuccess('');
    setErrorMessage('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setGpsCoordinates({ latitude, longitude });
        setLocating(false);
        setLocationSuccess(`GPS Coordinates captured: Lat ${latitude.toFixed(4)}, Long ${longitude.toFixed(4)}`);
        
        // Append GPS landmark to location if empty
        if (!formData.location) {
          setFormData((prev) => ({
            ...prev,
            location: `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)} (Accurate to within ${Math.round(position.coords.accuracy)}m)`,
          }));
        }
      },
      (error) => {
        setLocating(false);
        let msg = 'Unable to retrieve your location.';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please enter the location landmark manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please enter address manually.';
        }
        setErrorMessage(msg);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  // Handle local file upload
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Invalid file format. Please upload a valid JPG, PNG, or WEBP photograph.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Photo file size exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    setErrorMessage('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setImageBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Image URL input
  const handleApplyUrl = () => {
    if (imageUrlInput.trim()) {
      setImagePreview(imageUrlInput.trim());
      setImageBase64(imageUrlInput.trim());
    }
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setImageBase64('');
    setImageUrlInput('');
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!formData.reporter_name.trim()) {
      setErrorMessage('Please provide your name.');
      setLoading(false);
      return;
    }
    if (!formData.reporter_phone.trim()) {
      setErrorMessage('Please provide a contact number for ambulance dispatch coordination.');
      setLoading(false);
      return;
    }
    if (!formData.location.trim()) {
      setErrorMessage('Please enter the street location or landmark where the animal was seen.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        reporter_name: formData.reporter_name.trim(),
        reporter_phone: formData.reporter_phone.trim(),
        reporter_email: formData.reporter_email.trim(),
        reporter_user_id: user?.id || user?._id || null,
        animal_category: formData.animal_category,
        report_type: formData.report_type,
        animal_description: formData.animal_description.trim(),
        approx_age: formData.approx_age,
        animal_condition: formData.animal_condition.trim(),
        injury_details: formData.injury_details.trim(),
        location: formData.location.trim(),
        city: formData.city.trim() || 'Bengaluru',
        coordinates: gpsCoordinates,
        image_url: imageBase64 || null,
        additional_info: formData.additional_info.trim(),
      };

      const res = await axios.post('http://localhost:5000/api/rescues', payload);
      if (res.data.success) {
        setSuccessReport(res.data);
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to submit rescue report. Please verify your connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '36px 20px 80px 20px' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        {/* Breadcrumb Navigation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
          <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Dashboard
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>Report an Animal in Need</span>
        </div>

        {/* Success Screen */}
        {successReport ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '48px 36px',
              border: '1px solid #bbf7d0',
              boxShadow: '0 20px 40px rgba(20, 83, 45, 0.08)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <CheckCircle2 size={48} />
            </div>

            <span
              style={{
                backgroundColor: '#ecfdf5',
                color: '#15803d',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 14px',
                borderRadius: '9999px',
                textTransform: 'uppercase',
              }}
            >
              Emergency Dispatch Alert Logged
            </span>

            <h2 style={{ fontSize: '30px', fontWeight: 800, color: '#14532d', margin: '12px 0 8px 0' }}>
              Rescue Report Registered!
            </h2>
            <p style={{ color: '#4b5563', fontSize: '16px', maxWidth: '580px', margin: '0 auto 24px auto' }}>
              Thank you for being a compassionate animal advocate. Our volunteer dispatch team has received your report
              and ambulance triage has been initiated.
            </p>

            {/* Reference Box */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '2px dashed #cbd5e1',
                borderRadius: '18px',
                padding: '20px',
                maxWidth: '440px',
                margin: '0 auto 28px auto',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                Your Rescue Report ID
              </div>
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 800,
                  color: '#0f766e',
                  fontFamily: 'monospace',
                  marginTop: '4px',
                }}
              >
                {successReport.report_id || successReport.data?.report_id}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                Priority Triage: <strong>{successReport.data?.urgency_level || 'High'}</strong> • Status:{' '}
                <strong>Submitted</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                to="/rescue-reports"
                className="btn btn-success"
                style={{ backgroundColor: '#15803d', borderRadius: '14px', padding: '12px 28px', fontWeight: 700 }}
              >
                Track My Rescue Reports ➔
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSuccessReport(null);
                  setImagePreview(null);
                  setImageBase64('');
                  setFormData((prev) => ({
                    ...prev,
                    animal_description: '',
                    injury_details: '',
                    location: '',
                    additional_info: '',
                  }));
                }}
                className="btn btn-outline-secondary"
                style={{ borderRadius: '14px', padding: '12px 24px', fontWeight: 600 }}
              >
                Report Another Animal
              </button>
            </div>
          </div>
        ) : (
          /* Report Form Card */
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              overflow: 'hidden',
              border: '1px solid #e7e3db',
              boxShadow: '0 12px 30px rgba(27, 43, 31, 0.06)',
            }}
          >
            {/* Form Header Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
                color: '#ffffff',
                padding: '36px 36px 32px 36px',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  🚨 24/7 Animal Welfare Help
                </span>
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px 0' }}>
                Report an Animal in Need
              </h1>
              <p style={{ fontSize: '16px', color: '#dcfce7', margin: 0, maxWidth: '640px' }}>
                Help us find and protect animals that need immediate care. Your timely report allows emergency rescue
                crews and veterinary staff to dispatch promptly.
              </p>
            </div>

            {/* Form Body */}
            <div style={{ padding: '36px' }}>
              {/* Triage Disclaimer Alert */}
              <div
                style={{
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '16px',
                  padding: '16px 20px',
                  marginBottom: '28px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <Info size={22} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
                  <strong>Rescue Triage Assessment Notice:</strong> Submitting this report automatically calculates an
                  initial urgency ranking to alert nearby rescue volunteers. It does not replace professional on-site
                  veterinary examination. Our triage doctors verify every case upon arrival.
                </div>
              </div>

              {errorMessage && (
                <div className="alert alert-danger rounded-3 mb-4 d-flex align-items-center gap-2">
                  <AlertCircle size={20} /> {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* 1. ANIMAL INFORMATION SECTION */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PawPrint size={20} /> 1. Animal Details
                  </h4>

                  <div className="row g-3">
                    {/* Category */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Animal Category *</label>
                      <select
                        className="form-select"
                        value={formData.animal_category}
                        onChange={(e) => setFormData({ ...formData, animal_category: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      >
                        <option value="Dog">🐶 Indian Street Dog / Puppy</option>
                        <option value="Cat">🐱 Indian Stray Cat / Kitten</option>
                        <option value="Cow">🐮 Indian Desi Cow / Injured Calf</option>
                        <option value="Other">🐾 Other Distressed Domestic Animal</option>
                      </select>
                    </div>

                    {/* Report Type */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Report Type (Distress Reason) *</label>
                      <select
                        className="form-select"
                        value={formData.report_type}
                        onChange={(e) => setFormData({ ...formData, report_type: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      >
                        <option value="Injured">🚨 Injured (Open wound, limping, hit & run, bleeding)</option>
                        <option value="Animal in Danger">⚠️ Animal in Danger (Trapped in drain, highway traffic, immediate threat)</option>
                        <option value="Sick">🩺 Sick (Fever, severe weakness, vomiting, unable to stand)</option>
                        <option value="Abandoned">🏡 Abandoned (Newborn litter, boxed animals, left without food)</option>
                        <option value="Lost">🔍 Lost (Pet with collar wandering, disoriented)</option>
                      </select>
                    </div>

                    {/* Animal Description */}
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Animal Identifier / Description</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Brown & White Indie dog with torn ear, or small ginger kitten"
                        value={formData.animal_description}
                        onChange={(e) => setFormData({ ...formData, animal_description: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>

                    {/* Approximate Age */}
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Approximate Age</label>
                      <select
                        className="form-select"
                        value={formData.approx_age}
                        onChange={(e) => setFormData({ ...formData, approx_age: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      >
                        <option value="Puppy / Kitten">Puppy / Kitten (&lt; 6 months)</option>
                        <option value="Young Adult">Young Adult (6m – 2 years)</option>
                        <option value="Adult">Adult (2 – 6 years)</option>
                        <option value="Senior">Senior (&gt; 6 years)</option>
                        <option value="Unknown">Age Unknown</option>
                      </select>
                    </div>

                    {/* Visible Condition */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Visible Condition *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Bleeding hind leg, cannot put weight on paw"
                        value={formData.animal_condition}
                        onChange={(e) => setFormData({ ...formData, animal_condition: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>

                    {/* Injury / Health Details */}
                    <div className="col-md-6">
                      <label className="form-label small fw-bold">Injury or Health Details</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Deep laceration from road accident, visible distress"
                        value={formData.injury_details}
                        onChange={(e) => setFormData({ ...formData, injury_details: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. LOCATION SECTION */}
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={20} /> 2. Rescue Location & Landmark
                    </h4>

                    {/* Current Location Button */}
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={locating}
                      className="btn btn-outline-success btn-sm"
                      style={{ borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Navigation size={14} className={locating ? 'animate-spin' : ''} />
                      {locating ? 'Acquiring GPS...' : '📍 Use My Current Location'}
                    </button>
                  </div>

                  {locationSuccess && (
                    <div style={{ backgroundColor: '#ecfdf5', color: '#15803d', fontSize: '13px', padding: '8px 14px', borderRadius: '10px', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} /> {locationSuccess}
                    </div>
                  )}

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-bold">Exact Street Address / Landmark *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        placeholder="e.g. Opposite Metro Pillar 125, MG Road, near Coffee Day"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">City / District *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-bold">Additional Landmark / Access Directions</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Animal is hiding under the green tea stall bench behind the bus shelter"
                        value={formData.additional_info}
                        onChange={(e) => setFormData({ ...formData, additional_info: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PHOTOGRAPH UPLOAD */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera size={20} /> 3. Animal Photograph (Preview Available)
                  </h4>

                  <div
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '18px',
                      padding: '24px',
                      textAlign: 'center',
                      backgroundColor: '#f8fafc',
                      marginBottom: '16px',
                    }}
                  >
                    {imagePreview ? (
                      <div>
                        <div style={{ position: 'relative', display: 'inline-block', maxWidth: '320px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                          <img
                            src={imagePreview}
                            alt="Animal Preview"
                            style={{ width: '100%', maxHeight: '240px', objectFit: 'cover' }}
                          />
                          <button
                            type="button"
                            onClick={handleClearImage}
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              backgroundColor: 'rgba(0,0,0,0.6)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '50%',
                              width: '32px',
                              height: '32px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                            }}
                            title="Remove Photo"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 600, marginTop: '8px' }}>
                          ✓ Photograph attached successfully
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: '#ecfdf5',
                            color: '#15803d',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 12px auto',
                          }}
                        >
                          <Upload size={24} />
                        </div>
                        <h5 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                          Upload Animal Photo
                        </h5>
                        <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 16px auto' }}>
                          A clear photo assists volunteers in rapidly identifying the animal and evaluating medical urgency.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                          <label
                            className="btn btn-success btn-sm"
                            style={{
                              backgroundColor: '#15803d',
                              borderRadius: '10px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: '8px 18px',
                            }}
                          >
                            Select from Device
                            <input
                              type="file"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              style={{ display: 'none' }}
                              onChange={handleImageFileChange}
                            />
                          </label>

                          <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm"
                            style={{ borderRadius: '10px', fontWeight: 600 }}
                            onClick={() => setUseUrlMode(!useUrlMode)}
                          >
                            {useUrlMode ? 'Hide URL Option' : 'Or Enter Image URL'}
                          </button>
                        </div>

                        {useUrlMode && (
                          <div style={{ marginTop: '16px', maxWidth: '500px', margin: '16px auto 0 auto', display: 'flex', gap: '8px' }}>
                            <input
                              type="url"
                              className="form-control form-control-sm"
                              placeholder="https://example.com/photo.jpg"
                              value={imageUrlInput}
                              onChange={(e) => setImageUrlInput(e.target.value)}
                            />
                            <button
                              type="button"
                              className="btn btn-dark btn-sm"
                              onClick={handleApplyUrl}
                            >
                              Apply
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. REPORTER CONTACT INFORMATION */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#14532d', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={20} /> 4. Reporter Contact Details
                  </h4>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Your Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.reporter_name}
                        onChange={(e) => setFormData({ ...formData, reporter_name: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Contact Phone Number *</label>
                      <input
                        type="tel"
                        className="form-control"
                        required
                        placeholder="+91 98450 11223"
                        value={formData.reporter_phone}
                        onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                      <small className="text-muted" style={{ fontSize: '11px' }}>
                        Volunteer ambulance driver will call you for landmark guidance.
                      </small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-bold">Email Address (Optional)</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        value={formData.reporter_email}
                        onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                        style={{ borderRadius: '12px', padding: '10px 14px' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #e2e8f0', flexWrap: 'wrap', gap: '12px' }}>
                  <Link to="/dashboard" className="btn btn-outline-secondary" style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600 }}>
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-success"
                    style={{
                      backgroundColor: '#15803d',
                      borderRadius: '14px',
                      padding: '12px 32px',
                      fontWeight: 800,
                      fontSize: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 8px 20px rgba(21, 128, 61, 0.25)',
                    }}
                  >
                    {loading ? (
                      <>
                        <PawPrint size={20} className="animate-spin" /> Submitting Report...
                      </>
                    ) : (
                      <>
                        Submit Emergency Report <ArrowRight size={20} />
                      </>
                    )}
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

export default ReportAnimal;
