import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useOtpCountdown } from '@/hooks/useOtpCountdown';
import { useActor } from '@/hooks/useActor';
import { setAdminSessionFlag } from '@/utils/adminSessionFlag';
import { checkCanisterAvailability } from '@/utils/canisterAvailability';
import { normalizeIcError } from '@/utils/icErrorNormalization';
import InternationalPhoneInput from '@/components/auth/InternationalPhoneInput';
import { type CountryData } from '@/utils/phoneCountries';
import { detectCountryFromLocale } from '@/utils/detectCountryFromLocale';
import { validatePhoneNumber, type PhoneValidationResult } from '@/utils/phoneValidation';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

type Step = 'identifier' | 'otp';
type LoginMethod = 'mobile' | 'email';

interface AdminLoginHiddenPageProps {
  navigate: (path: string) => void;
}

export default function AdminLoginHiddenPage({ navigate }: AdminLoginHiddenPageProps) {
  const [step, setStep] = useState<Step>('identifier');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('mobile');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(() => {
    return detectCountryFromLocale();
  });
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidationResult | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [sendError, setSendError] = useState('');
  const [verifyError, setVerifyError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [displayedOtp, setDisplayedOtp] = useState<string | null>(null);
  const [resendExpiry, setResendExpiry] = useState<number | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const { actor } = useActor();
  const { remainingSeconds, isExpired } = useOtpCountdown(resendExpiry);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleSendMobileOtp = async () => {
    if (!actor) {
      setSendError('Backend not available');
      return;
    }

    // Validate phone number before sending
    const validation = validatePhoneNumber(phoneNumber, selectedCountry);
    if (!validation.isValid) {
      setSendError(validation.errorMessage || 'Invalid phone number');
      return;
    }

    const e164Phone = validation.e164!;

    setIsSendingOtp(true);
    setSendError('');
    setVerifyError('');
    setSuccessMessage('');
    setDisplayedOtp(null);

    try {
      // Preflight check: verify canister is available
      await checkCanisterAvailability(actor);
      
      // Canister is available, proceed with OTP request
      const response = await actor.requestAdminOtp(e164Phone);
      
      // Extract OTP from response (format: "OTP sent (test mode): 123456")
      const otpMatch = response.match(/:\s*(\d{6})/);
      const extractedOtp = otpMatch ? otpMatch[1] : null;
      
      setDisplayedOtp(extractedOtp);
      setSuccessMessage('OTP sent successfully');
      setLoginMethod('mobile');
      setStep('otp');
      setResendExpiry(Date.now() + 60000); // 60 seconds from now
    } catch (error: any) {
      const normalized = normalizeIcError(error);
      setSendError(normalized.message);
      setDisplayedOtp(null);
      // Stay on identifier step on error
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSendEmailOtp = async () => {
    if (!actor) {
      setSendError('Backend not available');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setSendError('Please enter a valid email address');
      return;
    }

    setIsSendingOtp(true);
    setSendError('');
    setVerifyError('');
    setSuccessMessage('');
    setDisplayedOtp(null);

    try {
      // Preflight check: verify canister is available
      await checkCanisterAvailability(actor);
      
      // Canister is available, proceed with OTP request
      await actor.requestAdminOtp(email);
      
      // For email method: do NOT display the OTP code, show test mode message instead
      setDisplayedOtp(null);
      setSuccessMessage('Test mode: OTP sent to email – use 123456 for verify');
      setLoginMethod('email');
      setStep('otp');
      setResendExpiry(Date.now() + 60000); // 60 seconds from now
    } catch (error: any) {
      const normalized = normalizeIcError(error);
      setSendError(normalized.message);
      setDisplayedOtp(null);
      // Stay on identifier step on error
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!actor) {
      setVerifyError('Backend not available');
      return;
    }

    let identifier: string;

    if (loginMethod === 'mobile') {
      const validation = validatePhoneNumber(phoneNumber, selectedCountry);
      if (!validation.isValid || !validation.e164) {
        setVerifyError('Invalid phone number');
        return;
      }
      identifier = validation.e164;
    } else {
      // Email method
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        setVerifyError('Invalid email address');
        return;
      }
      identifier = email;
    }

    setIsVerifyingOtp(true);
    setVerifyError('');
    setSendError('');
    setSuccessMessage('');

    try {
      // Get client context
      const clientIp = 'browser'; // Browser cannot reliably get real IP
      const userAgent = navigator.userAgent;

      const response = await actor.verifyAdminOtp(identifier, otpCode, clientIp, userAgent);
      
      // Success - store session flag and redirect
      setAdminSessionFlag(response);
      setSuccessMessage('Login successful! Redirecting...');
      setDisplayedOtp(null);
      
      // Redirect to /admin-dashboard after short delay
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1000);
    } catch (error: any) {
      const normalized = normalizeIcError(error);
      setVerifyError(normalized.message);
      // Do not store session flag on error
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!isExpired || !actor) return;
    
    let identifier: string;

    if (loginMethod === 'mobile') {
      const validation = validatePhoneNumber(phoneNumber, selectedCountry);
      if (!validation.isValid || !validation.e164) {
        setSendError('Invalid phone number');
        return;
      }
      identifier = validation.e164;
    } else {
      // Email method
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim() || !emailRegex.test(email)) {
        setSendError('Invalid email address');
        return;
      }
      identifier = email;
    }

    setIsSendingOtp(true);
    setSendError('');
    setVerifyError('');
    setSuccessMessage('');
    setDisplayedOtp(null);

    try {
      // Preflight check: verify canister is available
      await checkCanisterAvailability(actor);
      
      // Canister is available, proceed with OTP resend
      await actor.requestAdminOtp(identifier);
      
      // For mobile: extract and display OTP; for email: show test mode message
      if (loginMethod === 'mobile') {
        const response = await actor.requestAdminOtp(identifier);
        const otpMatch = response.match(/:\s*(\d{6})/);
        const extractedOtp = otpMatch ? otpMatch[1] : null;
        setDisplayedOtp(extractedOtp);
        setSuccessMessage('OTP resent successfully');
      } else {
        setDisplayedOtp(null);
        setSuccessMessage('Test mode: OTP sent to email – use 123456 for verify');
      }
      
      setResendExpiry(Date.now() + 60000); // Reset to 60 seconds
      setOtpCode(''); // Clear OTP input
    } catch (error: any) {
      const normalized = normalizeIcError(error);
      setSendError(normalized.message);
      setDisplayedOtp(null);
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value);
    // Clear errors when user edits phone
    if (sendError) {
      setSendError('');
    }
    if (verifyError) {
      setVerifyError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
    setDisplayedOtp(null);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Clear errors when user edits email
    if (sendError) {
      setSendError('');
    }
    if (verifyError) {
      setVerifyError('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
    setDisplayedOtp(null);
  };

  const handleBackToIdentifier = () => {
    setStep('identifier');
    setOtpCode('');
    setResendExpiry(null);
    setSendError('');
    setVerifyError('');
    setSuccessMessage('');
    setDisplayedOtp(null);
  };

  // Determine button states
  const isSendMobileDisabled = step === 'otp' || isSendingOtp || isVerifyingOtp || !phoneNumber.trim();
  const isSendEmailDisabled = step === 'otp' || isSendingOtp || isVerifyingOtp || !email.trim();
  const isVerifyDisabled = step === 'identifier' || isVerifyingOtp || isSendingOtp || otpCode.length !== 6;

  const fadeInClass = prefersReducedMotion ? '' : 'admin-otp-button-fade-in';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-pearl-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pearl-off-white text-center">
            Admin Login
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Message */}
          {successMessage && (
            <div className="text-center font-medium py-2 px-4 rounded-lg border text-gold-accent bg-gold-accent/10 border-gold-accent/20">
              {successMessage}
            </div>
          )}

          {/* OTP Display (Test Mode - Mobile Only) */}
          {displayedOtp && loginMethod === 'mobile' && (
            <div className="text-center p-4 rounded-lg bg-gold-accent/10 border border-gold-accent/30">
              <div className="text-sm text-pearl-off-white/70 mb-1">Test OTP: {displayedOtp}</div>
            </div>
          )}

          {/* Mobile Number Entry */}
          <div className="space-y-2">
            <InternationalPhoneInput
              id="admin-phone"
              label="Mobile Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              onValidationChange={setPhoneValidation}
              disabled={isSendingOtp || isVerifyingOtp}
              error={phoneValidation && !phoneValidation.isValid ? phoneValidation.errorMessage : undefined}
            />
            {/* Inline error for mobile send operation */}
            {sendError && step === 'identifier' && loginMethod === 'mobile' && (
              <div className="text-sm text-red-400 mt-1">
                {sendError}
              </div>
            )}
          </div>

          {/* Email Entry */}
          <div className="space-y-2">
            <Label htmlFor="admin-email" className="text-pearl-off-white/80">
              Email Address
            </Label>
            <Input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={handleEmailChange}
              disabled={isSendingOtp || isVerifyingOtp}
              className="bg-black/30 border-pearl-blue/30 text-pearl-off-white placeholder:text-pearl-off-white/40 focus:border-pearl-blue/60"
            />
            {/* Inline error for email send operation */}
            {sendError && step === 'identifier' && loginMethod === 'email' && (
              <div className="text-sm text-red-400 mt-1">
                {sendError}
              </div>
            )}
          </div>

          {/* OTP Input (shown only in OTP step) */}
          {step === 'otp' && (
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-pearl-off-white/80 block text-center">
                Enter 6-digit OTP
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={(value) => setOtpCode(value)}
                  disabled={isSendingOtp || isVerifyingOtp}
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
              {/* Inline error for verify operation */}
              {verifyError && (
                <div className="text-sm text-red-400 mt-1 text-center">
                  {verifyError}
                </div>
              )}
            </div>
          )}

          {/* Always-visible action buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSendMobileOtp}
              disabled={isSendMobileDisabled}
              className={`w-full admin-otp-button ${fadeInClass} font-medium transition-all duration-300`}
            >
              {isSendingOtp && loginMethod === 'mobile' ? 'Sending...' : 'Send OTP via Mobile'}
            </Button>

            <Button
              onClick={handleSendEmailOtp}
              disabled={isSendEmailDisabled}
              className={`w-full admin-otp-button ${fadeInClass} font-medium transition-all duration-300`}
            >
              {isSendingOtp && loginMethod === 'email' ? 'Sending...' : 'Send OTP via Email'}
            </Button>

            <Button
              onClick={handleVerifyOtp}
              disabled={isVerifyDisabled}
              className={`w-full admin-otp-button ${fadeInClass} font-medium transition-all duration-300`}
            >
              {isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </Button>
          </div>

          {/* Resend OTP and navigation links (shown only in OTP step) */}
          {step === 'otp' && (
            <div className="text-center space-y-2">
              {isExpired ? (
                <button
                  onClick={handleResendOtp}
                  disabled={isSendingOtp || isVerifyingOtp}
                  className="text-pearl-blue hover:text-pearl-blue/80 font-medium transition-colors underline disabled:opacity-50"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-pearl-off-white/60">
                  Resend OTP in {remainingSeconds}s
                </span>
              )}
              
              <div>
                <button
                  onClick={handleBackToIdentifier}
                  disabled={isSendingOtp || isVerifyingOtp}
                  className="text-pearl-off-white/60 hover:text-pearl-off-white/80 text-sm transition-colors disabled:opacity-50"
                >
                  Change {loginMethod === 'mobile' ? 'mobile number' : 'email address'}
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
