import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

import { colors, fontSize } from '@/constants/theme';

type IconName = ComponentProps<typeof Ionicons>['name'];

/** Shared look for the bottom tab bar of all three roles. */
export const tabScreenOptions = {
  headerShown: false,
  tabBarActiveTintColor: colors.primary,
  tabBarInactiveTintColor: colors.textMuted,
  tabBarLabelStyle: { fontSize: fontSize.caption, fontWeight: '600' as const },
  tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
};

/** Filled icon when the tab is selected, outline icon otherwise. */
export function tabIcon(active: IconName, inactive: IconName) {
  return function TabIcon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return <Ionicons name={focused ? active : inactive} size={24} color={color} />;
  };
}
