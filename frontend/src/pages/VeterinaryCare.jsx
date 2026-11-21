import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  Heart,
  Activity,
  AlertTriangle,
  Phone,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Info,
  Clock,
  ArrowRight,
  FileText,
  Shield,
  HelpCircle,
  MapPin,
  Search,
  Check,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DEFAULT_VERIFIED_CLINICS = [
  {
    id: 'vet-serv-1',
    name: 'CUPA Trauma Centre & Hospital (Compassion Unlimited Plus Action)',
    category: 'Animal Hospital & 24/7 Emergency Care',
    type: 'Animal Hospital',
    address: 'KVAFSU Campus, Bellary Road, Hebbal, Bengaluru, Karnataka 560024',
    phone: '+91 80 2294 7307',
    emergency_phone: '+91 91484 25050',
    hours: 'Open 24 Hours / 7 Days',
    services_offered: [
      '24/7 Emergency Trauma Surgery',
      'Street Animal Rescue Ambulance',
      'Critical Care & Oxygen Support ICU',
      'Digital Radiography & X-Ray Diagnostics',
      'Rabies Isolation & Quarantine Ward',
      'Wound Debridement & Maggot Therapy',
    ],
    verified: true,
  },
  {
    id: 'vet-serv-2',
    name: 'Government Veterinary Hospital (Veterinary College Hospital Hebbal)',
    category: 'Government Veterinary Hospital & Referral Centre',
    type: 'Veterinary Clinic',
    address: 'Veterinary College Campus, Bellary Road, Hebbal, Bengaluru, Karnataka 560024',
    phone: '+91 80 2341 1483',
    emergency_phone: '+91 80 2341 0584',
    hours: '8:00 AM – 4:00 PM (Emergency 24 hrs)',
    services_offered: [
      'Subsidized General Outpatient Consultations',
      'Canine & Feline Orthopedic Surgery',
      'Desi Cow & Livestock Large Animal Ward',
      'Anti-Rabies Vaccination (ARV) Prophylaxis',
      'Diagnostic Pathology & Ultrasound',
    ],
    verified: true,
  },
  {
    id: 'vet-serv-3',
    name: 'PFA Wildlife & Pet Rescue Hospital (People For Animals)',
    category: 'Animal Welfare Hospital & Rehabilitation Sanctuary',
    type: 'Animal Hospital',
    address: 'Survey No. 67, Uttarahalli Main Road, Kengeri, Bengaluru, Karnataka 560060',
    phone: '+91 99000 25370',
    emergency_phone: '+91 99803 39880',
    hours: '9:00 AM – 5:30 PM (Helpline 24 hrs)',
    services_offered: [
      'Free & Subsidized Stray Rescue Medical Care',
      'Animal Birth Control (ABC) Sterilization',
      'Dedicated Veterinary Ambulance Transport',
      'Avian & Wildlife Trauma Rehabilitation',
      'Post-Operative Recovery Shelter Kennels',
    ],
    verified: true,
  },
  {
    id: 'vet-serv-4',
    name: 'Cessna Lifeline Veterinary Hospital',
    category: 'Multi-Speciality Veterinary Hospital & Emergency Clinic',
    type: 'Emergency Veterinary Service',
    address: 'No. 148, HBCS Layout, Amarjyothi Layout, Domlur, Bengaluru, Karnataka 560071',
    phone: '+91 80 4165 3737',
    emergency_phone: '+91 76763 65365',
    hours: 'Open 24 Hours / 7 Days',
    services_offered: [
      '24/7 Emergency Triage & Intensive Care Unit',
      'Advanced Soft Tissue & Orthopedic Surgery',
      'In-House Complete Hematology & Biochemistry',
      'Echocardiography & Ultrasound Imaging',
      'Routine Puppy & Kitten Core Vaccinations',
    ],
    verified: true,
  },
  {
    id: 'vet-serv-5',
    name: "CARE (Charlie's Animal Rescue Centre)",
    category: 'Animal Rescue Shelter & Trauma Care Clinic',
    type: 'Animal Treatment & Vaccination',
    address: 'Survey No. 124/1, Mittaganahalli Cross, Kogilu, Yelahanka, Bengaluru, Karnataka 560064',
    phone: '+91 94839 34329',
    emergency_phone: '+91 90359 99372',
    hours: '9:30 AM – 5:00 PM',
    services_offered: [
      'Street Animal Road Trauma Rehabilitation',
      'Contagious Disease Isolation (Parvo & Distemper)',
      'Canine Hydrotherapy & Physical Recovery',
      'Adoption Health Profiling & Microchipping',
      'Free Rabies & De-worming Community Drives',
    ],
    verified: true,
  },
];

const VeterinaryCare = () => {
  const { user, isAuthenticated } = useAuth();
  const isVet = user?.role === 'Veterinarian';
  const isAdmin = user?.role === 'Admin';
  const canAccessRecords = isVet || isAdmin;

  // Tabs: 'guidelines', 'services', 'emergency'
  const [activeTab, setActiveTab] = useState('guidelines');

  // Animal Guidelines sub-filter: 'all', 'dog', 'cat', 'cow'
  const [animalFilter, setAnimalFilter] = useState('all');

  // Clinic Services Search & Filter
  const [clinicType, setClinicType] = useState('All');
  const [clinicSearch, setClinicSearch] = useState('');
  const [servicesList, setServicesList] = useState(DEFAULT_VERIFIED_CLINICS);

  // Fetch verified services from backend if available
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/medical/services');
        if (res.data.success && res.data.data.length > 0) {
          setServicesList(res.data.data);
        }
      } catch (err) {
        // Fallback to static verified list
        setServicesList(DEFAULT_VERIFIED_CLINICS);
      }
    };
    fetchServices();
  }, []);

  // Filtered clinics
  const filteredClinics = servicesList.filter((clinic) => {
    const matchesType =
      clinicType === 'All' ||
      clinic.type.toLowerCase().includes(clinicType.toLowerCase()) ||
      clinic.category.toLowerCase().includes(clinicType.toLowerCase());

    const matchesSearch =
      !clinicSearch.trim() ||
      clinic.name.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      clinic.address.toLowerCase().includes(clinicSearch.toLowerCase()) ||
      clinic.services_offered.some((s) => s.toLowerCase().includes(clinicSearch.toLowerCase()));

    return matchesType && matchesSearch;
  });

  return (
    <div style={{ backgroundColor: '#faf7f2', minHeight: '100vh', padding: '36px 20px 80px 20px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        
        {/* Navigation Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Link to="/dashboard" style={{ color: '#15803d', textDecoration: 'none', fontWeight: 600 }}>
              Dashboard
            </Link>
            <span style={{ color: '#94a3b8' }}>/</span>
            <span style={{ color: '#64748b', fontWeight: 600 }}>Veterinary & Emergency Care</span>
          </div>

          {canAccessRecords && (
            <Link
              to="/medical-records"
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
              <FileText size={18} />
              <span>{isVet ? 'Veterinary Clinical Workstation' : 'View Medical Records'}</span>
              <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {/* Hero Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
            borderRadius: '24px',
            padding: '38px 40px',
            color: '#ffffff',
            marginBottom: '32px',
            boxShadow: '0 12px 28px rgba(20, 83, 45, 0.16)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '820px', position: 'relative', zIndex: 2 }}>
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
                marginBottom: '14px',
              }}
            >
              🐾 Animal Care Guidelines & Emergency Veterinary Services
            </div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 10px 0', lineHeight: 1.2 }}>
              Animal Healthcare Guidelines & Verified Veterinary Clinics
            </h1>
            <p style={{ color: '#dcfce7', fontSize: '16px', margin: '0 0 20px 0', lineHeight: 1.6 }}>
              Reliable guidance on caring for Indian street dogs, desi cows, and community cats. Discover nutrition, hygiene, signs of illness, first-aid, and verified veterinary hospitals across Bengaluru.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveTab('services')}
                className="btn btn-light"
                style={{
                  color: '#14532d',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                }}
              >
                <Phone size={16} color="#dc2626" /> View Verified Veterinary Clinics
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guidelines')}
                className="btn btn-outline-light"
                style={{
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                }}
              >
                🐾 Read Animal Care Guidelines
              </button>
              {canAccessRecords && (
                <Link
                  to="/medical-records"
                  className="btn btn-outline-light"
                  style={{
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '9px 18px',
                  }}
                >
                  <Activity size={16} /> Clinical Records Portal
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '32px',
            borderBottom: '2px solid #e2e8f0',
            paddingBottom: '12px',
            overflowX: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('guidelines')}
            className={`btn btn-sm ${activeTab === 'guidelines' ? 'btn-success' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'guidelines' ? '#15803d' : 'transparent',
              borderColor: activeTab === 'guidelines' ? '#15803d' : '#cbd5e1',
            }}
          >
            🐾 Animal Care Guidelines
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`btn btn-sm ${activeTab === 'services' ? 'btn-success' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'services' ? '#15803d' : 'transparent',
              borderColor: activeTab === 'services' ? '#15803d' : '#cbd5e1',
            }}
          >
            🏥 Veterinary Clinics & Hospitals
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('emergency')}
            className={`btn btn-sm ${activeTab === 'emergency' ? 'btn-success' : 'btn-outline-secondary'}`}
            style={{
              borderRadius: '12px',
              padding: '10px 20px',
              fontWeight: 700,
              fontSize: '14px',
              whiteSpace: 'nowrap',
              backgroundColor: activeTab === 'emergency' ? '#15803d' : 'transparent',
              borderColor: activeTab === 'emergency' ? '#15803d' : '#cbd5e1',
            }}
          >
            🚑 Basic Emergency Care & Triage
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: ANIMAL CARE GUIDELINES (Dogs, Cats, Cows, Nutrition, Illness, Hygiene) */}
        {/* ========================================================================= */}
        {activeTab === 'guidelines' && (
          <div>
            {/* Quick Filter Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setAnimalFilter('all')}
                className={`btn btn-sm ${animalFilter === 'all' ? 'btn-success' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
              >
                All Care Guidelines
              </button>
              <button
                type="button"
                onClick={() => setAnimalFilter('dog')}
                className={`btn btn-sm ${animalFilter === 'dog' ? 'btn-success' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
              >
                🐶 Basic Dog Care
              </button>
              <button
                type="button"
                onClick={() => setAnimalFilter('cat')}
                className={`btn btn-sm ${animalFilter === 'cat' ? 'btn-success' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
              >
                🐱 Basic Cat Care
              </button>
              <button
                type="button"
                onClick={() => setAnimalFilter('cow')}
                className={`btn btn-sm ${animalFilter === 'cow' ? 'btn-success' : 'btn-outline-secondary'}`}
                style={{ borderRadius: '10px', fontWeight: 700, fontSize: '13px' }}
              >
                🐮 Basic Cow Care
              </button>
            </div>

            {/* 3 CORE SPECIES CARDS WITH SUITABLE ANIMAL PHOTOGRAPHS */}
            <div className="row g-4 mb-4">
              {/* 1. Basic Dog Care */}
              {(animalFilter === 'all' || animalFilter === 'dog') && (
                <div className="col-lg-4 col-md-6">
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #bbf7d0',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <img
                      src="/assets/images/bella_dog.jpg"
                      alt="Basic Dog Care"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/assets/images/res_dog.jpg';
                      }}
                    />
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#15803d', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🐶 Canine Welfare
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', marginBottom: '12px' }}>
                        Basic Dog Care
                      </h3>
                      <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                        <li><strong>Daily Food:</strong> Wholesome cooked meals (boiled rice, lentils, boiled eggs, or pet kibble). Clean drinking water available 24/7.</li>
                        <li><strong>Vaccinations:</strong> Annual Anti-Rabies Vaccination (ARV) and 7-in-1 (DHLPP) booster shots.</li>
                        <li><strong>Parasite Control:</strong> Deworm every 3 months; inspect coat for ticks and fleas after outdoor walks.</li>
                        <li><strong>Safe Shelter:</strong> Shaded, well-ventilated dry resting spot shielded from rain and peak afternoon heat.</li>
                      </ul>
                      <div style={{ backgroundColor: '#f0fdf4', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#166534', fontWeight: 600 }}>
                        💡 <em>Tip: Street indies thrive on routine daily feeding times.</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Basic Cat Care */}
              {(animalFilter === 'all' || animalFilter === 'cat') && (
                <div className="col-lg-4 col-md-6">
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #bae6fd',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <img
                      src="/assets/images/pet_mimi.jpg"
                      alt="Basic Cat Care"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/assets/images/vet_mimi.jpg';
                      }}
                    />
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0369a1', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🐱 Feline Welfare
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0369a1', marginBottom: '12px' }}>
                        Basic Cat Care
                      </h3>
                      <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                        <li><strong>Nutrition:</strong> Cats are obligate carnivores requiring animal protein and taurine. Never feed vegetarian-only diets.</li>
                        <li><strong>Hydration:</strong> Cats often drink little water from still bowls; place fresh wide bowls away from food and litter.</li>
                        <li><strong>Litter & Hygiene:</strong> Clean the litter box daily. Cats groom naturally, but brush long coats to prevent hairballs.</li>
                        <li><strong>Vaccines & Spaying:</strong> Annual Tricat (FVRCP) and Rabies vaccines. Spaying prevents stray kitten distress.</li>
                      </ul>
                      <div style={{ backgroundColor: '#e0f2fe', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#0369a1', fontWeight: 600 }}>
                        💡 <em>Tip: Cats hide pain; monitor quiet changes in litter box usage.</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Basic Cow Care */}
              {(animalFilter === 'all' || animalFilter === 'cow') && (
                <div className="col-lg-4 col-md-6">
                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '24px',
                      overflow: 'hidden',
                      border: '1px solid #fef3c7',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <img
                      src="/assets/images/pet_lakshmi.jpg"
                      alt="Basic Cow Care"
                      style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.src = '/assets/images/res_cow.jpg';
                      }}
                    />
                    <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        🐮 Bovine Welfare
                      </div>
                      <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#92400e', marginBottom: '12px' }}>
                        Basic Cow Care
                      </h3>
                      <ul style={{ paddingLeft: '18px', color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: '0 0 16px 0', flex: 1 }}>
                        <li><strong>Fodder & Roughage:</strong> Fresh green fodder (berseem, chari), clean dry straw, and mineral mixture salts.</li>
                        <li><strong>Clean Hydration:</strong> An adult cow needs 40–60 litres of clean, potable water every single day.</li>
                        <li><strong>Plastic Ingestion Warning:</strong> Never dispose of kitchen food inside polythene bags; cattle consume plastic leading to fatal rumen impaction.</li>
                        <li><strong>Sanctuary Hygiene:</strong> Dry, non-slippery floor bedding to prevent painful hoof rot and joint infections.</li>
                      </ul>
                      <div style={{ backgroundColor: '#fef3c7', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#92400e', fontWeight: 600 }}>
                        💡 <em>Tip: Report stranded highway cows to nearby verified gaushalas.</em>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* GUIDELINE CARDS: NUTRITION, HYGIENE, ILLNESS SIGNS, EMERGENCY FIRST-AID */}
            <div className="row g-4">
              {/* Card 1: Food & Nutrition Guidance */}
              <div className="col-lg-6">
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px' }}>🥗</span>
                    <div>
                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#15803d', margin: 0 }}>
                        Food and Nutrition Guidance
                      </h4>
                      <small style={{ color: '#64748b' }}>Safe, nourishing diets vs toxic foods to avoid</small>
                    </div>
                  </div>

                  <div className="row g-3" style={{ fontSize: '13.5px' }}>
                    <div className="col-sm-6">
                      <div style={{ backgroundColor: '#f0fdf4', padding: '14px', borderRadius: '14px', border: '1px solid #dcfce7', height: '100%' }}>
                        <div style={{ fontWeight: 700, color: '#166534', marginBottom: '6px' }}>
                          ✅ Wholesome & Safe Foods
                        </div>
                        <ul style={{ paddingLeft: '16px', margin: 0, color: '#166534', lineHeight: 1.6 }}>
                          <li>Cooked plain rice with lentils / curd</li>
                          <li>Boiled eggs, unseasoned boiled chicken</li>
                          <li>Boiled pumpkin, carrots, sweet potatoes</li>
                          <li>Fresh grass, jowar, and bran for cows</li>
                          <li>Commercial pet food meeting AAFCO standards</li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-sm-6">
                      <div style={{ backgroundColor: '#fef2f2', padding: '14px', borderRadius: '14px', border: '1px solid #fee2e2', height: '100%' }}>
                        <div style={{ fontWeight: 700, color: '#991b1b', marginBottom: '6px' }}>
                          ❌ Strictly Toxic Foods (Avoid)
                        </div>
                        <ul style={{ paddingLeft: '16px', margin: 0, color: '#991b1b', lineHeight: 1.6 }}>
                          <li>Chocolate, caffeine, and sweets</li>
                          <li>Onions, garlic, chives & spicy gravies</li>
                          <li>Cooked poultry bones (splintering risk)</li>
                          <li>Grapes, raisins, and artificial sweeteners</li>
                          <li>Plastic wrappers & spoiled kitchen garbage</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Hygiene and Cleanliness */}
              <div className="col-lg-6">
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px' }}>🧼</span>
                    <div>
                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                        Hygiene and Cleanliness
                      </h4>
                      <small style={{ color: '#64748b' }}>Infection prevention, grooming and bedding care</small>
                    </div>
                  </div>

                  <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                    <li><strong>Regular Bedding Sanitation:</strong> Wash animal blankets and sleeping mats weekly with pet-safe disinfectant to prevent fungal spore buildup.</li>
                    <li><strong>Tick & Flea Prevention:</strong> Apply veterinarian-approved spot-on drops or flea combs, especially after monsoon walks.</li>
                    <li><strong>Ear & Paw Inspections:</strong> Regularly wipe paws after rain to avoid interdigital dermatitis and check floppy ears for foul odors or wax.</li>
                    <li><strong>Drinking Bowl Cleanliness:</strong> Scrub mud/steel water bowls daily to avoid algae and mosquito breeding.</li>
                  </ul>
                </div>
              </div>

              {/* Card 3: Common Signs of Illness */}
              <div className="col-lg-6">
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid #fed7aa',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px' }}>🩺</span>
                    <div>
                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                        Common Signs of Illness
                      </h4>
                      <small style={{ color: '#64748b' }}>Early clinical signs that require medical attention</small>
                    </div>
                  </div>

                  <div className="row g-2" style={{ fontSize: '13.5px' }}>
                    <div className="col-12">
                      <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', borderRadius: '8px', borderLeft: '4px solid #ea580c' }}>
                        <strong>Loss of Appetite & Lethargy:</strong> Refusal to eat or drink for more than 24 hours accompanied by sluggishness.
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', borderRadius: '8px', borderLeft: '4px solid #ea580c' }}>
                        <strong>Gastrointestinal Distress:</strong> Repeated vomiting, foul diarrhea, or traces of blood in stool.
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', borderRadius: '8px', borderLeft: '4px solid #ea580c' }}>
                        <strong>Respiratory Difficulties:</strong> Heavy wheezing, coughing, gasping with open mouth, or pale/blue gums.
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{ padding: '8px 12px', backgroundColor: '#fff7ed', borderRadius: '8px', borderLeft: '4px solid #ea580c' }}>
                        <strong>Abnormal Gait & Whining:</strong> Inability to put weight on paws, continuous crying upon touch, or curved spine.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Basic Emergency Care Instructions */}
              <div className="col-lg-6">
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '28px',
                    border: '1px solid #fecaca',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '28px' }}>🚑</span>
                    <div>
                      <h4 style={{ fontSize: '19px', fontWeight: 800, color: '#991b1b', margin: 0 }}>
                        Basic Emergency Care Instructions
                      </h4>
                      <small style={{ color: '#64748b' }}>Life-saving actions before reaching a veterinary clinic</small>
                    </div>
                  </div>

                  <ul style={{ paddingLeft: '20px', color: '#475569', fontSize: '13.5px', lineHeight: 1.6, margin: 0 }}>
                    <li><strong>Severe Bleeding:</strong> Apply firm, uninterrupted pressure with clean cotton gauze or towel for 5–10 minutes. Do not remove cloth if soaked; add another layer on top.</li>
                    <li><strong>Heat Exhaustion / Stroke:</strong> Move to shade. Dab room-temperature water on paws, ears, and abdomen. Never use ice or submerge.</li>
                    <li><strong>Suspected Fracture:</strong> Gently slide animal onto a rigid board or taut blanket stretcher. Avoid twisting the spine or legs during vehicular transit.</li>
                    <li><strong>Suspected Poisoning:</strong> Keep animal warm and calm. Do not force salt water. Bring sample/packaging of the substance directly to the clinic.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VETERINARY SERVICES (Clinics, Hospitals, Emergency & Vaccinations) */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div>
            {/* Filter and Search Bar */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '20px 24px',
                border: '1px solid #e2e8f0',
                marginBottom: '28px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              }}
            >
              <div className="row g-3 align-items-center">
                {/* Search */}
                <div className="col-md-5">
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search clinic name, location, or service..."
                      value={clinicSearch}
                      onChange={(e) => setClinicSearch(e.target.value)}
                      style={{ borderRadius: '12px', paddingLeft: '38px', fontSize: '14px', height: '42px' }}
                    />
                    <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  </div>
                </div>

                {/* Filter Pills */}
                <div className="col-md-7 d-flex gap-2 flex-wrap justify-content-md-end">
                  {['All', 'Animal Hospital', 'Veterinary Clinic', 'Emergency Veterinary Service', 'Animal Treatment & Vaccination'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setClinicType(type)}
                      className={`btn btn-sm ${clinicType === type ? 'btn-success' : 'btn-outline-secondary'}`}
                      style={{
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '6px 14px',
                        backgroundColor: clinicType === type ? '#15803d' : 'transparent',
                        borderColor: clinicType === type ? '#15803d' : '#cbd5e1',
                      }}
                    >
                      {type === 'All' ? 'All Services' : type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* List of Verified Veterinary Clinics & Animal Hospitals */}
            <div className="row g-4">
              {filteredClinics.length === 0 ? (
                <div className="col-12">
                  <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
                    <Stethoscope size={40} color="#94a3b8" className="mb-2" />
                    <h4>No Veterinary Services Match Your Filter</h4>
                    <p style={{ fontSize: '14px' }}>Try clearing your search query or selecting All Services.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setClinicType('All');
                        setClinicSearch('');
                      }}
                      className="btn btn-outline-secondary btn-sm"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              ) : (
                filteredClinics.map((clinic) => (
                  <div className="col-lg-6" key={clinic.id}>
                    <div
                      style={{
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        padding: '28px',
                        border: '1px solid #dcfce7',
                        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        {/* Header Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          <span
                            className="badge px-2 py-1 rounded-pill"
                            style={{
                              backgroundColor: clinic.type.includes('Hospital') ? '#dcfce7' : '#e0f2fe',
                              color: clinic.type.includes('Hospital') ? '#15803d' : '#0369a1',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {clinic.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> Verified Facility
                          </span>
                        </div>

                        {/* Clinic Name */}
                        <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14532d', margin: '0 0 12px 0' }}>
                          {clinic.name}
                        </h3>

                        {/* Address */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569', fontSize: '13px', marginBottom: '10px' }}>
                          <MapPin size={16} color="#15803d" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{clinic.address}</span>
                        </div>

                        {/* Operating Hours */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', marginBottom: '16px' }}>
                          <Clock size={16} color="#0284c7" style={{ flexShrink: 0 }} />
                          <span><strong>Hours:</strong> {clinic.hours}</span>
                        </div>

                        {/* Services Offered Pills */}
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ fontSize: '12px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Services Offered:
                          </div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {clinic.services_offered.map((srv, idx) => (
                              <span
                                key={idx}
                                style={{
                                  backgroundColor: '#f8fafc',
                                  border: '1px solid #e2e8f0',
                                  color: '#334155',
                                  fontSize: '12px',
                                  padding: '4px 10px',
                                  borderRadius: '8px',
                                  fontWeight: 600,
                                }}
                              >
                                • {srv}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Contact Actions Footer */}
                      <div
                        style={{
                          borderTop: '1px solid #f1f5f9',
                          paddingTop: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '12px',
                        }}
                      >
                        <div style={{ fontSize: '13px' }}>
                          <div style={{ color: '#64748b' }}>Primary Contact:</div>
                          <a href={`tel:${clinic.phone}`} style={{ color: '#15803d', fontWeight: 800, textDecoration: 'none', fontSize: '15px' }}>
                            📞 {clinic.phone}
                          </a>
                        </div>

                        {clinic.emergency_phone && (
                          <div style={{ textAlign: 'right', fontSize: '13px' }}>
                            <div style={{ color: '#dc2626', fontWeight: 600 }}>24/7 Emergency Line:</div>
                            <a href={`tel:${clinic.emergency_phone}`} style={{ color: '#dc2626', fontWeight: 800, textDecoration: 'none', fontSize: '15px' }}>
                              🚨 {clinic.emergency_phone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BASIC EMERGENCY CARE & TRIAGE CHECKLIST */}
        {/* ========================================================================= */}
        {activeTab === 'emergency' && (
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #fed7aa',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
                <span style={{ fontSize: '28px' }}>🚨</span>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#9a3412', margin: 0 }}>
                  Red Flag Emergency Symptoms – Contact Vet Immediately
                </h3>
              </div>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: 1.6, marginBottom: '20px' }}>
                If a rescued animal demonstrates any of the following critical indicators, immediate clinical intervention is imperative:
              </p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #ea580c' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '4px' }}>Unconsciousness or Seizures:</strong>
                    <span style={{ color: '#475569', fontSize: '13px' }}>Inability to wake up, continuous muscle spasms, tremors, or disorientation.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #ea580c' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '4px' }}>Severe Respiratory Distress:</strong>
                    <span style={{ color: '#475569', fontSize: '13px' }}>Choking, gasping for breath, blue or pale purple gums and tongue.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #ea580c' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '4px' }}>Persistent Bleeding:</strong>
                    <span style={{ color: '#475569', fontSize: '13px' }}>Uncontrolled hemorrhage from body, nose, mouth, or rectum lasting over 5 minutes.</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div style={{ backgroundColor: '#fff7ed', borderRadius: '12px', padding: '16px', borderLeft: '4px solid #ea580c' }}>
                    <strong style={{ color: '#9a3412', display: 'block', marginBottom: '4px' }}>Inability to Urinate:</strong>
                    <span style={{ color: '#475569', fontSize: '13px' }}>Straining without passing urine, particularly common in male cats and fatal within 24 hours.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-emergency vs Emergency triage table */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '32px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '18px' }}>
                Triage Assessment: Emergency vs Scheduled Consultation
              </h4>
              <div className="table-responsive">
                <table className="table table-bordered mb-0" style={{ fontSize: '14px' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ color: '#dc2626', fontWeight: 700 }}>Immediate Emergency (Rush to Clinic)</th>
                      <th style={{ color: '#d97706', fontWeight: 700 }}>Urgent (Within 12–24 Hours)</th>
                      <th style={{ color: '#15803d', fontWeight: 700 }}>Routine / Scheduled Consultation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Vehicular road accidents with bone exposure</td>
                      <td>Persistent diarrhea without blood</td>
                      <td>Annual vaccination booster shots</td>
                    </tr>
                    <tr>
                      <td>Bloated tight abdomen with retching (GDV)</td>
                      <td>Moderate limping without open bone break</td>
                      <td>Routine deworming & weight monitoring</td>
                    </tr>
                    <tr>
                      <td>Deep puncture bites from suspected rabid animal</td>
                      <td>Mild eye discharge or ear head-shaking</td>
                      <td>Pre-adoption health assessment check</td>
                    </tr>
                    <tr>
                      <td>Heatstroke with collapse and pale gums</td>
                      <td>Localized patchy hair loss or mild scratching</td>
                      <td>Spaying / neutering elective consultation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 24/7 EMERGENCY CONTACTS FOOTER BANNER */}
        <div
          style={{
            marginTop: '40px',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            border: '2px solid #bbf7d0',
            boxShadow: '0 6px 20px rgba(22, 101, 52, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', marginBottom: '6px' }}>
              <Phone size={16} /> Pet Rescue Welfare Emergency Desk
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#14532d', margin: '0 0 6px 0' }}>
              Need Urgent Animal Medical Help?
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
              Connect with our round-the-clock shelter ambulance and licensed veterinary staff across Bengaluru.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ backgroundColor: '#f0fdf4', padding: '12px 20px', borderRadius: '14px', border: '1px solid #dcfce7' }}>
              <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>24/7 RESCUE HELPLINE</div>
              <a href="tel:+919876543210" style={{ fontSize: '18px', fontWeight: 800, color: '#15803d', textDecoration: 'none' }}>
                +91 98765 43210
              </a>
            </div>
            <div style={{ backgroundColor: '#eff6ff', padding: '12px 20px', borderRadius: '14px', border: '1px solid #dbeafe' }}>
              <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600 }}>CLINICAL SANCTUARY OPD</div>
              <a href="tel:+919876543211" style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', textDecoration: 'none' }}>
                +91 98765 43211
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VeterinaryCare;
