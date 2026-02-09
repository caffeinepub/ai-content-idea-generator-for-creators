import { useState } from 'react';
import { useGetCredits } from '../../hooks/useQueries';

export function usePremiumGate() {
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const { data: credits } = useGetCredits();

  const hasCredits = credits !== undefined && Number(credits) > 0;

  const executeWithGate = (action: () => void) => {
    if (hasCredits) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAdDialog(true);
    }
  };

  const handleCreditsGranted = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleDialogClose = () => {
    setShowAdDialog(false);
    setPendingAction(null);
  };

  return {
    hasCredits,
    credits: credits ? Number(credits) : 0,
    showAdDialog,
    setShowAdDialog,
    executeWithGate,
    handleCreditsGranted,
    handleDialogClose,
  };
}
