import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '../components/Icons';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm font-bold text-stone-500 hover:text-earth transition-colors"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Legal</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-stone prose-headings:font-serif prose-headings:text-earth prose-a:text-clay">
        <h1>Privacy Policy</h1>
        <p className="lead"><strong>Effective Date:</strong> October 25, 2025</p>
        
        <p>
          At <strong>ArtisanPass</strong> ("we", "us", or "our"), we are committed to protecting the privacy of our users ("Artisans" and "Brands") and the consumers who interact with our Digital Product Passports. This Privacy Policy explains how we collect, use, and share your personal information in compliance with the General Data Protection Regulation (GDPR) and the Kenya Data Protection Act, 2019.
        </p>

        <h3>1. Data Controller vs. Data Processor</h3>
        <ul>
          <li><strong>For Enterprise Brands:</strong> When you use ArtisanPass to manage your supply chain, you are the <strong>Data Controller</strong> of your artisans' data. ArtisanPass acts as the <strong>Data Processor</strong>.</li>
          <li><strong>For Individual Artisans:</strong> If you sign up directly, ArtisanPass acts as the <strong>Data Controller</strong>.</li>
        </ul>

        <h3>2. Information We Collect</h3>
        <p>We collect the following types of data to provide our Traceability Engine services:</p>
        <ul>
          <li><strong>Account Data:</strong> Name, Email, Organization Name.</li>
          <li><strong>Traceability Data:</strong> Geolocation (GPS coordinates), Photos of production processes, Audio recordings of material descriptions.</li>
          <li><strong>Device Data:</strong> IP address, Browser type, Device model (for verifying "offline-first" sync integrity).</li>
        </ul>

        <h3>3. How We Use Your Data</h3>
        <ul>
          <li>To generate verifiable <strong>Digital Product Passports (DPPs)</strong> compliant with EU Regulations (ESPR).</li>
          <li>To calculate environmental impact (e.g., carbon footprint via material distance).</li>
          <li>To detect fraud (e.g., flagging GPS anomalies in production logs).</li>
          <li>To process payments via our Merchant of Record, <strong>Paddle.com</strong>.</li>
        </ul>

        <h3>4. Data Sharing & Subprocessors</h3>
        <p>We trust the following third-party service providers to help us operate:</p>
        <ul>
          <li><strong>Supabase:</strong> Database hosting and authentication (Frankfurt, EU region available for Enterprise).</li>
          <li><strong>Google Gemini AI:</strong> For processing images and voice-to-text transcription.</li>
          <li><strong>Paddle:</strong> For payment processing. Paddle acts as the Merchant of Record for all orders.</li>
        </ul>

        <h3>5. International Data Transfers</h3>
        <p>
          ArtisanPass is headquartered in <strong>Kenya</strong>. Data collected in the EU may be transferred to and processed in Kenya. We rely on Standard Contractual Clauses (SCCs) to ensure your data remains protected in accordance with GDPR standards.
        </p>

        <h3>6. Your Rights (GDPR)</h3>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you.</li>
          <li>Request correction of inaccurate data.</li>
          <li>Request deletion of your data ("Right to be Forgotten"), subject to data retention required for supply chain audits.</li>
          <li>Object to automated decision-making (e.g., automated fraud flagging).</li>
        </ul>

        <h3>7. Contact Us</h3>
        <p>
          For privacy inquiries or to exercise your rights, please contact our Data Protection Officer at:<br/>
          <strong>Email:</strong> privacy@artisanpass.com<br/>
          <strong>Address:</strong> Nairobi, Kenya
        </p>

      </main>
    </div>
  );
};