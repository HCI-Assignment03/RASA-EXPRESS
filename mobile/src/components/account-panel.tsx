import { StyleSheet, Text } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

/**
 * Who is signed in, plus Sign out. Used by the Profile / More tab of every role,
 * so each member can switch accounts while testing. C1 can extend it (edit profile, delete account).
 */
export function AccountPanel() {
  const { profile, signOut } = useAuth();

  return (
    <>
      <Card>
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
        <Badge label={profile?.role ?? ''} tone="primary" />
      </Card>
      <Button title="Sign out" variant="secondary" icon="log-out-outline" onPress={signOut} />
    </>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  email: { fontSize: fontSize.body, color: colors.textMuted, marginBottom: spacing.sm },
});
