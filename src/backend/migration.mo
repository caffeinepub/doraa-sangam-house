import Map "mo:core/Map";
import Text "mo:core/Text";
import Nat "mo:core/Nat";

module {
  type OldProduct = {
    id : Text;
    name : Text;
    price : Nat;
    description : Text;
    images : [Text];
    fabric : Text;
    variants : [OldVariant];
    blousePair : Text;
    category : Text;
  };

  type OldVariant = {
    color : Text;
    size : Text;
  };

  type OldActor = {
    products : Map.Map<Text, OldProduct>;
    nextProductId : Nat;
  };

  type NewProduct = {
    id : Text;
    name : Text;
    price : Nat;
    description : Text;
    images : [Text];
    fabric : Text;
    variants : [NewVariant];
    blousePair : Text;
    category : Text;
  };

  type NewVariant = {
    color : Text;
    size : Text;
  };

  type NewActor = {
    products : Map.Map<Text, NewProduct>;
    nextProductId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newProducts = old.products.map<Text, OldProduct, NewProduct>(
      func(_id, oldProduct) {
        {
          oldProduct with
          variants = oldProduct.variants.map<OldVariant, NewVariant>(
            func(variant) {
              {
                color = variant.color;
                size = variant.size;
              };
            }
          );
        };
      }
    );
    { old with products = newProducts };
  };
};
