import { useCallback, useMemo } from 'react';
import { useInternetIdentity } from './useInternetIdentity';

const OTP_SESSION_KEY = 'doraa-otp-session';
const FLASH_MESSAGE_KEY = 'doraa-flash-message';
const RETURN_PATH_KEY = 'doraa-return-path';
const OTP_LOCKOUT_KEY = 'doraa-otp-lockout';
const OTP_ATTEMPTS_KEY = 'doraa-otp-attempts';

export interface OTPSession {
  phoneNumber: string; // E.164 format with leading '+' and country code
  timestamp: number;
}

export interface FlashMessage {
  message: string;
  type: 'success' | 'error' | 'info';
}

export function useStorefrontAuth() {
  const { identity, isLoginSuccess } = useInternetIdentity();

  // Check if user is authenticated via OTP or Internet Identity
  const isAuthenticated = useMemo(() => {
    // Check OTP session
    const otpSession = localStorage.getItem(OTP_SESSION_KEY);
    if (otpSession) {
      try {
        const session: OTPSession = JSON.parse(otpSession);
        // Session valid for 24 hours
        const isValid = Date.now() - session.timestamp < 24 * 60 * 60 * 1000;
        if (isValid) return true;
      } catch {
        // Invalid session
      }
    }

    // Check Internet Identity
    if (isLoginSuccess && identity && !identity.getPrincipal().isAnonymous()) {
      return true;
    }

    return false;
  }, [identity, isLoginSuccess]);

  // Create OTP session with E.164 international phone number
  const createOTPSession = useCallback((phoneNumber: string) => {
    const session: OTPSession = {
      phoneNumber, // Expected to be E.164 format (e.g., "+919876543210")
      timestamp: Date.now(),
    };
    localStorage.setItem(OTP_SESSION_KEY, JSON.stringify(session));
  }, []);

  // Clear OTP session
  const clearOTPSession = useCallback(() => {
    localStorage.removeItem(OTP_SESSION_KEY);
  }, []);

  // Clear return path
  const clearReturnPath = useCallback(() => {
    localStorage.removeItem(RETURN_PATH_KEY);
  }, []);

  // Logout (clear both OTP and Internet Identity)
  const logout = useCallback(async (clearInternetIdentity: () => void) => {
    clearOTPSession();
    clearReturnPath();
    localStorage.removeItem(FLASH_MESSAGE_KEY);
    await clearInternetIdentity();
  }, [clearOTPSession, clearReturnPath]);

  // Flash message helpers with deduplication
  const setFlashMessage = useCallback((message: string, type: FlashMessage['type'] = 'info') => {
    const existing = localStorage.getItem(FLASH_MESSAGE_KEY);
    if (existing) {
      try {
        const existingFlash: FlashMessage = JSON.parse(existing);
        // Don't set if same message already exists
        if (existingFlash.message === message && existingFlash.type === type) {
          return;
        }
      } catch {
        // Continue to set new message
      }
    }
    const flash: FlashMessage = { message, type };
    localStorage.setItem(FLASH_MESSAGE_KEY, JSON.stringify(flash));
  }, []);

  const getFlashMessage = useCallback((): FlashMessage | null => {
    const flash = localStorage.getItem(FLASH_MESSAGE_KEY);
    if (flash) {
      try {
        return JSON.parse(flash);
      } catch {
        return null;
      }
    }
    return null;
  }, []);

  const clearFlashMessage = useCallback(() => {
    localStorage.removeItem(FLASH_MESSAGE_KEY);
  }, []);

  // Return path helpers
  const setReturnPath = useCallback((path: string) => {
    localStorage.setItem(RETURN_PATH_KEY, path);
  }, []);

  const getReturnPath = useCallback((): string | null => {
    return localStorage.getItem(RETURN_PATH_KEY);
  }, []);

  // OTP lockout helpers
  const setOTPLockout = useCallback(() => {
    const lockoutUntil = Date.now() + 10 * 60 * 1000; // 10 minutes
    localStorage.setItem(OTP_LOCKOUT_KEY, lockoutUntil.toString());
    localStorage.setItem(OTP_ATTEMPTS_KEY, '0');
  }, []);

  const getOTPLockout = useCallback((): number | null => {
    const lockout = localStorage.getItem(OTP_LOCKOUT_KEY);
    if (lockout) {
      const lockoutUntil = parseInt(lockout, 10);
      if (Date.now() < lockoutUntil) {
        return lockoutUntil;
      }
      // Lockout expired
      localStorage.removeItem(OTP_LOCKOUT_KEY);
    }
    return null;
  }, []);

  const incrementOTPAttempts = useCallback((): number => {
    const attempts = localStorage.getItem(OTP_ATTEMPTS_KEY);
    const newAttempts = attempts ? parseInt(attempts, 10) + 1 : 1;
    localStorage.setItem(OTP_ATTEMPTS_KEY, newAttempts.toString());
    return newAttempts;
  }, []);

  const resetOTPAttempts = useCallback(() => {
    localStorage.removeItem(OTP_ATTEMPTS_KEY);
    localStorage.removeItem(OTP_LOCKOUT_KEY);
  }, []);

  return {
    isAuthenticated,
    createOTPSession,
    clearOTPSession,
    logout,
    setFlashMessage,
    getFlashMessage,
    clearFlashMessage,
    setReturnPath,
    getReturnPath,
    clearReturnPath,
    setOTPLockout,
    getOTPLockout,
    incrementOTPAttempts,
    resetOTPAttempts,
  };
}
