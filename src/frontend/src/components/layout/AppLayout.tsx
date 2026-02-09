import { ReactNode } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import LoginButton from '../auth/LoginButton';
import { Sparkles, Library, Calendar, TrendingUp, Wand2, Info } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, userProfile } = useCurrentUser();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="hidden sm:inline">ContentSpark</span>
          </Link>

          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1">
              <Button
                asChild
                variant={isActive('/generators') ? 'secondary' : 'ghost'}
                className="gap-2"
              >
                <Link to="/generators">
                  <Wand2 className="h-4 w-4" />
                  Generators
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive('/library') ? 'secondary' : 'ghost'}
                className="gap-2"
              >
                <Link to="/library">
                  <Library className="h-4 w-4" />
                  Library
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive('/calendar') ? 'secondary' : 'ghost'}
                className="gap-2"
              >
                <Link to="/calendar">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </Link>
              </Button>
              <Button
                asChild
                variant={isActive('/trends') ? 'secondary' : 'ghost'}
                className="gap-2"
              >
                <Link to="/trends">
                  <TrendingUp className="h-4 w-4" />
                  Trends
                </Link>
              </Button>
            </nav>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated && userProfile && (
              <span className="hidden sm:inline text-sm text-muted-foreground">
                {userProfile.name}
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} ContentSpark. All rights reserved.
            </p>
            {isAuthenticated && (
              <Button asChild variant="ghost" size="sm" className="gap-1.5 h-auto py-1">
                <Link to="/onboarding">
                  <Info className="h-3.5 w-3.5" />
                  Onboarding
                </Link>
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Built with love using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'contentspark'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
