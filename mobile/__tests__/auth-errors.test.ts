import { authErrorMessage } from '../src/utils/auth-errors';

describe('authErrorMessage', () => {
  it('maps a known Firebase code to a friendly message', () => {
    expect(authErrorMessage({ code: 'auth/email-already-in-use' })).toMatch(/already exists/i);
  });

  it('treats a wrong password and an unknown user the same way', () => {
    expect(authErrorMessage({ code: 'auth/wrong-password' })).toBe(
      authErrorMessage({ code: 'auth/user-not-found' }),
    );
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(authErrorMessage(new Error('boom'))).toMatch(/something went wrong/i);
    expect(authErrorMessage(undefined)).toMatch(/something went wrong/i);
  });
});
