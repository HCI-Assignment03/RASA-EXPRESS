// Turns Firebase Auth error codes into short messages a non-technical user can act on (NFR01, NFR07).

const MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'That email address does not look right.',
  'auth/missing-email': 'Please enter your email address.',
  'auth/missing-password': 'Please enter your password.',
  'auth/email-already-in-use': 'An account with this email already exists. Try signing in.',
  'auth/weak-password': 'Choose a password with at least 6 characters.',
  'auth/invalid-credential': 'The email or password is wrong. Please try again.',
  'auth/wrong-password': 'The email or password is wrong. Please try again.',
  'auth/user-not-found': 'The email or password is wrong. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed': 'No connection. Check your internet and try again.',
  'auth/requires-recent-login': 'Please sign in again before doing this.',
};

export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' && error !== null && 'code' in error
      ? String((error as { code: unknown }).code)
      : '';
  return MESSAGES[code] ?? 'Something went wrong. Please try again.';
}
