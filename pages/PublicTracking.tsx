import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Product, Stage } from '../types';
import { 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  Globe, 
  Clock, 
  Share2, 
  Recycle,
  CheckCircle,
  Star,
  Package,
  QrCode
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface Props {
  products: Product[];
}

const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-stone-200 rounded ${className}`} />
);

export const PublicTracking: React.FC<Props> = ({ products }) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    // Simulate network fetch for the public viewer
    const timer = setTimeout(() => {
      const found = products.find(p => p.id === id);
      setProduct(found);
      setLoading(false);
      
      // MOCK: In a real app, this would be:
      // await supabase.from('scan_events').insert({ product_id: id, ...meta });
      if (found) {
        console.log(`[Analytics] Recorded public scan for ${found.name}`);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [id, products]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden">
        {/* Skeleton Hero */}
        <div className="relative h-96 bg-stone-200 animate-pulse">
            <div className="absolute bottom-0 left-0 p-8 w-full">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
        
        <div className="p-6 space-y-8">
            {/* Score Skeleton */}
            <div className="flex gap-4">
                <Skeleton className="h-24 w-1/2 rounded-xl" />
                <Skeleton className="h-24 w-1/2 rounded-xl" />
            </div>
            
            {/* Story Skeleton */}
            <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </div>

            {/* Map Skeleton */}
            <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!product) return <div className="p-10 text-center">Product not found in public registry.</div>;

  // Calculate Metrics
  const transparencyScore = Math.min(100, (product.logs.length / 4) * 100);
  const origin = product.materials[0]?.origin || "Global Artisan Network";
  const carbon = product.dppData?.carbonFootprintEstimate || 0;

  return (
    <div className="min-h-screen bg-stone-50 pb-12 font-sans text-stone-900 max-w-md mx-auto shadow-2xl relative">
      
      {/* Floating Share Button */}
      <button className="absolute top-6 right-6 z-20 bg-white/20 backdrop-blur-md p-3 rounded-full text-white hover:bg-white/40 transition">
        <Share2 size={20} />
      </button>

      {/* Hero Section */}
      <header className="relative h-[450px]">
        {product.thumbnail ? (
            <img src={product.thumbnail} alt={product.name} className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-400">
                <Package size={64} />
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 p-8 w-full text-white">
            <div className="flex items-center gap-2 mb-3">
                <span className="bg-leaf/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Authentic
                </span>
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2 leading-tight">{product.name}</h1>
            <p className="text-stone-300 text-sm flex items-center gap-2">
                <Clock size={14} /> Crafted on {new Date(product.createdAt).toLocaleDateString()}
            </p>
        </div>
      </header>

      <div className="px-6 -mt-10 relative z-10 space-y-8">
        
        {/* Score Cards */}
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100 flex flex-col items-center justify-center text-center">
                <div className="relative w-16 h-16 flex items-center justify-center mb-2">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path className="text-stone-100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                        <path className="text-leaf transition-all duration-1000 ease-out" strokeDasharray={`${transparencyScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                    </svg>
                    <span className="absolute font-bold text-leaf text-lg">{transparencyScore}</span>
                </div>
                <span className="text-xs font-bold uppercase text-stone-400 tracking-wide">Transparency Score</span>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-lg border border-stone-100 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-clay/10 rounded-full flex items-center justify-center mb-2 text-clay">
                    <Leaf size={28} />
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="font-bold text-xl text-stone-800">{carbon}</span>
                    <span className="text-xs text-stone-500">kg CO2e</span>
                 </div>
                 <span className="text-xs font-bold uppercase text-stone-400 tracking-wide">Footprint</span>
            </div>
        </div>

        {/* The Artisan Story */}
        <section>
            <h2 className="text-2xl font-serif font-bold text-earth mb-4 flex items-center gap-2">
                <Star className="fill-clay text-clay" size={20} /> The Artisan Story
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <QrCode size={120} />
                </div>
                <p className="text-stone-600 leading-relaxed italic relative z-10">
                    "{product.dppData?.complianceStandard ? 
                        `This unique piece began its journey in ${origin}. Hand-selected materials were woven with care, respecting traditional techniques passed down through generations. Every thread tells a story of sustainable craftsmanship.` 
                        : "A unique handcrafted item."}"
                </p>
                <div className="mt-4 flex items-center gap-3">
                    <div className="h-10 w-10 bg-stone-200 rounded-full overflow-hidden">
                         {/* Placeholder for Artisan Avatar */}
                         <img src={`https://api.dicebear.com/7.x/initials/svg?seed=Artisan`} alt="Artisan" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-stone-800">Verified Artisan</p>
                        <p className="text-xs text-stone-400">ID: {product.logs[0]?.deviceId.slice(0,8) || 'Unknown'}</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Impact Map */}
        <section>
            <h2 className="text-lg font-bold text-earth mb-4 flex items-center gap-2">
                <Globe size={18} /> Impact Journey
            </h2>
            <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-lg h-64 relative w-full">
                 {/* Stylized Dark Map Background */}
                 <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="#2d2d2d" />
                    <path d="M0 100 C 30 50 70 50 100 100 Z" fill="#3d3d3d" />
                 </svg>

                 {/* Connection Line */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                     <path d="M 20 80 Q 50 20 80 50" stroke="#C88D65" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse"/>
                 </svg>

                 {/* Origin Point */}
                 <div className="absolute top-[20%] left-[50%] -translate-x-1/2 flex flex-col items-center group cursor-pointer">
                    <div className="w-4 h-4 bg-clay rounded-full shadow-[0_0_15px_rgba(200,141,101,0.8)] animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-clay rounded-full relative z-10 border-2 border-white"></div>
                    <div className="mt-2 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-bold shadow-xl transform transition-transform group-hover:scale-110">
                        {origin}
                    </div>
                 </div>

                 {/* Destination (Conceptual) */}
                 <div className="absolute bottom-[20%] right-[10%] flex flex-col items-center">
                    <div className="w-3 h-3 bg-leaf rounded-full border-2 border-white"></div>
                     <span className="text-stone-400 text-[10px] mt-1 font-mono">Market</span>
                 </div>
            </div>
        </section>

        {/* Traceability Timeline */}
        <section className="pb-8">
            <h2 className="text-lg font-bold text-earth mb-4">Production Log</h2>
            <div className="space-y-0">
                {product.logs.map((log, index) => (
                    <div key={log.id} className="flex gap-4 relative">
                        {/* Connecting Line */}
                        {index !== product.logs.length - 1 && (
                            <div className="absolute left-[11px] top-8 bottom-[-20px] w-0.5 bg-stone-200"></div>
                        )}
                        
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-6 h-6 rounded-full bg-sand border-2 border-clay flex items-center justify-center text-clay">
                                <CheckCircle size={12} />
                            </div>
                        </div>
                        <div className="pb-6">
                            <h4 className="font-bold text-stone-800 text-sm">{log.stage}</h4>
                            <p className="text-xs text-stone-400 mb-1">{new Date(log.timestamp).toLocaleString()}</p>
                            <p className="text-stone-600 text-sm bg-white p-3 rounded-lg border border-stone-100 shadow-sm inline-block">
                                {log.description}
                            </p>
                            {log.photoUrl && (
                                <img src={log.photoUrl} alt="Evidence" className="mt-2 w-16 h-16 rounded-lg object-cover border border-stone-200" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Footer / Certs */}
        <div className="border-t border-stone-200 pt-6 text-center space-y-4">
             <div className="flex justify-center gap-4 opacity-50">
                 <Recycle size={24} />
                 <ShieldCheck size={24} />
                 <Globe size={24} />
             </div>
             <p className="text-xs text-stone-400">
                 Powered by ArtisanPass. Compliant with EU DPP Directive 2024.
             </p>
        </div>

      </div>
    </div>
  );
};
