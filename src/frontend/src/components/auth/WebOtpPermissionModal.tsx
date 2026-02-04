import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, Settings, Edit3 } from 'lucide-react';

interface WebOtpPermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onManualEntry: () => void;
}

export default function WebOtpPermissionModal({ open, onOpenChange, onManualEntry }: WebOtpPermissionModalProps) {
  const handleOpenSettings = () => {
    // Best-effort attempt to open app settings
    // This is not guaranteed to work on all devices/browsers
    try {
      // Android intent to open app settings (may not work in all browsers)
      window.location.href = 'intent://settings#Intent;scheme=android-app;package=com.android.settings;end';
    } catch (err) {
      console.log('Could not open settings automatically');
    }
  };

  const handleManualEntry = () => {
    onManualEntry();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/40">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <AlertCircle className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-xl font-serif">Enable SMS Permission for Auto-OTP</DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground leading-relaxed pt-2">
            Allow SMS read permission for auto-filling OTP. Go to phone <span className="font-semibold text-foreground">Settings → Apps → DoRaa Sangam House → Permissions → SMS → Allow</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-3 mt-4">
          <Button
            onClick={handleOpenSettings}
            variant="outline"
            className="w-full sm:w-auto border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
          >
            <Settings className="mr-2 h-4 w-4" />
            Open Settings
          </Button>
          <Button
            onClick={handleManualEntry}
            className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 gold-pulse-glow"
          >
            <Edit3 className="mr-2 h-4 w-4" />
            Enter OTP Manually
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
