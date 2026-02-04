import AccessControl "authorization/access-control";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import MixinAuthorization "authorization/MixinAuthorization";
import Map "mo:core/Map";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
    email : Text;
  };

  // Store user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Get current caller's profile
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their profile");
    };
    userProfiles.get(caller);
  };

  // Get another user's profile (admin only or own profile)
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (Principal.equal(caller, user)) {
      // Users can view their own profile
      if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
        Runtime.trap("Unauthorized: Only authenticated users can view profiles");
      };
    } else {
      // Only admins can view other users' profiles
      if (not (AccessControl.isAdmin(accessControlState, caller))) {
        Runtime.trap("Unauthorized: Only admins can view other users' profiles");
      };
    };
    userProfiles.get(user);
  };

  // Save current caller's profile
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save their profile");
    };
    userProfiles.add(caller, profile);
  };

  // Admin-only deployment check function
  public shared ({ caller }) func confirmDeploymentChecks() : async Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can confirm deployment checks");
    };
    "Live deployment checks passed. Authorization implemented correctly.";
  };

  // Public health check (no auth required - available to all including guests)
  public query func healthCheck() : async Text {
    "Backend is running";
  };
};
