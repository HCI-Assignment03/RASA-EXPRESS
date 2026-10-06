import { Tabs } from 'expo-router';

import { tabIcon, tabScreenOptions } from '@/components/tab-options';

export default function RiderTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="requests"
        options={{ title: 'Requests', tabBarIcon: tabIcon('list', 'list-outline') }}
      />
      <Tabs.Screen
        name="trip"
        options={{ title: 'Active trip', tabBarIcon: tabIcon('navigate', 'navigate-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
