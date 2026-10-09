import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, shadow, spacing, type Tone } from '@/constants/theme';

export type Stat = {
  icon: ComponentProps<typeof Ionicons>['name'];
  /** Already formatted, for example "12" or "Rs. 4,550". */
  value: string;
  label: string;
  tone: Tone;
};

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceMuted, fg: colors.textMuted },
};

/** A row of three numbers at a glance on the Profile / More tabs, such as orders, reviews, saved cooks. */
export function StatTiles({ items }: { items: Stat[] }) {
  return (
    <View style={styles.row}>
      {items.map((item) => {
        const tone = TONES[item.tone];
        return (
          <View
            key={item.label}
            style={styles.tile}
            accessible
            accessibilityLabel={`${item.label}: ${item.value}`}
          >
            <View style={[styles.icon, { backgroundColor: tone.bg }]}>
              <Ionicons name={item.icon} size={18} color={tone.fg} />
            </View>
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
              {item.value}
            </Text>
            <Text style={styles.label} numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  icon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  value: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.text },
  label: { fontSize: fontSize.caption, color: colors.textMuted },
});
