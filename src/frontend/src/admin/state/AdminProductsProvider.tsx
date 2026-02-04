import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminProduct, AdminProductFormData } from '../types';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { adminFormToBackendProduct, backendProductToAdmin } from '../utils/productMappings';
import { toast } from 'sonner';

interface AdminProductsContextValue {
  products: AdminProduct[];
  isLoading: boolean;
  error: string | null;
  createProduct: (data: AdminProductFormData) => Promise<AdminProduct>;
  updateProduct: (id: string, data: AdminProductFormData) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  bulkCreateProducts: (dataArray: AdminProductFormData[]) => Promise<number>;
  refreshProducts: () => Promise<void>;
}

const AdminProductsContext = createContext<AdminProductsContextValue | undefined>(undefined);

export function AdminProductsProvider({ children }: { children: React.ReactNode }) {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load products from canister on mount
  const loadProducts = useCallback(async () => {
    if (!actor || actorFetching) return;

    try {
      setIsLoading(true);
      setError(null);
      const backendProducts = await actor.adminListProducts();
      const adminProducts = backendProducts.map(backendProductToAdmin);
      setProducts(adminProducts);
    } catch (err: any) {
      console.error('Failed to load products:', err);
      setError(err.message || 'Failed to load products from canister');
      toast.error('Failed to load products', {
        description: 'Could not fetch products from the backend. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [actor, actorFetching]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const refreshProducts = useCallback(async () => {
    await loadProducts();
    // Invalidate storefront products query
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [loadProducts, queryClient]);

  const createProduct = useCallback(
    async (data: AdminProductFormData): Promise<AdminProduct> => {
      if (!actor) throw new Error('Actor not available');

      try {
        const backendPayload = adminFormToBackendProduct(data);
        
        const productId = await actor.adminAddProduct(
          backendPayload.name,
          backendPayload.price,
          backendPayload.description,
          backendPayload.images,
          backendPayload.fabric,
          backendPayload.variants,
          backendPayload.blousePair,
          backendPayload.category
        );

        // Refresh products list
        await refreshProducts();

        // Find the newly created product
        const newProduct = products.find((p) => p.id === productId);
        if (!newProduct) {
          throw new Error('Product created but not found in list');
        }

        toast.success('Product created successfully');
        return newProduct;
      } catch (err: any) {
        console.error('Failed to create product:', err);
        toast.error('Failed to create product', {
          description: err.message || 'Could not save product to the backend.',
        });
        throw err;
      }
    },
    [actor, refreshProducts, products]
  );

  const updateProduct = useCallback(
    async (id: string, data: AdminProductFormData) => {
      if (!actor) throw new Error('Actor not available');

      try {
        const backendPayload = adminFormToBackendProduct(data, id);
        
        await actor.adminUpdateProduct(
          id,
          backendPayload.name,
          backendPayload.price,
          backendPayload.description,
          backendPayload.images,
          backendPayload.fabric,
          backendPayload.variants,
          backendPayload.blousePair,
          backendPayload.category
        );

        // Refresh products list
        await refreshProducts();

        toast.success('Product updated successfully');
      } catch (err: any) {
        console.error('Failed to update product:', err);
        toast.error('Failed to update product', {
          description: err.message || 'Could not save changes to the backend.',
        });
        throw err;
      }
    },
    [actor, refreshProducts]
  );

  const deleteProduct = useCallback(
    async (id: string) => {
      if (!actor) throw new Error('Actor not available');

      try {
        await actor.adminDeleteProduct(id);

        // Refresh products list
        await refreshProducts();

        toast.success('Product deleted successfully');
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        toast.error('Failed to delete product', {
          description: err.message || 'Could not delete product from the backend.',
        });
        throw err;
      }
    },
    [actor, refreshProducts]
  );

  const bulkCreateProducts = useCallback(
    async (dataArray: AdminProductFormData[]): Promise<number> => {
      if (!actor) throw new Error('Actor not available');

      try {
        // Convert all form data to backend products
        const backendProducts = dataArray.map((data) => {
          const payload = adminFormToBackendProduct(data);
          return {
            id: payload.id,
            name: payload.name,
            price: payload.price,
            description: payload.description,
            images: payload.images,
            fabric: payload.fabric,
            variants: payload.variants,
            blousePair: payload.blousePair,
            category: payload.category,
          };
        });

        // Call bulk import
        const count = await actor.adminBulkImportProducts(backendProducts);

        // Refresh products list
        await refreshProducts();

        return Number(count);
      } catch (err: any) {
        console.error('Failed to bulk import products:', err);
        toast.error('Bulk import failed', {
          description: err.message || 'Could not import products to the backend.',
        });
        throw err;
      }
    },
    [actor, refreshProducts]
  );

  return (
    <AdminProductsContext.Provider
      value={{
        products,
        isLoading,
        error,
        createProduct,
        updateProduct,
        deleteProduct,
        bulkCreateProducts,
        refreshProducts,
      }}
    >
      {children}
    </AdminProductsContext.Provider>
  );
}

export function useAdminProducts() {
  const context = useContext(AdminProductsContext);
  if (!context) {
    throw new Error('useAdminProducts must be used within AdminProductsProvider');
  }
  return context;
}
