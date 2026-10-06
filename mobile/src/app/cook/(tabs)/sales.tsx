import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function SalesScreen() {
  return (
    <PlaceholderScreen
      code="S4"
      title="Sales & payments"
      owner="Manawadu"
      requirements="FR05, FR10"
      crud="Create: manual cash sale · Read: today total, 7-day chart · Update: mark payment received · Delete: mistaken entry"
    />
  );
}
