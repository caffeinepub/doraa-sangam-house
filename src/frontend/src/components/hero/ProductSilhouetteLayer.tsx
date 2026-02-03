import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface ProductSilhouetteLayerProps {
  isActive: boolean;
  slideIndex: number;
}

export default function ProductSilhouetteLayer({
  isActive,
  slideIndex,
}: ProductSilhouetteLayerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const silhouettes = [
    { left: '10%', top: '20%', size: 120, delay: 0 },
    { left: '80%', top: '30%', size: 100, delay: 200 },
    { left: '15%', top: '70%', size: 90, delay: 400 },
    { left: '85%', top: '65%', size: 110, delay: 600 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {silhouettes.map((silhouette, index) => (
        <div
          key={index}
          className={`absolute rounded-full bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 transition-all duration-1000 ${
            isActive && !prefersReducedMotion
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-50'
          }`}
          style={{
            left: silhouette.left,
            top: silhouette.top,
            width: `${silhouette.size}px`,
            height: `${silhouette.size}px`,
            transitionDelay: `${silhouette.delay}ms`,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/5 to-transparent animate-pulse" />
        </div>
      ))}
    </div>
  );
}
