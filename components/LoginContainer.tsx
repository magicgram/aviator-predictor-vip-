import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import LoginScreen from './LoginScreen';
import AdminAuthModal from './AdminAuthModal';
import GuideModal from './GuideModal';

interface LoginContainerProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ onLoginSuccess }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'testPostback'
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const handleOpenGuide = useCallback(() => setIsGuideOpen(true), []);
  const handleCloseGuide = useCallback(() => setIsGuideOpen(false), []);

  const handleTestPostbackClick = useCallback(() => {
    setIsSidebarOpen(false);
    setShowAdminModal(true);
  }, []);

  const handleAdminSuccess = useCallback(() => {
    setShowAdminModal(false);
    setCurrentView('testPostback');
  }, []);

  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToLogin = useCallback(() => setCurrentView('login'), []);
  
  const isTestPostbackView = currentView === 'testPostback';

  return (
    <div className={`w-full h-full flex items-center justify-center ${isTestPostbackView ? 'p-4' : ''}`}>
      {isGuideOpen && <GuideModal onClose={handleCloseGuide} />}
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={() => {}} // No-op when not logged in
        isLoggedIn={false}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {isTestPostbackView ? (
        <div className="w-full max-w-md h-[90vh] max-h-[700px] flex flex-col p-6 bg-gradient-to-b from-[#2a070b] to-[#1a0204] text-gray-200 rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/20 relative">
          <TestPostbackScreen onBack={handleBackToLogin} />
        </div>
      ) : (
        <div className="w-full h-full">
            <LoginScreen 
                onLoginSuccess={onLoginSuccess}
                onOpenSidebar={handleOpenSidebar}
                onOpenGuide={handleOpenGuide}
            />
        </div>
      )}
    </div>
  );
};

export default LoginContainer;