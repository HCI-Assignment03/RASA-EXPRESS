import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, View, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, shadow, spacing } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Shared look for the bottom tab bar of all three roles: a white bar with a soft shadow, and the
 * selected tab marked by an orange pill behind its icon (easier to spot than a colour change alone).
 * The bar is sized from the safe-area inset so it clears the home indicator / navigation bar.
 */
export function useTabScreenOptions() {
  const insets = useSafeAreaInsets();
  return {
    headerShown: false,
    tabBarActiveTintColor: colors.primaryDark,
    tabBarInactiveTintColor: colors.textMuted,
    tabBarLabelStyle: { fontSize: fontSize.caption, fontWeight: '700' as const },
    tabBarStyle: {
      height: 66 + insets.bottom,
      paddingTop: spacing.sm,
      paddingBottom: Math.max(insets.bottom, spacing.sm),
      backgroundColor: colors.surface,
      borderTopWidth: 0,
      ...shadow.bar,
    },
  };
}

/** Filled icon in an orange pill when the tab is selected, outline icon otherwise. */
export function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <View style={[styles.pill, focused && styles.pillActive]}>
        <Ionicons name={focused ? active : inactive} size={22} color={color} />
      </View>
    );
  };
}

const styles = StyleSheet.create({
  pill: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: { backgroundColor: colors.primarySoft },
});
