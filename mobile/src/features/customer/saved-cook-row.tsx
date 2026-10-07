import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { FoodPlate } from '@/components/food-plate';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { Cook, WithId } from '@/types';

type Props = {
  cook: WithId<Cook>;
  alertsOn: boolean;
  onOpen: () => void;
  onToggleAlerts: () => void;
  onRemove: () => void;
};

/** One saved cook on C8: open the cook, switch alerts on or off, or remove the cook. */
export function SavedCookRow({ cook, alertsOn, onOpen, onToggleAlerts, onRemove }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${cook.displayName}, rated ${cook.rating.toFixed(1)}. Open profile`}
          onPress={onOpen}
          style={styles.info}
        >
          <View style={styles.thumb}>
            <FoodPlate size={48} />
          </View>
          <View style={styles.text}>
            <Text style={styles.name} numberOfLines={1}>
              {cook.displayName}
            </Text>
            <View style={styles.meta}>
              <Ionicons name="star" size={14} color="#F5B301" />
              <Text style={styles.muted}>
                {cook.rating.toFixed(1)} · {cook.etaMin}–{cook.etaMax} min
              </Text>
            </View>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${cook.displayName} from favourites`}
          onPress={onRemove}
          style={styles.remove}
        >
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </Pressable>
      </View>

      <View style={styles.alertRow}>
        <Ionicons
          name={alertsOn ? 'notifications' : 'notifications-off-outline'}
          size={20}
          color={alertsOn ? colors.primary : colors.textMuted}
        />
        <Text style={styles.alertLabel}>Alert me about new dishes</Text>
        <Switch
          accessibilityLabel={`Alerts for ${cook.displayName}`}
          value={alertsOn}
          onValueChange={onToggleAlerts}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.surface}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  info: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumb: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coverPeach,
  },
  text: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  remove: {
    width: minTapSize,
    height: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertRow: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  alertLabel: { flex: 1, fontSize: fontSize.body, color: colors.text },
});
