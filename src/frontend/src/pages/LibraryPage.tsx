import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, Zap, MessageSquare, FileText, TrendingUp, Trash2 } from 'lucide-react';
import {
  useGetUserVideoIdeas,
  useGetUserVideoHooks,
  useGetUserStoryIdeas,
  useGetUserTrends,
} from '../hooks/useQueries';
import { formatDistanceToNow } from 'date-fns';

export default function LibraryPage() {
  const { data: videoIdeas = [], isLoading: ideasLoading } = useGetUserVideoIdeas();
  const { data: videoHooks = [], isLoading: hooksLoading } = useGetUserVideoHooks();
  const { data: storyIdeas = [], isLoading: storiesLoading } = useGetUserStoryIdeas();
  const { data: trends = [], isLoading: trendsLoading } = useGetUserTrends();

  const isLoading = ideasLoading || hooksLoading || storiesLoading || trendsLoading;

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">Loading your library...</p>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = videoIdeas.length + videoHooks.length + storyIdeas.length + trends.length;

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <p className="text-muted-foreground">
          All your saved content ideas in one place. {totalItems} items saved.
        </p>
      </div>

      <Tabs defaultValue="ideas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="ideas" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Ideas ({videoIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="hooks" className="gap-2">
            <Zap className="h-4 w-4" />
            Hooks ({videoHooks.length})
          </TabsTrigger>
          <TabsTrigger value="captions" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Captions ({storyIdeas.length})
          </TabsTrigger>
          <TabsTrigger value="trends" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends ({trends.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ideas" className="space-y-4">
          {videoIdeas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved reel ideas yet. Start generating!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {videoIdeas.map((idea) => (
                <Card key={Number(idea.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{idea.title}</CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(Number(idea.createdAt) / 1000000, { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{idea.objectives}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{idea.length}</Badge>
                      <Badge variant="outline">
                        {typeof idea.contentType === 'object' && '__kind__' in idea.contentType
                          ? idea.contentType.__kind__
                          : 'other'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="hooks" className="space-y-4">
          {videoHooks.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved hooks yet. Start generating!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videoHooks.map((hook) => (
                <Card key={Number(hook.id)}>
                  <CardHeader>
                    <CardDescription>
                      {formatDistanceToNow(Number(hook.createdAt) / 1000000, { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm font-medium">{hook.content}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">
                        {typeof hook.hookType === 'object' && '__kind__' in hook.hookType
                          ? hook.hookType.__kind__
                          : 'other'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="captions" className="space-y-4">
          {storyIdeas.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved captions yet. Start generating!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {storyIdeas.map((story) => (
                <Card key={Number(story.id)}>
                  <CardHeader>
                    <CardDescription>
                      {formatDistanceToNow(Number(story.createdAt) / 1000000, { addSuffix: true })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm">{story.mainText}</p>
                    {story.supportingPoints.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        +{story.supportingPoints.length} supporting points
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          {trends.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No saved trends yet. Start exploring!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {trends.map((trend) => (
                <Card key={Number(trend.id)}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg">{trend.title}</CardTitle>
                        <CardDescription>
                          {formatDistanceToNow(Number(trend.createdAt) / 1000000, { addSuffix: true })}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{trend.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Score: {Number(trend.trendScore)}</Badge>
                      <Badge variant={trend.isActive ? 'default' : 'outline'}>
                        {trend.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
