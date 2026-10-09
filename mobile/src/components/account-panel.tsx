import { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { DeleteAccountForm } from '@/features/auth/delete-account-form';
import { EditProfileForm } from '@/features/auth/edit-profile-form';
import { KitchenForm } from '@/features/auth/kitchen-form';
import { LANGUAGE_LABELS } from '@/features/auth/language-chips';
import { useCook } from '@/hooks/use-cooks';
import { formatMobile } from '@/utils/format';

type View = 'summary' | 'edit' | 'delete' | 'kitchen';

/**
 * C1 profile management, shown on the Profile / More tab of every role:
 * who is signed in, edit profile (Update), delete account (Delete) and Sign out.
 * A cook also edits their kitchen details (the cook page customers see) here.
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
  if (view === 'kitchen') {
    return <KitchenPanel cookId={profile.id} onDone={() => setView('summary')} />;
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
      {profile.role === 'cook' ? (
        <KitchenSummary cookId={profile.id} onEdit={() => setView('kitchen')} />
      ) : null}
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

/** The cook page in one card, with a nudge when a new cook has not filled it in yet. */
function KitchenSummary({ cookId, onEdit }: { cookId: string; onEdit: () => void }) {
  const { cook, loading } = useCook(cookId);
  if (loading || !cook) return null;

  return (
    <Card style={styles.kitchen}>
      <Text style={styles.name}>{cook.displayName}</Text>
      {cook.area ? (
        <Text style={styles.line}>
          {cook.area} · {cook.etaMin}–{cook.etaMax} min
          {cook.acceptsPreorder ? ` · Pre-orders until ${cook.cutoffTime}` : ''}
        </Text>
      ) : (
        <Text style={styles.warning}>
          Your cook page has no area yet. Add your kitchen details so customers can find you.
        </Text>
      )}
      <Button
        title="Kitchen details"
        variant="secondary"
        icon="restaurant-outline"
        onPress={onEdit}
      />
    </Card>
  );
}

function KitchenPanel({ cookId, onDone }: { cookId: string; onDone: () => void }) {
  const { cook, loading, error, reload } = useCook(cookId);

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
  }
  if (error || !cook) {
    return (
      <Card style={styles.kitchen}>
        <Text style={styles.line}>{error || 'Your cook page could not be found.'}</Text>
        {error ? <Button title="Try again" icon="refresh" onPress={reload} /> : null}
        <Button title="Go back" variant="ghost" onPress={onDone} />
      </Card>
    );
  }
  return <KitchenForm cook={cook} onDone={onDone} />;
}

const styles = StyleSheet.create({
  name: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  line: { fontSize: fontSize.body, color: colors.textMuted },
  last: { marginBottom: spacing.sm },
  kitchen: { gap: spacing.sm },
  warning: { fontSize: fontSize.body, color: colors.warning },
  loader: { paddingVertical: spacing.xl },
});
