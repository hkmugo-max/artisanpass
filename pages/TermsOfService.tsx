import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from '../components/Icons';

export const TermsOfService: React.FC = () => {
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
        <h1>Terms of Service</h1>
        <p className="lead"><strong>Last Updated:</strong> October 25, 2025</p>
        
        <p>
            Welcome to ArtisanPass. By accessing or using our website and application ("Service"), you agree to be bound by these Terms of Service ("Terms").
        </p>

        <h3>1. The Service</h3>
        <p>
            ArtisanPass is a traceability engine designed to help artisans and brands document their supply chain and generate Digital Product Passports. We provide tools for offline data capture, cloud synchronization, and compliance reporting.
        </p>

        <h3>2. User Content & Ownership</h3>
        <ul>
            <li><strong>"User Content"</strong> refers to all data, text, photographs, audio recordings, and geolocation data uploaded by you (Artisan or Brand) to the Service.</li>
            <li><strong>Ownership:</strong> You retain full ownership of your User Content. We claim no intellectual property rights over the material you provide to the Service.</li>
            <li><strong>License to Display:</strong> By uploading User Content, you grant ArtisanPass a worldwide, non-exclusive, royalty-free license to host, store, reproduce, modify, create derivative works (such as summaries), and display your User Content solely for the purpose of operating the Service and displaying the "Public Passport" to consumers via QR code.</li>
        </ul>

        <h3>3. Payment & Merchant of Record</h3>
        <p>
            Our order process is conducted by our online reseller <strong>Paddle.com</strong>. Paddle.com is the Merchant of Record for all our orders. Paddle provides all customer service inquiries and handles returns.
        </p>

        <h3>4. Data Processing Agreement (DPA)</h3>
        <p>
            To the extent ArtisanPass processes Personal Data on behalf of a Brand (Customer) that is subject to the GDPR, the parties agree that ArtisanPass acts as a Data Processor and the Brand acts as the Data Controller. By using the Service, you agree to our standard Data Processing Addendum, incorporated herein by reference, which includes Standard Contractual Clauses (SCCs) for the transfer of data outside the EEA.
        </p>

        <h3>5. Termination & Data Retention</h3>
        <ul>
            <li><strong>Cancellation:</strong> You may cancel your subscription at any time via the billing portal.</li>
            <li><strong>Effect of Termination:</strong> Upon cancellation, your account will enter a "Read-Only" state. You will not be able to create new Product Passports.</li>
            <li><strong>QR Code Grace Period:</strong> To protect the consumer experience, any QR codes generated and printed on physical products will remain active and accessible for a period of <strong>one (1) year</strong> from the date of termination. After this Grace Period, ArtisanPass reserves the right to archive or delete the data, rendering the QR codes inactive.</li>
        </ul>

        <h3>6. Limitation of Liability</h3>
        <p>
            To the maximum extent permitted by law, ArtisanPass shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from (a) your access to or use of or inability to access or use the Service; or (b) any conduct or content of any third party on the Service.
        </p>

        <h3>7. Governing Law</h3>
        <p>
            These Terms shall be governed by and construed in accordance with the laws of <strong>Kenya</strong>, without regard to its conflict of law provisions.
        </p>

        <h3>8. Contact</h3>
        <p>
            Questions about the Terms of Service should be sent to us at legal@artisanpass.com.
        </p>

      </main>
    </div>
  );
};