import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { addFavourite, removeFavourite, subscribeToFavourites } from '@/services/favourites';

/**
 * The signed-in customer's saved cooks, live.
 * toggle(cookId) saves the cook, or removes it when it is already saved.
 */
export function useFavourites() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [favouriteIds, setFavouriteIds] = useState<ReadonlySet<string>>(new Set());

  useEffect(() => {
    if (!uid) return;
    return subscribeToFavourites(
      uid,
      (favourites) => setFavouriteIds(new Set(favourites.map((favourite) => favourite.cookId))),
      () => setFavouriteIds(new Set()),
    );
  }, [uid]);

  const toggle = async (cookId: string) => {
    if (!uid) return;
    if (favouriteIds.has(cookId)) {
      await removeFavourite(uid, cookId);
    } else {
      await addFavourite(uid, cookId);
    }
  };

  return { favouriteIds, toggle };
}
