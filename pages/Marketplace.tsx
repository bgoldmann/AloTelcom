import React, { useState, useEffect } from 'react';
import { SEO } from '../lib/seo';
import { BreadcrumbSchemaScript, ProductSchemaScript } from '../lib/schema';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Zap, Globe, Signal, ChevronLeft, Map, Phone, Shield, Mic, CheckCircle, ArrowRight, Info, Star, Share2, Wifi, MessageSquare, Image, Key } from 'lucide-react';
import { Plan, Review } from '../types';
import { useApp } from '../store';
import { getAllProducts } from '../lib/supabase-helpers';
import LoadingSpinner from '../components/LoadingSpinner';

// Helper function to create dynamic styles for animations
const createAnimationStyle = (delay: number): React.CSSProperties => ({
  '--animation-delay': `${delay}ms`,
  animationDelay: 'var(--animation-delay)',
} as React.CSSProperties);

// Helper function to create tab indicator styles
const createTabIndicatorStyle = (tab: 'local' | 'regional' | 'global'): React.CSSProperties => ({
  '--tab-indicator-left': tab === 'local' ? '6px' : tab === 'regional' ? '33.33%' : '66.66%',
  '--tab-indicator-width': 'calc(33.33% - 4px)',
  '--tab-indicator-transform': tab === 'regional' ? 'translateX(2px)' : tab === 'global' ? 'translateX(-2px)' : 'none',
  left: 'var(--tab-indicator-left)',
  width: 'var(--tab-indicator-width)',
  transform: 'var(--tab-indicator-transform)',
} as React.CSSProperties);

// Products are now fetched from database

type Category = 'esim' | 'number' | 'vpn' | 'voip' | 'sms' | 'mms' | '2fa';
type EsimTab = 'local' | 'regional' | 'global';

const Marketplace: React.FC = () => {
  const { addToCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<Category>('esim');
  const [esimTab, setEsimTab] = useState<EsimTab>('local');
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [allProducts, setAllProducts] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selection State (Master-Detail for eSIM)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  
  // Modal State
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<Plan | null>(null);

  // Fetch products from database
  useEffect(() => {
    let isMounted = true;
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        console.error('Product fetch timeout - taking too long');
        setError('Request is taking too long. Please check your connection and try again.');
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching products from database...');
        const products = await getAllProducts();
        console.log('Products fetched:', products.length, products);
        
        if (!isMounted) return;
        
        clearTimeout(timeoutId);
        
        if (products.length === 0) {
          console.warn('No products found in database. Make sure seed.sql has been run.');
          setError('No products available. The database may be empty. Please run the seed script or contact support.');
        } else {
          setAllProducts(products);
        }
      } catch (err: any) {
        if (!isMounted) return;
        
        clearTimeout(timeoutId);
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err?.message,
          error: err,
          stack: err?.stack
        });
        setError(`Failed to load products: ${err?.message || 'Unknown error'}. Please check your Supabase connection and environment variables.`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // Auto-switch category based on search term
  useEffect(() => {
    if (initialSearch && allProducts.length > 0) {
      const lower = initialSearch.toLowerCase();
      
      // Check which category matches the search
      const hasNumber = allProducts.some(p => p.type === 'number' && (p.country.toLowerCase().includes(lower) || p.data.toLowerCase().includes(lower)));
      if (hasNumber) { setActiveCategory('number'); return; }

      const hasVpn = allProducts.some(p => p.type === 'vpn' && (p.data.toLowerCase().includes(lower) || p.country.toLowerCase().includes(lower)));
      if (hasVpn) { setActiveCategory('vpn'); return; }

      const hasVoip = allProducts.some(p => p.type === 'voip' && (p.country.toLowerCase().includes(lower) || p.data.toLowerCase().includes(lower)));
      if (hasVoip) { setActiveCategory('voip'); return; }

      const hasSms = allProducts.some(p => p.type === 'sms') || lower.includes('sms') || lower.includes('text message');
      if (hasSms) { setActiveCategory('sms'); return; }

      const hasMms = allProducts.some(p => p.type === 'mms') || lower.includes('mms') || lower.includes('multimedia');
      if (hasMms) { setActiveCategory('mms'); return; }

      const has2fa = allProducts.some(p => p.type === '2fa') || lower.includes('2fa') || lower.includes('verification') || lower.includes('authentication');
      if (has2fa) { setActiveCategory('2fa'); return; }

      // For eSIM, check if it's local or regional
      const esimProducts = allProducts.filter(p => p.type === 'esim');
      const inLocal = esimProducts.some(p => p.country.toLowerCase().includes(lower) && p.region !== 'Global' && p.region !== 'Eurolink' && p.region !== 'Asialink' && p.region !== 'Latamlink' && p.region !== 'Menalink');
      if (inLocal) { setActiveCategory('esim'); setEsimTab('local'); return; }

      const inRegional = esimProducts.some(p => p.region.toLowerCase().includes(lower) || ['Eurolink', 'Asialink', 'Latamlink', 'Menalink'].some(r => p.region.includes(r)));
      if (inRegional) { setActiveCategory('esim'); setEsimTab('regional'); return; }

      const inGlobal = esimProducts.some(p => p.region === 'Global' || p.country.toLowerCase().includes('countries'));
      if (inGlobal) { setActiveCategory('esim'); setEsimTab('global'); return; }
    }
  }, [initialSearch, allProducts]);

  const getDisplayedPlans = () => {
    // Filter products by category
    let source: Plan[] = allProducts.filter(p => {
      if (activeCategory === 'esim') {
        // For eSIM, filter by tab type
        if (esimTab === 'local') {
          // Local plans: region should be a country name (not Global, Eurolink, etc.)
          return p.type === 'esim' && p.region !== 'Global' && 
                 !['Eurolink', 'Asialink', 'Latamlink', 'Menalink'].includes(p.region);
        } else if (esimTab === 'regional') {
          // Regional plans: region should be one of the regional names
          return p.type === 'esim' && ['Eurolink', 'Asialink', 'Latamlink', 'Menalink'].includes(p.region);
        } else {
          // Global plans: region should be Global
          return p.type === 'esim' && p.region === 'Global';
        }
      } else {
        return p.type === activeCategory;
      }
    });

    // Apply search filter
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      source = source.filter(p => 
        p.country.toLowerCase().includes(lower) || 
        p.region.toLowerCase().includes(lower) ||
        p.data.toLowerCase().includes(lower) ||
        (p.description && p.description.toLowerCase().includes(lower))
      );
    }
    return source;
  };

  const displayedPlans = getDisplayedPlans();

  // For eSIM Grid View: Get unique countries
  const uniqueCountries = activeCategory === 'esim' 
    ? Array.from(new Set(displayedPlans.map(p => esimTab === 'regional' ? p.region : p.country))).map(name => displayedPlans.find(p => (esimTab === 'regional' ? p.region : p.country) === name)!)
    : displayedPlans;

  const handleCountryClick = (name: string) => {
    setSelectedCountryName(name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenDetails = (plan: Plan) => {
    setSelectedPlanForDetail(plan);
  };

  const handleBuyFromModal = (plan: Plan) => {
    addToCart(plan);
    setSelectedPlanForDetail(null);
    navigate('/checkout');
  };

  // Get category-specific SEO data
  const getCategorySEO = () => {
    const categoryNames = {
      esim: 'eSIM Data Plans',
      number: 'Virtual Phone Numbers',
      vpn: 'VPN Services',
      voip: 'VOIP Calling Credits',
      sms: 'SMS Messaging',
      mms: 'MMS Messaging',
      '2fa': '2FA Verification',
    };
    return {
      title: `${categoryNames[activeCategory]} | AloTelcom Marketplace`,
      description: `Browse ${categoryNames[activeCategory].toLowerCase()} for 190+ countries. Instant activation, no roaming fees.`,
      keywords: `${activeCategory}, ${categoryNames[activeCategory].toLowerCase()}, travel connectivity, international data`,
    };
  };

  const seoData = getCategorySEO();
  const breadcrumbData = {
    items: [
      { name: 'Home', url: 'https://alotelcom.com/' },
      { name: 'Marketplace', url: 'https://alotelcom.com/marketplace' },
      { name: seoData.title.split('|')[0].trim(), url: `https://alotelcom.com/marketplace?category=${activeCategory}` },
    ],
  };

  return (
    <>
      <SEO
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        type="website"
      />
      <BreadcrumbSchemaScript data={breadcrumbData} />
      <div className="min-h-screen bg-pars-bg dark:bg-stone-950 pb-24 relative transition-colors duration-300">
      
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {error && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
              </div>
              <div className="flex-1">
                <h3 className="text-red-800 dark:text-red-300 font-bold mb-2">Error Loading Products</h3>
                <p className="text-red-700 dark:text-red-400 text-sm mb-4">{error}</p>
                <div className="mt-4 text-xs text-red-600 dark:text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                  <p className="font-semibold mb-2">Troubleshooting steps:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Check browser console (F12) for detailed error messages</li>
                    <li>Verify Supabase environment variables are set: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY</li>
                    <li>Ensure the database schema (schema.sql) and seed data (seed.sql) have been run</li>
                    <li>Check Supabase dashboard for RLS policies and table permissions</li>
                    <li>Verify the products table exists and has data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Header & Tabs */}
          <div className="bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-gray-100 dark:border-stone-800 sticky top-16 z-30 shadow-sm transition-all duration-300">
            <div className="max-w-5xl mx-auto px-4 py-6">
              <h1 className="text-3xl font-extrabold text-center text-pars-primary dark:text-white mb-6">Marketplace</h1>
              
              {/* Search */}
              <div className="relative mb-8 max-w-lg mx-auto group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5 group-hover:text-pars-cta transition-colors" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-100 dark:border-stone-700 rounded-2xl text-base text-gray-900 dark:text-white focus:bg-white dark:focus:bg-stone-800 focus:ring-2 focus:ring-pars-cta/20 focus:border-pars-cta/50 transition-all shadow-inner outline-none"
                  placeholder={
                    activeCategory === 'esim' ? "Search countries..." : 
                    activeCategory === 'sms' || activeCategory === 'mms' || activeCategory === '2fa' ? "Search messaging plans..." :
                    "Search plans..."
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    aria-label="Clear search"
                    title="Clear search"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Category Tabs */}
              <div className="flex justify-center mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <div className="flex gap-2 sm:gap-4 px-2">
                  {[
                    { id: 'esim', icon: Signal, label: 'eSIM' },
                    { id: 'number', icon: Phone, label: 'Numbers' },
                    { id: 'vpn', icon: Shield, label: 'VPN' },
                    { id: 'voip', icon: Mic, label: 'VOIP' },
                    { id: 'sms', icon: MessageSquare, label: 'SMS' },
                    { id: 'mms', icon: Image, label: 'MMS' },
                    { id: '2fa', icon: Key, label: '2FA' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setActiveCategory(cat.id as Category); setSelectedCountryName(null); }}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
                        activeCategory === cat.id 
                          ? 'bg-pars-cta text-white shadow-lg transform scale-105' 
                          : 'bg-white dark:bg-stone-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-stone-700 border border-gray-100 dark:border-stone-700'
                      }`}
                    >
                      <cat.icon className="h-4 w-4" /> {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Tabs for eSIM */}
              {activeCategory === 'esim' && (
                <div className="flex justify-center animate-fade-in">
                  <div className="bg-gray-100 dark:bg-stone-800 p-1.5 rounded-full inline-flex relative shadow-inner">
                    <div 
                      className="absolute top-1.5 bottom-1.5 bg-white dark:bg-stone-700 rounded-full shadow-md transition-all duration-300 ease-out z-0"
                      style={createTabIndicatorStyle(esimTab)} // eslint-disable-line
                    ></div>
                    {(['local', 'regional', 'global'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => { setEsimTab(tab); setSelectedCountryName(null); }}
                        aria-label={`View ${tab} eSIM plans`}
                        title={`View ${tab} plans`}
                        className={`relative z-10 px-6 sm:px-8 py-2 rounded-full text-sm font-bold capitalize transition-colors duration-300 ${esimTab === tab ? 'text-pars-primary dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* eSIM Grid/Detail View */}
        {activeCategory === 'esim' ? (
          selectedCountryName ? (
            <div className="animate-slide-in-right">
               <button 
                 onClick={() => setSelectedCountryName(null)}
                 aria-label="Back to all countries"
                 title="Back to all countries"
                 className="flex items-center text-gray-500 dark:text-gray-400 hover:text-pars-cta dark:hover:text-pars-cta font-bold mb-6 transition-colors bg-white dark:bg-stone-800 px-4 py-2 rounded-full shadow-sm hover:shadow-md"
               >
                 <ChevronLeft className="h-5 w-5 mr-1" /> Back to {esimTab === 'regional' ? 'Regions' : 'Countries'}
               </button>

               <div className="flex items-center gap-4 mb-8">
                 <div className="w-20 h-20 rounded-3xl bg-white dark:bg-stone-800 shadow-md flex items-center justify-center text-5xl border border-gray-100 dark:border-stone-700 animate-scale-up">
                    {displayedPlans.find(p => (esimTab === 'regional' ? p.region : p.country) === selectedCountryName)?.flag}
                 </div>
                 <div>
                   <h2 className="text-3xl font-extrabold text-pars-primary dark:text-white">{selectedCountryName}</h2>
                   <p className="text-gray-500 dark:text-gray-400">Select a data package</p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedPlans
                    .filter(p => (esimTab === 'regional' ? p.region : p.country) === selectedCountryName)
                    .map((plan, idx) => (
                      <PlanCard key={plan.id} plan={plan} onDetails={() => handleOpenDetails(plan)} delay={idx} />
                    ))}
               </div>
            </div>
          ) : (
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-fade-in-up">
                {uniqueCountries.map((item, idx) => {
                  const name = esimTab === 'regional' ? item.region : item.country;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCountryClick(name)}
                      className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-gray-100 dark:border-stone-800 shadow-sm hover:shadow-xl hover:border-pars-cta/20 transition-all duration-300 group text-left flex flex-col h-full animate-fade-in hover:-translate-y-1"
                      style={createAnimationStyle(idx * 30)} // eslint-disable-line
                      aria-label={`Browse ${name} plans`}
                      title={`View plans for ${name}`}
                    >
                       <div className="flex items-start justify-between mb-4">
                          <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:rotate-6">{item.flag}</span>
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-stone-800 flex items-center justify-center group-hover:bg-pars-cta group-hover:text-white transition-all">
                             <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-white" />
                          </div>
                       </div>
                       <div className="mt-auto">
                         <h3 className="font-bold text-gray-900 dark:text-white leading-tight group-hover:text-pars-cta transition-colors text-lg">{name}</h3>
                         {esimTab === 'regional' && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.country}</p>}
                       </div>
                    </button>
                  );
                })}
             </div>
          )
        ) : (
          /* VPN, Numbers, VOIP, SMS, MMS, 2FA Layout */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
             {displayedPlans.map((plan, idx) => (
                <PlanCard key={plan.id} plan={plan} onDetails={() => handleOpenDetails(plan)} delay={idx} />
             ))}
          </div>
        )}
          </div>

          {/* Detail Modal */}
          {selectedPlanForDetail && (
            <PlanDetailsModal 
              plan={selectedPlanForDetail} 
              isOpen={!!selectedPlanForDetail} 
              onClose={() => setSelectedPlanForDetail(null)}
              onBuy={() => handleBuyFromModal(selectedPlanForDetail)}
            />
          )}
        </>
      )}
    </div>
    </>
  );
};

// Reusable Plan Card Component
interface PlanCardProps {
  plan: Plan;
  onDetails: () => void;
  delay: number;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, onDetails, delay }) => {
  return (
    <div 
      className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-stone-800 hover:shadow-2xl hover:border-orange-100 dark:hover:border-stone-700 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group h-full flex flex-col"
      style={createAnimationStyle(delay * 50)} // eslint-disable-line
    >
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pars-accent to-orange-400 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm z-10 uppercase tracking-wider">
            Best Value
          </div>
        )}
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
             {plan.type !== 'esim' && <span className="text-4xl">{plan.flag || '🌐'}</span>}
             <div>
               <div className="text-2xl font-extrabold text-pars-primary dark:text-white mb-1 tracking-tight">
                 {plan.data}
               </div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                 {plan.type === 'number' ? 'Phone Number' : 
                  plan.type === 'vpn' ? 'Security Plan' : 
                  plan.type === 'voip' ? 'Credits' : 
                  plan.type === 'sms' ? 'Text Message' :
                  plan.type === 'mms' ? 'Multimedia' :
                  plan.type === '2fa' ? 'Verification' :
                  'Data Allowance'}
               </div>
             </div>
          </div>
          <div className="text-right min-w-fit">
             <div className="text-2xl font-bold text-pars-cta">${plan.price.toFixed(2)}</div>
             {plan.type !== 'voip' && <div className="text-sm text-gray-400">/ {plan.validity.toLowerCase().includes('year') ? 'yr' : 'mo'}</div>}
          </div>
        </div>
        
        <div className="space-y-3 mb-8 flex-grow">
           {plan.type === 'esim' ? (
             <>
               <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-stone-800 rounded-xl group-hover:bg-orange-50/50 dark:group-hover:bg-stone-700 transition-colors">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Signal className="h-4 w-4 text-pars-cta" /> Network</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">LTE/5G</span>
               </div>
               <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-stone-800 rounded-xl group-hover:bg-orange-50/50 dark:group-hover:bg-stone-700 transition-colors">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Map className="h-4 w-4 text-pars-cta" /> Validity</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{plan.validity}</span>
               </div>
             </>
           ) : (
             <>
               <div className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-stone-800 rounded-xl group-hover:bg-orange-50/50 dark:group-hover:bg-stone-700 transition-colors">
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-2"><Globe className="h-4 w-4 text-pars-cta" /> Region</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{plan.country}</span>
               </div>
               {plan.features?.slice(0, 2).map((feat, i) => (
                 <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 px-2">
                    <CheckCircle className="h-4 w-4 text-green-500" /> {feat}
                 </div>
               ))}
             </>
           )}
        </div>

        <button
          onClick={onDetails}
          aria-label={`View details for ${plan.country} ${plan.data} plan`}
          title="View plan details"
          className="w-full py-4 bg-gray-100 dark:bg-stone-800 text-pars-primary dark:text-white font-bold rounded-2xl hover:bg-pars-cta hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transform duration-200 cursor-pointer"
        >
          View Details <ArrowRight className="h-4 w-4" />
        </button>
    </div>
  );
};

// New Detail Modal Component
const PlanDetailsModal: React.FC<{ plan: Plan; isOpen: boolean; onClose: () => void; onBuy: () => void }> = ({ plan, isOpen, onClose, onBuy }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'coverage' | 'reviews'>('overview');

  if (!isOpen) return null;

  // Calculate average rating
  const avgRating = plan.reviews?.length 
    ? (plan.reviews.reduce((sum, r) => sum + r.rating, 0) / plan.reviews.length).toFixed(1)
    : '4.8';
  const reviewCount = plan.reviews?.length || 1204;

  // Product schema for this plan
  const productSchema = {
    name: `${plan.country} ${plan.data} eSIM Plan`,
    description: plan.description || `Stay connected in ${plan.country} with ${plan.data} data. Valid for ${plan.validity}.`,
    brand: 'AloTelcom',
    offers: {
      price: plan.price.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://alotelcom.com/marketplace?plan=${plan.id}`,
    },
    aggregateRating: {
      ratingValue: avgRating,
      reviewCount: reviewCount.toString(),
    },
  };

  return (
    <>
      <ProductSchemaScript data={productSchema} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
       <div 
         className="bg-white dark:bg-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]"
         onClick={(e) => e.stopPropagation()}
       >
          {/* Modal Header */}
          <div className="p-6 border-b border-gray-100 dark:border-stone-800 flex justify-between items-start bg-gray-50 dark:bg-stone-950">
             <div className="flex items-center gap-4">
                <div className="text-5xl shadow-sm rounded-2xl bg-white dark:bg-stone-800 w-20 h-20 flex items-center justify-center">
                   {plan.flag || '🌐'}
                </div>
                <div>
                   <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{plan.country}</h2>
                   <p className="text-gray-500 dark:text-gray-400 font-medium">{plan.data} • {plan.validity}</p>
                </div>
             </div>
             <button 
               onClick={onClose} 
               aria-label="Close modal"
               title="Close"
               className="p-2 rounded-full bg-white dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors"
             >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
             </button>
          </div>

          {/* Modal Tabs */}
          <div className="flex border-b border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900">
             {[
               { id: 'overview', label: 'Overview' },
               { id: 'coverage', label: 'Network & Coverage' },
               { id: 'reviews', label: 'Reviews' },
             ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 aria-label={`View ${tab.label} tab`}
                 title={tab.label}
                 className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-pars-cta text-pars-cta bg-orange-50/50 dark:bg-stone-800' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
               >
                 {tab.label}
               </button>
             ))}
          </div>

          {/* Modal Content */}
          <div className="p-6 md:p-8 overflow-y-auto flex-grow bg-white dark:bg-stone-900">
             {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                   <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Plan Details</h3>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {plan.description || "Enjoy high-speed connectivity with this premium plan. Perfect for travelers who need reliable internet access without roaming fees."}
                      </p>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-xl">
                         <div className="text-xs font-bold text-gray-400 uppercase mb-1">Data</div>
                         <div className="text-xl font-bold text-gray-900 dark:text-white">{plan.data}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-xl">
                         <div className="text-xs font-bold text-gray-400 uppercase mb-1">Validity</div>
                         <div className="text-xl font-bold text-gray-900 dark:text-white">{plan.validity}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-xl">
                         <div className="text-xs font-bold text-gray-400 uppercase mb-1">Type</div>
                         <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{plan.type === 'esim' ? 'Data Only' : plan.type}</div>
                      </div>
                      <div className="bg-gray-50 dark:bg-stone-800 p-4 rounded-xl">
                         <div className="text-xs font-bold text-gray-400 uppercase mb-1">Top-Up</div>
                         <div className="text-xl font-bold text-gray-900 dark:text-white">Supported</div>
                      </div>
                   </div>

                   <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-blue-800 dark:text-blue-300">
                      <Info className="h-5 w-5 shrink-0 mt-0.5" />
                      <p className="text-sm">Activation Policy: The validity period starts when the eSIM connects to any supported network/s.</p>
                   </div>
                </div>
             )}

             {activeTab === 'coverage' && (
                <div className="space-y-6 animate-fade-in">
                   {plan.type === 'esim' && plan.operators && plan.operators.length > 0 && (
                     <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Network Operators</h3>
                        <div className="space-y-3">
                           {plan.operators.map((op, idx) => (
                             <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 dark:border-stone-800 rounded-xl">
                                <div className="flex items-center gap-3">
                                   <div className="p-2 bg-gray-100 dark:bg-stone-800 rounded-lg">
                                      <Signal className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                                   </div>
                                   <span className="font-bold text-gray-900 dark:text-white">{op?.name || 'Unknown Network'}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${op?.type === '5G' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                   {op?.type || 'LTE'}
                                </span>
                             </div>
                           ))}
                        </div>
                     </div>
                   )}

                   {plan.coveredCountries && plan.coveredCountries.length > 0 && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Covered Countries</h3>
                        <div className="flex flex-wrap gap-2">
                           {plan.coveredCountries.map((c, idx) => (
                              <span key={idx} className="px-3 py-1.5 bg-gray-100 dark:bg-stone-800 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-medium">
                                 {c}
                              </span>
                           ))}
                        </div>
                      </div>
                   )}
                </div>
             )}

             {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                   <div className="flex items-center gap-4 mb-6">
                      <div className="text-4xl font-extrabold text-gray-900 dark:text-white">4.8</div>
                      <div>
                         <div className="flex text-amber-400 mb-1">
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                            <Star className="h-4 w-4 fill-current" />
                         </div>
                         <p className="text-sm text-gray-500 dark:text-gray-400">Based on customer reviews</p>
                      </div>
                   </div>

                   <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <p>Reviews feature coming soon. Check back later for customer feedback!</p>
                   </div>
                </div>
             )}
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex justify-between items-center">
             <div>
                <span className="text-3xl font-extrabold text-pars-cta">${plan.price.toFixed(2)}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">USD</span>
             </div>
             <button 
               onClick={onBuy}
               aria-label="Buy this plan"
               title="Buy plan"
               className="bg-pars-cta text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg flex items-center gap-2 transform hover:-translate-y-0.5"
             >
                Add to Cart <ArrowRight className="h-5 w-5" />
             </button>
          </div>
       </div>
    </div>
    </>
  );
};

export default Marketplace;