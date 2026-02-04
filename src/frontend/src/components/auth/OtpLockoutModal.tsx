import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

interface OtpLockoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lockoutUntil: number | null;
}

export default function OtpLockoutModal({ open, onOpenChange, lockoutUntil }: OtpLockoutModalProps) {
  const [remainingTime, setRemainingTime] = useState('');

  useEffect(() => {
    if (!lockoutUntil) return;

    const updateTimer = () => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setRemainingTime('');
        onOpenChange(false);
        return;
      }
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;
      setRemainingTime(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil, onOpenChange]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-destructive/40">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-full bg-destructive/10">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-2xl">Too Many Attempts</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-muted-foreground leading-relaxed">
            For security reasons, OTP verification has been temporarily locked after 3 incorrect attempts.
            {remainingTime && (
              <span className="block mt-3 text-lg font-mono text-destructive">
                Please try again in {remainingTime}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onOpenChange(false)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 gold-pulse-glow"
          >
            I Understand
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
