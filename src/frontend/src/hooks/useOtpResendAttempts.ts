import { useState, useEffect, useCallback } from 'react';

interface UseOtpResendAttemptsReturn {
  attemptCount: number;
  isLimitReached: boolean;
  remainingTime: number;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  canResend: boolean;
}

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const STORAGE_KEY_ATTEMPTS = 'doraa-resend-attempts';
const STORAGE_KEY_WINDOW_START = 'doraa-resend-window-start';

export function useOtpResendAttempts(): UseOtpResendAttemptsReturn {
  const [attemptCount, setAttemptCount] = useState(0);
  const [windowStartTime, setWindowStartTime] = useState<number | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  // Load from localStorage on mount
  useEffect(() => {
    const storedAttempts = localStorage.getItem(STORAGE_KEY_ATTEMPTS);
    const storedWindowStart = localStorage.getItem(STORAGE_KEY_WINDOW_START);

    if (storedAttempts && storedWindowStart) {
      const attempts = parseInt(storedAttempts, 10);
      const windowStart = parseInt(storedWindowStart, 10);
      const now = Date.now();

      // Check if window has expired
      if (now - windowStart > LOCKOUT_DURATION_MS) {
        // Reset if window expired
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        localStorage.removeItem(STORAGE_KEY_WINDOW_START);
        setAttemptCount(0);
        setWindowStartTime(null);
      } else {
        setAttemptCount(attempts);
        setWindowStartTime(windowStart);
      }
    }
  }, []);

  // Update remaining time
  useEffect(() => {
    if (!windowStartTime || attemptCount < MAX_ATTEMPTS) {
      setRemainingTime(0);
      return;
    }

    const updateRemainingTime = () => {
      const now = Date.now();
      const elapsed = now - windowStartTime;
      const remaining = Math.max(0, LOCKOUT_DURATION_MS - elapsed);
      setRemainingTime(remaining);

      if (remaining === 0) {
        // Reset when lockout expires
        localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
        localStorage.removeItem(STORAGE_KEY_WINDOW_START);
        setAttemptCount(0);
        setWindowStartTime(null);
      }
    };

    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(interval);
  }, [windowStartTime, attemptCount]);

  const incrementAttempt = useCallback(() => {
    const now = Date.now();
    
    setAttemptCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem(STORAGE_KEY_ATTEMPTS, newCount.toString());
      
      // Set window start time on first attempt
      if (prev === 0) {
        localStorage.setItem(STORAGE_KEY_WINDOW_START, now.toString());
        setWindowStartTime(now);
      }
      
      return newCount;
    });
  }, []);

  const resetAttempts = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(STORAGE_KEY_WINDOW_START);
    setAttemptCount(0);
    setWindowStartTime(null);
    setRemainingTime(0);
  }, []);

  const isLimitReached = attemptCount >= MAX_ATTEMPTS && remainingTime > 0;
  const canResend = !isLimitReached;

  return {
    attemptCount,
    isLimitReached,
    remainingTime,
    incrementAttempt,
    resetAttempts,
    canResend,
  };
}
