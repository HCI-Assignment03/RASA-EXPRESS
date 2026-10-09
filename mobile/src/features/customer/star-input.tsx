import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';

type Props = {
  label: string;
  /** 0 means not rated yet. */
  value: number;
  onChange: (stars: number) => void;
  error?: string;
};

const STAR_COLOR = '#F5B301';

/** A row of five tappable stars for one rating on C7. Each star is a 44 point touch target. */
export function StarInput({ label, value, onChange, error }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row} accessibilityRole="radiogroup">
        {[1, 2, 3, 4, 5].map((stars) => (
          <Pressable
            key={stars}
            accessibilityRole="radio"
            accessibilityLabel={`${label}: ${stars} ${stars === 1 ? 'star' : 'stars'}`}
            accessibilityState={{ selected: value === stars }}
            onPress={() => onChange(stars)}
            style={styles.star}
          >
            <Ionicons
              name={stars <= value ? 'star' : 'star-outline'}
              size={34}
              color={stars <= value ? STAR_COLOR : colors.border}
            />
          </Pressable>
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  row: { flexDirection: 'row', gap: spacing.xs },
  star: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  error: { fontSize: fontSize.caption, color: colors.danger },
});
