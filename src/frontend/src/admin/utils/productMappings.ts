import { AdminProduct, AdminProductFormData, AdminProductImage } from '../types';
import type { Product, Variant } from '../../backend';

/**
 * Convert AdminProductFormData to backend Product payload
 */
export function adminFormToBackendProduct(
  formData: AdminProductFormData,
  productId?: string
): {
  id: string;
  name: string;
  price: bigint;
  description: string;
  images: string[];
  fabric: string;
  variants: Variant[];
  blousePair: string;
  category: string;
} {
  // Generate ID if not provided (for new products)
  const id = productId || `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Convert price to bigint (in paise/cents)
  const priceFloat = parseFloat(formData.price) || 0;
  const price = BigInt(Math.round(priceFloat));

  // Extract image URLs
  const images = formData.images.map((img) => img.url);

  // Build variants from colors and sizes
  const variants: Variant[] = [];
  for (const color of formData.colors) {
    for (const size of formData.sizes) {
      variants.push({ color, size });
    }
  }

  // Use custom fabric if selected, otherwise use preset
  const fabric = formData.fabric === 'Custom' && formData.fabricCustom
    ? formData.fabricCustom
    : formData.fabric;

  return {
    id,
    name: formData.name,
    price,
    description: formData.description,
    images,
    fabric,
    variants,
    blousePair: formData.blousePairing,
    category: formData.categoryId,
  };
}

/**
 * Convert backend Product to AdminProduct
 */
export function backendProductToAdmin(backendProduct: Product): AdminProduct {
  // Extract unique colors and sizes from variants
  const colors = Array.from(new Set(backendProduct.variants.map((v) => v.color)));
  const sizes = Array.from(new Set(backendProduct.variants.map((v) => v.size)));

  // Convert image URLs to AdminProductImage format
  const images: AdminProductImage[] = backendProduct.images.map((url, index) => ({
    id: `img-${index}-${Date.now()}`,
    url,
  }));

  // Convert price from bigint to number
  const price = Number(backendProduct.price);

  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price,
    description: backendProduct.description,
    fabric: backendProduct.fabric,
    fabricCustom: undefined, // Backend doesn't distinguish custom fabric
    categoryId: backendProduct.category,
    colors,
    sizes,
    blousePairing: backendProduct.blousePair,
    images,
    createdAt: Date.now(), // Backend doesn't store creation time
  };
}

/**
 * Convert AdminProduct to AdminProductFormData for editing
 */
export function adminProductToFormData(product: AdminProduct): AdminProductFormData {
  return {
    name: product.name,
    price: product.price.toString(),
    description: product.description,
    fabric: product.fabric,
    fabricCustom: product.fabricCustom,
    categoryId: product.categoryId,
    colors: product.colors,
    sizes: product.sizes,
    blousePairing: product.blousePairing,
    images: product.images,
  };
}
