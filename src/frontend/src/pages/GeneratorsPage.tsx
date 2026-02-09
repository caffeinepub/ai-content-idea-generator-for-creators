import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReelIdeasGenerator from '../components/generators/ReelIdeasGenerator';
import HookGenerator from '../components/generators/HookGenerator';
import CaptionGenerator from '../components/generators/CaptionGenerator';
import ScriptGenerator from '../components/generators/ScriptGenerator';
import { Lightbulb, Zap, MessageSquare, FileText } from 'lucide-react';

export default function GeneratorsPage() {
  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Content Generators</h1>
        <p className="text-muted-foreground">
          Create viral content ideas with AI-powered generators tailored to your niche.
        </p>
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
  );
}
