import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors, fontSize, radius, shadow, spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
};

// Filled buttons carry a soft glow so the main action of a screen stands out; the others are tinted.
const VARIANTS: Record<Variant, { bg: string; fg: string; border: string; raised: boolean }> = {
  primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary, raised: true },
  secondary: {
    bg: colors.primarySoft,
    fg: colors.primaryDark,
    border: colors.primarySoft,
    raised: false,
  },
  success: { bg: colors.success, fg: colors.onPrimary, border: colors.success, raised: true },
  danger: { bg: colors.dangerSoft, fg: colors.danger, border: colors.dangerSoft, raised: false },
  ghost: { bg: 'transparent', fg: colors.text, border: colors.border, raised: false },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
}: Props) {
  const inactive = disabled || loading;
  const palette = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        palette.raised &&
          !inactive &&
          (variant === 'success' ? styles.raisedSuccess : styles.raised),
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: inactive ? 0.5 : pressed ? 0.9 : 1,
          transform: [{ scale: pressed && !inactive ? 0.98 : 1 }],
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={20} color={palette.fg} /> : null}
          <Text style={[styles.label, { color: palette.fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md + 2,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  raised: { ...shadow.raised },
  raisedSuccess: { boxShadow: '0px 8px 20px rgba(46, 158, 91, 0.25)' },
  label: { fontSize: fontSize.body, fontWeight: '700' },
});
