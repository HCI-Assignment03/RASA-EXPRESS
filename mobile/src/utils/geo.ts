import type { LatLng, Order } from '@/types';

// Map helpers for R2. Orders may carry `pickup` and `dropoff` coordinates; orders that do not
// (the checkout does not set them yet) fall back to two fixed points in Galle Fort.

/** Middle of Galle Fort, where the map opens when nothing else is known. */
export const GALLE_FORT: LatLng = { lat: 6.0267, lng: 80.217 };

const DEFAULT_PICKUP: LatLng = { lat: 6.03, lng: 80.214 };

const EARTH_RADIUS_KM = 6371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

/** Straight-line distance between two points in kilometres (haversine formula). */
export function distanceBetween(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/** The two stops of a delivery, using the order's coordinates when it has them. */
export function tripStops(order: Pick<Order, 'pickup' | 'dropoff'>): {
  pickup: LatLng;
  dropoff: LatLng;
} {
  return {
    pickup: order.pickup ?? DEFAULT_PICKUP,
    dropoff: order.dropoff ?? GALLE_FORT,
  };
}
