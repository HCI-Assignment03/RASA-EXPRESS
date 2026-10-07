import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { AppNotification, WithId } from '@/types';
import { formatTimeAgo } from '@/utils/format';

type Props = {
  alert: WithId<AppNotification>;
  onPress: () => void;
};

/** One alert on C8. Unread alerts are bold with an orange dot. Tapping flips read / unread. */
export function AlertRow({ alert, onPress }: Props) {
  const when = formatTimeAgo(alert.createdAt.toDate());

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${alert.read ? 'Read' : 'Unread'} alert: ${alert.text}. ${when}. Tap to mark as ${alert.read ? 'unread' : 'read'}`}
      onPress={onPress}
      style={[styles.row, !alert.read && styles.unread]}
    >
      <View style={[styles.dot, alert.read && styles.dotRead]} />
      <View style={styles.text}>
        <Text style={[styles.message, !alert.read && styles.messageUnread]}>{alert.text}</Text>
        <Text style={styles.time}>{when}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  unread: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  dot: {
    width: 10,
    height: 10,
    marginTop: 6,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dotRead: { backgroundColor: 'transparent' },
  text: { flex: 1, gap: spacing.xs },
  message: { fontSize: fontSize.body, color: colors.text },
  messageUnread: { fontWeight: '700' },
  time: { fontSize: fontSize.caption, color: colors.textMuted },
});
