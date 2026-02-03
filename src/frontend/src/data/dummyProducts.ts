// Curated dummy product catalog for DoRaa Sangam House - Expanded to ~150 Banarasi products
export interface DummyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  images: string[];
  rating: number;
  reviewCount: number;
  category: 'saree' | 'lehenga' | 'kurti' | 'jewelry' | 'banarasi';
  sizes?: { size: string; bust: string; waist: string; length: string }[];
  blouseSuggestions?: { name: string; price: number; imageUrl: string }[];
  // Banarasi-specific metadata
  banarasiCategory?: string;
  patternDescription?: string;
  colorFamily?: string;
  fabric?: string;
  swatches?: { color: string; hex: string }[];
  codAvailable?: boolean;
  expressDelivery?: boolean;
}

// Helper function to generate Banarasi products
function generateBanarasiProduct(
  id: string,
  name: string,
  description: string,
  price: number,
  imageIndex: number,
  category: string,
  colorFamily: string,
  pattern: string,
  swatches: { color: string; hex: string }[]
): DummyProduct {
  const imageFiles = [
    'IMG-20251116-WA0028.jpg', 'IMG-20251116-WA0029.jpg', 'IMG-20251116-WA0030.jpg',
    'IMG-20251116-WA0031.jpg', 'IMG-20251116-WA0032.jpg', 'IMG-20251116-WA0033.jpg',
    'IMG-20251116-WA0034.jpg', 'IMG-20251116-WA0035.jpg', 'IMG-20251116-WA0036.jpg',
    'IMG-20251116-WA0037.jpg', 'IMG-20251116-WA0038.jpg', 'IMG-20251116-WA0039.jpg',
    'IMG-20251116-WA0040.jpg', 'IMG-20251116-WA0041.jpg', 'IMG-20251116-WA0042.jpg',
    'IMG-20251116-WA0043.jpg', 'IMG-20251116-WA0044.jpg', 'IMG-20251116-WA0045.jpg',
    'IMG-20251116-WA0046.jpg', 'IMG-20251116-WA0047.jpg', 'IMG-20251116-WA0048.jpg',
    'IMG-20251116-WA0049.jpg', 'IMG-20251116-WA0050.jpg', 'IMG-20251116-WA0051.jpg',
    'IMG-20251116-WA0052.jpg', 'IMG-20251116-WA0053.jpg', 'IMG-20251116-WA0054.jpg',
    'IMG-20251116-WA0055.jpg', 'IMG-20251116-WA0056.jpg', 'IMG-20251116-WA0057.jpg',
    'IMG-20251116-WA0058.jpg', 'IMG-20251116-WA0059.jpg', 'IMG-20251116-WA0060.jpg',
    'IMG-20251116-WA0061.jpg', 'IMG-20251116-WA0062.jpg', 'IMG-20251116-WA0063.jpg',
    'IMG-20251116-WA0064.jpg', 'IMG-20251116-WA0065.jpg', 'IMG-20251116-WA0066.jpg',
    'IMG-20251116-WA0067.jpg', 'IMG-20251116-WA0068.jpg', 'IMG-20251116-WA0069.jpg',
    'IMG-20251116-WA0070.jpg', 'IMG-20251116-WA0071.jpg', 'IMG-20251116-WA0072.jpg',
    'IMG-20251116-WA0073.jpg', 'IMG-20251116-WA0074.jpg', 'IMG-20251116-WA0075.jpg',
    'IMG-20251116-WA0076.jpg', 'IMG-20251116-WA0077.jpg', 'IMG-20251116-WA0078.jpg',
    'IMG-20251116-WA0079.jpg', 'IMG-20251116-WA0080.jpg', 'IMG-20251116-WA0081.jpg',
    'IMG-20251116-WA0082.jpg', 'IMG-20251116-WA0083.jpg', 'IMG-20251116-WA0084.jpg',
    'IMG-20251116-WA0085.jpg', 'IMG-20251116-WA0086.jpg', 'IMG-20251116-WA0087.jpg',
    'IMG-20251116-WA0088.jpg', 'IMG-20251116-WA0089.jpg', 'IMG-20251116-WA0090.jpg',
    'IMG-20251116-WA0091.jpg', 'IMG-20251116-WA0092.jpg', 'IMG-20251116-WA0093.jpg',
    'IMG-20251116-WA0094.jpg', 'IMG-20251116-WA0095.jpg', 'IMG-20251116-WA0096.jpg',
    'IMG-20251116-WA0097.jpg', 'IMG-20251116-WA0098.jpg',
    'IMG-20251124-WA0005.jpg', 'IMG-20251124-WA0006.jpg', 'IMG-20251124-WA0007.jpg',
    'IMG-20251124-WA0008.jpg', 'IMG-20251124-WA0009.jpg', 'IMG-20251124-WA0010.jpg',
    'IMG-20251124-WA0011.jpg', 'IMG-20251124-WA0012.jpg', 'IMG-20251124-WA0013.jpg',
    'IMG-20251124-WA0014.jpg', 'IMG-20251124-WA0015.jpg', 'IMG-20251124-WA0016.jpg',
    'IMG-20251124-WA0017.jpg', 'IMG-20251124-WA0018.jpg',
  ];

  const mainImage = `/assets/uploads/banarasi/${imageFiles[imageIndex % imageFiles.length]}`;
  const additionalImages = [
    `/assets/uploads/banarasi/${imageFiles[(imageIndex + 1) % imageFiles.length]}`,
    `/assets/uploads/banarasi/${imageFiles[(imageIndex + 2) % imageFiles.length]}`,
  ];

  return {
    id,
    name,
    description,
    price,
    stock: Math.floor(Math.random() * 8) + 2,
    imageUrl: mainImage,
    images: [mainImage, ...additionalImages],
    rating: 4.5 + Math.random() * 0.5,
    reviewCount: Math.floor(Math.random() * 100) + 30,
    category: 'banarasi',
    banarasiCategory: category,
    patternDescription: pattern,
    colorFamily,
    fabric: 'Pure Banarasi Silk',
    swatches,
    codAvailable: Math.random() > 0.3,
    expressDelivery: Math.random() > 0.4,
    sizes: [
      { size: 'Free Size', bust: '32-42"', waist: '26-36"', length: '5.5m + 0.8m blouse' },
    ],
    blouseSuggestions: [
      { name: 'Gold Embroidered Blouse', price: 2999, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
      { name: 'Designer Silk Blouse', price: 2499, imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop' },
    ],
  };
}

export const DUMMY_PRODUCTS: DummyProduct[] = [
  // Original non-Banarasi products (8 items)
  {
    id: '1',
    name: 'Royal Sangam Silk Saree',
    description: 'Exquisite handwoven silk saree with intricate gold zari work, perfect for weddings and special occasions.',
    price: 12999,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&h=800&fit=crop',
    ],
    rating: 4.8,
    reviewCount: 124,
    category: 'saree',
    sizes: [
      { size: 'Free Size', bust: '32-42"', waist: '26-36"', length: '5.5m + 0.8m blouse' },
    ],
    blouseSuggestions: [
      { name: 'Gold Embroidered Blouse', price: 2499, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
      { name: 'Pearl Work Designer Blouse', price: 3299, imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400&h=400&fit=crop' },
    ],
  },
  {
    id: '2',
    name: 'Pearl Blue Banarasi Saree',
    description: 'Timeless Banarasi silk saree in pearl blue with traditional motifs and rich pallu design.',
    price: 15999,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 89,
    category: 'saree',
    sizes: [
      { size: 'Free Size', bust: '32-42"', waist: '26-36"', length: '5.5m + 0.8m blouse' },
    ],
    blouseSuggestions: [
      { name: 'Silver Sequin Blouse', price: 2799, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
    ],
  },
  {
    id: '3',
    name: 'Golden Heritage Lehenga',
    description: 'Stunning bridal lehenga with intricate embroidery and mirror work, crafted for your special day.',
    price: 28999,
    stock: 3,
    imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&h=800&fit=crop',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
    ],
    rating: 5.0,
    reviewCount: 56,
    category: 'lehenga',
    sizes: [
      { size: 'XS', bust: '32"', waist: '26"', length: '42"' },
      { size: 'S', bust: '34"', waist: '28"', length: '42"' },
      { size: 'M', bust: '36"', waist: '30"', length: '42"' },
      { size: 'L', bust: '38"', waist: '32"', length: '42"' },
      { size: 'XL', bust: '40"', waist: '34"', length: '42"' },
    ],
  },
  {
    id: '4',
    name: 'Elegant Anarkali Kurti',
    description: 'Graceful floor-length Anarkali with delicate embroidery and flowing silhouette.',
    price: 4999,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
    ],
    rating: 4.6,
    reviewCount: 203,
    category: 'kurti',
    sizes: [
      { size: 'XS', bust: '32"', waist: '26"', length: '46"' },
      { size: 'S', bust: '34"', waist: '28"', length: '46"' },
      { size: 'M', bust: '36"', waist: '30"', length: '46"' },
      { size: 'L', bust: '38"', waist: '32"', length: '46"' },
      { size: 'XL', bust: '40"', waist: '34"', length: '46"' },
    ],
  },
  {
    id: '5',
    name: 'Kundan Necklace Set',
    description: 'Traditional Kundan jewelry set with matching earrings and tikka, perfect for weddings.',
    price: 8999,
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    ],
    rating: 4.7,
    reviewCount: 145,
    category: 'jewelry',
  },
  {
    id: '6',
    name: 'Chanderi Cotton Saree',
    description: 'Lightweight Chanderi saree with subtle gold border, ideal for daily wear and office.',
    price: 3999,
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop',
    ],
    rating: 4.5,
    reviewCount: 178,
    category: 'saree',
    sizes: [
      { size: 'Free Size', bust: '32-42"', waist: '26-36"', length: '5.5m + 0.8m blouse' },
    ],
    blouseSuggestions: [
      { name: 'Cotton Blouse', price: 999, imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop' },
    ],
  },
  {
    id: '7',
    name: 'Designer Palazzo Set',
    description: 'Contemporary palazzo set with embroidered kurta and dupatta, perfect for festive occasions.',
    price: 5999,
    stock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=800&fit=crop',
    ],
    rating: 4.4,
    reviewCount: 92,
    category: 'kurti',
    sizes: [
      { size: 'S', bust: '34"', waist: '28"', length: '42"' },
      { size: 'M', bust: '36"', waist: '30"', length: '42"' },
      { size: 'L', bust: '38"', waist: '32"', length: '42"' },
      { size: 'XL', bust: '40"', waist: '34"', length: '42"' },
    ],
  },
  {
    id: '8',
    name: 'Polki Earrings',
    description: 'Exquisite polki diamond earrings with pearl drops, handcrafted by master artisans.',
    price: 6499,
    stock: 7,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=800&fit=crop',
    ],
    rating: 4.9,
    reviewCount: 67,
    category: 'jewelry',
  },

  // Expanded Banarasi Collection (~150 products)
  // Zari Legacy Collection (25 products)
  ...Array.from({ length: 25 }, (_, i) => 
    generateBanarasiProduct(
      `zari-${i + 1}`,
      `Zari Legacy ${i + 1}`,
      'Exquisite heavy gold zari work with traditional motifs and ornate pallu design',
      15999 + Math.floor(Math.random() * 8000),
      i,
      'zari-legacy',
      'gold-red',
      'Heavy gold zari with traditional motifs',
      [
        { color: 'Gold', hex: '#D4AF37' },
        { color: 'Red', hex: '#DC143C' },
        { color: 'Maroon', hex: '#800000' },
      ]
    )
  ),

  // Silk Symphony Collection (22 products)
  ...Array.from({ length: 22 }, (_, i) => 
    generateBanarasiProduct(
      `silk-${i + 1}`,
      `Silk Symphony ${i + 1}`,
      'Pure silk with intricate motifs that dance across the fabric in vibrant hues',
      13999 + Math.floor(Math.random() * 6000),
      i + 25,
      'silk-symphony',
      'multi',
      'Intricate motifs with gold zari border',
      [
        { color: 'Magenta', hex: '#FF00FF' },
        { color: 'Pink', hex: '#FFC0CB' },
        { color: 'Gold', hex: '#D4AF37' },
      ]
    )
  ),

  // Royal Heritage Weaves Collection (20 products)
  ...Array.from({ length: 20 }, (_, i) => 
    generateBanarasiProduct(
      `royal-${i + 1}`,
      `Royal Heritage ${i + 1}`,
      'Wedding and party royal patterns fit for a queen with heavy gold zari work',
      17999 + Math.floor(Math.random() * 7000),
      i + 47,
      'royal-heritage',
      'rich-tones',
      'Royal weave with ornate pallu',
      [
        { color: 'Maroon', hex: '#800000' },
        { color: 'Gold', hex: '#D4AF37' },
        { color: 'Coral', hex: '#FF7F50' },
      ]
    )
  ),

  // Blooming Banarasi Collection (23 products)
  ...Array.from({ length: 23 }, (_, i) => 
    generateBanarasiProduct(
      `bloom-${i + 1}`,
      `Blooming Banarasi ${i + 1}`,
      'Floral and organic designs inspired by nature elegance with delicate gold zari',
      12999 + Math.floor(Math.random() * 5000),
      i + 67,
      'blooming-banarasi',
      'vibrant',
      'Floral motifs with gold zari border',
      [
        { color: 'Pink', hex: '#FFB6C1' },
        { color: 'Green', hex: '#50C878' },
        { color: 'Gold', hex: '#D4AF37' },
      ]
    )
  ),

  // Midnight Elegance Collection (18 products)
  ...Array.from({ length: 18 }, (_, i) => 
    generateBanarasiProduct(
      `midnight-${i + 1}`,
      `Midnight Elegance ${i + 1}`,
      'Dark rich colors that exude mystery and sophistication with heavy gold zari',
      16999 + Math.floor(Math.random() * 7000),
      i + 10,
      'midnight-elegance',
      'dark',
      'Heavy gold zari on dark base',
      [
        { color: 'Navy', hex: '#000080' },
        { color: 'Black', hex: '#000000' },
        { color: 'Gold', hex: '#D4AF37' },
      ]
    )
  ),

  // Celestial Threads Collection (21 products)
  ...Array.from({ length: 21 }, (_, i) => 
    generateBanarasiProduct(
      `celestial-${i + 1}`,
      `Celestial Threads ${i + 1}`,
      'Star-like and geometric patterns that shimmer like the night sky with silver zari',
      15999 + Math.floor(Math.random() * 6000),
      i + 28,
      'celestial-threads',
      'blue-tones',
      'Geometric patterns with silver zari',
      [
        { color: 'Blue', hex: '#0F52BA' },
        { color: 'Turquoise', hex: '#40E0D0' },
        { color: 'Silver', hex: '#C0C0C0' },
      ]
    )
  ),

  // Eternal Gold Collection (19 products)
  ...Array.from({ length: 19 }, (_, i) => 
    generateBanarasiProduct(
      `gold-${i + 1}`,
      `Eternal Gold ${i + 1}`,
      'Gold-dominant masterpieces that capture the essence of luxury with all-over gold weave',
      19999 + Math.floor(Math.random() * 8000),
      i + 49,
      'eternal-gold',
      'gold',
      'All-over gold weave with ornate pallu',
      [
        { color: 'Gold', hex: '#FFD700' },
        { color: 'Champagne', hex: '#F7E7CE' },
        { color: 'Amber', hex: '#FFBF00' },
      ]
    )
  ),
];
