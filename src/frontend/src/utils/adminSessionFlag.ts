/**
 * Cookie-based admin session flag helpers for OTP-admin flow.
 * Stores and validates admin session tokens.
 */

const ADMIN_SESSION_COOKIE = 'admin_session_token';
const COOKIE_MAX_AGE = 4 * 3600; // 4 hours in seconds

export function setAdminSessionFlag(token: string): void {
  const expires = new Date();
  expires.setSeconds(expires.getSeconds() + COOKIE_MAX_AGE);
  
  document.cookie = `${ADMIN_SESSION_COOKIE}=${encodeURIComponent(token)}; path=/; expires=${expires.toUTCString()}; SameSite=Strict`;
}

export function getAdminSessionFlag(): string | null {
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === ADMIN_SESSION_COOKIE) {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}

export function clearAdminSessionFlag(): void {
  document.cookie = `${ADMIN_SESSION_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict`;
}
