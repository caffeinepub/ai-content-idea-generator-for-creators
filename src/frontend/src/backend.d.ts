import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface VideoIdea {
    id: bigint;
    complexity: Difficulty;
    lastEdited: bigint;
    insights: Array<string>;
    title: string;
    contentType: ContentCategory;
    createdAt: bigint;
    adReadPotential: boolean;
    engagementRate?: bigint;
    referenceVideos: Array<string>;
    suggestedCaptions: Array<string>;
    contentStyle: ContentStyle;
    hookType: HookType;
    length: string;
    conversionRate?: bigint;
    trendId: bigint;
    objectives: string;
    editingTips: string;
}
export interface StoryIdea {
    id: bigint;
    endGoal: string;
    deliveryStyle: ContentStyle;
    supportingPoints: Array<string>;
    createdAt: bigint;
    audience: string;
    engagementRate?: bigint;
    mainText: string;
    conversionRate?: bigint;
    hookId: bigint;
    isViral: boolean;
    trendId: bigint;
    videoId: bigint;
}
export type TrendCategory = {
    __kind__: "music";
    music: null;
} | {
    __kind__: "soundEffect";
    soundEffect: null;
} | {
    __kind__: "topic";
    topic: null;
} | {
    __kind__: "algorithmShift";
    algorithmShift: null;
} | {
    __kind__: "hashtag";
    hashtag: null;
} | {
    __kind__: "challenge";
    challenge: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "creatorStyle";
    creatorStyle: null;
} | {
    __kind__: "editTechnique";
    editTechnique: null;
} | {
    __kind__: "meme";
    meme: null;
} | {
    __kind__: "series";
    series: null;
} | {
    __kind__: "visualEffect";
    visualEffect: null;
} | {
    __kind__: "product";
    product: null;
} | {
    __kind__: "format";
    format: null;
};
export interface MediaKit {
    id: bigint;
    contentPillars: Array<string>;
    handles: Array<string>;
    createdAt: bigint;
    lastUpdated: bigint;
    contentNiches: Array<string>;
    contactEmail: string;
    userProfile: UserProfile;
    audienceDescription: string;
    sampleDeliverables: Array<string>;
}
export interface MonetizationOffer {
    id: bigint;
    cta: string;
    title: string;
    targetCustomer: string;
    createdAt: bigint;
    lastUpdated: bigint;
    priceRange: string;
    deliverables: Array<string>;
    fulfillmentNotes: string;
    problemSolved: string;
}
export interface RevenueGoal {
    id: bigint;
    month: string;
    goalAmount: number;
    achievedAmount: number;
    createdAt: bigint;
    lastUpdated: bigint;
}
export interface RevenueEntry {
    id: bigint;
    date: string;
    createdAt: bigint;
    sourceType: RevenueSourceType;
    notes: string;
    amount: number;
}
export type RevenueSourceType = {
    __kind__: "service";
    service: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "brand";
    brand: null;
} | {
    __kind__: "affiliate";
    affiliate: null;
} | {
    __kind__: "product";
    product: null;
};
export interface BrandPitch {
    id: bigint;
    followUpMessages: Array<string>;
    shortPitchDM: string;
    createdAt: bigint;
    lastUpdated: bigint;
    brandName: string;
    desiredOutcome: string;
    emailPitch: string;
    collaborationType: string;
    product: string;
}
export interface VideoHook {
    id: bigint;
    content: string;
    performanceRating?: bigint;
    difficulty: Difficulty;
    createdAt: bigint;
    videoCategory: ContentCategory;
    hookType: HookType;
    isViral: boolean;
    trendId: bigint;
    videoId: bigint;
}
export type HookType = {
    __kind__: "trend";
    trend: null;
} | {
    __kind__: "challenge";
    challenge: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "painPoint";
    painPoint: null;
} | {
    __kind__: "curiosity";
    curiosity: null;
} | {
    __kind__: "shockValue";
    shockValue: null;
} | {
    __kind__: "quickWin";
    quickWin: null;
} | {
    __kind__: "story";
    story: null;
} | {
    __kind__: "nostalgia";
    nostalgia: null;
} | {
    __kind__: "authority";
    authority: null;
} | {
    __kind__: "contrarian";
    contrarian: null;
};
export interface Trend {
    id: bigint;
    title: string;
    viralPotential: bigint;
    difficulty: Difficulty;
    createdAt: bigint;
    soundClip?: string;
    description: string;
    referenceVideos: Array<string>;
    isActive: boolean;
    relevanceScore: bigint;
    trendScore: bigint;
    category: TrendCategory;
    analyzedHashtagPerformance: Array<string>;
    lastChecked: bigint;
    trendAlertSource: string;
}
export type ContentStyle = {
    __kind__: "qna";
    qna: null;
} | {
    __kind__: "review";
    review: null;
} | {
    __kind__: "comparison";
    comparison: null;
} | {
    __kind__: "voiceover";
    voiceover: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "interview";
    interview: null;
} | {
    __kind__: "meme";
    meme: null;
} | {
    __kind__: "animation";
    animation: null;
} | {
    __kind__: "skit";
    skit: null;
} | {
    __kind__: "caseStudy";
    caseStudy: null;
} | {
    __kind__: "bRoll";
    bRoll: null;
} | {
    __kind__: "talkingHead";
    talkingHead: null;
};
export interface CalendarPost {
    id: bigint;
    postTime: bigint;
    theme: string;
    title: string;
    contentType: ContentCategory;
    objective: string;
    storyId?: bigint;
    createdAt: bigint;
    videoIdeaId?: bigint;
    lastUpdated: bigint;
    postStatus: PostStatus;
    engagementGoal: string;
    platform: string;
    suggestedCaptions: Array<string>;
    contentStyle: ContentStyle;
    hookId?: bigint;
    trendId?: bigint;
    format: string;
}
export interface UserProfile {
    bio: string;
    name: string;
    createdAt: bigint;
    contentCategory: Array<ContentCategory>;
    contentStyle: Array<ContentStyle>;
    targetAudience: string;
    goals: string;
    niche: string;
    postingFrequency: bigint;
}
export type ContentCategory = {
    __kind__: "trend";
    trend: null;
} | {
    __kind__: "challenge";
    challenge: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "entertainment";
    entertainment: null;
} | {
    __kind__: "storytime";
    storytime: null;
} | {
    __kind__: "educational";
    educational: null;
} | {
    __kind__: "productDemo";
    productDemo: null;
} | {
    __kind__: "tutorial";
    tutorial: null;
} | {
    __kind__: "testimonial";
    testimonial: null;
} | {
    __kind__: "behindTheScenes";
    behindTheScenes: null;
};
export enum Difficulty {
    easy = "easy",
    hard = "hard",
    expert = "expert",
    medium = "medium"
}
export enum PostStatus {
    scheduled = "scheduled",
    published = "published",
    draft = "draft",
    archived = "archived"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addCredits(user: Principal, amount: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllMonetizationOffers(user: Principal): Promise<Array<MonetizationOffer>>;
    getBrandPitch(user: Principal, pitchId: bigint): Promise<BrandPitch | null>;
    getBrandPitchesForUser(user: Principal): Promise<Array<BrandPitch>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCredits(): Promise<bigint>;
    getMediaKit(user: Principal, kitId: bigint): Promise<MediaKit | null>;
    getMediaKitsForUser(user: Principal): Promise<Array<MediaKit>>;
    getMonetizationOffer(user: Principal, offerId: bigint): Promise<MonetizationOffer | null>;
    getMonetizationOffersForUser(user: Principal): Promise<Array<MonetizationOffer>>;
    getRevenueEntry(user: Principal, entryId: bigint): Promise<RevenueEntry | null>;
    getRevenueGoal(user: Principal, goalId: bigint): Promise<RevenueGoal | null>;
    getRevenueGoalsForUser(user: Principal): Promise<Array<RevenueGoal>>;
    getUserBrandPitches(): Promise<Array<BrandPitch>>;
    getUserCalendarPosts(): Promise<Array<CalendarPost>>;
    getUserMediaKits(): Promise<Array<MediaKit>>;
    getUserMonetizationOffers(): Promise<Array<MonetizationOffer>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserRevenueEntries(): Promise<Array<RevenueEntry>>;
    getUserRevenueGoals(): Promise<Array<RevenueGoal>>;
    getUserStoryIdeas(): Promise<Array<StoryIdea>>;
    getUserTrends(): Promise<Array<Trend>>;
    getUserVideoHooks(): Promise<Array<VideoHook>>;
    getUserVideoIdeas(): Promise<Array<VideoIdea>>;
    isCallerAdmin(): Promise<boolean>;
    saveBrandPitch(pitch: BrandPitch): Promise<void>;
    saveCalendarPost(calendarPost: CalendarPost): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveMediaKit(kit: MediaKit): Promise<void>;
    saveMonetizationOffer(offer: MonetizationOffer): Promise<void>;
    saveRevenueEntry(entry: RevenueEntry): Promise<void>;
    saveRevenueGoal(goal: RevenueGoal): Promise<void>;
    saveStoryIdea(storyIdea: StoryIdea): Promise<void>;
    saveTrend(trend: Trend): Promise<void>;
    saveVideoHook(videoHook: VideoHook): Promise<void>;
    saveVideoIdea(videoIdea: VideoIdea): Promise<void>;
    updateBrandPitch(pitchId: bigint, updatedPitch: BrandPitch): Promise<void>;
    updateMediaKit(kitId: bigint, updatedKit: MediaKit): Promise<void>;
    updateMonetizationOffer(offerId: bigint, updatedOffer: MonetizationOffer): Promise<void>;
    updateRevenueGoal(goalId: bigint, updatedGoal: RevenueGoal): Promise<void>;
}
