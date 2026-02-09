import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile } from './useQueries';

export function useCurrentUser() {
  const { identity, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const isAuthenticated = !!identity && loginStatus === 'success';
  const needsProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return {
    identity,
    userProfile,
    isAuthenticated,
    needsProfileSetup,
    profileLoading,
    isFetched,
  };
}
