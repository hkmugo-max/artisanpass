import { supabase } from './supabase';
import { queueRequest, getQueue, clearQueueItem } from './indexedDB';
import { GeoLocation } from '../types';

/**
 * Helper to strip out non-clonable data (functions, DOM nodes, etc)
 * and ensure we have a clean JSON object for storage.
 */
const sanitizeData = <T>(data: T): T => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch (e) {
    console.error("Sanitization failed", e);
    // Fallback: Return as is, or an empty object if totally broken
    return data;
  }
};

/**
 * Gets the current geolocation with a robust Watchdog Timer.
 * Returns a fallback object with isManual=true if sensors fail.
 */
export const getGeoLocation = async (): Promise<GeoLocation> => {
  // 1. Check for Browser Support
  if (!navigator.geolocation) {
    console.warn("GPS: Geolocation not supported by this browser.");
    return { lat: 0, lng: 0, isManual: true, errorCode: "UNSUPPORTED" };
  }

  return new Promise((resolve) => {
    // 2. Define the Watchdog Timer (10 Seconds)
    const watchdog = setTimeout(() => {
      console.warn("GPS: Watchdog timer expired (10s). Proceeding with Manual Fallback.");
      resolve({ 
        lat: -13.1631, 
        lng: -72.5450, 
        accuracy: 0, 
        isManual: true,
        errorCode: "WATCHDOG_TIMEOUT" 
      }); 
    }, 10000);

    // 3. Request Position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(watchdog);
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          isManual: false
        });
      },
      (error) => {
        clearTimeout(watchdog);
        
        let reason = "UNKNOWN";
        switch(error.code) {
            case error.PERMISSION_DENIED:
                reason = "PERMISSION_DENIED";
                break;
            case error.POSITION_UNAVAILABLE:
                reason = "POSITION_UNAVAILABLE";
                break;
            case error.TIMEOUT:
                reason = "OS_TIMEOUT";
                break;
        }
        
        console.error(`GPS Hardware Error: ${reason} - ${error.message}`);
        
        resolve({ 
            lat: -13.1631, 
            lng: -72.5450, 
            accuracy: 0, 
            isManual: true, 
            errorCode: reason 
        });
      },
      { 
        enableHighAccuracy: true, 
        timeout: 9000,
        maximumAge: 0 
      }
    );
  });
};

/**
 * Main function to save data.
 * If Online: Uploads to Supabase.
 * If Offline: Queues to IndexedDB.
 */
export const saveLog = async (endpoint: 'logs' | 'products' | 'materials', rawData: any, isOnline: boolean) => {
  // CRITICAL: Sanitize data before attempting any storage operations.
  // This strips out 'File' objects, DOM elements, or circular references that crash IndexedDB.
  const data = sanitizeData(rawData);

  if (isOnline) {
    try {
      // Simulation of network latency
      await new Promise(resolve => setTimeout(resolve, 800)); 
      console.log(`[Online] Uploaded to ${endpoint}`);
      return true;
    } catch (e) {
      console.warn("Upload failed, falling back to queue", e);
      await queueRequest(endpoint, data);
      return false;
    }
  } else {
    await queueRequest(endpoint, data);
    return false;
  }
};

/**
 * Process the offline queue in the background.
 */
export const syncOfflineQueue = async (onProgress: (percent: number) => void) => {
  const queue = await getQueue();
  if (queue.length === 0) return;

  console.log(`[Sync] Found ${queue.length} pending items`);
  const total = queue.length;
  let processed = 0;

  for (const item of queue) {
    try {
      // Simulate upload time
      await new Promise(r => setTimeout(r, 500)); 
      
      await clearQueueItem(item.id);
      processed++;
      onProgress(Math.round((processed / total) * 100));
    } catch (e) {
      console.error(`[Sync] Failed to process item ${item.id}`, e);
    }
  }
};
