import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import GeneratorsPage from './pages/GeneratorsPage';
import LibraryPage from './pages/LibraryPage';
import CalendarPage from './pages/CalendarPage';
import TrendsPage from './pages/TrendsPage';
import OnboardingPage from './pages/OnboardingPage';
import AuthGuard from './components/auth/AuthGuard';
import ProfileSetupModal from './components/profile/ProfileSetupModal';
import OnboardingAutoLauncher from './components/onboarding/OnboardingAutoLauncher';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ProfileSetupModal />
      <OnboardingAutoLauncher />
    </>
  ),
});

// Public landing route
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

// Onboarding route (protected)
const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: () => (
    <AuthGuard>
      <OnboardingPage />
    </AuthGuard>
  ),
});

// Protected routes
const generatorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/generators',
  component: () => (
    <AuthGuard>
      <GeneratorsPage />
    </AuthGuard>
  ),
});

const libraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/library',
  component: () => (
    <AuthGuard>
      <LibraryPage />
    </AuthGuard>
  ),
});

const calendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/calendar',
  component: () => (
    <AuthGuard>
      <CalendarPage />
    </AuthGuard>
  ),
});

const trendsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/trends',
  component: () => (
    <AuthGuard>
      <TrendsPage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  onboardingRoute,
  generatorsRoute,
  libraryRoute,
  calendarRoute,
  trendsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
