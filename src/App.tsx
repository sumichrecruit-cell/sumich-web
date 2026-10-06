/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { AboutPage } from './components/about/AboutPage';
import { ServicesPage } from './components/services/ServicesPage';
import { CareersPage } from './components/careers/CareersPage';
import { ClientDashboard } from './components/dashboards/ClientDashboard';
import { JobSeekerDashboard } from './components/dashboards/JobSeekerDashboard';
import { GuardDashboard } from './components/dashboards/GuardDashboard';
import { AdminPortal } from './components/admin/AdminPortal';
import { QuoteModal } from './components/modals/QuoteModal';
import { AppointmentModal } from './components/modals/AppointmentModal';
import { CallModal } from './components/modals/CallModal';
import { AuthModal } from './components/modals/AuthModal';
import { JobApplicationModal } from './components/modals/JobApplicationModal';
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'careers':
        return <CareersPage />;
      case 'client-dashboard':
        return <ClientDashboard />;
      case 'seeker-dashboard':
        return <JobSeekerDashboard />;
      case 'guard-dashboard':
        return <GuardDashboard />;
      case 'admin-portal':
        return <AdminPortal />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-amber-400 selection:text-slate-950">
      <Navbar />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />

      {/* Global Interactive Modals */}
      <QuoteModal />
      <AppointmentModal />
      <CallModal />
      <AuthModal />
      <JobApplicationModal />
      <DocumentViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
