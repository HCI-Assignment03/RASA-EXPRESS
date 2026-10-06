import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function DiscoverCooksScreen() {
  return (
    <PlaceholderScreen
      code="C2"
      title="Discover cooks"
      owner="Kulathunga"
      requirements="FR01, FR06"
      crud="Read: list, search, filter cooks · Create/Delete: favourite (heart)"
    />
  );
}
