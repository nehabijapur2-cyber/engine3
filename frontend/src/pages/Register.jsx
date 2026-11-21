import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PawPrint,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ShieldCheck,
  Heart,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = [
  {
    id: 'General User',
    label: 'General User',
    desc: 'Browse animals, support welfare, and report strays in distress.',
  },
  {
    id: 'Adopter',
    label: 'Adopter',
    desc: 'Apply to adopt pets and provide a loving forever home.',
  },
  {
    id: 'Rescue Volunteer / Administrator',
    label: 'Rescue Volunteer / Admin',
    desc: 'Dispatch emergency rescues, manage shelter intake, coordinate patrols.',
  },
  {
    id: 'Veterinarian',
    label: 'Veterinarian',
    desc: 'Review medical triage, record treatments, and surgeries.',
  },
  {
    id: 'Donor',
    label: 'Donor',
    desc: 'Sponsor medical surgeries, food supplies, and shelter operations.',
  },
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'General User',
    agreeTerms: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    // Frontend validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your phone number.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please create a password.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }
    if (!formData.agreeTerms) {
      setErrorMessage('Please accept our animal welfare community pledge.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role,
      });

      if (result.success) {
        setSuccessMessage(
          `Account registered successfully! Welcome to the Pet Rescue family as a ${formData.role}. Redirecting to your dashboard...`
        );
        setTimeout(() => {
          navigate(result.redirectUrl);
        }, 1300);
      } else {
        setErrorMessage(result.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please ensure the backend is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="paw-pattern-bg"
      style={{
        minHeight: 'calc(100vh - 76px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '1060px',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid #e7e3db',
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        {/* LEFT SIDE: Mission & Visual */}
        <div
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
            color: '#ffffff',
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '520px',
            overflow: 'hidden',
          }}
        >
          {/* Background Image Overlay */}
          <img
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
            alt="Rescue dog"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.22,
              mixBlendMode: 'luminosity',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#ffffff',
                textDecoration: 'none',
                marginBottom: '32px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#22c55e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#143521',
                }}
              >
                <PawPrint size={20} />
              </div>
              <span style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit' }}>
                Pet<span style={{ color: '#fb923c' }}>Rescue</span>
              </span>
            </Link>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                color: '#bbf7d0',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                marginBottom: '16px',
              }}
            >
              <Sparkles size={14} /> Join Our Community
            </span>

            <h2
              style={{
                fontSize: 'clamp(28px, 3.2vw, 36px)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: '16px',
              }}
            >
              Be a Voice for <br />
              <span style={{ color: '#fef08a' }}>the Voiceless</span>
            </h2>

            <p style={{ fontSize: '15px', color: '#bbf7d0', lineHeight: 1.6, maxWidth: '400px' }}>
              Whether you are an aspiring pet parent, a licensed veterinarian, a brave rescue volunteer, or a generous donor, your journey begins here.
            </p>
          </div>

          {/* Role Badges Highlight */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '40px',
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#fef08a', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Selectable Roles with Unique Workflows:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ROLES.map((r, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    color: '#ffffff',
                  }}
                >
                  ✓ {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Registration Form */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '40px 36px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#143521', marginBottom: '6px' }}>
              Create Your Account
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              Fill in your details below to join the animal welfare network.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="alert alert-error animate-fade-in" style={{ marginBottom: '16px' }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Alert */}
          {successMessage && (
            <div className="alert alert-success animate-fade-in" style={{ marginBottom: '16px' }}>
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-fullName">
                Full Name
              </label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="register-fullName"
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email & Phone in 2 Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-email">
                  Email Address
                </label>
                <div className="input-wrapper">
                  <Mail size={18} className="input-icon" />
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-phone">
                  Phone Number
                </label>
                <div className="input-wrapper">
                  <Phone size={18} className="input-icon" />
                  <input
                    id="register-phone"
                    type="tel"
                    name="phone"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                    autoComplete="tel"
                  />
                </div>
              </div>
            </div>

            {/* Select User Role */}
            <div className="form-group">
              <label className="form-label" htmlFor="register-role">
                Select User Role
              </label>
              <div className="input-wrapper">
                <Briefcase size={18} className="input-icon" />
                <select
                  id="register-role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  style={{ cursor: 'pointer', appearance: 'auto' }}
                >
                  {ROLES.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label} — {role.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="register-password">
                  Password
                </label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Min 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingRight: '40px' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="register-confirmPassword">
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <Lock size={18} className="input-icon" />
                  <input
                    id="register-confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Re-enter password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-input"
                    style={{ paddingRight: '40px' }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '22px' }}>
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#15803d',
                  marginTop: '4px',
                  cursor: 'pointer',
                }}
              />
              <label
                htmlFor="agreeTerms"
                style={{ fontSize: '13px', color: '#4b5563', cursor: 'pointer', lineHeight: 1.5 }}
              >
                I pledge to support animal welfare, treat animals with kindness, and follow community standards.
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '14px',
                fontSize: '16px',
                fontWeight: 700,
                opacity: isSubmitting ? 0.75 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <>
                  <PawPrint size={18} className="animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Complete Registration <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#64748b',
            }}
          >
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#15803d',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
