import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { FoodPlate } from '@/components/food-plate';
import { colors, fontSize, radius, shadow, spacing } from '@/constants/theme';
import type { Cook } from '@/types';

/**
 * The cook's page as customers see it on C2 and C3, on the cook's More tab, with the button to edit it.
 * A cook who just signed up has no area yet, so the card asks them to fill it in.
 */
export function KitchenCard({ cook, onEdit }: { cook: Cook; onEdit: () => void }) {
  const incomplete = !cook.area;

  return (
    <View style={styles.card}>
      <View style={styles.cover}>
        <View style={[styles.circle, styles.circleBig]} />
        <FoodPlate size={72} />
        <View style={styles.coverText}>
          <Text style={styles.kicker}>Your cook page</Text>
          <Text style={styles.name} numberOfLines={2}>
            {cook.displayName}
          </Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text style={styles.rating}>
              {cook.reviewCount > 0 ? cook.rating.toFixed(1) : 'New'}
            </Text>
            <Text style={styles.muted}>
              {cook.reviewCount} {cook.reviewCount === 1 ? 'review' : 'reviews'}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.body}>
        {incomplete ? (
          <View style={styles.warning}>
            <Ionicons name="alert-circle-outline" size={20} color={colors.warning} />
            <Text style={styles.warningText}>
              Your cook page has no area yet. Add your kitchen details so customers can find you.
            </Text>
          </View>
        ) : (
          <View style={styles.facts}>
            <Fact icon="location-outline" text={cook.area} />
            <Fact icon="time-outline" text={`${cook.etaMin}–${cook.etaMax} min delivery`} />
            <Fact
              icon="calendar-outline"
              text={cook.acceptsPreorder ? `Pre-orders until ${cook.cutoffTime}` : 'No pre-orders'}
            />
          </View>
        )}

        <View style={styles.badges}>
          {cook.verified ? (
            <Badge label="Verified" tone="success" icon="shield-checkmark-outline" />
          ) : (
            <Badge label="Not verified yet" tone="neutral" icon="shield-outline" />
          )}
          <Badge label={`Hygiene ${cook.hygieneScore.toFixed(1)}`} tone="success" />
          {cook.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} label={tag} tone="primary" />
          ))}
        </View>

        <Button
          title={incomplete ? 'Add kitchen details' : 'Edit kitchen details'}
          variant={incomplete ? 'primary' : 'secondary'}
          icon="restaurant-outline"
          onPress={onEdit}
        />
      </View>
    </View>
  );
}

function Fact({
  icon,
  text,
}: {
  icon: 'location-outline' | 'time-outline' | 'calendar-outline';
  text: string;
}) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={18} color={colors.primaryDark} />
      <Text style={styles.factText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    ...shadow.card,
  },
  cover: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.coverPeach,
  },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: colors.primarySoft },
  circleBig: { width: 160, height: 160, top: -60, right: -40 },
  coverText: { flex: 1, gap: 2 },
  kicker: {
    fontSize: fontSize.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  name: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.text },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  rating: { fontSize: fontSize.body, fontWeight: '800', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  body: { gap: spacing.md, padding: spacing.lg },
  facts: { gap: spacing.sm },
  fact: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  factText: { flex: 1, fontSize: fontSize.body, color: colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  warning: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.warningSoft,
  },
  warningText: { flex: 1, fontSize: fontSize.body, color: colors.text },
});
