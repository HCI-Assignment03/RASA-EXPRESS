import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import type { LatLng } from '@/types';

export type LocationPermission = 'asking' | 'granted' | 'denied';

/**
 * The phone's GPS position while `enabled` is true (R2, during a trip).
 * Updates about every 10 seconds or when the rider moves 15 metres, so it is also a natural limit
 * on how often the position is written to Firestore.
 */
export function useRiderLocation(enabled: boolean) {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [permission, setPermission] = useState<LocationPermission>('asking');

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== 'granted') {
        setPermission('denied');
        return;
      }
      setPermission('granted');

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 10000, distanceInterval: 15 },
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
      );
      // The screen may have closed while the subscription was being created.
      if (cancelled) subscription.remove();
    })().catch(() => {
      if (!cancelled) setPermission('denied');
    });

    return () => {
      cancelled = true;
      subscription?.remove();
    };
  }, [enabled]);

  return { location, permission };
}
