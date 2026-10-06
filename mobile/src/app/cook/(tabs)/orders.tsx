import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function OrdersDashboardScreen() {
  return (
    <PlaceholderScreen
      code="S1"
      title="Orders dashboard"
      owner="Manawadu"
      requirements="FR07, FR08"
      crud="Read: orders by status tab · Update: accept, preparing, ready · Delete: decline order"
    />
  );
}
