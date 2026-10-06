import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function DeliveryRequestsScreen() {
  return (
    <PlaceholderScreen
      code="R1"
      title="Delivery requests"
      owner="Lowe"
      requirements="FR09"
      crud="Read: open requests (fee, distance) · Update: accept request · Delete: dismiss request"
    />
  );
}
