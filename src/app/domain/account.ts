export interface Account {
  readonly email: string;
  readonly password: string;
}

export const MIN_PASSWORD_LENGTH = 8;
export const SIGN_IN_ATTEMPT_LIMIT = 3;
export const ACCOUNT_LOCK_MINUTES = 10;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(text: string): boolean {
  return EMAIL_PATTERN.test(text.trim());
}

export function isSameEmail(first: string, second: string): boolean {
  return first.trim().toLowerCase() === second.trim().toLowerCase();
}
