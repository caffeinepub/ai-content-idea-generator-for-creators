import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Plus, X, Sparkles, Save } from 'lucide-react';
import { useSaveTrend, useGetUserTrends } from '../hooks/useQueries';
import { toast } from 'sonner';
import { generateTrendCandidates } from '../lib/trendGenerator';
import type { Trend } from '../backend';

export default function TrendsPage() {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [trendCandidates, setTrendCandidates] = useState<Trend[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const saveTrend = useSaveTrend();
  const { data: savedTrends = [] } = useGetUserTrends();

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !watchlist.includes(newKeyword.trim())) {
      setWatchlist([...watchlist, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setWatchlist(watchlist.filter((k) => k !== keyword));
  };

  const handleGenerateTrends = () => {
    if (watchlist.length === 0) {
      toast.error('Add at least one keyword to your watchlist');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const candidates = generateTrendCandidates(watchlist);
      setTrendCandidates(candidates);
      setIsGenerating(false);
      toast.success(`Generated ${candidates.length} trend candidates`);
    }, 1500);
  };

  const handleSaveTrend = async (trend: Trend) => {
    try {
      await saveTrend.mutateAsync(trend);
      toast.success('Trend saved to library');
    } catch (error) {
      toast.error('Failed to save trend');
    }
  };

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Trending Topics</h1>
        <p className="text-muted-foreground">
          Track trending topics in your niche and discover viral opportunities.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Watchlist</CardTitle>
            <CardDescription>Add keywords and topics to track trends in your niche.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="e.g., fitness, tech"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button onClick={handleAddKeyword} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-2">
              {watchlist.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No keywords added yet
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {watchlist.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="gap-1">
                      {keyword}
                      <button onClick={() => handleRemoveKeyword(keyword)}>
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button
              onClick={handleGenerateTrends}
              disabled={watchlist.length === 0 || isGenerating}
              className="w-full gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating ? 'Analyzing...' : 'Generate Trends'}
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trend Candidates</CardTitle>
              <CardDescription>
                {trendCandidates.length > 0
                  ? `${trendCandidates.length} trending opportunities found`
                  : 'Generate trends from your watchlist to see opportunities'}
              </CardDescription>
            </CardHeader>
          </Card>

          {trendCandidates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Add keywords to your watchlist and generate trends to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {trendCandidates.map((trend) => (
                <Card key={Number(trend.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{trend.title}</CardTitle>
                        <CardDescription>{trend.description}</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveTrend(trend)}
                        disabled={saveTrend.isPending}
                        className="gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="default">Score: {Number(trend.trendScore)}</Badge>
                      <Badge variant="secondary">
                        Viral Potential: {Number(trend.viralPotential)}/10
                      </Badge>
                      <Badge variant="outline">
                        Relevance: {Number(trend.relevanceScore)}/10
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <strong>Why it's trending:</strong> {trend.trendAlertSource}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
