import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield, Loader2, Clock } from 'lucide-react';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { showLockoutToast } from '../utils/premiumToasts';
import { showBasicErrorToast } from '../utils/errorToasts';
import InternationalPhoneInput from '../components/auth/InternationalPhoneInput';
import { detectCountryFromLocale } from '../utils/detectCountryFromLocale';
import { validatePhoneNumber, type PhoneValidationResult } from '../utils/phoneValidation';
import type { CountryData } from '../utils/phoneCountries';
import { useWebOtp } from '../hooks/useWebOtp';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import WebOtpPermissionModal from '../components/auth/WebOtpPermissionModal';
import OtpLockoutModal from '../components/auth/OtpLockoutModal';
import { getUrlParameter } from '../utils/urlParams';

interface LoginPageProps {
  navigate: (path: string) => void;
}

type AuthStep = 'phone' | 'otp';
type TabValue = 'signin' | 'signup';

export default function LoginPage({ navigate }: LoginPageProps) {
  // Read initial tab from URL query parameter
  const initialTab = (getUrlParameter('tab') as TabValue) || 'signin';
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab);
  
  // Separate state for Sign In and Sign Up flows
  const [signInPhone, setSignInPhone] = useState('');
  const [signInCountry, setSignInCountry] = useState<CountryData>(() => detectCountryFromLocale());
  const [signInValidation, setSignInValidation] = useState<PhoneValidationResult | null>(null);
  const [signInOtp, setSignInOtp] = useState('');
  const [signInStep, setSignInStep] = useState<AuthStep>('phone');
  
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpCountry, setSignUpCountry] = useState<CountryData>(() => detectCountryFromLocale());
  const [signUpValidation, setSignUpValidation] = useState<PhoneValidationResult | null>(null);
  const [signUpOtp, setSignUpOtp] = useState('');
  const [signUpStep, setSignUpStep] = useState<AuthStep>('phone');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpNameError, setSignUpNameError] = useState('');
  const [signUpEmailError, setSignUpEmailError] = useState('');
  
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpExpiryTimestamp, setOtpExpiryTimestamp] = useState<number | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showLockoutModalState, setShowLockoutModalState] = useState(false);
  
  // Simulated backend state
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [challengeId, setChallengeId] = useState('');
  
  const { 
    createOTPSession, 
    getFlashMessage, 
    clearFlashMessage,
    getOTPLockout,
    incrementOTPAttempts,
    resetOTPAttempts,
    setOTPLockout,
    getReturnPath,
    clearReturnPath,
  } = useStorefrontAuth();
  
  const { login: loginII, isLoggingIn, identity } = useInternetIdentity();
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: string } | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  // Get current flow state based on active tab
  const phoneNumber = activeTab === 'signin' ? signInPhone : signUpPhone;
  const setPhoneNumber = activeTab === 'signin' ? setSignInPhone : setSignUpPhone;
  const selectedCountry = activeTab === 'signin' ? signInCountry : signUpCountry;
  const setSelectedCountry = activeTab === 'signin' ? setSignInCountry : setSignUpCountry;
  const phoneValidation = activeTab === 'signin' ? signInValidation : signUpValidation;
  const setPhoneValidation = activeTab === 'signin' ? setSignInValidation : setSignUpValidation;
  const otp = activeTab === 'signin' ? signInOtp : signUpOtp;
  const setOtp = activeTab === 'signin' ? setSignInOtp : setSignUpOtp;
  const step = activeTab === 'signin' ? signInStep : signUpStep;
  const setStep = activeTab === 'signin' ? setSignInStep : setSignUpStep;

  // WebOTP auto-read
  const { code: webOtpCode, status: webOtpStatus, cancel: cancelWebOtp } = useWebOtp(step === 'otp');

  // OTP countdown timer
  const { formattedTime, isExpired } = useOtpCountdown(otpExpiryTimestamp);

  useEffect(() => {
    // Check for flash message
    const flash = getFlashMessage();
    if (flash) {
      setFlashMessage(flash);
      clearFlashMessage();
    }

    // Check for lockout
    const lockout = getOTPLockout();
    if (lockout) {
      setLockoutTime(lockout);
    }
  }, [getFlashMessage, clearFlashMessage, getOTPLockout]);

  useEffect(() => {
    // Update lockout timer
    if (lockoutTime) {
      const interval = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          resetOTPAttempts();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lockoutTime, resetOTPAttempts]);

  // Handle WebOTP auto-fill
  useEffect(() => {
    if (webOtpCode && webOtpCode.length === 6) {
      setOtp(webOtpCode);
      // Auto-submit after a brief delay
      setTimeout(() => {
        handleVerifyOTP(webOtpCode);
      }, 300);
    }
  }, [webOtpCode]);

  // Show permission modal when WebOTP fails
  useEffect(() => {
    if (step === 'otp' && (webOtpStatus === 'unsupported' || webOtpStatus === 'denied' || webOtpStatus === 'timeout' || webOtpStatus === 'error')) {
      setShowPermissionModal(true);
    }
  }, [step, webOtpStatus]);

  // Re-validate when country changes
  useEffect(() => {
    if (phoneNumber) {
      const validation = validatePhoneNumber(phoneNumber, selectedCountry);
      setPhoneValidation(validation);
      if (!validation.isValid) {
        setError(validation.errorMessage || '');
      } else {
        setError('');
      }
    }
  }, [selectedCountry]);

  const handleValidationChange = (result: PhoneValidationResult) => {
    setPhoneValidation(result);
    if (!result.isValid) {
      setError(result.errorMessage || '');
    } else {
      setError('');
    }
  };

  const validateSignUpFields = (): boolean => {
    let isValid = true;
    
    // Validate name (optional but if provided, must be at least 2 characters)
    if (signUpName && signUpName.trim().length < 2) {
      setSignUpNameError('Name must be at least 2 characters');
      isValid = false;
    } else {
      setSignUpNameError('');
    }
    
    // Validate email (optional but if provided, must be valid format)
    if (signUpEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(signUpEmail)) {
        setSignUpEmailError('Please enter a valid email address');
        isValid = false;
      } else {
        setSignUpEmailError('');
      }
    } else {
      setSignUpEmailError('');
    }
    
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!phoneValidation?.isValid || !phoneValidation.e164) {
      setError('Please enter a valid phone number');
      showBasicErrorToast('Error: Invalid phone number');
      return;
    }

    // For Sign Up, validate additional fields
    if (activeTab === 'signup') {
      if (!validateSignUpFields()) {
        showBasicErrorToast('Error: Please check your information');
        return;
      }
    }

    setIsSendingOtp(true);
    setError('');

    try {
      // Simulate OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      const challenge = `challenge_${Date.now()}`;
      setChallengeId(challenge);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Set expiry to 2 minutes from now
      setOtpExpiryTimestamp(Date.now() + 2 * 60 * 1000);
      setStep('otp');
      console.log(`[TEST MODE] OTP sent: ${otp}`);
    } catch (err) {
      console.error('Error sending OTP:', err);
      setError('Failed to send OTP. Please try again.');
      showBasicErrorToast('Error: Failed to send OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (otpToVerify?: string) => {
    const otpCode = otpToVerify || otp;
    
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      showBasicErrorToast('Error: Invalid OTP');
      return;
    }

    // Check lockout
    if (lockoutTime && Date.now() < lockoutTime) {
      setShowLockoutModalState(true);
      return;
    }

    setIsVerifyingOtp(true);
    setError('');

    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Verify OTP
      if (otpCode !== generatedOTP) {
        incrementOTPAttempts();
        const attempts = parseInt(localStorage.getItem('doraa-otp-attempts') || '0');
        
        if (attempts >= 3) {
          setOTPLockout();
          const lockout = getOTPLockout();
          if (lockout) {
            setLockoutTime(lockout);
            setShowLockoutModalState(true);
            showLockoutToast();
          }
        } else {
          setError(`Invalid OTP. ${3 - attempts} attempts remaining.`);
          showBasicErrorToast('Error: Invalid OTP');
        }
        return;
      }

      // Success - create session
      if (!phoneValidation?.e164) {
        setError('Phone validation failed');
        showBasicErrorToast('Error: Please try again');
        return;
      }

      createOTPSession(phoneValidation.e164);
      resetOTPAttempts();

      // Navigate to return path or home
      const returnPath = getReturnPath();
      if (returnPath) {
        clearReturnPath();
        navigate(returnPath);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Error verifying OTP:', err);
      setError('Failed to verify OTP. Please try again.');
      showBasicErrorToast('Error: Please try again');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleResendOTP = async () => {
    if (!isExpired) return;
    
    setIsSendingOtp(true);
    setError('');
    setOtp('');

    try {
      // Generate new OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(otp);
      
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset expiry
      setOtpExpiryTimestamp(Date.now() + 2 * 60 * 1000);
      console.log(`[TEST MODE] OTP resent: ${otp}`);
    } catch (err) {
      console.error('Error resending OTP:', err);
      setError('Failed to resend OTP. Please try again.');
      showBasicErrorToast('Error: Failed to resend OTP');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await loginII();
      
      // Navigate to return path or home
      const returnPath = getReturnPath();
      if (returnPath) {
        clearReturnPath();
        navigate(returnPath);
      } else {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Internet Identity login error:', err);
      setError('Failed to login with Internet Identity. Please try again.');
      showBasicErrorToast('Error: Login failed');
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
    setOtpExpiryTimestamp(null);
    cancelWebOtp();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    setError('');
    // Reset both flows when switching tabs
    setSignInStep('phone');
    setSignUpStep('phone');
    setSignInOtp('');
    setSignUpOtp('');
    setOtpExpiryTimestamp(null);
    cancelWebOtp();
  };

  const handleManualOtpEntry = () => {
    // Just close the modal and let user enter OTP manually
    setShowPermissionModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/40 backdrop-blur-xl border-pearl-blue/20">
        <CardHeader>
          <CardTitle className="text-2xl font-serif text-pearl-off-white text-center">
            Welcome to DoRaa Sangam House
          </CardTitle>
          <CardDescription className="text-center text-pearl-off-white/60">
            Sign in to continue your luxury shopping experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Flash Message */}
            {flashMessage && (
              <Alert className="mb-4 border-pearl-blue/30 bg-pearl-blue/10">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{flashMessage.message}</AlertDescription>
              </Alert>
            )}

            {/* Sign In Tab */}
            <TabsContent value="signin" className="space-y-4">
              {step === 'phone' ? (
                <>
                  <div className="space-y-2">
                    <InternationalPhoneInput
                      id="signin-phone"
                      label="Mobile Number"
                      value={signInPhone}
                      onChange={setSignInPhone}
                      selectedCountry={signInCountry}
                      onCountryChange={setSignInCountry}
                      onValidationChange={handleValidationChange}
                      disabled={isSendingOtp}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSendOTP}
                    disabled={isSendingOtp || !phoneValidation?.isValid}
                    className="w-full bg-pearl-blue hover:bg-pearl-blue/90 text-black font-medium min-h-[44px]"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-pearl-blue/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/40 px-2 text-pearl-off-white/60">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleInternetIdentityLogin}
                    disabled={isLoggingIn}
                    variant="outline"
                    className="w-full border-pearl-blue/30 hover:bg-pearl-blue/10 min-h-[44px]"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Passkey Login
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-pearl-off-white/80 block text-center">
                      Enter 6-digit OTP sent to {phoneValidation?.e164}
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signInOtp}
                        onChange={setSignInOtp}
                        disabled={isVerifyingOtp}
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
                    <div className="flex items-center justify-center gap-2 text-sm text-pearl-off-white/60">
                      <Clock className="h-4 w-4" />
                      <span>
                        {isExpired ? 'OTP expired' : `Expires in ${formattedTime}`}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center text-sm text-pearl-off-white/60">
                    Test OTP: {generatedOTP}
                  </div>

                  <Button
                    onClick={() => handleVerifyOTP()}
                    disabled={isVerifyingOtp || signInOtp.length !== 6 || isExpired}
                    className="w-full bg-pearl-blue hover:bg-pearl-blue/90 text-black font-medium min-h-[44px]"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={handleBackToPhone}
                      variant="ghost"
                      className="text-pearl-blue hover:text-pearl-blue/80"
                    >
                      Change Number
                    </Button>
                    <Button
                      onClick={handleResendOTP}
                      variant="ghost"
                      disabled={!isExpired || isSendingOtp}
                      className="text-pearl-blue hover:text-pearl-blue/80 disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Sign Up Tab */}
            <TabsContent value="signup" className="space-y-4">
              {step === 'phone' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-pearl-off-white/80">
                      Name (Optional)
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={signUpName}
                      onChange={(e) => setSignUpName(e.target.value)}
                      placeholder="Your name"
                      className="bg-black/30 border-pearl-blue/30 text-pearl-off-white placeholder:text-pearl-off-white/40"
                      disabled={isSendingOtp}
                    />
                    {signUpNameError && (
                      <p className="text-sm text-red-400">{signUpNameError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-pearl-off-white/80">
                      Email (Optional)
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="bg-black/30 border-pearl-blue/30 text-pearl-off-white placeholder:text-pearl-off-white/40"
                      disabled={isSendingOtp}
                    />
                    {signUpEmailError && (
                      <p className="text-sm text-red-400">{signUpEmailError}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <InternationalPhoneInput
                      id="signup-phone"
                      label="Mobile Number"
                      value={signUpPhone}
                      onChange={setSignUpPhone}
                      selectedCountry={signUpCountry}
                      onCountryChange={setSignUpCountry}
                      onValidationChange={handleValidationChange}
                      disabled={isSendingOtp}
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    onClick={handleSendOTP}
                    disabled={isSendingOtp || !phoneValidation?.isValid}
                    className="w-full bg-pearl-blue hover:bg-pearl-blue/90 text-black font-medium min-h-[44px]"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-pearl-blue/20" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black/40 px-2 text-pearl-off-white/60">Or continue with</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleInternetIdentityLogin}
                    disabled={isLoggingIn}
                    variant="outline"
                    className="w-full border-pearl-blue/30 hover:bg-pearl-blue/10 min-h-[44px]"
                  >
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Passkey Login
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="text-pearl-off-white/80 block text-center">
                      Enter 6-digit OTP sent to {phoneValidation?.e164}
                    </Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signUpOtp}
                        onChange={setSignUpOtp}
                        disabled={isVerifyingOtp}
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
                    <div className="flex items-center justify-center gap-2 text-sm text-pearl-off-white/60">
                      <Clock className="h-4 w-4" />
                      <span>
                        {isExpired ? 'OTP expired' : `Expires in ${formattedTime}`}
                      </span>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="text-center text-sm text-pearl-off-white/60">
                    Test OTP: {generatedOTP}
                  </div>

                  <Button
                    onClick={() => handleVerifyOTP()}
                    disabled={isVerifyingOtp || signUpOtp.length !== 6 || isExpired}
                    className="w-full bg-pearl-blue hover:bg-pearl-blue/90 text-black font-medium min-h-[44px]"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>

                  <div className="flex justify-between items-center">
                    <Button
                      onClick={handleBackToPhone}
                      variant="ghost"
                      className="text-pearl-blue hover:text-pearl-blue/80"
                    >
                      Change Number
                    </Button>
                    <Button
                      onClick={handleResendOTP}
                      variant="ghost"
                      disabled={!isExpired || isSendingOtp}
                      className="text-pearl-blue hover:text-pearl-blue/80 disabled:opacity-50"
                    >
                      {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                    </Button>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modals */}
      <WebOtpPermissionModal
        open={showPermissionModal}
        onOpenChange={setShowPermissionModal}
        onManualEntry={handleManualOtpEntry}
      />
      <OtpLockoutModal
        open={showLockoutModalState}
        onOpenChange={setShowLockoutModalState}
        lockoutUntil={lockoutTime}
      />
    </div>
  );
}
