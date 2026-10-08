import type { LatLng } from '../src/types';
import { GALLE_FORT, distanceBetween, tripStops } from '../src/utils/geo';
import { tripStep } from '../src/utils/trip';

describe('tripStep', () => {
  it('starts with the pick up', () => {
    expect(tripStep({ status: 'ready', paymentMethod: 'cash', paymentStatus: 'pending' })).toBe(
      'pick_up',
    );
  });

  it('asks for the cash on a cash order before delivery', () => {
    expect(tripStep({ status: 'picked_up', paymentMethod: 'cash', paymentStatus: 'pending' })).toBe(
      'collect_cash',
    );
  });

  it('allows delivery once the cash is recorded', () => {
    expect(
      tripStep({ status: 'picked_up', paymentMethod: 'cash', paymentStatus: 'received' }),
    ).toBe('deliver');
  });

  it('skips the cash step for orders paid online', () => {
    expect(tripStep({ status: 'picked_up', paymentMethod: 'card', paymentStatus: 'pending' })).toBe(
      'deliver',
    );
  });
});

describe('distanceBetween', () => {
  it('is zero for the same point', () => {
    expect(distanceBetween(GALLE_FORT, GALLE_FORT)).toBe(0);
  });

  it('is about 111 km for one degree of latitude', () => {
    const a: LatLng = { lat: 6, lng: 80 };
    const b: LatLng = { lat: 7, lng: 80 };
    expect(distanceBetween(a, b)).toBeCloseTo(111.19, 1);
  });

  it('is the same in both directions', () => {
    const a: LatLng = { lat: 6.03, lng: 80.214 };
    expect(distanceBetween(a, GALLE_FORT)).toBeCloseTo(distanceBetween(GALLE_FORT, a), 10);
    expect(distanceBetween(a, GALLE_FORT)).toBeCloseTo(0.49, 1);
  });
});

describe('tripStops', () => {
  it('uses the coordinates stored on the order', () => {
    const pickup: LatLng = { lat: 6.0312, lng: 80.2128 };
    const dropoff: LatLng = { lat: 6.0262, lng: 80.2172 };
    expect(tripStops({ pickup, dropoff })).toEqual({ pickup, dropoff });
  });

  it('falls back to fixed Galle Fort points when the order has none', () => {
    const stops = tripStops({});
    expect(stops.dropoff).toEqual(GALLE_FORT);
    expect(distanceBetween(stops.pickup, stops.dropoff)).toBeGreaterThan(0);
  });
});
