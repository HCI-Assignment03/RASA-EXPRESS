import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import type { Language, UserProfile, WithId } from '@/types';
import { authErrorMessage } from '@/utils/auth-errors';
import { normalizeMobile, validateMobile, validateName } from '@/utils/validation';

import { LanguageChips } from './language-chips';

type Props = {
  profile: WithId<UserProfile>;
  onDone: () => void;
};

/** C1 Update: name, mobile number and preferred language. */
export function EditProfileForm({ profile, onDone }: Props) {
  const { updateProfile } = useAuth();
  const toast = useToast();

  const [name, setName] = useState(profile.name);
  // Shown without the leading 0, next to the +94 prefix.
  const [mobile, setMobile] = useState(profile.phone.replace(/^0/, ''));
  const [language, setLanguage] = useState<Language>(profile.language);
  const [nameError, setNameError] = useState<string>();
  const [mobileError, setMobileError] = useState<string>();
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  async function save() {
    const nextNameError = validateName(name);
    const nextMobileError = validateMobile(mobile);
    setNameError(nextNameError);
    setMobileError(nextMobileError);
    setFormError('');
    if (nextNameError || nextMobileError) return;

    setSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        phone: normalizeMobile(mobile) ?? profile.phone,
        language,
      });
      toast.show('Profile updated', 'success');
      onDone();
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Edit profile</Text>
      <TextField
        label="Your name"
        value={name}
        onChangeText={setName}
        error={nameError}
        autoComplete="name"
        textContentType="name"
      />
      <TextField
        label="Mobile number"
        prefix="+94"
        value={mobile}
        onChangeText={setMobile}
        error={mobileError}
        placeholder="77 123 4567"
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
      />
      <View style={styles.language}>
        <Text style={styles.label}>Preferred language</Text>
        <LanguageChips value={language} onChange={setLanguage} />
      </View>
      {formError ? <Text style={styles.error}>{formError}</Text> : null}
      <Button title="Save changes" onPress={save} loading={saving} />
      <Button title="Cancel" variant="ghost" onPress={onDone} disabled={saving} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  language: { gap: spacing.sm },
  label: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  error: { fontSize: fontSize.body, color: colors.danger },
});
