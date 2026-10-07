import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  createAlertPreference,
  setAlertEnabled,
  subscribeToAlertPrefs,
} from '@/services/alert-prefs';
import type { AlertPreference, WithId } from '@/types';

/**
 * The signed-in customer's alert switches for saved cooks, live.
 * isEnabled(cookId) tells if alerts are on. toggle(cookId) creates the preference the first time
 * and flips it after that.
 */
export function useAlertPrefs() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [prefs, setPrefs] = useState<WithId<AlertPreference>[]>([]);

  useEffect(() => {
    if (!uid) return;
    return subscribeToAlertPrefs(uid, setPrefs, () => setPrefs([]));
  }, [uid]);

  const find = (cookId: string) => prefs.find((pref) => pref.cookId === cookId);

  const toggle = async (cookId: string) => {
    if (!uid) return;
    const existing = find(cookId);
    if (existing) {
      await setAlertEnabled(uid, cookId, !existing.enabled);
    } else {
      await createAlertPreference(uid, cookId);
    }
  };

  return { isEnabled: (cookId: string) => find(cookId)?.enabled ?? false, toggle };
}
