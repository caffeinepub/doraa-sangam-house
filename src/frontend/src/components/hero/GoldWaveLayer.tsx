import { useEffect, useRef } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface GoldWaveLayerProps {
  isActive: boolean;
  slideIndex: number;
}

export default function GoldWaveLayer({
  isActive,
  slideIndex,
}: GoldWaveLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let animationId: number;
    let time = 0;

    const drawWave = (
      yOffset: number,
      amplitude: number,
      frequency: number,
      phase: number,
      opacity: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x < canvas.width; x++) {
        const y =
          yOffset +
          Math.sin((x * frequency + phase) * 0.01) * amplitude +
          Math.sin((x * frequency * 0.5 + phase * 1.3) * 0.01) * (amplitude * 0.5);
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();

      const gradient = ctx.createLinearGradient(0, yOffset - amplitude, 0, canvas.height);
      gradient.addColorStop(0, `oklch(0.72 0.12 70 / ${opacity * 0.15})`);
      gradient.addColorStop(0.5, `oklch(0.72 0.12 70 / ${opacity * 0.08})`);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion) {
        time += 0.5;

        // Multiple flowing gold waves
        drawWave(canvas.height * 0.7, 40, 1, time, 1);
        drawWave(canvas.height * 0.75, 30, 1.2, time * 1.1, 0.8);
        drawWave(canvas.height * 0.8, 25, 0.8, time * 0.9, 0.6);
      } else {
        // Static waves for reduced motion
        drawWave(canvas.height * 0.7, 40, 1, 0, 0.8);
        drawWave(canvas.height * 0.8, 25, 0.8, 0, 0.5);
      }

      if (isActive || !prefersReducedMotion) {
        animationId = requestAnimationFrame(animate);
      }
    };

    if (isActive) {
      animate();
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [isActive, slideIndex, prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: isActive ? 1 : 0 }}
    />
  );
}
