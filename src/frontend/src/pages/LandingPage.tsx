import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Wand2, TrendingUp, Calendar, Library, Zap, Target, Lightbulb, DollarSign } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';

export default function LandingPage() {
  const { isAuthenticated } = useCurrentUser();

  const features = [
    {
      icon: Lightbulb,
      title: 'Reel Ideas',
      description: 'Generate viral Instagram reel concepts tailored to your niche with structured scripts.',
    },
    {
      icon: Zap,
      title: 'Hook Generator',
      description: 'Create attention-grabbing hooks that stop the scroll and boost engagement.',
    },
    {
      icon: Wand2,
      title: 'Caption Writer',
      description: 'Craft compelling captions with hashtags and CTAs that drive action.',
    },
    {
      icon: Target,
      title: 'Script & Editing Tips',
      description: 'Get complete scripts with professional editing suggestions for polished content.',
    },
    {
      icon: TrendingUp,
      title: 'Trend Detector',
      description: 'Stay ahead with trending topics and viral opportunities in your niche.',
    },
    {
      icon: Calendar,
      title: 'Content Calendar',
      description: 'Plan and schedule your content strategy with an intuitive calendar view.',
    },
    {
      icon: DollarSign,
      title: 'Monetization Tools',
      description: 'Turn your content into revenue with offers, brand pitches, media kits, and revenue tracking.',
    },
  ];

  return (
    <div className="container py-12 md:py-20 space-y-20">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" />
          AI-Powered Content Creation
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Create Viral Content Ideas in{' '}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Seconds
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Stop staring at a blank screen. Generate trending reel ideas, viral hooks, engaging captions,
          and complete scripts with AI-powered tools built for creators.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          {isAuthenticated ? (
            <Button asChild size="lg" className="gap-2">
              <Link to="/generators">
                <Wand2 className="h-5 w-5" />
                Start Creating
              </Link>
            </Button>
          ) : (
            <Button asChild size="lg" className="gap-2">
              <Link to="/generators">
                <Sparkles className="h-5 w-5" />
                Get Started Free
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/trends">
              <TrendingUp className="h-5 w-5" />
              Explore Trends
            </Link>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Everything You Need to Go Viral</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful AI tools designed to help creators generate ideas, plan content, and stay on top of trends.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Monetization Callout */}
      <section className="text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-accent/10 to-primary/10 border">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium">
          <DollarSign className="h-4 w-4" />
          New: Monetization Toolkit
        </div>
        <h2 className="text-3xl md:text-4xl font-bold">Turn Your Content Into Income</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Create service offers, pitch brands, build media kits, and track your revenue—all in one place.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/monetization">
            <DollarSign className="h-5 w-5" />
            Explore Monetization Tools
          </Link>
        </Button>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to Create Amazing Content?</h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Join creators who are using AI to generate viral ideas and grow their audience.
        </p>
        <Button asChild size="lg" className="gap-2">
          <Link to="/generators">
            <Sparkles className="h-5 w-5" />
            Start Creating Now
          </Link>
        </Button>
      </section>
    </div>
  );
}
