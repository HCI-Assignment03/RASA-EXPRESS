import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function TrackOrderScreen() {
  return (
    <PlaceholderScreen
      code="C6"
      title="Live order tracking"
      owner="Fernando"
      requirements="FR04, NFR08"
      crud="Read: live status, ETA, rider · Create: chat message · Update: cancel order while placed"
    />
  );
}
