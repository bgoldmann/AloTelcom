import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Wifi, Shield, Zap, Globe, Smartphone, Check, Star, ArrowRight, Settings, QrCode } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [guidePlatform, setGuidePlatform] = useState<'ios' | 'android'>('ios');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/marketplace?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/marketplace');
    }
  };

  const popularDestinations = [
    { name: 'United States', flag: '🇺🇸', price: '$4.50' },
    { name: 'Japan', flag: '🇯🇵', price: '$6.00' },
    { name: 'Turkey', flag: '🇹🇷', price: '$4.00' },
    { name: 'Europe', flag: '🇪🇺', price: '$5.00' },
    { name: 'United Kingdom', flag: '🇬🇧', price: '$5.00' },
    { name: 'Thailand', flag: '🇹🇭', price: '$4.50' },
  ];

  const reviews = [
    { name: "Sarah Jenkins", role: "Digital Nomad", text: "A lifesaver for my trip to Japan. Activated in seconds and worked perfectly.", img: "https://i.pravatar.cc/100?img=33" },
    { name: "Michael Chen", role: "Business Traveler", text: "I save about $200 per trip compared to my home carrier's roaming fees. Essential.", img: "https://i.pravatar.cc/100?img=11" },
    { name: "Emma Wilson", role: "Backpacker", text: "The regional Europe plan made crossing borders seamless. No swapping SIMs!", img: "https://i.pravatar.cc/100?img=5" },
  ];

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-24 md:pb-32 bg-gradient-to-b from-orange-50/50 to-white dark:from-stone-900/50 dark:to-stone-950 overflow-hidden transition-colors duration-300">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
           <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-200/20 dark:bg-orange-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float opacity-70"></div>
           <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-rose-200/20 dark:bg-rose-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float opacity-70" style={{ animationDelay: '2s' }}></div>
           <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-amber-100/30 dark:bg-amber-500/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl animate-float opacity-50" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 dark:bg-stone-800/50 backdrop-blur-sm border border-white/60 dark:border-stone-700 shadow-sm text-sm font-semibold text-pars-cta mb-8 animate-fade-in hover:scale-105 transition-transform cursor-default">
               <Globe className="h-4 w-4 animate-spin-slow" />
               <span className="tracking-wide uppercase text-xs">Trusted by 1M+ Travelers</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-pars-primary dark:text-white mb-6 leading-[1.1]">
              Global eSIM, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pars-cta to-amber-500">VPN & Voice</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Complete travel connectivity in 190+ countries. Instantly install eSIMs, secure your connection with VPN, and get local numbers.
            </p>
            
            {/* Search Box */}
            <div className="relative max-w-2xl mx-auto mb-16 group z-20">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full opacity-20 group-hover:opacity-40 blur transition duration-500"></div>
              <form onSubmit={handleSearch} className="relative flex items-center bg-white dark:bg-stone-800 rounded-full shadow-2xl p-2 transition-transform duration-300 transform group-hover:-translate-y-1">
                <div className="pl-6 text-pars-cta">
                  <Search className="h-6 w-6" />
                </div>
                <input
                  type="text"
                  placeholder="Where do you need data? (e.g. Japan)"
                  className="flex-grow px-4 py-4 text-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="bg-pars-cta hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-full transition-all duration-300 shadow-md flex items-center gap-2">
                  Search
                </button>
              </form>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-sm font-semibold text-gray-400 dark:text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2 hover:text-pars-cta transition-colors"><Check className="text-green-500 h-5 w-5" /> Instant eSIM</div>
              <div className="flex items-center gap-2 hover:text-pars-cta transition-colors"><Check className="text-green-500 h-5 w-5" /> Secure VPN</div>
              <div className="flex items-center gap-2 hover:text-pars-cta transition-colors"><Check className="text-green-500 h-5 w-5" /> Local Numbers</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-stone-900 border-b border-gray-100 dark:border-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold text-pars-primary dark:text-white">How simple is it?</h2>
             <p className="text-gray-500 dark:text-gray-400 mt-2">Get connected in 3 taps, whether you use iPhone or Android.</p>
          </div>

          <div className="flex justify-center mb-8">
             <div className="bg-gray-100 dark:bg-stone-800 p-1.5 rounded-full inline-flex relative">
                <div 
                   className="absolute top-1.5 bottom-1.5 bg-white dark:bg-stone-700 rounded-full shadow-sm transition-all duration-300 ease-out"
                   style={{
                     left: guidePlatform === 'ios' ? '6px' : '50%',
                     width: 'calc(50% - 4px)'
                   }}
                 ></div>
                 <button 
                   onClick={() => setGuidePlatform('ios')}
                   className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors ${guidePlatform === 'ios' ? 'text-pars-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                 >iPhone</button>
                 <button 
                   onClick={() => setGuidePlatform('android')}
                   className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold transition-colors ${guidePlatform === 'android' ? 'text-pars-primary dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                 >Android</button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
             {/* Step 1 */}
             <div className="bg-pars-bg dark:bg-stone-950 p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-orange-100 dark:hover:border-stone-700">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Smartphone className="h-24 w-24 text-pars-cta" />
                </div>
                <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-pars-cta mb-6">1</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Check Compatibility</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                   {guidePlatform === 'ios' 
                     ? "Go to Settings > General > About. If you see 'EID', your iPhone is eSIM ready." 
                     : "Go to Settings > Connections > SIM Manager. If you see 'Add eSIM', you're good to go."}
                </p>
             </div>

             {/* Step 2 */}
             <div className="bg-pars-bg dark:bg-stone-950 p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-orange-100 dark:hover:border-stone-700">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <QrCode className="h-24 w-24 text-pars-cta" />
                </div>
                <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-pars-cta mb-6">2</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Install eSIM</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                   {guidePlatform === 'ios'
                     ? "Go to Settings > Cellular > Add eSIM. Scan the QR code we send to your email."
                     : "Go to Settings > Connections > SIM Manager > Add Mobile Plan. Scan the QR code."}
                </p>
             </div>

             {/* Step 3 */}
             <div className="bg-pars-bg dark:bg-stone-950 p-8 rounded-3xl relative overflow-hidden group hover:shadow-lg transition-all duration-300 border border-transparent hover:border-orange-100 dark:hover:border-stone-700">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Settings className="h-24 w-24 text-pars-cta" />
                </div>
                <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-xl shadow-sm flex items-center justify-center text-xl font-bold text-pars-cta mb-6">3</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Activate</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                   {guidePlatform === 'ios'
                     ? "In Settings > Cellular, turn on your new line. Enable 'Data Roaming' only when you arrive."
                     : "Tap your new eSIM profile. Toggle it ON. Enable 'Roaming' in settings when you land."}
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Popular Countries Grid */}
      <section className="py-20 bg-white dark:bg-stone-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
             <div>
               <h2 className="text-3xl font-bold text-pars-primary dark:text-white">Popular Destinations</h2>
               <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Travelers are loving these spots right now.</p>
             </div>
             <Link to="/marketplace" className="hidden md:flex items-center text-pars-cta font-bold hover:underline gap-1 group">
               View all 190+ countries <Globe className="h-4 w-4 group-hover:rotate-12 transition-transform" />
             </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularDestinations.map((dest, idx) => (
              <div 
                key={dest.name} 
                className="group cursor-pointer"
                onClick={() => navigate(`/marketplace?search=${dest.name}`)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="bg-white dark:bg-stone-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-stone-700 hover:shadow-xl hover:border-orange-100 dark:hover:border-stone-600 transition-all duration-300 flex flex-col items-center text-center transform group-hover:-translate-y-2 relative overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pars-cta to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="text-5xl mb-4 filter drop-shadow-sm transform transition-transform group-hover:scale-110 duration-300 group-hover:rotate-6">{dest.flag}</span>
                  <h3 className="text-md font-bold text-gray-900 dark:text-white group-hover:text-pars-cta transition-colors">{dest.name}</h3>
                  <p className="text-xs text-gray-400 mt-2 font-medium">from <span className="text-pars-primary dark:text-gray-200">{dest.price}</span></p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/marketplace" className="inline-flex items-center text-pars-cta font-bold">
               View all countries <Globe className="ml-2 h-4 w-4" />
             </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 bg-pars-bg dark:bg-stone-950 relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-pars-primary dark:text-white mb-4">Why use AloTelcom?</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We make staying connected as easy as ordering a coffee.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
             {/* Feature 1 */}
             <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group border border-transparent dark:border-stone-800">
                <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-stone-800 flex items-center justify-center text-pars-cta mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">Instant Activation</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Download your eSIM immediately after purchase. No waiting for shipping, no plastic waste.</p>
             </div>

             {/* Feature 2 */}
             <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group border border-transparent dark:border-stone-800">
                <div className="w-16 h-16 rounded-2xl bg-green-50 dark:bg-stone-800 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                  <Smartphone className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">Easy Installation</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Scan a QR code and you're done. Manage multiple eSIMs directly from our dashboard.</p>
             </div>

             {/* Feature 3 */}
             <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center text-center group border border-transparent dark:border-stone-800">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-stone-800 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300 group-hover:rotate-12">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-pars-primary dark:text-white mb-3">Best Rates & Security</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">Get the fastest speeds, local phone numbers, and secure VPN protection in one app.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="py-24 bg-white dark:bg-stone-900 overflow-hidden transition-colors duration-300">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-pars-primary dark:text-white mb-12">Loved by Travelers</h2>
            <div className="flex flex-col md:flex-row gap-8 overflow-x-auto pb-4 snap-x">
              {reviews.map((review, i) => (
                 <div key={i} className="bg-gradient-to-b from-gray-50 to-white dark:from-stone-800 dark:to-stone-900 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-gray-100 dark:border-stone-700 min-w-[300px] snap-center group hover:border-orange-100 dark:hover:border-stone-600">
                    <div className="flex gap-1 mb-4 group-hover:animate-wiggle">
                       {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-amber-400 fill-current" />)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-6 flex-grow leading-relaxed">"{review.text}"</p>
                    <div className="flex items-center gap-4 mt-auto">
                       <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-stone-700 shadow-md" />
                       <div>
                          <div className="font-bold text-pars-primary dark:text-white">{review.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">{review.role}</div>
                       </div>
                    </div>
                 </div>
              ))}
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-pars-bg dark:bg-stone-950 transition-colors duration-300">
        <div className="absolute inset-0 bg-pars-primary dark:bg-stone-900"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-pars-cta rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">Stop paying roaming fees.</h2>
          <p className="text-orange-100 mb-10 text-xl max-w-2xl mx-auto">Join 1,000,000+ travelers saving money on every trip.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to="/marketplace" className="bg-white text-pars-primary font-bold py-4 px-10 rounded-full hover:bg-gray-100 transition-all shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2">
               Get Your eSIM <ArrowRight className="h-5 w-5" />
             </Link>
          </div>
        </div>
      </section>
      
      {/* Hidden helper */}
      <div className="hidden">
         <div className="flex items-center gap-2 text-white"> <Check /> <Star /> </div>
      </div>
    </div>
  );
};

export default Home;