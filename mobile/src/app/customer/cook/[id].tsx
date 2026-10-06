import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function CookProfileScreen() {
  return (
    <PlaceholderScreen
      code="C3"
      title="Cook profile & menu"
      owner="Kulathunga"
      requirements="FR01, FR02, FR06"
      crud="Create: add dish to cart · Read: menu, hygiene, reviews · Update: cart quantity · Delete: remove cart item"
    />
  );
}
