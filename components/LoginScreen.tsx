
import React, { useState, useCallback } from 'react';
import { verifyUser, VerificationResponse } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const MenuIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const GuideIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
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
          className="w-full py-3 px-4 min-h-[56px] h-auto bg-[#ef4444] text-white font-poppins font-bold text-lg rounded-2xl transition-all hover:bg-red-600 active:bg-red-700 disabled:opacity-50 flex items-center justify-center text-center whitespace-pre-wrap leading-tight shadow-md"
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
          className="w-full py-3 px-4 min-h-[56px] h-auto bg-gray-200 text-black font-poppins font-bold text-lg rounded-2xl transition-colors hover:bg-gray-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
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
          className="w-full py-3 px-4 min-h-[56px] h-auto bg-[#ef4444] text-white font-poppins font-bold text-lg rounded-2xl transition-all hover:bg-red-600 active:bg-red-700 disabled:opacity-50 flex items-center justify-center text-center whitespace-pre-wrap leading-tight shadow-md"
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
          className="w-full py-3 px-4 min-h-[56px] h-auto bg-gray-200 text-black font-poppins font-bold text-lg rounded-2xl transition-colors hover:bg-gray-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
        >
          {t('back').toUpperCase()}
        </button>
      </div>
    </div>
  );
});

interface LoginScreenProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  onOpenSidebar: () => void;
  onOpenGuide: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ 
    onLoginSuccess,
    onOpenSidebar,
    onOpenGuide 
}) => {
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
                    setError(t('youAreNotRegistered'));
                }
            } else if (response.status === 'INVALID_ID') {
                setError(t('invalidPlayerIdError'));
            } else if (response.status === 'SERVER_ERROR') {
                setError(t('serverErrorError'));
            } else {
                 if (response.success) {
                    setError(t('loginFailedNoCount'));
                } else {
                    // Use generic error if status is unknown to ensure translation
                    setError(t('unknownErrorError'));
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
        setError(t('registrationLinkNotAvailable'));
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
    <div className="w-full min-h-screen flex flex-col bg-white font-poppins">
      <header className="w-full h-[45vh] min-h-[320px] relative z-10">
          <img 
              src="https://i.postimg.cc/L8ftJHbq/retouch-2025111710482926-(1).jpg" 
              alt="Header" 
              className="w-full h-full object-cover object-center"
              draggable="false" onContextMenu={(e) => e.preventDefault()}
          />
           <div className="absolute top-6 right-4 flex items-center space-x-2">
            <button onClick={onOpenGuide} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Guide">
                <GuideIcon className="w-6 h-6" />
            </button>
            <button onClick={onOpenSidebar} className="p-2 rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/40" aria-label="Open Menu">
                <MenuIcon className="w-6 h-6" />
            </button>
          </div>
      </header>

      <main className="w-full flex flex-col items-center flex-grow -mt-6 md:-mt-12 z-20 px-4 pb-8">
          {needsDeposit ? (
             <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-black border border-red-100">
                <DepositMessage onBack={handleBackFromDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
             </div>
          ) : needsReDeposit ? (
             <div className="w-full max-w-sm bg-white rounded-2xl p-8 shadow-2xl text-black border border-red-100">
                <ReDepositMessage onBack={handleBackFromReDeposit} onRegister={handleRegister} isRegistering={isRegistering} />
             </div>
          ) : (
              <div className="w-full max-w-sm">
                  <div className="w-full bg-white text-black rounded-3xl p-6 md:p-8 shadow-2xl space-y-4 border border-red-100">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            id="playerId"
                            type="text"
                            value={playerId}
                            onChange={(e) => setPlayerId(e.target.value)}
                            placeholder={t('playerIdLabel')}
                            className="w-full pl-12 pr-5 py-4 bg-[#fdebeb] border-none text-gray-700 placeholder-gray-500 font-sans text-base rounded-full focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                        />
                      </div>
  
                      <button
                          onClick={handleContinue}
                          disabled={isLoading || !playerId}
                          className="w-full py-3 px-4 min-h-[56px] h-auto bg-red-500 text-white font-russo font-bold text-lg uppercase rounded-2xl transition-all hover:bg-red-600 active:bg-red-700 disabled:opacity-50 shadow-md flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                      >
                          {isLoading ? (
                              <div className="flex justify-center items-center h-[28px]">
                                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                              </div>
                          ) : (
                             t('continue')
                          )}
                      </button>

                      <p className="text-center text-xs text-gray-500 font-sans uppercase font-semibold pt-2">{t('dontHaveAccount')}</p>
  
                      <button
                          onClick={handleRegister}
                          disabled={isRegistering}
                          className="w-full py-3 px-4 min-h-[56px] h-auto bg-slate-200 text-gray-800 font-russo font-bold text-lg uppercase rounded-2xl transition-all hover:bg-slate-300 disabled:opacity-50 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                      >
                        {isRegistering ? (
                            <div className="flex justify-center items-center h-[28px]">
                                <svg className="animate-spin h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : (
                           t('registerHere').toUpperCase()
                        )}
                      </button>

                  </div>
                  {error && (
                      <div className="w-full mt-4 p-3 text-center text-sm bg-red-100 text-red-800 border border-red-300 font-sans rounded-lg">
                          {error}
                      </div>
                  )}
              </div>
          )}
           <p className="mt-8 text-gray-400 font-sans">v10.5.9</p>
      </main>
    </div>
  );
};

export default LoginScreen;
