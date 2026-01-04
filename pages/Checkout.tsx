import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Smartphone, Lock, ChevronRight, X, Info } from 'lucide-react';
import { useApp } from '../store';

const Checkout: React.FC = () => {
  const { cart, addOrder, user } = useApp();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Form state
  const [email, setEmail] = useState(user?.email || '');
  const [imei, setImei] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [imeiError, setImeiError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!cart) {
    return (
      <div className="min-h-screen bg-pars-bg flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
           <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
           <p className="text-gray-500 mb-8">Looks like you haven't selected a plan yet.</p>
           <button 
             onClick={() => navigate('/marketplace')}
             className="w-full bg-pars-primary text-white py-3 rounded-lg font-medium hover:bg-pars-primary/90 transition"
           >
             Browse Plans
           </button>
        </div>
      </div>
    );
  }

  const validateImei = (value: string) => {
    const clean = value.replace(/\D/g, '');
    if (clean.length !== 15) {
      setImeiError('IMEI must be exactly 15 digits');
      return false;
    }
    setImeiError('');
    return true;
  };

  const handlePaymentClick = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate IMEI
    if (!validateImei(imei)) {
      // Ensure focus or error visibility
      return;
    }

    setShowConfirmation(true);
  };

  const finalizeOrder = async () => {
    if (!agreedToTerms) return;

    setIsProcessing(true);
    
    try {
      if (cart) {
        await addOrder(cart, imei, deviceModel);
      }
      setIsProcessing(false);
      setShowConfirmation(false);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.message || 'Failed to create order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Account Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <div className="bg-orange-100 p-1.5 rounded-full text-orange-600 font-bold text-xs w-6 h-6 flex items-center justify-center">1</div>
                 Contact Information
               </h2>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                   <input 
                     type="email" 
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pars-cta focus:border-transparent outline-none transition"
                     placeholder="name@example.com"
                   />
                   <p className="text-xs text-gray-500 mt-1">We'll send your QR code here.</p>
                 </div>
               </div>
            </div>

            {/* Device Registration (New Section) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <div className="bg-orange-100 p-1.5 rounded-full text-orange-600 font-bold text-xs w-6 h-6 flex items-center justify-center">2</div>
                 Device Registration
               </h2>
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Device Model</label>
                   <input 
                     type="text" 
                     value={deviceModel}
                     onChange={(e) => setDeviceModel(e.target.value)}
                     className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pars-cta focus:border-transparent outline-none transition"
                     placeholder="e.g. iPhone 14 Pro, Samsung S23"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">IMEI Number</label>
                   <input 
                     type="text" 
                     required
                     value={imei}
                     onChange={(e) => {
                       const val = e.target.value.replace(/\D/g, '').slice(0, 15);
                       setImei(val);
                       if (val.length === 15) setImeiError('');
                     }}
                     className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:outline-none transition ${imeiError ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-pars-cta'}`}
                     placeholder="15-digit IMEI number"
                   />
                   {imeiError ? (
                     <p className="text-xs text-red-500 mt-1">{imeiError}</p>
                   ) : (
                     <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                       <Info className="h-3 w-3" /> Dial *#06# on your phone to get your IMEI
                     </p>
                   )}
                 </div>
               </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                 <div className="bg-orange-100 p-1.5 rounded-full text-orange-600 font-bold text-xs w-6 h-6 flex items-center justify-center">3</div>
                 Payment Method
               </h2>
               
               {/* Mock Payment Tabs */}
               <div className="flex gap-3 mb-6">
                 <button type="button" className="flex-1 py-3 border-2 border-pars-cta bg-orange-50 text-pars-cta font-medium rounded-lg flex items-center justify-center gap-2">
                   <CreditCard className="h-4 w-4" /> Card
                 </button>
                 <button type="button" className="flex-1 py-3 border border-gray-200 text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
                   <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5 7.51-3.22-7.52-3.22 7.52 3.22z"/></svg> Apple Pay
                 </button>
               </div>

               <form id="payment-form" onSubmit={handlePaymentClick} className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                   <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 focus:ring-2 focus:ring-pars-cta outline-none" required />
                      <CreditCard className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
                     <input type="text" placeholder="MM/YY" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pars-cta outline-none" required />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                     <div className="relative">
                        <input type="text" placeholder="123" className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-pars-cta outline-none" required />
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                     </div>
                   </div>
                 </div>
                 
                 {/* Upsell: Travel Insurance */}
                 <div className="mt-6 bg-green-50 p-4 rounded-lg border border-green-100 flex items-start gap-3">
                   <div className="mt-1">
                      <input type="checkbox" className="h-4 w-4 text-pars-accent rounded focus:ring-pars-accent" />
                   </div>
                   <div>
                     <h4 className="text-sm font-bold text-green-900">Add Travel Insurance (+$9.00)</h4>
                     <p className="text-xs text-green-700 mt-1">Covers medical emergencies and lost luggage. Provided by SafeTrip Inc.</p>
                   </div>
                 </div>

               </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>
              
              <div className="flex items-start gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="bg-gray-100 w-16 h-16 rounded-lg flex items-center justify-center text-3xl shadow-inner">
                  {cart.flag}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{cart.country} eSIM</h3>
                  <p className="text-sm text-gray-500">{cart.data} Data • {cart.validity}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${cart.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Taxes</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span>${cart.price.toFixed(2)}</span>
                </div>
              </div>

              <button 
                type="submit" 
                form="payment-form"
                className="w-full bg-pars-cta text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Pay Securely <ChevronRight className="h-5 w-5" />
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="h-4 w-4" /> SSL Encrypted Payment
              </div>
            </div>

            {/* Device Compatibility */}
            <div className="mt-6 bg-orange-50 p-4 rounded-xl border border-orange-100 text-sm text-orange-800">
               <div className="flex items-center gap-2 font-bold mb-2">
                 <Smartphone className="h-4 w-4" />
                 Compatible Device?
               </div>
               <p className="text-xs">
                 Ensure your device is eSIM compatible and carrier unlocked before purchasing. Most modern iPhones (XR+) and Androids (S20+) work.
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Confirm Order</h3>
              <button 
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-4xl">{cart.flag}</div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{cart.country}</p>
                  <p className="text-sm text-gray-500">{cart.data} • {cart.validity}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg text-sm border border-gray-100 space-y-2">
                 <div className="flex justify-between">
                   <span className="text-gray-500">Email:</span>
                   <span className="font-medium">{email}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">Device:</span>
                   <span className="font-medium">{deviceModel || 'Not specified'}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className="text-gray-500">IMEI:</span>
                   <span className="font-medium font-mono">{imei}</span>
                 </div>
              </div>
              
              <div className="flex justify-between items-center py-4 border-t border-gray-100">
                 <span className="text-gray-600">Total Amount</span>
                 <span className="text-2xl font-bold text-pars-primary">${cart.price.toFixed(2)}</span>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                 <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="mt-1 h-4 w-4 text-pars-cta rounded border-gray-300 focus:ring-pars-cta" 
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                    />
                    <span className="text-xs text-orange-900 leading-relaxed select-none">
                      I agree to the <a href="/#/legal" target="_blank" className="font-bold underline hover:text-orange-700">Terms of Service</a>, <a href="/#/legal" target="_blank" className="font-bold underline hover:text-orange-700">Privacy Policy</a>, and authorize AloTelcom to charge my payment method. I understand that eSIMs are non-refundable once installed.
                    </span>
                 </label>
              </div>
            </div>
            
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                disabled={isProcessing}
                className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={finalizeOrder}
                disabled={isProcessing || !agreedToTerms}
                className="flex-1 py-3 px-4 bg-pars-cta text-white rounded-xl font-bold hover:bg-orange-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                   <>
                     <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     Processing...
                   </>
                ) : (
                   <>Confirm Payment</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;