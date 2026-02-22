// Hardcoded dummy products for category pages (frontend-only, no backend persistence)
export interface DummyProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export const DUMMY_PRODUCTS: DummyProduct[] = [
  // Banarasi products
  {
    id: 'dummy-banarasi-1',
    name: 'Test Banarasi Saree',
    price: 4999,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Banarasi',
  },
  {
    id: 'dummy-banarasi-2',
    name: 'Royal Zari Elegance',
    price: 5999,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Banarasi',
  },
  {
    id: 'dummy-banarasi-3',
    name: 'Golden Heritage Weave',
    price: 6499,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Banarasi',
  },
  {
    id: 'dummy-banarasi-4',
    name: 'Pearl Silk Symphony',
    price: 4499,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Banarasi',
  },
  {
    id: 'dummy-banarasi-5',
    name: 'Midnight Brocade',
    price: 5499,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Banarasi',
  },

  // Silk products
  {
    id: 'dummy-silk-1',
    name: 'Organza Grace Saree',
    price: 2999,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Silk',
  },
  {
    id: 'dummy-silk-2',
    name: 'Pure Silk Radiance',
    price: 3499,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Silk',
  },
  {
    id: 'dummy-silk-3',
    name: 'Silk Harmony Collection',
    price: 3999,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Silk',
  },
  {
    id: 'dummy-silk-4',
    name: 'Lustrous Silk Drape',
    price: 2799,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Silk',
  },

  // Organza products
  {
    id: 'dummy-organza-1',
    name: 'Sheer Organza Elegance',
    price: 2499,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Organza',
  },
  {
    id: 'dummy-organza-2',
    name: 'Flowing Organza Grace',
    price: 2699,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Organza',
  },
  {
    id: 'dummy-organza-3',
    name: 'Delicate Organza Weave',
    price: 2899,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Organza',
  },
  {
    id: 'dummy-organza-4',
    name: 'Ethereal Organza Drape',
    price: 2599,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Organza',
  },

  // Georgette products
  {
    id: 'dummy-georgette-1',
    name: 'Georgette Flow Collection',
    price: 2199,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Georgette',
  },
  {
    id: 'dummy-georgette-2',
    name: 'Soft Georgette Elegance',
    price: 2399,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Georgette',
  },
  {
    id: 'dummy-georgette-3',
    name: 'Georgette Grace Saree',
    price: 2299,
    image: 'https://dummyimage.com/400x600/0f0f0f/7FB3D5',
    category: 'Georgette',
  },
  {
    id: 'dummy-georgette-4',
    name: 'Flowing Georgette Drape',
    price: 2499,
    image: 'https://dummyimage.com/400x600/1a1a1a/D4AF37',
    category: 'Georgette',
  },
];

// Helper function to get products by category
export function getDummyProductsByCategory(category: string): DummyProduct[] {
  return DUMMY_PRODUCTS.filter((product) => product.category === category);
}
