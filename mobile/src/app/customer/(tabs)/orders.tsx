import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function OrdersListScreen() {
  return (
    <PlaceholderScreen
      code="C6"
      title="Orders (list, opens live tracking)"
      owner="Fernando"
      requirements="FR04, NFR08"
      crud="Read: my orders with status. Tapping an order opens track/[orderId]"
    />
  );
}
