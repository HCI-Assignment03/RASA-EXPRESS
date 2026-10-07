import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';
import { RequestCard } from '@/features/rider/request-card';
import { useCooks } from '@/hooks/use-cooks';
import { useOpenRequests } from '@/hooks/use-open-requests';
import { RequestTakenError } from '@/services/rider-requests';

// R1 Delivery requests.
// Read: open requests with distance and fee. Update: accept a request (this rider is assigned).
// Delete: dismiss a request from this rider's list (deviation D08: it is hidden, not deleted).
export default function DeliveryRequestsScreen() {
  const toast = useToast();
  const open = useOpenRequests();
  const { cooks } = useCooks();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const accept = async (orderId: string) => {
    setAcceptingId(orderId);
    try {
      await open.accept(orderId);
      toast.show('Request accepted. Head to the cook to pick it up.', 'success');
      router.navigate('/rider/trip');
    } catch (error) {
      toast.show(
        error instanceof RequestTakenError
          ? 'Another rider already took this request.'
          : 'Could not accept the request. Try again.',
        error instanceof RequestTakenError ? 'info' : 'error',
      );
    } finally {
      setAcceptingId(null);
    }
  };

  const dismiss = (orderId: string) => {
    open
      .dismiss(orderId)
      .then(() => toast.show('Request hidden', 'success'))
      .catch(() => toast.show('Could not hide the request. Try again.', 'error'));
  };

  const restore = () => {
    open
      .restoreAll()
      .then(() => toast.show('Hidden requests are back', 'success'))
      .catch(() => toast.show('Could not bring them back. Try again.', 'error'));
  };

  return (
    <Screen scroll>
      <Text style={styles.title}>Delivery requests</Text>
      <Text style={styles.subtitle}>
        {open.loading
          ? 'Looking for requests...'
          : `${open.requests.length} ${open.requests.length === 1 ? 'request' : 'requests'} waiting near you`}
      </Text>

      {open.loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {open.error ? (
        <Message text={open.error}>
          <Button title="Try again" icon="refresh" onPress={open.reload} />
        </Message>
      ) : null}

      {!open.loading && !open.error && open.requests.length === 0 ? (
        <Message text="No delivery requests right now. New ones appear here as soon as a cook marks an order ready." />
      ) : null}

      {open.requests.map((order) => (
        <RequestCard
          key={order.id}
          order={order}
          cook={cooks.find((cook) => cook.id === order.cookId) ?? null}
          accepting={acceptingId === order.id}
          onAccept={() => accept(order.id)}
          onDismiss={() => dismiss(order.id)}
        />
      ))}

      {open.dismissedCount > 0 ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Show ${open.dismissedCount} hidden requests`}
          onPress={restore}
          style={styles.restore}
        >
          <Text style={styles.restoreText}>Show hidden requests ({open.dismissedCount})</Text>
        </Pressable>
      ) : null}
    </Screen>
  );
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
  subtitle: { fontSize: fontSize.body, color: colors.textMuted },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
  restore: {
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreText: { fontSize: fontSize.body, fontWeight: '600', color: colors.primaryDark },
});
