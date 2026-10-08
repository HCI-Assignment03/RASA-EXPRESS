import { useEffect, useState } from 'react';

import { getUserProfile } from '@/services/users';
import type { UserProfile, WithId } from '@/types';

/**
 * Another user's profile (name and phone), read once. Used by S2 to show who ordered.
 * profile stays null while loading, or when the account no longer exists.
 */
export function useUserProfile(uid: string) {
  const [profile, setProfile] = useState<WithId<UserProfile> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getUserProfile(uid)
      .then((found) => {
        if (!cancelled) setProfile(found);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { profile, loading };
}
