import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function OrderDetailScreen() {
  return (
    <PlaceholderScreen
      code="S2"
      title="Order detail"
      owner="Manawadu"
      requirements="FR05, FR07, FR08"
      crud="Read: customer, items, payment · Update: status, mark payment received · Delete: decline with reason"
    />
  );
}
