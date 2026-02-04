import { useEffect, useState, useRef } from 'react';

export type WebOtpStatus = 'idle' | 'requesting' | 'success' | 'unsupported' | 'denied' | 'timeout' | 'error';

export interface WebOtpResult {
  code: string | null;
  status: WebOtpStatus;
  cancel: () => void;
}

/**
 * Hook to request OTP via WebOTP API (Android Chrome)
 * Automatically requests OTP when enabled, returns code on success
 */
export function useWebOtp(enabled: boolean): WebOtpResult {
  const [code, setCode] = useState<string | null>(null);
  const [status, setStatus] = useState<WebOtpStatus>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setStatus('idle');
      setCode(null);
      return;
    }

    // Check if WebOTP is supported
    if (!('OTPCredential' in window)) {
      setStatus('unsupported');
      return;
    }

    const requestOtp = async () => {
      try {
        setStatus('requesting');
        
        // Create abort controller for cleanup
        const ac = new AbortController();
        abortControllerRef.current = ac;

        // Request OTP with 60 second timeout
        const otpCredential = await navigator.credentials.get({
          // @ts-ignore - OTPCredential is not in TypeScript types yet
          otp: { transport: ['sms'] },
          signal: ac.signal,
        }) as any;

        if (otpCredential && otpCredential.code) {
          setCode(otpCredential.code);
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // User cancelled or we cancelled
          setStatus('idle');
        } else if (err.name === 'NotAllowedError') {
          setStatus('denied');
        } else if (err.name === 'TimeoutError') {
          setStatus('timeout');
        } else {
          console.error('WebOTP error:', err);
          setStatus('error');
        }
      }
    };

    requestOtp();

    // Cleanup on unmount or when enabled changes
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [enabled]);

  const cancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setStatus('idle');
    setCode(null);
  };

  return { code, status, cancel };
}
