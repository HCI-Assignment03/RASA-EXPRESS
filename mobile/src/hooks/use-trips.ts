import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  markDelivered,
  markPickedUp,
  recordCashCollected,
  subscribeToTrips,
} from '@/services/trips';
import type { Order, WithId } from '@/types';

/**
 * R2: the signed-in rider's unfinished trips, live. `trip` is the one to work on now,
 * `waiting` counts the others. The actions all work on `trip`. The rider's position is sent
 * from the screen, because only the screen knows when the GPS reports a new one.
 */
export function useTrips() {
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const riderName = profile?.name ?? 'Your rider';
  const [trips, setTrips] = useState<WithId<Order>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToTrips(
      uid,
      (next) => {
        setTrips(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load your trip. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [uid, attempt]);

  const trip = trips[0] ?? null;

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return {
    trip,
    waiting: Math.max(trips.length - 1, 0),
    loading,
    error,
    reload,
    pickedUp: async () => {
      if (trip) await markPickedUp(trip, riderName);
    },
    delivered: async () => {
      if (trip) await markDelivered(trip, riderName);
    },
    collectCash: async () => {
      if (trip) await recordCashCollected(trip);
    },
  };
}
