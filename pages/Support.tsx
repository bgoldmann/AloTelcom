import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, ChevronDown, Send, Search } from 'lucide-react';

const Support: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    { q: "How do I install my eSIM?", a: "After purchase, you will receive a QR code via email and in your dashboard. Go to Settings > Cellular > Add eSIM on your device and scan the code. Ensure you have a stable internet connection during installation." },
    { q: "Can I keep my WhatsApp number?", a: "Yes! Your WhatsApp number remains linked to your original phone number, even when using an eSIM for data. You don't need to change any settings in WhatsApp." },
    { q: "Do you offer refunds?", a: "We offer refunds if the eSIM has not been installed or if there is a verified technical issue that our support team cannot resolve. Please contact us within 30 days of purchase." },
    { q: "Is my device compatible?", a: "Most iPhones from XR/XS onwards and newer Android devices (Pixel 3+, Samsung S20+) are eSIM compatible. Please check your device settings or manufacturer specifications to be sure." },
    { q: "Do I need to turn on Data Roaming?", a: "Yes, you must enable 'Data Roaming' for the AloTelcom eSIM line in your settings for the internet to work. Ensure your primary line's roaming is OFF to avoid carrier charges." },
  ];

  return (
    <div className="bg-pars-bg min-h-screen py-12">
       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
             <h1 className="text-4xl font-bold text-pars-primary mb-4">How can we help?</h1>
             <p className="text-gray-500 text-lg">Search our knowledge base or get in touch with our team.</p>
             
             {/* Search Bar */}
             <div className="max-w-xl mx-auto mt-8 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input 
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-full shadow-lg focus:ring-2 focus:ring-pars-cta/50 outline-none transition"
                  placeholder="Type your question..."
                />
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Contact Info */}
             <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-xl mb-6">Contact Support</h3>
                   <ul className="space-y-4">
                      <li className="flex items-center gap-3 text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                         <div className="bg-orange-50 p-2.5 rounded-lg text-pars-cta"><Mail className="h-5 w-5" /></div>
                         <div className="flex-1">
                            <span className="block text-xs text-gray-400 font-bold uppercase">Email Us</span>
                            <span className="font-medium text-gray-900">support@alotelcom.com</span>
                         </div>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                         <div className="bg-blue-50 p-2.5 rounded-lg text-blue-600"><MessageSquare className="h-5 w-5" /></div>
                         <div className="flex-1">
                            <span className="block text-xs text-gray-400 font-bold uppercase">Live Chat</span>
                            <span className="font-medium text-gray-900">Available 24/7</span>
                         </div>
                      </li>
                      <li className="flex items-center gap-3 text-gray-600 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                         <div className="bg-green-50 p-2.5 rounded-lg text-green-600"><Phone className="h-5 w-5" /></div>
                         <div className="flex-1">
                            <span className="block text-xs text-gray-400 font-bold uppercase">Phone</span>
                            <span className="font-medium text-gray-900">+1 (800) 123-4567</span>
                         </div>
                      </li>
                   </ul>
                </div>
                
                <div className="bg-gradient-to-br from-pars-primary to-gray-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="font-bold text-lg mb-2">Technical Issue?</h3>
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed">Please include your Order ID and Device Model in your message for faster resolution.</p>
                   </div>
                   <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                      <MessageSquare className="h-32 w-32" />
                   </div>
                </div>
             </div>

             {/* FAQs & Form */}
             <div className="lg:col-span-2 space-y-8">
                {/* FAQs */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-8 border-b border-gray-100">
                      <h3 className="font-bold text-xl text-pars-primary">Frequently Asked Questions</h3>
                   </div>
                   <div className="divide-y divide-gray-100">
                      {faqs.map((faq, i) => (
                         <div key={i} className="bg-white">
                            <button 
                              onClick={() => setOpenFaq(openFaq === i ? null : i)}
                              className="w-full px-8 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition"
                            >
                               <span className="font-bold text-gray-900">{faq.q}</span>
                               <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`px-8 text-gray-600 text-sm leading-relaxed transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                               {faq.a}
                            </div>
                         </div>
                      ))}
                   </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
                   <h3 className="font-bold text-xl mb-6 text-pars-primary">Send us a message</h3>
                   <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                            <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" placeholder="Your Name" />
                         </div>
                         <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                            <input type="email" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" placeholder="name@example.com" />
                         </div>
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                         <input type="text" className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" placeholder="How can we help?" />
                      </div>
                      <div>
                         <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                         <textarea rows={4} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pars-cta outline-none transition" placeholder="Describe your issue..."></textarea>
                      </div>
                      <button className="bg-pars-cta text-white font-bold py-4 px-10 rounded-xl hover:bg-orange-700 transition flex items-center gap-2 shadow-lg transform hover:-translate-y-0.5">
                         Send Message <Send className="h-4 w-4" />
                      </button>
                   </form>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
export default Support;