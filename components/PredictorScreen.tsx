import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { User } from '../types';
import { usePrediction } from '../services/authService';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import GuideModal from './GuideModal';
import AdminAuthModal from './AdminAuthModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PredictorScreenProps {
  user: User;
  onLogout: () => void;
}

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);


// --- Sub-components moved outside and memoized for performance ---

const LimitReachedView = React.memo(({ handleDepositRedirect }: { handleDepositRedirect: () => void; }) => {
  const { t } = useLanguage();
  return (
    <div className="text-center p-8 bg-gradient-to-b from-[#2a070b] to-[#1a0204] text-gray-200 rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/20 w-full max-w-md">
      <h2 className="text-2xl font-russo text-red-400 uppercase">{t('limitReachedTitle')}</h2>
      <p className="mt-4 text-gray-300 font-poppins">{t('limitReachedText')}</p>
      <button 
        onClick={handleDepositRedirect}
        className="mt-6 w-full py-4 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,82,82,0.5)] hover:shadow-[0_5px_30px_rgba(255,82,82,0.7)] hover:scale-105 active:scale-100"
      >
        {t('depositNow')}
      </button>
    </div>
  );
});


const PredictorView = React.memo((props: {
    onOpenSidebar: () => void;
    displayValue: string;
    isPredicting: boolean;
    isRoundComplete: boolean;
    onGetSignal: () => void;
    onNextRound: () => void;
}) => {
    const { t } = useLanguage();

    useEffect(() => {
        const sparkleContainer = document.getElementById('sparkles');
        if (!sparkleContainer) return;

        // Prevent adding sparkles if they already exist
        if (sparkleContainer.children.length > 0) return;
        
        const sparkleCount = 40;
        for (let i = 0; i < sparkleCount; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            sparkle.style.top = `${Math.random() * 100}%`;
            sparkle.style.left = `${Math.random() * 100}%`;
            const delay = Math.random() * 5;
            const duration = Math.random() * 3 + 2;
            sparkle.style.animation = `sparkle-anim ${duration}s linear ${delay}s infinite`;
            sparkleContainer.appendChild(sparkle);
        }
    }, []);

    const buttonAction = props.isRoundComplete ? props.onNextRound : props.onGetSignal;
    const buttonText = props.isRoundComplete ? t('nextRound') : (props.isPredicting ? t('predicting') : t('getSignal'));
    const isButtonDisabled = props.isPredicting;

    return (
        <div className="w-full h-full flex flex-col items-center justify-between relative overflow-hidden p-6 font-russo text-white">
            <div id="sparkles" className="absolute inset-0 pointer-events-none z-0"></div>
            <style>{`
                @keyframes sparkle-anim {
                  0%, 100% { transform: scale(0); opacity: 0; }
                  50% { transform: scale(1); opacity: 1; }
                  99% { opacity: 0; }
                }
                .sparkle {
                  position: absolute;
                  width: 3px;
                  height: 3px;
                  background: rgba(255, 100, 100, 0.8);
                  border-radius: 50%;
                  box-shadow: 0 0 5px rgba(255, 100, 100, 1);
                }
                @keyframes pulse-slow {
                  0%, 100% { box-shadow: 0 0 10px 0px rgba(255, 82, 82, 0.3); opacity: 0.8; transform: scale(1); }
                  50% { box-shadow: 0 0 25px 8px rgba(255, 82, 82, 0.6); opacity: 1; transform: scale(1.02); }
                }
                @keyframes pulse-medium {
                  0%, 100% { opacity: 0.7; }
                  50% { opacity: 1; }
                }
            `}</style>

            <header className="w-full flex justify-between items-start z-10">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-wider leading-tight" style={{textShadow: '0 0 10px rgba(255,255,255,0.3)'}}>
                    Aviator<br/>Predictor
                </h1>
                <button onClick={props.onOpenSidebar} className="p-2 text-white" aria-label={t('openMenu')}>
                    <MenuIcon className="w-8 h-8" />
                </button>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center z-10 w-full my-4">
                <img 
                  src="https://i.postimg.cc/FzvNHVnG/Picsart-25-11-15-11-35-00-149.png" 
                  alt="Aviator Plane" 
                  className="w-full max-w-sm drop-shadow-[0_10px_15px_rgba(255,50,50,0.3)] select-none"
                  draggable="false" onContextMenu={(e) => e.preventDefault()}
                />

                <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mt-8">
                    <div 
                        className="absolute inset-0 rounded-full border-4 border-red-500/30 animate-pulse-slow"
                        style={{animationDuration: '3s'}}
                    ></div>
                    <div 
                        className="absolute w-[85%] h-[85%] rounded-full border-4 border-red-500/50 animate-pulse-medium"
                        style={{animation: 'pulse-medium 2s ease-in-out infinite reverse'}}
                    ></div>
                    <div className="absolute w-[70%] h-[70%] bg-red-900/20 rounded-full"></div>

                    <p className={`font-bold font-mono transition-colors duration-300 whitespace-nowrap text-5xl md:text-6xl ${props.isRoundComplete ? 'text-white' : 'text-gray-300'}`} style={{textShadow: '0 0 20px rgba(255, 100, 100, 0.9)'}}>
                        {props.displayValue}
                    </p>
                </div>
            </main>

            <footer className="w-full max-w-sm z-10 py-4">
                <button 
                    onClick={buttonAction}
                    disabled={isButtonDisabled}
                    className="w-full py-4 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-2xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,82,82,0.5)] hover:shadow-[0_5px_30px_rgba(255,82,82,0.7)] hover:scale-105 active:scale-100"
                >
                    {buttonText}
                </button>
            </footer>
        </div>
    );
});


const PredictorScreen: React.FC<PredictorScreenProps> = ({ user, onLogout }) => {
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [displayValue, setDisplayValue] = useState("?.??x");
  const [predictionsLeft, setPredictionsLeft] = useState(user.predictionsLeft);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('predictor'); // 'predictor' or 'testPostback'
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const storedPic = localStorage.getItem(`profile_pic_${user.playerId}`);
    if (storedPic) {
      setProfilePic(storedPic);
    } else {
      setProfilePic(null);
    }
  }, [user.playerId]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  const handleProfilePictureChange = useCallback((newPicUrl: string) => {
    setProfilePic(newPicUrl);
  }, []);

  const handleGetSignal = useCallback(async () => {
    if (isPredicting || predictionsLeft <= 0 || isRoundComplete) return;

    setIsPredicting(true);

    try {
      const result = await usePrediction(user.playerId);
      if (!result.success) {
        alert(`${t('errorLabel')}: ${result.message || t('couldNotUsePrediction')}`);
        setIsPredicting(false);
        return;
      }
      
      setPredictionsLeft(prev => prev - 1);
      setPrediction(null);
      setIsRoundComplete(false);

      intervalRef.current = window.setInterval(() => {
        const randomValue = (Math.random() * 9 + 1).toFixed(2);
        setDisplayValue(`${randomValue}x`);
      }, 50);

      setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        const isRare = Math.random() < 2 / 25;
        let finalPrediction: string;

        if (isRare) {
          finalPrediction = (Math.random() * (3.10 - 2.20) + 2.20).toFixed(2);
        } else {
          finalPrediction = (Math.random() * (2.20 - 1.10) + 1.10).toFixed(2);
        }
        
        setPrediction(`${finalPrediction}x`);
        setDisplayValue(`${finalPrediction}x`);
        setIsPredicting(false);
        setIsRoundComplete(true);
      }, 3000);

    } catch (error) {
       console.error("Failed to get signal:", error);
       alert(t('unexpectedErrorSignal'));
       setIsPredicting(false);
    }
  }, [user.playerId, isPredicting, predictionsLeft, isRoundComplete, t]);
  
  const handleNextRound = useCallback(() => {
    if (isPredicting) return;
    setPrediction(null);
    setDisplayValue("0.00x");
    setIsRoundComplete(false);
  }, [isPredicting]);

  const handleDepositRedirect = useCallback(async () => {
    try {
        const response = await fetch('/api/get-affiliate-link');
        const data = await response.json();
        if (response.ok && data.success) {
            if (window.top) {
                window.top.location.href = data.link;
            } else {
                window.location.href = data.link;
            }
        } else {
            alert(data.message || t('depositLinkNotAvailable'));
        }
    } catch (error) {
        console.error('Failed to fetch deposit link:', error);
        alert(t('unexpectedErrorOccurred'));
    }
  }, [t]);
  
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);
  const handleNavigate = useCallback((view) => { setCurrentView(view); setIsSidebarOpen(false); }, []);
  const handleTestPostbackClick = useCallback(() => { setIsSidebarOpen(false); setShowAdminModal(true); }, []);
  const handleAdminSuccess = useCallback(() => { setShowAdminModal(false); setCurrentView('testPostback'); }, []);
  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToPredictor = useCallback(() => setCurrentView('predictor'), []);

  const mainContainerClasses = "w-full min-h-screen bg-gradient-to-b from-[#3a0a0f] to-[#1a0204]";

  if (predictionsLeft <= 0 && !isPredicting) {
    return (
        <div className={`${mainContainerClasses} flex items-center justify-center p-4`}>
            <LimitReachedView handleDepositRedirect={handleDepositRedirect} />
        </div>
    );
  }
  
  return (
    <div className={mainContainerClasses}>
      {isGuideOpen && <GuideModal onClose={() => setIsGuideOpen(false)} />}
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={onLogout}
        isLoggedIn={true}
        playerId={user.playerId}
        onProfilePictureChange={handleProfilePictureChange}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {currentView === 'predictor' && (
        <PredictorView 
            displayValue={displayValue}
            isPredicting={isPredicting}
            isRoundComplete={isRoundComplete}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onGetSignal={handleGetSignal}
            onNextRound={handleNextRound}
        />
      )}
      {currentView === 'testPostback' && 
        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full max-w-md h-[90vh] max-h-[700px] flex flex-col p-6 bg-gradient-to-b from-[#2a070b] to-[#1a0204] text-gray-200 rounded-2xl shadow-2xl shadow-red-500/20 border border-red-500/20 relative">
              <TestPostbackScreen onBack={handleBackToPredictor} />
          </div>
        </div>
      }
    </div>
  );
};

export default React.memo(PredictorScreen);