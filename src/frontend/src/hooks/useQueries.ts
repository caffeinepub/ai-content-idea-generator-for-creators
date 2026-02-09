import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  VideoIdea,
  VideoHook,
  StoryIdea,
  Trend,
  CalendarPost,
  MonetizationOffer,
  BrandPitch,
  MediaKit,
  RevenueEntry,
  RevenueGoal,
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

// Credits Queries
export function useGetCredits() {
  const { actor, isFetching } = useActor();

  return useQuery<bigint>({
    queryKey: ['credits'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getCredits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddCredits() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // In a real implementation, this would be called by the ad network
      // For now, we simulate granting 1 credit after watching an ad
      const identity = await actor.getCallerUserProfile();
      if (!identity) throw new Error('User not authenticated');
      // This is a workaround since we can't call addCredits directly (admin only)
      // The backend should have a user-callable method for this
      throw new Error('Backend missing user-callable grantCreditsAfterAd method');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] });
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

// Monetization Offers Queries
export function useGetUserMonetizationOffers() {
  const { actor, isFetching } = useActor();

  return useQuery<MonetizationOffer[]>({
    queryKey: ['monetizationOffers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserMonetizationOffers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMonetizationOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (offer: MonetizationOffer) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveMonetizationOffer(offer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monetizationOffers'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

export function useUpdateMonetizationOffer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      offerId,
      updatedOffer,
    }: {
      offerId: bigint;
      updatedOffer: MonetizationOffer;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMonetizationOffer(offerId, updatedOffer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monetizationOffers'] });
    },
  });
}

// Brand Pitches Queries
export function useGetUserBrandPitches() {
  const { actor, isFetching } = useActor();

  return useQuery<BrandPitch[]>({
    queryKey: ['brandPitches'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserBrandPitches();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveBrandPitch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (pitch: BrandPitch) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveBrandPitch(pitch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandPitches'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

export function useUpdateBrandPitch() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pitchId,
      updatedPitch,
    }: {
      pitchId: bigint;
      updatedPitch: BrandPitch;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBrandPitch(pitchId, updatedPitch);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brandPitches'] });
    },
  });
}

// Media Kits Queries
export function useGetUserMediaKits() {
  const { actor, isFetching } = useActor();

  return useQuery<MediaKit[]>({
    queryKey: ['mediaKits'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserMediaKits();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveMediaKit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kit: MediaKit) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveMediaKit(kit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaKits'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

export function useUpdateMediaKit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      kitId,
      updatedKit,
    }: {
      kitId: bigint;
      updatedKit: MediaKit;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMediaKit(kitId, updatedKit);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mediaKits'] });
    },
  });
}

// Revenue Entries Queries
export function useGetUserRevenueEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<RevenueEntry[]>({
    queryKey: ['revenueEntries'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserRevenueEntries();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveRevenueEntry() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (entry: RevenueEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveRevenueEntry(entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueEntries'] });
      queryClient.invalidateQueries({ queryKey: ['revenueGoals'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

// Revenue Goals Queries
export function useGetUserRevenueGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<RevenueGoal[]>({
    queryKey: ['revenueGoals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserRevenueGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSaveRevenueGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goal: RevenueGoal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveRevenueGoal(goal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueGoals'] });
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
  });
}

export function useUpdateRevenueGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      updatedGoal,
    }: {
      goalId: bigint;
      updatedGoal: RevenueGoal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateRevenueGoal(goalId, updatedGoal);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revenueGoals'] });
    },
  });
}
