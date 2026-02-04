import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { useAdminProducts } from '../state/AdminProductsProvider';
import { AdminProduct, AdminProductFormData } from '../types';
import ProductForm from '../components/ProductForm';
import { useAdminSaveFeedback } from '../hooks/useAdminSaveFeedback';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';

export default function AdminProductsPage() {
  const { products, createProduct, updateProduct, deleteProduct } = useAdminProducts();
  const { triggerSaveFeedback, getSaveAnimationClass } = useAdminSaveFeedback();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | undefined>();
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingProduct(undefined);
    setIsFormOpen(true);
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: AdminProductFormData) => {
    setIsSubmitting(true);

    // Simulate async operation
    setTimeout(() => {
      if (editingProduct) {
        updateProduct(editingProduct.id, data);
        triggerSaveFeedback(editingProduct.id, 'Product updated successfully');
      } else {
        const newProduct = createProduct(data);
        triggerSaveFeedback(newProduct.id, 'Product created successfully');
      }

      setIsFormOpen(false);
      setEditingProduct(undefined);
      setIsSubmitting(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    setDeletingProductId(null);
  };

  const getCategoryName = (categoryId: string) => {
    return BANARASI_CATEGORIES.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif font-bold text-foreground mb-2">Products</h2>
          <p className="text-muted-foreground">
            Manage your product catalog (in-memory state only)
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
        >
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
            <Button
              onClick={handleCreate}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
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
                  <span className="text-xs">{getCategoryName(product.categoryId)}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {product.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                )}
                {product.variants.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.variants.slice(0, 3).map((variant) => (
                      <span
                        key={variant}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {variant}
                      </span>
                    ))}
                    {product.variants.length > 3 && (
                      <span className="text-xs text-muted-foreground px-2 py-1">
                        +{product.variants.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeletingProductId(product.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl border-border/40">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update product details and save changes'
                : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            product={editingProduct}
            onSubmit={handleSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setEditingProduct(undefined);
            }}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={deletingProductId !== null}
        onOpenChange={(open) => !open && setDeletingProductId(null)}
      >
        <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-border/40">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingProductId && handleDelete(deletingProductId)}
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
