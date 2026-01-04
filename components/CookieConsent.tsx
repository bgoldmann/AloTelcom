import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('pars_cookie_consent');
    if (!consent) {
      // Delay slightly for better UX on initial load
      setTimeout(() => setIsVisible(true), 1500);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('pars_cookie_consent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('pars_cookie_consent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-fade-in-up">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 md:flex md:items-center md:justify-between gap-6 ring-1 ring-black/5">
        <div className="flex items-start gap-4 mb-4 md:mb-0">
          <div className="p-3 bg-orange-50 rounded-xl text-pars-cta hidden sm:block shrink-0">
            <Cookie className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">We value your privacy</h3>
            <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic in accordance with GDPR and CCPA regulations. By clicking "Accept All", you consent to our use of cookies.
              <Link to="/legal" className="text-pars-cta hover:underline ml-1 font-medium">Read Policy</Link>.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={handleDecline}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-pars-cta hover:bg-orange-700 transition-colors shadow-lg transform hover:-translate-y-0.5"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;