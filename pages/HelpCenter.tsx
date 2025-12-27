import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, 
    Search, 
    BookOpen, 
    WifiOff, 
    ShieldCheck, 
    CreditCard, 
    FileText, 
    MessageCircle,
    ChevronRight,
    ChevronDown,
    X
} from '../components/Icons';

type Category = 'All' | 'Getting Started' | 'Troubleshooting' | 'Billing' | 'Compliance';

interface Article {
    id: string;
    title: string;
    category: Category;
    excerpt: string;
    content: React.ReactNode;
}

const ARTICLES: Article[] = [
    {
        id: 'offline-sync',
        title: "How to sync data when offline",
        category: 'Getting Started',
        excerpt: "Learn how ArtisanPass stores data locally and synchronizes automatically when connection returns.",
        content: (
            <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>ArtisanPass is built with an "Offline-First" architecture, meaning you never have to worry about losing work in remote areas.</p>
                <h4 className="font-bold text-stone-800">How it works:</h4>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>When internet is lost, the <strong>Wifi Indicator</strong> in the bottom-right corner will turn red (Offline Mode).</li>
                    <li>Continue taking photos and logging materials as normal. All data is securely encrypted and stored in your device's internal database (IndexedDB).</li>
                    <li>When you return to a Wi-Fi or 4G zone, simply <strong>open the app</strong>.</li>
                    <li>Look for the <strong>Sync Status bar</strong> at the bottom of the screen. It will pulse yellow while uploading and turn green when complete.</li>
                </ol>
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-sm text-amber-800 my-4">
                    <strong>Note:</strong> Do not clear your browser cache while offline, or you may lose unsynced data.
                </div>
            </div>
        )
    },
    {
        id: 'fraud-flags',
        title: "Interpreting Fraud Detection Flags",
        category: 'Compliance',
        excerpt: "Understanding the 'Impossible Speed' and 'GPS Mock' alerts in your brand dashboard.",
        content: (
            <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>To ensure EU DPP compliance, our AI monitors logs for anomalies that suggest data falsification.</p>
                <h4 className="font-bold text-stone-800">Common Alerts:</h4>
                <ul className="space-y-3">
                    <li className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="font-bold text-red-700 block mb-1">Impossible Speed (&gt;100km/h)</span>
                        This flag appears if an artisan logs two actions in different locations that would require traveling faster than physically possible. This usually indicates shared credentials or "teleporting" via VPN.
                    </li>
                    <li className="bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="font-bold text-red-700 block mb-1">GPS Mock Detected</span>
                        The device reported that a "Mock Location" developer setting was enabled. This is a critical red flag for provenance verification.
                    </li>
                    <li className="bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <span className="font-bold text-amber-700 block mb-1">Location Deviation</span>
                        The production log occurred more than 2km away from the artisan's registered home/workshop facility.
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'billing-paddle',
        title: "Billing FAQ: Why is my charge from 'Paddle'?",
        category: 'Billing',
        excerpt: "Explanation of our Merchant of Record and how to manage subscriptions.",
        content: (
            <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                    ArtisanPass partners with <strong>Paddle.com</strong> as our Merchant of Record. This means Paddle handles all payment processing, tax compliance (VAT/GST), and invoicing globally.
                </p>
                <h4 className="font-bold text-stone-800">What to look for:</h4>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Your bank statement will show a charge from <strong>PADDLE.NET* ARTISAN</strong>.</li>
                    <li>Invoices and receipts are emailed directly from Paddle.</li>
                </ul>
                <h4 className="font-bold text-stone-800 mt-4">Need a refund or tax adjustment?</h4>
                <p>
                    Since Paddle processes the payment, they handle tax-related queries directly. However, you can contact our support team to facilitate any subscription cancellations or refunds.
                </p>
            </div>
        )
    },
    {
        id: 'creating-passport',
        title: "Generating a Digital Product Passport",
        category: 'Getting Started',
        excerpt: "A step-by-step guide to creating your first EU-compliant QR code.",
        content: (
            <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>The Digital Product Passport (DPP) is the final output of the ArtisanPass workflow.</p>
                <ol className="list-decimal pl-5 space-y-2">
                    <li>Complete all 3 stages of production: <strong>Intake, Creation, and Finishing</strong>.</li>
                    <li>Ensure photos are uploaded for the 'Finishing' stage.</li>
                    <li>Our AI will automatically calculate the <strong>Carbon Footprint</strong> based on the material journey.</li>
                    <li>Navigate to the 'Serialization' tab and tap <strong>Generate QR</strong>.</li>
                    <li>This QR code can be downloaded and printed on physical tags. It links to a public-facing page hosting the product's compliance data.</li>
                </ol>
            </div>
        )
    },
    {
        id: 'export-reports',
        title: "Exporting Compliance Reports",
        category: 'Compliance',
        excerpt: "How to download PDF reports for customs and audits.",
        content: (
            <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>Enterprise and Pro plans allow for bulk data export.</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Go to your <strong>Brand Dashboard</strong>.</li>
                    <li>Select the items you wish to export (or 'Select All').</li>
                    <li>Click the <strong>Export</strong> button in the top right.</li>
                    <li>Choose <strong>PDF (Official Audit)</strong> for a formatted document or <strong>CSV</strong> for raw data analysis.</li>
                </ul>
                <p className="text-sm italic mt-2">Note: PDF reports include the cryptographic hash of the audit log for immutability verification.</p>
            </div>
        )
    }
];

export const HelpCenter: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<Category>('All');
    const [activeArticle, setActiveArticle] = useState<Article | null>(null);

    const filteredArticles = ARTICLES.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const categories: Category[] = ['All', 'Getting Started', 'Compliance', 'Billing', 'Troubleshooting'];

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
                    <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Help Center</span>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-12">
                
                {/* Hero Search */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-earth mb-6">How can we help you?</h1>
                    <div className="relative max-w-xl mx-auto">
                        <Search className="absolute left-4 top-3.5 text-stone-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search guides, errors, or keywords..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 shadow-sm focus:outline-none focus:border-clay focus:ring-2 focus:ring-clay/20 transition-all text-lg"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                selectedCategory === cat 
                                ? 'bg-earth text-white shadow-md' 
                                : 'bg-white text-stone-500 border border-stone-200 hover:border-stone-400'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Article List */}
                <div className="grid gap-4">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map(article => (
                            <div 
                                key={article.id}
                                onClick={() => setActiveArticle(article)}
                                className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md hover:border-clay/30 transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                                                article.category === 'Compliance' ? 'bg-red-50 text-red-600 border-red-100' :
                                                article.category === 'Billing' ? 'bg-green-50 text-green-600 border-green-100' :
                                                'bg-stone-50 text-stone-500 border-stone-200'
                                            }`}>
                                                {article.category}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-earth transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-stone-500 text-sm leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                    <div className="bg-stone-50 p-2 rounded-full text-stone-300 group-hover:bg-clay group-hover:text-white transition-all">
                                        <ChevronRight size={20} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-stone-400">
                            <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                            <p>No articles found matching "{searchQuery}"</p>
                            <button onClick={() => setSearchQuery('')} className="text-clay font-bold mt-2">Clear Search</button>
                        </div>
                    )}
                </div>

                {/* Support CTA */}
                <div className="mt-16 bg-stone-100 rounded-2xl p-8 text-center">
                    <h3 className="font-bold text-stone-800 mb-2">Still need help?</h3>
                    <p className="text-stone-500 text-sm mb-6">Our support team is available Mon-Fri, 9am - 5pm EAT.</p>
                    <button className="bg-white border border-stone-200 text-earth font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-stone-50 transition-colors flex items-center gap-2 mx-auto">
                        <MessageCircle size={18} /> Contact Support
                    </button>
                </div>

            </main>

            {/* Article Modal */}
            {activeArticle && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-6 border-b border-stone-100 flex justify-between items-start bg-stone-50 sticky top-0">
                            <div>
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">{activeArticle.category}</span>
                                <h2 className="text-2xl font-bold text-earth leading-tight">{activeArticle.title}</h2>
                            </div>
                            <button 
                                onClick={() => setActiveArticle(null)}
                                className="p-2 bg-white rounded-full text-stone-400 hover:text-stone-600 shadow-sm border border-stone-200 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            {activeArticle.content}
                        </div>

                        <div className="p-6 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
                            <span className="text-xs text-stone-400">Was this helpful?</span>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:border-stone-400 transition-colors">Yes</button>
                                <button className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-600 hover:border-stone-400 transition-colors">No</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};