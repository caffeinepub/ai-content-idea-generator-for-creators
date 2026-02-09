import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Save } from 'lucide-react';
import { generateHooks } from '../../lib/hookGenerator';
import { useSaveVideoHook } from '../../hooks/useQueries';
import { toast } from 'sonner';
import type { VideoHook } from '../../backend';

export default function HookGenerator() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('engaging');
  const [categories, setCategories] = useState<string[]>(['curiosity', 'quickWin']);
  const [hooks, setHooks] = useState<VideoHook[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveHook = useSaveVideoHook();

  const availableCategories = [
    { value: 'curiosity', label: 'Curiosity' },
    { value: 'contrarian', label: 'Contrarian' },
    { value: 'authority', label: 'Authority' },
    { value: 'story', label: 'Story' },
    { value: 'quickWin', label: 'Quick Win' },
    { value: 'painPoint', label: 'Pain Point' },
  ];

  const handleCategoryToggle = (category: string) => {
    setCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleGenerate = () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    if (categories.length === 0) {
      toast.error('Please select at least one hook category');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const generated = generateHooks({
        topic: topic.trim(),
        tone,
        categories,
      });
      setHooks(generated);
      setIsGenerating(false);
      toast.success(`Generated ${generated.length} hooks!`);
    }, 1500);
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Hook copied to clipboard');
  };

  const handleSave = async (hook: VideoHook) => {
    try {
      await saveHook.mutateAsync(hook);
      toast.success('Hook saved to library');
    } catch (error) {
      toast.error('Failed to save hook');
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Hooks</CardTitle>
          <CardDescription>
            Create attention-grabbing hooks that stop the scroll and boost engagement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic/Niche *</Label>
            <Input
              id="topic"
              placeholder="e.g., Productivity tips, Weight loss"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engaging">Engaging</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Hook Categories *</Label>
            <div className="grid grid-cols-2 gap-3">
              {availableCategories.map((cat) => (
                <div key={cat.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={cat.value}
                    checked={categories.includes(cat.value)}
                    onCheckedChange={() => handleCategoryToggle(cat.value)}
                  />
                  <label
                    htmlFor={cat.value}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {cat.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={isGenerating} className="w-full gap-2">
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating Hooks...' : 'Generate Hooks'}
          </Button>
        </CardContent>
      </Card>

      {hooks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Generated Hooks ({hooks.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {hooks.map((hook) => (
              <Card key={Number(hook.id)}>
                <CardContent className="pt-6 space-y-3">
                  <p className="font-medium">{hook.content}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <Badge variant="secondary">
                        {typeof hook.hookType === 'object' && '__kind__' in hook.hookType
                          ? hook.hookType.__kind__
                          : 'other'}
                      </Badge>
                      <Badge variant="outline">
                        {hook.content.length < 50 ? 'Short' : hook.content.length < 100 ? 'Medium' : 'Long'}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(hook.content)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(hook)}
                        disabled={saveHook.isPending}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
