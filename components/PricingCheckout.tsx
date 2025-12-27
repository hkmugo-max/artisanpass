import React, { useState } from 'react';
import { openPaddleCheckout } from '../services/paddleService';
import { Loader2, CreditCard, CheckCircle } from './Icons';

interface Props {
  tierName: string;
  price: number;
  interval: 'mo' | 'yr';
  paddleProductId: number;
  features: string[];
  isPopular?: boolean;
}

export const PricingCheckout: React.FC<Props> = ({ 
  tierName, 
  price, 
  interval, 
  paddleProductId, 
  features,
  isPopular = false
}) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    // Mock User Data - In production, pull from authService
    const mockEmail = "user@brand.com"; 
    const mockUserId = "user_123";

    await openPaddleCheckout(paddleProductId, mockEmail, mockUserId);
    setLoading(false);
  };

  return (
    <div className={`relative bg-white rounded-2xl p-8 shadow-sm border transition-all duration-300 hover:shadow-xl ${isPopular ? 'border-clay shadow-md transform md:-translate-y-4' : 'border-stone-200'}`}>
      
      {isPopular && (
        <div className="absolute top-0 right-0 bg-clay text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl uppercase tracking-wider">
          Best Value
        </div>
      )}

      <h3 className={`text-xl font-bold ${isPopular ? 'text-clay' : 'text-stone-800'}`}>
        {tierName}
      </h3>
      <p className="text-stone-500 text-sm mb-6">
        {tierName === 'Boutique' ? 'For independent ethical brands.' : 'For global compliance needs.'}
      </p>

      <div className="flex items-baseline gap-1 mb-8">
        <span className="text-4xl font-bold text-stone-900">${price}</span>
        <span className="text-stone-400">/{interval}</span>
      </div>

      <button 
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 rounded-xl font-bold transition-colors mb-8 flex items-center justify-center gap-2 ${
          isPopular 
            ? 'bg-clay text-white hover:bg-earth shadow-lg shadow-clay/20' 
            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
        }`}
      >
        {loading ? <Loader2 className="animate-spin" /> : <CreditCard size={18} />}
        {loading ? 'Loading...' : `Subscribe to ${tierName}`}
      </button>

      <div className="space-y-4 text-sm text-stone-600">
        {features.map((feature, idx) => (
          <div key={idx} className="flex items-center gap-3">
             <div className={`p-1 rounded-full ${isPopular ? 'bg-green-500/20' : ''}`}>
               <CheckCircle size={14} className={isPopular ? 'text-green-600' : 'text-stone-300'} />
             </div>
             {feature}
          </div>
        ))}
      </div>
    </div>
  );
};