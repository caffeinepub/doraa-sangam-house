const HIGHLIGHT_KEY = 'admin-last-saved-product';

export interface SaveHighlightData {
  productId: string;
  categoryLabel: string;
  timestamp: number;
}

export function setSaveHighlight(productId: string, categoryLabel: string): void {
  try {
    const data: SaveHighlightData = {
      productId,
      categoryLabel,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(HIGHLIGHT_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to set save highlight:', error);
  }
}

export function getSaveHighlight(): SaveHighlightData | null {
  try {
    const stored = sessionStorage.getItem(HIGHLIGHT_KEY);
    if (!stored) return null;
    
    const data: SaveHighlightData = JSON.parse(stored);
    
    // Expire after 10 seconds
    if (Date.now() - data.timestamp > 10000) {
      sessionStorage.removeItem(HIGHLIGHT_KEY);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Failed to get save highlight:', error);
    return null;
  }
}

export function clearSaveHighlight(): void {
  try {
    sessionStorage.removeItem(HIGHLIGHT_KEY);
  } catch (error) {
    console.error('Failed to clear save highlight:', error);
  }
}
