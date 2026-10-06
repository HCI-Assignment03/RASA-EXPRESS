import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function ActiveTripScreen() {
  return (
    <PlaceholderScreen
      code="R2"
      title="Active trip & navigation"
      owner="Lowe"
      requirements="FR04, FR09"
      crud="Read: address, landmark, map · Create: cash collected · Update: picked up, delivered, rider location"
    />
  );
}
