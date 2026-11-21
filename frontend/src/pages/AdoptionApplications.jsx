import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FileText,
  PawPrint,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  Filter,
  User,
  Mail,
  Phone,
  MapPin,
  Home,
  Heart,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdoptionApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/adoptions';

      // If regular user (not admin), only fetch their applications
      if (!isAdmin && user?.email) {
        url = `http://localhost:5000/api/adoptions/my-applications?email=${encodeURIComponent(user.email)}`;
      }

      const res = await axios.get(url);
      if (res.data.success) {
        setApplications(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [isAdmin, user?.email]);

  const handleStatusUpdate = async (appId, newStatus) => {
    setActionLoading(true);
    setActionFeedback(null);
    try {
      const res = await axios.patch(`http://localhost:5000/api/adoptions/${appId}/status`, {
        status: newStatus,
        admin_notes: `Processed by Administrator ${user?.fullName || 'Admin'} on ${new Date().toLocaleDateString()}`,
      });

      if (res.data.success) {
        setActionFeedback({
          type: 'success',
          text: `Application status updated to ${newStatus}! Animal registry synchronized.`,
        });
        if (selectedApp) {
          setSelectedApp(res.data.data);
        }
        fetchApplications();
      }
    } catch (err) {
      setActionFeedback({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update application status.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.application_status === statusFilter;
  });

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '36px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
          <span style={{ color: '#64748b', fontWeight: 600 }}>Adoption Applications</span>
        </div>

        {/* Page Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <span style={{ fontSize: '28px' }}>📋</span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                {isAdmin ? 'Adoption & Care Applications Registry' : 'My Adoption Applications'}
              </h1>
            </div>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
              {isAdmin
                ? 'Review, verify and approve pet adoption submissions and Gaushala bovine care requests.'
                : 'Track the status and review progress of your animal adoption and sanctuary support applications.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link
              to="/adoption"
              className="btn btn-outline-success"
              style={{ borderRadius: '12px', padding: '10px 20px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ArrowLeft size={16} /> Adoption Directory
            </Link>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid #e7e3db',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Filter by Status:</span>
          </div>

          <div className="btn-group" role="group">
            {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
              <button
                key={status}
                type="button"
                className={`btn btn-sm ${statusFilter === status ? 'btn-success' : 'btn-outline-secondary'}`}
                onClick={() => setStatusFilter(status)}
                style={{
                  borderRadius: '10px',
                  padding: '6px 16px',
                  fontWeight: 600,
                  fontSize: '13px',
                }}
              >
                {status}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Showing <strong>{filteredApps.length}</strong> application{filteredApps.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <PawPrint size={40} className="animate-spin" style={{ color: '#15803d', marginBottom: '12px' }} />
            <h4>Loading applications...</h4>
          </div>
        ) : filteredApps.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              padding: '60px 20px',
              textAlign: 'center',
              border: '1px solid #e7e3db',
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
            <h4 style={{ color: '#1f2937', fontWeight: 700 }}>No applications found</h4>
            <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              {isAdmin
                ? 'No adoption or care applications currently match the selected status filter.'
                : "You haven't submitted any adoption or care applications yet. Explore available animals to find your companion!"}
            </p>
            <Link
              to="/adoption"
              className="btn btn-success"
              style={{ backgroundColor: '#15803d', borderRadius: '12px', padding: '10px 24px', fontWeight: 700 }}
            >
              Browse Rescued Animals ➔
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredApps.map((app) => {
              const status = app.application_status;
              const isApproved = status === 'Approved';
              const isRejected = status === 'Rejected';
              const isPending = status === 'Pending';

              return (
                <div
                  key={app._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    padding: '24px',
                    border: '1px solid #e7e3db',
                    boxShadow: '0 4px 16px rgba(27, 43, 31, 0.04)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  {/* Left: Animal Image & Summary */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '280px' }}>
                    <img
                      src={app.image_url || '/assets/images/pet_rocky.jpg'}
                      alt={app.animal_name}
                      style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '16px',
                        objectFit: 'cover',
                        border: '1px solid #e2e8f0',
                      }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: app.animal_category === 'Cow' ? '#fef3c7' : '#dcfce7',
                            color: app.animal_category === 'Cow' ? '#92400e' : '#166534',
                          }}
                        >
                          {app.animal_category}
                        </span>
                        <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                          {app.application_ref_id || 'REF-PENDING'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '0 0 4px 0' }}>
                        {app.animal_name}
                      </h3>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>
                        {app.request_type || 'Pet Adoption'} • Date: <strong>{app.application_date}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Applicant Details */}
                  <div style={{ minWidth: '220px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                      Applicant Details
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1f2937', marginTop: '2px' }}>
                      {app.applicant_name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b' }}>
                      {app.applicant_email} • {app.applicant_phone}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      📍 {app.city || 'Bengaluru'}
                    </div>
                  </div>

                  {/* Status Pill */}
                  <div>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 18px',
                        borderRadius: '9999px',
                        fontSize: '13px',
                        fontWeight: 700,
                        backgroundColor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                        color: isApproved ? '#166534' : isRejected ? '#991b1b' : '#92400e',
                        border: `1px solid ${isApproved ? '#86efac' : isRejected ? '#fca5a5' : '#fde68a'}`,
                      }}
                    >
                      {isApproved && <CheckCircle2 size={15} />}
                      {isRejected && <XCircle size={15} />}
                      {isPending && <Clock size={15} />}
                      {status}
                    </span>
                  </div>

                  {/* Right: Actions */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="btn btn-outline-secondary"
                      style={{ borderRadius: '12px', fontSize: '13px', fontWeight: 600, padding: '8px 16px' }}
                    >
                      <Eye size={15} className="me-1" /> View Details
                    </button>

                    {/* Admin Action Buttons */}
                    {isAdmin && isPending && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(app._id, 'Approved')}
                          className="btn btn-success btn-sm"
                          style={{
                            backgroundColor: '#15803d',
                            borderRadius: '10px',
                            fontWeight: 700,
                            padding: '8px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Check size={14} /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                          className="btn btn-danger btn-sm"
                          style={{
                            borderRadius: '10px',
                            fontWeight: 700,
                            padding: '8px 14px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
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
            overflowY: 'auto',
          }}
          onClick={() => setSelectedApp(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e7e3db',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
              <div>
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  {selectedApp.application_ref_id || selectedApp._id}
                </span>
                <h4 style={{ margin: '6px 0 0 0', fontWeight: 800 }}>
                  Application for {selectedApp.animal_name} ({selectedApp.animal_category})
                </h4>
              </div>

              <button
                onClick={() => setSelectedApp(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '24px' }}>
              {actionFeedback && (
                <div
                  className={`alert alert-${actionFeedback.type === 'success' ? 'success' : 'danger'} rounded-3 mb-3`}
                >
                  {actionFeedback.text}
                </div>
              )}

              {/* Status Header Pill */}
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '14px',
                  backgroundColor:
                    selectedApp.application_status === 'Approved'
                      ? '#ecfdf5'
                      : selectedApp.application_status === 'Rejected'
                      ? '#fef2f2'
                      : '#fffbeb',
                  border: `1px solid ${
                    selectedApp.application_status === 'Approved'
                      ? '#a7f3d0'
                      : selectedApp.application_status === 'Rejected'
                      ? '#fecaca'
                      : '#fde68a'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                    Application Status
                  </div>
                  <div
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color:
                        selectedApp.application_status === 'Approved'
                          ? '#15803d'
                          : selectedApp.application_status === 'Rejected'
                          ? '#b91c1c'
                          : '#b45309',
                    }}
                  >
                    ● {selectedApp.application_status}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Submitted: <strong>{selectedApp.application_date}</strong>
                </div>
              </div>

              {/* Applicant Profile Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Applicant Name</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {selectedApp.applicant_name}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Contact Phone</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {selectedApp.applicant_phone}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Email Address</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {selectedApp.applicant_email}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>City / Location</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {selectedApp.city || 'Bengaluru'}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Residential / Shelter Address</div>
                <div style={{ fontSize: '14px', color: '#334155', marginTop: '2px' }}>
                  {selectedApp.applicant_address || 'Not specified'}
                </div>
              </div>

              {/* Housing & Experience */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Housing / Shelter Type</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                    {selectedApp.housing_type || selectedApp.living_situation || 'Independent House'}
                  </div>
                </div>

                <div style={{ backgroundColor: '#f8fafc', padding: '14px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Experience with Pets</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginTop: '2px' }}>
                    {selectedApp.previous_pet_ownership === 'Yes'
                      ? 'Experienced Pet Owner'
                      : selectedApp.experience_with_pets || 'First Time Adopter'}
                  </div>
                </div>
              </div>

              {/* Adoption / Care Reason */}
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '14px', marginBottom: '24px' }}>
                <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>
                  Reason for Adoption / Care Commitment:
                </div>
                <p style={{ color: '#1e293b', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                  {selectedApp.adoption_reason || selectedApp.reason || 'No statement provided.'}
                </p>
              </div>

              {/* Admin Action Buttons inside modal */}
              {isAdmin && (
                <div
                  style={{
                    borderTop: '1px solid #e2e8f0',
                    paddingTop: '20px',
                    display: 'flex',
                    gap: '12px',
                    justifyContent: 'flex-end',
                  }}
                >
                  <button
                    type="button"
                    disabled={actionLoading || selectedApp.application_status === 'Approved'}
                    onClick={() => handleStatusUpdate(selectedApp._id, 'Approved')}
                    className="btn btn-success"
                    style={{ backgroundColor: '#15803d', borderRadius: '12px', fontWeight: 700, padding: '10px 20px' }}
                  >
                    <Check size={16} className="me-1" /> Approve Application
                  </button>

                  <button
                    type="button"
                    disabled={actionLoading || selectedApp.application_status === 'Rejected'}
                    onClick={() => handleStatusUpdate(selectedApp._id, 'Rejected')}
                    className="btn btn-danger"
                    style={{ borderRadius: '12px', fontWeight: 700, padding: '10px 20px' }}
                  >
                    <X size={16} className="me-1" /> Reject Application
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdoptionApplications;
