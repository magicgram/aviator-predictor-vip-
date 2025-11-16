

import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AdminAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const AdminAuthModal: React.FC<AdminAuthModalProps> = ({ onClose, onSuccess }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !password) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/verify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onSuccess();
      } else {
        setError(data.message || t('incorrectPassword'));
      }
    } catch (err) {
      setError(t('errorOccurred'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      <div className="w-full max-w-sm bg-gradient-to-b from-[#2a070b] to-[#1a0204] text-gray-200 rounded-2xl p-6 md:p-8 flex flex-col animate-fade-in shadow-2xl shadow-red-500/20 border border-red-500/20">
        <h1 className="text-2xl font-russo text-center text-red-400 mb-2 uppercase">{t('adminAccess')}</h1>
        <p className="text-center text-gray-400 mb-6 font-poppins">{t('enterPasswordToAccessTestPage')}</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition duration-300"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="p-3 rounded-lg text-center text-sm bg-red-500/10 text-red-300 border border-red-500/30">
                {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="py-3 bg-transparent border-2 border-gray-500/60 rounded-xl text-gray-300 font-russo font-bold text-lg hover:bg-gray-500/10 transition duration-300"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              disabled={isLoading || !password}
              className="py-3 bg-gradient-to-b from-red-500 to-red-700 rounded-xl text-white font-russo font-bold text-lg tracking-wider transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_5px_15px_rgba(255,82,82,0.4)]"
            >
              {isLoading ? t('verifying') : t('submit')}
            </button>
          </div>
        </form>
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

export default React.memo(AdminAuthModal);