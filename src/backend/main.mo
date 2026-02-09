import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Types
  // User Profile, Trend, Idea, Hook, Caption, Script, CalendarEntry, and related enums

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

  // State Management
  // Access control state for role-based authentication
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Maps for storing data by principal (user)
  let userProfiles = Map.empty<Principal, UserProfile>();
  let userTrends = Map.empty<Principal, [Trend]>();
  let userVideoIdeas = Map.empty<Principal, [VideoIdea]>();
  let userVideoHooks = Map.empty<Principal, [VideoHook]>();
  let userStoryIdeas = Map.empty<Principal, [StoryIdea]>();
  let userCalendarPosts = Map.empty<Principal, [CalendarPost]>();

  // Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view their profile");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    _checkOwnershipOrAdmin(user, caller, "view");
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

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

  // Helper Functions
  func _checkOwnershipOrAdmin(resourceOwner : Principal, caller : Principal, action : Text) {
    if (resourceOwner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only the resource owner or admin can " # action);
    };
  };
};
