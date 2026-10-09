import { Children, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import { gridColumns, gridItemWidth } from '@/utils/layout';

type Props = {
  children: ReactNode;
  gap?: number;
};

/**
 * Lays its children out in 1, 2 or 3 columns, depending on how wide it is: one column on a phone,
 * two on a phone held sideways or a small tablet, three on a big tablet. It measures its own width,
 * so it is right whatever the safe areas, padding or split-view size around it.
 */
export function Grid({ children, gap = spacing.md }: Props) {
  const [width, setWidth] = useState(0);
  const columns = gridColumns(width);
  // Until the first measurement every item takes the full width (a phone layout).
  const itemWidth = width > 0 ? gridItemWidth(width, columns, gap) : '100%';

  return (
    <View
      style={[styles.grid, { gap }]}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {Children.map(children, (child) => (
        <View style={{ width: itemWidth }}>{child}</View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
});
