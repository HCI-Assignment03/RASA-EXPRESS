import { AccountPanel } from '@/components/account-panel';
import { Screen } from '@/components/screen';

export default function CustomerProfileScreen() {
  return (
    <Screen scroll>
      <AccountPanel />
    </Screen>
  );
}
