import Ionicons from '@expo/vector-icons/Ionicons';
import { useNetworkState } from 'expo-network';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, radius, spacing } from '@/constants/theme';

/**
 * A strip at the top of every screen while the phone has no internet (Milestone 02 issue U10,
 * poor connection). Firestore keeps showing the last data it had, so without this the app would
 * look fine while nothing is being sent or received. Taps go through it to the screen below.
 */
export function OfflineBanner() {
  const network = useNetworkState();
  const insets = useSafeAreaInsets();

  // Both values are unknown for a moment at start-up, so only a definite "no" counts.
  const offline = network.isConnected === false || network.isInternetReachable === false;
  if (!offline) return null;

  return (
    <View
      pointerEvents="none"
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[styles.banner, { top: insets.top + spacing.xs }]}
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.onPrimary} />
      <Text style={styles.text}>You are offline. Live updates are paused until you reconnect.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.text,
  },
  text: { flex: 1, fontSize: fontSize.caption, fontWeight: '600', color: colors.onPrimary },
});
