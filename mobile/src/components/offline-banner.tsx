import Ionicons from '@expo/vector-icons/Ionicons';
import { useNetworkState } from 'expo-network';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { SHEET_MAX_WIDTH } from '@/utils/layout';

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
      style={[
        styles.row,
        {
          top: insets.top + spacing.xs,
          paddingLeft: spacing.lg + insets.left,
          paddingRight: spacing.lg + insets.right,
        },
      ]}
    >
      <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={styles.banner}>
        <Ionicons name="cloud-offline-outline" size={18} color={colors.onPrimary} />
        <Text style={styles.text}>
          You are offline. Live updates are paused until you reconnect.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  banner: {
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
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
