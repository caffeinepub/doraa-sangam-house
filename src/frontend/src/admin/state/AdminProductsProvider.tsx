import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { AdminProduct, AdminProductFormData } from '../types';
import { useActor } from '../../hooks/useActor';
import { useQueryClient } from '@tanstack/react-query';
import { adminFormToBackendProduct, backendProductToAdmin } from '../utils/productMappings';
import { toast } from 'sonner';
import { showBasicErrorToast } from '../../utils/errorToasts';

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
      setError(err.message || 'Failed to load products');
      toast.error('Failed to load products');
      showBasicErrorToast('Error: Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, [actor, actorFetching]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const refreshProducts = useCallback(async () => {
    await loadProducts();
    // Invalidate storefront queries to sync
    queryClient.invalidateQueries({ queryKey: ['products'] });
  }, [loadProducts, queryClient]);

  const createProduct = useCallback(
    async (data: AdminProductFormData): Promise<AdminProduct> => {
      if (!actor) {
        const errorMsg = 'Backend not available';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Please try again');
        throw new Error(errorMsg);
      }

      try {
        const backendProduct = adminFormToBackendProduct(data);
        const productId = await actor.adminAddProduct(
          backendProduct.name,
          backendProduct.price,
          backendProduct.description,
          backendProduct.images,
          backendProduct.fabric,
          backendProduct.variants,
          backendProduct.blousePair,
          backendProduct.category
        );

        const newProduct: AdminProduct = {
          ...data,
          id: productId,
          price: parseFloat(data.price) || 0,
          createdAt: Date.now(),
        };

        setProducts((prev) => [...prev, newProduct]);
        await refreshProducts();
        return newProduct;
      } catch (err: any) {
        console.error('Failed to create product:', err);
        const errorMsg = err.message || 'Failed to create product';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Failed to save');
        throw new Error(errorMsg);
      }
    },
    [actor, refreshProducts]
  );

  const updateProduct = useCallback(
    async (id: string, data: AdminProductFormData): Promise<void> => {
      if (!actor) {
        const errorMsg = 'Backend not available';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Please try again');
        throw new Error(errorMsg);
      }

      try {
        const backendProduct = adminFormToBackendProduct(data, id);
        await actor.adminUpdateProduct(
          id,
          backendProduct.name,
          backendProduct.price,
          backendProduct.description,
          backendProduct.images,
          backendProduct.fabric,
          backendProduct.variants,
          backendProduct.blousePair,
          backendProduct.category
        );

        setProducts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...data,
                  id,
                  price: parseFloat(data.price) || 0,
                  createdAt: p.createdAt, // Preserve existing createdAt
                }
              : p
          )
        );
        await refreshProducts();
      } catch (err: any) {
        console.error('Failed to update product:', err);
        const errorMsg = err.message || 'Failed to update product';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Failed to save');
        throw new Error(errorMsg);
      }
    },
    [actor, refreshProducts]
  );

  const deleteProduct = useCallback(
    async (id: string): Promise<void> => {
      if (!actor) {
        const errorMsg = 'Backend not available';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Please try again');
        throw new Error(errorMsg);
      }

      try {
        await actor.adminDeleteProduct(id);
        setProducts((prev) => prev.filter((p) => p.id !== id));
        await refreshProducts();
      } catch (err: any) {
        console.error('Failed to delete product:', err);
        const errorMsg = err.message || 'Failed to delete product';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Failed to delete');
        throw new Error(errorMsg);
      }
    },
    [actor, refreshProducts]
  );

  const bulkCreateProducts = useCallback(
    async (dataArray: AdminProductFormData[]): Promise<number> => {
      if (!actor) {
        const errorMsg = 'Backend not available';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Please try again');
        throw new Error(errorMsg);
      }

      try {
        const backendProducts = dataArray.map((data) => adminFormToBackendProduct(data));
        const count = await actor.adminBulkImportProducts(backendProducts);
        await refreshProducts();
        return Number(count);
      } catch (err: any) {
        console.error('Failed to bulk import products:', err);
        const errorMsg = err.message || 'Failed to bulk import products';
        toast.error(errorMsg);
        showBasicErrorToast('Error: Failed to import');
        throw new Error(errorMsg);
      }
    },
    [actor, refreshProducts]
  );

  const value: AdminProductsContextValue = {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkCreateProducts,
    refreshProducts,
  };

  return <AdminProductsContext.Provider value={value}>{children}</AdminProductsContext.Provider>;
}

export function useAdminProducts() {
  const context = useContext(AdminProductsContext);
  if (!context) {
    throw new Error('useAdminProducts must be used within AdminProductsProvider');
  }
  return context;
}
