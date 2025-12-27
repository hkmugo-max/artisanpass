

export enum Stage {
  INTAKE = 'Material Intake',
  CREATION = 'Creation Log',
  FINISHING = 'Finishing',
  SERIALIZATION = 'Serialization',
}

export type UserRole = 'artisan' | 'brand' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  fullName?: string;
  // Paddle Subscription Fields
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | 'trialing' | 'free';
  customerId?: string;
  tier?: SubscriptionTier;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  accuracy?: number; // Accuracy in meters
  isManual?: boolean; // True if GPS failed and fallback was used
  errorCode?: string; // For debugging hardware failures
}

export interface Material {
  id: string;
  type: string; // e.g., "Wool", "Cotton"
  origin: string; // e.g., "Andes, Peru"
  supplierId: string;
  photoUrl?: string;
  timestamp: string;
  quality?: string;
  quantity?: string; // e.g. "5kg", "200 meters"
}

export interface LogEntry {
  id: string;
  stage: Stage;
  timestamp: string;
  description: string;
  photoUrl?: string;
  gps?: GeoLocation;
  deviceId: string;
  // --- FRAUD ENGINE OUTPUTS ---
  fraudScore?: number; // 0-100
  isFlagged?: boolean;
  flagReason?: string; // e.g. "Impossible Speed (>100km/h)"
}

export interface DPPData {
  uid: string; // Unique Item Identifier
  carbonFootprintEstimate: number; // in kg CO2e
  recyclability: string; // e.g. "100% Biodegradable"
  complianceStandard: string; // e.g., "EU-DPP-TEX-2024"
}

export interface Product {
  id: string;
  name: string;
  status: 'Draft' | 'Completed' | 'Synced';
  materials: Material[];
  logs: LogEntry[];
  dppData?: DPPData;
  thumbnail?: string;
  createdAt: number;
  synced: boolean;
}

export interface AppState {
  products: Product[];
  isOnline: boolean;
}

// --- PRICING & TIERS ---

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE';

export type FeatureKey = 'export_compliance' | 'custom_branding' | 'bulk_upload' | 'api_access';

export interface PlanLimits {
  tier: SubscriptionTier;
  qrLimit: number; // Max number of products
  features: FeatureKey[];
}

export interface UserUsage {
  productsCount: number;
  tier: SubscriptionTier;
}

// --- ANALYTICS ---

export interface ScanEvent {
  id: string;
  productId: string;
  productName: string;
  timestamp: string;
  location: string; // City, Country
  device: string; // Mobile, Desktop
}

export interface ProductRiskScore {
  productId: string;
  score: number; // 0 to 100
  factors: {
    gpsVerified: boolean;
    photoVerified: boolean;
    chronologyValid: boolean;
  };
}