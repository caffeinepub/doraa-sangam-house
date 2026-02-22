import { useState, useEffect, useCallback } from 'react';

interface UseOtpResendTimerReturn {
  secondsRemaining: number;
  isActive: boolean;
  formattedTime: string;
  startTimer: () => void;
  resetTimer: () => void;
}

const RESEND_COOLDOWN_SECONDS = 60;

export function useOtpResendTimer(): UseOtpResendTimerReturn {
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || secondsRemaining <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsRemaining]);

  const startTimer = useCallback(() => {
    setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
    setIsActive(true);
  }, []);

  const resetTimer = useCallback(() => {
    setSecondsRemaining(RESEND_COOLDOWN_SECONDS);
    setIsActive(true);
  }, []);

  const formattedTime = secondsRemaining > 0 ? `Resend in ${secondsRemaining}s` : 'Resend OTP';

  return {
    secondsRemaining,
    isActive,
    formattedTime,
    startTimer,
    resetTimer,
  };
}
