import React, { createContext, useMemo, useCallback } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CommerceContextType {
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;
  isInCart: (productId: string) => boolean;
}

export const CommerceContext = createContext<CommerceContextType | null>(null);

const STORAGE_KEY = 'doraa-admin-products';

function getStoredProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load products:', error);
  }
  return [];
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useLocalStorageState<CartItem[]>('doraa-cart', []);

  const isInCart = useCallback(
    (productId: string) => {
      return cart.some((item) => item.productId === productId);
    },
    [cart]
  );

  const addToCart = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        const existing = prev.find((item) => item.productId === productId);
        if (existing) {
          return prev.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, { productId, quantity }];
      });
    },
    [setCart]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCart((prev) => {
        if (quantity <= 0) {
          return prev.filter((item) => item.productId !== productId);
        }
        return prev.map((item) => (item.productId === productId ? { ...item, quantity } : item));
      });
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
    },
    [setCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, [setCart]);

  const cartTotal = useMemo(() => {
    const products = getStoredProducts();
    return cart.reduce((total, item) => {
      const product = products.find((p: any) => p.id === item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartItemCount,
      isInCart,
    }),
    [cart, addToCart, updateQuantity, removeFromCart, clearCart, cartTotal, cartItemCount, isInCart]
  );

  return <CommerceContext.Provider value={value}>{children}</CommerceContext.Provider>;
}
