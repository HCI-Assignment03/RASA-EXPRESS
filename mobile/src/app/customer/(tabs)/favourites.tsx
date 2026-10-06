import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function FavouritesScreen() {
  return (
    <PlaceholderScreen
      code="C8"
      title="Favourites & alerts"
      owner="Lowe"
      requirements="FR06, NFR08"
      crud="Read: saved cooks, alerts · Create: alert preference · Update: mark alert read · Delete: remove saved cook"
    />
  );
}
