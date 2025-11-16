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
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
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
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setCurrentTime(`${hours}:${minutes}`);
        };
        updateTime();
        const timer = setInterval(updateTime, 1000 * 30); // Update every 30 seconds
        return () => clearInterval(timer);
    }, []);


    const buttonAction = props.isRoundComplete ? props.onNextRound : props.onGetSignal;
    const buttonText = props.isRoundComplete ? t('nextRound') : (props.isPredicting ? t('predicting') : t('getSignal'));
    const isButtonDisabled = props.isPredicting;

    return (
        <div className="w-full h-screen bg-[#f0f0f0] text-black flex flex-col font-poppins relative overflow-hidden">
            <style>{`
                .swoop-bg::before {
                    content: '';
                    position: absolute;
                    top: -25vh;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 200vw;
                    height: 68vh;
                    background: linear-gradient(180deg, #d92121, #b50000);
                    border-radius: 0 0 50% 50%;
                    z-index: 0;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .wandering-arc-1 {
                    position: absolute;
                    inset: 0;
                    border-radius: 50%;
                    border: 5px solid transparent;
                    border-top-color: #d10000;
                    animation: spin-slow 5s linear infinite;
                }
                .wandering-arc-2 {
                    position: absolute;
                    inset: 10px;
                    border-radius: 50%;
                    border: 4px solid transparent;
                    border-top-color: #e53e3e;
                    border-right-color: #e53e3e;
                    animation: spin-medium 7s linear infinite reverse;
                }
                .wandering-arc-3 {
                    position: absolute;
                    inset: 0; 
                    border-radius: 50%;
                    border: 5px solid transparent;
                    border-left-color: #d10000;
                    animation: spin-slow 5s linear infinite;
                    transform: rotate(180deg);
                }
                @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes spin-medium { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
            <div className="absolute inset-0 swoop-bg"></div>

            <div className="relative z-10 flex-grow w-full h-full flex flex-col items-center justify-between">
                <header className="w-full text-left p-6 pt-8">
                    <h1 className="text-4xl font-extrabold text-white tracking-normal leading-tight">
                        AVIATOR<br/>PREDICTOR VIP
                    </h1>
                </header>
                
                <main className="flex-grow w-full flex flex-col items-center justify-start pt-4 px-4">
                    <img 
                        src="https://i.postimg.cc/W4cFfhV3/Picsart-25-11-16-12-52-34-932.png" 
                        alt="Aviator Plane" 
                        className="w-full max-w-[340px] drop-shadow-[0_10px_15px_rgba(0,0,0,0.2)] select-none z-10"
                        draggable="false" onContextMenu={(e) => e.preventDefault()}
                    />

                    <div className="relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center mt-4">
                        <div className="wandering-arc-1"></div>
                        <div className="wandering-arc-2"></div>
                        <div className="wandering-arc-3"></div>
                        <div className="absolute inset-[24px] rounded-full border border-red-200"></div>
                        
                        <p className="font-sans font-black text-black whitespace-nowrap text-5xl md:text-6xl">
                           {props.displayValue}
                        </p>
                    </div>

                    <div className="w-full max-w-xs mt-6">
                         <button 
                            onClick={buttonAction}
                            disabled={isButtonDisabled}
                            className="w-full py-4 bg-[#d10000] rounded-xl text-white font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:bg-red-800 active:scale-95"
                        >
                            {buttonText}
                        </button>
                    </div>
                </main>

                <footer className="w-full h-20 bg-white flex items-center justify-between px-6 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] mt-auto">
                    <p className="text-4xl font-extrabold text-[#d10000] font-sans tracking-tighter">{currentTime}</p>
                    <button onClick={props.onOpenSidebar} className="p-2 text-black" aria-label={t('openMenu')}>
                        <MenuIcon className="w-8 h-8" />
                    </button>
                </footer>
            </div>
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
    setDisplayValue("?.??x");
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