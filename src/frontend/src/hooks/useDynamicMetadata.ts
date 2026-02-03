import { useEffect, useRef } from 'react';

interface MetadataOptions {
  title?: string;
  description?: string;
}

export function useDynamicMetadata({ title, description }: MetadataOptions) {
  const originalTitleRef = useRef<string>('');
  const originalDescriptionRef = useRef<string>('');

  useEffect(() => {
    // Store original values on first mount
    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!originalDescriptionRef.current && metaDescription) {
      originalDescriptionRef.current = metaDescription.getAttribute('content') || '';
    }

    // Update title
    if (title) {
      document.title = title;
    }

    // Update description
    if (description) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', description);
    }

    // Cleanup: restore original values
    return () => {
      if (originalTitleRef.current) {
        document.title = originalTitleRef.current;
      }
      if (originalDescriptionRef.current) {
        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta) {
          descMeta.setAttribute('content', originalDescriptionRef.current);
        }
      }
    };
  }, [title, description]);
}
