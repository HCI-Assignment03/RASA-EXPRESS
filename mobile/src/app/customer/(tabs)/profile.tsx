import { router } from 'expo-router';

import { AccountPanel } from '@/components/account-panel';
import { Screen } from '@/components/screen';
import { LinkList } from '@/features/account/link-list';
import { StatTiles } from '@/features/account/stat-tiles';
import { useCart } from '@/hooks/use-cart';
import { useFavourites } from '@/hooks/use-favourites';
import { useMyOrders } from '@/hooks/use-my-orders';
import { useMyReviews } from '@/hooks/use-my-reviews';
import { useNotifications } from '@/hooks/use-notifications';
import { formatPrice } from '@/utils/format';

// Customer Profile tab: the account (C1) plus the customer's activity and shortcuts.
export default function CustomerProfileScreen() {
  const orders = useMyOrders();
  const { reviews } = useMyReviews();
  const { favouriteIds } = useFavourites();
  const { unreadCount } = useNotifications();
  const cart = useCart();

  const active = orders.active.length;
  const total = active + orders.past.length;

  return (
    <Screen scroll>
      <AccountPanel>
        <StatTiles
          items={[
            { icon: 'receipt-outline', value: String(total), label: 'Orders', tone: 'primary' },
            {
              icon: 'star-outline',
              value: String(reviews.length),
              label: 'Reviews',
              tone: 'warning',
            },
            {
              icon: 'heart-outline',
              value: String(favouriteIds.size),
              label: 'Saved cooks',
              tone: 'danger',
            },
          ]}
        />

        <LinkList
          title="Shortcuts"
          items={[
            {
              icon: 'bicycle-outline',
              label: 'My orders',
              detail: active > 0 ? `${active} in progress` : 'See past orders and rate them',
              count: active,
              onPress: () => router.navigate('/customer/orders'),
            },
            {
              icon: 'notifications-outline',
              label: 'Favourites & alerts',
              detail:
                unreadCount > 0 ? `${unreadCount} unread alerts` : 'Saved cooks and their news',
              count: unreadCount,
              onPress: () => router.navigate('/customer/favourites'),
            },
            {
              icon: 'cart-outline',
              label: 'My cart',
              detail:
                cart.count > 0
                  ? `${cart.count} ${cart.count === 1 ? 'item' : 'items'} · ${formatPrice(cart.total)}`
                  : 'Your cart is empty',
              tone: 'success',
              onPress: () => router.push('/customer/checkout'),
            },
            {
              icon: 'search-outline',
              label: 'Find home cooks',
              detail: 'Browse cooks near you',
              tone: 'warning',
              onPress: () => router.navigate('/customer/home'),
            },
          ]}
        />
      </AccountPanel>
    </Screen>
  );
}
