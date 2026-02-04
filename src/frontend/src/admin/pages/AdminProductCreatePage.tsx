import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useAdminProducts } from '../state/AdminProductsProvider';
import { AdminProductFormData } from '../types';
import ProductForm from '../components/ProductForm';
import BulkUploadSection from '../components/BulkUploadSection';
import { ADMIN_ROUTES } from '../adminConfig';
import { setSaveHighlight } from '../utils/adminSaveReturnHighlight';
import { getAdminCategoryLabel } from '../data/adminProductCategories';

interface AdminProductCreatePageProps {
  navigate: (path: string) => void;
}

export default function AdminProductCreatePage({ navigate }: AdminProductCreatePageProps) {
  const { createProduct } = useAdminProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AdminProductFormData) => {
    setIsSubmitting(true);

    try {
      const newProduct = await createProduct(data);
      const categoryLabel = getAdminCategoryLabel(data.categoryId);
      setSaveHighlight(newProduct.id, categoryLabel);
      navigate(ADMIN_ROUTES.PRODUCTS);
    } catch (error) {
      // Error already handled in provider
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(ADMIN_ROUTES.PRODUCTS);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          className="admin-interactive-glow"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Create New Product</h2>
          <p className="text-muted-foreground">
            Add a new product to your catalog with all details
          </p>
        </div>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Fill in all required fields to create a new product
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      <BulkUploadSection navigate={navigate} />
    </div>
  );
}
