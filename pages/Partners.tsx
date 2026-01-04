import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Server, Users, ArrowRight, Zap, BarChart3, Check, Briefcase } from 'lucide-react';

const Partners: React.FC = () => {
  return (
    <div className="bg-pars-bg dark:bg-stone-950 min-h-screen transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-stone-900 pb-20 pt-10 lg:pt-20 border-b border-gray-100 dark:border-stone-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-100 dark:bg-stone-800 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-blue-100 dark:bg-stone-800 rounded-full blur-3xl opacity-50"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="inline-block px-4 py-2 bg-pars-cta/10 text-pars-cta rounded-full font-bold text-xs uppercase tracking-wider mb-6">
                AloTelcom Partner Program
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-pars-primary dark:text-white leading-tight mb-6">
                Grow your business with <span className="text-pars-cta">Connectivity.</span>
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Join the world's fastest-growing eSIM ecosystem. Whether you're a travel agency, app developer, or content creator, we have the tools to help you monetize and scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#partner-form" className="px-8 py-4 bg-pars-cta text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg text-center">
                  Become a Partner
                </a>
                <Link to="/partner-login" className="px-8 py-4 bg-white dark:bg-stone-800 text-pars-primary dark:text-white border border-gray-200 dark:border-stone-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-stone-700 transition text-center flex items-center justify-center gap-2">
                  Partner Login <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-up hidden lg:block">
               <div className="bg-gray-100 dark:bg-stone-800 rounded-3xl p-8 transform rotate-3 shadow-2xl border border-gray-200 dark:border-stone-700">
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm mb-4 flex items-center gap-4">
                     <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl text-blue-600 dark:text-blue-400"><Server className="h-6 w-6" /></div>
                     <div>
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">API Requests</div>
                        <div className="text-2xl font-bold text-pars-primary dark:text-white">2.4M</div>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm mb-4 flex items-center gap-4">
                     <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-xl text-green-600 dark:text-green-400"><Users className="h-6 w-6" /></div>
                     <div>
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">Active eSIMs</div>
                        <div className="text-2xl font-bold text-pars-primary dark:text-white">850k+</div>
                     </div>
                  </div>
                  <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                     <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-xl text-orange-600 dark:text-orange-400"><BarChart3 className="h-6 w-6" /></div>
                     <div>
                        <div className="text-sm font-bold text-gray-500 dark:text-gray-400">Partner Revenue</div>
                        <div className="text-2xl font-bold text-pars-primary dark:text-white">$12.5M</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-24 bg-white dark:bg-stone-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-pars-primary dark:text-white mb-4">A Solution for Every Business</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We provide flexible integration methods tailored to your business model.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: API */}
            <div className="bg-gray-50 dark:bg-stone-950 p-8 rounded-3xl border border-gray-100 dark:border-stone-800 hover:border-pars-cta dark:hover:border-pars-cta transition-all group">
               <div className="w-14 h-14 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                 <Server className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">AloTelcom API</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                 Build your own eSIM store or integrate connectivity into your travel app. Full white-label capabilities with our robust REST API.
               </p>
               <ul className="space-y-2 mb-8">
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Instant Provisioning</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Wholesale Rates</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> White-label Support</li>
               </ul>
               <Link to="/profile" className="text-pars-cta font-bold hover:underline flex items-center gap-1">Get API Key <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {/* Card 2: Affiliate */}
            <div className="bg-gray-50 dark:bg-stone-950 p-8 rounded-3xl border border-gray-100 dark:border-stone-800 hover:border-pars-cta dark:hover:border-pars-cta transition-all group">
               <div className="w-14 h-14 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-orange-600 group-hover:scale-110 transition-transform">
                 <Zap className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">Affiliate Program</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                 Perfect for bloggers, influencers, and content creators. Refer traffic to AloTelcom and earn industry-leading commissions.
               </p>
               <ul className="space-y-2 mb-8">
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Up to 20% Commission</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> 30-Day Cookie Life</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Real-time Tracking</li>
               </ul>
               <Link to="/partner-login" className="text-pars-cta font-bold hover:underline flex items-center gap-1">Join Program <ArrowRight className="h-4 w-4" /></Link>
            </div>

            {/* Card 3: Business */}
            <div className="bg-gray-50 dark:bg-stone-950 p-8 rounded-3xl border border-gray-100 dark:border-stone-800 hover:border-pars-cta dark:hover:border-pars-cta transition-all group">
               <div className="w-14 h-14 bg-white dark:bg-stone-900 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-purple-600 group-hover:scale-110 transition-transform">
                 <Briefcase className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">AloTelcom Business</h3>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                 Manage connectivity for your entire workforce. Centralized dashboard for issuing and monitoring eSIMs for employees.
               </p>
               <ul className="space-y-2 mb-8">
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Centralized Billing</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Bulk Distribution</li>
                 <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"><Check className="h-4 w-4 text-green-500" /> Expense Management</li>
               </ul>
               <Link to="/partner-login" className="text-pars-cta font-bold hover:underline flex items-center gap-1">Business Login <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Code Snippet (Visual) */}
      <section className="py-24 bg-pars-bg dark:bg-stone-950 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div>
                  <h2 className="text-3xl font-bold text-pars-primary dark:text-white mb-6">Developer-First API</h2>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                     Our API is designed for simplicity and performance. Integrate eSIM purchase and management into your booking flow in minutes, not weeks.
                  </p>
                  <div className="space-y-4">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">1</div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">Get API Key</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Generate your production key from the partner dashboard.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">2</div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">Fetch Packages</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Query our catalog of 190+ countries and regions.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">3</div>
                        <div>
                           <h4 className="font-bold text-gray-900 dark:text-white">Issue eSIM</h4>
                           <p className="text-sm text-gray-500 dark:text-gray-400">Instant order processing and QR code delivery.</p>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-800">
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
                     <span className="text-xs text-gray-400 ml-2 font-mono">api-example.js</span>
                  </div>
                  <div className="p-6 overflow-x-auto">
                     <pre className="text-sm font-mono text-gray-300">
                        <code>{`const response = await fetch('https://api.alotelcom.com/v2/orders', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    package_id: 'esim_jp_10gb',
    quantity: 1
  })
});

const data = await response.json();
console.log(data.qr_code_url);`}</code>
                     </pre>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Lead Form */}
      <section id="partner-form" className="py-24 bg-white dark:bg-stone-900">
         <div className="max-w-3xl mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold text-pars-primary dark:text-white">Start Your Journey</h2>
               <p className="text-gray-500 dark:text-gray-400 mt-2">Fill out the form below and our partnerships team will get back to you within 24 hours.</p>
            </div>
            
            <div className="bg-pars-bg dark:bg-stone-950 p-8 md:p-10 rounded-3xl border border-gray-200 dark:border-stone-800 shadow-sm">
               <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">First Name</label>
                        <input type="text" className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Last Name</label>
                        <input type="text" className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Work Email</label>
                     <input type="email" className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Company Website</label>
                     <input type="text" className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Partnership Type</label>
                     <select className="w-full bg-white dark:bg-stone-900 border border-gray-300 dark:border-stone-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition">
                        <option>API Integration / Reseller</option>
                        <option>Affiliate</option>
                        <option>Corporate / Business</option>
                        <option>Other</option>
                     </select>
                  </div>
                  <button className="w-full bg-pars-cta text-white font-bold py-4 rounded-xl hover:bg-orange-700 transition shadow-lg">
                     Submit Application
                  </button>
               </form>
            </div>
         </div>
      </section>

    </div>
  );
};

export default Partners;