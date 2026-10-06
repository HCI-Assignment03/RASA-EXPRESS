import { Redirect } from 'expo-router';

import { useAuth } from '@/context/AuthContext';
import { ROLE_HOME } from '@/utils/routes';

// "/" only decides where to send the user: sign-in, or the home tab of their role.
export default function Index() {
  const { status, profile } = useAuth();

  if (status === 'loading') return null;
  if (status === 'ready' && profile) return <Redirect href={ROLE_HOME[profile.role]} />;
  return <Redirect href="/sign-in" />;
}
