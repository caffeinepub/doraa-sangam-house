import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useAdminProducts } from '../state/AdminProductsProvider';
import { AdminProductFormData } from '../types';
import ProductForm from '../components/ProductForm';
import { ADMIN_ROUTES } from '../adminConfig';
import { setSaveHighlight } from '../utils/adminSaveReturnHighlight';
import { getAdminCategoryLabel } from '../data/adminProductCategories';
import { adminProductToFormData } from '../utils/productMappings';

interface AdminProductEditPageProps {
  navigate: (path: string) => void;
  productId?: string;
}

export default function AdminProductEditPage({ navigate, productId }: AdminProductEditPageProps) {
  const { products, updateProduct, deleteProduct, isLoading } = useAdminProducts();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const product = products.find((p) => p.id === productId);

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm text-muted-foreground">Loading product...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-8 max-w-5xl mx-auto">
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <h3 className="text-lg font-semibold text-foreground mb-2">Product not found</h3>
            <p className="text-sm text-muted-foreground mb-6">
              The product you're looking for doesn't exist in the canister
            </p>
            <Button onClick={() => navigate(ADMIN_ROUTES.PRODUCTS)}>
              Back to Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (data: AdminProductFormData) => {
    setIsSubmitting(true);

    try {
      await updateProduct(product.id, data);
      const categoryLabel = getAdminCategoryLabel(data.categoryId);
      setSaveHighlight(product.id, categoryLabel);
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      navigate(ADMIN_ROUTES.PRODUCTS);
    } catch (error) {
      // Error already handled in provider
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
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
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Edit Product</h2>
            <p className="text-muted-foreground">
              Update product details and save changes
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowDeleteDialog(true)}
          className="admin-interactive-glow"
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Product
        </Button>
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border/40">
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
          <CardDescription>
            Update the product information below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            product={product}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone and will permanently remove the product from the canister.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
