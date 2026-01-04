import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { SEO } from '../lib/seo';

const NotFound: React.FC = () => {
  return (
    <>
      <SEO
        title="404 - Page Not Found | AloTelcom"
        description="The page you're looking for doesn't exist. Return to AloTelcom homepage or browse our eSIM plans."
        type="website"
      />
      <div className="min-h-screen bg-pars-bg flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-extrabold text-pars-cta mb-4">404</h1>
            <h2 className="text-3xl font-bold text-pars-primary mb-4">
              Page Not Found
            </h2>
            <p className="text-pars-text mb-8">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              to="/"
              className="block px-6 py-3 bg-pars-cta text-white rounded-lg font-semibold hover:bg-orange-700 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Homepage
            </Link>
            <Link
              to="/marketplace"
              className="block px-6 py-3 bg-white dark:bg-stone-800 text-pars-primary border border-pars-light rounded-lg font-semibold hover:bg-pars-bg transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              Browse eSIM Plans
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full px-6 py-3 text-pars-text hover:text-pars-cta transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Go Back
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-pars-light">
            <p className="text-sm text-pars-gray mb-4">Popular Pages:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/marketplace" className="text-pars-cta hover:underline">
                Marketplace
              </Link>
              <Link to="/help" className="text-pars-cta hover:underline">
                Help Center
              </Link>
              <Link to="/about" className="text-pars-cta hover:underline">
                About
              </Link>
              <Link to="/support" className="text-pars-cta hover:underline">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

