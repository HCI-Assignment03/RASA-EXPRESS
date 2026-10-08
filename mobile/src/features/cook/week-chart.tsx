import { StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { barHeights, compactAmount, type DayBar } from '@/utils/sales';

const CHART_HEIGHT = 120;

/** The 7-day bar chart of S4. Today's bar is orange, the earlier days a lighter shade. */
export function WeekChart({ bars }: { bars: DayBar[] }) {
  const heights = barHeights(bars);

  return (
    <View
      accessible
      accessibilityLabel={`Sales for the last 7 days. ${bars
        .map((bar) => `${bar.label}: Rs. ${bar.total}`)
        .join(', ')}`}
      style={styles.row}
    >
      {bars.map((bar, index) => {
        const isToday = index === bars.length - 1;
        return (
          <View key={bar.label} style={styles.column}>
            <Text style={styles.amount}>{compactAmount(bar.total)}</Text>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  { height: Math.max(heights[index] * CHART_HEIGHT, bar.total > 0 ? 6 : 2) },
                  isToday ? styles.barToday : styles.barPast,
                ]}
              />
            </View>
            <Text style={[styles.label, isToday && styles.labelToday]}>{bar.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.xs },
  column: { flex: 1, alignItems: 'center', gap: spacing.xs },
  amount: { fontSize: fontSize.caption, color: colors.textMuted },
  track: { height: CHART_HEIGHT, justifyContent: 'flex-end', alignSelf: 'stretch' },
  bar: { alignSelf: 'stretch', borderRadius: radius.sm },
  barToday: { backgroundColor: colors.primary },
  barPast: { backgroundColor: '#F7B58A' },
  label: { fontSize: fontSize.caption, color: colors.textMuted },
  labelToday: { fontWeight: '700', color: colors.primaryDark },
});
