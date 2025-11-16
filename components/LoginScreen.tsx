import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  onOpenGuide: () => void;
}

const UserIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const QuestionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
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


const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onOpenGuide, onOpenSidebar }) => {
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
      const response = await fetch('/api/get-affiliate-link');
      const data = await response.json();

      if (response.ok && data.success) {
        if (window.top) {
          window.top.location.href = data.link;
        } else {
          window.location.href = data.link;
        }
      } else {
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-[#d81f25] to-[#a21318] p-4">
        
        <header className="absolute top-0 left-0 right-0 z-30 p-4 flex justify-between items-center">
            <button onClick={onOpenSidebar} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors" aria-label={t('openMenu')}>
                <MenuIcon className="w-7 h-7 text-white" />
            </button>
            <button onClick={onOpenGuide} className="p-2 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors" aria-label={t('openGuide')}>
                <QuestionIcon className="w-7 h-7 text-white" />
            </button>
        </header>

        <div className="absolute bottom-0 left-0 w-full z-10 pointer-events-none">
          <svg width="100%" height="auto" viewBox="0 0 1440 320" preserveAspectRatio="none" className="block">
            <path d="M0,224L1440,128L1440,320L0,320Z" fill="white" fillOpacity="0.1"></path>
            <path d="M0,256L1440,160L1440,320L0,320Z" fill="white"></path>
          </svg>
        </div>
        <img 
            src="https://i.postimg.cc/dVpjB84G/Picsart-25-11-16-14-04-08-046.png" 
            alt="Aviator decorative" 
            className="absolute bottom-10 right-8 w-24 h-auto z-20 pointer-events-none"
            draggable="false" onContextMenu={(e) => e.preventDefault()}
        />

      {needsDeposit ? (
          <div className="flex-grow w-full flex items-center justify-center z-20">
            <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          </div>
      ) : needsReDeposit ? (
          <div className="flex-grow w-full flex items-center justify-center z-20">
            <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          </div>
      ) : (
          <div className="w-full max-w-xs flex flex-col items-center z-20">
              <img 
                  src="https://i.postimg.cc/2y709VV8/Picsart-25-11-16-14-02-34-272.png" 
                  alt="Aviator Predictor Pro Logo" 
                  className="w-64 object-contain mb-10 drop-shadow-[0_10px_15px_rgba(0,0,0,0.3)]"
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
                              className="w-full pl-12 pr-4 py-3 bg-white/95 border-2 border-transparent rounded-xl text-black placeholder-gray-500 font-sans text-lg focus:outline-none focus:ring-4 focus:ring-red-500/50 focus:border-red-500 transition duration-300 shadow-lg"
                          />
                      </div>
                  </div>

                  <button
                      onClick={handleContinue}
                      disabled={isLoading || !playerId}
                      className="w-full py-4 bg-white rounded-xl text-red-600 font-russo font-bold text-xl tracking-wider uppercase transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                  >
                      {isLoading ? (
                          <div className="flex justify-center items-center h-[28px]">
                              <svg className="animate-spin h-5 w-5 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
          
              <div className="w-full text-center mt-8">
                  <p className="font-poppins text-white/80 text-xs mb-2 font-semibold tracking-wider">{t('dontHaveAccount').toUpperCase()}</p>
                  <button
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full py-3 bg-transparent border-2 border-white/70 rounded-xl text-white font-russo font-bold text-xl tracking-wider disabled:opacity-70 disabled:cursor-not-allowed transform transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                  >
                      {isRegistering ? (
                          <div className="flex justify-center items-center h-[28px]">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                          </div>
                      ) : (
                          <span>{t('registerHere')}</span>
                      )}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default LoginScreen;