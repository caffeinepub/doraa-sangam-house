import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  type NewUserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    addresses : [Address];
  };

  type Address = {
    addressLabel : Text;
    street : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    phone : Text;
    isDefault : Bool;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal.Principal, OldUserProfile>;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal.Principal, NewUserProfile>;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal.Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          oldProfile with
          addresses = [];
        };
      }
    );
    { userProfiles = newUserProfiles };
  };
};
