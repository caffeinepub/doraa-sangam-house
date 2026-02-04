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
import { Checkbox } from '@/components/ui/checkbox';
import { AdminProductFormData, AdminProduct, FABRIC_PRESETS, COLOR_SWATCHES, SIZE_OPTIONS } from '../types';
import { ADMIN_PRODUCT_CATEGORIES } from '../data/adminProductCategories';
import ImageDropzone from './ImageDropzone';
import { toast } from 'sonner';

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
    fabricCustom: product?.fabricCustom || '',
    categoryId: product?.categoryId || '',
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    blousePairing: product?.blousePairing || '',
    images: product?.images || [],
  });

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

    if (!formData.fabric) {
      newErrors.fabric = 'Please select a fabric type';
    }

    if (formData.fabric === 'Custom' && !formData.fabricCustom?.trim()) {
      newErrors.fabricCustom = 'Please enter custom fabric details';
    }

    if (formData.images.length < 5) {
      newErrors.images = 'Please upload at least 5 images';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix the errors before saving');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const toggleColor = (colorName: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }));
  };

  const toggleSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
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
          <SelectTrigger className={`admin-interactive-glow ${errors.categoryId ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {ADMIN_PRODUCT_CATEGORIES.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
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
        <Label htmlFor="fabric">Fabric *</Label>
        <Select
          value={formData.fabric}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, fabric: value }))}
        >
          <SelectTrigger className={`admin-interactive-glow ${errors.fabric ? 'border-destructive' : ''}`}>
            <SelectValue placeholder="Select fabric type" />
          </SelectTrigger>
          <SelectContent>
            {FABRIC_PRESETS.map((fabric) => (
              <SelectItem key={fabric} value={fabric}>
                {fabric}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.fabric && <p className="text-xs text-destructive">{errors.fabric}</p>}
      </div>

      {/* Custom Fabric Input */}
      {formData.fabric === 'Custom' && (
        <div className="space-y-2">
          <Label htmlFor="fabricCustom">Custom Fabric Details *</Label>
          <Input
            id="fabricCustom"
            value={formData.fabricCustom || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, fabricCustom: e.target.value }))}
            placeholder="e.g., Handwoven Cotton Blend"
            className={errors.fabricCustom ? 'border-destructive' : ''}
          />
          {errors.fabricCustom && <p className="text-xs text-destructive">{errors.fabricCustom}</p>}
        </div>
      )}

      {/* Color Variants */}
      <div className="space-y-3">
        <Label>Color Variants</Label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {COLOR_SWATCHES.map((color) => (
            <div
              key={color.name}
              className="flex flex-col items-center gap-2 cursor-pointer group"
              onClick={() => toggleColor(color.name)}
            >
              <div
                className={`w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                  formData.colors.includes(color.name)
                    ? 'border-primary shadow-glow-pearl scale-110'
                    : 'border-border/40 group-hover:border-primary/50 group-hover:scale-105'
                }`}
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs text-center text-muted-foreground group-hover:text-foreground transition-colors">
                {color.name}
              </span>
            </div>
          ))}
        </div>
        {formData.colors.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {formData.colors.join(', ')}
          </p>
        )}
      </div>

      {/* Size Options */}
      <div className="space-y-3">
        <Label>Available Sizes</Label>
        <div className="flex flex-wrap gap-3">
          {SIZE_OPTIONS.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <Checkbox
                id={`size-${size}`}
                checked={formData.sizes.includes(size)}
                onCheckedChange={() => toggleSize(size)}
              />
              <label
                htmlFor={`size-${size}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {size}
              </label>
            </div>
          ))}
        </div>
        {formData.sizes.length > 0 && (
          <p className="text-xs text-muted-foreground">
            Selected: {formData.sizes.join(', ')}
          </p>
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
        <Label>Product Images * (5-10 images required)</Label>
        <ImageDropzone
          images={formData.images}
          onChange={(images) => setFormData((prev) => ({ ...prev, images }))}
        />
        {errors.images && <p className="text-xs text-destructive">{errors.images}</p>}
        <p className="text-xs text-muted-foreground">
          {formData.images.length} / 10 images uploaded (minimum 5 required)
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 admin-primary-button"
        >
          {isSubmitting ? 'Saving...' : product ? 'Update Product' : 'Save Product'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
