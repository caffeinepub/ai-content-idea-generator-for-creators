/**
 * Browser storage helpers for onboarding completion state.
 * Storage key: 'contentspark_onboarding_completed'
 * To manually reset: localStorage.removeItem('contentspark_onboarding_completed')
 */

const ONBOARDING_KEY = 'contentspark_onboarding_completed';

export function getOnboardingCompleted(): boolean {
  try {
    const value = localStorage.getItem(ONBOARDING_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(ONBOARDING_KEY, completed ? 'true' : 'false');
  } catch (error) {
    console.error('Failed to save onboarding state:', error);
  }
}

export function resetOnboarding(): void {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
  } catch (error) {
    console.error('Failed to reset onboarding state:', error);
  }
}
