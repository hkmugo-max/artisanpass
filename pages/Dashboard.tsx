import React, { useEffect, useState } from 'react';
import { Product, Stage } from '../types';
import { Plus, Package, ArrowRight, CloudLightning, CreditCard, Lock, LogOut, Globe, ShieldCheck, QrCode, AlertTriangle, MapPin } from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { getPlanDetails, hasCreditsRemaining, upgradeUser, resetUser, subscribeToTierChanges } from '../services/subscriptionService';
import { authService } from '../services/authService';
import { calculateMaterialDistance, calculateIntegrityScore, calculateProductionHours, getConsumerScans } from '../services/analyticsService';

interface Props {
  products: Product[];
  onCreateNew: () => void;
}

type Tab = 'overview' | 'analytics';

export const Dashboard: React.FC<Props> = ({ products, onCreateNew }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  
  // Force update when service changes
  const [_, setTick] = useState(0);

  // MOCK DATA INJECTION:
  // Since we don't have the real Edge Function running, we inject a "High Risk" product into the view 
  // if the list is empty or doesn't have one, just to visualize the Fraud Engine UI.
  const displayProducts = [...products];
  if (displayProducts.length > 0 && !displayProducts.some(p => p.logs.some(l => l.isFlagged))) {
      // Add a mock flag to the first product's first log for demo purposes
      if (displayProducts[0].logs.length > 0) {
          displayProducts[0].logs[0].isFlagged = true;
          displayProducts[0].logs[0].fraudScore = 90;
          displayProducts[0].logs[0].flagReason = "Impossible Speed (>300km/h)";
      }
  }
  
  useEffect(() => {
    return subscribeToTierChanges(() => setTick(t => t + 1));
  }, []);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/auth');
  };

  const plan = getPlanDetails();
  const canCreate = hasCreditsRemaining(products.length);
  const usagePercentage = Math.min(100, (products.length / plan.qrLimit) * 100);

  // --- ANALYTICS DATA PREP ---
  const totalHours = products.reduce((sum, p) => sum + calculateProductionHours(p), 0);
  const totalKm = products.reduce((sum, p) => sum + calculateMaterialDistance(p), 0);
  const avgIntegrity = products.length > 0 
    ? Math.round(products.reduce((sum, p) => sum + calculateIntegrityScore(p).score, 0) / products.length)
    : 100;
  
  const scans = getConsumerScans(products);
  
  // Get all flagged logs across all products
  const fraudAlerts = displayProducts.flatMap(p => 
      p.logs
        .filter(l => l.isFlagged)
        .map(l => ({ ...l, productName: p.name, productId: p.id }))
  );

  // ---------------------------

  const renderOverview = () => (
    <div className="px-4 space-y-4 animate-fade-in">
        {/* New Job Card */}
        <button 
            onClick={canCreate ? onCreateNew : undefined}
            disabled={!canCreate}
            className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors h-40 ${
                canCreate 
                ? 'bg-clay/10 border-clay cursor-pointer active:bg-clay/20' 
                : 'bg-stone-100 border-stone-300 cursor-not-allowed opacity-70'
            }`}
        >
            <div className={`p-3 rounded-full mb-2 ${canCreate ? 'bg-clay text-white' : 'bg-stone-300 text-stone-500'}`}>
                {canCreate ? <Plus size={32} /> : <Lock size={32} />}
            </div>
            <span className={`font-semibold ${canCreate ? 'text-clay' : 'text-stone-400'}`}>
                {canCreate ? 'Start New Item' : 'Limit Reached'}
            </span>
        </button>

        {/* Existing Jobs */}
        {displayProducts.map(product => {
          const isHighRisk = product.logs.some(l => l.isFlagged);

          return (
            <div 
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className={`bg-white rounded-xl shadow-sm p-4 border flex items-center gap-4 active:scale-[0.98] transition-transform ${isHighRisk ? 'border-red-300 bg-red-50/10' : 'border-stone-200'}`}
            >
                <div className="h-16 w-16 bg-stone-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden relative">
                    {product.thumbnail ? (
                        <img src={product.thumbnail} alt="thumbnail" className="h-full w-full object-cover" />
                    ) : (
                        <Package className="text-stone-400" />
                    )}
                    {isHighRisk && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-bl-lg shadow-sm">
                            <AlertTriangle size={10} />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-stone-800">{product.name}</h3>
                        {isHighRisk && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">RISK DETECTED</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                            product.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {product.status}
                        </span>
                        {!product.synced && (
                            <span className="text-xs text-stone-400 flex items-center gap-1">
                                <CloudLightning size={10} /> Queued
                            </span>
                        )}
                    </div>
                </div>
                <ArrowRight className="text-stone-300" />
            </div>
          );
        })}

        {products.length === 0 && (
            <div className="text-center text-stone-400 mt-10">
                <p>No active items.</p>
                <p className="text-sm">Tap the + to begin tracking.</p>
            </div>
        )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="px-4 space-y-6 animate-fade-in pb-10">
        
        {/* FRAUD ALERT WIDGET */}
        {fraudAlerts.length > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm animate-pulse-slow">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-red-800 font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                        <AlertTriangle size={18} /> Compliance Risks
                    </h3>
                    <span className="bg-red-200 text-red-800 text-xs font-bold px-2 py-1 rounded-full">{fraudAlerts.length} Active</span>
                </div>
                <div className="space-y-2">
                    {fraudAlerts.map((log, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-lg border border-red-100 text-sm">
                            <div className="flex justify-between">
                                <span className="font-bold text-stone-800">{log.productName}</span>
                                <span className="text-red-500 font-mono font-bold">Score: {log.fraudScore}</span>
                            </div>
                            <p className="text-stone-500 text-xs mt-1">{log.stage}</p>
                            <p className="text-red-600 font-bold text-xs mt-1 flex items-center gap-1">
                                <ShieldCheck size={12} /> {log.flagReason}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
             <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                 <div className="p-2 bg-green-100 rounded-full text-green-600">
                     <ShieldCheck size={20} />
                 </div>
                 <div>
                     <h3 className="text-green-800 font-bold text-sm">System Secure</h3>
                     <p className="text-green-600 text-xs">No fraud anomalies detected in active logs.</p>
                 </div>
             </div>
        )}

        {/* 1. Impact Summary */}
        <div className="grid grid-cols-2 gap-4">
             <div className="bg-earth text-white p-4 rounded-xl shadow-md">
                 <p className="text-earth-200 text-xs uppercase font-bold mb-1">Total Artisan Hours</p>
                 <p className="text-3xl font-bold">{totalHours}h</p>
                 <p className="text-xs opacity-70 mt-1">Economic generation</p>
             </div>
             <div className="bg-clay text-white p-4 rounded-xl shadow-md">
                 <p className="text-clay-100 text-xs uppercase font-bold mb-1">Material Logistics</p>
                 <p className="text-3xl font-bold">{totalKm} <span className="text-base font-normal">km</span></p>
                 <p className="text-xs opacity-70 mt-1">Distance tracked</p>
             </div>
        </div>

        {/* 2. Risk Intelligence */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-stone-800 flex items-center gap-2">
                     <ShieldCheck className="text-earth" size={20} /> Overall Data Integrity
                 </h3>
                 <span className={`font-bold text-lg ${avgIntegrity > 80 ? 'text-leaf' : 'text-amber-500'}`}>
                     {avgIntegrity}/100
                 </span>
             </div>
             <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-2">
                 <div 
                    className={`h-full ${avgIntegrity > 80 ? 'bg-leaf' : 'bg-amber-500'}`} 
                    style={{width: `${avgIntegrity}%`}} 
                 />
             </div>
             <p className="text-xs text-stone-500 leading-relaxed">
                 Aggregate score based on GPS verification consistency, photo metadata analysis, and chronological timestamp validation.
             </p>
        </div>

        {/* 3. Consumer Analytics Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
             <div className="p-4 border-b border-stone-100 bg-stone-50 flex justify-between items-center">
                 <h3 className="font-bold text-stone-800 flex items-center gap-2">
                     <Globe className="text-earth" size={18} /> Live Consumer Scans
                 </h3>
                 <span className="text-xs font-bold text-clay bg-clay/10 px-2 py-1 rounded">
                     {scans.length} Events
                 </span>
             </div>
             
             <div className="overflow-x-auto">
                 <table className="w-full text-sm text-left">
                     <thead className="bg-stone-50 text-stone-500 font-medium">
                         <tr>
                             <th className="px-4 py-3">Product</th>
                             <th className="px-4 py-3">Location</th>
                             <th className="px-4 py-3">Device</th>
                             <th className="px-4 py-3">Time</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-stone-100">
                         {scans.length === 0 ? (
                             <tr><td colSpan={4} className="text-center py-6 text-stone-400">No public scans yet.</td></tr>
                         ) : (
                             scans.map(scan => (
                                 <tr key={scan.id} className="hover:bg-stone-50/50">
                                     <td className="px-4 py-3 font-medium text-stone-800 truncate max-w-[100px]">{scan.productName}</td>
                                     <td className="px-4 py-3 text-stone-600 flex items-center gap-1">
                                         <span className="w-2 h-2 rounded-full bg-leaf"></span> {scan.location}
                                     </td>
                                     <td className="px-4 py-3 text-stone-500">{scan.device}</td>
                                     <td className="px-4 py-3 text-stone-400 text-xs">
                                         {new Date(scan.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                     </td>
                                 </tr>
                             ))
                         )}
                     </tbody>
                 </table>
             </div>
        </div>
    </div>
  );

  return (
    <div className="pb-24">
      <header className="bg-white p-6 shadow-sm mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-2xl font-bold text-earth">Brand Dashboard</h1>
                <p className="text-stone-500 text-sm">Active Traceability Logs</p>
            </div>
            
            <div className="flex gap-2">
                 {/* Dev Tool to toggle tiers */}
                <button 
                    onClick={plan.tier === 'FREE' ? upgradeUser : resetUser}
                    className="text-[10px] bg-stone-100 text-stone-400 px-2 py-1 rounded border border-stone-200 transition-colors hover:bg-stone-200 h-8"
                >
                    {plan.tier === 'FREE' ? 'Upgrade (Demo)' : 'Reset (Demo)'}
                </button>
                
                <button 
                    onClick={handleLogout}
                    className="p-2 bg-stone-100 rounded-full text-stone-600 hover:bg-stone-200 transition-colors"
                    title="Sign Out"
                >
                    <LogOut size={16} />
                </button>
            </div>
        </div>

        {/* Usage Credits Widget */}
        <div className="mt-6 bg-stone-50 rounded-xl p-4 border border-stone-200">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-stone-600 uppercase tracking-wide flex items-center gap-1">
                    <CreditCard size={12} /> {plan.tier} Plan Credits
                </span>
                <span className={`text-xs font-bold ${canCreate ? 'text-leaf' : 'text-red-500'}`}>
                    {products.length} / {plan.tier === 'ENTERPRISE' ? '∞' : plan.qrLimit} Used
                </span>
            </div>
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div 
                    className={`h-full transition-all duration-500 ${canCreate ? 'bg-clay' : 'bg-red-500'}`} 
                    style={{ width: `${usagePercentage}%` }}
                />
            </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 mb-6">
          <div className="flex bg-stone-200/50 p-1 rounded-xl">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-white shadow-sm text-earth' : 'text-stone-500 hover:text-stone-600'}`}
              >
                  Overview
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'analytics' ? 'bg-white shadow-sm text-earth' : 'text-stone-500 hover:text-stone-600'}`}
              >
                  Intelligence
                  {fraudAlerts.length > 0 && <span className="ml-2 w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse"></span>}
              </button>
          </div>
      </div>

      {activeTab === 'overview' ? renderOverview() : renderAnalytics()}
    </div>
  );
};