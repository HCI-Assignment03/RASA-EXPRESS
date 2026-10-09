import { router } from 'expo-router';

import { AccountPanel } from '@/components/account-panel';
import { Screen } from '@/components/screen';
import { LinkList } from '@/features/account/link-list';
import { StatTiles } from '@/features/account/stat-tiles';
import { useOpenRequests } from '@/hooks/use-open-requests';
import { useRiderStats } from '@/hooks/use-rider-stats';
import { useTrips } from '@/hooks/use-trips';

// Rider Profile tab: the account (C1) plus today's deliveries and earnings and shortcuts.
export default function RiderProfileScreen() {
  const stats = useRiderStats();
  const { requests } = useOpenRequests();
  const { trip, waiting } = useTrips();

  return (
    <Screen scroll>
      <AccountPanel>
        <StatTiles
          items={[
            {
              icon: 'checkmark-done-outline',
              value: String(stats.todayCount),
              label: 'Delivered today',
              tone: 'primary',
            },
            {
              icon: 'wallet-outline',
              value: stats.todayEarned.toLocaleString('en-US'),
              label: 'Earned today (Rs.)',
              tone: 'success',
            },
            {
              icon: 'trophy-outline',
              value: String(stats.totalCount),
              label: 'All deliveries',
              tone: 'warning',
            },
          ]}
        />

        <LinkList
          title="Deliveries"
          items={[
            {
              icon: 'list-outline',
              label: 'Delivery requests',
              detail:
                requests.length > 0
                  ? `${requests.length} waiting for a rider`
                  : 'No open requests right now',
              count: requests.length,
              onPress: () => router.navigate('/rider/requests'),
            },
            {
              icon: 'navigate-outline',
              label: 'Active trip',
              detail: trip
                ? `To ${trip.address}${waiting > 0 ? ` · ${waiting} more after it` : ''}`
                : 'No active trip',
              tone: 'success',
              onPress: () => router.navigate('/rider/trip'),
            },
          ]}
        />
      </AccountPanel>
    </Screen>
  );
}
