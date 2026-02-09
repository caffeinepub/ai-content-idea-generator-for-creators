import { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { getOnboardingCompleted } from '../../lib/onboardingStorage';

export default function OnboardingAutoLauncher() {
  const navigate = useNavigate();
  const router = useRouterState();
  const { isAuthenticated, userProfile, profileLoading, isFetched } = useCurrentUser();

  useEffect(() => {
    // Only run when authenticated, profile is loaded, and user has a profile
    if (!isAuthenticated || profileLoading || !isFetched || userProfile === null) {
      return;
    }

    // Don't redirect if already on onboarding page
    if (router.location.pathname === '/onboarding') {
      return;
    }

    // Check if onboarding is completed
    const onboardingCompleted = getOnboardingCompleted();

    // If not completed, redirect to onboarding
    if (!onboardingCompleted) {
      navigate({ to: '/onboarding' });
    }
  }, [isAuthenticated, userProfile, profileLoading, isFetched, router.location.pathname, navigate]);

  return null;
}
