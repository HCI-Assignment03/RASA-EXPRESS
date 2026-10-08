// Delivery money and distance, shared by R1 (request list) and R2 (active trip).
// The app has no routing service (deviation D05), so the distance is the cook's stored distanceKm
// and the fee is worked out from it with a fixed rule.

const BASE_FEE = 100;
const FEE_PER_KM = 40;

/** What the rider earns for a delivery: Rs. 100 plus Rs. 40 per km, rounded to the nearest Rs. 10. */
export function riderFee(distanceKm: number): number {
  return Math.round((BASE_FEE + FEE_PER_KM * distanceKm) / 10) * 10;
}

/** 1.2 becomes "1.2 km". Under 1 km it is written in metres: 0.45 becomes "450 m". */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) return `${Math.round((distanceKm * 1000) / 10) * 10} m`;
  return `${distanceKm.toFixed(1)} km`;
}
