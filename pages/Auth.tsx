import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import { Leaf, Hammer, Building2, ArrowRight, Loader2, ArrowLeft } from '../components/Icons';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<UserRole>('artisan');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    await new Promise(r => setTimeout(r, 1000));

    const { user, error } = await authService.signIn(email, role);
    
    setIsLoading(false);

    if (user) {
      // REDIRECT LOGIC BASED ON ROLE
      if (user.role === 'artisan') {
        navigate('/capture');
      } else {
        navigate('/dashboard');
      }
    } else {
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center p-6 relative">
      
      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-stone-400 hover:text-earth transition-colors text-sm font-bold"
      >
        <ArrowLeft size={16} /> Back to Home
      </button>

      <div className="mb-8 flex items-center gap-2 text-earth animate-fade-in">
        <div className="w-10 h-10 bg-clay rounded-xl flex items-center justify-center text-white">
          <Leaf size={24} />
        </div>
        <span className="text-2xl font-bold tracking-tight">ArtisanPass</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md border border-stone-200">
        <h2 className="text-2xl font-bold text-stone-800 mb-2 text-center">Welcome Back</h2>
        <p className="text-stone-500 text-center mb-8 text-sm">Select your role to continue</p>

        {/* Role Switcher */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setRole('artisan')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'artisan'
                ? 'border-clay bg-clay/5 text-clay shadow-sm'
                : 'border-stone-100 text-stone-400 hover:border-stone-200'
            }`}
          >
            <Hammer size={24} />
            <span className="font-bold text-sm">Artisan</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('brand')}
            className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'brand'
                ? 'border-earth bg-earth/5 text-earth shadow-sm'
                : 'border-stone-100 text-stone-400 hover:border-stone-200'
            }`}
          >
            <Building2 size={24} /> 
            <span className="font-bold text-sm">Brand</span>
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wide mb-1">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border border-stone-200 focus:outline-none focus:border-clay focus:ring-1 focus:ring-clay"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold shadow-lg mt-4 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
      
      <p className="mt-8 text-xs text-stone-400 text-center">
        By continuing, you agree to our Terms of Service <br/> and Data Privacy Policy.
      </p>
    </div>
  );
};