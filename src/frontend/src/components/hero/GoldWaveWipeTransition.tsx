import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface GoldWaveWipeTransitionProps {
  isTransitioning: boolean;
}

export default function GoldWaveWipeTransition({
  isTransitioning,
}: GoldWaveWipeTransitionProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isTransitioning) return null;

  return (
    <div className="absolute inset-0 z-40 pointer-events-none overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-accent/30 to-transparent ${
          prefersReducedMotion ? 'gold-wipe-reduced' : 'gold-wipe'
        }`}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent ${
          prefersReducedMotion ? 'gold-wipe-reduced' : 'gold-wipe'
        }`}
        style={{
          backgroundSize: '200% 100%',
          animationDelay: '0.1s',
        }}
      />
    </div>
  );
}
