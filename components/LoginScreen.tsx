import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void; // Prop retained for logic consistency
  onOpenGuide: () => void; // Prop retained for logic consistency
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);


const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4">{t('depositMessageTitle')}</h2>
      <div className="mb-6 font-poppins space-y-3 text-gray-300">
          <p>{t('depositMessageSync')}</p>
          <p>{t('depositMessageDeposit')}</p>
          <p>{t('depositMessageAccess')}</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-4 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,82,82,0.5)] hover:shadow-[0_5px_30px_rgba(255,82,82,0.7)] hover:scale-105 active:scale-100"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
             <div className="flex justify-center items-center">
                <span>{t('depositAndGetAccess').toUpperCase()}</span>
             </div>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

const ReDepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-white text-center animate-fade-in-up">
      <h2 className="text-2xl font-bold mb-4">{t('reDepositMessageTitle')}</h2>
      <p className="mb-6 font-poppins text-gray-300">{t('reDepositMessageContinue')}</p>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-4 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,82,82,0.5)] hover:shadow-[0_5px_30px_rgba(255,82,82,0.7)] hover:scale-105 active:scale-100"
        >
          {isRegistering ? (
            <div className="flex justify-center items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting')}...
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span>{t('depositAgain').toUpperCase()}</span>
            </div>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-white/5 border-2 border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/10 transition duration-300"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
    </div>
  );
});


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [playerId, setPlayerId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDeposit, setNeedsDeposit] = useState(false);
  const [needsReDeposit, setNeedsReDeposit] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState<Record<string, number>>({});
  const { t } = useLanguage();

  const handleContinue = async () => {
    setIsLoading(true);
    setError(null);
    setNeedsDeposit(false);
    setNeedsReDeposit(false);
    
    const idToVerify = playerId;

    try {
        const response: VerificationResponse = await verifyUser(idToVerify);
        if (response.success && typeof response.predictionsLeft !== 'undefined') {
            onLoginSuccess(idToVerify, response.predictionsLeft);
        } else {
            setPlayerId(''); // Clear input on failure
            if (response.status === 'NEEDS_DEPOSIT') {
                setNeedsDeposit(true);
            } else if (response.status === 'NEEDS_REDEPOSIT') {
                setNeedsReDeposit(true);
            } else if (response.status === 'NOT_REGISTERED') {
                const currentAttempts = loginAttempts[idToVerify] || 0;
                const newAttemptsCount = currentAttempts + 1;
                setLoginAttempts(prev => ({ ...prev, [idToVerify]: newAttemptsCount }));

                if (newAttemptsCount >= 3) {
                    setError(t('noRegistrationFoundAfterAttempts'));
                } else {
                    setError(response.message || t('youAreNotRegistered'));
                }
            } else {
                 if (response.success) {
                    setError(t('loginFailedNoCount'));
                } else {
                    setError(response.message || t('unknownErrorOccurred'));
                }
            }
        }
    } catch (err) {
        setPlayerId('');
        setError(t('unexpectedErrorOccurred'));
        console.error("Login attempt failed:", err);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleRegister = useCallback(async () => {
    setIsRegistering(true);
    setError(null); // Clear previous errors
    try {
      // The endpoint now returns JSON with the link instead of redirecting directly.
      const response = await fetch('/api/get-affiliate-link');
      const data = await response.json();

      if (response.ok && data.success) {
        // Use window.top.location.href to break out of potential iframes.
        if (window.top) {
          window.top.location.href = data.link;
        } else {
          window.location.href = data.link;
        }
      } else {
        // Handle the case where the link is not configured on the server.
        // The error is now displayed in the UI instead of crashing.
        setError(data.message || t('registrationLinkNotAvailable'));
        setIsRegistering(false);
      }
    } catch (error) {
      console.error('Failed to fetch registration link:', error);
      setError(t('unexpectedErrorOccurred'));
      setIsRegistering(false);
    }
  }, [t]);

  const handleBackFromDeposit = useCallback(() => setNeedsDeposit(false), []);
  const handleBackFromReDeposit = useCallback(() => setNeedsReDeposit(false), []);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between relative overflow-hidden bg-[#D81F25]">
        {/* Decorative background elements */}
        <div className="absolute bottom-0 left-0 w-full z-0 pointer-events-none">
          <svg width="100%" height="auto" viewBox="0 0 1440 300" preserveAspectRatio="none">
            <path d="M0,150 C400,250 1000,50 1440,150 L1440,300 L0,300 Z" fill="white"></path>
            <path d="M0,160 C400,260 1000,60 1440,160" stroke="#D81F25" strokeWidth="3" fill="none"></path>
          </svg>
        </div>
        <img 
            src="https://i.postimg.cc/dVpjB84G/Picsart-25-11-16-14-04-08-046.png" 
            alt="Aviator decorative" 
            className="absolute bottom-4 right-8 w-24 h-auto z-0 pointer-events-none"
            draggable="false" onContextMenu={(e) => e.preventDefault()}
        />

      {needsDeposit ? (
          <div className="flex-grow w-full flex items-center justify-center p-4 z-10">
            <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          </div>
      ) : needsReDeposit ? (
          <div className="flex-grow w-full flex items-center justify-center p-4 z-10">
            <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          </div>
      ) : (
          <>
            <main className="w-full max-w-xs flex flex-col items-center z-10 px-4 pt-16 flex-grow justify-center">
                <img 
                    src="https://i.postimg.cc/2y709VV8/Picsart-25-11-16-14-02-34-272.png" 
                    alt="Aviator Predictor Pro Logo" 
                    className="w-64 object-contain mb-10 drop-shadow-lg"
                    draggable="false" onContextMenu={(e) => e.preventDefault()} 
                />

                <div className="w-full flex flex-col items-center space-y-5">
                    <div className="w-full">
                        <label htmlFor="playerId" className="font-poppins text-white text-xs font-semibold mb-1.5 block text-left tracking-wider">
                            {t('playerIdLabel').toUpperCase()}
                        </label>
                        <div className="relative flex items-center">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <UserIcon />
                            </div>
                            <input
                                id="playerId"
                                type="text"
                                value={playerId}
                                onChange={(e) => setPlayerId(e.target.value)}
                                placeholder="12345678"
                                className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-lg text-black placeholder-gray-500 font-sans text-lg focus:outline-none focus:ring-2 focus:ring-red-300/50 transition duration-300 shadow-md"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleContinue}
                        disabled={isLoading || !playerId}
                        className="w-full py-3 bg-[#FCDADD] rounded-lg text-[#D81F25] font-russo font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:brightness-95 active:scale-95"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center h-[28px]">
                                <svg className="animate-spin h-5 w-5 text-[#D81F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                            <span>{t('continue')}</span>
                        )}
                    </button>
                </div>
                
                {error && (
                    <div className="w-full mt-4 p-3 rounded-md text-center text-sm bg-red-800/50 text-red-100 border border-red-400/30 font-poppins">
                        {error}
                    </div>
                )}
            </main>

            <footer className="w-full max-w-xs z-10 px-4 pb-8">
                <div className="w-full text-center">
                    <p className="font-poppins text-white text-xs mb-2 font-semibold tracking-wider">{t('dontHaveAccount').toUpperCase()}</p>
                    <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="w-full py-3 bg-white rounded-lg text-[#D81F25] font-russo font-bold text-xl tracking-wider hover:bg-gray-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 shadow-lg active:scale-95"
                    >
                        {isRegistering ? (
                            <div className="flex justify-center items-center h-[28px]">
                                <svg className="animate-spin h-5 w-5 text-[#D81F25]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                            <span>{t('registerHere')}</span>
                        )}
                    </button>
                </div>
            </footer>
          </>
      )}
    </div>
  );
};

export default LoginScreen;
