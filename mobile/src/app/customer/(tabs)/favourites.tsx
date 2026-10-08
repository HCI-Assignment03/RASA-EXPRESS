import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';
import { AlertRow } from '@/features/customer/alert-row';
import { SavedCookRow } from '@/features/customer/saved-cook-row';
import { useAlertPrefs } from '@/hooks/use-alert-prefs';
import { useCooks } from '@/hooks/use-cooks';
import { useFavourites } from '@/hooks/use-favourites';
import { useNotifications } from '@/hooks/use-notifications';
import type { Cook, WithId } from '@/types';

type Section = 'saved' | 'alerts';

// C8 Favourites & alerts.
// Read: saved cooks and alerts. Create: an alert preference for a saved cook (first time the switch
// is turned on). Update: switch alerts on or off, mark an alert read. Delete: remove a saved cook.
export default function FavouritesScreen() {
  const toast = useToast();
  const [section, setSection] = useState<Section>('saved');

  const cooks = useCooks();
  const { favouriteIds, toggle: toggleFavourite } = useFavourites();
  const alertPrefs = useAlertPrefs();
  const alerts = useNotifications();

  const savedCooks = cooks.cooks
    .filter((cook) => favouriteIds.has(cook.id))
    .sort((a, b) => a.displayName.localeCompare(b.displayName));

  const openCook = (cookId: string) =>
    router.push({ pathname: '/customer/cook/[id]', params: { id: cookId } });

  const toggleAlerts = (cook: WithId<Cook>) => {
    const turningOn = !alertPrefs.isEnabled(cook.id);
    alertPrefs
      .toggle(cook.id)
      .then(() =>
        toast.show(`Alerts ${turningOn ? 'on' : 'off'} for ${cook.displayName}`, 'success'),
      )
      .catch(() => toast.show('Could not change the alert. Try again.', 'error'));
  };

  const confirmRemove = (cook: WithId<Cook>) => {
    Alert.alert('Remove from favourites?', `${cook.displayName} and its alerts will be removed.`, [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          toggleFavourite(cook.id)
            .then(() => toast.show('Removed from favourites', 'success'))
            .catch(() => toast.show('Could not remove it. Try again.', 'error'));
        },
      },
    ]);
  };

  const markAllRead = () => {
    alerts
      .markAllRead()
      .catch(() => toast.show('Could not update your alerts. Try again.', 'error'));
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Favourites & alerts</Text>

      <View style={styles.tabs} accessibilityRole="tablist">
        <SectionTab
          label="Saved cooks"
          selected={section === 'saved'}
          onPress={() => setSection('saved')}
        />
        <SectionTab
          label={alerts.unreadCount > 0 ? `Alerts (${alerts.unreadCount})` : 'Alerts'}
          selected={section === 'alerts'}
          onPress={() => setSection('alerts')}
        />
      </View>

      {section === 'saved' ? (
        <SavedSection
          loading={cooks.loading}
          error={cooks.error}
          onRetry={cooks.reload}
          cooks={savedCooks}
          isAlertOn={alertPrefs.isEnabled}
          onOpen={openCook}
          onToggleAlerts={toggleAlerts}
          onRemove={confirmRemove}
        />
      ) : (
        <AlertsSection
          state={alerts}
          onMarkAllRead={markAllRead}
          onToggleRead={(id, read) =>
            alerts
              .markRead(id, !read)
              .catch(() => toast.show('Could not update the alert. Try again.', 'error'))
          }
        />
      )}
    </Screen>
  );
}

function SectionTab({
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
      style={[styles.tab, selected && styles.tabSelected]}
    >
      <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{label}</Text>
    </Pressable>
  );
}

function SavedSection({
  loading,
  error,
  onRetry,
  cooks,
  isAlertOn,
  onOpen,
  onToggleAlerts,
  onRemove,
}: {
  loading: boolean;
  error: string;
  onRetry: () => void;
  cooks: WithId<Cook>[];
  isAlertOn: (cookId: string) => boolean;
  onOpen: (cookId: string) => void;
  onToggleAlerts: (cook: WithId<Cook>) => void;
  onRemove: (cook: WithId<Cook>) => void;
}) {
  if (loading) return <Loading />;
  if (error) {
    return (
      <Message text={error}>
        <Button title="Try again" icon="refresh" onPress={onRetry} />
      </Message>
    );
  }
  if (cooks.length === 0) {
    return (
      <Message text="No saved cooks yet. Tap the heart on a cook to save them here.">
        <Button
          title="Find cooks"
          icon="search"
          onPress={() => router.navigate('/customer/home')}
        />
      </Message>
    );
  }

  return (
    <View style={styles.list}>
      {cooks.map((cook) => (
        <SavedCookRow
          key={cook.id}
          cook={cook}
          alertsOn={isAlertOn(cook.id)}
          onOpen={() => onOpen(cook.id)}
          onToggleAlerts={() => onToggleAlerts(cook)}
          onRemove={() => onRemove(cook)}
        />
      ))}
    </View>
  );
}

function AlertsSection({
  state,
  onMarkAllRead,
  onToggleRead,
}: {
  state: ReturnType<typeof useNotifications>;
  onMarkAllRead: () => void;
  onToggleRead: (id: string, read: boolean) => void;
}) {
  if (state.loading) return <Loading />;
  if (state.error) {
    return (
      <Message text={state.error}>
        <Button title="Try again" icon="refresh" onPress={state.reload} />
      </Message>
    );
  }
  if (state.notifications.length === 0) {
    return <Message text="No alerts yet. We will tell you here when a saved cook has news." />;
  }

  return (
    <View style={styles.list}>
      <Button
        title="Mark all read"
        icon="checkmark-done"
        variant="secondary"
        disabled={state.unreadCount === 0}
        onPress={onMarkAllRead}
      />
      {state.notifications.map((alert) => (
        <AlertRow key={alert.id} alert={alert} onPress={() => onToggleRead(alert.id, alert.read)} />
      ))}
    </View>
  );
}

function Loading() {
  return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.message}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: {
    flex: 1,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabSelected: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: fontSize.body, fontWeight: '600', color: colors.textMuted },
  tabLabelSelected: { color: colors.primaryDark },
  list: { gap: spacing.md },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
});
