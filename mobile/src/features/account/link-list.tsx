import Ionicons from '@expo/vector-icons/Ionicons';
import { Fragment, type ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, shadow, spacing, type Tone } from '@/constants/theme';

export type LinkItem = {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  /** A second line, such as "2 active" or "Rs. 1,300 in your cart". */
  detail?: string;
  /** A number in an orange bubble, such as unread alerts. Hidden when 0. */
  count?: number;
  tone?: Tone;
  onPress: () => void;
};

const TONES: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: colors.primarySoft, fg: colors.primaryDark },
  success: { bg: colors.successSoft, fg: colors.success },
  warning: { bg: colors.warningSoft, fg: colors.warning },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  neutral: { bg: colors.surfaceMuted, fg: colors.text },
};

/** A titled group of tappable rows (icon, label, detail, chevron), like a phone's settings list. */
export function LinkList({ title, items }: { title: string; items: LinkItem[] }) {
  return (
    <View style={styles.section}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      <View style={styles.card}>
        {items.map((item, index) => {
          const tone = TONES[item.tone ?? 'primary'];
          const danger = item.tone === 'danger';
          return (
            <Fragment key={item.label}>
              {index > 0 ? <View style={styles.divider} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={[
                  item.label,
                  item.detail,
                  item.count ? `${item.count} new` : undefined,
                ]
                  .filter(Boolean)
                  .join(', ')}
                onPress={item.onPress}
                style={({ pressed }) => [styles.row, pressed && styles.pressed]}
              >
                <View style={[styles.icon, { backgroundColor: tone.bg }]}>
                  <Ionicons name={item.icon} size={20} color={tone.fg} />
                </View>
                <View style={styles.text}>
                  <Text style={[styles.label, danger && styles.danger]}>{item.label}</Text>
                  {item.detail ? (
                    <Text style={styles.detail} numberOfLines={1}>
                      {item.detail}
                    </Text>
                  ) : null}
                </View>
                {item.count ? (
                  <View style={styles.count}>
                    <Text style={styles.countText}>{item.count}</Text>
                  </View>
                ) : null}
                {danger ? null : (
                  <Ionicons name="chevron-forward" size={20} color={colors.switchOff} />
                )}
              </Pressable>
            </Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: spacing.sm },
  title: {
    marginLeft: spacing.xs,
    fontSize: fontSize.caption,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.textMuted,
  },
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  row: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  pressed: { backgroundColor: colors.surfaceMuted },
  divider: { height: 1, marginLeft: 72, backgroundColor: colors.border },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, gap: 2 },
  label: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  danger: { color: colors.danger },
  detail: { fontSize: fontSize.caption, color: colors.textMuted },
  count: {
    minWidth: 26,
    height: 26,
    paddingHorizontal: spacing.sm,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  countText: { fontSize: fontSize.caption, fontWeight: '800', color: colors.onPrimary },
});
