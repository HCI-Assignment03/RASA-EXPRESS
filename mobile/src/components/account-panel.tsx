import Constants from 'expo-constants';
import { useState, type ReactNode } from 'react';
import { Alert, StyleSheet, Text } from 'react-native';

import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { LinkList } from '@/features/account/link-list';
import { ProfileHero } from '@/features/account/profile-hero';
import { DeleteAccountForm } from '@/features/auth/delete-account-form';
import { EditProfileForm } from '@/features/auth/edit-profile-form';
import { LANGUAGE_LABELS } from '@/features/auth/language-chips';
import type { Role } from '@/types';
import { formatMobile } from '@/utils/format';

type View = 'summary' | 'edit' | 'delete';

const ROLE: Record<Role, { label: string; icon: 'person' | 'restaurant' | 'bicycle' }> = {
  customer: { label: 'Customer', icon: 'person' },
  cook: { label: 'Home cook', icon: 'restaurant' },
  rider: { label: 'Delivery rider', icon: 'bicycle' },
};

/**
 * C1 profile management, shown on the Profile / More tab of every role: who is signed in, edit
 * profile (Update), delete account (Delete) and Sign out. Each role passes its own sections
 * (numbers at a glance, shortcuts) as children; they appear between the header and the account rows.
 */
export function AccountPanel({ children }: { children?: ReactNode }) {
  const { profile, signOut } = useAuth();
  const [view, setView] = useState<View>('summary');

  if (!profile) return null;

  if (view === 'edit') {
    return <EditProfileForm profile={profile} onDone={() => setView('summary')} />;
  }
  if (view === 'delete') {
    return <DeleteAccountForm onCancel={() => setView('summary')} />;
  }

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in at any time.', [
      { text: 'Stay signed in', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <>
      <ProfileHero
        name={profile.name}
        email={profile.email}
        roleLabel={ROLE[profile.role].label}
        roleIcon={ROLE[profile.role].icon}
        onEdit={() => setView('edit')}
      />

      {children}

      <LinkList
        title="Account"
        items={[
          {
            icon: 'person-outline',
            label: 'Edit profile',
            detail: `${formatMobile(profile.phone)} · ${LANGUAGE_LABELS[profile.language]}`,
            tone: 'neutral',
            onPress: () => setView('edit'),
          },
          {
            icon: 'log-out-outline',
            label: 'Sign out',
            tone: 'neutral',
            onPress: confirmSignOut,
          },
          {
            icon: 'trash-outline',
            label: 'Delete account',
            detail: 'Removes your account for good',
            tone: 'danger',
            onPress: () => setView('delete'),
          },
        ]}
      />

      <Text style={styles.footer}>
        RASA EXPRESS · Version {Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingVertical: spacing.md,
    textAlign: 'center',
    fontSize: fontSize.caption,
    color: colors.textMuted,
  },
});
