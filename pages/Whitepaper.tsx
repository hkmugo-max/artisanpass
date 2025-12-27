import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Download, ShieldCheck, Lock, Globe, Database, Wifi, Leaf, FileText } from '../components/Icons';

export const Whitepaper: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-earth transition-colors"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Technical Documentation</span>
          <button className="flex items-center gap-2 text-sm font-bold text-clay hover:text-earth transition-colors">
            <Download size={18} /> <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-16">
        
        {/* Header */}
        <header className="mb-16 border-b border-stone-100 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-bold uppercase tracking-wider mb-6">
             Version 2.4 • Updated Oct 2025
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-earth mb-6 leading-tight">
            Decentralized Traceability for the <br/> EU Digital Product Passport
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed max-w-2xl">
            A technical overview of ArtisanPass's "Offline-First" architecture and its alignment with ESPR (Ecodesign for Sustainable Products Regulation) mandates.
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-12">
          
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-16">
            
            {/* Section 1 */}
            <section>
              <h2 className="text-2xl font-bold text-earth mb-4 flex items-center gap-3">
                <Wifi className="text-clay" /> 1. The Connectivity Gap
              </h2>
              <p className="text-stone-600 mb-4 leading-relaxed">
                The EU Digital Product Passport (DPP) mandate requires granular data collection from the raw material stage. However, 85% of artisanal wool and cotton production occurs in regions with intermittent connectivity (Edge/2G).
              </p>
              <p className="text-stone-600 leading-relaxed">
                Standard cloud-dependent ERP systems fail in these environments, creating a "Compliance Exclusion Zone" for small-scale producers. ArtisanPass addresses this via a <strong>Local-First, Cloud-Sync</strong> architecture using IndexedDB and background service workers.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-2xl font-bold text-earth mb-4 flex items-center gap-3">
                <ShieldCheck className="text-clay" /> 2. Data Integrity & Anti-Fraud
              </h2>
              <p className="text-stone-600 mb-6 leading-relaxed">
                To prevent "Greenwashing" (falsified sustainability claims), ArtisanPass employs a multi-layered verification protocol:
              </p>
              
              <div className="bg-stone-50 rounded-xl p-6 border border-stone-200 space-y-4">
                <div className="flex gap-4">
                  <div className="mt-1"><Globe size={20} className="text-stone-400"/></div>
                  <div>
                    <h4 className="font-bold text-stone-800">Geospatial Triangulation</h4>
                    <p className="text-sm text-stone-500">GPS logs are cross-referenced with known production zones. Distance anomalies (>50km variance) trigger automatic risk flags.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><Lock size={20} className="text-stone-400"/></div>
                  <div>
                    <h4 className="font-bold text-stone-800">Immutable Chronology</h4>
                    <p className="text-sm text-stone-500">Logs are cryptographically linked. Timestamps cannot be retroactively altered once synced to the ledger.</p>
                  </div>
                </div>
              </div>
            </section>

             {/* Section 3 */}
             <section>
              <h2 className="text-2xl font-bold text-earth mb-4 flex items-center gap-3">
                <Leaf className="text-clay" /> 3. Carbon Accounting (ISO 14067)
              </h2>
              <p className="text-stone-600 mb-4 leading-relaxed">
                Scope 3 emissions are calculated using the <strong>Material Kilometers</strong> method. By tracking the exact geodetic distance of physical material movement from Intake to Finishing, we provide an audit-ready dataset for carbon footprint estimation.
              </p>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-green-800 text-sm font-medium">
                Compliant with: ISO 14067 (Carbon Footprint of Products) and PEF (Product Environmental Footprint) Category Rules.
              </div>
            </section>

          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
             <div className="bg-stone-900 text-white p-6 rounded-2xl shadow-xl">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Database size={18} /> Tech Stack</h3>
               <ul className="space-y-3 text-sm text-stone-400">
                 <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span>Database</span>
                   <span className="text-white">PostgreSQL (EU)</span>
                 </li>
                 <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span>Local Storage</span>
                   <span className="text-white">IndexedDB</span>
                 </li>
                 <li className="flex justify-between border-b border-stone-800 pb-2">
                   <span>Encryption</span>
                   <span className="text-white">AES-256</span>
                 </li>
                 <li className="flex justify-between pt-2">
                   <span>AI Model</span>
                   <span className="text-white">Gemini 3.0 Flash</span>
                 </li>
               </ul>
             </div>

             <div className="border border-stone-200 p-6 rounded-2xl">
               <h3 className="font-bold text-stone-800 mb-2">Need API Access?</h3>
               <p className="text-stone-500 text-sm mb-4">
                 Enterprise partners can integrate ArtisanPass directly into SAP/Oracle ERPs.
               </p>
               <button className="text-clay font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                 Read API Docs <ArrowRight size={16} />
               </button>
             </div>
          </aside>

        </div>
      </main>
      
      <footer className="bg-stone-50 border-t border-stone-200 py-12 text-center">
         <p className="text-stone-400 text-sm">&copy; 2025 ArtisanPass RegTech Solutions.</p>
      </footer>
    </div>
  );
};