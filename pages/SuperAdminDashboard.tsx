import React, { useState } from 'react';
import { 
    Building2, 
    Hammer, 
    CreditCard, 
    ShieldCheck, 
    Search, 
    MoreHorizontal, 
    CheckCircle, 
    XCircle,
    MapPin,
    Globe,
    AlertTriangle,
    LogOut,
    ArrowRight,
    Download,
    Edit,
    Trash2,
    Ban,
    FileMinus
} from '../components/Icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

// INITIAL MOCK DATA
const INITIAL_BRANDS = [
    { id: 1, name: "EcoThreads Peru", plan: "ENTERPRISE", status: "active", verified: true, mrr: 249, members: 12 },
    { id: 2, name: "Kenya Crafts Co.", plan: "PRO", status: "active", verified: true, mrr: 49, members: 5 },
    { id: 3, name: "Nordic Wool", plan: "FREE", status: "suspended", verified: false, mrr: 0, members: 1 },
    { id: 4, name: "Silk Road Textiles", plan: "ENTERPRISE", status: "active", verified: true, mrr: 249, members: 45 },
];

const MOCK_ARTISANS = [
    { id: 101, name: "Mateo Q.", brand: "EcoThreads Peru", location: "Cusco, PE", material: "Alpaca" },
    { id: 102, name: "Sarah J.", brand: "Kenya Crafts Co.", location: "Nairobi, KE", material: "Cotton" },
    { id: 103, name: "Lars Jensen", brand: "Nordic Wool", location: "Oslo, NO", material: "Wool" },
    { id: 104, name: "Wei Chen", brand: "Silk Road Textiles", location: "Hangzhou, CN", material: "Silk" },
];

const MOCK_ALERTS = [
    { 
        id: 501, 
        type: "IMPOSSIBLE_SPEED", 
        severity: "HIGH", 
        message: "User Mateo Q. traveled 400km in 30 minutes. (Speed > 100km/h)", 
        time: "10m ago",
        score: 90 
    },
    { 
        id: 502, 
        type: "GPS_MOCK_DETECTED", 
        severity: "CRITICAL", 
        message: "Device 'Android-X8' reporting mock location provider enabled.", 
        time: "1h ago",
        score: 100 
    },
    { 
        id: 503, 
        type: "LOCATION_DEVIATION", 
        severity: "MEDIUM", 
        message: "Finishing logged 12km from registered workshop.", 
        time: "2h ago",
        score: 40 
    },
    { 
        id: 504, 
        type: "SUBSCRIPTION_FAILED", 
        severity: "LOW", 
        message: "Payment failed for Nordic Wool.", 
        time: "5h ago",
        score: 0 
    },
];

type Section = 'brands' | 'directory' | 'alerts';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('brands');
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Brands Management
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [activeActionId, setActiveActionId] = useState<number | null>(null);

  const handleLogout = async () => {
    await authService.signOut();
    navigate('/');
  };

  const totalMRR = brands.reduce((sum, b) => sum + b.mrr, 0);

  // --- ACTIONS ---

  const handleExportCSV = () => {
      const headers = ['ID', 'Brand Name', 'Plan', 'Status', 'Verified', 'MRR', 'Members'];
      const rows = brands.map(b => [b.id, b.name, b.plan, b.status, b.verified, b.mrr, b.members]);
      
      const csvContent = "data:text/csv;charset=utf-8," 
          + headers.join(",") + "\n" 
          + rows.map(e => e.join(",")).join("\n");
          
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `artisanpass_brands_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handleAction = (id: number, action: string) => {
    setActiveActionId(null); // Close dropdown
    
    switch(action) {
        case 'accept':
            setBrands(prev => prev.map(b => b.id === id ? {...b, status: 'active', verified: true} : b));
            break;
        case 'deny':
            setBrands(prev => prev.map(b => b.id === id ? {...b, status: 'suspended', verified: false} : b));
            break;
        case 'delete':
            if(window.confirm('Are you sure you want to delete this brand? This action cannot be undone.')) {
                setBrands(prev => prev.filter(b => b.id !== id));
            }
            break;
        case 'cancel_sub':
             if(window.confirm('Downgrade this brand to FREE plan?')) {
                 setBrands(prev => prev.map(b => b.id === id ? {...b, plan: 'FREE', mrr: 0} : b));
             }
             break;
        case 'edit':
            const newName = prompt("Enter new brand name:");
            if (newName) {
                setBrands(prev => prev.map(b => b.id === id ? {...b, name: newName} : b));
            }
            break;
    }
  };

  // --- RENDERERS ---

  const renderSidebar = () => (
      <aside className="w-64 bg-stone-900 text-stone-400 flex flex-col h-screen fixed left-0 top-0 border-r border-stone-800 z-30">
          <div className="p-6 border-b border-stone-800">
              <div className="flex items-center gap-2 text-white mb-1">
                  <ShieldCheck className="text-red-500" />
                  <span className="font-bold text-lg">Admin OS</span>
              </div>
              <p className="text-xs text-stone-500">Super Admin Access</p>
          </div>

          <nav className="flex-1 p-4 space-y-2">
              <button 
                onClick={() => setSection('brands')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${section === 'brands' ? 'bg-stone-800 text-white' : 'hover:bg-stone-800/50'}`}
              >
                  <Building2 size={18} /> Brand Overview
              </button>
              <button 
                onClick={() => setSection('directory')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${section === 'directory' ? 'bg-stone-800 text-white' : 'hover:bg-stone-800/50'}`}
              >
                  <Globe size={18} /> Artisan Directory
              </button>
              <button 
                onClick={() => setSection('alerts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${section === 'alerts' ? 'bg-stone-800 text-white' : 'hover:bg-stone-800/50'}`}
              >
                  <AlertTriangle size={18} /> System Alerts
                  {MOCK_ALERTS.length > 0 && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{MOCK_ALERTS.length}</span>}
              </button>
          </nav>

          <div className="p-4 border-t border-stone-800">
              <div className="bg-stone-800 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold uppercase text-stone-500 mb-1">Total MRR</p>
                  <div className="flex items-center gap-2 text-white">
                      <CreditCard size={16} className="text-green-500" />
                      <span className="text-xl font-bold">${totalMRR}</span>
                  </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 text-stone-500 hover:text-white transition-colors text-sm">
                  <LogOut size={16} /> Sign Out
              </button>
          </div>
      </aside>
  );

  const renderBrands = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-800">Registered Brands</h2>
              <button 
                onClick={handleExportCSV}
                className="bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors"
              >
                  <Download size={16} /> Export CSV
              </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden min-h-[400px]">
              <table className="w-full text-left text-sm">
                  <thead className="bg-stone-50 text-stone-500 font-medium border-b border-stone-200">
                      <tr>
                          <th className="px-6 py-4">Brand Name</th>
                          <th className="px-6 py-4">Plan</th>
                          <th className="px-6 py-4">Artisans</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                      {brands.map(brand => (
                          <tr key={brand.id} className="hover:bg-stone-50/50">
                              <td className="px-6 py-4 font-bold text-stone-800 flex items-center gap-2">
                                  {brand.name}
                                  {brand.verified && <CheckCircle size={14} className="text-blue-500" />}
                              </td>
                              <td className="px-6 py-4">
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                                      brand.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                                      brand.plan === 'PRO' ? 'bg-green-100 text-green-700' :
                                      'bg-stone-100 text-stone-600'
                                  }`}>
                                      {brand.plan}
                                  </span>
                              </td>
                              <td className="px-6 py-4 text-stone-600">{brand.members}</td>
                              <td className="px-6 py-4">
                                  <span className={`flex items-center gap-1.5 text-xs font-bold uppercase ${
                                      brand.status === 'active' ? 'text-green-600' : 'text-red-500'
                                  }`}>
                                      <div className={`w-2 h-2 rounded-full ${brand.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                      {brand.status}
                                  </span>
                              </td>
                              <td className="px-6 py-4 relative">
                                  <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveActionId(activeActionId === brand.id ? null : brand.id);
                                    }}
                                    className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-600"
                                  >
                                      <MoreHorizontal size={20} />
                                  </button>
                                  
                                  {/* DROPDOWN MENU */}
                                  {activeActionId === brand.id && (
                                      <div className="absolute right-6 top-8 w-56 bg-white shadow-xl rounded-lg border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                                          <div className="py-1">
                                              <button 
                                                onClick={() => handleAction(brand.id, 'accept')}
                                                className="w-full text-left px-4 py-2 hover:bg-green-50 text-sm text-stone-700 hover:text-green-700 font-medium flex items-center gap-2"
                                              >
                                                  <CheckCircle size={14} /> Accept / Verify
                                              </button>
                                              <button 
                                                onClick={() => handleAction(brand.id, 'edit')}
                                                className="w-full text-left px-4 py-2 hover:bg-stone-50 text-sm text-stone-700 flex items-center gap-2"
                                              >
                                                  <Edit size={14} /> Edit Details
                                              </button>
                                          </div>
                                          <hr className="border-stone-100" />
                                          <div className="py-1">
                                               <button 
                                                onClick={() => handleAction(brand.id, 'cancel_sub')}
                                                className="w-full text-left px-4 py-2 hover:bg-amber-50 text-sm text-stone-700 hover:text-amber-700 flex items-center gap-2"
                                              >
                                                  <FileMinus size={14} /> Cancel Subscription
                                              </button>
                                              <button 
                                                onClick={() => handleAction(brand.id, 'deny')}
                                                className="w-full text-left px-4 py-2 hover:bg-amber-50 text-sm text-stone-700 hover:text-amber-700 flex items-center gap-2"
                                              >
                                                  <Ban size={14} /> Deny / Suspend
                                              </button>
                                          </div>
                                          <hr className="border-stone-100" />
                                          <div className="py-1">
                                              <button 
                                                onClick={() => handleAction(brand.id, 'delete')}
                                                className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-600 flex items-center gap-2"
                                              >
                                                  <Trash2 size={14} /> Delete
                                              </button>
                                          </div>
                                      </div>
                                  )}
                              </td>
                          </tr>
                      ))}
                      {brands.length === 0 && (
                          <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                                  No brands found.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </table>
          </div>
          {/* Close dropdown on outside click */}
          {activeActionId !== null && (
              <div 
                className="fixed inset-0 z-40 bg-transparent" 
                onClick={() => setActiveActionId(null)} 
              />
          )}
      </div>
  );

  const renderDirectory = () => (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-800">Global Artisan Directory</h2>
              <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-stone-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search artisan, material..." 
                    className="pl-10 pr-4 py-2 rounded-lg border border-stone-200 focus:outline-none focus:border-stone-400 w-64"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
              </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_ARTISANS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.material.toLowerCase().includes(searchTerm.toLowerCase())).map(artisan => (
                  <div key={artisan.id} className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex items-start gap-4">
                      <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 font-bold">
                          {artisan.name[0]}
                      </div>
                      <div>
                          <h4 className="font-bold text-stone-800">{artisan.name}</h4>
                          <p className="text-xs text-stone-500 mb-2">{artisan.brand}</p>
                          <div className="flex gap-2">
                              <span className="flex items-center gap-1 text-[10px] bg-stone-50 px-2 py-1 rounded text-stone-600 border border-stone-100">
                                  <MapPin size={10} /> {artisan.location}
                              </span>
                              <span className="flex items-center gap-1 text-[10px] bg-stone-50 px-2 py-1 rounded text-stone-600 border border-stone-100">
                                  <Hammer size={10} /> {artisan.material}
                              </span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>
  );

  const renderAlerts = () => (
      <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-stone-800">System Alerts</h2>
          <div className="bg-white rounded-xl shadow-sm border border-stone-200 divide-y divide-stone-100">
              {MOCK_ALERTS.map(alert => (
                  <div key={alert.id} className="p-4 flex gap-4 hover:bg-stone-50/50 transition-colors">
                      <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          alert.severity === 'CRITICAL' ? 'bg-red-600 text-white animate-pulse' :
                          alert.severity === 'HIGH' ? 'bg-red-100 text-red-600' :
                          alert.severity === 'MEDIUM' ? 'bg-amber-100 text-amber-600' :
                          'bg-blue-100 text-blue-600'
                      }`}>
                          <AlertTriangle size={16} />
                      </div>
                      <div className="flex-1">
                          <div className="flex justify-between mb-1">
                              <h4 className="font-bold text-stone-800 text-sm flex items-center gap-2">
                                  {alert.type}
                                  {alert.score && <span className="text-[10px] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">Score: {alert.score}</span>}
                              </h4>
                              <span className="text-xs text-stone-400">{alert.time}</span>
                          </div>
                          <p className="text-sm text-stone-600">{alert.message}</p>
                      </div>
                      <button className="self-center text-stone-400 hover:text-stone-600">
                          <ArrowRight size={16} />
                      </button>
                  </div>
              ))}
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
        {renderSidebar()}
        
        <main className="pl-64">
            <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-end px-8">
                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-bold text-stone-800">SysAdmin</p>
                        <p className="text-xs text-stone-500">Root Access</p>
                    </div>
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white font-bold text-xs">SA</div>
                </div>
            </header>

            <div className="p-8">
                {section === 'brands' && renderBrands()}
                {section === 'directory' && renderDirectory()}
                {section === 'alerts' && renderAlerts()}
            </div>
        </main>
    </div>
  );
};