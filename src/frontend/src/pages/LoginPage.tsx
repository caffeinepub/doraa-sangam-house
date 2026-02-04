import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Shield } from 'lucide-react';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { showLockoutToast } from '../utils/premiumToasts';
import InternationalPhoneInput from '../components/auth/InternationalPhoneInput';
import { detectCountryFromLocale } from '../utils/detectCountryFromLocale';
import { validatePhoneNumber, type PhoneValidationResult } from '../utils/phoneValidation';
import type { CountryData } from '../utils/phoneCountries';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export default function LoginPage({ navigate }: LoginPageProps) {
  const [phoneNumber, setPhoneNumber] = useState(''); // National number only
  const [selectedCountry, setSelectedCountry] = useState<CountryData>(() => detectCountryFromLocale());
  const [phoneValidation, setPhoneValidation] = useState<PhoneValidationResult | null>(null);
  const [otp, setOtp] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    createOTPSession, 
    getFlashMessage, 
    clearFlashMessage,
    getOTPLockout,
    incrementOTPAttempts,
    resetOTPAttempts,
    setOTPLockout,
  } = useStorefrontAuth();
  
  const { login: loginII, isLoggingIn } = useInternetIdentity();
  const [flashMessage, setFlashMessage] = useState<{ message: string; type: string } | null>(null);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

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

  const handleValidationChange = (result: PhoneValidationResult) => {
    setPhoneValidation(result);
    if (!result.isValid) {
      setError(result.errorMessage || '');
    } else {
      setError('');
    }
  };

  const handleSendOTP = () => {
    setError('');
    
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

    setIsLoading(true);
    
    // Generate 6-digit OTP
    const newOTP = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOTP(newOTP);
    
    // Show OTP in alert and console for testing
    alert(`Your OTP is: ${newOTP}`);
    console.log(`Generated OTP for ${validation.e164}: ${newOTP}`);
    
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 500);
  };

  const handleVerifyOTP = () => {
    setError('');

    // Check lockout
    const lockout = getOTPLockout();
    if (lockout) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (otp === generatedOTP) {
        // Success - store E.164 format
        const validation = validatePhoneNumber(phoneNumber, selectedCountry);
        if (validation.isValid && validation.e164) {
          createOTPSession(validation.e164);
          resetOTPAttempts();
          setIsLoading(false);
          navigate('/dashboard');
        }
      } else {
        // Wrong OTP
        const attempts = incrementOTPAttempts();
        if (attempts >= 3) {
          setOTPLockout();
          setLockoutTime(Date.now() + 10 * 60 * 1000);
          showLockoutToast();
          setError('Too many attempts. Retry after 10 minutes.');
        } else {
          setError(`Incorrect OTP. ${3 - attempts} attempt(s) remaining.`);
        }
        setIsLoading(false);
      }
    }, 500);
  };

  const handleInternetIdentityLogin = async () => {
    try {
      await loginII();
      navigate('/dashboard');
    } catch (err) {
      setError('Internet Identity login failed. Please try again.');
    }
  };

  const getRemainingTime = () => {
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
                Too many attempts. Retry after {getRemainingTime()}
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/50">
              <TabsTrigger value="signin" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4 mt-6">
              {step === 'phone' ? (
                <div className="space-y-4">
                  <InternationalPhoneInput
                    id="phone-signin"
                    label="Mobile Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    onValidationChange={handleValidationChange}
                    disabled={isLoading || !!lockoutTime}
                    error={phoneValidation && !phoneValidation.isValid ? phoneValidation.errorMessage : undefined}
                    onBlur={handlePhoneBlur}
                  />
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !!lockoutTime}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-signin" className="text-foreground">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading || !!lockoutTime}
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
                  </div>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6 || !!lockoutTime}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                      setError('');
                      setPhoneValidation(null);
                    }}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary"
                    disabled={isLoading}
                  >
                    Change Number
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="signup" className="space-y-4 mt-6">
              {step === 'phone' ? (
                <div className="space-y-4">
                  <InternationalPhoneInput
                    id="phone-signup"
                    label="Mobile Number"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    onValidationChange={handleValidationChange}
                    disabled={isLoading || !!lockoutTime}
                    error={phoneValidation && !phoneValidation.isValid ? phoneValidation.errorMessage : undefined}
                    onBlur={handlePhoneBlur}
                  />
                  <Button
                    onClick={handleSendOTP}
                    disabled={isLoading || !!lockoutTime}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp-signup" className="text-foreground">Enter OTP</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        disabled={isLoading || !!lockoutTime}
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
                  </div>
                  <Button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6 || !!lockoutTime}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow h-12 text-lg"
                  >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Button>
                  <Button
                    onClick={() => {
                      setStep('phone');
                      setOtp('');
                      setError('');
                      setPhoneValidation(null);
                    }}
                    variant="ghost"
                    className="w-full text-muted-foreground hover:text-primary"
                    disabled={isLoading}
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

          <Button
            onClick={handleInternetIdentityLogin}
            disabled={isLoggingIn || !!lockoutTime}
            variant="outline"
            className="w-full border-primary/50 text-primary hover:bg-primary/10 hover:border-primary gold-pulse-glow h-12"
          >
            <Shield className="mr-2 h-5 w-5" />
            {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
