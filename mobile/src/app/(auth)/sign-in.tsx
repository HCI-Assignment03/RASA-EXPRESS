import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { FoodPlate } from '@/components/food-plate';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, shadow, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { LanguageChips } from '@/features/auth/language-chips';
import { RoleTiles } from '@/features/auth/role-tiles';
import { useLayout } from '@/hooks/use-layout';
import type { Language, Role } from '@/types';
import { authErrorMessage } from '@/utils/auth-errors';
import { WIDE_MAX_WIDTH } from '@/utils/layout';
import {
  normalizeMobile,
  validateEmail,
  validateMobile,
  validateName,
  validatePassword,
} from '@/utils/validation';

type Mode = 'signIn' | 'register';

/** The sign-in column stays phone-sized on a tablet held upright. */
const FORM_MAX_WIDTH = 560;
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
  // In landscape (tablet or phone on its side) the welcome panel and the form sit side by side;
  // otherwise they are one centred column, in the middle of the screen when there is room.
  const { wide, short, landscape } = useLayout();
  const sideBySide = wide && landscape;

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
    <Screen
      scroll
      edges={['top', 'bottom']}
      maxWidth={sideBySide ? WIDE_MAX_WIDTH : FORM_MAX_WIDTH}
    >
      <View style={[styles.page, sideBySide ? styles.columns : styles.stack]}>
        <View style={[styles.hero, sideBySide && styles.column]}>
          <View style={[styles.circle, styles.circleBig]} />
          <View style={[styles.circle, styles.circleSmall]} />
          <View style={styles.plateRing}>
            <FoodPlate size={short ? 64 : 84} />
          </View>
          <Text style={styles.brand}>RASA EXPRESS</Text>
          <Text style={styles.tagline}>Home-cooked meals from trusted cooks near you</Text>
          <View style={styles.highlights}>
            <Highlight icon="shield-checkmark" label="Verified cooks" />
            <Highlight icon="navigate" label="Live tracking" />
            <Highlight icon="cash" label="Cash on delivery" />
          </View>
        </View>

        <View style={[styles.stack, sideBySide && styles.column]}>
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
        </View>
      </View>
    </Screen>
  );
}

function Highlight({
  icon,
  label,
}: {
  icon: 'shield-checkmark' | 'navigate' | 'cash';
  label: string;
}) {
  return (
    <View style={styles.highlight}>
      <Ionicons name={icon} size={14} color={colors.onPrimary} />
      <Text style={styles.highlightText}>{label}</Text>
    </View>
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
  page: { flexGrow: 1, justifyContent: 'center' },
  stack: { gap: spacing.md },
  columns: { flexDirection: 'row', alignItems: 'center', gap: spacing.xl },
  column: { flex: 1 },
  hero: {
    overflow: 'hidden',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    ...shadow.raised,
  },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: colors.onPrimaryFaint },
  circleBig: { width: 220, height: 220, top: -90, right: -70 },
  circleSmall: { width: 140, height: 140, bottom: -60, left: -50 },
  plateRing: {
    padding: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: 999,
    backgroundColor: colors.onPrimarySoft,
  },
  brand: {
    fontSize: fontSize.heading,
    fontWeight: '800',
    letterSpacing: 2,
    color: colors.onPrimary,
  },
  tagline: { fontSize: fontSize.body, color: colors.onPrimary, opacity: 0.92, textAlign: 'center' },
  highlights: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.onPrimarySoft,
  },
  highlightText: { fontSize: fontSize.caption, fontWeight: '700', color: colors.onPrimary },
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
