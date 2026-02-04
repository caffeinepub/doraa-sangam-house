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
import { showLockoutToast, showInvalidOTPToast } from '../utils/premiumToasts';
import InternationalPhoneInput from '../components/auth/InternationalPhoneInput';
import { detectCountryFromLocale } from '../utils/detectCountryFromLocale';
import { validatePhoneNumber, type PhoneValidationResult } from '../utils/phoneValidation';
import type { CountryData } from '../utils/phoneCountries';
import { useWebOtp } from '../hooks/useWebOtp';
import { useOtpCountdown } from '../hooks/useOtpCountdown';
import WebOtpPermissionModal from '../components/auth/WebOtpPermissionModal';
import OtpLockoutModal from '../components/auth/OtpLockoutModal';
import { getUrlParameter } from '../utils/urlParams';
import { getSafeReturnPath } from '../utils/safeReturnPath';
import { executeFullCleanBootReset } from '../utils/fullCleanBootReset';
import { useQueryClient } from '@tanstack/react-query';
import { useCommerce } from '../hooks/useCommerce';

interface LoginPageProps {
  navigate: (path: string) => void;
}

type AuthStep = 'phone' | 'otp';
type TabValue = 'signin' | 'signup';

export default function LoginPage({ navigate }: LoginPageProps) {
  const queryClient = useQueryClient();
  const { clearCart } = useCommerce();
  
  // Check for emergency reset parameter
  const resetParam = getUrlParameter('reset');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (resetParam === '1' && !isResetting) {
      setIsResetting(true);
      executeFullCleanBootReset({
        clearReactQuery: () => queryClient.clear(),
        clearInternetIdentity: async () => {
          try {
            await clearII();
          } catch (error) {
            console.warn('Failed to clear II during reset:', error);
          }
        },
        clearCartState: clearCart,
      }).then(() => {
        // Navigate to clean login state
        navigate('/login?tab=signin');
      }).catch((error) => {
        console.error('Emergency reset failed:', error);
        setIsResetting(false);
      });
    }
  }, [resetParam]);

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
  
  const { login: loginII, isLoggingIn, identity, clear: clearII } = useInternetIdentity();
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
    setError('');
    
    // For Sign Up, validate name and email first
    if (activeTab === 'signup') {
      if (!validateSignUpFields()) {
        return;
      }
    }
    
    // Validate phone number
    const validation = validatePhoneNumber(phoneNumber, selectedCountry);
    setPhoneValidation(validation);
    
    if (!validation.isValid) {
      setError(validation.errorMessage || `Please enter a valid ${selectedCountry.name} mobile number`);
      return;
    }

    // Check lockout
    const lockout = getOTPLockout();
    if (lockout) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    setIsSendingOtp(true);
    
    try {
      // Simulated backend behavior
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOTP(newOTP);
      setChallengeId(`challenge-${Date.now()}`);
      
      // Log OTP to console for testing
      console.log(`[SIMULATED] SMS sent to ${validation.e164}: Your DoRaa Sangam House OTP is: ${newOTP}. Valid for 2 minutes.`);
      alert(`[TEST MODE] Your OTP is: ${newOTP}`);
      
      setOtpExpiryTimestamp(Date.now() + 2 * 60 * 1000);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOTP = async (otpValue?: string) => {
    const otpToVerify = otpValue || otp;
    setError('');

    // Check lockout
    const lockout = getOTPLockout();
    if (lockout) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    if (otpToVerify.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    // Check expiry
    if (isExpired) {
      setError('OTP has expired. Please request a new one.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      // Simulated backend behavior
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otpToVerify === generatedOTP) {
        // Success
        const validation = validatePhoneNumber(phoneNumber, selectedCountry);
        if (validation.isValid && validation.e164) {
          createOTPSession(validation.e164);
          resetOTPAttempts();
          cancelWebOtp();
          
          // Navigate to safe return path or dashboard
          const returnPath = getReturnPath();
          const safePath = getSafeReturnPath(returnPath, '/dashboard');
          clearReturnPath();
          navigate(safePath);
        }
      } else {
        // Wrong OTP - show premium error toast
        showInvalidOTPToast();
        const attempts = incrementOTPAttempts();
        if (attempts >= 3) {
          setOTPLockout();
          setLockoutTime(Date.now() + 10 * 60 * 1000);
          setShowLockoutModalState(true);
          showLockoutToast();
          setError('Too many attempts. Retry after 10 minutes.');
        } else {
          setError(`Incorrect OTP. ${3 - attempts} attempt(s) remaining.`);
        }
      }
    } catch (err: any) {
      console.error('Verify OTP error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleInternetIdentityLogin = async () => {
    // If already authenticated, just navigate
    if (identity && !identity.getPrincipal().isAnonymous()) {
      const returnPath = getReturnPath();
      const safePath = getSafeReturnPath(returnPath, '/dashboard');
      clearReturnPath();
      navigate(safePath);
      return;
    }

    try {
      await loginII();
      // Navigate to safe return path or dashboard
      const returnPath = getReturnPath();
      const safePath = getSafeReturnPath(returnPath, '/dashboard');
      clearReturnPath();
      navigate(safePath);
    } catch (err: any) {
      // Suppress "already authenticated" errors
      if (err?.message?.includes('already authenticated')) {
        const returnPath = getReturnPath();
        const safePath = getSafeReturnPath(returnPath, '/dashboard');
        clearReturnPath();
        navigate(safePath);
        return;
      }
      setError('Internet Identity login failed. Please try again.');
    }
  };

  const getRemainingLockoutTime = () => {
    if (!lockoutTime) return '';
    const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePhoneBlur = () => {
    if (phoneNumber) {
      const validation = validatePhoneNumber(phoneNumber, selectedCountry);
      setPhoneValidation(validation);
      if (!validation.isValid) {
        setError(validation.errorMessage || '');
      } else {
        setError('');
      }
    }
  };

  const handleManualEntry = () => {
    setShowPermissionModal(false);
    cancelWebOtp();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabValue);
    setError('');
  };

  if (isResetting) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Resetting application...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-serif text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Login to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {flashMessage && (
            <Alert className={flashMessage.type === 'success' ? 'border-primary bg-primary/10' : 'border-accent bg-accent/10'}>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className={flashMessage.type === 'success' ? 'text-primary' : 'text-accent'}>
                {flashMessage.message}
              </AlertDescription>
            </Alert>
          )}

          {error && !phoneValidation && (
            <Alert variant="destructive" className="border-accent bg-accent/10">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-accent">{error}</AlertDescription>
            </Alert>
          )}

          {lockoutTime && (
            <Alert className="border-destructive bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">
                Too many attempts. Retry after {getRemainingLockoutTime()}
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4 mt-6">
              {signInStep === 'phone' ? (
                <div className="space-y-4">
                  <InternationalPhoneInput
                    id="phone-signin"
                    label="Mobile Number"
                    value={signInPhone}
                    onChange={setSignInPhone}
                    selectedCountry={signInCountry}
                    onCountryChange={setSignInCountry}
                    onValidationChange={handleValidationChange}
                    disabled={isSendingOtp || !!lockoutTime}
                    error={signInValidation && !signInValidation.isValid ? signInValidation.errorMessage : undefined}
                    onBlur={handlePhoneBlur}
                  />
                  <Button
                    onClick={handleSendOTP}
                    disabled={isSendingOtp || !!lockoutTime}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp-signin" className="text-foreground">Enter OTP</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className={`font-mono ${isExpired ? 'text-destructive' : 'text-primary'}`}>
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signInOtp}
                        onChange={setSignInOtp}
                        disabled={isVerifyingOtp || !!lockoutTime || isExpired}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={1} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={2} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={3} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={4} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={5} className="border-border/60 bg-background/50" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {isExpired && (
                      <p className="text-sm text-destructive text-center">
                        OTP has expired. Please request a new one.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleVerifyOTP()}
                    disabled={isVerifyingOtp || signInOtp.length !== 6 || !!lockoutTime || isExpired}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSignInStep('phone');
                      setSignInOtp('');
                      setError('');
                      setSignInValidation(null);
                      setOtpExpiryTimestamp(null);
                      cancelWebOtp();
                    }}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary"
                    disabled={isVerifyingOtp}
                  >
                    Change Number
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 mt-6">
              {signUpStep === 'phone' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-foreground">Name (Optional)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your name"
                      value={signUpName}
                      onChange={(e) => {
                        setSignUpName(e.target.value);
                        setSignUpNameError('');
                      }}
                      disabled={isSendingOtp || !!lockoutTime}
                      className="bg-background/50 border-border/60 focus:border-primary"
                    />
                    {signUpNameError && (
                      <p className="text-sm text-accent">{signUpNameError}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email (Optional)</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signUpEmail}
                      onChange={(e) => {
                        setSignUpEmail(e.target.value);
                        setSignUpEmailError('');
                      }}
                      disabled={isSendingOtp || !!lockoutTime}
                      className="bg-background/50 border-border/60 focus:border-primary"
                    />
                    {signUpEmailError && (
                      <p className="text-sm text-accent">{signUpEmailError}</p>
                    )}
                  </div>
                  
                  <InternationalPhoneInput
                    id="phone-signup"
                    label="Mobile Number"
                    value={signUpPhone}
                    onChange={setSignUpPhone}
                    selectedCountry={signUpCountry}
                    onCountryChange={setSignUpCountry}
                    onValidationChange={handleValidationChange}
                    disabled={isSendingOtp || !!lockoutTime}
                    error={signUpValidation && !signUpValidation.isValid ? signUpValidation.errorMessage : undefined}
                    onBlur={handlePhoneBlur}
                  />
                  <Button
                    onClick={handleSendOTP}
                    disabled={isSendingOtp || !!lockoutTime}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isSendingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send OTP'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="otp-signup" className="text-foreground">Enter OTP</Label>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className={`font-mono ${isExpired ? 'text-destructive' : 'text-primary'}`}>
                          {formattedTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={signUpOtp}
                        onChange={setSignUpOtp}
                        disabled={isVerifyingOtp || !!lockoutTime || isExpired}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={1} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={2} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={3} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={4} className="border-border/60 bg-background/50" />
                          <InputOTPSlot index={5} className="border-border/60 bg-background/50" />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {isExpired && (
                      <p className="text-sm text-destructive text-center">
                        OTP has expired. Please request a new one.
                      </p>
                    )}
                  </div>
                  <Button
                    onClick={() => handleVerifyOTP()}
                    disabled={isVerifyingOtp || signUpOtp.length !== 6 || !!lockoutTime || isExpired}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isVerifyingOtp ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setSignUpStep('phone');
                      setSignUpOtp('');
                      setError('');
                      setSignUpValidation(null);
                      setOtpExpiryTimestamp(null);
                      cancelWebOtp();
                    }}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary"
                    disabled={isVerifyingOtp}
                  >
                    Change Number
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border/40" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleInternetIdentityLogin}
              disabled={isLoggingIn}
              variant="outline"
              className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:border-primary gold-pulse-glow h-12"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-5 w-5" />
                  Login with Internet Identity
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Secure password-less login with your device
            </p>
          </div>
        </CardContent>
      </Card>

      {/* WebOTP Permission Modal */}
      <WebOtpPermissionModal
        open={showPermissionModal}
        onOpenChange={setShowPermissionModal}
        onManualEntry={handleManualEntry}
      />

      {/* OTP Lockout Modal */}
      <OtpLockoutModal
        open={showLockoutModalState}
        onOpenChange={setShowLockoutModalState}
        lockoutUntil={lockoutTime}
      />
    </div>
  );
}
