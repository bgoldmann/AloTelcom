import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Signal, Download, Calendar, Wifi, Plus, ChevronDown, ChevronUp, Smartphone, Settings, CheckCircle2, HelpCircle, AlertCircle, Globe, Phone, Shield, Mic, Activity } from 'lucide-react';
import { useApp } from '../store';
import { Plan } from '../types';

const Dashboard: React.FC = () => {
  const { orders, user } = useApp();
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android'>('ios');
  
  // FAQ State
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "When should I install my eSIM?",
      answer: "You can install your eSIM anytime, but we recommend doing it a day before your trip. However, only activate the line (turn on roaming) when you arrive at your destination to start your validity period."
    },
    {
      question: "How do I use my Virtual Number?",
      answer: "Your virtual number is active immediately. You can use our app to make calls or configure call forwarding to your primary number in the settings."
    },
    {
      question: "Is VPN automatically enabled?",
      answer: "No, you need to download our VPN configuration profile or use the app's 'Connect' toggle on the VPN plan card to secure your connection."
    }
  ];

  const iosSteps = [
    { title: "Go to Settings", description: "Open your iPhone Settings and tap on 'Cellular' or 'Mobile Data'." },
    { title: "Add eSIM", description: "Tap 'Add eSIM' or 'Add Cellular Plan'." },
    { title: "Scan QR Code", description: "Select 'Use QR Code' and scan the code from your order details above." },
    { title: "Label & Setup", description: "Label the plan (e.g., 'Travel'). Set it for 'Cellular Data' only. Keep your primary line for Voice/SMS." },
    { title: "Enable Roaming", description: "When you arrive at your destination, go to Settings > Cellular, select this eSIM, and turn 'Data Roaming' ON." }
  ];

  const androidSteps = [
    { title: "Go to Settings", description: "Open Settings > Connections > SIM Manager (Samsung) or Network & Internet (Pixel)." },
    { title: "Add Mobile Plan", description: "Tap 'Add Mobile Plan', 'Add eSIM', or 'Download a SIM instead'." },
    { title: "Scan QR Code", description: "Scan the QR code from your order details above." },
    { title: "Confirm & Install", description: "Tap 'Download' to install the profile. This may take a few minutes." },
    { title: "Enable Roaming", description: "Set this eSIM for 'Mobile Data'. When you arrive, go to the eSIM settings and ensure 'Roaming' is switched ON." }
  ];

  const steps = platform === 'ios' ? iosSteps : androidSteps;

  const getPlanIcon = (type: Plan['type']) => {
    switch(type) {
      case 'number': return <Phone className="h-3 w-3" />;
      case 'vpn': return <Shield className="h-3 w-3" />;
      case 'voip': return <Mic className="h-3 w-3" />;
      default: return <Signal className="h-3 w-3" />;
    }
  };

  const getPlanLabel = (type: Plan['type']) => {
     switch(type) {
        case 'number': return 'Virtual Number';
        case 'vpn': return 'Secure VPN';
        case 'voip': return 'Voice Plan';
        default: return 'Data Plan';
     }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-pars-bg dark:bg-stone-950 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl text-center max-w-sm w-full animate-scale-up border border-transparent dark:border-stone-800">
          <div className="w-16 h-16 bg-orange-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
             <Smartphone className="h-8 w-8 text-pars-cta" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-pars-primary dark:text-white">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Please log in to view your plans.</p>
          <Link to="/" className="block w-full py-3 bg-pars-cta text-white rounded-xl font-bold hover:bg-orange-700 transition">Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pars-bg dark:bg-stone-950 py-8 animate-fade-in transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
              <h1 className="text-3xl font-extrabold text-pars-primary dark:text-white">My Dashboard</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your services and connectivity.</p>
           </div>
           <Link 
             to="/marketplace" 
             className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-full shadow-lg text-sm font-bold text-white bg-pars-cta hover:bg-orange-700 focus:outline-none transform hover:-translate-y-0.5 transition-all"
           >
             <Plus className="-ml-1 mr-2 h-5 w-5" />
             Add Service
           </Link>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-orange-50 dark:bg-stone-800 rounded-lg text-pars-cta"><Activity className="h-4 w-4" /></div>
               <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Active Services</div>
             </div>
             <div className="text-3xl font-extrabold text-pars-primary dark:text-white">{orders.filter(o => o.status === 'active').length}</div>
             <div className="text-xs text-green-500 mt-1 font-medium bg-green-50 dark:bg-green-900/20 inline-block px-2 py-0.5 rounded-full">Running</div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-purple-50 dark:bg-stone-800 rounded-lg text-purple-600 dark:text-purple-400"><Wifi className="h-4 w-4" /></div>
               <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Data Used</div>
             </div>
             <div className="text-3xl font-extrabold text-pars-primary dark:text-white">1.2 GB</div>
             <div className="text-xs text-gray-400 mt-1">Total this month</div>
          </div>
          <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 hover:shadow-md transition-all duration-300">
             <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-amber-50 dark:bg-stone-800 rounded-lg text-amber-500"><Phone className="h-4 w-4" /></div>
               <div className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wide">Voice Mins</div>
             </div>
             <div className="text-3xl font-extrabold text-pars-primary dark:text-white">45</div>
             <div className="text-xs text-gray-400 mt-1">Remaining</div>
          </div>
        </div>

        {/* Service List */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          Your Services <span className="bg-pars-primary dark:bg-stone-700 text-white text-xs px-2 py-0.5 rounded-full">{orders.length}</span>
        </h2>
        
        <div className="space-y-6 mb-12">
          {orders.map((order, idx) => (
            <div 
              key={order.id} 
              className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden animate-fade-in-up transition-colors duration-300"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className="p-6 md:flex md:items-center md:justify-between">
                
                {/* Plan Info */}
                <div className="flex items-center gap-5 mb-6 md:mb-0">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-stone-800 flex items-center justify-center text-5xl shadow-md border border-gray-100 dark:border-stone-700">
                      {order.plan.flag}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white dark:border-stone-900">
                      ACTIVE
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       {order.plan.country}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400 mt-2">
                       <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-stone-800 px-2 py-1 rounded-lg">
                          {getPlanIcon(order.plan.type)} {order.plan.data}
                       </span>
                       <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-stone-800 px-2 py-1 rounded-lg">
                          <Calendar className="h-3 w-3" /> {order.plan.validity}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Status / Usage */}
                <div className="flex-1 md:mx-12 mb-6 md:mb-0">
                  {order.plan.type === 'esim' ? (
                    <>
                      <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                        <span>Data Usage</span>
                        <span className="text-pars-cta">1.2 GB / {order.plan.data}</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-stone-800 rounded-full h-3">
                        <div className="bg-gradient-to-r from-pars-cta to-amber-500 h-3 rounded-full w-[40%] shadow-sm relative"></div>
                      </div>
                    </>
                  ) : order.plan.type === 'vpn' ? (
                     <div className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                        <div className="p-2 bg-green-200 dark:bg-green-800 rounded-full animate-pulse"><Shield className="h-5 w-5 text-green-700 dark:text-green-300" /></div>
                        <div>
                           <div className="text-sm font-bold text-green-800 dark:text-green-300">Protected</div>
                           <div className="text-xs text-green-600 dark:text-green-400">Location: {order.plan.country}</div>
                        </div>
                     </div>
                  ) : (
                     <div className="flex items-center gap-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                        <div className="p-2 bg-blue-200 dark:bg-blue-800 rounded-full"><Phone className="h-5 w-5 text-blue-700 dark:text-blue-300" /></div>
                        <div>
                           <div className="text-sm font-bold text-blue-800 dark:text-blue-300">Ready to Call</div>
                           <div className="text-xs text-blue-600 dark:text-blue-400">{order.plan.data}</div>
                        </div>
                     </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                   {order.plan.type === 'esim' && (
                     <button className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-gray-100 dark:border-stone-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:border-pars-cta hover:text-pars-cta dark:hover:text-white bg-white dark:bg-stone-800 transition-all">
                        <QrCode className="h-4 w-4" /> QR Code
                     </button>
                   )}
                   <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-pars-cta text-white rounded-xl text-sm font-bold hover:bg-orange-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5">
                      {order.plan.type === 'esim' ? 'Top Up' : 'Manage'}
                   </button>
                </div>
              </div>
              
              {/* Expandable Install Guide Hint (Only for eSIM) */}
              {order.plan.type === 'esim' && (
                <div className="bg-orange-50/50 dark:bg-stone-800/50 px-6 py-4 border-t border-orange-100 dark:border-stone-800 flex items-center justify-between">
                   <div className="flex items-center gap-2 text-sm text-orange-900 dark:text-orange-300">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">Installation Pending?</span>
                   </div>
                   <button 
                     onClick={() => setIsGuideOpen(true)}
                     className="text-pars-cta text-sm font-bold hover:underline flex items-center gap-1"
                   >
                     View Guide <ChevronDown className="h-3 w-3" />
                   </button>
                </div>
              )}
            </div>
          ))}

          {orders.length === 0 && (
             /* Empty State code ... same as before but adjusted for generic "services" */
            <div className="text-center py-24 bg-white dark:bg-stone-900 rounded-3xl border border-gray-100 dark:border-stone-800 border-dashed animate-fade-in-up">
               <div className="w-24 h-24 bg-gray-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-soft">
                  <Globe className="h-10 w-10 text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white">No active services</h3>
               <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Get connected with eSIM, VPN, or a Virtual Number.</p>
               <div className="mt-8">
                 <Link
                   to="/marketplace"
                   className="inline-flex items-center px-8 py-3.5 border border-transparent shadow-lg text-sm font-bold rounded-full text-white bg-pars-cta hover:bg-orange-700 focus:outline-none transition-all transform hover:-translate-y-1"
                 >
                   <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                   Explore Store
                 </Link>
               </div>
            </div>
          )}
        </div>

        {/* Installation Guide & FAQ sections remain similar, 
            but could be hidden or adjusted if non-eSIM products are primary.
            For now, keeping them as they are useful for the main product. */}
        {orders.some(o => o.plan.type === 'esim') && (
           <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden mb-8 transition-colors duration-300" id="install-guide">
            <button 
              onClick={() => setIsGuideOpen(!isGuideOpen)}
              className="w-full px-6 py-6 flex items-center justify-between bg-white dark:bg-stone-900 hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors group"
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${isGuideOpen ? 'bg-pars-primary dark:bg-white text-white dark:text-pars-primary scale-110 shadow-lg' : 'bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-gray-400'}`}>
                  <Smartphone className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-pars-cta transition-colors">eSIM Installation Guide</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Step-by-step instructions for {platform === 'ios' ? 'iPhone' : 'Android'}</p>
                </div>
              </div>
              <div className={`w-8 h-8 rounded-full border border-gray-200 dark:border-stone-700 flex items-center justify-center transition-transform duration-300 ${isGuideOpen ? 'rotate-180 bg-gray-100 dark:bg-stone-800' : ''}`}>
                 <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>
  
            {isGuideOpen && (
              <div className="p-8 border-t border-gray-100 dark:border-stone-800 animate-fade-in">
                {/* Platform Toggle */}
                <div className="flex justify-center mb-12">
                  <div className="bg-gray-100 dark:bg-stone-800 p-1.5 rounded-2xl inline-flex shadow-inner">
                    <button
                      onClick={() => setPlatform('ios')}
                      className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        platform === 'ios' 
                          ? 'bg-white dark:bg-stone-700 text-pars-primary dark:text-white shadow-md transform scale-105' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      iOS (iPhone)
                    </button>
                    <button
                      onClick={() => setPlatform('android')}
                      className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        platform === 'android' 
                          ? 'bg-white dark:bg-stone-700 text-pars-primary dark:text-white shadow-md transform scale-105' 
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                      }`}
                    >
                      Android
                    </button>
                  </div>
                </div>
  
                <div className="max-w-3xl mx-auto">
                   <div className="grid gap-8">
                      {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 group">
                           <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white dark:bg-stone-800 border-2 border-pars-primary dark:border-gray-500 text-pars-primary dark:text-gray-300 font-bold flex items-center justify-center shadow-sm group-hover:bg-pars-primary group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-pars-primary transition-colors">
                             {index + 1}
                           </div>
                           <div className="pt-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                {step.title}
                              </h3>
                              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                                {step.description}
                              </p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-gray-100 dark:border-stone-800 overflow-hidden transition-colors duration-300">
          <button
            onClick={() => setIsFaqOpen(!isFaqOpen)}
            className="w-full px-6 py-6 flex items-center justify-between bg-white dark:bg-stone-900 hover:bg-gray-50 dark:hover:bg-stone-800 transition-colors group"
          >
             <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl transition-all duration-300 ${isFaqOpen ? 'bg-pars-primary dark:bg-white text-white dark:text-pars-primary scale-110 shadow-lg' : 'bg-gray-100 dark:bg-stone-800 text-gray-500 dark:text-gray-400'}`}>
                  <HelpCircle className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-pars-cta transition-colors">Help & Support</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">FAQs and Troubleshooting</p>
                </div>
             </div>
             <div className={`w-8 h-8 rounded-full border border-gray-200 dark:border-stone-700 flex items-center justify-center transition-transform duration-300 ${isFaqOpen ? 'rotate-180 bg-gray-100 dark:bg-stone-800' : ''}`}>
               <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </button>

          {isFaqOpen && (
            <div className="p-6 border-t border-gray-100 dark:border-stone-800 animate-fade-in bg-gray-50/50 dark:bg-stone-950/50">
              <div className="space-y-4 max-w-3xl mx-auto">
                {faqs.map((faq, index) => (
                   <div key={index} className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-200 dark:border-stone-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <button
                       onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                       className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-stone-700 transition-colors"
                     >
                       <span className="font-bold text-gray-900 dark:text-white">{faq.question}</span>
                       <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                     </button>
                     <div 
                       className={`px-6 text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${openFaqIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                     >
                         {faq.answer}
                     </div>
                   </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;