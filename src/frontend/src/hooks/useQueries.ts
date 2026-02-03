import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, Cart, Order } from '../types';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import { useCommerce } from './useCommerce';

export function useGetAllProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      // Return dummy products as frontend-first implementation
      return DUMMY_PRODUCTS.map((p) => ({
        id: BigInt(p.id),
        name: p.name,
        description: p.description,
        price: BigInt(p.price),
        stock: BigInt(p.stock),
        imageUrl: p.imageUrl,
      }));
    },
    staleTime: Infinity,
  });
}

export function useGetProduct(id: string) {
  return useQuery<Product | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      const product = DUMMY_PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      return {
        id: BigInt(product.id),
        name: product.name,
        description: product.description,
        price: BigInt(product.price),
        stock: BigInt(product.stock),
        imageUrl: product.imageUrl,
      };
    },
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useGetCart() {
  const { cart, cartItemCount } = useCommerce();

  return useQuery<Cart>({
    queryKey: ['cart', cart],
    queryFn: async () => {
      return {
        principal: '' as any,
        items: cart.map((item) => ({
          productId: BigInt(item.productId),
          quantity: BigInt(item.quantity),
        })),
      };
    },
    staleTime: 0,
  });
}

export function useAddToCart() {
  const { addToCart } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: bigint | string; quantity: bigint | number }) => {
      const id = typeof productId === 'bigint' ? productId.toString() : productId.toString();
      const qty = typeof quantity === 'bigint' ? Number(quantity) : quantity;
      addToCart(id, qty);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartQuantity() {
  const { updateQuantity } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      updateQuantity(productId, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveFromCart() {
  const { removeFromCart } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      removeFromCart(productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useClearCart() {
  const { clearCart } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      clearCart();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCheckout() {
  const { clearCart } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: { name: string; email: string; address: string; phone: string }) => {
      // Simulate checkout processing
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearCart();
      return { success: true, orderId: `ORD-${Date.now()}` };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      return [];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterUser() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ name, email, address }: { name: string; email: string; address: string }) => {
      return;
    },
  });
}
