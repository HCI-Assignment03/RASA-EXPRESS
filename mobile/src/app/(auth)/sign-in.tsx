import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { LanguageChips } from '@/features/auth/language-chips';
import { RoleTiles } from '@/features/auth/role-tiles';
import type { Language, Role } from '@/types';
import { authErrorMessage } from '@/utils/auth-errors';
import {
  normalizeMobile,
  validateEmail,
  validateMobile,
  validateName,
  validatePassword,
} from '@/utils/validation';

type Mode = 'signIn' | 'register';
type Field = 'name' | 'email' | 'mobile' | 'password';
type FieldErrors = Partial<Record<Field, string>>;

// C1 Welcome & sign-in. Create: register. Read: sign in.
// After a successful sign-in the root layout sends the user to the home tab of their role.
export default function SignInScreen() {
  const { signIn, register } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState<Mode>('signIn');
  const [role, setRole] = useState<Role>('customer');
  const [language, setLanguage] = useState<Language>('en');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const registering = mode === 'register';

  function switchMode(next: Mode) {
    setMode(next);
    setErrors({});
    setFormError('');
  }

  async function submit() {
    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: registering
        ? validatePassword(password)
        : password
          ? undefined
          : 'Enter your password.',
      name: registering ? validateName(name) : undefined,
      mobile: registering ? validateMobile(mobile) : undefined,
    };
    setErrors(nextErrors);
    setFormError('');
    if (Object.values(nextErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      if (registering) {
        await register({
          name: name.trim(),
          email: email.trim(),
          phone: normalizeMobile(mobile) ?? '',
          password,
          role,
          language,
        });
        toast.show('Welcome to RASA EXPRESS', 'success');
      } else {
        await signIn(email.trim(), password);
      }
    } catch (error) {
      setFormError(authErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="restaurant" size={44} color={colors.onPrimary} />
        </View>
        <Text style={styles.brand}>RASA EXPRESS</Text>
        <Text style={styles.tagline}>Home-cooked meals from trusted cooks near you</Text>
      </View>

      <View style={styles.modeSwitch} accessibilityRole="tablist">
        <ModeTab label="Sign in" selected={!registering} onPress={() => switchMode('signIn')} />
        <ModeTab
          label="Create account"
          selected={registering}
          onPress={() => switchMode('register')}
        />
      </View>

      {registering ? <RoleTiles value={role} onChange={setRole} /> : null}

      {registering ? (
        <TextField
          label="Your name"
          value={name}
          onChangeText={setName}
          error={errors.name}
          placeholder="e.g. Kawya Perera"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
        />
      ) : null}

      <TextField
        label="Email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        returnKeyType="next"
      />

      {registering ? (
        <TextField
          label="Mobile number"
          prefix="+94"
          value={mobile}
          onChangeText={setMobile}
          error={errors.mobile}
          placeholder="77 123 4567"
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          returnKeyType="next"
        />
      ) : null}

      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        placeholder={registering ? 'At least 6 characters' : 'Your password'}
        secureTextEntry={!showPassword}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete={registering ? 'new-password' : 'current-password'}
        textContentType={registering ? 'newPassword' : 'password'}
        returnKeyType="done"
        onSubmitEditing={submit}
        trailing={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            onPress={() => setShowPassword((shown) => !shown)}
            hitSlop={8}
            style={styles.eye}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        }
      />

      {formError ? (
        <View style={styles.formError} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
          <Text style={styles.formErrorText}>{formError}</Text>
        </View>
      ) : null}

      <Button
        title={registering ? 'Create account' : 'Sign in'}
        onPress={submit}
        loading={submitting}
      />

      {registering ? (
        <View style={styles.language}>
          <Text style={styles.languageLabel}>Preferred language</Text>
          <LanguageChips value={language} onChange={setLanguage} />
        </View>
      ) : null}

      <Text style={styles.terms}>By continuing you agree to the Terms & Privacy Policy</Text>
    </Screen>
  );
}

function ModeTab({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.modeTab, selected && styles.modeTabSelected]}
    >
      <Text style={[styles.modeLabel, selected && styles.modeLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg },
  logo: {
    width: 88,
    height: 88,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontSize: fontSize.title,
    fontWeight: '800',
    letterSpacing: 1,
    color: colors.primaryDark,
  },
  tagline: { fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center' },
  modeSwitch: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
  modeTab: {
    flex: 1,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  modeTabSelected: { backgroundColor: colors.surface },
  modeLabel: { fontSize: fontSize.body, fontWeight: '600', color: colors.textMuted },
  modeLabelSelected: { color: colors.primaryDark },
  eye: {
    minWidth: minTapSize,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  formErrorText: { flex: 1, fontSize: fontSize.body, color: colors.danger },
  language: { gap: spacing.sm, paddingTop: spacing.sm },
  languageLabel: { fontSize: fontSize.caption, color: colors.textMuted, textAlign: 'center' },
  terms: {
    fontSize: fontSize.caption,
    color: colors.textMuted,
    textAlign: 'center',
    paddingTop: spacing.sm,
  },
});
