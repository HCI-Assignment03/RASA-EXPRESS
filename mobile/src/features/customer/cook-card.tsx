import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { FoodPlate } from '@/components/food-plate';
import { colors, fontSize, minTapSize, radius, shadow, spacing } from '@/constants/theme';
import type { Cook, WithId } from '@/types';

type Props = {
  cook: WithId<Cook>;
  saved: boolean;
  onPress: () => void;
  onToggleSaved: () => void;
};

/** One cook on C2: trust signals (verified, rating, hygiene) readable at a glance. */
export function CookCard({ cook, saved, onPress, onToggleSaved }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${cook.displayName}, rated ${cook.rating}${cook.verified ? ', verified' : ''}`}
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <View style={styles.cover}>
          <FoodPlate size={104} />
          {cook.acceptsPreorder ? (
            <View style={styles.preorder}>
              <Ionicons name="calendar-outline" size={14} color={colors.primaryDark} />
              <Text style={styles.preorderText}>Pre-order</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={1}>
              {cook.displayName}
            </Text>
            {cook.verified ? (
              <Badge label="Verified" tone="success" icon="shield-checkmark-outline" />
            ) : null}
          </View>

          <View style={styles.row}>
            <Ionicons name="star" size={16} color="#F5B301" />
            <Text style={styles.rating}>{cook.rating.toFixed(1)}</Text>
            <Text style={styles.muted}>
              ({cook.reviewCount}){cook.tags.length ? `  ·  ${cook.tags.join(' · ')}` : ''}
            </Text>
          </View>

          <View style={styles.row}>
            <Badge label={`Hygiene ${cook.hygieneScore.toFixed(1)}`} tone="success" />
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={styles.muted}>
              {cook.etaMin}–{cook.etaMax} min
            </Text>
            <Ionicons name="location-outline" size={16} color={colors.textMuted} />
            <Text style={styles.muted}>{cook.distanceKm.toFixed(1)} km</Text>
          </View>
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          saved ? `Remove ${cook.displayName} from favourites` : `Save ${cook.displayName}`
        }
        accessibilityState={{ selected: saved }}
        onPress={onToggleSaved}
        style={styles.heart}
      >
        <Ionicons
          name={saved ? 'heart' : 'heart-outline'}
          size={22}
          color={saved ? colors.danger : colors.textMuted}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    ...shadow.card,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.9 },
  cover: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coverPeach,
  },
  preorder: {
    position: 'absolute',
    left: spacing.md,
    bottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  preorderText: { fontSize: fontSize.caption, fontWeight: '600', color: colors.primaryDark },
  heart: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  body: { padding: spacing.lg, gap: spacing.sm },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: { flex: 1, fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  rating: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
});
