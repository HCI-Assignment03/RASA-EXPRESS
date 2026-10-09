import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, shadow, spacing } from '@/constants/theme';
import { useLayout } from '@/hooks/use-layout';
import { initials } from '@/utils/format';

type Props = {
  name: string;
  email: string;
  /** "Customer", "Home cook" or "Delivery rider". */
  roleLabel: string;
  roleIcon: ComponentProps<typeof Ionicons>['name'];
  onEdit: () => void;
};

/** The orange card at the top of every Profile / More tab: who is signed in, with an edit button. */
export function ProfileHero({ name, email, roleLabel, roleIcon, onEdit }: Props) {
  // Smaller avatar and padding on narrow phones, so the name keeps room.
  const { compact } = useLayout();

  return (
    <View style={[styles.hero, compact && styles.heroCompact]}>
      {/* Decorative circles, like the cover of the prototype. */}
      <View style={[styles.circle, styles.circleBig]} />
      <View style={[styles.circle, styles.circleSmall]} />

      <View style={[styles.row, compact && styles.rowCompact]}>
        <View style={[styles.avatar, compact && styles.avatarCompact]} accessibilityElementsHidden>
          <Text style={styles.avatarText}>{initials(name)}</Text>
        </View>
        <View style={styles.text}>
          <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
          <View style={styles.role}>
            <Ionicons name={roleIcon} size={14} color={colors.onPrimary} />
            <Text style={styles.roleText}>{roleLabel}</Text>
          </View>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit profile"
          onPress={onEdit}
          style={({ pressed }) => [styles.edit, pressed && styles.editPressed]}
        >
          <Ionicons name="create-outline" size={20} color={colors.onPrimary} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    overflow: 'hidden',
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.raised,
  },
  heroCompact: { padding: spacing.lg },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: colors.onPrimaryFaint },
  circleBig: { width: 190, height: 190, top: -70, right: -50 },
  circleSmall: { width: 110, height: 110, bottom: -50, left: -30 },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  rowCompact: { gap: spacing.md },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 3,
    borderColor: colors.onPrimarySoft,
  },
  avatarCompact: { width: 52, height: 52, borderRadius: 26 },
  avatarText: { fontSize: fontSize.title, fontWeight: '800', color: colors.primaryDark },
  text: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.title, fontWeight: '800', color: colors.onPrimary },
  nameCompact: { fontSize: fontSize.subtitle },
  email: { fontSize: fontSize.caption, color: colors.onPrimary, opacity: 0.9 },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.onPrimarySoft,
  },
  roleText: { fontSize: fontSize.caption, fontWeight: '700', color: colors.onPrimary },
  edit: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.onPrimarySoft,
  },
  editPressed: { opacity: 0.7 },
});
