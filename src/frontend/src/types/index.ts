import { AdminProduct } from '../admin/types';

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

// Extended types for storefront commerce
export interface ExtendedProduct extends Product {
  images?: string[];
  rating?: number;
  reviewCount?: number;
  category?: string;
  sizes?: { size: string; bust: string; waist: string; length: string }[];
  blouseSuggestions?: { name: string; price: number; imageUrl: string }[];
}

// Storefront product type derived from backend products
export interface StorefrontProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  fabric: string;
  fabricCustom?: string;
  categoryId: string;
  colors: string[];
  sizes: string[];
  blousePairing: string;
  images: { id: string; url: string }[];
  rating: number;
  reviewCount: number;
  createdAt: number;
}

// Helper to convert admin product to storefront product (for backward compatibility)
export function adminToStorefrontProduct(admin: AdminProduct): StorefrontProduct {
  return {
    id: admin.id,
    name: admin.name,
    description: admin.description,
    price: admin.price,
    fabric: admin.fabric,
    fabricCustom: admin.fabricCustom,
    categoryId: admin.categoryId,
    colors: admin.colors,
    sizes: admin.sizes,
    blousePairing: admin.blousePairing,
    images: admin.images,
    rating: 4.2 + Math.random() * 0.6, // 4.2-4.8
    reviewCount: Math.floor(Math.random() * 2000) + 100, // 100-2100
    createdAt: admin.createdAt,
  };
}
