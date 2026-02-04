import { useEffect, useRef } from 'react';

interface MetadataOptions {
  title?: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
}

export function useDynamicMetadata({ title, description, image, canonicalUrl }: MetadataOptions) {
  const originalTitleRef = useRef<string>('');
  const originalDescriptionRef = useRef<string>('');
  const originalOgImageRef = useRef<string>('');
  const originalOgUrlRef = useRef<string>('');
  const originalCanonicalRef = useRef<string>('');
  const addedMetaTagsRef = useRef<HTMLMetaElement[]>([]);
  const addedLinkTagsRef = useRef<HTMLLinkElement[]>([]);

  useEffect(() => {
    // Store original values on first mount
    if (!originalTitleRef.current) {
      originalTitleRef.current = document.title;
    }
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (!originalDescriptionRef.current && metaDescription) {
      originalDescriptionRef.current = metaDescription.getAttribute('content') || '';
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (!originalOgImageRef.current && ogImage) {
      originalOgImageRef.current = ogImage.getAttribute('content') || '';
    }

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (!originalOgUrlRef.current && ogUrl) {
      originalOgUrlRef.current = ogUrl.getAttribute('content') || '';
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (!originalCanonicalRef.current && canonical) {
      originalCanonicalRef.current = canonical.getAttribute('href') || '';
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
        addedMetaTagsRef.current.push(descMeta as HTMLMetaElement);
      }
      descMeta.setAttribute('content', description);
    }

    // Update Open Graph tags
    if (title) {
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
        addedMetaTagsRef.current.push(ogTitle as HTMLMetaElement);
      }
      ogTitle.setAttribute('content', title);
    }

    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
        addedMetaTagsRef.current.push(ogDesc as HTMLMetaElement);
      }
      ogDesc.setAttribute('content', description);
    }

    if (image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
        addedMetaTagsRef.current.push(ogImage as HTMLMetaElement);
      }
      ogImage.setAttribute('content', image);
    }

    if (canonicalUrl) {
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
        addedMetaTagsRef.current.push(ogUrl as HTMLMetaElement);
      }
      ogUrl.setAttribute('content', canonicalUrl);
    }

    // Update Twitter Card tags
    if (title) {
      let twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (!twitterTitle) {
        twitterTitle = document.createElement('meta');
        twitterTitle.setAttribute('name', 'twitter:title');
        document.head.appendChild(twitterTitle);
        addedMetaTagsRef.current.push(twitterTitle as HTMLMetaElement);
      }
      twitterTitle.setAttribute('content', title);
    }

    if (description) {
      let twitterDesc = document.querySelector('meta[name="twitter:description"]');
      if (!twitterDesc) {
        twitterDesc = document.createElement('meta');
        twitterDesc.setAttribute('name', 'twitter:description');
        document.head.appendChild(twitterDesc);
        addedMetaTagsRef.current.push(twitterDesc as HTMLMetaElement);
      }
      twitterDesc.setAttribute('content', description);
    }

    if (image) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
        addedMetaTagsRef.current.push(twitterImage as HTMLMetaElement);
      }
      twitterImage.setAttribute('content', image);

      let twitterCard = document.querySelector('meta[name="twitter:card"]');
      if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        twitterCard.setAttribute('content', 'summary_large_image');
        document.head.appendChild(twitterCard);
        addedMetaTagsRef.current.push(twitterCard as HTMLMetaElement);
      }
    }

    // Update canonical URL
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
        addedLinkTagsRef.current.push(canonical as HTMLLinkElement);
      }
      canonical.setAttribute('href', canonicalUrl);
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
      if (originalOgImageRef.current) {
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
          ogImage.setAttribute('content', originalOgImageRef.current);
        }
      }
      if (originalOgUrlRef.current) {
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) {
          ogUrl.setAttribute('content', originalOgUrlRef.current);
        }
      }
      if (originalCanonicalRef.current) {
        const canonical = document.querySelector('link[rel="canonical"]');
        if (canonical) {
          canonical.setAttribute('href', originalCanonicalRef.current);
        }
      }

      // Remove any meta/link tags we added
      addedMetaTagsRef.current.forEach((tag) => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
      addedLinkTagsRef.current.forEach((tag) => {
        if (tag.parentNode) {
          tag.parentNode.removeChild(tag);
        }
      });
      addedMetaTagsRef.current = [];
      addedLinkTagsRef.current = [];
    };
  }, [title, description, image, canonicalUrl]);
}
