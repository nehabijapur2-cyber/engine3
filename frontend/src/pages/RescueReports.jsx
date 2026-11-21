import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ShieldAlert,
  PawPrint,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  UserCheck,
  Send,
  Check,
  X,
  Search,
  Activity,
  PlusCircle,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const STATUS_STAGES = [
  'Submitted',
  'Under Verification',
  'Verified',
  'Assigned',
  'Rescue in Progress',
  'Rescued',
];

const RescueReports = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isVolunteer = user?.role === 'Rescue Volunteer' || user?.role === 'Rescue Volunteer / Administrator';
  const isStaff = isAdmin || isVolunteer;

  const [reports, setReports] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected report modal
  const [selectedReport, setSelectedReport] = useState(null);

  // Action states
  const [selectedVolunteer, setSelectedVolunteer] = useState('');
  const [newProgressNote, setNewProgressNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = 'http://localhost:5000/api/rescues';

      // If standard user, fetch their reports
      if (!isStaff && user?.email) {
        url = `http://localhost:5000/api/rescues/my-reports?email=${encodeURIComponent(user.email)}&phone=${encodeURIComponent(user.phone || '')}`;
      }

      const res = await axios.get(url);
      if (res.data.success) {
        setReports(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading rescue reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVolunteers = async () => {
    if (isStaff) {
      try {
        const res = await axios.get('http://localhost:5000/api/rescues/volunteers');
        if (res.data.success) {
          setVolunteers(res.data.data || []);
        }
      } catch (err) {
        console.warn('Volunteers roster load error:', err.message);
      }
    }
  };

  useEffect(() => {
    fetchReports();
    fetchVolunteers();
  }, [isStaff, user?.email]);

  // Update status handler
  const handleUpdateStatus = async (reportId, newStatus, assignedVolName = null) => {
    setActionLoading(true);
    setFeedbackMessage(null);
    try {
      const payload = {
        status: newStatus,
        author: `${user?.fullName || 'Rescue Staff'} (${user?.role || 'Coordinator'})`,
      };
      if (assignedVolName) {
        payload.assigned_volunteer = assignedVolName;
      }

      const res = await axios.patch(`http://localhost:5000/api/rescues/${reportId}/status`, payload);
      if (res.data.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Rescue report status updated to '${newStatus}'!`,
        });
        if (selectedReport && selectedReport._id === reportId) {
          setSelectedReport(res.data.data);
        }
        fetchReports();
      }
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update status',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Assign volunteer handler
  const handleAssignVolunteer = async (reportId) => {
    if (!selectedVolunteer) return;
    setActionLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await axios.patch(`http://localhost:5000/api/rescues/${reportId}/status`, {
        status: 'Assigned',
        assigned_volunteer: selectedVolunteer,
        note: `Dispatched case to field volunteer ${selectedVolunteer}.`,
        author: `${user?.fullName || 'Admin'} (Rescue Dispatcher)`,
      });

      if (res.data.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Assigned to volunteer ${selectedVolunteer} successfully!`,
        });
        setSelectedVolunteer('');
        if (selectedReport) {
          setSelectedReport(res.data.data);
        }
        fetchReports();
      }
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to assign volunteer',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Adjust urgency level
  const handleUpdateUrgency = async (reportId, newUrgency) => {
    setActionLoading(true);
    setFeedbackMessage(null);
    try {
      const res = await axios.patch(`http://localhost:5000/api/rescues/${reportId}/urgency`, {
        urgency_level: newUrgency,
        reason: `Clinical priority assessment updated by ${user?.fullName || 'Staff'}.`,
        author: `${user?.fullName || 'Clinical Staff'} (${user?.role || 'Staff'})`,
      });

      if (res.data.success) {
        setFeedbackMessage({
          type: 'success',
          text: `Urgency level adjusted to '${newUrgency}'!`,
        });
        if (selectedReport) {
          setSelectedReport(res.data.data);
        }
        fetchReports();
      }
    } catch (err) {
      setFeedbackMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to adjust urgency',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Add progress note
  const handleAddNote = async (reportId) => {
    if (!newProgressNote.trim()) return;
    setActionLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/api/rescues/${reportId}/notes`, {
        note: newProgressNote.trim(),
        author: `${user?.fullName || 'Field Volunteer'} (${user?.role || 'Volunteer'})`,
      });

      if (res.data.success) {
        setNewProgressNote('');
        if (selectedReport) {
          setSelectedReport(res.data.data);
        }
        fetchReports();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add progress note');
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const curStatus = r.report_status || r.status || 'Submitted';
    const curCategory = r.animal_category || r.category || 'Dog';
    const curUrgency = r.urgency_level || r.injury_severity || 'Medium';

    const matchesStatus = statusFilter === 'All' || curStatus === statusFilter;
    const matchesCategory = categoryFilter === 'All' || curCategory === categoryFilter;
    const matchesUrgency = urgencyFilter === 'All' || curUrgency === urgencyFilter;

    const matchesSearch =
      (r.report_id && r.report_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.animal_name && r.animal_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.location && r.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.reporter_name && r.reporter_name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesCategory && matchesUrgency && matchesSearch;
  });

  // Calculate quick metrics
  const activeCount = reports.filter((r) => (r.report_status || r.status) !== 'Closed' && (r.report_status || r.status) !== 'Rescued').length;
  const criticalCount = reports.filter((r) => (r.urgency_level || r.injury_severity) === 'Critical').length;
  const rescuedCount = reports.filter((r) => (r.report_status || r.status) === 'Rescued').length;

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '36px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '14px' }}>
          <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
            Dashboard
          </Link>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b', fontWeight: 600 }}>
            {isStaff ? 'Emergency Rescue Operations' : 'My Animal Rescue Reports'}
          </span>
        </div>

        {/* Top Header Banner */}
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
              <span style={{ fontSize: '28px' }}>🚑</span>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#14532d', margin: 0 }}>
                {isStaff ? 'Rescue Operations & Dispatch Management' : 'My Animal Rescue Reports'}
              </h1>
            </div>
            <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
              {isStaff
                ? 'Coordinate rapid ambulance dispatches, verify citizen reports, assign volunteers, and track clinical recovery.'
                : 'Monitor real-time triage, ambulance dispatch, and shelter admission progress for animals you reported.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              to="/report-animal"
              className="btn btn-success"
              style={{
                backgroundColor: '#15803d',
                borderRadius: '12px',
                padding: '10px 22px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <PlusCircle size={18} /> Report an Animal
            </Link>
          </div>
        </div>

        {/* Staff Metrics Row */}
        {isStaff && (
          <div className="row g-3 mb-4">
            <div className="col-md-3 col-6">
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e7e3db' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Rescues</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{activeCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #fee2e2' }}>
                <div style={{ fontSize: '12px', color: '#b91c1c', fontWeight: 700, textTransform: 'uppercase' }}>Critical Urgency</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#dc2626', marginTop: '4px' }}>{criticalCount}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #e7e3db' }}>
                <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Registered</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{reports.length}</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div style={{ backgroundColor: '#ffffff', borderRadius: '18px', padding: '20px', border: '1px solid #dcfce7' }}>
                <div style={{ fontSize: '12px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>Rescued & Safe</div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>{rescuedCount}</div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '18px',
            padding: '20px',
            border: '1px solid #e7e3db',
            marginBottom: '28px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flexGrow: 1, minWidth: '240px' }}>
            <Search
              size={18}
              style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search reports by ID, landmark, animal..."
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

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Category:</span>
            <select
              className="form-select form-select-sm"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ borderRadius: '10px', fontSize: '13px' }}
            >
              <option value="All">All Categories</option>
              <option value="Dog">Dogs</option>
              <option value="Cat">Cats</option>
              <option value="Cow">Cows</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Urgency:</span>
            <select
              className="form-select form-select-sm"
              value={urgencyFilter}
              onChange={(e) => setUrgencyFilter(e.target.value)}
              style={{ borderRadius: '10px', fontSize: '13px' }}
            >
              <option value="All">All Urgency</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Status:</span>
            <select
              className="form-select form-select-sm"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ borderRadius: '10px', fontSize: '13px' }}
            >
              <option value="All">All Statuses</option>
              {STATUS_STAGES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Reports Cards List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <PawPrint size={40} className="animate-spin" style={{ color: '#15803d', marginBottom: '12px' }} />
            <h4>Loading rescue operations data...</h4>
          </div>
        ) : filteredReports.length === 0 ? (
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
            <h4 style={{ color: '#1f2937', fontWeight: 700 }}>No rescue reports found</h4>
            <p style={{ color: '#64748b', maxWidth: '420px', margin: '0 auto 20px auto' }}>
              {isStaff
                ? 'No rescue reports match your selected search or filter criteria.'
                : "You haven't submitted any rescue reports yet. If you see a stray animal in distress, report it immediately!"}
            </p>
            <Link
              to="/report-animal"
              className="btn btn-success"
              style={{ backgroundColor: '#15803d', borderRadius: '12px', padding: '10px 24px', fontWeight: 700 }}
            >
              Report an Animal in Need ➔
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredReports.map((report) => {
              const curStatus = report.report_status || report.status || 'Submitted';
              const curUrgency = report.urgency_level || report.injury_severity || 'Medium';
              const curCategory = report.animal_category || report.category || 'Dog';
              const curStageIndex = STATUS_STAGES.indexOf(curStatus);

              const isCritical = curUrgency === 'Critical';
              const isHigh = curUrgency === 'High';

              return (
                <div
                  key={report._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '22px',
                    padding: '28px',
                    border: '1px solid #e7e3db',
                    boxShadow: '0 6px 20px rgba(27, 43, 31, 0.05)',
                    transition: 'box-shadow 0.2s ease',
                  }}
                >
                  {/* Card Top Row */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '16px',
                      marginBottom: '20px',
                    }}
                  >
                    {/* Left: Thumbnail & Main Info */}
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <img
                        src={report.image_url || '/assets/images/res_dog.jpg'}
                        alt={report.animal_name}
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '18px',
                          objectFit: 'cover',
                          border: '2px solid #e2e8f0',
                        }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '12px',
                              fontWeight: 700,
                              color: '#0f766e',
                              backgroundColor: '#f0fdfa',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #ccfbf1',
                            }}
                          >
                            {report.report_id || report._id.slice(-8)}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: '#f1f5f9',
                              color: '#334155',
                            }}
                          >
                            {curCategory}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '9999px',
                              backgroundColor: '#ecfdf5',
                              color: '#15803d',
                            }}
                          >
                            {report.report_type || 'Rescue Case'}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '0 0 6px 0' }}>
                          {report.animal_name}
                        </h3>

                        <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={14} color="#dc2626" />
                          <span>{report.location}</span>
                          <span>•</span>
                          <Calendar size={14} />
                          <span>{report.report_date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Urgency Pill & Primary Action */}
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 16px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 800,
                          backgroundColor: isCritical
                            ? '#fee2e2'
                            : isHigh
                            ? '#ffedd5'
                            : '#fef3c7',
                          color: isCritical ? '#991b1b' : isHigh ? '#9a3412' : '#92400e',
                          border: `1px solid ${isCritical ? '#fca5a5' : isHigh ? '#fed7aa' : '#fde68a'}`,
                        }}
                      >
                        {isCritical ? '🚨 Critical Urgency' : isHigh ? '⚠️ High Urgency' : '⚡ Medium Urgency'}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="btn btn-outline-success btn-sm"
                        style={{ borderRadius: '10px', fontWeight: 700, padding: '8px 18px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Eye size={15} /> View Full Timeline & Actions
                      </button>
                    </div>
                  </div>

                  {/* Visual 6-Stage Progress Tracker Bar */}
                  <div style={{ padding: '16px 20px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #edf2f7', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                      {/* Connecting Line */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '4%',
                          right: '4%',
                          height: '3px',
                          backgroundColor: '#e2e8f0',
                          zIndex: 0,
                        }}
                      />

                      {STATUS_STAGES.map((stage, idx) => {
                        const isCompleted = curStageIndex >= idx;
                        const isCurrent = curStageIndex === idx;

                        return (
                          <div
                            key={stage}
                            style={{
                              position: 'relative',
                              zIndex: 1,
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                backgroundColor: isCurrent
                                  ? '#15803d'
                                  : isCompleted
                                  ? '#22c55e'
                                  : '#ffffff',
                                border: `2px solid ${isCompleted ? '#15803d' : '#cbd5e1'}`,
                                color: isCompleted ? '#ffffff' : '#64748b',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '12px',
                                fontWeight: 700,
                                marginBottom: '6px',
                                boxShadow: isCurrent ? '0 0 0 4px #bbf7d0' : 'none',
                              }}
                            >
                              {isCompleted ? '✓' : idx + 1}
                            </div>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: isCurrent ? 800 : 600,
                                color: isCurrent ? '#14532d' : isCompleted ? '#334155' : '#94a3b8',
                                textAlign: 'center',
                                lineHeight: 1.2,
                              }}
                            >
                              {stage}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Bottom Meta (Assigned Volunteer & Reporter) */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '13px',
                      color: '#64748b',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      Assigned Volunteer:{' '}
                      <strong style={{ color: '#0f172a' }}>
                        {report.assigned_volunteer && report.assigned_volunteer !== 'Unassigned'
                          ? `🚑 ${report.assigned_volunteer}`
                          : 'Pending volunteer assignment'}
                      </strong>
                    </div>

                    <div>
                      Reporter: <strong>{report.reporter_name}</strong> ({report.reporter_phone})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Report Modal with Volunteer & Admin Action Controls */}
      {selectedReport && (
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
          onClick={() => setSelectedReport(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              maxWidth: '760px',
              width: '100%',
              maxHeight: '92vh',
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
                padding: '24px 28px',
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
                  {selectedReport.report_id || selectedReport._id}
                </span>
                <h3 style={{ margin: '6px 0 0 0', fontWeight: 800, fontSize: '22px' }}>
                  {selectedReport.animal_name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedReport(null)}
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
            <div style={{ padding: '28px' }}>
              {feedbackMessage && (
                <div
                  className={`alert alert-${feedbackMessage.type === 'success' ? 'success' : 'danger'} rounded-3 mb-3`}
                >
                  {feedbackMessage.text}
                </div>
              )}

              {/* Status & Urgency Header Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#f8fafc',
                  padding: '16px 20px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Current Status
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                    ● {selectedReport.report_status || selectedReport.status || 'Submitted'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Urgency Triage
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c', marginTop: '2px' }}>
                    {selectedReport.urgency_level || selectedReport.injury_severity || 'Medium'}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Report Date
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                    {selectedReport.report_date}
                  </div>
                </div>
              </div>

              {/* Animal & Location Details Grid */}
              <div className="row g-3 mb-4">
                <div className="col-md-5">
                  <img
                    src={selectedReport.image_url || '/assets/images/res_dog.jpg'}
                    alt={selectedReport.animal_name}
                    style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', border: '1px solid #e2e8f0' }}
                  />
                </div>
                <div className="col-md-7">
                  <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '16px', height: '100%' }}>
                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
                      Rescue Location & Landmark:
                    </h5>
                    <p style={{ fontSize: '14px', color: '#1e293b', fontWeight: 600, marginBottom: '12px' }}>
                      📍 {selectedReport.location}, {selectedReport.city || 'Bengaluru'}
                    </p>

                    <h5 style={{ fontSize: '14px', fontWeight: 700, color: '#14532d', marginBottom: '6px' }}>
                      Observed Condition:
                    </h5>
                    <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                      {selectedReport.animal_condition || selectedReport.health_condition || 'In distress'}
                    </p>

                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Reporter: <strong>{selectedReport.reporter_name}</strong> • Phone: <strong>{selectedReport.reporter_phone}</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline Notes */}
              <div style={{ marginBottom: '28px' }}>
                <h5 style={{ fontSize: '16px', fontWeight: 800, color: '#14532d', marginBottom: '14px' }}>
                  Rescue Case Progress Notes:
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedReport.progress_notes && selectedReport.progress_notes.length > 0 ? (
                    selectedReport.progress_notes.map((note, nIdx) => (
                      <div
                        key={nIdx}
                        style={{
                          backgroundColor: '#fafaf9',
                          borderRadius: '12px',
                          padding: '12px 16px',
                          border: '1px solid #f5f5f4',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#78716c', marginBottom: '4px' }}>
                          <strong>{note.author || 'Rescue Coordinator'}</strong>
                          <span>{new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#1c1917' }}>{note.note}</p>
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: '13px', color: '#64748b' }}>No field notes recorded yet.</div>
                  )}
                </div>
              </div>

              {/* STAFF & VOLUNTEER DISPATCH ACTION CONTROLS */}
              {isStaff && (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    borderRadius: '18px',
                    padding: '24px',
                    border: '1px solid #bbf7d0',
                  }}
                >
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#14532d', marginBottom: '16px' }}>
                    Coordinator & Volunteer Dispatch Actions
                  </h4>

                  {/* 1. Quick Status Buttons */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                      Advance Lifecycle Status:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedReport._id, 'Verified')}
                        className="btn btn-sm btn-outline-success"
                        style={{ borderRadius: '8px', fontWeight: 700 }}
                      >
                        ✓ Mark Verified
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedReport._id, 'Rescue in Progress')}
                        className="btn btn-sm btn-outline-primary"
                        style={{ borderRadius: '8px', fontWeight: 700 }}
                      >
                        🚑 En-Route / In Progress
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedReport._id, 'Rescued')}
                        className="btn btn-sm btn-success"
                        style={{ backgroundColor: '#15803d', borderRadius: '8px', fontWeight: 700 }}
                      >
                        🎉 Safely Rescued
                      </button>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleUpdateStatus(selectedReport._id, 'Closed')}
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderRadius: '8px', fontWeight: 700 }}
                      >
                        ✕ Close Report
                      </button>
                    </div>
                  </div>

                  {/* 2. Volunteer Assignment (Admin only) */}
                  {isAdmin && (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                        Assign to Registered Volunteer:
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <select
                          className="form-select form-select-sm"
                          value={selectedVolunteer}
                          onChange={(e) => setSelectedVolunteer(e.target.value)}
                          style={{ borderRadius: '10px', fontSize: '13px' }}
                        >
                          <option value="">Select Volunteer...</option>
                          {volunteers.map((v) => (
                            <option key={v._id} value={v.fullName || v.full_name}>
                              {v.fullName || v.full_name} ({v.phone || v.email})
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          disabled={!selectedVolunteer || actionLoading}
                          onClick={() => handleAssignVolunteer(selectedReport._id)}
                          className="btn btn-success btn-sm"
                          style={{ backgroundColor: '#15803d', borderRadius: '10px', fontWeight: 700, whiteSpace: 'nowrap' }}
                        >
                          Dispatch Volunteer
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 3. Triage Urgency Level Adjustment */}
                  {isAdmin && (
                    <div style={{ marginBottom: '18px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '8px' }}>
                        Adjust Urgency Level (Staff Review):
                      </div>
                      <div className="btn-group" role="group">
                        {['Critical', 'High', 'Medium', 'Low'].map((urg) => (
                          <button
                            key={urg}
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleUpdateUrgency(selectedReport._id, urg)}
                            className={`btn btn-sm ${
                              (selectedReport.urgency_level || selectedReport.injury_severity) === urg
                                ? 'btn-dark'
                                : 'btn-outline-secondary'
                            }`}
                            style={{ borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 700 }}
                          >
                            {urg}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Append Progress Field Note */}
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                      Add Field Update Note:
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="e.g. Ambulance arrived at landmark; animal secured in transport crate..."
                        value={newProgressNote}
                        onChange={(e) => setNewProgressNote(e.target.value)}
                        style={{ borderRadius: '10px' }}
                      />
                      <button
                        type="button"
                        disabled={!newProgressNote.trim() || actionLoading}
                        onClick={() => handleAddNote(selectedReport._id)}
                        className="btn btn-dark btn-sm"
                        style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Send size={14} /> Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RescueReports;
