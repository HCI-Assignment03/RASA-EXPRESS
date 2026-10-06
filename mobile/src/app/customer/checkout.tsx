import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function CheckoutScreen() {
  return (
    <PlaceholderScreen
      code="C5"
      title="Checkout & payment"
      owner="Fernando"
      requirements="FR03, FR05, NFR03"
      crud="Create: place order · Read: cart summary · Update: schedule, landmark, payment method · Delete: remove item"
    />
  );
}
