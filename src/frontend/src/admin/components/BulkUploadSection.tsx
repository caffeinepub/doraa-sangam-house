import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Clock } from 'lucide-react';
import { useAdminProducts } from '../state/AdminProductsProvider';
import { ADMIN_ROUTES } from '../adminConfig';
import { toast } from 'sonner';
import {
  validateBulkUploadFile,
  parseCSV,
  csvProductsToFormData,
} from '../utils/bulkUploadParsing';
import { extractCSVFromZip, readFileAsText } from '../utils/zipCsvExtractor';

interface BulkUploadSectionProps {
  navigate: (path: string) => void;
}

export default function BulkUploadSection({ navigate }: BulkUploadSectionProps) {
  const { bulkCreateProducts } = useAdminProducts();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isScheduling, setIsScheduling] = useState(false);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateBulkUploadFile(file);
    if (!validation.valid) {
      toast.error(validation.error);
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    toast.success(`File "${file.name}" selected`);
  }, []);

  const processBulkUpload = useCallback(async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      let csvText: string;

      // Extract CSV content based on file type
      if (selectedFile.name.toLowerCase().endsWith('.zip')) {
        csvText = await extractCSVFromZip(selectedFile);
      } else {
        csvText = await readFileAsText(selectedFile);
      }

      // Parse CSV
      const parsedProducts = parseCSV(csvText);
      
      // Convert to form data
      const formDataArray = csvProductsToFormData(parsedProducts);

      // Upload to backend
      const count = await bulkCreateProducts(formDataArray);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success toast with exact format
      toast.success(`${count} products added`);

      // Reset state
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setSelectedFile(null);
        navigate(ADMIN_ROUTES.PRODUCTS);
      }, 1500);
    } catch (error: any) {
      console.error('Bulk upload error:', error);
      toast.error('Bulk upload failed', {
        description: error.message || 'Could not process the file. Please check the format and try again.',
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, bulkCreateProducts, navigate]);

  const simulateScheduledUpload = useCallback(() => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setIsScheduling(true);

    setTimeout(() => {
      toast.success(`Bulk upload scheduled for ${selectedFile.name}. Processing will begin shortly.`);
      setIsScheduling(false);
      setSelectedFile(null);
    }, 1500);
  }, [selectedFile]);

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Bulk Upload
        </CardTitle>
        <CardDescription>
          Upload multiple products at once using CSV or ZIP files
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="bulk-file">Select File (CSV or ZIP)</Label>
          <div className="flex gap-3">
            <Input
              id="bulk-file"
              type="file"
              accept=".csv,.zip"
              onChange={handleFileSelect}
              disabled={isUploading || isScheduling}
              className="flex-1"
            />
          </div>
          {selectedFile && (
            <p className="text-xs text-muted-foreground">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-primary font-semibold">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

        <div className="flex gap-3">
          <Button
            onClick={processBulkUpload}
            disabled={!selectedFile || isUploading || isScheduling}
            className="flex-1 admin-primary-button"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Now
              </>
            )}
          </Button>
          <Button
            onClick={simulateScheduledUpload}
            disabled={!selectedFile || isUploading || isScheduling}
            variant="outline"
            className="flex-1 admin-interactive-glow"
          >
            {isScheduling ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Scheduling...
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 mr-2" />
                Schedule Bulk Upload
              </>
            )}
          </Button>
        </div>

        <div className="bg-muted/30 rounded-lg p-4 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold text-foreground">Bulk Upload Format:</p>
          <p>• CSV columns: name, price, category, description, fabric, colors, sizes, blousePairing, images</p>
          <p>• Use semicolons (;) to separate multiple values (colors: Red;Gold;Blue)</p>
          <p>• ZIP: Include CSV file (images as URLs in CSV)</p>
          <p>• Maximum 100 products per upload</p>
        </div>
      </CardContent>
    </Card>
  );
}
