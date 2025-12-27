import { Product, Stage, ScanEvent, ProductRiskScore } from '../types';

/**
 * 1. CARBON LOGIC: Haversine Formula
 * Calculates "Material Kilometers" - distance between Intake GPS and Finishing GPS.
 */
const toRad = (value: number) => (value * Math.PI) / 180;

export const calculateMaterialDistance = (product: Product): number => {
  const intakeLog = product.logs.find(l => l.stage === Stage.INTAKE);
  const finishingLog = product.logs.find(l => l.stage === Stage.FINISHING);

  if (!intakeLog?.gps || !finishingLog?.gps) return 0;

  const R = 6371; // Earth radius in km
  const dLat = toRad(finishingLog.gps.lat - intakeLog.gps.lat);
  const dLon = toRad(finishingLog.gps.lng - intakeLog.gps.lng);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(intakeLog.gps.lat)) *
      Math.cos(toRad(finishingLog.gps.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * 2. RISK LOGIC: Data Integrity Score
 * Analyzes logs for "Red Flags" in traceability.
 */
export const calculateIntegrityScore = (product: Product): ProductRiskScore => {
  let score = 100;
  const factors = {
    gpsVerified: true,
    photoVerified: true,
    chronologyValid: true,
  };

  // Check A: Do we have GPS data for critical steps?
  const criticalLogs = product.logs.filter(l => l.stage === Stage.INTAKE || l.stage === Stage.FINISHING);
  const gpsCount = criticalLogs.filter(l => l.gps && !l.gps.isManual).length;
  if (criticalLogs.length > 0 && gpsCount < criticalLogs.length) {
    score -= 20;
    factors.gpsVerified = false;
  }

  // Check B: Do we have visual evidence?
  const photoCount = product.logs.filter(l => l.photoUrl).length;
  if (product.logs.length > 0 && photoCount === 0) {
    score -= 30;
    factors.photoVerified = false;
  }

  // Check C: Chronology (Timestamps must increase)
  for (let i = 0; i < product.logs.length - 1; i++) {
    const current = new Date(product.logs[i].timestamp).getTime();
    const next = new Date(product.logs[i+1].timestamp).getTime();
    if (next < current) {
      score -= 50; // Major red flag
      factors.chronologyValid = false;
    }
  }

  return {
    productId: product.id,
    score: Math.max(0, score),
    factors
  };
};

/**
 * 3. SOCIAL IMPACT: Production Hours
 * Parses log descriptions to find durations (e.g., "Duration: 4h 30m").
 */
export const calculateProductionHours = (product: Product): number => {
  let totalMinutes = 0;
  
  // Regex to find "Xh Ym" or "Xh" or "Ym"
  const regex = /(\d+)h\s*(\d*)m?|(\d+)m/;

  product.logs.forEach(log => {
    // Check if user manually typed duration
    const match = log.description.match(regex);
    if (match) {
      const hours = parseInt(match[1] || '0');
      const minutes = parseInt(match[2] || match[3] || '0');
      totalMinutes += (hours * 60) + minutes;
    } else if (log.stage === Stage.CREATION) {
      // Default fallback for calculation if Creation log exists but no time specified
      totalMinutes += 240; // Assume 4 hours avg
    }
  });

  return Math.round((totalMinutes / 60) * 10) / 10;
};

/**
 * 4. CONSUMER ANALYTICS: Mock Scan Events
 * Since we don't have a real backend collecting scans yet, we simulate them based on product status.
 */
export const getConsumerScans = (products: Product[]): ScanEvent[] => {
  const completed = products.filter(p => p.status === 'Completed');
  const events: ScanEvent[] = [];

  const cities = ['Berlin, DE', 'Paris, FR', 'London, UK', 'New York, US', 'Tokyo, JP'];
  const devices = ['iPhone 14', 'Samsung S23', 'Chrome Desktop', 'Pixel 7'];

  completed.forEach(p => {
    // Simulate 1-5 scans per completed product
    const scanCount = Math.floor(Math.random() * 5) + 1;
    for (let i = 0; i < scanCount; i++) {
      events.push({
        id: `scan-${p.id}-${i}`,
        productId: p.id,
        productName: p.name,
        timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Past 7 days
        location: cities[Math.floor(Math.random() * cities.length)],
        device: devices[Math.floor(Math.random() * devices.length)]
      });
    }
  });

  // Sort by most recent
  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};
