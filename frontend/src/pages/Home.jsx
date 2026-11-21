import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PawPrint,
  Heart,
  Shield,
  Stethoscope,
  BookOpen,
  ArrowRight,
  MapPin,
  Calendar,
  AlertTriangle,
  Award,
  Users,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Phone,
} from 'lucide-react';
import PetModal from '../components/PetModal';
import NoticeModal from '../components/NoticeModal';

// Demonstration pets dataset
const INITIAL_PETS = [
  {
    id: 1,
    name: 'Bella',
    type: 'dog',
    breed: 'Golden Retriever Mix',
    age: '1.5 Years',
    location: 'Central Rescue Sanctuary',
    gender: 'Female',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    description: 'Bella was rescued from a rainy highway intersection. She is affectionate, gentle with children, and loves playing fetch in the park.',
    traits: ['Friendly', 'House Trained', 'Vaccinated', 'Leash Trained'],
  },
  {
    id: 2,
    name: 'Oliver',
    type: 'cat',
    breed: 'Ginger Tabby',
    age: '8 Months',
    location: 'Westside Foster Home',
    gender: 'Male',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    description: 'Oliver is a purr machine who adores afternoon naps by sunny windows. Rescued as a newborn kitten, now healthy, playful, and vaccinated.',
    traits: ['Playful', 'Litter Box Trained', 'Affectionate', 'Neutered'],
  },
  {
    id: 3,
    name: 'Max',
    type: 'dog',
    breed: 'German Shepherd & Husky Mix',
    age: '2 Years',
    location: 'Greenwood Animal Shelter',
    gender: 'Male',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    description: 'Max is intelligent, energetic, and extremely loyal. Rescued from an abandoned construction site, he is now thriving and ready for active pet parents.',
    traits: ['Active', 'Intelligent', 'Guard Dog Instinct', 'Fully Vaccinated'],
  },
  {
    id: 4,
    name: 'Luna',
    type: 'cat',
    breed: 'Calico Domestic Shorthair',
    age: '1 Year',
    location: 'Haven Pet Nursery',
    gender: 'Female',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
    description: 'Luna has mesmerizing eyes and a sweet, calming personality. Rescued with her litter, she loves cuddles and gentle lap time.',
    traits: ['Calm', 'Child Friendly', 'Spayed', 'Microchipped'],
  },
  {
    id: 5,
    name: 'Milo',
    type: 'dog',
    breed: 'Beagle & Hound Blend',
    age: '2.5 Years',
    location: 'Sunny Meadows Shelter',
    gender: 'Male',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    description: 'Milo is a curious explorer with floppy ears and a heart of gold. Rescued during our monsoon emergency drive.',
    traits: ['Gentle', 'Food Motivated', 'Social with Dogs', 'Vaccinated'],
  },
  {
    id: 6,
    name: 'Cleo',
    type: 'cat',
    breed: 'Turkish Angora / Persian Mix',
    age: '3 Years',
    location: 'North Hill Foster Center',
    gender: 'Female',
    status: 'Ready for Adoption',
    image: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80',
    description: 'Cleo is a queen of comfort. Fluffy, elegant, and peaceful. Perfect companion for an apartment or quiet home environment.',
    traits: ['Quiet', 'Indoor Only', 'Loves Brushing', 'Health Screened'],
  },
];

const Home = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [petModalOpen, setPetModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [noticeModal, setNoticeModal] = useState({
    isOpen: false,
    title: '',
    moduleName: '',
    description: '',
  });

  const handleOpenPet = (pet) => {
    setSelectedPet(pet);
    setPetModalOpen(true);
  };

  const handleReportAnimalClick = () => {
    setNoticeModal({
      isOpen: true,
      title: 'Report an Animal in Distress',
      moduleName: 'Emergency Animal Rescue Reporting',
      description:
        'If you spot an injured, trapped, or sick animal in immediate danger, our 24/7 Emergency Dispatch Helpline is active at 1-800-PET-RESCUE. The automated digital GPS report module with live photo upload will be available in Phase 2.',
    });
  };

  const filteredPets =
    activeCategory === 'all'
      ? INITIAL_PETS
      : INITIAL_PETS.filter((p) => p.type === activeCategory);

  return (
    <div className="paw-pattern-bg" style={{ minHeight: '100vh', paddingBottom: '60px' }}>
      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          position: 'relative',
          padding: '60px 0 80px',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #FAF7F2 0%, #F5EFE6 100%)',
          borderBottom: '1px solid #e7e3db',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Hero Left Content */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  marginBottom: '20px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Sparkles size={16} /> Compassion in Action • Animal Welfare Platform
              </div>

              <h1
                style={{
                  fontSize: 'clamp(36px, 5vw, 56px)',
                  fontWeight: 800,
                  color: '#143521',
                  lineHeight: 1.15,
                  letterSpacing: '-1px',
                  marginBottom: '20px',
                }}
              >
                Every Life Deserves <br />
                <span
                  style={{
                    background: 'linear-gradient(135deg, #15803d 0%, #ea580c 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Love and Care
                </span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(16px, 2vw, 19px)',
                  color: '#475569',
                  lineHeight: 1.6,
                  maxWidth: '540px',
                  marginBottom: '32px',
                }}
              >
                Rescue, protect and give abandoned animals a second chance at life.
                Together, we heal injured strays, champion humane pet adoption, and foster a world of empathy.
              </p>

              {/* Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '16px',
                  marginBottom: '36px',
                }}
              >
                <button
                  onClick={handleReportAnimalClick}
                  className="btn btn-secondary"
                  style={{
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  <AlertTriangle size={18} /> Report an Animal
                </button>

                <a
                  href="#pets-section"
                  className="btn btn-primary"
                  style={{
                    padding: '14px 28px',
                    fontSize: '16px',
                    fontWeight: 700,
                  }}
                >
                  <Heart size={18} fill="#ffffff" /> Adopt a Pet
                </a>
              </div>

              {/* Quick Trust Highlights */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '24px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2ddd4',
                  fontSize: '14px',
                  color: '#64748b',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={17} color="#15803d" />
                  <span>24/7 Rapid Ambulance</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={17} color="#15803d" />
                  <span>100% Verified Adoptions</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={17} color="#15803d" />
                  <span>Free Veterinary Care</span>
                </div>
              </div>
            </div>

            {/* Hero Right Media */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-xl)',
                  border: '6px solid #ffffff',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                  alt="Rescued happy dogs and cats"
                  style={{
                    width: '100%',
                    height: '460px',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(to top, rgba(20, 53, 33, 0.45) 0%, transparent 60%)',
                  }}
                />
              </div>

              {/* Floating Stat Card 1 */}
              <div
                className="glass-card animate-float"
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-16px',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  borderRadius: '18px',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: '#fff7ed',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ea580c',
                  }}
                >
                  <Heart size={22} fill="#ea580c" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#143521' }}>
                    3,420+
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Happy Pets Rehomed
                  </div>
                </div>
              </div>

              {/* Floating Stat Card 2 */}
              <div
                className="glass-card"
                style={{
                  position: 'absolute',
                  bottom: '-24px',
                  left: '-16px',
                  padding: '16px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  borderRadius: '18px',
                }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#15803d',
                  }}
                >
                  <Shield size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#143521' }}>
                    4,850+ Rescues
                  </div>
                  <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                    Emergency Medical Response
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section id="about-section" style={{ padding: '80px 0 60px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 52px' }}>
            <span
              style={{
                backgroundColor: '#ecfdf5',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              About Our Platform
            </span>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#143521',
                marginBottom: '16px',
              }}
            >
              Transforming Lives Through Compassion & Action
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.7 }}>
              The Pet Rescue and Animal Welfare Platform is a comprehensive digital bridge connecting
              volunteers, veterinarians, loving adopters, and compassionate citizens. Our mission is to ensure
              that no abandoned or injured animal is left behind.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Feature 1: Animal Rescue */}
            <div
              className="glass-card"
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#dc2626',
                  marginBottom: '20px',
                }}
              >
                <Shield size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#143521' }}>
                1. Animal Rescue
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, flexGrow: 1 }}>
                Rapid response ambulance dispatches for critical street emergencies, trapped strays, and cruelty rescue operations with specialized trauma transport.
              </p>
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#dc2626',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                24/7 Field Operations
              </div>
            </div>

            {/* Feature 2: Pet Adoption */}
            <div
              className="glass-card"
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#fff7ed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ea580c',
                  marginBottom: '20px',
                }}
              >
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#143521' }}>
                2. Pet Adoption
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, flexGrow: 1 }}>
                Transparent, ethical adoption procedures. We match families with rescued dogs and cats based on lifestyle, home environment, and compatibility.
              </p>
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#ea580c',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Lifelong Foster & Support
              </div>
            </div>

            {/* Feature 3: Veterinary Support */}
            <div
              className="glass-card"
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803d',
                  marginBottom: '20px',
                }}
              >
                <Stethoscope size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#143521' }}>
                3. Veterinary Support
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, flexGrow: 1 }}>
                In-house treatment centers providing free rabies vaccinations, animal birth control surgeries (spay & neuter), physiotherapy, and routine health checks.
              </p>
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Licensed Medical Specialists
              </div>
            </div>

            {/* Feature 4: Animal Education */}
            <div
              className="glass-card"
              style={{
                padding: '32px 24px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#eff6ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#2563eb',
                  marginBottom: '20px',
                }}
              >
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px', color: '#143521' }}>
                4. Animal Education
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, flexGrow: 1 }}>
                Public seminars, school awareness drives, animal cruelty law workshops, and guides on street dog peaceful coexistence and humane rabies control.
              </p>
              <div
                style={{
                  marginTop: '16px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Community Awareness Drives
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATISTICS SECTION ================= */}
      <section
        style={{
          padding: '60px 0',
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Demonstration Platform Metrics
            </span>
            <h3 style={{ fontSize: '30px', fontWeight: 800, color: '#ffffff', marginTop: '10px' }}>
              Our Rescue Impact in Numbers
            </h3>
            <p style={{ color: '#bbf7d0', fontSize: '15px' }}>
              Verified real-world statistics showcasing our life-saving community initiatives
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            {[
              {
                icon: <Shield size={28} />,
                value: '4,850+',
                label: 'Animals Rescued',
                detail: 'Emergency rescues across 18 districts',
              },
              {
                icon: <Heart size={28} />,
                value: '3,420+',
                label: 'Loving Adoptions',
                detail: 'Placed in verified permanent homes',
              },
              {
                icon: <Stethoscope size={28} />,
                value: '1,200+',
                label: 'Free Surgeries & Vaccines',
                detail: 'Vaccinations & spay/neuter treatments',
              },
              {
                icon: <Activity size={28} />,
                value: '98%',
                label: 'Recovery & Rehab Rate',
                detail: 'Highest clinical rehabilitation score',
              },
              {
                icon: <Users size={28} />,
                value: '850+',
                label: 'Dedicated Volunteers',
                detail: 'Active community animal caregivers',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '20px',
                  padding: '24px 18px',
                  backdropFilter: 'blur(8px)',
                  transition: 'transform 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    backgroundColor: 'rgba(255, 255, 255, 0.18)',
                    color: '#ffffff',
                    marginBottom: '12px',
                  }}
                >
                  {stat.icon}
                </div>
                <div
                  style={{
                    fontSize: '34px',
                    fontWeight: 800,
                    fontFamily: 'Outfit, sans-serif',
                    color: '#ffffff',
                    lineHeight: 1.1,
                    marginBottom: '6px',
                  }}
                >
                  {stat.value}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#fef08a', marginBottom: '4px' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '12px', color: '#bbf7d0', opacity: 0.9 }}>
                  {stat.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= AVAILABLE PETS SECTION ================= */}
      <section id="pets-section" style={{ padding: '80px 0 40px' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            <div>
              <span
                style={{
                  backgroundColor: '#ffedd5',
                  color: '#c2410c',
                  border: '1px solid #fed7aa',
                  padding: '4px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  display: 'inline-block',
                  marginBottom: '10px',
                }}
              >
                Find A Companion
              </span>
              <h2 style={{ fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, color: '#143521' }}>
                Waiting for a Forever Home
              </h2>
              <p style={{ fontSize: '15px', color: '#64748b', marginTop: '6px' }}>
                Every single one of these pets was saved from distress and is eager to share their love with you.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1ede4', padding: '6px', borderRadius: '9999px' }}>
              {[
                { id: 'all', label: 'All Pets' },
                { id: 'dog', label: 'Dogs' },
                { id: 'cat', label: 'Cats' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '14px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: activeCategory === tab.id ? '#15803d' : 'transparent',
                    color: activeCategory === tab.id ? '#ffffff' : '#4b5563',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '28px',
            }}
          >
            {filteredPets.map((pet) => (
              <div
                key={pet.id}
                className="glass-card"
                style={{
                  borderRadius: '22px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Pet Image Frame */}
                <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
                  <img
                    src={pet.image}
                    alt={pet.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      left: '14px',
                      backgroundColor: 'rgba(20, 53, 33, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#ffffff',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}
                  >
                    {pet.gender}
                  </div>
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      backgroundColor: '#22c55e',
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    Vetted & Vaccinated
                  </div>
                </div>

                {/* Card Info Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#143521' }}>
                        {pet.name}
                      </h3>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#ea580c' }}>
                        {pet.breed}
                      </p>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#475569',
                      }}
                    >
                      {pet.age}
                    </span>
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: '#64748b',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {pet.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
                    <MapPin size={15} color="#15803d" />
                    <span>{pet.location}</span>
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleOpenPet(pet)}
                      className="btn btn-outline"
                      style={{
                        width: '100%',
                        padding: '11px 0',
                        fontSize: '14px',
                        fontWeight: 700,
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION BANNER ================= */}
      <section style={{ padding: '40px 0 20px' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#FAF7F2',
              border: '2px dashed #bbf7d0',
              borderRadius: '24px',
              padding: '40px 30px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
            }}
          >
            <div style={{ maxWidth: '640px' }}>
              <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#143521', marginBottom: '8px' }}>
                Want to Join as a Rescue Volunteer or Veterinarian?
              </h3>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6 }}>
                Create your account in less than a minute. Choose your role to access role-specific dashboards,
                coordinate rescue missions, post adoption profiles, or donate to animal welfare.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link to="/register" className="btn btn-primary" style={{ padding: '13px 26px' }}>
                Join as Volunteer <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pet Details Modal */}
      <PetModal
        pet={selectedPet}
        isOpen={petModalOpen}
        onClose={() => setPetModalOpen(false)}
      />

      {/* Notice / Roadmap Modal */}
      <NoticeModal
        isOpen={noticeModal.isOpen}
        onClose={() =>
          setNoticeModal({ isOpen: false, title: '', moduleName: '', description: '' })
        }
        title={noticeModal.title}
        moduleName={noticeModal.moduleName}
        description={noticeModal.description}
      />
    </div>
  );
};

export default Home;
