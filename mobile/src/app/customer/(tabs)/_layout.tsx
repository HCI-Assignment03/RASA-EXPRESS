import { Tabs } from 'expo-router';

import { tabIcon, useTabScreenOptions } from '@/components/tab-options';
import { useNotifications } from '@/hooks/use-notifications';

export default function CustomerTabsLayout() {
  const screenOptions = useTabScreenOptions();
  const { unreadCount } = useNotifications();

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="favourites"
        options={{
          title: 'Favourites',
          tabBarIcon: tabIcon('heart', 'heart-outline'),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: tabIcon('receipt', 'receipt-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
