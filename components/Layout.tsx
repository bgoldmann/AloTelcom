import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Globe, User, LogOut, ChevronRight, LayoutDashboard, Radio, Sun, Moon, Settings } from 'lucide-react';
import { useApp } from '../store';
import CookieConsent from './CookieConsent';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cart, user, logout, themeMode, toggleTheme } = useApp();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Store', path: '/marketplace' },
    { name: 'Blog', path: '/blog' },
    { name: 'Partners', path: '/partners' },
    { name: 'My eSIMs', path: '/dashboard' },
  ];

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply dark mode class to document
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-pars-primary dark:text-gray-100 bg-pars-bg dark:bg-stone-950 selection:bg-pars-cta selection:text-white transition-colors duration-300">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/90 dark:bg-stone-900/90 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer z-50">
              <Link to="/" className="flex items-center gap-2 group">
                {/* Redesigned Logo Icon */}
                <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${scrolled ? 'bg-pars-cta text-white' : 'bg-white dark:bg-stone-800 text-pars-cta shadow-xl'}`}>
                  <Radio className="h-5 w-5 absolute transform transition-transform duration-500 group-hover:scale-110" />
                  <Globe className="h-3 w-3 absolute bottom-2 right-2 opacity-80" />
                </div>
                {/* Updated Text */}
                <span className={`font-extrabold text-2xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-pars-primary dark:text-white' : 'text-pars-primary dark:text-white'}`}>
                  Alo<span className="text-pars-cta">Telcom</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    location.pathname === link.path 
                      ? 'text-pars-cta bg-pars-cta/10 dark:bg-pars-cta/20' 
                      : 'text-pars-text dark:text-gray-300 hover:text-pars-cta hover:bg-gray-100/50 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors text-gray-500 dark:text-gray-400"
                aria-label="Toggle Theme"
              >
                {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <Link to="/checkout" className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-stone-800 transition-colors group">
                <ShoppingBag className={`h-6 w-6 transition-colors ${cart ? 'text-pars-cta' : 'text-gray-400 dark:text-gray-500 group-hover:text-pars-cta'}`} />
                {cart && (
                  <span className="absolute top-1 right-1 bg-pars-accent text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full animate-scale-up">
                    1
                  </span>
                )}
              </Link>
              
              {user ? (
                <div className="relative pl-4 border-l border-gray-200 dark:border-stone-700">
                   <button 
                     onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                     className="flex items-center gap-2 text-sm font-medium text-pars-primary dark:text-gray-200 focus:outline-none"
                   >
                      <div className="w-8 h-8 rounded-full bg-pars-cta/10 dark:bg-pars-cta/20 flex items-center justify-center text-pars-cta">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="hidden lg:block">{user.name}</span>
                   </button>
                   
                   {/* User Dropdown */}
                   {isUserMenuOpen && (
                     <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-gray-100 dark:border-stone-800 overflow-hidden animate-fade-in z-50">
                        {user.isAdmin && (
                          <Link 
                            to="/admin" 
                            onClick={() => setIsUserMenuOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-800 hover:text-pars-cta border-b border-gray-50 dark:border-stone-800 flex items-center gap-2"
                          >
                            <LayoutDashboard className="h-4 w-4" /> Admin Panel
                          </Link>
                        )}
                        <Link 
                          to="/profile" 
                          onClick={() => setIsUserMenuOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-800 hover:text-pars-cta border-b border-gray-50 dark:border-stone-800 flex items-center gap-2"
                        >
                          <Settings className="h-4 w-4" /> My Profile
                        </Link>
                        <button 
                          onClick={() => { logout(); setIsUserMenuOpen(false); }} 
                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                        >
                          <LogOut className="h-4 w-4" /> Logout
                        </button>
                     </div>
                   )}
                </div>
              ) : (
                 <Link to="/login" className="text-sm font-bold text-white bg-pars-primary px-6 py-2.5 rounded-full hover:bg-pars-cta transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                   Login
                 </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 text-gray-500 dark:text-gray-400"
              >
                {themeMode === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <Link to="/checkout" className="relative">
                 <ShoppingBag className={`h-6 w-6 ${cart ? 'text-pars-cta' : 'text-gray-500 dark:text-gray-400'}`} />
                 {cart && <span className="absolute -top-1 -right-1 bg-pars-accent w-2.5 h-2.5 rounded-full border-2 border-white"></span>}
              </Link>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-pars-primary dark:text-white focus:outline-none p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-stone-900 border-b border-gray-100 dark:border-stone-800 shadow-xl animate-fade-in">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold ${
                    location.pathname === link.path 
                      ? 'bg-pars-cta/10 dark:bg-pars-cta/20 text-pars-cta' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-800'
                  }`}
                >
                  {link.name}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Link>
              ))}
              <div className="h-px bg-gray-100 dark:bg-stone-800 my-2"></div>
              {user ? (
                <>
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 text-base font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl"
                    >
                      <LayoutDashboard className="h-5 w-5" /> Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-2 w-full text-left px-4 py-3 text-base font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-stone-800 rounded-xl"
                  >
                    <Settings className="h-5 w-5" /> My Profile
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-4 py-3 text-base font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center px-4 py-3 text-base font-bold text-white bg-pars-primary rounded-xl shadow-lg">
                  Login / Sign Up
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-stone-900 border-t border-gray-100 dark:border-stone-800 pt-16 pb-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-12">
            <div className="col-span-1 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2">
                 <div className="bg-pars-cta p-1.5 rounded-lg">
                   <Radio className="h-5 w-5 text-white" />
                 </div>
                 <span className="font-bold text-xl text-pars-primary dark:text-white">AloTelcom</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Connect globally like a local. Instant eSIM delivery for over 190+ countries with zero roaming fees.
              </p>
              <div className="flex gap-4 pt-2">
                {/* Social Placeholders */}
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-stone-800 hover:bg-pars-cta hover:text-white transition-colors flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-400"><span className="text-xs">FB</span></div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-stone-800 hover:bg-pars-cta hover:text-white transition-colors flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-400"><span className="text-xs">IG</span></div>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-stone-800 hover:bg-pars-cta hover:text-white transition-colors flex items-center justify-center cursor-pointer text-gray-600 dark:text-gray-400"><span className="text-xs">TW</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-bold text-pars-primary dark:text-white uppercase tracking-wider mb-6">Store</h3>
              <ul className="space-y-3">
                <li><Link to="/marketplace" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Local eSIMs</Link></li>
                <li><Link to="/marketplace" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Regional eSIMs</Link></li>
                <li><Link to="/marketplace" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Global eSIMs</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-pars-primary dark:text-white uppercase tracking-wider mb-6">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Check Usage</Link></li>
                <li><Link to="/dashboard" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Installation Help</Link></li>
                <li><Link to="/help" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Help Center</Link></li>
                <li><Link to="/support" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Contact Support</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold text-pars-primary dark:text-white uppercase tracking-wider mb-6">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">About Us</Link></li>
                <li><Link to="/partners" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Partners</Link></li>
                <li><Link to="/legal" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pars-cta transition-colors">Legal & Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-400 dark:text-gray-500">&copy; {new Date().getFullYear()} AloTelcom Inc. All rights reserved.</p>
            <div className="flex gap-6">
               <Link to="/legal" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">Privacy Policy</Link>
               <Link to="/legal" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
      <CookieConsent />
    </div>
  );
};

export default Layout;