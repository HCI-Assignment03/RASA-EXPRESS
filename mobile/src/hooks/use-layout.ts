import { useWindowDimensions } from 'react-native';

import { layoutFor } from '@/utils/layout';

/**
 * The current screen shape (landscape, short, compact, wide). Updates when the phone is rotated,
 * a tablet window is resized or the app is put in split view.
 */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  return { width, height, ...layoutFor(width, height) };
}
