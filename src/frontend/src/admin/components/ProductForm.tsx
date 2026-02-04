import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { AdminProductFormData, AdminProduct } from '../types';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import ImageDropzone from './ImageDropzone';

interface ProductFormProps {
  product?: AdminProduct;
  onSubmit: (data: AdminProductFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isSubmitting }: ProductFormProps) {
  const [formData, setFormData] = useState<AdminProductFormData>({
    name: product?.name || '',
    price: product?.price?.toString() || '',
    description: product?.description || '',
    fabric: product?.fabric || '',
    categoryId: product?.categoryId || '',
    variants: product?.variants || [],
    blousePairing: product?.blousePairing || '',
    images: product?.images || [],
  });

  const [variantInput, setVariantInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addVariant = () => {
    if (variantInput.trim() && !formData.variants.includes(variantInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        variants: [...prev.variants, variantInput.trim()],
      }));
      setVariantInput('');
    }
  };

  const removeVariant = (variant: string) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((v) => v !== variant),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Product Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Royal Banarasi Silk Saree"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Price (₹) *</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
          placeholder="e.g., 12999"
          className={errors.price ? 'border-destructive' : ''}
        />
        {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {BANARASI_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Describe the product..."
          rows={4}
        />
      </div>

      {/* Fabric */}
      <div className="space-y-2">
        <Label htmlFor="fabric">Fabric</Label>
        <Input
          id="fabric"
          value={formData.fabric}
          onChange={(e) => setFormData((prev) => ({ ...prev, fabric: e.target.value }))}
          placeholder="e.g., Pure Silk, Katan Silk"
        />
      </div>

      {/* Variants */}
      <div className="space-y-2">
        <Label>Variants</Label>
        <div className="flex gap-2">
          <Input
            value={variantInput}
            onChange={(e) => setVariantInput(e.target.value)}
            placeholder="e.g., Red, Blue, Gold"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addVariant();
              }
            }}
          />
          <Button type="button" onClick={addVariant} size="icon" variant="outline">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {formData.variants.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.variants.map((variant) => (
              <div
                key={variant}
                className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
              >
                <span>{variant}</span>
                <button
                  type="button"
                  onClick={() => removeVariant(variant)}
                  className="hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blouse Pairing */}
      <div className="space-y-2">
        <Label htmlFor="blousePairing">Blouse Pairing Suggestion</Label>
        <Input
          id="blousePairing"
          value={formData.blousePairing}
          onChange={(e) => setFormData((prev) => ({ ...prev, blousePairing: e.target.value }))}
          placeholder="e.g., Gold embroidered blouse"
        />
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>Product Images</Label>
        <ImageDropzone
          images={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
