import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing, type Tone } from '@/constants/theme';

type Props = {
  label: string;
  tone?: Tone;
  icon?: ComponentProps<typeof Ionicons>['name'];
};

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceMuted, fg: colors.textMuted },
};

export function Badge({ label, tone = 'neutral', icon }: Props) {
  const palette = TONES[tone];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      {icon ? <Ionicons name={icon} size={14} color={palette.fg} /> : null}
      <Text style={[styles.label, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
  },
  label: { fontSize: fontSize.caption, fontWeight: '600' },
});
