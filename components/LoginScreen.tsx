import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

const QuestionMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DepositMessage: React.FC<{
  onBack: () => void;
  onRegister: () => void;
  isRegistering: boolean;
}> = React.memo(({ onBack, onRegister, isRegistering }) => {
  const { t } = useLanguage();
  return (
    <div className="w-full max-w-sm mx-auto text-black text-center animate-fade-in-up">
      <h2 className="text-xl font-russo font-bold mb-4">{t('depositMessageTitle')}</h2>
      <div className="mb-6 font-sans space-y-3 text-gray-700 text-sm">
          <p>{t('depositMessageSync')}</p>
          <p>{t('depositMessageDeposit')}</p>
          <p>{t('depositMessageAccess')}</p>
      </div>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-4 bg-[#ef2b2b] text-white font-russo font-bold text-xl uppercase transition-opacity disabled:opacity-50"
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
             <span>{t('depositAndGetAccess').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-gray-200 border border-black text-black font-russo font-bold text-lg uppercase transition-colors hover:bg-gray-300"
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
    <div className="w-full max-w-sm mx-auto text-black text-center animate-fade-in-up">
      <h2 className="text-xl font-russo font-bold mb-4">{t('reDepositMessageTitle')}</h2>
      <p className="mb-6 font-sans text-gray-700 text-sm">{t('reDepositMessageContinue')}</p>
      <div className="space-y-4">
        <button
          onClick={onRegister}
          disabled={isRegistering}
          className="w-full py-4 bg-[#ef2b2b] text-white font-russo font-bold text-xl uppercase transition-opacity disabled:opacity-50"
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
            <span>{t('depositAgain').toUpperCase()}</span>
          )}
        </button>
        <button
          onClick={onBack}
          className="w-full py-3 bg-gray-200 border border-black text-black font-russo font-bold text-lg uppercase transition-colors hover:bg-gray-300"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
    </div>
  );
});


const LoginScreen: React.FC<{
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  onOpenGuide: () => void;
}> = ({ onLoginSuccess, onOpenSidebar, onOpenGuide }) => {
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
    <div className="w-full min-h-screen flex flex-col items-center bg-white text-black font-sans">
       <header className="w-full relative">
        <div className="absolute top-0 left-0 p-4 z-20">
          <button onClick={onOpenSidebar} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors" aria-label={t('openMenu')}>
            <MenuIcon className="w-7 h-7"/>
          </button>
        </div>
        <div className="absolute top-0 right-0 p-4 z-20">
          <button onClick={onOpenGuide} className="text-white p-2 rounded-full hover:bg-white/20 transition-colors" aria-label={t('openGuide')}>
            <QuestionMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="absolute -z-10 w-full" style={{ lineHeight: 0 }}>
            <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="w-full">
                <path fill="#d10000" d="M0,0 L1440,0 L1440,230 Q720,380 0,230 Z" />
            </svg>
            <div className="absolute top-0 left-0 w-full" style={{ marginTop: '-2px' }}>
                <svg viewBox="0 0 1440 360" preserveAspectRatio="none" className="w-full">
                    <path fill="#ef2b2b" d="M0,0 L1440,0 L1440,240 Q720,360 0,240 Z" />
                </svg>
            </div>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-12 pb-32">
             <img
              src="https://i.postimg.cc/Zq9wLS2k/Picsart-25-11-16-17-07-19-310.png"
              alt="Aviator Predictor VIP Logo"
              className="w-60 object-contain"
              draggable="false" onContextMenu={(e) => e.preventDefault()}
             />
        </div>
      </header>

      <main className="w-full max-w-xs mx-auto flex flex-col items-center justify-start flex-grow px-4 pb-4 pt-8">
          {needsDeposit ? (
              <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          ) : needsReDeposit ? (
              <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
          ) : (
              <div className="w-full flex flex-col items-center">
                  <div className="w-full">
                      <label htmlFor="playerId" className="font-sans text-black text-sm font-bold mb-1 block text-left uppercase">
                         Enter Players I'd
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-black" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input
                            id="playerId"
                            type="text"
                            value={playerId}
                            onChange={(e) => setPlayerId(e.target.value)}
                            placeholder="12345678"
                            className="w-full pl-11 pr-4 py-3 bg-white border border-black text-black placeholder-gray-400 font-sans text-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        />
                    </div>
                  </div>
  
                  <button
                      onClick={handleContinue}
                      disabled={isLoading || !playerId}
                      className="w-full mt-6 py-4 bg-[#ef2b2b] text-white font-russo font-bold text-xl uppercase transition-opacity disabled:opacity-50"
                  >
                      {isLoading ? (
                          <div className="flex justify-center items-center h-[28px]">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                          </div>
                      ) : (
                         "GET STARTED"
                      )}
                  </button>
                  
                  <p className="mt-6 font-sans text-black text-sm font-semibold">I DON'T HAVE AN ACCOUNT</p>
  
                  <button
                      onClick={handleRegister}
                      disabled={isRegistering}
                      className="w-full mt-2 py-4 bg-[#ef2b2b] text-white font-russo font-bold text-xl uppercase transition-opacity disabled:opacity-50"
                  >
                       {isRegistering ? (
                        <div className="flex justify-center items-center h-[28px]">
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : (
                        "REGISTER HERE"
                    )}
                  </button>

                  {error && (
                      <div className="w-full mt-4 p-3 text-center text-sm bg-red-100 text-red-800 border border-red-300 font-sans">
                          {error}
                      </div>
                  )}
              </div>
          )}
      </main>

      <footer className="w-full text-center pb-4 pt-4 mt-auto">
          <p className="text-gray-400 font-sans text-sm">v10.5.9</p>
      </footer>
    </div>
  );
};

export default LoginScreen;