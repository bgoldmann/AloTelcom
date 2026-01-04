import React, { useState } from 'react';

const Legal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <div className="min-h-screen bg-white py-12">
       <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-pars-primary mb-8 text-center">Legal Center</h1>
          
          <div className="flex justify-center mb-12">
             <div className="bg-gray-100 p-1.5 rounded-xl inline-flex shadow-inner">
                <button 
                  onClick={() => setActiveTab('privacy')}
                  className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'privacy' ? 'bg-white shadow-sm text-pars-cta scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Privacy Policy
                </button>
                <button 
                  onClick={() => setActiveTab('terms')}
                  className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 'terms' ? 'bg-white shadow-sm text-pars-cta scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Terms of Service
                </button>
             </div>
          </div>

          <div className="prose prose-lg prose-orange max-w-none text-gray-600 bg-gray-50 p-8 md:p-12 rounded-3xl border border-gray-100">
             {activeTab === 'privacy' ? (
                <div className="animate-fade-in space-y-6">
                   <div>
                       <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy Policy</h2>
                       <p className="text-sm text-gray-400 font-mono bg-gray-200 inline-block px-2 py-1 rounded">Last updated: October 2023</p>
                   </div>
                   <p>Your privacy is important to us. It is AloTelcom's policy to respect your privacy regarding any information we may collect from you across our website and application.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h3>
                   <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent. This may include your email address, device identifiers (IMEI) for eSIM activation, and payment information.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Information</h3>
                   <p>We use the data we collect to provide, maintain, and improve our services, including processing transactions, activating eSIMs, and sending you related information such as confirmations and invoices.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Security</h3>
                   <p>We take security seriously and use industry-standard encryption and security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Data Sharing</h3>
                   <p>We do not share your personal information with third parties, except as necessary to provide our services (e.g., payment processors, telecom network partners) or as required by law.</p>

                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Cookie Policy</h3>
                   <p>We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
                   <ul className="list-disc pl-5 space-y-2">
                     <li><strong>Essential Cookies:</strong> We use these to remember your settings and preferences.</li>
                     <li><strong>Analytics Cookies:</strong> We use these to understand how users engage with our website.</li>
                     <li><strong>Advertising Cookies:</strong> We use these to deliver advertisements that are relevant to you.</li>
                   </ul>
                </div>
             ) : (
                <div className="animate-fade-in space-y-6">
                   <div>
                       <h2 className="text-2xl font-bold text-gray-900 mb-2">Terms of Service</h2>
                       <p className="text-sm text-gray-400 font-mono bg-gray-200 inline-block px-2 py-1 rounded">Last updated: October 2023</p>
                   </div>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h3>
                   <p>By accessing our website and using our services, you agree to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Use License</h3>
                   <p>Permission is granted to temporarily download one copy of the materials (information or software) on AloTelcom's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Refund Policy</h3>
                   <p>Refunds for eSIMs are available only if the eSIM has not been installed and activated on a device. Once an eSIM is installed, it is considered used and cannot be refunded due to the nature of the product, unless there is a verifiable technical fault from our end.</p>
                   
                   <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Limitations</h3>
                   <p>In no event shall AloTelcom or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on AloTelcom's website.</p>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};
export default Legal;