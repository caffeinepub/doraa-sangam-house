export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  fabric: string;
  fabricCustom?: string;
  categoryId: string;
  colors: string[];
  sizes: string[];
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
  fabricCustom?: string;
  categoryId: string;
  colors: string[];
  sizes: string[];
  blousePairing: string;
  images: AdminProductImage[];
}

export const FABRIC_PRESETS = [
  'Banarasi Silk',
  'Georgette',
  'Organza',
  'Katan Silk',
  'Pure Silk',
  'Art Silk',
  'Custom',
] as const;

export const COLOR_SWATCHES = [
  { name: 'Red', value: '#DC2626' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Purple', value: '#9333EA' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Gold', value: '#D4AF37' },
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Maroon', value: '#7F1D1D' },
  { name: 'Navy', value: '#1E3A8A' },
] as const;

export const SIZE_OPTIONS = ['Free Size', 'S', 'M', 'L', 'XL', 'XXL'] as const;
