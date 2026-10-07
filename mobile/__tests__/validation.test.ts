import {
  normalizeMobile,
  validateEmail,
  validateMobile,
  validateName,
  validatePassword,
} from '../src/utils/validation';

describe('normalizeMobile', () => {
  it.each(['77 123 4567', '077 123 4567', '0771234567', '+94 77 123 4567', '94771234567'])(
    'accepts %s',
    (input) => {
      expect(normalizeMobile(input)).toBe('0771234567');
    },
  );

  it.each(['', '123', '0112345678', '77 123 456', '77 123 45678', 'abc'])(
    'rejects "%s"',
    (input) => {
      expect(normalizeMobile(input)).toBeNull();
    },
  );
});

describe('field validators', () => {
  it('requires a real-looking email', () => {
    expect(validateEmail('kawya@example.com')).toBeUndefined();
    expect(validateEmail('  kawya@example.com  ')).toBeUndefined();
    expect(validateEmail('kawya@')).toBeDefined();
    expect(validateEmail('kawya example.com')).toBeDefined();
  });

  it('requires a password of at least 6 characters', () => {
    expect(validatePassword('secret')).toBeUndefined();
    expect(validatePassword('12345')).toBeDefined();
  });

  it('requires a name', () => {
    expect(validateName('Ka')).toBeUndefined();
    expect(validateName(' K ')).toBeDefined();
  });

  it('gives a message for a bad mobile number', () => {
    expect(validateMobile('77 123 4567')).toBeUndefined();
    expect(validateMobile('1234')).toMatch(/mobile number/i);
  });
});
