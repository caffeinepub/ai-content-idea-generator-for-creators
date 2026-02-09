import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Save } from 'lucide-react';
import { generateReelIdeas } from '../../lib/reelIdeasGenerator';
import { useSaveVideoIdea } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { VideoIdea } from '../../backend';

export default function ReelIdeasGenerator() {
  const [niche, setNiche] = useState('');
  const [audience, setAudience] = useState('');
  const [style, setStyle] = useState('talkingHead');
  const [length, setLength] = useState('30-60s');
  const [cta, setCta] = useState('');
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveIdea = useSaveVideoIdea();

  const handleGenerate = () => {
    if (!niche.trim()) {
      toast.error('Please enter your niche/topic');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateReelIdeas({
        niche: niche.trim(),
        audience: audience.trim(),
        style,
        length,
        cta: cta.trim(),
      });
      setIdeas(generated);
      setIsGenerating(false);
      toast.success(`Generated ${generated.length} reel ideas!`);
    }, 1500);
  };

  const handleSave = async (idea: VideoIdea) => {
    try {
      await saveIdea.mutateAsync(idea);
      toast.success('Reel idea saved to library');
    } catch (error) {
      toast.error('Failed to save idea');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Reel Ideas</CardTitle>
          <CardDescription>
            Create viral Instagram reel concepts tailored to your niche and audience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="niche">Niche/Topic *</Label>
              <Input
                id="niche"
                placeholder="e.g., Fitness, Tech Reviews, Cooking"
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience</Label>
              <Input
                id="audience"
                placeholder="e.g., Young professionals, Students"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="style">Content Style</Label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger id="style">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="talkingHead">Talking Head</SelectItem>
                  <SelectItem value="bRoll">B-Roll</SelectItem>
                  <SelectItem value="voiceover">Voiceover</SelectItem>
                  <SelectItem value="skit">Skit</SelectItem>
                  <SelectItem value="tutorial">Tutorial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Desired Length</Label>
              <Select value={length} onValueChange={setLength}>
                <SelectTrigger id="length">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15-30s">15-30 seconds</SelectItem>
                  <SelectItem value="30-60s">30-60 seconds</SelectItem>
                  <SelectItem value="60-90s">60-90 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cta">Call-to-Action (Optional)</Label>
            <Input
              id="cta"
              placeholder="e.g., Follow for more tips, Link in bio"
              value={cta}
              onChange={(e) => setCta(e.target.value)}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating Ideas...' : 'Generate Reel Ideas'}
          </Button>
        </CardContent>
      </Card>

      {ideas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Ideas ({ideas.length})</h3>
          {ideas.map((idea) => (
            <Card key={Number(idea.id)}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <CardDescription>{idea.objectives}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSave(idea)}
                    disabled={saveIdea.isPending}
                    className="gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Key Beats:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {idea.insights.map((beat, i) => (
                      <li key={i}>{beat}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Editing Tips:</h4>
                  <p className="text-sm text-muted-foreground">{idea.editingTips}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{idea.length}</Badge>
                  <Badge variant="outline">
                    {typeof idea.contentStyle === 'object' && '__kind__' in idea.contentStyle
                      ? idea.contentStyle.__kind__
                      : 'other'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
