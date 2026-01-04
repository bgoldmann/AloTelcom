import React, { useState, useEffect } from 'react';
import { SEO } from '../lib/seo';
import { BreadcrumbSchemaScript } from '../lib/schema';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Zap, Globe, Signal, ChevronLeft, Map, Phone, Shield, Mic, CheckCircle, ArrowRight, Info, Star, Share2, Wifi } from 'lucide-react';
import { Plan, Review } from '../types';
import { useApp } from '../store';

// --- MOCK DATA GENERATORS ---

const MOCK_REVIEWS: Review[] = [
  { id: '1', user: 'Alex M.', rating: 5, comment: 'Worked perfectly immediately after landing.', date: '2 days ago' },
  { id: '2', user: 'Sarah J.', rating: 4, comment: 'Good speeds, slightly tricky setup on Android but support helped.', date: '1 week ago' },
  { id: '3', user: 'David K.', rating: 5, comment: 'Much cheaper than roaming. Will use again.', date: '2 weeks ago' },
];

const generateLocalPlans = (): Plan[] => {
  const countries = [
    { name: 'United States', flag: '🇺🇸', region: 'Americas', id: 'us', networks: [{name: 'AT&T', type: '5G'}, {name: 'T-Mobile', type: '5G'}] },
    { name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', id: 'uk', networks: [{name: 'Vodafone', type: '5G'}, {name: 'O2', type: '4G'}] },
    { name: 'Turkey', flag: '🇹🇷', region: 'Middle East', id: 'tr', networks: [{name: 'Turkcell', type: 'LTE'}, {name: 'Vodafone TR', type: '4G'}] },
    { name: 'France', flag: '🇫🇷', region: 'Europe', id: 'fr', networks: [{name: 'Orange', type: '5G'}, {name: 'SFR', type: 'LTE'}] },
    { name: 'Germany', flag: '🇩🇪', region: 'Europe', id: 'de', networks: [{name: 'Telekom', type: '5G'}, {name: 'O2', type: 'LTE'}] },
    { name: 'Japan', flag: '🇯🇵', region: 'Asia', id: 'jp', networks: [{name: 'SoftBank', type: 'LTE'}, {name: 'KDDI', type: '5G'}] },
    { name: 'Italy', flag: '🇮🇹', region: 'Europe', id: 'it', networks: [{name: 'TIM', type: '5G'}, {name: 'Vodafone', type: '4G'}] },
    { name: 'Spain', flag: '🇪🇸', region: 'Europe', id: 'es', networks: [{name: 'Movistar', type: '5G'}, {name: 'Orange', type: 'LTE'}] },
    { name: 'Canada', flag: '🇨🇦', region: 'Americas', id: 'ca', networks: [{name: 'Rogers', type: '5G'}, {name: 'Bell', type: 'LTE'}] },
    { name: 'Thailand', flag: '🇹🇭', region: 'Asia', id: 'th', networks: [{name: 'AIS', type: '5G'}, {name: 'DTAC', type: 'LTE'}] },
  ];

  const plans: Plan[] = [];
  countries.forEach(c => {
    const baseFields = {
      country: c.name,
      region: c.region,
      flag: c.flag,
      type: 'esim' as const,
      operators: c.networks as any[],
      reviews: MOCK_REVIEWS,
      description: `Stay connected in ${c.name} with high-speed data. Ideal for tourists and business travelers.`,
      coveredCountries: [c.name]
    };

    plans.push(
      { ...baseFields, id: `${c.id}-1gb`, data: '1GB', validity: '7 Days', price: 4.50 },
      { ...baseFields, id: `${c.id}-3gb`, data: '3GB', validity: '30 Days', price: 10.00, isPopular: true },
      { ...baseFields, id: `${c.id}-10gb`, data: '10GB', validity: '30 Days', price: 25.00 }
    );
  });
  return plans;
};

const generateRegionalPlans = (): Plan[] => {
  const regions = [
    { name: 'Eurolink', country: 'Europe', flag: '🇪🇺', id: 'eu', coverage: ['France', 'Germany', 'Italy', 'Spain', 'UK', '+30 others'] },
    { name: 'Asialink', country: 'Asia', flag: '🌏', id: 'as', coverage: ['Japan', 'Thailand', 'Singapore', 'China', 'Korea', '+10 others'] },
    { name: 'Latamlink', country: 'Latin America', flag: '🌎', id: 'la', coverage: ['Brazil', 'Mexico', 'Argentina', 'Chile', 'Peru', '+8 others'] },
    { name: 'Menalink', country: 'Middle East & North Africa', flag: '🌍', id: 'me', coverage: ['Turkey', 'UAE', 'Saudi Arabia', 'Egypt', 'Qatar'] },
  ];
  const plans: Plan[] = [];
  regions.forEach(r => {
    const baseFields = {
      country: r.country,
      region: r.name,
      flag: r.flag,
      type: 'esim' as const,
      operators: [{name: 'Multi-Network', type: 'LTE'}] as any[],
      reviews: MOCK_REVIEWS,
      description: `Access internet across multiple countries in ${r.country} with a single eSIM.`,
      coveredCountries: r.coverage
    };
    plans.push(
      { ...baseFields, id: `${r.id}-1gb`, data: '1GB', validity: '7 Days', price: 5.00 },
      { ...baseFields, id: `${r.id}-10gb`, data: '10GB', validity: '30 Days', price: 30.00 }
    );
  });
  return plans;
};

const generateGlobalPlans = (): Plan[] => {
   return [
      { 
        id: 'global-1gb', type: 'esim', country: '84 Countries', region: 'Global', data: '1GB', validity: '7 Days', price: 9.00, flag: '🌐',
        description: 'The ultimate travel companion. Works in 84+ countries worldwide.',
        operators: [{name: 'Global Partner Networks', type: 'LTE'}],
        reviews: MOCK_REVIEWS,
        coveredCountries: ['USA', 'UK', 'EU', 'Japan', 'Australia', 'Canada', '...and 78 more']
      },
      { 
        id: 'global-10gb', type: 'esim', country: '84 Countries', region: 'Global', data: '10GB', validity: '60 Days', price: 59.00, flag: '🌐',
        description: 'The ultimate travel companion. Works in 84+ countries worldwide.',
        operators: [{name: 'Global Partner Networks', type: 'LTE'}],
        reviews: MOCK_REVIEWS,
        coveredCountries: ['USA', 'UK', 'EU', 'Japan', 'Australia', 'Canada', '...and 78 more']
      },
   ];
};

const generateNumberPlans = (): Plan[] => {
  return [
    { id: 'num-us', type: 'number', country: 'United States', region: 'Americas', data: '+1 (Voice/SMS)', validity: '30 Days', price: 5.00, flag: '🇺🇸', features: ['Receive SMS', 'Voicemail', 'Call Forwarding'], description: 'Get a real US phone number for verification and calls.' },
    { id: 'num-uk', type: 'number', country: 'United Kingdom', region: 'Europe', data: '+44 (Voice/SMS)', validity: '30 Days', price: 6.50, flag: '🇬🇧', features: ['Receive SMS', 'Voicemail'], description: 'UK Mobile number (+44) compatible with most services.' },
    { id: 'num-ca', type: 'number', country: 'Canada', region: 'Americas', data: '+1 (Voice/SMS)', validity: '30 Days', price: 5.50, flag: '🇨🇦', features: ['Receive SMS', 'Voicemail'], description: 'Canadian virtual number for privacy and travel.' },
    { id: 'num-au', type: 'number', country: 'Australia', region: 'Oceania', data: '+61 (Voice/SMS)', validity: '30 Days', price: 7.00, flag: '🇦🇺', features: ['Receive SMS', 'Voicemail'], description: 'Australian mobile number.' },
  ];
};

const generateVpnPlans = (): Plan[] => {
  return [
    { id: 'vpn-basic', type: 'vpn', country: 'Global Servers', region: 'Global', data: 'Standard Speed', validity: '1 Month', price: 3.99, flag: '🛡️', features: ['3 Devices', '20+ Locations', 'No Logs'], isPopular: false, description: 'Basic protection for casual browsing.' },
    { id: 'vpn-pro', type: 'vpn', country: 'Global Servers', region: 'Global', data: 'High Speed', validity: '1 Month', price: 7.99, flag: '🛡️', features: ['Unlimited Devices', '100+ Locations', 'Ad Blocker', 'Streaming Optimized'], isPopular: true, description: 'Complete security suite for power users.' },
    { id: 'vpn-year', type: 'vpn', country: 'Global Servers', region: 'Global', data: 'High Speed', validity: '1 Year', price: 49.99, flag: '🛡️', features: ['Unlimited Devices', '100+ Locations', 'Ad Blocker', '2 Months Free'], description: 'Best value for long-term protection.' },
  ];
};

const generateVoipPlans = (): Plan[] => {
  return [
    { id: 'voip-100', type: 'voip', country: 'World Credits', region: 'Global', data: '100 Minutes', validity: 'No Expiry', price: 5.00, flag: '📞', features: ['Call Landlines', 'Call Mobiles', 'Crystal Clear Audio'], description: 'Call any phone in the world over the internet.' },
    { id: 'voip-500', type: 'voip', country: 'World Credits', region: 'Global', data: '500 Minutes', validity: 'No Expiry', price: 20.00, flag: '📞', features: ['Call Landlines', 'Call Mobiles', 'Best Value'], isPopular: true, description: 'Bulk credits for frequent callers.' },
    { id: 'voip-unl-us', type: 'voip', country: 'USA Calling', region: 'Americas', data: 'Unlimited', validity: '30 Days', price: 12.00, flag: '🇺🇸', features: ['Calls to USA/Canada', 'Fair Usage Apply'], description: 'Unlimited calls to +1 numbers.' },
  ];
};

const LOCAL_PLANS = generateLocalPlans();
const REGIONAL_PLANS = generateRegionalPlans();
const GLOBAL_PLANS = generateGlobalPlans();
const NUMBER_PLANS = generateNumberPlans();
const VPN_PLANS = generateVpnPlans();
const VOIP_PLANS = generateVoipPlans();

type Category = 'esim' | 'number' | 'vpn' | 'voip';
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
  
  // Selection State (Master-Detail for eSIM)
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  
  // Modal State
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<Plan | null>(null);

  useEffect(() => {
    if (initialSearch) {
       // Search logic to auto-switch tabs
       const inNumbers = NUMBER_PLANS.some(p => p.country.toLowerCase().includes(initialSearch.toLowerCase()));
       if (inNumbers) { setActiveCategory('number'); return; }

       const inVpn = VPN_PLANS.some(p => p.data.toLowerCase().includes(initialSearch.toLowerCase()));
       if (inVpn) { setActiveCategory('vpn'); return; }

       const inLocal = LOCAL_PLANS.some(p => p.country.toLowerCase().includes(initialSearch.toLowerCase()));
       if (inLocal) { setActiveCategory('esim'); setEsimTab('local'); return; }

       const inRegional = REGIONAL_PLANS.some(p => p.region.toLowerCase().includes(initialSearch.toLowerCase()));
       if (inRegional) { setActiveCategory('esim'); setEsimTab('regional'); return; }
    }
  }, [initialSearch]);

  const getDisplayedPlans = () => {
    let source: Plan[] = [];
    if (activeCategory === 'esim') {
      source = esimTab === 'local' ? LOCAL_PLANS : esimTab === 'regional' ? REGIONAL_PLANS : GLOBAL_PLANS;
    } else if (activeCategory === 'number') {
      source = NUMBER_PLANS;
    } else if (activeCategory === 'vpn') {
      source = VPN_PLANS;
    } else if (activeCategory === 'voip') {
      source = VOIP_PLANS;
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      source = source.filter(p => 
        p.country.toLowerCase().includes(lower) || 
        p.region.toLowerCase().includes(lower) ||
        p.data.toLowerCase().includes(lower)
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
                  placeholder={activeCategory === 'esim' ? "Search countries..." : "Search plans..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="h-4 w-4" /></button>
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
                     style={{
                       left: esimTab === 'local' ? '6px' : esimTab === 'regional' ? '33.33%' : '66.66%',
                       width: 'calc(33.33% - 4px)',
                       transform: esimTab === 'regional' ? 'translateX(2px)' : esimTab === 'global' ? 'translateX(-2px)' : 'none'
                     }}
                   ></div>
                   {(['local', 'regional', 'global'] as const).map(tab => (
                     <button
                       key={tab}
                       onClick={() => { setEsimTab(tab); setSelectedCountryName(null); }}
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
                      style={{ animationDelay: `${idx * 30}ms` }}
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
          /* VPN, Numbers, VOIP Layout */
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
    </div>
  );
};

// Reusable Plan Card Component
const PlanCard: React.FC<{ plan: Plan, onDetails: () => void, delay: number }> = ({ plan, onDetails, delay }) => {
  return (
    <div 
      onClick={onDetails}
      className="bg-white dark:bg-stone-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-stone-800 hover:shadow-2xl hover:border-orange-100 dark:hover:border-stone-700 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group h-full flex flex-col cursor-pointer"
      style={{ animationDelay: `${delay * 50}ms` }}
    >
        {plan.isPopular && (
          <div className="absolute top-0 right-0 bg-gradient-to-r from-pars-accent to-orange-400 text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl shadow-sm z-10 uppercase tracking-wider">
            Best Value
          </div>
        )}
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
             {plan.type !== 'esim' && <span className="text-4xl">{plan.flag}</span>}
             <div>
               <div className="text-2xl font-extrabold text-pars-primary dark:text-white mb-1 tracking-tight">
                 {plan.data}
               </div>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                 {plan.type === 'number' ? 'Phone Number' : plan.type === 'vpn' ? 'Security Plan' : plan.type === 'voip' ? 'Credits' : 'Data Allowance'}
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
          onClick={(e) => { e.stopPropagation(); onDetails(); }}
          className="w-full py-4 bg-gray-100 dark:bg-stone-800 text-pars-primary dark:text-white font-bold rounded-2xl hover:bg-pars-cta hover:text-white transition-all shadow-sm flex items-center justify-center gap-2 group-hover:scale-[1.02] transform duration-200"
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
                   {plan.flag}
                </div>
                <div>
                   <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{plan.country}</h2>
                   <p className="text-gray-500 dark:text-gray-400 font-medium">{plan.data} • {plan.validity}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 rounded-full bg-white dark:bg-stone-800 hover:bg-gray-200 dark:hover:bg-stone-700 transition-colors">
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
                                   <span className="font-bold text-gray-900 dark:text-white">{op.name}</span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${op.type === '5G' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                   {op.type}
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
                         <p className="text-sm text-gray-500 dark:text-gray-400">Based on 1,204 reviews</p>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {plan.reviews?.map((review) => (
                         <div key={review.id} className="p-4 bg-gray-50 dark:bg-stone-800 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                               <span className="font-bold text-gray-900 dark:text-white">{review.user}</span>
                               <span className="text-xs text-gray-500 dark:text-gray-400">{review.date}</span>
                            </div>
                            <div className="flex text-amber-400 mb-2">
                               {[...Array(review.rating)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>
                         </div>
                      ))}
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