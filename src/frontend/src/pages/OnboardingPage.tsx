import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import OnboardingSectionList from '../components/onboarding/OnboardingSectionList';
import { setOnboardingCompleted } from '../lib/onboardingStorage';

export default function OnboardingPage() {
  const navigate = useNavigate();

  const handleStartCreating = () => {
    setOnboardingCompleted(true);
    navigate({ to: '/generators' });
  };

  const handleSkip = () => {
    setOnboardingCompleted(true);
    navigate({ to: '/generators' });
  };

  return (
    <div className="container max-w-5xl py-12 px-4">
      <Card className="border-2">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl md:text-4xl">Welcome to ContentSpark!</CardTitle>
          <CardDescription className="text-base md:text-lg max-w-2xl mx-auto">
            Your all-in-one platform for creating viral social media content. Generate ideas, track
            trends, organize your library, and plan your content calendar—all in one place.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center">Explore Key Features</h2>
            <OnboardingSectionList />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button onClick={handleStartCreating} size="lg" className="gap-2 sm:min-w-[200px]">
              <Sparkles className="h-5 w-5" />
              Start Creating
            </Button>
            <Button onClick={handleSkip} variant="outline" size="lg" className="sm:min-w-[200px]">
              Skip for now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
