import { useEffect, useRef } from 'react';

export default function GoldWaveLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion.current) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let time = 0;

    const animate = () => {
      time += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const waveCount = 3;
      for (let i = 0; i < waveCount; i++) {
        ctx.save();
        ctx.beginPath();

        const yOffset = canvas.height * 0.5 + i * 80;
        const amplitude = 40 + i * 15;
        const frequency = 0.008 - i * 0.001;

        ctx.moveTo(0, yOffset);

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = yOffset + Math.sin(x * frequency + time + i * 0.5) * amplitude;
          ctx.lineTo(x, y);
        }

        ctx.strokeStyle = `rgba(201, 169, 110, ${0.15 - i * 0.03})`;
        ctx.lineWidth = 2 + i;
        ctx.stroke();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  if (prefersReducedMotion.current) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  );
}
