import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  VideoIdea,
  VideoHook,
  StoryIdea,
  Trend,
  CalendarPost,
} from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Video Ideas Queries
export function useGetUserVideoIdeas() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoIdea[]>({
    queryKey: ['videoIdeas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserVideoIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveVideoIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoIdea: VideoIdea) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveVideoIdea(videoIdea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoIdeas'] });
    },
  });
}

// Video Hooks Queries
export function useGetUserVideoHooks() {
  const { actor, isFetching } = useActor();

  return useQuery<VideoHook[]>({
    queryKey: ['videoHooks'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserVideoHooks();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveVideoHook() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoHook: VideoHook) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveVideoHook(videoHook);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['videoHooks'] });
    },
  });
}

// Story Ideas (Captions) Queries
export function useGetUserStoryIdeas() {
  const { actor, isFetching } = useActor();

  return useQuery<StoryIdea[]>({
    queryKey: ['storyIdeas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserStoryIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveStoryIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (storyIdea: StoryIdea) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveStoryIdea(storyIdea);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storyIdeas'] });
    },
  });
}

// Trends Queries
export function useGetUserTrends() {
  const { actor, isFetching } = useActor();

  return useQuery<Trend[]>({
    queryKey: ['trends'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserTrends();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveTrend() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trend: Trend) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveTrend(trend);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trends'] });
    },
  });
}

// Calendar Posts Queries
export function useGetUserCalendarPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<CalendarPost[]>({
    queryKey: ['calendarPosts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserCalendarPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveCalendarPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (calendarPost: CalendarPost) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCalendarPost(calendarPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendarPosts'] });
      queryClient.invalidateQueries({ queryKey: ['videoIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['videoHooks'] });
      queryClient.invalidateQueries({ queryKey: ['storyIdeas'] });
      queryClient.invalidateQueries({ queryKey: ['trends'] });
    },
  });
}
