import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { DeleteAccountForm } from '@/features/auth/delete-account-form';
import { EditProfileForm } from '@/features/auth/edit-profile-form';
import { LANGUAGE_LABELS } from '@/features/auth/language-chips';
import { formatMobile } from '@/utils/format';

type View = 'summary' | 'edit' | 'delete';

/**
 * C1 profile management, shown on the Profile / More tab of every role:
 * who is signed in, edit profile (Update), delete account (Delete) and Sign out.
 */
export function AccountPanel() {
  const { profile, signOut } = useAuth();
  const [view, setView] = useState<View>('summary');

  if (!profile) return null;

  if (view === 'edit') {
    return <EditProfileForm profile={profile} onDone={() => setView('summary')} />;
  }
  if (view === 'delete') {
    return <DeleteAccountForm onCancel={() => setView('summary')} />;
  }

  return (
    <>
      <Card>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.line}>{profile.email}</Text>
        <Text style={styles.line}>{formatMobile(profile.phone)}</Text>
        <Text style={[styles.line, styles.last]}>
          Language: {LANGUAGE_LABELS[profile.language]}
        </Text>
        <Badge label={profile.role} tone="primary" />
      </Card>
      <Button
        title="Edit profile"
        variant="secondary"
        icon="create-outline"
        onPress={() => setView('edit')}
      />
      <Button title="Sign out" variant="ghost" icon="log-out-outline" onPress={signOut} />
      <Button
        title="Delete account"
        variant="danger"
        icon="trash-outline"
        onPress={() => setView('delete')}
      />
    </>
  );
}

const styles = StyleSheet.create({
  name: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  line: { fontSize: fontSize.body, color: colors.textMuted },
  last: { marginBottom: spacing.sm },
});
