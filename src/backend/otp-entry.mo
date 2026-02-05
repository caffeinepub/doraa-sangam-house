import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public type OtpEntry = {
    otp : Text;
    expiryTimestamp : Time.Time;
    requestingPrincipal : Principal.Principal;
  };
};
