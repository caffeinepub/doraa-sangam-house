import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useOtpCountdown } from '@/hooks/useOtpCountdown';
import { useActor } from '@/hooks/useActor';
import { setAdminSessionFlag } from '@/utils/adminSessionFlag';

type Step = 'phone' | 'otp';

interface AdminLoginHiddenPageProps {
  navigate: (path: string) => void;
}

export default function AdminLoginHiddenPage({ navigate }: AdminLoginHiddenPageProps) {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [resendExpiry, setResendExpiry] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { actor } = useActor();
  const { remainingSeconds, isExpired } = useOtpCountdown(resendExpiry);

  const handleSendOtp = async () => {
    if (!actor) {
      setStatusMessage('Backend not available');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const response = await actor.requestAdminOtp(phoneNumber);
      setStatusMessage(response);
      setIsError(false);
      setStep('otp');
      setResendExpiry(Date.now() + 60000); // 60 seconds from now
      
      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to send OTP';
      setStatusMessage(errorMessage);
      setIsError(true);
      // Stay on phone step on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!actor) {
      setStatusMessage('Backend not available');
      setIsError(true);
      return;
    }

    setIsLoading(true);
    setStatusMessage('');
    setIsError(false);

    try {
      // Get client context
      const clientIp = 'browser'; // Browser cannot reliably get real IP
      const userAgent = navigator.userAgent;

      const response = await actor.verifyAdminOtp(phoneNumber, otpCode, clientIp, userAgent);
      
      // Success - store session flag and redirect
      setAdminSessionFlag(response);
      setStatusMessage('Login successful! Redirecting...');
      setIsError(false);
      
      // Redirect to /admin after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to verify OTP';
      setStatusMessage(errorMessage);
      setIsError(true);
      // Do not store session flag on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isExpired || !actor) return;
    
    setIsLoading(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const response = await actor.requestAdminOtp(phoneNumber);
      setStatusMessage('OTP resent!');
      setIsError(false);
      setResendExpiry(Date.now() + 60000); // Reset to 60 seconds
      setOtpCode(''); // Clear OTP input
      
      // Clear status message after 3 seconds
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to resend OTP';
      setStatusMessage(errorMessage);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-pearl-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pearl-off-white text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status Message */}
          {statusMessage && (
            <div
              className={`text-center font-medium py-2 px-4 rounded-lg border ${
                isError
                  ? 'text-red-400 bg-red-400/10 border-red-400/20'
                  : 'text-gold-accent bg-gold-accent/10 border-gold-accent/20'
              }`}
            >
              {statusMessage}
            </div>
          )}

          {/* Phone Entry Step */}
          {step === 'phone' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-pearl-off-white/80">
                  Mobile Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91xxxxxxxxxx"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-black/30 border-pearl-blue/30 text-pearl-off-white placeholder:text-pearl-off-white/40 focus:border-pearl-blue/60"
                  disabled={isLoading}
                />
              </div>
              
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || !phoneNumber.trim()}
                className="w-full bg-pearl-blue hover:bg-pearl-blue/80 text-black font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </>
          )}

          {/* OTP Verification Step */}
          {step === 'otp' && (
            <>
              <div className="space-y-4">
                <Label htmlFor="otp" className="text-pearl-off-white/80 block text-center">
                  Enter 6-digit OTP
                </Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otpCode}
                    onChange={(value) => setOtpCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                      <InputOTPSlot index={1} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                      <InputOTPSlot index={2} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                      <InputOTPSlot index={3} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                      <InputOTPSlot index={4} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                      <InputOTPSlot index={5} className="bg-black/30 border-pearl-blue/30 text-pearl-off-white" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                onClick={handleVerifyOtp}
                disabled={isLoading || otpCode.length !== 6}
                className="w-full bg-pearl-blue hover:bg-pearl-blue/80 text-black font-medium transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </Button>

              {/* Resend OTP Link */}
              <div className="text-center">
                {isExpired ? (
                  <button
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-pearl-blue hover:text-pearl-blue/80 font-medium transition-colors underline disabled:opacity-50"
                  >
                    Resend OTP
                  </button>
                ) : (
                  <span className="text-pearl-off-white/60">
                    Resend OTP in {remainingSeconds}s
                  </span>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
