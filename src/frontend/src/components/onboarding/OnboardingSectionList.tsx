import { Wand2, TrendingUp, Library, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const sections = [
  {
    icon: Wand2,
    title: 'Generators',
    description: 'Create viral reel ideas, hooks, captions, and scripts with AI-powered tools.',
  },
  {
    icon: TrendingUp,
    title: 'Trends',
    description: 'Discover and analyze trending content to stay ahead of the curve.',
  },
  {
    icon: Library,
    title: 'Library',
    description: 'Save and organize all your generated content ideas in one place.',
  },
  {
    icon: Calendar,
    title: 'Calendar',
    description: 'Plan and schedule your content strategy with an intuitive calendar view.',
  },
];

export default function OnboardingSectionList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <Card key={section.title} className="border-2 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{section.title}</h3>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
