import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NoticeModal from './components/NoticeModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdoptionLanding from './pages/AdoptionLanding';
import AdoptionGallery from './pages/AdoptionGallery';
import AnimalDetails from './pages/AnimalDetails';
import AdoptionApplications from './pages/AdoptionApplications';
import ReportAnimal from './pages/ReportAnimal';
import RescueReports from './pages/RescueReports';
import AnimalManagement from './pages/AnimalManagement';
import VeterinaryCare from './pages/VeterinaryCare';
import MedicalRecords from './pages/MedicalRecords';
import AnimalSearch from './pages/AnimalSearch';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const [footerModal, setFooterModal] = useState({
    isOpen: false,
    title: '',
    description: '',
  });

  const handleOpenFooterModal = (title, description) => {
    setFooterModal({
      isOpen: true,
      title,
      description,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Show Public Navbar only on Non-Dashboard pages */}
      {!isDashboard && <Navbar />}

      {/* Main Routes */}
      <main style={{ flex: '1 0 auto' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Adoption Module Routes */}
          <Route path="/adoption" element={<AdoptionLanding />} />
          <Route path="/adoption/:category" element={<AdoptionGallery />} />
          <Route path="/adoption/animal/:id" element={<AnimalDetails />} />
          <Route path="/adoption-applications" element={<AdoptionApplications />} />

          {/* Rescue Reporting Module Routes */}
          <Route path="/report-animal" element={<ReportAnimal />} />
          <Route path="/rescue-reports" element={<RescueReports />} />
          <Route path="/my-rescue-reports" element={<RescueReports />} />

          {/* Animal Search & Filtering Module Routes */}
          <Route path="/search" element={<AnimalSearch />} />
          <Route path="/search-animals" element={<AnimalSearch />} />

          {/* Animal Management Module Routes */}
          <Route path="/animals" element={<AnimalManagement />} />
          <Route path="/admin/animals" element={<AnimalManagement />} />

          {/* Veterinary & Medical Records Module Routes (FR-07, FR-10) */}
          <Route path="/veterinary-care" element={<VeterinaryCare />} />
          <Route path="/veterinary" element={<VeterinaryCare />} />
          <Route path="/medical-records" element={<MedicalRecords />} />
          <Route path="/medical" element={<MedicalRecords />} />

          {/* Flagship PetRescue Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:roleType" element={<Dashboard />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Show Public Footer only on Non-Dashboard pages */}
      {!isDashboard && <Footer onOpenModal={handleOpenFooterModal} />}

      {/* Global Footer Notice Modal */}
      {!isDashboard && (
        <NoticeModal
          isOpen={footerModal.isOpen}
          onClose={() => setFooterModal({ isOpen: false, title: '', description: '' })}
          title={footerModal.title}
          moduleName={footerModal.title}
          description={footerModal.description}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
