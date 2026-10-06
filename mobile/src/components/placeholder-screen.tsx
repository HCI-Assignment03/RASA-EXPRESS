import { StyleSheet, Text } from 'react-native';

import { Badge } from '@/components/badge';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { colors, fontSize, spacing } from '@/constants/theme';

type Props = {
  code: string;
  title: string;
  owner: string;
  requirements: string;
  /** The CRUD operations this interface must support (docs/TEAM_SCOPE.md). */
  crud: string;
};

/**
 * Temporary stand-in for an interface that has not been built yet.
 * The owner replaces the whole screen file (and drops this import) when building it.
 */
export function PlaceholderScreen({ code, title, owner, requirements, crud }: Props) {
  return (
    <Screen scroll edges={['top', 'bottom']}>
      <Badge label="Not built yet" tone="warning" icon="construct-outline" />
      <Text style={styles.heading}>
        {code} · {title}
      </Text>
      <Card>
        <Text style={styles.label}>Owner</Text>
        <Text style={styles.value}>{owner}</Text>
        <Text style={styles.label}>Requirements</Text>
        <Text style={styles.value}>{requirements}</Text>
        <Text style={styles.label}>CRUD to implement</Text>
        <Text style={styles.value}>{crud}</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: fontSize.title, fontWeight: '700', color: colors.text },
  label: { fontSize: fontSize.caption, color: colors.textMuted, marginTop: spacing.sm },
  value: { fontSize: fontSize.body, color: colors.text },
});
