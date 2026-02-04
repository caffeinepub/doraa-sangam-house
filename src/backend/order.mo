module {
  public type ShippingAddress = {
    name : Text;
    street : Text;
    city : Text;
    state : Text;
    postalCode : Text;
    country : Text;
    phone : Text;
  };

  public type OrderRecord = {
    orderId : Text;
    paymentId : Text;
    shippingAddress : ShippingAddress;
    status : Text;
    timestamp : Nat;
  };

  public func createOrderRecord(
    orderId : Text,
    paymentId : Text,
    shippingAddress : ShippingAddress,
  ) : OrderRecord {
    {
      orderId;
      paymentId;
      shippingAddress;
      status = "paid";
      timestamp = 1712411343000;
    };
  };
};
