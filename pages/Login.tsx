import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Radio, ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { useApp } from '../store';

const Login: React.FC = () => {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        navigate('/dashboard');
      } else {
        await signup(email, password, name);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-stone-950 transition-colors duration-300">
      
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex w-1/2 bg-pars-primary relative overflow-hidden flex-col justify-between p-12 text-white">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
         <div className="relative z-10">
            <Link to="/" className="flex items-center gap-2 mb-12 opacity-80 hover:opacity-100 transition">
               <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="flex items-center gap-2 mb-6">
               <div className="bg-pars-cta p-1.5 rounded-lg">
                 <Radio className="h-6 w-6 text-white" />
               </div>
               <span className="font-bold text-2xl">AloTelcom</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              {isLogin ? 'Welcome Back' : 'Join AloTelcom'}
            </h1>
            <p className="text-xl text-gray-400">
              {isLogin 
                ? 'Sign in to manage your eSIMs and travel connectivity.'
                : 'Start your journey with instant global connectivity.'}
            </p>
         </div>
         <div className="relative z-10 flex gap-8 text-sm text-gray-400">
            <span>&copy; 2025 AloTelcom Inc.</span>
            <Link to="/legal" className="hover:text-white">Privacy</Link>
            <Link to="/legal" className="hover:text-white">Terms</Link>
         </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
         <div className="max-w-md w-full">
            <div className="lg:hidden mb-8 text-center">
               <Link to="/" className="inline-flex items-center gap-2 font-bold text-xl text-pars-primary dark:text-white">
                  <div className="bg-pars-cta p-1.5 rounded-lg"><Radio className="h-5 w-5 text-white" /></div>
                  AloTelcom
               </Link>
            </div>

            <div className="bg-white dark:bg-stone-900 p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-stone-800 animate-fade-in-up">
               <div className="flex gap-4 mb-6">
                  <button
                     onClick={() => { setIsLogin(true); setError(''); }}
                     className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                       isLogin 
                         ? 'bg-pars-cta text-white' 
                         : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400'
                     }`}
                  >
                     Sign In
                  </button>
                  <button
                     onClick={() => { setIsLogin(false); setError(''); }}
                     className={`flex-1 py-2 rounded-xl font-bold transition-colors ${
                       !isLogin 
                         ? 'bg-pars-cta text-white' 
                         : 'bg-gray-100 dark:bg-stone-800 text-gray-600 dark:text-gray-400'
                     }`}
                  >
                     Sign Up
                  </button>
               </div>

               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {isLogin ? 'Sign In' : 'Create Account'}
               </h2>
               <p className="text-gray-500 dark:text-gray-400 mb-8">
                  {isLogin 
                    ? 'Sign in to your account to continue.'
                    : 'Create an account to get started.'}
               </p>

               {error && (
                  <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                     {error}
                  </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                     <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                        <div className="relative">
                           <input 
                              type="text" 
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pars-cta outline-none transition text-gray-900 dark:text-white"
                              placeholder="John Doe"
                           />
                           <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        </div>
                     </div>
                  )}
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                     <div className="relative">
                        <input 
                           type="email" 
                           required
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pars-cta outline-none transition text-gray-900 dark:text-white"
                           placeholder="name@example.com"
                        />
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Password</label>
                     <div className="relative">
                        <input 
                           type="password" 
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           minLength={8}
                           className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-stone-800 border border-gray-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-pars-cta outline-none transition text-gray-900 dark:text-white"
                           placeholder="••••••••"
                        />
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                     </div>
                     {!isLogin && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Must be at least 8 characters</p>
                     )}
                  </div>
                  
                  {isLogin && (
                     <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
                           <input type="checkbox" className="rounded text-pars-cta focus:ring-pars-cta" /> Remember me
                        </label>
                        <a href="#" className="text-pars-cta font-bold hover:underline">Forgot password?</a>
                     </div>
                  )}

                  <button 
                     type="submit" 
                     disabled={isLoading}
                     className="w-full bg-pars-cta text-white font-bold py-3.5 rounded-xl hover:bg-orange-700 transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                     {isLoading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                  </button>
               </form>

               <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                  {isLogin ? (
                     <>Don't have an account? <Link to="/login" onClick={(e) => { e.preventDefault(); setIsLogin(false); }} className="text-pars-cta font-bold hover:underline">Sign Up</Link></>
                  ) : (
                     <>Already have an account? <Link to="/login" onClick={(e) => { e.preventDefault(); setIsLogin(true); }} className="text-pars-cta font-bold hover:underline">Sign In</Link></>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Login;

