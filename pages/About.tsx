import React, { useState } from 'react';
import { Globe, Users, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="bg-pars-bg min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
           <div className="inline-block p-2 bg-orange-50 rounded-full mb-4 animate-fade-in">
              <span className="text-pars-cta font-bold text-sm px-2">EST. 2023</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-extrabold text-pars-primary mb-6 animate-fade-in-up">Connecting the World, <br/><span className="text-pars-cta">One eSIM at a Time</span></h1>
           <p className="text-xl text-gray-500 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
             AloTelcom is on a mission to eliminate roaming fees and keep travelers connected wherever they go.
           </p>
        </div>
      </section>

      {/* Story/Mission */}
      <section className="py-16">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 animate-scale-up">
               <h2 className="text-3xl font-bold text-pars-primary mb-6">Our Story</h2>
               <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                  <p>
                    Founded in 2023, AloTelcom was born from a simple frustration: the exorbitant cost of staying connected while traveling. We believe that access to the internet is a fundamental necessity, not a luxury reserved for those willing to pay high roaming charges.
                  </p>
                  <p>
                    We leverage cutting-edge eSIM technology to provide instant, affordable, and secure connectivity in over 190 countries. Whether you are a digital nomad, a business traveler, or a vacationer, we are here to ensure you never lose touch.
                  </p>
                  <p>
                    Today, we've expanded beyond just data. With our integrated VPN and VOIP services, we provide a complete communication suite for the modern traveler.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Stats/Values */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Globe className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold mb-2">Global Reach</h3>
               <p className="text-gray-500">Coverage in 190+ countries and regions, ensuring you're never offline.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
               <div className="w-16 h-16 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Users className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold mb-2">Customer First</h3>
               <p className="text-gray-500">24/7 dedicated support team ready to help you with any connectivity issues.</p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center hover:-translate-y-1 transition-transform duration-300">
               <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <ShieldCheck className="h-8 w-8" />
               </div>
               <h3 className="text-xl font-bold mb-2">Secure & Private</h3>
               <p className="text-gray-500">We prioritize your digital safety with built-in VPN options and strict privacy policies.</p>
            </div>
         </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-pars-primary text-white text-center">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to travel smarter?</h2>
            <Link to="/marketplace" className="inline-flex items-center gap-2 bg-pars-cta hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105">
               Find Your Plan <ArrowRight className="h-5 w-5" />
            </Link>
         </div>
      </section>
    </div>
  );
};
export default About;