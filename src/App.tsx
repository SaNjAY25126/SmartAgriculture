import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './AppContext';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { FarmerDashboard } from './views/FarmerDashboard';
import { DealerDashboard } from './views/DealerDashboard';
import { AdminDashboard } from './views/AdminDashboard';
import { Sidebar } from './components/Sidebar';
import { UserRole } from './types';
import { AnimatePresence, motion } from 'motion/react';

const AppContent: React.FC = () => {
  const { currentUser } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Reset active tab when role changes
  useEffect(() => {
    if (currentUser?.role === 'farmer') setActiveTab('dashboard');
    if (currentUser?.role === 'dealer') setActiveTab('inventory');
    if (currentUser?.role === 'admin') setActiveTab('overview');
  }, [currentUser?.role]);

  if (!currentUser) {
    if (!selectedRole) {
      return <LandingPage onSelectRole={setSelectedRole} />;
    }
    return <LoginPage role={selectedRole} onBack={() => setSelectedRole(null)} />;
  }

  return (
    <div className="min-h-screen bg-[#f1f8e9]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="ml-64 min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUser.role + activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentUser.role === 'farmer' && <FarmerDashboard activeTab={activeTab} />}
            {currentUser.role === 'dealer' && <DealerDashboard activeTab={activeTab} />}
            {currentUser.role === 'admin' && <AdminDashboard activeTab={activeTab} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
