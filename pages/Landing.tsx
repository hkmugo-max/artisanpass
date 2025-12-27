import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Leaf, Building2, Lock, FileText, Recycle, Hammer, QrCode, CheckCircle, Star, BookOpen } from '../components/Icons';
import { authService } from '../services/authService';
import { PricingCheckout } from '../components/PricingCheckout';

export const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleEnterApp = () => {
    const user = authService.getCurrentUser();
    if (user) {
        if (user.role === 'artisan') navigate('/capture');
        else if (user.role === 'admin') navigate('/admin');
        else navigate('/dashboard');
    } else {
        navigate('/auth');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => alert("Thanks! We've added you to the 2026 Pilot waitlist."), 100);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-clay selection:text-white overflow-x-hidden">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-clay rounded-lg flex items-center justify-center text-white shadow-md">
                    <Leaf size={20} />
                </div>
                <span className="text-xl font-serif font-bold text-earth tracking-tight">ArtisanPass</span>
            </div>
            <div className="flex items-center gap-6">
                <button 
                  onClick={() => navigate('/guide')}
                  className="hidden md:block text-sm font-medium text-stone-500 hover:text-earth transition-colors"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="hidden md:block text-sm font-medium text-stone-500 hover:text-earth transition-colors"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => navigate('/help')} 
                  className="hidden md:block text-sm font-medium text-stone-500 hover:text-earth transition-colors"
                >
                  Help Center
                </button>
                <button 
                  onClick={() => navigate('/staff-access')} 
                  className="hidden md:block text-stone-400 hover:text-earth transition-colors"
                  title="Staff Access"
                >
                  <Lock size={16} />
                </button>
                <button 
                onClick={handleEnterApp}
                className="text-sm font-bold text-earth border border-stone-300 px-4 py-2 rounded-full hover:bg-stone-100 transition-all"
                >
                Sign In
                </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 shadow-sm text-stone-600 text-xs font-bold uppercase tracking-widest mb-8 animate-fade-in">
           <Star size={12} className="text-clay fill-clay" /> 2026 Compliance Ready
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-bold text-stone-900 mb-6 leading-[1.1]">
          Data-Backed Transparency <br />
          <span className="text-stone-400 italic">for the</span> <span className="text-clay">Modern Supply Chain.</span>
        </h1>

        <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
          Empower remote artisans with offline-first tools while automating risk mitigation and ESG reporting for global enterprise brands.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <button 
            onClick={handleEnterApp}
            className="w-full sm:w-auto px-8 py-4 bg-earth text-white rounded-full font-bold text-lg shadow-xl hover:bg-stone-800 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            Start Free Trial <ArrowRight size={20} />
          </button>
          
          <button
            onClick={() => navigate('/whitepaper')}
            className="flex items-center gap-2 text-stone-500 hover:text-clay underline decoration-stone-300 underline-offset-4 transition-colors"
          >
            <BookOpen size={16} /> Read the Compliance Whitepaper
          </button>
        </div>

        {/* --- DEVICE MOCKUPS (CSS Composition) --- */}
        <div className="relative w-full max-w-5xl mx-auto h-[400px] md:h-[600px] mt-10 perspective-1000">
            {/* Laptop: Brand Dashboard */}
            <div className="absolute top-10 left-[10%] w-[80%] h-[80%] bg-stone-900 rounded-t-3xl shadow-2xl border-4 border-stone-800 z-10 overflow-hidden hidden md:block transform transition-transform hover:-translate-y-2 duration-500">
                <div className="bg-stone-800 p-2 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="p-8 grid grid-cols-3 gap-6 bg-stone-50 h-full">
                    {/* Abstract Dashboard UI */}
                    <div className="col-span-2 space-y-4">
                        <div className="h-32 bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                            <div className="w-1/3 h-4 bg-stone-100 rounded mb-4"></div>
                            <div className="w-full h-16 bg-blue-50/50 rounded flex items-end pb-2 justify-around">
                                <div className="w-4 h-8 bg-blue-200 rounded-t"></div>
                                <div className="w-4 h-12 bg-blue-300 rounded-t"></div>
                                <div className="w-4 h-6 bg-blue-200 rounded-t"></div>
                                <div className="w-4 h-10 bg-blue-400 rounded-t"></div>
                            </div>
                        </div>
                        <div className="h-48 bg-white rounded-xl shadow-sm border border-stone-100 p-4">
                            <div className="w-1/4 h-4 bg-stone-100 rounded mb-4"></div>
                             <div className="space-y-2">
                                <div className="h-10 w-full bg-stone-50 rounded flex items-center px-4 gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100"></div>
                                    <div className="h-2 w-1/2 bg-stone-200 rounded"></div>
                                </div>
                                <div className="h-10 w-full bg-stone-50 rounded flex items-center px-4 gap-4">
                                    <div className="w-6 h-6 rounded-full bg-amber-100"></div>
                                    <div className="h-2 w-1/3 bg-stone-200 rounded"></div>
                                </div>
                             </div>
                        </div>
                    </div>
                    <div className="col-span-1 space-y-4">
                         <div className="h-full bg-white rounded-xl shadow-sm border border-stone-100 p-4 relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-white to-stone-50"></div>
                             <div className="relative z-10 text-center pt-8">
                                 <div className="w-20 h-20 rounded-full border-4 border-clay mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-clay">98</div>
                                 <div className="text-xs font-bold uppercase text-stone-400">Risk Score</div>
                             </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Phone: Artisan App */}
            <div className="absolute bottom-0 right-[5%] md:right-[-20px] w-[280px] md:w-[300px] h-[550px] bg-stone-900 rounded-[3rem] shadow-2xl border-[8px] border-stone-800 z-20 overflow-hidden transform md:-rotate-6 md:-translate-x-20 transition-transform hover:-translate-y-4 duration-500">
                <div className="absolute top-0 w-full h-8 bg-stone-900 z-30 flex justify-center">
                    <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
                </div>
                <div className="w-full h-full bg-stone-50 pt-12 pb-8 px-4 flex flex-col relative">
                     {/* Mock App UI */}
                     <div className="flex justify-between items-center mb-6">
                         <div className="w-8 h-8 bg-clay rounded-lg"></div>
                         <div className="w-8 h-8 bg-stone-200 rounded-full"></div>
                     </div>
                     <div className="text-2xl font-serif font-bold text-stone-800 mb-2">New Item</div>
                     <div className="h-48 bg-stone-200 rounded-2xl mb-6 flex items-center justify-center">
                         <div className="w-16 h-16 rounded-full bg-white/50 flex items-center justify-center">
                            <Hammer className="text-stone-400" />
                         </div>
                     </div>
                     <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-leaf mb-4">
                         <div className="text-xs font-bold text-stone-400 uppercase">Voice AI</div>
                         <div className="text-sm font-medium text-stone-800">"Alpaca wool batch #402..."</div>
                     </div>
                     <div className="mt-auto w-full h-12 bg-earth rounded-xl shadow-lg"></div>
                </div>
            </div>
        </div>
      </header>

      {/* --- TRUST BAR --- */}
      <section className="bg-white py-10 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-6 text-center">
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Trusted by forward-thinking brands & compliant with</p>
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="flex items-center gap-2 font-bold text-xl text-stone-800">
                      <Globe className="text-blue-600" /> EU DPP Compliant
                  </div>
                  <div className="flex items-center gap-2 font-bold text-xl text-stone-800">
                      <QrCode className="text-orange-600" /> GS1 Digital Link
                  </div>
                  <div className="flex items-center gap-2 font-bold text-xl text-stone-800">
                      <Lock className="text-green-600" /> ISO 27001
                  </div>
              </div>
          </div>
      </section>

      {/* --- DUAL VALUE PROP --- */}
      <section className="py-24 max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
              
              {/* Left: For Makers */}
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200 shadow-xl shadow-stone-200/50 relative overflow-hidden group hover:border-clay/30 transition-all">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-clay/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-clay rounded-2xl flex items-center justify-center text-white mb-6">
                          <Hammer size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-clay uppercase tracking-widest mb-2">For Makers</h3>
                      <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">The Field App</h2>
                      <p className="text-stone-500 mb-8 leading-relaxed">
                          Built for low-connectivity environments. Artisans use voice and photos to log production in seconds, generating verifiable digital passports without disruption.
                      </p>
                      <ul className="space-y-3">
                          {[
                              "Offline-first Architecture",
                              "Voice-to-Text Logging",
                              "Low-Literacy Visual UI"
                          ].map(item => (
                              <li key={item} className="flex items-center gap-3 text-stone-700 font-medium">
                                  <CheckCircle size={18} className="text-leaf" /> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

              {/* Right: For Brands */}
              <div className="bg-stone-900 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-stone-800 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                  <div className="relative z-10">
                      <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
                          <Building2 size={24} />
                      </div>
                      <h3 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-2">For Brands</h3>
                      <h2 className="text-3xl font-serif font-bold text-white mb-4">The Command Center</h2>
                      <p className="text-stone-400 mb-8 leading-relaxed">
                          Monitor your global supply chain in real-time. Instantly detect fraud risks, calculate Scope 3 carbon emissions, and export audit-ready compliance reports.
                      </p>
                      <ul className="space-y-3">
                          {[
                              "Scope 3 Carbon Calculation",
                              "Geofenced Fraud Detection",
                              "Consumer Engagement Heatmaps"
                          ].map(item => (
                              <li key={item} className="flex items-center gap-3 text-stone-300 font-medium">
                                  <div className="bg-green-500/20 p-1 rounded-full"><CheckCircle size={14} className="text-green-400" /></div> {item}
                              </li>
                          ))}
                      </ul>
                  </div>
              </div>

          </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="bg-stone-100 py-24 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-4xl font-serif font-bold text-earth mb-4">Compliance at any scale.</h2>
                  <p className="text-stone-500">Transparent pricing. No hidden implementation fees.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <PricingCheckout 
                    tierName="Boutique"
                    price={49}
                    interval="mo"
                    paddleProductId={1001} // Mock ID
                    features={[
                        "500 Digital Passports / yr",
                        "Basic Traceability",
                        "PDF Exports"
                    ]}
                  />
                  
                  <PricingCheckout 
                    tierName="Enterprise"
                    price={249}
                    interval="mo"
                    paddleProductId={1002} // Mock ID
                    isPopular={true}
                    features={[
                        "Unlimited Passports",
                        "Advanced Risk & Carbon Analytics",
                        "API & ERP Integration",
                        "Dedicated Success Manager"
                    ]}
                  />
              </div>
          </div>
      </section>

      {/* --- LEAD CAPTURE --- */}
      <section className="py-24 px-6 bg-white">
          <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-earth mb-6">Join the 2026 Compliance Pilot</h2>
              <p className="text-stone-500 mb-10 leading-relaxed">
                  Regulations are changing fast. Secure your spot in our exclusive pilot program to ensure your supply chain is ready for the EU Digital Product Passport mandate.
              </p>

              {formSubmitted ? (
                  <div className="bg-green-50 p-6 rounded-2xl border border-green-200 text-green-800 flex items-center justify-center gap-3 animate-fade-in">
                      <CheckCircle /> Thank you! We'll be in touch shortly.
                  </div>
              ) : (
                  <form onSubmit={handleLeadSubmit} className="bg-stone-50 p-8 rounded-3xl border border-stone-100 shadow-lg text-left space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Work Email</label>
                              <input 
                                  type="email" 
                                  required 
                                  value={email}
                                  onChange={e => setEmail(e.target.value)}
                                  className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-clay" 
                                  placeholder="name@company.com" 
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-stone-500 uppercase mb-2">Company Size</label>
                              <div className="relative">
                                  <select 
                                      value={companySize}
                                      onChange={e => setCompanySize(e.target.value)}
                                      className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:border-clay appearance-none bg-white"
                                  >
                                      <option value="1-10">1 - 10 Employees</option>
                                      <option value="11-50">11 - 50 Employees</option>
                                      <option value="51-200">51 - 200 Employees</option>
                                      <option value="200+">200+ Employees</option>
                                  </select>
                                  <div className="absolute right-3 top-3.5 pointer-events-none text-stone-400">
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <button type="submit" className="w-full py-4 bg-earth text-white font-bold rounded-xl shadow-md hover:bg-stone-800 transition-colors">
                          Secure My Spot
                      </button>
                      <p className="text-xs text-center text-stone-400 pt-2">Limited to 50 brands for Q3 2025.</p>
                  </form>
              )}
          </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-stone-900 text-stone-400 py-12 text-center text-sm border-t border-stone-800">
        <div className="flex justify-center gap-6 mb-8 opacity-50">
            <Globe /> <Recycle /> <ShieldCheck />
        </div>
        <p className="mb-4">&copy; {new Date().getFullYear()} ArtisanPass. Built for the Ethical Economy.</p>
        <div className="flex justify-center gap-6 text-xs text-stone-500">
            <button onClick={() => navigate('/privacy')} className="hover:text-stone-300 transition-colors">Privacy Policy</button>
            <button onClick={() => navigate('/terms')} className="hover:text-stone-300 transition-colors">Terms of Service</button>
            <button onClick={() => navigate('/whitepaper')} className="hover:text-stone-300 transition-colors">Compliance Whitepaper</button>
            <button onClick={() => navigate('/help')} className="hover:text-stone-300 transition-colors">Help Center</button>
        </div>
      </footer>
    </div>
  );
};