import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ReelIdeasGenerator from '../components/generators/ReelIdeasGenerator';
import HookGenerator from '../components/generators/HookGenerator';
import CaptionGenerator from '../components/generators/CaptionGenerator';
import ScriptGenerator from '../components/generators/ScriptGenerator';
import WatchAdDialog from '../components/ads/WatchAdDialog';
import { Lightbulb, Zap, MessageSquare, FileText, Coins } from 'lucide-react';
import { useGetCredits } from '../hooks/useQueries';
import { useState } from 'react';

export default function GeneratorsPage() {
  const { data: credits, isLoading } = useGetCredits();
  const [showAdDialog, setShowAdDialog] = useState(false);

  const creditsCount = credits ? Number(credits) : 0;

  return (
    <>
      <div className="container py-8 space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Content Generators</h1>
            <p className="text-muted-foreground">
              Create viral content ideas with AI-powered generators tailored to your niche.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-muted px-4 py-2 rounded-lg">
              <Coins className="h-5 w-5 text-amber-500" />
              <div className="text-sm">
                <div className="font-semibold">{isLoading ? '...' : creditsCount} Credits</div>
                <div className="text-xs text-muted-foreground">Unlock premium features</div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdDialog(true)}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Earn Credits
            </Button>
          </div>
        </div>

        <Tabs defaultValue="reels" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="reels" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Reel Ideas</span>
              <span className="sm:hidden">Reels</span>
            </TabsTrigger>
            <TabsTrigger value="hooks" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Hooks</span>
              <span className="sm:hidden">Hooks</span>
            </TabsTrigger>
            <TabsTrigger value="captions" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Captions</span>
              <span className="sm:hidden">Captions</span>
              <Badge variant="secondary" className="ml-1 text-xs">Premium</Badge>
            </TabsTrigger>
            <TabsTrigger value="scripts" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Scripts</span>
              <span className="sm:hidden">Scripts</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reels">
            <ReelIdeasGenerator />
          </TabsContent>

          <TabsContent value="hooks">
            <HookGenerator />
          </TabsContent>

          <TabsContent value="captions">
            <CaptionGenerator />
          </TabsContent>

          <TabsContent value="scripts">
            <ScriptGenerator />
          </TabsContent>
        </Tabs>
      </div>

      <WatchAdDialog
        open={showAdDialog}
        onOpenChange={setShowAdDialog}
      />
    </>
  );
}
