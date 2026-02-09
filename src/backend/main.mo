import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

import Migration "migration";

// Adding migration support
(with migration = Migration.run)
actor {
  // Types
  // Old types for content management (already stored in persistent actor state)
  public type ContentCategory = {
    #educational;
    #entertainment;
    #storytime;
    #behindTheScenes;
    #productDemo;
    #tutorial;
    #testimonial;
    #challenge;
    #trend;
    #other : Text;
  };

  public type ContentStyle = {
    #talkingHead;
    #bRoll;
    #voiceover;
    #skit;
    #animation;
    #interview;
    #meme;
    #comparison;
    #review;
    #caseStudy;
    #qna;
    #other : Text;
  };

  public type HookType = {
    #curiosity;
    #contrarian;
    #authority;
    #story;
    #quickWin;
    #painPoint;
    #challenge;
    #trend;
    #shockValue;
    #nostalgia;
    #other : Text;
  };

  public type TrendCategory = {
    #music;
    #soundEffect;
    #visualEffect;
    #hashtag;
    #challenge;
    #format;
    #meme;
    #topic;
    #product;
    #creatorStyle;
    #editTechnique;
    #algorithmShift;
    #series;
    #other : Text;
  };

  public type Difficulty = {
    #easy;
    #medium;
    #hard;
    #expert;
  };

  public type PostStatus = {
    #draft;
    #scheduled;
    #published;
    #archived;
  };

  public type UserProfile = {
    name : Text;
    bio : Text;
    niche : Text;
    targetAudience : Text;
    contentStyle : [ContentStyle];
    contentCategory : [ContentCategory];
    postingFrequency : Nat;
    goals : Text;
    createdAt : Int;
  };

  public type Trend = {
    id : Nat;
    title : Text;
    category : TrendCategory;
    description : Text;
    difficulty : Difficulty;
    viralPotential : Nat;
    relevanceScore : Nat;
    trendScore : Nat;
    analyzedHashtagPerformance : [Text];
    referenceVideos : [Text];
    soundClip : ?Text;
    trendAlertSource : Text;
    createdAt : Int;
    lastChecked : Int;
    isActive : Bool;
  };

  public type VideoIdea = {
    id : Nat;
    title : Text;
    trendId : Nat;
    referenceVideos : [Text];
    hookType : HookType;
    editingTips : Text;
    contentType : ContentCategory;
    contentStyle : ContentStyle;
    length : Text;
    complexity : Difficulty;
    objectives : Text;
    suggestedCaptions : [Text];
    adReadPotential : Bool;
    insights : [Text];
    createdAt : Int;
    lastEdited : Int;
    conversionRate : ?Nat;
    engagementRate : ?Nat;
  };

  public type VideoHook = {
    id : Nat;
    content : Text;
    trendId : Nat;
    videoId : Nat;
    hookType : HookType;
    videoCategory : ContentCategory;
    difficulty : Difficulty;
    performanceRating : ?Nat;
    isViral : Bool;
    createdAt : Int;
  };

  public type StoryIdea = {
    id : Nat;
    mainText : Text;
    supportingPoints : [Text];
    endGoal : Text;
    trendId : Nat;
    videoId : Nat;
    hookId : Nat;
    deliveryStyle : ContentStyle;
    audience : Text;
    engagementRate : ?Nat;
    conversionRate : ?Nat;
    isViral : Bool;
    createdAt : Int;
  };

  public type CalendarPost = {
    id : Nat;
    title : Text;
    contentType : ContentCategory;
    contentStyle : ContentStyle;
    objective : Text;
    videoIdeaId : ?Nat;
    hookId : ?Nat;
    trendId : ?Nat;
    storyId : ?Nat;
    theme : Text;
    format : Text;
    postTime : Int;
    postStatus : PostStatus;
    platform : Text;
    engagementGoal : Text;
    createdAt : Int;
    lastUpdated : Int;
    suggestedCaptions : [Text];
  };

  // New Monetization features types
  // Monetization Offer
  public type MonetizationOffer = {
    id : Nat;
    title : Text;
    targetCustomer : Text;
    problemSolved : Text;
    deliverables : [Text];
    priceRange : Text;
    cta : Text;
    fulfillmentNotes : Text;
    createdAt : Int;
    lastUpdated : Int;
  };

  // Brand Pitch
  public type BrandPitch = {
    id : Nat;
    brandName : Text;
    product : Text;
    collaborationType : Text;
    desiredOutcome : Text;
    shortPitchDM : Text;
    emailPitch : Text;
    followUpMessages : [Text];
    createdAt : Int;
    lastUpdated : Int;
  };

  // Media Kit
  public type MediaKit = {
    id : Nat;
    userProfile : UserProfile;
    handles : [Text];
    contentNiches : [Text];
    audienceDescription : Text;
    contentPillars : [Text];
    sampleDeliverables : [Text];
    contactEmail : Text;
    createdAt : Int;
    lastUpdated : Int;
  };

  // Revenue Entry
  public type RevenueEntry = {
    id : Nat;
    date : Text;
    sourceType : RevenueSourceType;
    amount : Float;
    notes : Text;
    createdAt : Int;
  };

  public type RevenueSourceType = {
    #affiliate;
    #brand;
    #service;
    #product;
    #other : Text;
  };

  public type RevenueGoal = {
    id : Nat;
    month : Text;
    goalAmount : Float;
    achievedAmount : Float;
    createdAt : Int;
    lastUpdated : Int;
  };

  // View Ads To Unlock (monetization)
  public type ViewAdsUnlockState = {
    credits : Nat;
  };

  // Map persistent state
  let viewAdsUnlockMap = Map.empty<Principal, ViewAdsUnlockState>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Maps for persistent data (already in actor state)
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userTrends = Map.empty<Principal, [Trend]>();
  let userVideoIdeas = Map.empty<Principal, [VideoIdea]>();
  let userVideoHooks = Map.empty<Principal, [VideoHook]>();
  let userStoryIdeas = Map.empty<Principal, [StoryIdea]>();
  let userCalendarPosts = Map.empty<Principal, [CalendarPost]>();

  // New persistent maps for Monetization features
  let userMonetizationOffers = Map.empty<Principal, [MonetizationOffer]>();
  let userBrandPitches = Map.empty<Principal, [BrandPitch]>();
  let userMediaKits = Map.empty<Principal, [MediaKit]>();
  let userRevenueEntries = Map.empty<Principal, [RevenueEntry]>();
  let userRevenueGoals = Map.empty<Principal, [RevenueGoal]>();

  // ID Management
  var nextMonetizationOfferId = 1;
  var nextBrandPitchId = 1;
  var nextMediaKitId = 1;
  var nextRevenueEntryId = 1;
  var nextRevenueGoalId = 1;

  // Helpers for time
  func getCurrentTimestamp() : Int {
    Time.now();
  };

  func getCreditsInternal(principal : Principal) : Nat {
    switch (viewAdsUnlockMap.get(principal)) {
      case (?unlocks) { unlocks.credits };
      case (null) { 0 };
    };
  };

  func decrementInternal(principal : Principal) {
    let credits = getCreditsInternal(principal);
    if (credits == 0) {
      Runtime.trap("No credits left! Watch an ad to unlock more.");
    };
    let newCredits = credits - 1;
    viewAdsUnlockMap.add(principal, { credits = newCredits });
  };

  // Public interface
  public query ({ caller }) func getCredits() : async Nat {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view credits");
    };
    getCreditsInternal(caller);
  };

  // ADMIN ONLY: This function simulates the ad network callback after user watches ad
  // In production, this would be called by a verified ad network backend
  public shared ({ caller }) func addCredits(user : Principal, amount : Nat) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can add credits");
    };
    let currentCredits = getCreditsInternal(user);
    viewAdsUnlockMap.add(user, { credits = currentCredits + amount });
  };

  // Profile Management (unchanged - free tier)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Monetization Offer Management - PREMIUM (requires credits)
  public query ({ caller }) func getUserMonetizationOffers() : async [MonetizationOffer] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access monetization offers");
    };
    switch (userMonetizationOffers.get(caller)) {
      case (?offers) { offers };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMonetizationOffer(user : Principal, offerId : Nat) : async ?MonetizationOffer {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own monetization offers");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access monetization offers");
    };
    switch (userMonetizationOffers.get(user)) {
      case (?offers) {
        offers.find(func(offer) { offer.id == offerId });
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getAllMonetizationOffers(user : Principal) : async [MonetizationOffer] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own monetization offers");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access monetization offers");
    };
    switch (userMonetizationOffers.get(user)) {
      case (?offers) { offers };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMonetizationOffersForUser(user : Principal) : async [MonetizationOffer] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own monetization offers");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access monetization offers");
    };
    switch (userMonetizationOffers.get(user)) {
      case (?offers) { offers };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveMonetizationOffer(offer : MonetizationOffer) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save monetization offers");
    };
    // PREMIUM FEATURE: Consume 1 credit
    decrementInternal(caller);

    let updatedOffer = {
      offer with
      id = nextMonetizationOfferId;
      createdAt = getCurrentTimestamp();
      lastUpdated = getCurrentTimestamp();
    };
    nextMonetizationOfferId += 1;

    let offers = switch (userMonetizationOffers.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userMonetizationOffers.add(caller, offers.concat([updatedOffer]));
  };

  public shared ({ caller }) func updateMonetizationOffer(offerId : Nat, updatedOffer : MonetizationOffer) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update monetization offers");
    };
    let existingOffers = switch (userMonetizationOffers.get(caller)) {
      case (?offers) { offers };
      case (null) { [] };
    };

    if (existingOffers.find(func(offer) { offer.id == offerId }) == null) {
      Runtime.trap("Offer not found");
    };

    let updatedOffers = existingOffers.map(
      func(offer) {
        if (offer.id == offerId) {
          {
            updatedOffer with
            id = offerId;
            lastUpdated = getCurrentTimestamp();
          };
        } else {
          offer;
        };
      }
    );
    userMonetizationOffers.add(caller, updatedOffers);
  };

  // Brand Pitch Management - PREMIUM (requires credits)
  public query ({ caller }) func getUserBrandPitches() : async [BrandPitch] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access brand pitches");
    };
    switch (userBrandPitches.get(caller)) {
      case (?pitches) { pitches };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getBrandPitch(user : Principal, pitchId : Nat) : async ?BrandPitch {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own brand pitches");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access brand pitches");
    };
    switch (userBrandPitches.get(user)) {
      case (?pitches) {
        pitches.find(func(pitch) { pitch.id == pitchId });
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getBrandPitchesForUser(user : Principal) : async [BrandPitch] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own brand pitches");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access brand pitches");
    };
    switch (userBrandPitches.get(user)) {
      case (?pitches) { pitches };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveBrandPitch(pitch : BrandPitch) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save brand pitches");
    };
    // PREMIUM FEATURE: Consume 1 credit
    decrementInternal(caller);

    let updatedPitch = {
      pitch with
      id = nextBrandPitchId;
      createdAt = getCurrentTimestamp();
      lastUpdated = getCurrentTimestamp();
    };
    nextBrandPitchId += 1;

    let pitches = switch (userBrandPitches.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userBrandPitches.add(caller, pitches.concat([updatedPitch]));
  };

  public shared ({ caller }) func updateBrandPitch(pitchId : Nat, updatedPitch : BrandPitch) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update brand pitches");
    };
    let existingPitches = switch (userBrandPitches.get(caller)) {
      case (?pitches) { pitches };
      case (null) { [] };
    };

    if (existingPitches.find(func(pitch) { pitch.id == pitchId }) == null) {
      Runtime.trap("Pitch not found");
    };

    let updatedPitches = existingPitches.map(
      func(pitch) {
        if (pitch.id == pitchId) {
          {
            updatedPitch with
            id = pitchId;
            lastUpdated = getCurrentTimestamp();
          };
        } else {
          pitch;
        };
      }
    );
    userBrandPitches.add(caller, updatedPitches);
  };

  // Media Kit Management - PREMIUM (requires credits)
  public query ({ caller }) func getUserMediaKits() : async [MediaKit] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access media kits");
    };
    switch (userMediaKits.get(caller)) {
      case (?kits) { kits };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMediaKit(user : Principal, kitId : Nat) : async ?MediaKit {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own media kits");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access media kits");
    };
    switch (userMediaKits.get(user)) {
      case (?kits) {
        kits.find(func(kit) { kit.id == kitId });
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getMediaKitsForUser(user : Principal) : async [MediaKit] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own media kits");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access media kits");
    };
    switch (userMediaKits.get(user)) {
      case (?kits) { kits };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveMediaKit(kit : MediaKit) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save media kits");
    };
    // PREMIUM FEATURE: Consume 1 credit
    decrementInternal(caller);

    let updatedKit = {
      kit with
      id = nextMediaKitId;
      createdAt = getCurrentTimestamp();
      lastUpdated = getCurrentTimestamp();
    };
    nextMediaKitId += 1;

    let kits = switch (userMediaKits.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userMediaKits.add(caller, kits.concat([updatedKit]));
  };

  public shared ({ caller }) func updateMediaKit(kitId : Nat, updatedKit : MediaKit) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update media kits");
    };
    let existingKits = switch (userMediaKits.get(caller)) {
      case (?kits) { kits };
      case (null) { [] };
    };

    if (existingKits.find(func(kit) { kit.id == kitId }) == null) {
      Runtime.trap("Media kit not found");
    };

    let updatedKits = existingKits.map(
      func(kit) {
        if (kit.id == kitId) {
          {
            updatedKit with
            id = kitId;
            lastUpdated = getCurrentTimestamp();
          };
        } else {
          kit;
        };
      }
    );
    userMediaKits.add(caller, updatedKits);
  };

  // Revenue Tracking - PREMIUM (requires credits)
  public query ({ caller }) func getUserRevenueEntries() : async [RevenueEntry] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access revenue entries");
    };
    switch (userRevenueEntries.get(caller)) {
      case (?entries) { entries };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getRevenueEntry(user : Principal, entryId : Nat) : async ?RevenueEntry {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own revenue entries");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access revenue entries");
    };
    switch (userRevenueEntries.get(user)) {
      case (?entries) {
        entries.find(func(entry) { entry.id == entryId });
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func saveRevenueEntry(entry : RevenueEntry) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save revenue entries");
    };
    // PREMIUM FEATURE: Consume 1 credit
    decrementInternal(caller);

    let updatedEntry = {
      entry with
      id = nextRevenueEntryId;
      createdAt = getCurrentTimestamp();
    };
    nextRevenueEntryId += 1;

    let entries = switch (userRevenueEntries.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userRevenueEntries.add(caller, entries.concat([updatedEntry]));
  };

  // Revenue Goals - PREMIUM (requires credits)
  public query ({ caller }) func getUserRevenueGoals() : async [RevenueGoal] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access revenue goals");
    };
    switch (userRevenueGoals.get(caller)) {
      case (?goals) { goals };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getRevenueGoal(user : Principal, goalId : Nat) : async ?RevenueGoal {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own revenue goals");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access revenue goals");
    };
    switch (userRevenueGoals.get(user)) {
      case (?goals) {
        goals.find(func(goal) { goal.id == goalId });
      };
      case (null) { null };
    };
  };

  public shared ({ caller }) func saveRevenueGoal(goal : RevenueGoal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save revenue goals");
    };
    // PREMIUM FEATURE: Consume 1 credit
    decrementInternal(caller);

    let updatedGoal = {
      goal with
      id = nextRevenueGoalId;
      createdAt = getCurrentTimestamp();
      lastUpdated = getCurrentTimestamp();
    };
    nextRevenueGoalId += 1;

    let goals = switch (userRevenueGoals.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userRevenueGoals.add(caller, goals.concat([updatedGoal]));
  };

  public shared ({ caller }) func updateRevenueGoal(goalId : Nat, updatedGoal : RevenueGoal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update revenue goals");
    };
    let existingGoals = switch (userRevenueGoals.get(caller)) {
      case (?goals) { goals };
      case (null) { [] };
    };

    if (existingGoals.find(func(goal) { goal.id == goalId }) == null) {
      Runtime.trap("Goal not found");
    };

    let updatedGoals = existingGoals.map(
      func(goal) {
        if (goal.id == goalId) {
          {
            updatedGoal with
            id = goalId;
            lastUpdated = getCurrentTimestamp();
          };
        } else {
          goal;
        };
      }
    );
    userRevenueGoals.add(caller, updatedGoals);
  };

  public query ({ caller }) func getRevenueGoalsForUser(user : Principal) : async [RevenueGoal] {
    if (user != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own revenue goals");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access revenue goals");
    };
    switch (userRevenueGoals.get(user)) {
      case (?goals) { goals };
      case (null) { [] };
    };
  };

  // Old Content Management Methods (FREE TIER - no credits required)
  // Trend Management
  public query ({ caller }) func getUserTrends() : async [Trend] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access trends");
    };
    switch (userTrends.get(caller)) {
      case (?trends) { trends };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveTrend(trend : Trend) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save trends");
    };
    let trends = switch (userTrends.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userTrends.add(caller, trends.concat([trend]));
  };

  // Video Idea Management
  public query ({ caller }) func getUserVideoIdeas() : async [VideoIdea] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access video ideas");
    };
    switch (userVideoIdeas.get(caller)) {
      case (?videoIdeas) { videoIdeas };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveVideoIdea(videoIdea : VideoIdea) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save video ideas");
    };
    let videoIdeas = switch (userVideoIdeas.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userVideoIdeas.add(caller, videoIdeas.concat([videoIdea]));
  };

  // Video Hook Management
  public query ({ caller }) func getUserVideoHooks() : async [VideoHook] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access video hooks");
    };
    switch (userVideoHooks.get(caller)) {
      case (?videoHooks) { videoHooks };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveVideoHook(videoHook : VideoHook) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save video hooks");
    };
    let videoHooks = switch (userVideoHooks.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userVideoHooks.add(caller, videoHooks.concat([videoHook]));
  };

  // Story Idea Management
  public query ({ caller }) func getUserStoryIdeas() : async [StoryIdea] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access story ideas");
    };
    switch (userStoryIdeas.get(caller)) {
      case (?storyIdeas) { storyIdeas };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveStoryIdea(storyIdea : StoryIdea) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save story ideas");
    };
    let storyIdeas = switch (userStoryIdeas.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userStoryIdeas.add(caller, storyIdeas.concat([storyIdea]));
  };

  // Calendar Post Management
  public query ({ caller }) func getUserCalendarPosts() : async [CalendarPost] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can access calendar posts");
    };
    switch (userCalendarPosts.get(caller)) {
      case (?calendarPosts) { calendarPosts };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func saveCalendarPost(calendarPost : CalendarPost) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save calendar posts");
    };
    let calendarPosts = switch (userCalendarPosts.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };
    userCalendarPosts.add(caller, calendarPosts.concat([calendarPost]));
  };
};
