import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Save } from 'lucide-react';
import { generateScript } from '../../lib/scriptGenerator';
import { useSaveVideoIdea } from '../../hooks/useQueries';
import { toast } from 'sonner';
import { Difficulty } from '../../backend';

interface ScriptResult {
  hook: string;
  setup: string;
  payoff: string;
  cta: string;
  editingSuggestions: string[];
}

export default function ScriptGenerator() {
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [script, setScript] = useState<ScriptResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveIdea = useSaveVideoIdea();

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic or idea');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateScript({
        topic: topic.trim(),
        objective: objective.trim(),
      });
      setScript(generated);
      setIsGenerating(false);
      toast.success('Script generated successfully!');
    }, 1500);
  };

  const handleSave = async () => {
    if (!script) return;

    try {
      await saveIdea.mutateAsync({
        id: BigInt(Date.now()),
        title: topic,
        objectives: objective || 'Generated script',
        editingTips: script.editingSuggestions.join('\n'),
        insights: [script.hook, script.setup, script.payoff, script.cta],
        trendId: BigInt(0),
        referenceVideos: [],
        hookType: { __kind__: 'story', story: null },
        contentType: { __kind__: 'educational', educational: null },
        contentStyle: { __kind__: 'talkingHead', talkingHead: null },
        length: '60-90s',
        complexity: Difficulty.medium,
        suggestedCaptions: [],
        adReadPotential: false,
        createdAt: BigInt(Date.now() * 1000000),
        lastEdited: BigInt(Date.now() * 1000000),
      });
      toast.success('Script saved to library');
    } catch (error) {
      toast.error('Failed to save script');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Script</CardTitle>
          <CardDescription>
            Create complete scripts with professional editing suggestions for polished content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic/Idea *</Label>
            <Input
              id="topic"
              placeholder="e.g., 5 Morning Habits for Success"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objective">Objective (Optional)</Label>
            <Textarea
              id="objective"
              placeholder="What do you want to achieve with this content?"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={2}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating Script...' : 'Generate Script'}
          </Button>
        </CardContent>
      </Card>

      {script && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <CardTitle>Generated Script</CardTitle>
                <CardDescription>Complete script with editing suggestions</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={handleSave}
                disabled={saveIdea.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">HOOK</h4>
                <p className="text-sm">{script.hook}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">SETUP</h4>
                <p className="text-sm whitespace-pre-wrap">{script.setup}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">PAYOFF</h4>
                <p className="text-sm whitespace-pre-wrap">{script.payoff}</p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">CALL-TO-ACTION</h4>
                <p className="text-sm">{script.cta}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-3">Editing Suggestions</h4>
              <ul className="space-y-2">
                {script.editingSuggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className="text-primary font-medium">{i + 1}.</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
