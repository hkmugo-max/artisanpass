import React from 'react';
import { Product } from '../types';
import { Plus, Package, ArrowRight, Hammer, LogOut, CheckCircle } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface Props {
  products: Product[];
  onCreateNew: () => void;
}

export const CaptureMenu: React.FC<Props> = ({ products, onCreateNew }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
      await authService.signOut();
      navigate('/auth');
  };

  const activeJobs = products.filter(p => p.status !== 'Completed');
  const completedJobs = products.filter(p => p.status === 'Completed');

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Increased bottom padding to prevent overlap with the card below */}
      <header className="bg-clay text-white px-6 pt-6 pb-24 shadow-md rounded-b-3xl relative z-0">
        <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
                <Hammer size={24} className="text-white/80" />
                <h1 className="text-xl font-bold">Artisan Mode</h1>
            </div>
            <button onClick={handleLogout} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <LogOut size={20} />
            </button>
        </div>
        <h2 className="text-3xl font-serif font-bold mb-2">Hello, Maker.</h2>
        <p className="text-clay-100 text-sm">Ready to log your work today?</p>
      </header>

      <div className="px-6 -mt-12 relative z-10">
        {/* Giant CTA Button */}
        <button 
            onClick={onCreateNew}
            className="w-full bg-white h-32 rounded-2xl shadow-xl flex items-center justify-between px-8 border-l-8 border-leaf active:scale-95 transition-transform"
        >
            <div className="text-left">
                <span className="block text-2xl font-bold text-stone-800">New Item</span>
                <span className="text-stone-400 text-sm">Start a new log</span>
            </div>
            <div className="w-16 h-16 bg-leaf/10 rounded-full flex items-center justify-center text-leaf">
                <Plus size={32} />
            </div>
        </button>
      </div>

      <div className="px-6 mt-8">
        <h3 className="font-bold text-stone-600 mb-4 uppercase text-xs tracking-wider">Your Active Jobs</h3>
        
        <div className="space-y-4">
            {activeJobs.length === 0 && (
                <div className="text-center py-8 text-stone-400 border-2 border-dashed border-stone-200 rounded-xl">
                    <Package size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No active jobs</p>
                </div>
            )}

            {activeJobs.map(product => (
            <div 
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="bg-white rounded-xl shadow-sm p-4 border border-stone-200 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
                <div className="h-16 w-16 bg-stone-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {product.thumbnail ? (
                        <img src={product.thumbnail} alt="thumbnail" className="h-full w-full object-cover" />
                    ) : (
                        <Package className="text-stone-400" />
                    )}
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-stone-800 text-lg">{product.name}</h3>
                    <p className="text-stone-400 text-sm">{product.logs[product.logs.length-1]?.stage || 'Just Started'}</p>
                </div>
                <div className="w-10 h-10 bg-stone-50 rounded-full flex items-center justify-center text-stone-400">
                    <ArrowRight size={20} />
                </div>
            </div>
            ))}
        </div>
      </div>

      {completedJobs.length > 0 && (
        <div className="px-6 mt-8">
            <h3 className="font-bold text-stone-600 mb-4 uppercase text-xs tracking-wider">Past Work</h3>
            <div className="space-y-4">
                {completedJobs.map(product => (
                    <div 
                        key={product.id}
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="bg-stone-50 rounded-xl p-4 border border-stone-200 flex items-center gap-4 opacity-75 hover:opacity-100 transition-opacity"
                    >
                        <div className="h-12 w-12 bg-stone-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden grayscale">
                            {product.thumbnail ? (
                                <img src={product.thumbnail} alt="thumbnail" className="h-full w-full object-cover" />
                            ) : (
                                <CheckCircle className="text-stone-400" size={20} />
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-stone-600">{product.name}</h3>
                            <p className="text-green-600 text-xs font-bold flex items-center gap-1">
                                <CheckCircle size={10} /> Completed
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};