import { PlaceholderScreen } from '@/components/placeholder-screen';

export default function SignInScreen() {
  return (
    <PlaceholderScreen
      code="C1"
      title="Welcome & sign-in"
      owner="Kulathunga"
      requirements="NFR01, NFR02, NFR07"
      crud="Create: register account · Read: sign in · Update: name, phone, language · Delete: delete account"
    />
  );
}
