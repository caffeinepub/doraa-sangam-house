import { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdminProductImage } from '../types';
import { toast } from 'sonner';

interface ImageDropzoneProps {
  images: AdminProductImage[];
  onChange: (images: AdminProductImage[]) => void;
}

const MAX_IMAGES = 10;

export default function ImageDropzone({ images, onChange }: ImageDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = MAX_IMAGES - images.length;
      
      if (files.length > remainingSlots) {
        toast.error(`You can only upload ${remainingSlots} more image${remainingSlots !== 1 ? 's' : ''}. Maximum ${MAX_IMAGES} images allowed.`);
        return;
      }

      const validFiles = Array.from(files).filter((file) => {
        if (!file.type.startsWith('image/')) {
          toast.error(`${file.name} is not an image file. Please select only images.`);
          return false;
        }
        return true;
      });

      if (validFiles.length === 0) return;

      const newImages: AdminProductImage[] = validFiles.map((file) => ({
        id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        url: URL.createObjectURL(file),
        file,
      }));

      onChange([...images, ...newImages]);
    },
    [images, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeImage = useCallback(
    (id: string) => {
      const imageToRemove = images.find((img) => img.id === id);
      if (imageToRemove?.url.startsWith('blob:')) {
        URL.revokeObjectURL(imageToRemove.url);
      }
      onChange(images.filter((img) => img.id !== id));
    },
    [images, onChange]
  );

  const isMaxReached = images.length >= MAX_IMAGES;

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : isMaxReached
            ? 'border-border/20 bg-muted/20 opacity-50 cursor-not-allowed'
            : 'border-border/40 hover:border-primary/50 bg-card/30 admin-interactive-glow'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          disabled={isMaxReached}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {isMaxReached ? 'Maximum images reached' : 'Drop images here or click to select'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isMaxReached
                ? `Remove some images to upload more (max ${MAX_IMAGES})`
                : `Upload 5-${MAX_IMAGES} images (${images.length}/${MAX_IMAGES})`}
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-lg overflow-hidden bg-muted border border-border/40"
            >
              <img
                src={image.url}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(image.id)}
                  className="shadow-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
                <ImageIcon className="w-3 h-3 text-primary" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
