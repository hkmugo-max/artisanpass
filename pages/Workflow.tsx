import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product, Stage, LogEntry, Material, DPPData } from '../types';
import { CameraTrigger } from '../components/CameraTrigger';
import { ClipboardList, Scissors, CheckCircle, QrCode, ArrowRight, Leaf, MapPin, Loader2, Mic, Square, FileText, Lock, Share2, Edit } from '../components/Icons';
import { analyzeMaterialImage, generateDPPStory } from '../services/geminiService';
import { getGeoLocation, saveLog } from '../services/uploadManager';
import { hasFeatureAccess, upgradeUser, subscribeToTierChanges } from '../services/subscriptionService';
import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { authService } from '../services/authService';

// Mock Data for Smart Suggestions
const MATERIAL_SUGGESTIONS = [
    "Alpaca Wool (Premium)",
    "Organic Cotton",
    "Recycled Polyester",
    "Sheep Wool",
    "Silk",
    "Hemp",
    "Natural Dye",
    "Bamboo Fiber"
];

interface Props {
  products: Product[];
  updateProduct: (p: Product) => void;
  isOnline: boolean;
}

const Workflow: React.FC<Props> = ({ products, updateProduct, isOnline }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = products.find(p => p.id === id);
  const [activeStage, setActiveStage] = useState<Stage>(Stage.INTAKE);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Success Feedback State
  
  // Feature Gating state
  const [canExport, setCanExport] = useState(hasFeatureAccess('export_compliance'));
  
  // Smart Navigation Logic
  const user = authService.getCurrentUser();
  const backLink = user?.role === 'artisan' ? '/capture' : '/dashboard';
  
  // Local state for current step inputs
  const [tempImage, setTempImage] = useState<string | null>(null);
  
  // -- NEW: Hybrid Form State --
  const [intakeForm, setIntakeForm] = useState({
      type: '',
      quantity: '',
      origin: ''
  });
  const [listeningField, setListeningField] = useState<string | null>(null);

  // Subscribe to tier changes
  useEffect(() => {
    return subscribeToTierChanges(() => {
        setCanExport(hasFeatureAccess('export_compliance'));
    });
  }, []);
  
  if (!product) return <div>Product not found</div>;

  // Determine active stage based on logs
  useEffect(() => {
    if (product.status === 'Completed') {
        setActiveStage(Stage.SERIALIZATION);
        return;
    }
    const hasIntake = product.logs.some(l => l.stage === Stage.INTAKE);
    const hasCreation = product.logs.some(l => l.stage === Stage.CREATION);
    const hasFinishing = product.logs.some(l => l.stage === Stage.FINISHING);

    if (!hasIntake) setActiveStage(Stage.INTAKE);
    else if (!hasCreation) setActiveStage(Stage.CREATION);
    else if (!hasFinishing) setActiveStage(Stage.FINISHING);
    else setActiveStage(Stage.SERIALIZATION);
  }, [product]);

  // --- VOICE INPUT HANDLER ---
  const handleVoiceInput = (field: keyof typeof intakeForm) => {
    // 1. Check Support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Voice not supported on this device. Please type.");
        return;
    }

    // 2. Offline check for voice (Voice API usually requires net)
    if (!isOnline && !('SpeechRecognition' in window)) {
        alert("Voice unavailable offline. Please type details.");
        return;
    }

    // @ts-ignore - Webkit prefix
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
        setListeningField(field);
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIntakeForm(prev => ({ ...prev, [field]: transcript }));
        setListeningField(null);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech error", event.error);
        setListeningField(null);
        alert("Voice capture failed. Please try again or type.");
    };

    recognition.onend = () => {
        setListeningField(null);
    };

    recognition.start();
  };


  const addLog = async (description: string, photoUrl?: string, materials?: Material[], dpp?: DPPData) => {
    setSaving(true);
    
    try {
        const gps = await getGeoLocation();
        
        const newLog: LogEntry = {
            id: Date.now().toString(),
            stage: activeStage,
            timestamp: new Date().toISOString(),
            description,
            photoUrl,
            gps: gps,
            deviceId: 'DEVICE_ID_12345'
        };

        // 1. SAVE TO DB (Async)
        const savedToCloud = await saveLog('logs', newLog, isOnline);
        if(materials) await saveLog('materials', materials, isOnline);

        // 2. TRIGGER SUCCESS FEEDBACK
        setSaving(false);
        setShowSuccess(true);

        // 3. WAIT FOR ANIMATION (1.5s) BEFORE UPDATING UI STATE
        setTimeout(() => {
            const updatedProduct: Product = { 
                ...product, 
                synced: savedToCloud,
                logs: [...product.logs, newLog], 
                materials: materials ? [...product.materials, ...materials] : product.materials,
                thumbnail: (!product.thumbnail && photoUrl) ? photoUrl : product.thumbnail,
                dppData: dpp ? dpp : product.dppData,
                status: dpp ? 'Completed' : product.status
            };

            updateProduct(updatedProduct);
            
            // Clear Form
            setTempImage(null);
            setIntakeForm({ type: '', quantity: '', origin: '' });
            setShowSuccess(false);
        }, 1500);

    } catch (error) {
        console.error("Error saving log:", error);
        setSaving(false);
        alert("Failed to save. Please try again.");
    }
  };

  const handleConfirmIntake = () => {
     if (!intakeForm.type || !intakeForm.origin) {
         alert("Please fill in Material Type and Origin.");
         return;
     }

     const mat: Material = {
         id: Date.now().toString(),
         type: intakeForm.type,
         origin: intakeForm.origin,
         supplierId: 'SUPPLIER_LOCAL',
         timestamp: new Date().toISOString(),
         photoUrl: tempImage || undefined,
         quality: "Standard", // Defaulting for now
         quantity: intakeForm.quantity
     };

     const desc = `Intake: ${mat.quantity || ''} ${mat.type} from ${mat.origin}.`;
     addLog(desc, tempImage || undefined, [mat]);
  };

  const handleCreationSubmit = () => {
      addLog("Weaving process completed. Duration: 4h 30m.", tempImage || undefined);
  };

  const handleFinishingSubmit = async () => {
     setLoadingAI(true);
     await generateDPPStory(product); 
     const dppMock: DPPData = {
         uid: `EU-DPP-${product.id.slice(0,8)}`,
         carbonFootprintEstimate: 12.5,
         recyclability: "100% Organic",
         complianceStandard: "ISO-14001"
     };
     addLog("Quality check passed. Dimensions verified.", tempImage || undefined, undefined, dppMock);
     setLoadingAI(false);
  };

  const handleExportReport = () => {
      if (!canExport) {
          if(confirm("This feature is only available on the PRO plan. Upgrade now?")) {
              upgradeUser();
              alert("Upgraded to PRO! You can now download the report.");
          }
          return;
      }
      
      const reportContent = `DPP REPORT: ${product.name} \n ...`;
      const blob = new Blob([reportContent], {type: 'text/plain'});
      const url = URL.createObjectURL(blob);
      const element = document.createElement("a");
      element.href = url;
      element.download = `DPP_Report_${product.id}.txt`;
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);
  };

  // --- RENDERERS FOR EACH STAGE ---

  const renderIntake = () => {
    const isFormValid = intakeForm.type.length > 0 && intakeForm.origin.length > 0;

    return (
    <div className="space-y-6 pb-20">
       <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
          <h2 className="text-xl font-bold text-earth flex items-center gap-2">
            <ClipboardList /> Material Intake
          </h2>
          <p className="text-stone-500 text-sm mt-1">Step 1: Document raw materials.</p>
       </div>
        
       {/* 1. PHOTO CAPTURE (With AI Pre-fill) */}
       {tempImage ? (
           <div className="relative">
               <img src={tempImage} alt="Material" className="rounded-xl shadow-md w-full h-48 object-cover" />
               <button 
                onClick={() => setTempImage(null)}
                className="absolute top-2 right-2 bg-stone-900/70 text-white p-2 rounded-full"
               >
                   <Edit size={16} />
               </button>
               {loadingAI && <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-xl"><Loader2 className="animate-spin text-earth" /></div>}
           </div>
       ) : (
           <CameraTrigger 
            label="1. Take Material Photo" 
            isLoading={loadingAI}
            onCapture={async (file, base64) => {
                setTempImage(base64);
                setLoadingAI(true);
                // AI Pre-fill Logic
                if (isOnline) {
                    try {
                        const analysis = await analyzeMaterialImage(base64);
                        if (analysis) {
                            setIntakeForm(prev => ({
                                ...prev,
                                type: analysis.type !== "Unknown" ? analysis.type : prev.type,
                                origin: analysis.originGuess !== "Unknown" ? analysis.originGuess : prev.origin
                            }));
                        }
                    } catch (e) { console.error(e); }
                }
                setLoadingAI(false);
            }} 
           />
       )}

       {/* 2. HYBRID FORM */}
       <div className="space-y-4 animate-fade-in">
           <h3 className="font-bold text-stone-600 uppercase text-xs tracking-wider ml-1">2. Material Details</h3>
           
           {/* FIELD: Material Type */}
           <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 focus-within:border-clay focus-within:ring-1 focus-within:ring-clay transition-all">
                <div className="flex-1 px-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase block">Material Type *</label>
                    <input 
                        list="material-suggestions"
                        type="text"
                        value={intakeForm.type}
                        onChange={(e) => setIntakeForm(prev => ({ ...prev, type: e.target.value }))}
                        placeholder="e.g. Alpaca Wool"
                        className="w-full text-lg font-bold text-stone-800 outline-none bg-transparent placeholder-stone-300"
                    />
                    <datalist id="material-suggestions">
                        {MATERIAL_SUGGESTIONS.map(m => <option key={m} value={m} />)}
                    </datalist>
                </div>
                <button 
                    onClick={() => handleVoiceInput('type')}
                    className={`p-4 rounded-xl transition-all active:scale-95 ${listeningField === 'type' ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-100 text-clay'}`}
                >
                    <Mic size={24} />
                </button>
           </div>

           {/* FIELD: Quantity */}
           <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 focus-within:border-clay focus-within:ring-1 focus-within:ring-clay transition-all">
                <div className="flex-1 px-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase block">Quantity</label>
                    <input 
                        type="text" // Text to allow units like "5kg"
                        value={intakeForm.quantity}
                        onChange={(e) => setIntakeForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="e.g. 5kg"
                        className="w-full text-lg font-bold text-stone-800 outline-none bg-transparent placeholder-stone-300"
                    />
                </div>
                <button 
                    onClick={() => handleVoiceInput('quantity')}
                    className={`p-4 rounded-xl transition-all active:scale-95 ${listeningField === 'quantity' ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-100 text-clay'}`}
                >
                    <Mic size={24} />
                </button>
           </div>

           {/* FIELD: Origin */}
           <div className="bg-white p-2 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 focus-within:border-clay focus-within:ring-1 focus-within:ring-clay transition-all">
                <div className="flex-1 px-2">
                    <label className="text-[10px] font-bold text-stone-400 uppercase block">Origin (Location) *</label>
                    <input 
                        type="text"
                        value={intakeForm.origin}
                        onChange={(e) => setIntakeForm(prev => ({ ...prev, origin: e.target.value }))}
                        placeholder="e.g. Cusco Valley"
                        className="w-full text-lg font-bold text-stone-800 outline-none bg-transparent placeholder-stone-300"
                    />
                </div>
                <button 
                    onClick={() => handleVoiceInput('origin')}
                    className={`p-4 rounded-xl transition-all active:scale-95 ${listeningField === 'origin' ? 'bg-red-500 text-white animate-pulse' : 'bg-stone-100 text-clay'}`}
                >
                    <Mic size={24} />
                </button>
           </div>
       </div>

       <button 
        onClick={handleConfirmIntake}
        disabled={!isFormValid || saving}
        className="w-full py-4 bg-earth text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
       >
           {saving ? <Loader2 className="animate-spin" /> : "Confirm Material Intake"}
       </button>
    </div>
    );
  };

  const renderCreation = () => (
    <div className="space-y-6">
       <div className="bg-white p-4 rounded-xl border border-stone-200">
          <h2 className="text-xl font-bold text-earth flex items-center gap-2">
            <Scissors /> Creation Log
          </h2>
          <p className="text-stone-500 text-sm mt-1">Step 2: Document the making process.</p>
       </div>

       <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
           <h3 className="text-xs font-bold uppercase text-stone-400 mb-2">Workspace Conditions</h3>
           <div className="h-32 w-full">
               <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={[
                       {time: '10am', temp: 22}, {time: '11am', temp: 24}, {time: '12pm', temp: 25}, {time: '1pm', temp: 23}
                   ]}>
                       <Line type="monotone" dataKey="temp" stroke="#C88D65" strokeWidth={3} dot={false} />
                       <Tooltip />
                   </LineChart>
               </ResponsiveContainer>
           </div>
           <div className="flex justify-between text-xs text-stone-500 mt-2">
               <span>Humidity: 45%</span>
               <span>Temp: 24°C</span>
           </div>
       </div>

       {tempImage ? (
           <div className="space-y-4">
               <img src={tempImage} alt="Work in Progress" className="rounded-xl shadow-md w-full h-64 object-cover" />
               <button 
                onClick={handleCreationSubmit}
                disabled={saving}
                className="w-full py-4 bg-earth text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex justify-center"
               >
                   {saving ? <Loader2 className="animate-spin" /> : "Log Progress"}
               </button>
           </div>
       ) : (
           <CameraTrigger 
            label="Capture Progress" 
            onCapture={(_f, base64) => setTempImage(base64)} 
           />
       )}
    </div>
  );

  const renderFinishing = () => (
    <div className="space-y-6">
       <div className="bg-white p-4 rounded-xl border border-stone-200">
          <h2 className="text-xl font-bold text-earth flex items-center gap-2">
            <CheckCircle /> Finishing
          </h2>
          <p className="text-stone-500 text-sm mt-1">Step 3: Quality check and measurements.</p>
       </div>

       {tempImage ? (
           <div className="space-y-4">
               <img src={tempImage} alt="Finished" className="rounded-xl shadow-md w-full h-64 object-cover" />
               
               <div className="grid grid-cols-2 gap-4">
                   <div className="bg-white p-3 rounded-lg border border-stone-200">
                       <label className="text-xs text-stone-500 block">Length (cm)</label>
                       <input type="number" className="w-full text-xl font-bold text-earth outline-none" defaultValue={120} />
                   </div>
                   <div className="bg-white p-3 rounded-lg border border-stone-200">
                       <label className="text-xs text-stone-500 block">Width (cm)</label>
                       <input type="number" className="w-full text-xl font-bold text-earth outline-none" defaultValue={80} />
                   </div>
               </div>

               <button 
                onClick={handleFinishingSubmit}
                disabled={loadingAI || saving}
                className="w-full py-4 bg-earth text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
               >
                   {(loadingAI || saving) ? <Loader2 className="animate-spin" /> : "Verify & Complete"}
               </button>
           </div>
       ) : (
           <CameraTrigger 
            label="Final Product Photo" 
            onCapture={(_f, base64) => setTempImage(base64)} 
           />
       )}
    </div>
  );

  const renderSerialization = () => (
      <div className="space-y-6 animate-fade-in pb-10">
          {/* Success Banner */}
          <div className="bg-leaf/10 p-6 rounded-xl border border-leaf/30 text-center relative overflow-hidden">
               {/* Decorative elements for celebration */}
              <div className="absolute top-2 left-4 w-2 h-2 bg-leaf/40 rounded-full animate-ping"></div>
              <div className="absolute top-6 right-8 w-3 h-3 bg-clay/40 rounded-full animate-bounce"></div>
              
              <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm relative z-10">
                  <CheckCircle className="text-leaf w-12 h-12" />
              </div>
              <h2 className="text-2xl font-bold text-leaf relative z-10">Success!</h2>
              <p className="text-stone-600 text-sm mt-2 relative z-10">Digital Product Passport Generated.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 flex flex-col items-center">
              <QrCode className="w-48 h-48 text-stone-800" />
              <p className="font-mono text-sm mt-4 text-stone-500 tracking-widest">{product.dppData?.uid}</p>
          </div>

          {/* Share Button - The requested feature */}
          <button 
             onClick={() => navigate(`/verify/${product.id}`)}
             className="w-full py-4 bg-clay text-white rounded-xl font-bold text-lg shadow-xl hover:bg-earth hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             <Share2 size={24} /> Share My Story
          </button>
          
          <p className="text-xs text-center text-stone-500 px-8 leading-relaxed">
             Tap above to see the <strong>Public Landing Page</strong> that your customers will see when they scan this QR code.
          </p>

          <hr className="border-stone-200 my-2" />

          {/* Export Feature Gate */}
          <div className="bg-white rounded-xl border border-stone-200 p-4">
              <button 
                onClick={handleExportReport}
                className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 border-2 transition-colors ${
                    canExport 
                    ? 'bg-white border-stone-300 text-stone-600 hover:bg-stone-50' 
                    : 'bg-stone-50 border-stone-200 text-stone-400'
                }`}
              >
                  {canExport ? <FileText size={18} /> : <Lock size={18} />}
                  {canExport ? 'Download PDF Report' : 'Download Report (PRO)'}
              </button>
          </div>

          <button 
            onClick={() => navigate(backLink)}
            className="w-full py-4 text-stone-400 font-bold hover:text-stone-600 transition-colors"
          >
              Return to Workbench
          </button>
      </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 relative">
      
      {/* SUCCESS OVERLAY */}
      {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm animate-fade-in">
              <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce-short">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                      <CheckCircle size={48} />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-800">Saved!</h3>
                  <p className="text-stone-500 text-sm">Stored securely.</p>
              </div>
          </div>
      )}

      <header className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(backLink)} className="p-2 -ml-2 rounded-full hover:bg-stone-100"><ArrowRight className="rotate-180" /></button>
        <div>
            <h1 className="font-bold text-earth">{product.name}</h1>
            <p className="text-xs text-stone-400">{activeStage}</p>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
          {activeStage === Stage.INTAKE && renderIntake()}
          {activeStage === Stage.CREATION && renderCreation()}
          {activeStage === Stage.FINISHING && renderFinishing()}
          {activeStage === Stage.SERIALIZATION && renderSerialization()}
      </main>
    </div>
  );
};

export default Workflow;