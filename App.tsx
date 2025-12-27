import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Product } from './types';
import { Dashboard } from './pages/Dashboard';
import Workflow from './pages/Workflow';
import { PublicTracking } from './pages/PublicTracking';
import { Landing } from './pages/Landing'; 
import { Whitepaper } from './pages/Whitepaper'; 
import { UserGuide } from './pages/UserGuide';
import { Auth } from './pages/Auth'; 
import { StaffLogin } from './pages/StaffLogin';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { CaptureMenu } from './pages/CaptureMenu'; 
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { HelpCenter } from './pages/HelpCenter';
import { ProtectedRoute } from './components/ProtectedRoute'; 
import { ProtectedAdminRoute } from './components/ProtectedAdminRoute';
import { OfflineIndicator } from './components/OfflineIndicator';
import { SyncStatus } from './components/SyncStatus';
import { getQueueCount } from './services/indexedDB'; 
import { syncOfflineQueue as processSync } from './services/uploadManager';

const INITIAL_PRODUCTS: Product[] = [];

function App() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('artisan_pass_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch (e) {
      console.error("Failed to load products from storage", e);
      return INITIAL_PRODUCTS;
    }
  });

  // Sync State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);

  // 1. Persist local state changes with Safety Catch
  useEffect(() => {
    try {
      const serialized = JSON.stringify(products);
      localStorage.setItem('artisan_pass_products', serialized);
    } catch (error: any) {
      if (error.name === 'QuotaExceededError' || error.code === 22) {
        console.warn("LocalStorage Quota Exceeded! Could not cache offline data.");
        alert("Storage full. Photos may not persist if you close the app. Please sync when online.");
      } else {
        console.error("Error saving to local storage:", error);
      }
    }
  }, [products]);

  // 2. Handle connectivity changes & Background Sync
  useEffect(() => {
    const runSync = async () => {
        if (isOnline) {
            const count = await getQueueCount();
            const unsyncedProducts = products.filter(p => !p.synced);
            
            if (count > 0 || unsyncedProducts.length > 0) {
                setIsSyncing(true);
                setSyncProgress(5); 

                await processSync((percent) => {
                    setSyncProgress(percent);
                });

                if (unsyncedProducts.length > 0) {
                    setProducts(prev => prev.map(p => ({...p, synced: true})));
                }

                setSyncProgress(100);
                setTimeout(() => {
                    setIsSyncing(false);
                    setSyncProgress(0);
                }, 3000);
            }
        }
    };

    runSync();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    };
  }, [isOnline, products.length]); 

  const handleCreateNew = () => {
    const newProduct: Product = {
        id: Date.now().toString(),
        name: `Item #${products.length + 1}`,
        status: 'Draft',
        materials: [],
        logs: [],
        createdAt: Date.now(),
        synced: false
    };
    setProducts([newProduct, ...products]);
  };

  const handleUpdateProduct = (updated: Product) => {
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-clay selection:text-white pb-20">
        
        <OfflineIndicator isOnline={isOnline} toggleOnline={() => setIsOnline(!isOnline)} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/whitepaper" element={<Whitepaper />} />
          <Route path="/guide" element={<UserGuide />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/staff-access" element={<StaffLogin />} />
          
          <Route 
            path="/verify/:id" 
            element={<PublicTracking products={products} />} 
          />
          
          {/* Protected Routes: Admin */}
          <Route 
            path="/admin" 
            element={
                <ProtectedAdminRoute>
                    <SuperAdminDashboard />
                </ProtectedAdminRoute>
            } 
          />

          {/* Protected Routes: Brand Dashboard */}
          <Route 
            path="/dashboard" 
            element={
                <ProtectedRoute>
                    <Dashboard 
                        products={products} 
                        onCreateNew={handleCreateNew} 
                    />
                </ProtectedRoute>
            } 
          />

          {/* Protected Routes: Artisan Capture Tool */}
          <Route 
            path="/capture" 
            element={
                <ProtectedRoute>
                    <CaptureMenu 
                        products={products} 
                        onCreateNew={handleCreateNew} 
                    />
                </ProtectedRoute>
            } 
          />

          {/* Shared Workflow (Accessible by both but usually triggered from their respective dashboards) */}
          <Route 
            path="/product/:id" 
            element={
                <ProtectedRoute>
                    <Workflow 
                        products={products} 
                        updateProduct={handleUpdateProduct}
                        isOnline={isOnline}
                    />
                </ProtectedRoute>
            } 
          />
        </Routes>

        <SyncStatus isSyncing={isSyncing} progress={syncProgress} />
      </div>
    </HashRouter>
  );
}

export default App;