import { AdminProductFormData, AdminProductImage } from '../types';
import { toast } from 'sonner';

export interface ParsedCSVProduct {
  name: string;
  price: string;
  description: string;
  fabric: string;
  category: string;
  colors: string[];
  sizes: string[];
  blousePairing: string;
  imageUrls: string[];
}

/**
 * Parse CSV text content into product data
 */
export function parseCSV(csvText: string): ParsedCSVProduct[] {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file must contain at least a header row and one data row');
  }

  // Parse header
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  
  // Validate required columns
  const requiredColumns = ['name', 'price', 'category'];
  const missingColumns = requiredColumns.filter((col) => !headers.includes(col));
  if (missingColumns.length > 0) {
    throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
  }

  const products: ParsedCSVProduct[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = parseCSVLine(line);
    if (values.length !== headers.length) {
      console.warn(`Row ${i + 1} has ${values.length} columns, expected ${headers.length}. Skipping.`);
      continue;
    }

    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index];
    });

    // Validate required fields
    if (!row.name || !row.price || !row.category) {
      console.warn(`Row ${i + 1} missing required fields. Skipping.`);
      continue;
    }

    // Parse price
    const priceNum = parseFloat(row.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      console.warn(`Row ${i + 1} has invalid price: ${row.price}. Skipping.`);
      continue;
    }

    // Parse arrays (colors, sizes, images)
    const colors = row.colors ? row.colors.split(';').map((c) => c.trim()).filter(Boolean) : [];
    const sizes = row.sizes ? row.sizes.split(';').map((s) => s.trim()).filter(Boolean) : [];
    const imageUrls = row.images ? row.images.split(';').map((url) => url.trim()).filter(Boolean) : [];

    products.push({
      name: row.name,
      price: row.price,
      description: row.description || '',
      fabric: row.fabric || 'Banarasi Silk',
      category: row.category,
      colors: colors.length > 0 ? colors : ['Red'],
      sizes: sizes.length > 0 ? sizes : ['Free Size'],
      blousePairing: row.blousepairing || row.blouse || 'Matching blouse included',
      imageUrls: imageUrls.length > 0 ? imageUrls : [],
    });
  }

  if (products.length === 0) {
    throw new Error('No valid products found in CSV file');
  }

  return products;
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

/**
 * Convert parsed CSV products to AdminProductFormData
 */
export function csvProductsToFormData(csvProducts: ParsedCSVProduct[]): AdminProductFormData[] {
  return csvProducts.map((csvProduct) => {
    // Generate placeholder images if none provided
    const images: AdminProductImage[] = csvProduct.imageUrls.length > 0
      ? csvProduct.imageUrls.map((url, index) => ({
          id: `csv-img-${index}-${Date.now()}`,
          url,
        }))
      : Array.from({ length: 5 }, (_, i) => ({
          id: `placeholder-${i}-${Date.now()}`,
          url: '/assets/generated/pearl-shimmer-bg.dim_1920x1080.png',
        }));

    return {
      name: csvProduct.name,
      price: csvProduct.price,
      description: csvProduct.description,
      fabric: csvProduct.fabric,
      categoryId: csvProduct.category,
      colors: csvProduct.colors,
      sizes: csvProduct.sizes,
      blousePairing: csvProduct.blousePairing,
      images,
    };
  });
}

/**
 * Validate bulk upload file
 */
export function validateBulkUploadFile(file: File): { valid: boolean; error?: string } {
  const validExtensions = ['.csv', '.zip'];
  const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));

  if (!validExtensions.includes(fileExtension)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a CSV or ZIP file.',
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'File size exceeds 10MB limit.',
    };
  }

  return { valid: true };
}
