import React, { createContext, useContext, useState, useCallback } from 'react';
import { AdminProduct, AdminProductFormData } from '../types';

interface AdminProductsContextValue {
  products: AdminProduct[];
  createProduct: (data: AdminProductFormData) => AdminProduct;
  updateProduct: (id: string, data: AdminProductFormData) => void;
  deleteProduct: (id: string) => void;
}

const AdminProductsContext = createContext<AdminProductsContextValue | undefined>(undefined);

export function AdminProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);

  const createProduct = useCallback((data: AdminProductFormData): AdminProduct => {
    const newProduct: AdminProduct = {
      id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      price: parseFloat(data.price) || 0,
      description: data.description,
      fabric: data.fabric,
      categoryId: data.categoryId,
      variants: data.variants,
      blousePairing: data.blousePairing,
      images: data.images,
      createdAt: Date.now(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, data: AdminProductFormData) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              name: data.name,
              price: parseFloat(data.price) || 0,
              description: data.description,
              fabric: data.fabric,
              categoryId: data.categoryId,
              variants: data.variants,
              blousePairing: data.blousePairing,
              images: data.images,
            }
          : p
      )
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return (
    <AdminProductsContext.Provider value={{ products, createProduct, updateProduct, deleteProduct }}>
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
