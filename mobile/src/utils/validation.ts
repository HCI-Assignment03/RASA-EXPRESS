// Form checks shared by the sign-in, register and profile screens.
// Each validate* function returns an error message, or undefined when the value is fine.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(value: string): string | undefined {
  return value.trim().length < 2 ? 'Please enter your name.' : undefined;
}

export function validateEmail(value: string): string | undefined {
  return EMAIL_PATTERN.test(value.trim()) ? undefined : 'Enter a valid email address.';
}

export function validatePassword(value: string): string | undefined {
  return value.length < 6 ? 'Use at least 6 characters.' : undefined;
}

/**
 * Turns "77 123 4567", "077 123 4567" or "+94 77 123 4567" into the stored form "0771234567".
 * Returns null when it is not a Sri Lankan mobile number (nine digits starting with 7).
 */
export function normalizeMobile(input: string): string | null {
  let digits = input.replace(/[\s-]/g, '');
  if (digits.startsWith('+94')) digits = digits.slice(3);
  else if (digits.startsWith('94') && digits.length === 11) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = digits.slice(1);

  return /^7\d{8}$/.test(digits) ? `0${digits}` : null;
}

export function validateMobile(value: string): string | undefined {
  return normalizeMobile(value) ? undefined : 'Enter a mobile number like 77 123 4567.';
}
