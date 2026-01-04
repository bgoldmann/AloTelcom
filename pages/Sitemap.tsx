import React, { useEffect } from 'react';
import { generateSitemap } from '../lib/sitemap';

// This page generates and serves the XML sitemap
// In production, this should be a server-side route or static file
const Sitemap: React.FC = () => {
  useEffect(() => {
    const sitemap = generateSitemap();
    
    // Set content type and return XML
    const blob = new Blob([sitemap], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // For client-side, we'll just display it
    // In production, this should be handled server-side
    console.log('Sitemap generated. In production, serve this as /sitemap.xml');
  }, []);

  return (
    <div className="min-h-screen bg-pars-bg py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-pars-primary mb-4">XML Sitemap</h1>
        <p className="text-pars-text mb-6">
          This page generates the XML sitemap. In production, this should be served as a static file at /sitemap.xml
        </p>
        <pre className="bg-white dark:bg-stone-800 p-6 rounded-lg overflow-auto text-sm">
          {generateSitemap()}
        </pre>
      </div>
    </div>
  );
};

export default Sitemap;

