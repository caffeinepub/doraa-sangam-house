/**
 * Extract CSV file from ZIP archive
 * Uses browser-native APIs (no external dependencies)
 */
export async function extractCSVFromZip(zipFile: File): Promise<string> {
  try {
    // Read ZIP file as ArrayBuffer
    const arrayBuffer = await zipFile.arrayBuffer();
    
    // Simple ZIP parsing (looking for CSV file signature)
    // This is a simplified implementation for demo purposes
    // In production, consider using a library like JSZip
    
    const dataView = new DataView(arrayBuffer);
    
    // ZIP local file header signature: 0x04034b50
    const ZIP_SIGNATURE = 0x504b0304;
    
    let offset = 0;
    let csvContent: string | null = null;
    
    // Search for CSV file in ZIP
    while (offset < arrayBuffer.byteLength - 30) {
      const signature = dataView.getUint32(offset, true);
      
      if (signature === ZIP_SIGNATURE) {
        // Read file name length
        const fileNameLength = dataView.getUint16(offset + 26, true);
        const extraFieldLength = dataView.getUint16(offset + 28, true);
        
        // Read file name
        const fileNameBytes = new Uint8Array(arrayBuffer, offset + 30, fileNameLength);
        const fileName = new TextDecoder().decode(fileNameBytes);
        
        // Check if it's a CSV file
        if (fileName.toLowerCase().endsWith('.csv')) {
          // Read compressed size
          const compressedSize = dataView.getUint32(offset + 18, true);
          
          // Read file data (assuming no compression for simplicity)
          const dataOffset = offset + 30 + fileNameLength + extraFieldLength;
          const fileData = new Uint8Array(arrayBuffer, dataOffset, compressedSize);
          csvContent = new TextDecoder().decode(fileData);
          break;
        }
        
        // Move to next file
        const compressedSize = dataView.getUint32(offset + 18, true);
        offset += 30 + fileNameLength + extraFieldLength + compressedSize;
      } else {
        offset++;
      }
    }
    
    if (!csvContent) {
      throw new Error('No CSV file found in ZIP archive');
    }
    
    return csvContent;
  } catch (error) {
    console.error('Error extracting CSV from ZIP:', error);
    throw new Error('Failed to extract CSV from ZIP file. Please ensure the ZIP contains a valid CSV file.');
  }
}

/**
 * Read file as text
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}
