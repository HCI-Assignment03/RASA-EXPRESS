import { Tabs } from 'expo-router';

import { tabIcon, tabScreenOptions } from '@/components/tab-options';
import { useOpenRequests } from '@/hooks/use-open-requests';
import { useTrips } from '@/hooks/use-trips';

export default function RiderTabsLayout() {
  // Open requests and unfinished trips show as badges, so the rider sees new work on any tab.
  const { requests } = useOpenRequests();
  const { trip, waiting } = useTrips();
  const trips = trip ? waiting + 1 : 0;

  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Requests',
          tabBarIcon: tabIcon('list', 'list-outline'),
          tabBarBadge: requests.length > 0 ? requests.length : undefined,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Active trip',
          tabBarIcon: tabIcon('navigate', 'navigate-outline'),
          tabBarBadge: trips > 0 ? trips : undefined,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
