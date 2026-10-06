import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, minTapSize } from '@/constants/theme';

type Props = {
  /** 0 to 5. */
  value: number;
  /** When set, the stars are tappable (C7). Otherwise they are display-only. */
  onChange?: (value: number) => void;
  size?: number;
};

export function StarRating({ value, onChange, size = 20 }: Props) {
  const rounded = Math.round(value);

  return (
    <View
      style={styles.row}
      accessibilityRole={onChange ? 'adjustable' : 'text'}
      accessibilityLabel={`${value} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const icon = (
          <Ionicons
            name={star <= rounded ? 'star' : 'star-outline'}
            size={size}
            color={star <= rounded ? '#F5B301' : colors.border}
          />
        );
        if (!onChange) {
          return <View key={star}>{icon}</View>;
        }
        return (
          <Pressable
            key={star}
            accessibilityRole="button"
            accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
            onPress={() => onChange(star)}
            style={styles.tap}
          >
            {icon}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  tap: {
    minWidth: minTapSize,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
