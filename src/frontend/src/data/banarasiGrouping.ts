// Client-side heuristic grouping utility for Banarasi products
import { DummyProduct } from './dummyProducts';

export interface BanarasiGroupedProducts {
  [categoryId: string]: DummyProduct[];
}

/**
 * Deterministically assigns each Banarasi product to exactly one collection category
 * based on observable attributes (colorFamily, patternDescription, tags inferred from name/description)
 */
export function groupBanarasiProducts(products: DummyProduct[]): BanarasiGroupedProducts {
  const grouped: BanarasiGroupedProducts = {
    'zari-legacy': [],
    'silk-symphony': [],
    'royal-heritage': [],
    'blooming-banarasi': [],
    'midnight-elegance': [],
    'celestial-threads': [],
    'eternal-gold': [],
  };

  const banarasiProducts = products.filter((p) => p.category === 'banarasi');

  banarasiProducts.forEach((product) => {
    // If product already has a category assigned, use it
    if (product.banarasiCategory && grouped[product.banarasiCategory]) {
      grouped[product.banarasiCategory].push(product);
      return;
    }

    // Heuristic grouping based on observable attributes
    const name = product.name.toLowerCase();
    const description = product.description?.toLowerCase() || '';
    const pattern = product.patternDescription?.toLowerCase() || '';
    const colorFamily = product.colorFamily?.toLowerCase() || '';

    // Zari Legacy: Heavy zari, gold-dominant, traditional
    if (
      pattern.includes('heavy') ||
      pattern.includes('zari') ||
      name.includes('zari') ||
      name.includes('legacy') ||
      colorFamily.includes('gold-red')
    ) {
      grouped['zari-legacy'].push(product);
    }
    // Silk Symphony: Intricate motifs, multi-color, vibrant
    else if (
      pattern.includes('intricate') ||
      pattern.includes('motif') ||
      name.includes('symphony') ||
      colorFamily.includes('multi') ||
      colorFamily.includes('pink')
    ) {
      grouped['silk-symphony'].push(product);
    }
    // Royal Heritage: Royal patterns, wedding, rich tones
    else if (
      pattern.includes('royal') ||
      name.includes('royal') ||
      name.includes('heritage') ||
      colorFamily.includes('rich') ||
      colorFamily.includes('maroon') ||
      colorFamily.includes('coral')
    ) {
      grouped['royal-heritage'].push(product);
    }
    // Blooming Banarasi: Floral, nature-inspired, vibrant
    else if (
      pattern.includes('floral') ||
      pattern.includes('blossom') ||
      name.includes('bloom') ||
      name.includes('blossom') ||
      colorFamily.includes('vibrant') ||
      colorFamily.includes('green')
    ) {
      grouped['blooming-banarasi'].push(product);
    }
    // Midnight Elegance: Dark colors, evening wear, mystery
    else if (
      colorFamily.includes('dark') ||
      name.includes('midnight') ||
      name.includes('navy') ||
      name.includes('black') ||
      name.includes('burgundy') ||
      name.includes('indigo')
    ) {
      grouped['midnight-elegance'].push(product);
    }
    // Celestial Threads: Geometric, blue tones, star-like
    else if (
      pattern.includes('geometric') ||
      pattern.includes('celestial') ||
      name.includes('celestial') ||
      colorFamily.includes('blue') ||
      colorFamily.includes('turquoise') ||
      colorFamily.includes('sapphire')
    ) {
      grouped['celestial-threads'].push(product);
    }
    // Eternal Gold: Gold-dominant, luxury, all-over gold
    else if (
      colorFamily.includes('gold') ||
      name.includes('gold') ||
      name.includes('amber') ||
      name.includes('champagne') ||
      pattern.includes('gold weave')
    ) {
      grouped['eternal-gold'].push(product);
    }
    // Fallback: Assign to Silk Symphony as default
    else {
      grouped['silk-symphony'].push(product);
    }
  });

  return grouped;
}
