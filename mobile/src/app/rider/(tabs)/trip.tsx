import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { ChatBox } from '@/features/customer/chat-box';
import { TripMap } from '@/features/rider/trip-map';
import { useCook } from '@/hooks/use-cooks';
import { useRiderLocation } from '@/hooks/use-rider-location';
import { useTrips } from '@/hooks/use-trips';
import { useUserProfile } from '@/hooks/use-user-profile';
import { updateRiderLocation } from '@/services/trips';
import type { Order, WithId } from '@/types';
import { formatDistance, riderFee } from '@/utils/delivery';
import { formatMobile, formatPrice } from '@/utils/format';
import { distanceBetween, tripStops } from '@/utils/geo';
import { tripStep, type TripStep } from '@/utils/trip';

// R2 Active trip & navigation.
// Read: address, landmark and map. Create: record the cash collected, reply in the chat.
// Update: mark picked up and delivered, and keep the rider's location up to date for the customer.
export default function ActiveTripScreen() {
  const trips = useTrips();

  if (trips.loading) {
    return (
      <Screen>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Screen>
    );
  }

  if (trips.error) {
    return (
      <Screen>
        <Message text={trips.error}>
          <Button title="Try again" icon="refresh" onPress={trips.reload} />
        </Message>
      </Screen>
    );
  }

  if (!trips.trip) {
    return (
      <Screen>
        <Text style={styles.title}>Active trip</Text>
        <Message text="No active trip. Accept a delivery request to start one.">
          <Button
            title="See requests"
            icon="list"
            onPress={() => router.navigate('/rider/requests')}
          />
        </Message>
      </Screen>
    );
  }

  return (
    <Screen scroll>
      <TripView
        key={trips.trip.id}
        trip={trips.trip}
        waiting={trips.waiting}
        onPickedUp={trips.pickedUp}
        onCash={trips.collectCash}
        onDelivered={trips.delivered}
      />
    </Screen>
  );
}

type TripViewProps = {
  trip: WithId<Order>;
  waiting: number;
  onPickedUp: () => Promise<void>;
  onCash: () => Promise<void>;
  onDelivered: () => Promise<void>;
};

function TripView({ trip, waiting, onPickedUp, onCash, onDelivered }: TripViewProps) {
  const toast = useToast();
  const { cook } = useCook(trip.cookId);
  const { location, permission } = useRiderLocation(true);
  const [busy, setBusy] = useState(false);

  const stops = tripStops(trip);
  const step = tripStep(trip);
  const heading = step === 'pick_up' ? stops.pickup : stops.dropoff;
  const fee = riderFee(cook?.distanceKm ?? 0);

  // Share the rider's position with the customer (C6 reads riderLocation from the order).
  useEffect(() => {
    if (location) updateRiderLocation(trip.id, location).catch(() => undefined);
  }, [location, trip.id]);

  const run = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await action();
      toast.show(success, 'success');
    } catch {
      toast.show('Something went wrong. Check your connection and try again.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const confirmDelivered = () => {
    Alert.alert('Mark as delivered?', 'Only confirm once the customer has the food.', [
      { text: 'Not yet', style: 'cancel' },
      {
        text: 'Delivered',
        onPress: () => run(onDelivered, `Delivered. You earned ${formatPrice(fee)}. Nice work!`),
      },
    ]);
  };

  const navigate = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${heading.lat},${heading.lng}`;
    Linking.openURL(url).catch(() => toast.show('Could not open the maps app.', 'error'));
  };

  return (
    <>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Active trip</Text>
        <Badge label={STEP_BADGE[step]} tone="primary" />
      </View>

      <TripMap pickup={stops.pickup} dropoff={stops.dropoff} rider={location} />

      <LocationNote permission={permission} />

      <Card style={styles.card}>
        <Stop
          icon="storefront-outline"
          label="Pick up"
          title={cook?.displayName ?? 'Cook'}
          detail={cook?.area || undefined}
        />
        <Stop
          icon="location-outline"
          label="Deliver to"
          title={trip.address}
          detail={trip.landmark || undefined}
        />
        {location ? (
          <Text style={styles.muted}>
            About {formatDistance(distanceBetween(location, heading))} to{' '}
            {step === 'pick_up' ? 'the cook' : 'the customer'}
          </Text>
        ) : null}
        <Button title="Navigate" icon="navigate" variant="secondary" onPress={navigate} />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Order</Text>
        {trip.items.map((item) => (
          <View key={item.dishId} style={styles.itemRow}>
            <Text style={styles.body}>
              {item.qty} × {item.name}
            </Text>
            {item.note ? <Text style={styles.muted}>Note: {item.note}</Text> : null}
          </View>
        ))}
        <View style={styles.payRow}>
          {trip.paymentMethod === 'cash' ? (
            <Badge
              label={
                trip.paymentStatus === 'received'
                  ? `${formatPrice(trip.total)} cash collected`
                  : `Collect ${formatPrice(trip.total)} cash`
              }
              tone={trip.paymentStatus === 'received' ? 'success' : 'warning'}
              icon="cash-outline"
            />
          ) : (
            <Badge label="Paid online" tone="success" icon="card-outline" />
          )}
          <Text style={styles.fee}>You earn {formatPrice(fee)}</Text>
        </View>
      </Card>

      <CustomerCard customerId={trip.customerId} orderId={trip.id} />

      {waiting > 0 ? (
        <Text style={styles.muted}>
          {waiting} more {waiting === 1 ? 'trip is' : 'trips are'} waiting after this one.
        </Text>
      ) : null}

      <StepButton
        step={step}
        total={trip.total}
        busy={busy}
        onPickedUp={() => run(onPickedUp, 'Marked as picked up. Drive safely!')}
        onCash={() => run(onCash, 'Cash recorded')}
        onDelivered={confirmDelivered}
      />
    </>
  );
}

const STEP_BADGE: Record<TripStep, string> = {
  pick_up: 'Go to the cook',
  collect_cash: 'Collect the cash',
  deliver: 'Deliver the food',
};

function StepButton({
  step,
  total,
  busy,
  onPickedUp,
  onCash,
  onDelivered,
}: {
  step: TripStep;
  total: number;
  busy: boolean;
  onPickedUp: () => void;
  onCash: () => void;
  onDelivered: () => void;
}) {
  if (step === 'pick_up') {
    return (
      <Button
        title="Mark as picked up"
        icon="bag-check-outline"
        loading={busy}
        onPress={onPickedUp}
      />
    );
  }
  if (step === 'collect_cash') {
    return (
      <Button
        title={`Cash collected: ${formatPrice(total)}`}
        icon="cash-outline"
        loading={busy}
        onPress={onCash}
      />
    );
  }
  return (
    <Button
      title="Mark as delivered"
      icon="checkmark-done"
      variant="success"
      loading={busy}
      onPress={onDelivered}
    />
  );
}

/** Who ordered: call them, or read and answer their messages (the chat they write on C6). */
function CustomerCard({ customerId, orderId }: { customerId: string; orderId: string }) {
  const { profile } = useUserProfile(customerId);
  const name = profile?.name ?? 'The customer';

  return (
    <Card style={styles.card}>
      <View style={styles.customerRow}>
        <View style={styles.stopIcon}>
          <Ionicons name="person-outline" size={20} color={colors.primaryDark} />
        </View>
        <View style={styles.stopText}>
          <Text style={styles.stopLabel}>Customer</Text>
          <Text style={styles.stopTitle}>{name}</Text>
        </View>
        {profile ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${name} on ${formatMobile(profile.phone)}`}
            onPress={() => Linking.openURL(`tel:${profile.phone}`)}
            style={styles.call}
          >
            <Ionicons name="call" size={20} color={colors.onPrimary} />
          </Pressable>
        ) : null}
      </View>
      <ChatBox orderId={orderId} otherName={name} otherRole="customer" />
    </Card>
  );
}

function LocationNote({ permission }: { permission: 'asking' | 'granted' | 'denied' }) {
  if (permission === 'granted') {
    return (
      <View style={styles.note}>
        <Ionicons name="radio-button-on" size={16} color={colors.success} />
        <Text style={styles.noteText}>Sharing your live location with the customer</Text>
      </View>
    );
  }
  if (permission === 'denied') {
    return (
      <View style={[styles.note, styles.noteWarn]}>
        <Ionicons name="warning-outline" size={16} color={colors.warning} />
        <Text style={styles.noteText}>
          Location is off, so the customer cannot see you on the map. Allow location for the app in
          your phone settings.
        </Text>
      </View>
    );
  }
  return null;
}

function Stop({
  icon,
  label,
  title,
  detail,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  title: string;
  detail?: string;
}) {
  return (
    <View style={styles.stop}>
      <View style={styles.stopIcon}>
        <Ionicons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.stopText}>
        <Text style={styles.stopLabel}>{label}</Text>
        <Text style={styles.stopTitle}>{title}</Text>
        {detail ? <Text style={styles.muted}>{detail}</Text> : null}
      </View>
    </View>
  );
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.xl },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  card: { gap: spacing.md },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
  },
  noteWarn: { backgroundColor: colors.warningSoft },
  noteText: { flex: 1, fontSize: fontSize.caption, color: colors.text },
  stop: { flexDirection: 'row', gap: spacing.md },
  stopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  stopText: { flex: 1, gap: 2 },
  stopLabel: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  stopTitle: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  call: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
  itemRow: { gap: 2 },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  fee: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.success },
});
