// Local type definitions for frontend (backend is empty after migration)
export interface Product {
  id: bigint;
  name: string;
  description: string;
  price: bigint;
  stock: bigint;
  imageUrl: string;
}

export interface CartItem {
  productId: bigint;
  quantity: bigint;
}

export interface Cart {
  principal: any;
  items: CartItem[];
}

export interface Order {
  id: bigint;
  principal: any;
  items: CartItem[];
  total: bigint;
  status: string;
}

// Extended types for dummy commerce
export interface ExtendedProduct extends Product {
  images?: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  sizes?: { size: string; bust: string; waist: string; length: string }[];
  blouseSuggestions?: { name: string; price: number; imageUrl: string }[];
}
