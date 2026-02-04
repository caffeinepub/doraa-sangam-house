import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { StorefrontProduct } from '../types';
import { useCommerce } from './useCommerce';
import type { OrderRecord, ShippingAddress, Product as BackendProduct } from '../backend';
import { toast } from 'sonner';

/**
 * Convert backend Product to StorefrontProduct
 */
function backendToStorefrontProduct(backendProduct: BackendProduct): StorefrontProduct {
  // Extract unique colors and sizes from variants
  const colors = Array.from(new Set(backendProduct.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(backendProduct.variants.map((v) => v.size)));

  // Convert image URLs to StorefrontProduct format
  const images = backendProduct.images.map((url, index) => ({
    id: `img-${index}`,
    url,
  }));

  // Convert price from bigint to number
  const price = Number(backendProduct.price);

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    description: backendProduct.description,
    price,
    fabric: backendProduct.fabric,
    categoryId: backendProduct.category,
    colors,
    sizes,
    blousePairing: backendProduct.blousePair,
    images,
    rating: 4.2 + Math.random() * 0.6, // 4.2-4.8
    reviewCount: Math.floor(Math.random() * 2000) + 100, // 100-2100
    createdAt: Date.now(),
  };
}

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<StorefrontProduct[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      
      try {
        const backendProducts = await actor.publicListProducts();
        return backendProducts.map(backendToStorefrontProduct);
      } catch (error: any) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products', {
          description: 'Could not fetch products from the backend.',
        });
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30000, // Cache for 30 seconds
  });
}

export function useGetProduct(id: string) {
  const { data: products } = useGetAllProducts();

  return useQuery<StorefrontProduct | null>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!products) return null;
      return products.find((p) => p.id === id) || null;
    },
    enabled: !!id && !!products,
  });
}

export function useGetProductsByCategory(categoryId: string) {
  const { data: products } = useGetAllProducts();

  return useQuery<StorefrontProduct[]>({
    queryKey: ['products', 'category', categoryId],
    queryFn: async () => {
      if (!products) return [];
      return products.filter((p) => p.categoryId === categoryId);
    },
    enabled: !!categoryId && !!products,
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

export interface CheckoutData {
  paymentId: string;
  shippingAddress: ShippingAddress;
}

export function useCheckout() {
  const { actor } = useActor();
  const { clearCart } = useCommerce();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckoutData) => {
      if (!actor) throw new Error('Actor not available');
      
      const orderId = `ORD-${Date.now()}`;
      
      // Create order in backend
      await actor.createOrder(orderId, data.paymentId, data.shippingAddress);
      
      // Clear cart after successful order creation
      clearCart();
      
      return { success: true, orderId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useGetOrders() {
  const { actor, isFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      if (!actor) return [];
      const orders = await actor.getUserOrders();
      return orders;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersByYearMonth(year: number | null, month: number | null) {
  const { actor, isFetching } = useActor();

  return useQuery<OrderRecord[]>({
    queryKey: ['orders', 'filtered', year, month],
    queryFn: async () => {
      if (!actor) return [];
      
      if (year && month) {
        const orders = await actor.getUserOrdersByYearMonth(BigInt(year), BigInt(month));
        return orders;
      }
      
      // Return all orders if no filter
      const orders = await actor.getUserOrders();
      return orders;
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
