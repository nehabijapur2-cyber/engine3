import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  PawPrint,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import NoticeModal from '../components/NoticeModal';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    password: '',
    rememberMe: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const DEMO_ACCOUNTS = [
    { label: '👑 Admin (Sneha)', email: 'admin@petrescue.org', role: 'Admin' },
    { label: '🚑 Volunteer (Vikram)', email: 'volunteer@petrescue.org', role: 'Rescue Volunteer' },
    { label: '🩺 Veterinarian (Dr. Shalini)', email: 'vet@petrescue.org', role: 'Veterinarian' },
    { label: '🏡 Adopter (Priya)', email: 'adopter@petrescue.org', role: 'Adopter' },
    { label: '🎁 Donor (Anand)', email: 'donor@petrescue.org', role: 'Donor' },
  ];

  const handleSelectDemo = (acc) => {
    setFormData({
      email: acc.email,
      password: 'admin123',
      rememberMe: true,
    });
    setErrorMessage('');
    setSuccessMessage(`Selected demo account: ${acc.label}. Click 'Sign In' below.`);
  };

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

    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!formData.password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(
        formData.email.trim(),
        formData.password,
        formData.rememberMe
      );

      if (result.success) {
        setSuccessMessage(`Welcome back, ${result.user.fullName}! Redirecting to PetRescue Dashboard...`);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setErrorMessage(result.message || 'Invalid email or password.');
      }
    } catch (err) {
      setErrorMessage('A network error occurred. Please verify backend server is running on port 5000.');
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
        backgroundColor: '#faf7f2',
      }}
    >
      <div
        style={{
          maxWidth: '1020px',
          width: '100%',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(20, 53, 33, 0.12)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          backgroundColor: '#ffffff',
          border: '1px solid #e7e3db',
        }}
      >
        {/* LEFT SIDE: Hero Photograph & Animal Mission */}
        <div
          style={{
            position: 'relative',
            backgroundColor: '#0d381e',
            color: '#ffffff',
            padding: '48px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
          }}
        >
          {/* Background image overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url(/assets/images/hero_animals.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.25,
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#ffffff',
                  color: '#0d381e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                }}
              >
                🐾
              </div>
              <span style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                Pet<span style={{ color: '#ea580c' }}>Rescue</span>
              </span>
            </div>

            <h2
              style={{
                fontSize: '32px',
                fontWeight: 800,
                lineHeight: 1.2,
                color: '#ffffff',
                marginBottom: '16px',
                fontFamily: 'Outfit, sans-serif',
              }}
            >
              Give Every Animal <br />
              <span style={{ color: '#fef08a' }}>a Better Tomorrow</span>
            </h2>

            <p style={{ fontSize: '15px', color: '#bbf7d0', lineHeight: 1.6, maxWidth: '380px' }}>
              Your secure gateway to rescue reports, pet adoptions, clinical triage, and animal welfare advocacy.
            </p>
          </div>

          {/* Bullet Points */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              marginTop: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              fontSize: '14px',
              color: '#f1f5f9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#4ade80" />
              <span>Full-fledged dashboard matching reference design</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#4ade80" />
              <span>React.js + Node.js + Express + Python AI + MongoDB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#4ade80" />
              <span>Compassionate care for Dogs, Cats & Cows</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Clean Login Form */}
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '44px 38px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#143521', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
              Sign In to Your Portal
            </h3>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Enter your credentials or click any demo account below to log in.
            </p>
          </div>

          {/* 1-Click Demo Accounts Quick Select */}
          <div style={{ marginBottom: '20px' }}>
            <small style={{ fontSize: '11px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
              ⚡ 1-Click Demo Accounts:
            </small>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  type="button"
                  key={acc.email}
                  onClick={() => handleSelectDemo(acc)}
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: '1px solid #d1fae5',
                    backgroundColor: formData.email === acc.email ? '#15803d' : '#ecfdf5',
                    color: formData.email === acc.email ? '#ffffff' : '#166534',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message Box */}
          {errorMessage && (
            <div className="alert alert-danger p-2 mb-3 small d-flex align-items-center gap-2 rounded-3">
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Box */}
          {successMessage && (
            <div className="alert alert-success p-2 mb-3 small d-flex align-items-center gap-2 rounded-3">
              <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label className="form-label small fw-semibold" htmlFor="login-email">
                Email Address
              </label>
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Mail size={16} color="#64748b" />
                </span>
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  required
                  placeholder="admin@petrescue.org"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control border-start-0"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label small fw-semibold mb-0" htmlFor="login-password">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#ea580c',
                    cursor: 'pointer',
                  }}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Lock size={16} color="#64748b" />
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control border-start-0 border-end-0"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-group-text bg-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-check-input mt-0"
              />
              <label htmlFor="rememberMe" className="form-check-label small text-muted">
                Remember me on this browser
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: '#15803d', borderRadius: '12px' }}
            >
              {isSubmitting ? (
                <>
                  <PawPrint size={18} className="animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In to Platform <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#64748b' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#15803d', fontWeight: 700, textDecoration: 'none' }}>
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <NoticeModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Password Assistance"
        moduleName="Password Reset Service"
        description="For this college mini-project demonstration, use the pre-seeded admin account (admin@petrescue.org / admin123) or select any of the 1-click test pills on the login page."
      />
    </div>
  );
};

export default Login;
