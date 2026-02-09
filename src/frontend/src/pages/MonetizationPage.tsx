import { useState } from 'react';
import { DollarSign, Package, Mail, FileText, TrendingUp, Loader2, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OfferGenerator from '../components/monetization/OfferGenerator';
import BrandPitchBuilder from '../components/monetization/BrandPitchBuilder';
import MediaKitGenerator from '../components/monetization/MediaKitGenerator';
import RevenueTracker from '../components/monetization/RevenueTracker';
import AffiliateResourcesSection from '../components/monetization/AffiliateResourcesSection';
import {
  useGetUserMonetizationOffers,
  useGetUserBrandPitches,
  useGetUserMediaKits,
  useGetUserRevenueGoals,
} from '../hooks/useQueries';

export default function MonetizationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const { isLoading: offersLoading } = useGetUserMonetizationOffers();
  const { isLoading: pitchesLoading } = useGetUserBrandPitches();
  const { isLoading: kitsLoading } = useGetUserMediaKits();
  const { isLoading: goalsLoading } = useGetUserRevenueGoals();

  const isLoading = offersLoading || pitchesLoading || kitsLoading || goalsLoading;

  if (isLoading) {
    return (
      <div className="container max-w-7xl py-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Monetization Toolkit</h1>
          <p className="text-muted-foreground">Turn your content into revenue streams</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="pitches">Pitches</TabsTrigger>
          <TabsTrigger value="mediakit">Media Kit</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="affiliate" className="gap-1">
            <span className="hidden sm:inline">Affiliate</span>
            <span className="sm:hidden">Links</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome to Your Monetization Hub</CardTitle>
              <CardDescription>
                Everything you need to start earning from your content in one place
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground">
                  Ready to turn your content into income? This toolkit provides you with practical tools
                  to create offers, pitch brands, showcase your work, and track your earnings.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Create Offers</CardTitle>
                    </div>
                    <CardDescription>
                      Package your services into clear, compelling offers that solve specific problems
                      for your audience. Define deliverables, pricing, and fulfillment details.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Pitch Brands</CardTitle>
                    </div>
                    <CardDescription>
                      Generate professional pitch messages for brand collaborations. Get DM scripts,
                      email templates, and follow-up sequences ready to send.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Build Media Kit</CardTitle>
                    </div>
                    <CardDescription>
                      Create a professional one-page media kit that showcases your audience, content
                      style, and collaboration opportunities for brand partnerships.
                    </CardDescription>
                  </CardHeader>
                </Card>

                <Card className="border-2">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Track Revenue</CardTitle>
                    </div>
                    <CardDescription>
                      Set monthly revenue goals and track earnings from all sources. Monitor your
                      progress and see how your monetization efforts are paying off.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-lg">Monetization Paths to Explore</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Affiliate Marketing:</strong> Promote products you love and earn commissions
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Brand Partnerships:</strong> Collaborate with brands for sponsored content
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Services:</strong> Offer coaching, consulting, or content creation services
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>
                      <strong>Digital Products:</strong> Create and sell templates, presets, or courses
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <OfferGenerator />
        </TabsContent>

        <TabsContent value="pitches">
          <BrandPitchBuilder />
        </TabsContent>

        <TabsContent value="mediakit">
          <MediaKitGenerator />
        </TabsContent>

        <TabsContent value="revenue">
          <RevenueTracker />
        </TabsContent>

        <TabsContent value="affiliate">
          <AffiliateResourcesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
