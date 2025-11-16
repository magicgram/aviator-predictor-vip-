

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HowToPlayIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
);

const ChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
);

interface OnboardingModalProps {
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#2a070b] to-[#1a0204] text-gray-200 rounded-2xl p-6 md:p-8 flex flex-col animate-fade-in shadow-2xl shadow-red-500/20 border border-red-500/20">
        <h1 className="text-3xl font-russo text-center text-red-400 mb-6 tracking-wide uppercase">{t('welcomeGuide')}</h1>
        
        <div className="space-y-6 text-gray-300 font-poppins overflow-y-auto max-h-[60vh] pr-2">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <HowToPlayIcon />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-white">{t('onboardingTitle1')}</h2>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('onboardingDesc1') }} />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <LinkIcon />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-white">{t('onboardingTitle2')}</h2>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('onboardingDesc2') }} />
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 pt-1">
              <ChartIcon />
            </div>
            <div>
              <h2 className="font-semibold text-xl text-white">{t('onboardingTitle3')}</h2>
              <p className="mt-1" dangerouslySetInnerHTML={{ __html: t('onboardingDesc3') }} />
            </div>
          </div>
          
          <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg mt-4">
            <p className="font-bold text-red-300">{t('disclaimer')}</p>
            <p className="text-sm text-red-300/80">{t('disclaimerText')}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-8 w-full py-4 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-xl tracking-wider uppercase transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_5px_20px_rgba(255,82,82,0.5)] hover:shadow-[0_5px_30px_rgba(255,82,82,0.7)] hover:scale-105 active:scale-100"
          aria-label={t('closeWelcomeGuide')}
        >
          {t('iUnderstand')}
        </button>
      </div>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default React.memo(OnboardingModal);