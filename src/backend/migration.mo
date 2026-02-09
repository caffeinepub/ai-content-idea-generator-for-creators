import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";

module {
  type OldActor = {};
  type NewActor = { viewAdsUnlockMap : Map.Map<Principal, { credits : Nat }> };

  public func run(old : OldActor) : NewActor {
    { viewAdsUnlockMap = Map.empty<Principal, { credits : Nat }>() };
  };
};
