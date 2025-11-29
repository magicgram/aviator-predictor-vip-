
import React, { useState } from 'react';
import * as authService from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import PostbackGuide from './PostbackGuide';

interface TestPostbackScreenProps {
  onBack: () => void;
}

const ArrowLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const TestPostbackScreen: React.FC<TestPostbackScreenProps> = ({ onBack }) => {
  const [userId, setUserId] = useState('testuser123');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // State for the new promo code form
  const [newPromoCode, setNewPromoCode] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  
  const { t } = useLanguage();

  const handleAction = async (action: (id: string, amount?: any) => Promise<string>, amount?: number) => {
    if (!userId) {
        setError(t('pleaseEnterUserId'));
        return;
    }
    setIsLoading(true);
    setMessage(null);
    setError(null);
    try {
        const result = await action(userId, amount);
        if (result.startsWith('SUCCESS:')) {
            setMessage(result);
        } else { // It's an error from the service layer
            setError(result);
        }
    } catch(err) { // This handles network errors etc.
        setError(t('unexpectedErrorOccurred'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  };

  const handleUpdatePromoCode = async () => {
    if (!newPromoCode || !adminPassword) {
      setUpdateError(t('fillBothFields'));
      return;
    }
    setIsUpdating(true);
    setUpdateMessage(null);
    setUpdateError(null);

    try {
      const response = await fetch('/api/promo-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ promoCode: newPromoCode, password: adminPassword }),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setUpdateMessage(result.message || t('promoCodeSuccess'));
        setNewPromoCode('');
        setAdminPassword('');
      } else {
        setUpdateError(result.message || t('unknownErrorError'));
      }
    } catch (err) {
      setUpdateError(t('unexpectedErrorOccurred'));
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (showGuide) {
      return <PostbackGuide onBack={() => setShowGuide(false)} />;
  }

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
                height: 50vh; /* Smaller swoop for this screen */
                background: linear-gradient(180deg, #d92121, #b50000);
                border-radius: 0 0 50% 50%;
                z-index: 0;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
        `}</style>
        <div className="absolute inset-0 swoop-bg"></div>

        <div className="relative z-10 flex-grow w-full h-full flex flex-col">
            <header className="flex items-center p-6 flex-shrink-0 text-white">
                <div className="w-10">
                <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/20" aria-label={t('goBack')}>
                    <ArrowLeftIcon className="w-6 h-6" />
                </button>
                </div>
                <h1 className="text-xl md:text-2xl font-bold tracking-wide text-center flex-grow uppercase">{t('postbackTestingTool')}</h1>
                <div className="w-10"></div>
            </header>

            <main className="flex-grow overflow-y-auto px-4 pb-8">
              <div className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-lg">
                <p className="text-center text-gray-600 text-sm mb-4 font-sans">
                  {t('postbackToolDescription')}
                </p>
                
                <div className="text-center mb-6">
                    <button
                        onClick={() => setShowGuide(true)}
                        className="px-4 py-2 text-sm bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                    >
                        {t('viewSetupGuide')}
                    </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="userIdTest" className="text-sm font-semibold text-gray-700 font-sans">
                      {t('userIdToTest')}
                    </label>
                    <input
                      id="userIdTest"
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="testuser123"
                      className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    />
                  </div>
                  
                  {error && (
                      <div className="p-3 rounded-lg text-center text-sm bg-red-100 text-red-800 border border-red-200">
                          {error}
                      </div>
                  )}
                  {message && (
                      <div className="p-3 rounded-lg text-center text-sm bg-green-100 text-green-800 border border-green-200">
                          {message}
                      </div>
                  )}

                  <button
                    onClick={() => handleAction(authService.testRegistration)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 min-h-[56px] h-auto bg-red-500 rounded-xl text-white font-bold text-lg hover:bg-red-600 disabled:opacity-70 transition duration-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                  >
                    {t('testRegistration')}
                  </button>
                  <button
                    onClick={() => handleAction(authService.testFirstDeposit, 10)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 min-h-[56px] h-auto bg-red-500 rounded-xl text-white font-bold text-lg hover:bg-red-600 disabled:opacity-70 transition duration-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                  >
                    {t('testFirstDeposit')}
                  </button>
                  <button
                    onClick={() => handleAction(authService.testReDeposit, 5)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 min-h-[56px] h-auto bg-red-500 rounded-xl text-white font-bold text-lg hover:bg-red-600 disabled:opacity-70 transition duration-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                  >
                    {t('testReDeposit')}
                  </button>

                  <div className="w-1/4 h-px bg-gray-200 my-3 mx-auto"></div>

                  <button
                    onClick={() => handleAction(authService.clearUserData)}
                    disabled={isLoading}
                    className="w-full py-3 px-4 min-h-[56px] h-auto bg-gray-600 rounded-xl text-white font-bold text-lg hover:bg-gray-700 disabled:opacity-70 transition duration-300 flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                  >
                    {t('clearUserData')}
                  </button>
                </div>
                
                {/* --- NEW PROMO CODE SECTION --- */}
                <div className="w-1/2 h-px bg-gray-200 my-6 mx-auto"></div>
                <div className="space-y-4 pb-4">
                  <h2 className="text-center font-bold text-lg text-gray-800">{t('updatePromoCode')}</h2>
                  <div>
                    <label htmlFor="newPromoCode" className="text-sm font-semibold text-gray-700 font-sans">
                      {t('newPromoCode')}
                    </label>
                    <input
                      id="newPromoCode"
                      type="text"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      placeholder="NEWPROMO25"
                      className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    />
                  </div>
                  <div>
                    <label htmlFor="adminPassword" className="text-sm font-semibold text-gray-700 font-sans">
                      {t('adminPassword')}
                    </label>
                    <input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      className="mt-2 w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                    />
                  </div>

                  {updateError && (
                    <div className="p-3 rounded-lg text-center text-sm bg-red-100 text-red-800 border border-red-200">
                      {updateError}
                    </div>
                  )}
                  {updateMessage && (
                    <div className="p-3 rounded-lg text-center text-sm bg-green-100 text-green-800 border border-green-200">
                      {updateMessage}
                    </div>
                  )}

                  <button
                    onClick={handleUpdatePromoCode}
                    disabled={isUpdating}
                    className="w-full py-3 px-4 min-h-[56px] h-auto bg-red-600 rounded-xl text-white font-bold text-lg hover:bg-red-700 disabled:opacity-70 transition duration-300 shadow-md flex items-center justify-center text-center whitespace-pre-wrap leading-tight"
                  >
                    {isUpdating ? t('updating') : t('updatePromocodeButton')}
                  </button>
                </div>
              </div>
            </main>
        </div>
    </div>
  );
};

export default React.memo(TestPostbackScreen);
