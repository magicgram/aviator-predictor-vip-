import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HowToPlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-[#f0f0f0] z-50 flex flex-col animate-fade-in font-poppins" aria-modal="true" role="dialog">
       <style>{`
        .swoop-bg::before {
            content: '';
            position: absolute;
            top: -25vh;
            left: 50%;
            transform: translateX(-50%);
            width: 200vw;
            height: 50vh;
            background: linear-gradient(180deg, #d92121, #b50000);
            border-radius: 0 0 50% 50%;
            z-index: 0;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
      <div className="absolute inset-0 swoop-bg"></div>

      <div className="relative z-10 flex-grow w-full h-full flex flex-col">
        <header className="w-full text-center p-6 pt-12 flex-shrink-0">
            <h1 className="text-3xl font-extrabold text-white tracking-wide uppercase">{t('welcomeGuide')}</h1>
        </header>

        <main className="flex-grow overflow-y-auto px-4 pb-4">
            <div className="max-w-lg mx-auto bg-white rounded-2xl p-6 shadow-lg space-y-6 text-gray-800">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><HowToPlayIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-black">{t('onboardingTitle1')}</h2>
                        <p className="mt-1 text-gray-600" dangerouslySetInnerHTML={{ __html: t('onboardingDesc1') }} />
                    </div>
                </div>

                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><LinkIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-black">{t('onboardingTitle2')}</h2>
                        <p className="mt-1 text-gray-600" dangerouslySetInnerHTML={{ __html: t('onboardingDesc2') }} />
                    </div>
                </div>
                
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 pt-1"><ChartIcon /></div>
                    <div>
                        <h2 className="font-bold text-xl text-black">{t('onboardingTitle3')}</h2>
                        <p className="mt-1 text-gray-600" dangerouslySetInnerHTML={{ __html: t('onboardingDesc3') }} />
                    </div>
                </div>
                
                <div className="text-center p-3 bg-red-100 border border-red-200 rounded-lg mt-4">
                    <p className="font-bold text-red-800">{t('disclaimer')}</p>
                    <p className="text-sm text-red-700">{t('disclaimerText')}</p>
                </div>
            </div>
        </main>
        
        <footer className="w-full p-4 bg-white flex items-center justify-center shadow-[0_-2px_10px_rgba(0,0,0,0.1)] mt-auto flex-shrink-0">
            <button
            onClick={onClose}
            className="w-full max-w-xs py-4 bg-[#d10000] rounded-xl text-white font-bold text-xl tracking-wider uppercase transition-all duration-300 shadow-lg hover:bg-red-800 active:scale-95"
            aria-label={t('closeWelcomeGuide')}
            >
            {t('iUnderstand')}
            </button>
        </footer>
      </div>
    </div>
  );
};

export default React.memo(OnboardingModal);