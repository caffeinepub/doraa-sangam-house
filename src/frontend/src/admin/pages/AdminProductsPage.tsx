import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Package, Trash2 } from 'lucide-react';
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
import { useAdminProducts } from '../state/AdminProductsProvider';
import { useAdminSaveFeedback } from '../hooks/useAdminSaveFeedback';
import { getAdminCategoryLabel } from '../data/adminProductCategories';
import { getSaveHighlight, clearSaveHighlight } from '../utils/adminSaveReturnHighlight';
import { ADMIN_ROUTES } from '../adminConfig';
import { useState } from 'react';

interface AdminProductsPageProps {
  navigate: (path: string) => void;
}

export default function AdminProductsPage({ navigate }: AdminProductsPageProps) {
  const { products, isLoading, error, deleteProduct } = useAdminProducts();
  const { triggerSaveFeedback, getSaveAnimationClass } = useAdminSaveFeedback();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const highlight = getSaveHighlight();
    if (highlight) {
      triggerSaveFeedback(
        highlight.productId,
        `Product saved to ${highlight.categoryLabel}`
      );
      clearSaveHighlight();
    }
  }, [triggerSaveFeedback]);

  const handleCreate = () => {
    navigate(ADMIN_ROUTES.PRODUCTS_CREATE);
  };

  const handleEdit = (productId: string) => {
    navigate(`${ADMIN_ROUTES.PRODUCTS_EDIT}/${productId}`);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch (error) {
      // Error already handled in provider
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Products</h2>
            <p className="text-muted-foreground">Loading products from canister...</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/40">
              <CardHeader>
                <div className="aspect-square rounded-lg shimmer-skeleton mb-4" />
                <div className="h-6 shimmer-skeleton rounded mb-2" />
                <div className="h-4 shimmer-skeleton rounded w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Products</h2>
            <p className="text-destructive">Error loading products</p>
          </div>
          <Button onClick={handleCreate} className="admin-primary-button">
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog ({products.length} products in canister)
          </p>
        </div>
        <Button onClick={handleCreate} className="admin-primary-button">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm border-border/40">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No products yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-md">
              Start building your catalog by adding your first product
            </p>
            <Button onClick={handleCreate} className="admin-primary-button">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`bg-card/50 backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-300 ${getSaveAnimationClass(
                product.id
              )}`}
            >
              <CardHeader>
                {product.images.length > 0 && (
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
                    <img
                      src={product.images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>
                  <span className="text-accent font-semibold">₹{product.price.toLocaleString()}</span>
                  {' • '}
                  <span className="text-xs">{getAdminCategoryLabel(product.categoryId)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.colors.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.colors.slice(0, 3).map((color) => (
                      <span
                        key={color}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {color}
                      </span>
                    ))}
                    {product.colors.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{product.colors.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 admin-interactive-glow"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(product.id)}
                    className="admin-interactive-glow text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone and will remove the product from the canister.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
