import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, spacing } from '@/constants/theme';
import { PROGRESS_STEPS } from '@/utils/tracking';

/** The five-step progress of an order on C6. `current` is the step reached (0 to 4). */
export function ProgressBar({ current }: { current: number }) {
  return (
    <View
      accessible
      accessibilityLabel={`Order progress: step ${current + 1} of ${PROGRESS_STEPS.length}, ${PROGRESS_STEPS[current]}`}
      style={styles.row}
    >
      {PROGRESS_STEPS.map((label, index) => {
        const done = index <= current;
        return (
          <View key={label} style={styles.step}>
            <View style={styles.line}>
              <View style={[styles.half, index > 0 && done && styles.lineDone]} />
              <View style={[styles.dot, done && styles.dotDone]}>
                {done ? <Ionicons name="checkmark" size={14} color={colors.onPrimary} /> : null}
              </View>
              <View
                style={[
                  styles.half,
                  index < PROGRESS_STEPS.length - 1 && index < current && styles.lineDone,
                ]}
              />
            </View>
            <Text style={[styles.label, done && styles.labelDone]}>{label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  step: { flex: 1, alignItems: 'center', gap: spacing.xs },
  line: { flexDirection: 'row', alignItems: 'center', alignSelf: 'stretch' },
  half: { flex: 1, height: 3, backgroundColor: 'transparent' },
  lineDone: { backgroundColor: colors.primary },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  dotDone: { borderColor: colors.primary, backgroundColor: colors.primary },
  label: { fontSize: fontSize.caption, color: colors.textMuted, textAlign: 'center' },
  labelDone: { fontWeight: '700', color: colors.primaryDark },
});
