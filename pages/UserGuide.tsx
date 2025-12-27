import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Hammer, 
  Building2, 
  Mic, 
  Camera, 
  WifiOff, 
  CheckCircle, 
  QrCode, 
  ShieldCheck, 
  Globe, 
  FileText,
  CloudLightning,
  MapPin
} from '../components/Icons';

type GuideTab = 'artisan' | 'brand';

export const UserGuide: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<GuideTab>('artisan');

  const artisanSteps = [
    {
      title: "1. Work Offline Anywhere",
      desc: "No internet? No problem. Open the app in the field. All data is saved to your device automatically.",
      icon: <WifiOff className="text-stone-500" size={24} />
    },
    {
      title: "2. Start a New Item",
      desc: "Tap the big 'New Item' button. This creates a digital record for the product you are about to make.",
      icon: <Hammer className="text-clay" size={24} />
    },
    {
      title: "3. Voice & Photo Intake",
      desc: "Don't like typing? Tap the Microphone icon to describe your materials (e.g., 'Alpaca wool from Cusco'). Then, snap a photo.",
      icon: <Mic className="text-clay" size={24} />
    },
    {
      title: "4. Log Your Progress",
      desc: "As you weave or build, take quick photos of the 'Creation' and 'Finishing' stages to prove authenticity.",
      icon: <Camera className="text-clay" size={24} />
    },
    {
      title: "5. Sync When Online",
      desc: "When you return to a Wi-Fi zone, the app will automatically upload your work to the Brand Dashboard.",
      icon: <CloudLightning className="text-yellow-500" size={24} />
    }
  ];

  const brandSteps = [
    {
      title: "1. Real-Time Dashboard",
      desc: "Monitor incoming data from your global artisan network. See what is being made and where.",
      icon: <Globe className="text-blue-500" size={24} />
    },
    {
      title: "2. Verify Compliance",
      desc: "Check the 'Risk Score'. The AI verifies GPS location, timestamps, and photo evidence to prevent fraud.",
      icon: <ShieldCheck className="text-green-600" size={24} />
    },
    {
      title: "3. Generate Digital Passports",
      desc: "Once an item is finished, a unique QR code (GS1 Digital Link) is generated automatically.",
      icon: <QrCode className="text-stone-800" size={24} />
    },
    {
      title: "4. Export EU Reports",
      desc: "Need to clear customs? Download the PDF Report containing carbon estimates and material origins.",
      icon: <FileText className="text-stone-600" size={24} />
    },
    {
      title: "5. Share the Story",
      desc: "Consumers scan the QR code to see the 'Public Tracking' page—showing the artisan's journey.",
      icon: <MapPin className="text-red-500" size={24} />
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-earth transition-colors"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">User Guide</span>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-earth mb-4">
            How to use ArtisanPass
          </h1>
          <p className="text-stone-500 text-lg max-w-xl mx-auto">
            Whether you are a maker in the field or a manager in the office, here is how to get the most out of the platform.
          </p>
        </header>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-16">
          <div className="bg-stone-200 p-1.5 rounded-2xl flex gap-2">
            <button
              onClick={() => setActiveTab('artisan')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'artisan' 
                  ? 'bg-white text-clay shadow-md' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Hammer size={18} /> For Artisans
            </button>
            <button
              onClick={() => setActiveTab('brand')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'brand' 
                  ? 'bg-white text-earth shadow-md' 
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              <Building2 size={18} /> For Brands
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-1 gap-6 max-w-2xl mx-auto relative">
          
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-stone-200 hidden md:block"></div>

          {(activeTab === 'artisan' ? artisanSteps : brandSteps).map((step, index) => (
            <div key={index} className="relative bg-white p-6 rounded-2xl border border-stone-100 shadow-sm flex gap-6 md:items-start transition-all hover:-translate-y-1 hover:shadow-md animate-fade-in">
              
              {/* Number Badge */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center border border-stone-200">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-stone-900 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-white">
                  {index + 1}
                </div>
              </div>

              <div className="pt-1">
                <h3 className="text-xl font-bold text-stone-800 mb-2">{step.title}</h3>
                <p className="text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}

        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center bg-clay/10 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold text-earth mb-4">Ready to start?</h2>
            <div className="flex justify-center gap-4">
                <button 
                  onClick={() => navigate('/auth')}
                  className="bg-earth text-white px-8 py-3 rounded-xl font-bold hover:bg-stone-800 transition-colors"
                >
                  Sign In Now
                </button>
            </div>
        </div>

      </main>
    </div>
  );
};