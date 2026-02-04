export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  fabric: string;
  categoryId: string;
  variants: string[];
  blousePairing: string;
  images: AdminProductImage[];
  createdAt: number;
}

export interface AdminProductImage {
  id: string;
  url: string;
  file?: File;
}

export interface AdminProductFormData {
  name: string;
  price: string;
  description: string;
  fabric: string;
  categoryId: string;
  variants: string[];
  blousePairing: string;
  images: AdminProductImage[];
}
