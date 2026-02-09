import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, CheckCircle2, XCircle } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

interface WatchAdDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreditsGranted?: () => void;
}

export default function WatchAdDialog({ open, onOpenChange, onCreditsGranted }: WatchAdDialogProps) {
  const [adState, setAdState] = useState<'ready' | 'playing' | 'complete' | 'error'>('ready');
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const AD_DURATION = 5000; // 5 seconds for demo

  useEffect(() => {
    if (!open) {
      setAdState('ready');
      setProgress(0);
    }
  }, [open]);

  const handleStartAd = () => {
    setAdState('playing');
    setProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / AD_DURATION) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        handleAdComplete();
      }
    }, 50);
  };

  const handleAdComplete = async () => {
    try {
      // Simulate granting credits
      // In production, this would call the backend after ad network confirms view
      setAdState('complete');
      
      // Invalidate credits query to refetch
      await queryClient.invalidateQueries({ queryKey: ['credits'] });
      
      // Simulate credit grant (in real app, backend would handle this)
      setTimeout(() => {
        if (onCreditsGranted) {
          onCreditsGranted();
        }
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      console.error('Failed to grant credits:', error);
      setAdState('error');
    }
  };

  const handleClose = () => {
    if (adState !== 'playing') {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Watch Ad to Unlock</DialogTitle>
          <DialogDescription>
            Watch a short ad to earn 1 unlock credit and access premium features.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {adState === 'ready' && (
            <div className="space-y-4">
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <Play className="h-16 w-16 text-muted-foreground" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  This will take approximately 5 seconds
                </p>
                <Button onClick={handleStartAd} className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Start Ad
                </Button>
              </div>
            </div>
          )}

          {adState === 'playing' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg aspect-video flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 animate-pulse" />
                <div className="relative z-10 text-center space-y-2">
                  <div className="text-2xl font-bold">Sample Ad Content</div>
                  <div className="text-sm text-muted-foreground">Please wait...</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          )}

          {adState === 'complete' && (
            <div className="space-y-4">
              <div className="bg-green-500/10 rounded-lg aspect-video flex items-center justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-green-600 dark:text-green-400">
                  Credit Earned!
                </p>
                <p className="text-sm text-muted-foreground">
                  You've earned 1 unlock credit. Redirecting...
                </p>
              </div>
            </div>
          )}

          {adState === 'error' && (
            <div className="space-y-4">
              <div className="bg-destructive/10 rounded-lg aspect-video flex items-center justify-center">
                <XCircle className="h-16 w-16 text-destructive" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-semibold text-destructive">
                  Something went wrong
                </p>
                <p className="text-sm text-muted-foreground">
                  Failed to grant credit. Please try again.
                </p>
                <Button onClick={() => setAdState('ready')} variant="outline" className="w-full">
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        {adState === 'ready' && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
