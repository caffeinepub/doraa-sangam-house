import { useState, useEffect, useMemo } from 'react';

export interface OtpCountdownResult {
  remainingSeconds: number;
  formattedTime: string;
  isExpired: boolean;
}

/**
 * Hook to manage OTP countdown timer (2 minutes)
 * @param expiryTimestamp - Unix timestamp when OTP expires
 */
export function useOtpCountdown(expiryTimestamp: number | null): OtpCountdownResult {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!expiryTimestamp) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [expiryTimestamp]);

  const result = useMemo(() => {
    if (!expiryTimestamp) {
      return {
        remainingSeconds: 120,
        formattedTime: '2:00',
        isExpired: false,
      };
    }

    const remaining = Math.max(0, Math.ceil((expiryTimestamp - now) / 1000));
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    const isExpired = remaining === 0;

    return {
      remainingSeconds: remaining,
      formattedTime,
      isExpired,
    };
  }, [expiryTimestamp, now]);

  return result;
}
