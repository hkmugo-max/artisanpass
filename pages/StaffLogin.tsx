import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { ShieldCheck, Lock, Loader2 } from '../components/Icons';

export const StaffLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock delay
    await new Promise(r => setTimeout(r, 1000));

    // Simple client-side check for demo purposes. 
    // In production, this would be a server-side auth check.
    if (email.endsWith('@artisanpass.com')) {
        await authService.signIn(email, 'admin');
        navigate('/admin');
    } else {
        alert("Unauthorized Access. Incident logged.");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-stone-800 border border-stone-700 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 text-stone-100 mb-6">
            <div className="p-2 bg-red-900/30 rounded-lg text-red-500">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h1 className="font-bold text-lg">Staff Access</h1>
                <p className="text-xs text-stone-500 uppercase tracking-widest">Authorized Personnel Only</p>
            </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">System ID</label>
                <input 
                    type="email" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="admin@artisanpass.com"
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1">Access Key</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-700 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                    placeholder="••••••••••"
                />
            </div>

            <button 
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
                {isLoading ? <Loader2 className="animate-spin" /> : <Lock size={16} />}
                Authenticate
            </button>
        </form>
      </div>
    </div>
  );
};