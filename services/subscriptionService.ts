import { PlanLimits, SubscriptionTier, FeatureKey } from '../types';

/**
 * PLAN DEFINITIONS
 * In a real app, these would be stored in a Supabase table `plans`.
 */
const PLANS: Record<SubscriptionTier, PlanLimits> = {
  FREE: {
    tier: 'FREE',
    qrLimit: 3, // Low limit for demo purposes
    features: [] // No premium features
  },
  PRO: {
    tier: 'PRO',
    qrLimit: 100,
    features: ['export_compliance', 'custom_branding', 'bulk_upload']
  },
  ENTERPRISE: {
    tier: 'ENTERPRISE',
    qrLimit: 10000,
    features: ['export_compliance', 'custom_branding', 'bulk_upload', 'api_access']
  }
};

// Initialize from LocalStorage to persist across reloads
const STORAGE_KEY = 'artisan_pass_tier';
let CURRENT_USER_TIER: SubscriptionTier = (localStorage.getItem(STORAGE_KEY) as SubscriptionTier) || 'FREE';

/**
 * Checks if the user has access to a specific feature.
 */
export const hasFeatureAccess = (feature: FeatureKey): boolean => {
  const plan = PLANS[CURRENT_USER_TIER];
  return plan.features.includes(feature);
};

/**
 * Checks if the user has sufficient credits to create a new item.
 */
export const hasCreditsRemaining = (currentCount: number): boolean => {
  const plan = PLANS[CURRENT_USER_TIER];
  return currentCount < plan.qrLimit;
};

/**
 * Returns the usage statistics for UI display.
 */
export const getPlanDetails = () => {
  return PLANS[CURRENT_USER_TIER];
};

/**
 * Simulates upgrading the user (for Demo purposes).
 */
export const upgradeUser = () => {
  CURRENT_USER_TIER = 'PRO';
  localStorage.setItem(STORAGE_KEY, 'PRO');
  // Dispatch event for components to listen to instead of hard reload
  window.dispatchEvent(new CustomEvent('tier-change'));
};

export const resetUser = () => {
  CURRENT_USER_TIER = 'FREE';
  localStorage.setItem(STORAGE_KEY, 'FREE');
  window.dispatchEvent(new CustomEvent('tier-change'));
};

/**
 * Helper to allow React components to re-render on tier change
 */
export const subscribeToTierChanges = (callback: () => void) => {
    const handler = () => callback();
    window.addEventListener('tier-change', handler);
    return () => window.removeEventListener('tier-change', handler);
};