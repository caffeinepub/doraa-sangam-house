// Banarasi Saree Category Registry with Creative Names
export interface BanarasiCategory {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  pattern: string;
  colorFamily: string;
  occasion: string;
}

export const BANARASI_CATEGORIES: BanarasiCategory[] = [
  {
    id: 'zari-legacy',
    name: 'Zari Legacy Collection',
    description: 'Heavy gold zari work that speaks of timeless opulence and royal heritage',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0063.jpg',
    pattern: 'heavy-zari',
    colorFamily: 'gold-dominant',
    occasion: 'wedding',
  },
  {
    id: 'silk-symphony',
    name: 'Silk Symphony',
    description: 'Pure silk with intricate motifs that dance across the fabric',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0067.jpg',
    pattern: 'intricate-motifs',
    colorFamily: 'multi',
    occasion: 'festive',
  },
  {
    id: 'royal-heritage',
    name: 'Royal Heritage Weaves',
    description: 'Wedding and party royal patterns fit for a queen',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0074.jpg',
    pattern: 'royal-weave',
    colorFamily: 'rich-tones',
    occasion: 'wedding',
  },
  {
    id: 'blooming-banarasi',
    name: 'Blooming Banarasi',
    description: 'Floral and organic designs inspired by nature elegance',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0046.jpg',
    pattern: 'floral',
    colorFamily: 'vibrant',
    occasion: 'festive',
  },
  {
    id: 'midnight-elegance',
    name: 'Midnight Elegance',
    description: 'Dark rich colors that exude mystery and sophistication',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0082.jpg',
    pattern: 'classic',
    colorFamily: 'dark',
    occasion: 'evening',
  },
  {
    id: 'celestial-threads',
    name: 'Celestial Threads',
    description: 'Star-like and geometric patterns that shimmer like the night sky',
    coverImage: '/assets/uploads/banarasi/IMG-20251124-WA0010.jpg',
    pattern: 'geometric',
    colorFamily: 'blue-tones',
    occasion: 'party',
  },
  {
    id: 'eternal-gold',
    name: 'Eternal Gold',
    description: 'Gold-dominant masterpieces that capture the essence of luxury',
    coverImage: '/assets/uploads/banarasi/IMG-20251116-WA0064.jpg',
    pattern: 'gold-weave',
    colorFamily: 'gold',
    occasion: 'wedding',
  },
];
