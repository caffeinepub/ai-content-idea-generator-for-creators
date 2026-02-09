import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { affiliateResources } from '../../lib/affiliateResources';

export default function AffiliateResourcesSection() {
  const categoryLabels = {
    tools: 'Tools',
    education: 'Education',
    services: 'Services',
    products: 'Products',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Affiliate Resources</h2>
        <p className="text-muted-foreground">
          Recommended tools and services to help grow your content business
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Affiliate Disclosure:</strong> Some links may be affiliate links and we may earn a
          commission at no extra cost to you. We only recommend products and services we believe will
          add value to your content creation journey.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-4">
        {affiliateResources.map((resource, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-lg">{resource.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {categoryLabels[resource.category]}
                  </Badge>
                </div>
              </div>
              <CardDescription className="pt-2">{resource.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full gap-2"
                asChild
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn More
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-3">
        <h3 className="font-semibold">How to Use Affiliate Resources</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              <strong>Explore tools</strong> that can improve your content quality and workflow efficiency
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              <strong>Try free trials</strong> when available to test if a tool fits your needs
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>
              <strong>Share your favorites</strong> with your audience to earn commissions while helping them
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
