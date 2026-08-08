import React from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './contexts/AppContext';
import { AppShell } from './components/AppShell';
import type { Role } from './types';
import { LandingPage } from './pages/LandingPage';
import { PhcDashboard } from './pages/phc/PhcDashboard';
import { RegisterPatient } from './pages/phc/RegisterPatient';
import { SearchPatient } from './pages/phc/SearchPatient';
import { CreateReferral } from './pages/phc/CreateReferral';
import { ReferralLog } from './pages/phc/ReferralLog';
import { HealthVault } from './pages/phc/HealthVault';
import { SpecialistDashboard } from './pages/specialist/SpecialistDashboard';
import { ScanQR } from './pages/specialist/ScanQR';
import { ReferralQueue } from './pages/specialist/ReferralQueue';
import { SpecialistReferral } from './pages/specialist/SpecialistReferral';
import { ProfileSettings } from './pages/ProfileSettings';
import { HandoffReport } from './pages/HandoffReport';

function Protected({ role, children }: { role: Role; children: React.ReactNode }) {
  const { user } = useApp();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (user.role !== role) return <Navigate to={user.role === 'phc' ? '/phc' : '/specialist'} replace />;
  return <AppShell>{children}</AppShell>;
}

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors closeButton />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LandingPage />} />

          <Route path="/phc" element={<Protected role="phc"><PhcDashboard /></Protected>} />
          <Route path="/phc/search" element={<Protected role="phc"><SearchPatient /></Protected>} />
          <Route path="/phc/register" element={<Protected role="phc"><RegisterPatient /></Protected>} />
          <Route path="/phc/referral/new" element={<Protected role="phc"><CreateReferral /></Protected>} />
          <Route path="/phc/referrals" element={<Protected role="phc"><ReferralLog /></Protected>} />
          <Route path="/phc/vault/:patientId" element={<Protected role="phc"><HealthVault /></Protected>} />
          <Route path="/phc/settings" element={<Protected role="phc"><ProfileSettings /></Protected>} />

          <Route path="/specialist" element={<Protected role="specialist"><SpecialistDashboard /></Protected>} />
          <Route path="/specialist/scan" element={<Protected role="specialist"><ScanQR /></Protected>} />
          <Route path="/specialist/queue" element={<Protected role="specialist"><ReferralQueue /></Protected>} />
          <Route
            path="/specialist/referral/:token"
            element={<Protected role="specialist"><SpecialistReferral /></Protected>}
          />
          <Route path="/specialist/settings" element={<Protected role="specialist"><ProfileSettings /></Protected>} />

          <Route path="/report/:token" element={<HandoffReport />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}