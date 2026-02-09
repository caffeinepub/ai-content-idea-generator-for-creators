import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Copy, Save } from 'lucide-react';
import { generateCaptions } from '../../lib/captionGenerator';
import { useSaveStoryIdea } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { StoryIdea } from '../../backend';

export default function CaptionGenerator() {
  const [idea, setIdea] = useState('');
  const [keywords, setKeywords] = useState('');
  const [emojiDensity, setEmojiDensity] = useState('medium');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [captions, setCaptions] = useState<StoryIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveCaption = useSaveStoryIdea();

  const handleGenerate = () => {
    if (!idea.trim()) {
      toast.error('Please enter an idea or hook');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateCaptions({
        idea: idea.trim(),
        keywords: keywords.trim(),
        emojiDensity,
        includeHashtags,
      });
      setCaptions(generated);
      setIsGenerating(false);
      toast.success(`Generated ${generated.length} caption variants!`);
    }, 1500);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Caption copied to clipboard');
  };

  const handleSave = async (caption: StoryIdea) => {
    try {
      await saveCaption.mutateAsync(caption);
      toast.success('Caption saved to library');
    } catch (error) {
      toast.error('Failed to save caption');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Captions</CardTitle>
          <CardDescription>
            Create engaging captions with hashtags and CTAs that drive action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="idea">Idea/Hook *</Label>
            <Textarea
              id="idea"
              placeholder="Enter your content idea or hook..."
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords (Optional)</Label>
            <Input
              id="keywords"
              placeholder="e.g., fitness, motivation, transformation"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emoji">Emoji Density</Label>
              <Select value={emojiDensity} onValueChange={setEmojiDensity}>
                <SelectTrigger id="emoji">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between space-x-2 pt-8">
              <Label htmlFor="hashtags">Include Hashtags</Label>
              <Switch
                id="hashtags"
                checked={includeHashtags}
                onCheckedChange={setIncludeHashtags}
              />
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating Captions...' : 'Generate Captions'}
          </Button>
        </CardContent>
      </Card>

      {captions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Captions ({captions.length})</h3>
          {captions.map((caption) => (
            <Card key={Number(caption.id)}>
              <CardContent className="pt-6 space-y-3">
                <p className="whitespace-pre-wrap">{caption.mainText}</p>
                {caption.supportingPoints.length > 0 && (
                  <p className="text-sm text-muted-foreground">{caption.supportingPoints.join(' ')}</p>
                )}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-muted-foreground">
                    {caption.mainText.length} characters
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(caption.mainText + '\n\n' + caption.supportingPoints.join(' '))}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSave(caption)}
                      disabled={saveCaption.isPending}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
