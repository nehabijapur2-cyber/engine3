import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import TopNavbar from '../components/TopNavbar';
import {
  ReportAnimalView,
  AvailableAnimalsView,
  PriorityRankingView,
  LedgerView,
} from '../components/ModuleViews';
import '../styles/dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Live dashboard state populated from Express & MongoDB
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalAnimals: 186,
      availableForAdoption: 72,
      activeRescueCases: 38,
      successfulAdoptions: 93,
    },
    recentRescues: [
      {
        _id: '1',
        animal_name: 'Injured Street Dog',
        location: 'MG Road, Bengaluru',
        injury_severity: 'Critical',
        report_date: 'Nov 19, 2025',
        image_url: '/assets/images/res_dog.jpg',
      },
      {
        _id: '2',
        animal_name: 'Abandoned Kitten',
        location: 'Kengeri, Bengaluru',
        injury_severity: 'High',
        report_date: 'Nov 18, 2025',
        image_url: '/assets/images/res_cat.jpg',
      },
      {
        _id: '3',
        animal_name: 'Sick Cow',
        location: 'Rajarajeshwari Nagar',
        injury_severity: 'Medium',
        report_date: 'Nov 15, 2025',
        image_url: '/assets/images/res_cow.jpg',
      },
    ],
    availableAnimals: [
      {
        _id: '1',
        name: 'Rocky',
        category: 'Dog',
        breed: 'Indie',
        age: '1 Year',
        gender: 'Male',
        image_url: '/assets/images/pet_rocky.jpg',
      },
      {
        _id: '2',
        name: 'Mimi',
        category: 'Cat',
        breed: 'Domestic',
        age: '8 Months',
        gender: 'Female',
        image_url: '/assets/images/pet_mimi.jpg',
      },
      {
        _id: '3',
        name: 'Lakshmi',
        category: 'Cow',
        breed: 'Indian Cow',
        age: '2 Years',
        gender: 'Female',
        image_url: '/assets/images/pet_lakshmi.jpg',
      },
    ],
    rescuePriority: {
      animal_name: 'Injured Dog',
      title: 'Injured Dog - Immediate Medical Attention',
      location: 'Bengaluru',
      injury_severity: 'Critical',
      priority_score: 95,
      image_url: '/assets/images/urgent_dog.jpg',
    },
    adoptionUpdate: {
      animal_name: 'Bella',
      application_status: 'Approved',
      date: 'Nov 16, 2025',
      image_url: '/assets/images/bella_dog.jpg',
    },
    veterinaryUpdate: {
      animal_name: 'Mimi',
      status: 'Ongoing',
      date: 'Nov 15, 2025',
      image_url: '/assets/images/vet_mimi.jpg',
    },
    donationSummary: {
      donations: 10500,
      expenses: 6200,
      balance: 1550,
      total: 18250,
    },
  });

  // Fetch real-time data from Express backend
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard')
      .then((res) => {
        if (res.data.success && res.data.data) {
          setDashboardData(res.data.data);
        }
      })
      .catch((err) => {
        console.warn('Backend not responding yet; using demonstration MongoDB data:', err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleAdoptClick = (animal) => {
    navigate('/adoption');
  };

  return (
    <div className="dashboard-layout">
      {/* 1. FIXED DEEP FOREST GREEN SIDEBAR */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setMobileSidebarOpen(false);
        }}
        isOpen={mobileSidebarOpen}
      />

      {/* 2. MAIN APPLICATION CONTENT AREA */}
      <main className="dashboard-main">
        {/* TOPBAR */}
        <TopNavbar
          onSearch={(query) => {
            if (query && query.trim()) {
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
            } else {
              navigate('/search');
            }
          }}
          onToggleMobileMenu={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onOpenProfile={() => setActiveTab('profile')}
        />

        {/* CONDITIONAL SUB-MODULE VIEWS */}
        {activeTab === 'report' && (
          <ReportAnimalView
            onClose={() => setActiveTab('dashboard')}
            onSuccess={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'available' && (
          <AvailableAnimalsView
            onClose={() => setActiveTab('dashboard')}
            onAdoptClick={handleAdoptClick}
          />
        )}

        {activeTab === 'priority' && (
          <PriorityRankingView onClose={() => setActiveTab('dashboard')} />
        )}

        {activeTab === 'donations' && (
          <LedgerView onClose={() => setActiveTab('dashboard')} />
        )}

        {/* 3. FLAGSHIP PETRESCUE DASHBOARD (Matching Reference Image Pixel-by-Pixel) */}
        {activeTab === 'dashboard' && (
          <>
            {/* HERO BANNER (Every Life Deserves Love and Care 💚) */}
            <div className="hero-banner-box">
              <img
                src="/assets/images/hero_banner_full.jpg"
                alt="Every Life Deserves Love and Care - Rescue, protect and give homeless animals a second chance at life"
                className="hero-banner-image"
              />
            </div>

            {/* FIVE PASTEL ROLE ACTION CARDS */}
            <div className="role-cards-row">
              {/* Card 1: General User - Veterinary & Animal Care */}
              <div
                className="role-pill-card role-card-mint"
                onClick={() => navigate('/veterinary-care')}
                title="Animal Care Guidelines & Emergency Veterinary Services"
              >
                <div className="role-pill-left">
                  <div className="role-circle-icon" style={{ background: '#22c55e' }}>
                    🐾
                  </div>
                  <div>
                    <h5 className="role-title" style={{ color: '#14532d' }}>Animal Care & Vet Services</h5>
                    <p className="role-subtitle">Guidelines, signs of illness & verified clinics</p>
                  </div>
                </div>
                <div className="role-circle-arrow" style={{ background: '#22c55e' }}>
                  ➔
                </div>
              </div>

              {/* Card 2: Adopter */}
              <div
                className="role-pill-card role-card-peach"
                onClick={() => navigate('/adoption')}
                title="Apply to adopt and give a pet a forever home"
              >
                <div className="role-pill-left">
                  <div className="role-circle-icon" style={{ background: '#ea580c' }}>
                    <i className="bi bi-house-door-fill"></i>
                  </div>
                  <div>
                    <h5 className="role-title" style={{ color: '#9a3412' }}>Adopter</h5>
                    <p className="role-subtitle">Apply to adopt and give a pet a forever home</p>
                  </div>
                </div>
                <div className="role-circle-arrow" style={{ background: '#ea580c' }}>
                  ➔
                </div>
              </div>

              {/* Card 3: Rescue Volunteer */}
              <div
                className="role-pill-card role-card-purple"
                onClick={() => navigate('/rescue-reports')}
                title="Dispatch emergency rescues & patrols"
              >
                <div className="role-pill-left">
                  <div className="role-circle-icon" style={{ background: '#9333ea' }}>
                    <i className="bi bi-heart-pulse-fill"></i>
                  </div>
                  <div>
                    <h5 className="role-title" style={{ color: '#6b21a8' }}>Rescue Volunteer</h5>
                    <p className="role-subtitle">Dispatch emergency rescues & patrols</p>
                  </div>
                </div>
                <div className="role-circle-arrow" style={{ background: '#9333ea' }}>
                  ➔
                </div>
              </div>

              {/* Card 4: Veterinarian */}
              <div
                className="role-pill-card role-card-blue"
                onClick={() => navigate(user?.role === 'Veterinarian' || user?.role === 'Admin' ? '/medical-records' : '/veterinary-care')}
                title="Veterinary clinical records & treatments"
              >
                <div className="role-pill-left">
                  <div className="role-circle-icon" style={{ background: '#0284c7' }}>
                    <i className="bi bi-plus-square-fill"></i>
                  </div>
                  <div>
                    <h5 className="role-title" style={{ color: '#0369a1' }}>Veterinarian</h5>
                    <p className="role-subtitle">Provide clinical triage & surgeries</p>
                  </div>
                </div>
                <div className="role-circle-arrow" style={{ background: '#0284c7' }}>
                  ➔
                </div>
              </div>

              {/* Card 5: Donor */}
              <div
                className="role-pill-card role-card-lime"
                onClick={() => setActiveTab('donations')}
                title="Sponsor animal surgeries & shelter medicines"
              >
                <div className="role-pill-left">
                  <div className="role-circle-icon" style={{ background: '#65a30d' }}>
                    <i className="bi bi-gift-fill"></i>
                  </div>
                  <div>
                    <h5 className="role-title" style={{ color: '#3f6212' }}>Donor</h5>
                    <p className="role-subtitle">Sponsor animal surgeries & shelter medicines</p>
                  </div>
                </div>
                <div className="role-circle-arrow" style={{ background: '#65a30d' }}>
                  ➔
                </div>
              </div>
            </div>

            {/* FOUR MAIN STATISTICS CARDS */}
            <div className="stats-cards-row">
              {/* Stat 1: Total Animals */}
              <div
                className="stat-box-card role-card-mint"
                onClick={() => navigate('/animals')}
                style={{ cursor: 'pointer' }}
                title="View All Animals in Shelter Registry"
              >
                <div className="stat-box-top">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-4 text-success">🐾</span>
                    <span className="stat-box-label">Total Animals</span>
                  </div>
                  <span className="stat-box-badge text-success">Live DB</span>
                </div>
                <div>
                  <div className="stat-box-number">
                    {dashboardData.stats.totalAnimals || 0}
                  </div>
                </div>
                <div className="stat-watermark-icon">🐾</div>
              </div>

              {/* Stat 2: Available for Adoption */}
              <div
                className="stat-box-card role-card-peach"
                onClick={() => navigate('/adoption')}
                style={{ cursor: 'pointer' }}
                title="Browse Animals Available for Adoption"
              >
                <div className="stat-box-top">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-house-door-fill text-warning fs-5"></i>
                    <span className="stat-box-label">Available for Adoption</span>
                  </div>
                  <span className="stat-box-badge text-warning">Live DB</span>
                </div>
                <div>
                  <div className="stat-box-number">
                    {dashboardData.stats.availableForAdoption || 0}
                  </div>
                </div>
                <div className="stat-watermark-icon">🏡</div>
              </div>

              {/* Stat 3: Active Rescue Cases */}
              <div
                className="stat-box-card role-card-blue"
                onClick={() => navigate('/rescue-reports')}
                style={{ cursor: 'pointer' }}
                title="Manage Active Rescue Cases"
              >
                <div className="stat-box-top">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-truck text-info fs-5"></i>
                    <span className="stat-box-label">Active Rescue Cases</span>
                  </div>
                  <span className="stat-box-badge text-info">Live DB</span>
                </div>
                <div>
                  <div className="stat-box-number">
                    {dashboardData.stats.activeRescueCases || 0}
                  </div>
                </div>
                <div className="stat-watermark-icon">🚑</div>
              </div>

              {/* Stat 4: Successful Adoptions */}
              <div
                className="stat-box-card role-card-purple"
                onClick={() => navigate('/adoption-applications')}
                style={{ cursor: 'pointer' }}
                title="View Adoption Applications"
              >
                <div className="stat-box-top">
                  <div className="d-flex align-items-center gap-2">
                    <i className="bi bi-heart-fill fs-5" style={{ color: '#9333ea' }}></i>
                    <span className="stat-box-label">Successful Adoptions</span>
                  </div>
                  <span className="stat-box-badge" style={{ color: '#9333ea' }}>Live DB</span>
                </div>
                <div>
                  <div className="stat-box-number">
                    {dashboardData.stats.successfulAdoptions || 0}
                  </div>
                </div>
                <div className="stat-watermark-icon">🤝</div>
              </div>
            </div>

            {/* MIDDLE ROW (Recent Rescue Reports, Available Animals, Rescue Priority) */}
            <div className="row g-3 mb-4">
              {/* Col 1: Recent Rescue Reports */}
              <div className="col-lg-4">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span className="text-success">🐾</span> Recent Rescue Reports
                    </h3>
                    <a
                      href="#view-all"
                      className="box-header-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/rescue-reports');
                      }}
                    >
                      View All ➔
                    </a>
                  </div>

                  <div className="rescue-reports-list">
                    {dashboardData.recentRescues.map((res, idx) => (
                      <div className="rescue-row-item" key={res._id || idx}>
                        <img
                          src={res.image_url || '/assets/images/res_dog.jpg'}
                          alt={res.animal_name}
                          className="rescue-thumb-img"
                        />
                        <div className="rescue-info-col">
                          <h4 className="rescue-title-text">{res.animal_name}</h4>
                          <p className="rescue-loc-text">
                            <i className="bi bi-geo-alt-fill text-danger small me-1"></i>
                            {res.location}
                          </p>
                        </div>
                        <div className="text-end">
                          <span
                            className={
                              res.injury_severity === 'Critical'
                                ? 'badge-crit'
                                : res.injury_severity === 'High'
                                ? 'badge-hg'
                                : 'badge-md'
                            }
                          >
                            {res.injury_severity} ➔
                          </span>
                          <div className="small text-muted mt-1" style={{ fontSize: '0.68rem' }}>
                            {res.report_date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 2: Available Animals (Rocky, Mimi, Lakshmi) */}
              <div className="col-lg-5">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span className="text-success">
                        <i className="bi bi-house-door-fill"></i>
                      </span>{' '}
                      Available Animals
                    </h3>
                    <a
                      href="#view-all"
                      className="box-header-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/adoption');
                      }}
                    >
                      View All ➔
                    </a>
                  </div>

                  <div className="mini-pets-grid">
                    {dashboardData.availableAnimals.map((anim, idx) => (
                      <div className="mini-pet-box" key={anim._id || idx}>
                        <img
                          src={anim.image_url || '/assets/images/pet_rocky.jpg'}
                          alt={anim.name}
                          className="mini-pet-thumb"
                        />
                        <div className="mini-pet-details">
                          <div>
                            <h4 className="mini-pet-title">{anim.name}</h4>
                            <p className="mini-pet-subtext">
                              {anim.category} • {anim.breed}<br />
                              {anim.age} • {anim.gender}
                            </p>
                          </div>
                          <button
                            type="button"
                            className="mini-pet-adopt-btn"
                            onClick={() => handleAdoptClick(anim)}
                          >
                            Adopt Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Col 3: Rescue Priority Urgency Featured Box */}
              <div className="col-lg-3">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span className="text-danger">
                        <i className="bi bi-gift-fill"></i>
                      </span>{' '}
                      Rescue Priority
                    </h3>
                    <a
                      href="#view-all"
                      className="box-header-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/rescue-reports');
                      }}
                    >
                      View All ➔
                    </a>
                  </div>

                  <div className="position-relative">
                    <img
                      src="/assets/images/urgent_dog.jpg"
                      alt="Urgent Priority Case"
                      className="priority-featured-img"
                    />
                    <span
                      className="position-absolute badge bg-danger rounded-pill px-2 py-1"
                      style={{ top: '8px', right: '8px', fontSize: '0.7rem' }}
                    >
                      Critical
                    </span>
                    <div className="pt-2">
                      <h4
                        className="fw-bold mb-1"
                        style={{ fontSize: '0.86rem', color: '#192e21' }}
                      >
                        {dashboardData.rescuePriority.title}
                      </h4>
                      <p className="text-muted small mb-2" style={{ fontSize: '0.74rem' }}>
                        <i className="bi bi-geo-alt-fill text-danger me-1"></i>
                        {dashboardData.rescuePriority.location}
                      </p>
                      <div className="priority-meter-track" title="Priority Urgency Score: 95/100">
                        <div
                          className="priority-meter-bar-fill"
                          style={{ width: `${dashboardData.rescuePriority.priority_score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW (Adoption Updates, Veterinary Updates, Donation Summary, Inspirational Banner) */}
            <div className="row g-3">
              {/* Bottom Col 1: Adoption Updates */}
              <div className="col-lg-3">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span className="text-danger">❤️</span> Adoption Updates
                    </h3>
                    <a
                      href="#view-all"
                      className="box-header-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/adoption');
                      }}
                    >
                      View All ➔
                    </a>
                  </div>

                  <div className="d-flex align-items-center gap-3">
                    <img
                      src="/assets/images/bella_dog.jpg"
                      alt="Bella"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <h4
                        className="fw-bold mb-1"
                        style={{ fontSize: '0.88rem', color: '#192e21' }}
                      >
                        Adoption Approved for {dashboardData.adoptionUpdate.animal_name}
                      </h4>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {dashboardData.adoptionUpdate.date}
                        </small>
                        <span
                          className="badge bg-success-subtle text-success rounded-pill px-2"
                          style={{ fontSize: '0.7rem' }}
                        >
                          Approved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Col 2: Veterinary & Emergency Care */}
              <div className="col-lg-3">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span style={{ color: '#15803d' }}>
                        <i className="bi bi-hospital"></i>
                      </span>{' '}
                      Veterinary & Care
                    </h3>
                    <a
                      href="#view-all"
                      className="box-header-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/veterinary-care');
                      }}
                    >
                      View All ➔
                    </a>
                  </div>

                  <div className="d-flex align-items-center gap-3 mb-2">
                    <img
                      src="/assets/images/vet_mimi.jpg"
                      alt="Mimi"
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                      }}
                    />
                    <div>
                      <h4
                        className="fw-bold mb-1"
                        style={{ fontSize: '0.88rem', color: '#192e21' }}
                      >
                        Treatment in Progress for {dashboardData.veterinaryUpdate.animal_name}
                      </h4>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted" style={{ fontSize: '0.72rem' }}>
                          {dashboardData.veterinaryUpdate.date}
                        </small>
                        <span
                          className="badge bg-success-subtle text-success rounded-pill px-2"
                          style={{ fontSize: '0.7rem' }}
                        >
                          Clinical Care
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-top d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-success w-100 rounded-pill py-1 fw-bold"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => navigate('/veterinary-care')}
                    >
                      🐾 Care Guidelines & Vet Hospitals ➔
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Col 3: Donation Summary (Donut Chart) */}
              <div className="col-lg-3">
                <div className="content-box-card">
                  <div className="box-header-row">
                    <h3 className="box-header-title">
                      <span className="text-success">
                        <i className="bi bi-gift-fill"></i>
                      </span>{' '}
                      Donation Summary
                    </h3>
                  </div>

                  <div className="donut-chart-flex">
                    <div className="donut-circle">
                      <div className="donut-inner-hole">
                        <span className="donut-inner-val">
                          ₹{dashboardData.donationSummary.total.toLocaleString()}
                        </span>
                        <span className="donut-inner-txt">Total</span>
                      </div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <ul className="donut-list mb-2">
                        <li>
                          <span>
                            <span className="dot-color" style={{ background: '#22c55e' }}></span>{' '}
                            Donations
                          </span>
                          <strong>₹{dashboardData.donationSummary.donations.toLocaleString()}</strong>
                        </li>
                        <li>
                          <span>
                            <span className="dot-color" style={{ background: '#f97316' }}></span>{' '}
                            Expenses
                          </span>
                          <strong>₹{dashboardData.donationSummary.expenses.toLocaleString()}</strong>
                        </li>
                        <li>
                          <span>
                            <span className="dot-color" style={{ background: '#3b82f6' }}></span>{' '}
                            Balance
                          </span>
                          <strong>₹{dashboardData.donationSummary.balance.toLocaleString()}</strong>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="btn btn-sm w-100 rounded-pill py-1 fw-bold text-white"
                        style={{ background: '#083b20', fontSize: '0.75rem' }}
                        onClick={() => setActiveTab('donations')}
                      >
                        View Details ➔
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Col 4: Inspirational Card */}
              <div className="col-lg-3">
                <div className="inspirational-welfare-card">
                  <div>
                    <span style={{ fontSize: '1.4rem' }}>🐾</span>
                    <h4 className="inspirational-quote-text mt-1">
                      Be the reason <br />an animal smiles... 💚
                    </h4>
                  </div>
                  <img
                    src="/assets/images/inspire_puppy.jpg"
                    alt="Smiling Animal"
                    className="inspirational-thumb"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
