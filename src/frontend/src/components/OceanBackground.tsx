import { useEffect, useRef } from 'react';

interface FoamParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export default function OceanBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const foamParticlesRef = useRef<FoamParticle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollYRef = useRef(0);
  const prefersReducedMotion = useRef(false);
  
  // Cached noise tables (initialized once)
  const noiseTablesRef = useRef<{
    perm: number[];
    gradP: number[][];
  } | null>(null);

  // Cached sand texture (to prevent flicker)
  const sandTextureRef = useRef<{ x: number; y: number; size: number; alpha: number }[]>([]);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);

    // Mouse tracking via ref (no re-renders)
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Regenerate sand texture on resize
      sandTextureRef.current = [];
      for (let i = 0; i < 80; i++) {
        sandTextureRef.current.push({
          x: Math.random(),
          y: Math.random(),
          size: Math.random() * 2 + 0.5,
          alpha: Math.random() * 0.3 + 0.1
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize noise tables once
    if (!noiseTablesRef.current) {
      const grad3 = [
        [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
        [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
        [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
      ];

      const p: number[] = [];
      for (let i = 0; i < 256; i++) {
        p[i] = Math.floor(Math.random() * 256);
      }

      const perm = new Array(512);
      const gradP = new Array(512);
      for (let i = 0; i < 512; i++) {
        perm[i] = p[i & 255];
        gradP[i] = grad3[perm[i] % 12];
      }

      noiseTablesRef.current = { perm, gradP };
    }

    const { perm, gradP } = noiseTablesRef.current;

    const dot = (g: number[], x: number, y: number) => g[0] * x + g[1] * y;

    const noise2D = (xin: number, yin: number): number => {
      const F2 = 0.5 * (Math.sqrt(3) - 1);
      const G2 = (3 - Math.sqrt(3)) / 6;

      const s = (xin + yin) * F2;
      const i = Math.floor(xin + s);
      const j = Math.floor(yin + s);

      const t = (i + j) * G2;
      const X0 = i - t;
      const Y0 = j - t;
      const x0 = xin - X0;
      const y0 = yin - Y0;

      const i1 = x0 > y0 ? 1 : 0;
      const j1 = x0 > y0 ? 0 : 1;

      const x1 = x0 - i1 + G2;
      const y1 = y0 - j1 + G2;
      const x2 = x0 - 1 + 2 * G2;
      const y2 = y0 - 1 + 2 * G2;

      const ii = i & 255;
      const jj = j & 255;

      let n0 = 0, n1 = 0, n2 = 0;

      let t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 >= 0) {
        t0 *= t0;
        n0 = t0 * t0 * dot(gradP[ii + perm[jj]], x0, y0);
      }

      let t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 >= 0) {
        t1 *= t1;
        n1 = t1 * t1 * dot(gradP[ii + i1 + perm[jj + j1]], x1, y1);
      }

      let t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 >= 0) {
        t2 *= t2;
        n2 = t2 * t2 * dot(gradP[ii + 1 + perm[jj + 1]], x2, y2);
      }

      return 70 * (n0 + n1 + n2);
    };

    const animate = () => {
      if (prefersReducedMotion.current) {
        // Static frame for reduced motion
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw dark navy/black background
        const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        bgGradient.addColorStop(0, '#0A0F1E');
        bgGradient.addColorStop(1, '#0F1928');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw static calm water
        ctx.fillStyle = 'rgba(127, 179, 213, 0.15)';
        ctx.fillRect(0, canvas.height * 0.7, canvas.width, canvas.height * 0.3);

        // Draw static sand at bottom
        const sandHeight = canvas.height * 0.08;
        const sandGradient = ctx.createLinearGradient(0, canvas.height - sandHeight, 0, canvas.height);
        sandGradient.addColorStop(0, 'rgba(40, 35, 30, 0.5)');
        sandGradient.addColorStop(1, 'rgba(25, 22, 20, 0.7)');
        ctx.fillStyle = sandGradient;
        ctx.fillRect(0, canvas.height - sandHeight, canvas.width, sandHeight);

        return;
      }

      timeRef.current += 0.012;
      const time = timeRef.current;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle parallax influences
      const mouseInfluenceX = (mouseRef.current.x - canvas.width / 2) * 0.00008;
      const mouseInfluenceY = (mouseRef.current.y - canvas.height / 2) * 0.00005;
      const scrollInfluence = scrollYRef.current * 0.00005;

      // Draw dark navy/black ocean sky background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0A0F1E');
      bgGradient.addColorStop(0.5, '#0D1422');
      bgGradient.addColorStop(1, '#0F1928');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Wave cycle parameters (bottom-up rolling, crash, recede, repeat)
      // Phase 0-1: approach from bottom
      // Phase 1-2: rise and crash at mid-screen
      // Phase 2-3: recede and settle
      const cycleLength = 8; // seconds per full cycle
      const phase = (time % cycleLength) / cycleLength;

      // Wave base position moves from bottom (below screen) to mid-screen and back
      let waveBaseY: number;
      let waveIntensity: number;
      let crashAmount: number;

      if (phase < 0.4) {
        // Approach phase: wave rises from below
        const t = phase / 0.4;
        waveBaseY = canvas.height * (1.2 - t * 0.5); // 120% to 70%
        waveIntensity = t * 0.8;
        crashAmount = 0;
      } else if (phase < 0.6) {
        // Crash phase: wave breaks at mid-screen
        const t = (phase - 0.4) / 0.2;
        waveBaseY = canvas.height * 0.7;
        waveIntensity = 0.8 + t * 0.2;
        crashAmount = Math.sin(t * Math.PI) * 1.5; // Peak crash
      } else {
        // Recede phase: wave settles back down
        const t = (phase - 0.6) / 0.4;
        waveBaseY = canvas.height * (0.7 + t * 0.5); // 70% to 120%
        waveIntensity = 1 - t * 0.8;
        crashAmount = (1 - t) * 0.3;
      }

      // Draw multiple wave layers for depth
      const waveLayers = 5;
      for (let layer = 0; layer < waveLayers; layer++) {
        const layerDepth = layer / waveLayers;
        const layerOffset = layerDepth * 40;
        const layerY = waveBaseY + layerOffset;
        const layerSpeed = time * (0.8 + layerDepth * 0.4);
        const layerAmplitude = (30 + layerDepth * 20) * waveIntensity;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);

        const wavePoints: { x: number; y: number }[] = [];

        for (let x = 0; x <= canvas.width; x += 6) {
          const noiseValue = noise2D(
            x * 0.003 + layer * 5,
            layerSpeed + mouseInfluenceX + scrollInfluence
          );
          
          // Organic wave distortion
          const distortion = noise2D(x * 0.001, time * 0.5 + layer) * 15;
          
          const y = layerY + 
                    Math.sin(x * 0.01 + layerSpeed) * layerAmplitude +
                    noiseValue * 25 * waveIntensity +
                    Math.sin(x * 0.02 + layerSpeed * 1.3) * (layerAmplitude * 0.4) +
                    distortion +
                    mouseInfluenceY * 30;
          
          wavePoints.push({ x, y });
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(canvas.width, canvas.height);
        ctx.closePath();

        // Wave gradient with depth
        const waveGradient = ctx.createLinearGradient(0, layerY - 80, 0, canvas.height);
        const alpha = 0.12 + layerDepth * 0.18;
        waveGradient.addColorStop(0, `rgba(127, 179, 213, ${alpha * 0.7})`);
        waveGradient.addColorStop(0.3, `rgba(90, 140, 190, ${alpha})`);
        waveGradient.addColorStop(0.7, `rgba(50, 80, 120, ${alpha * 1.1})`);
        waveGradient.addColorStop(1, `rgba(20, 35, 60, ${alpha * 1.3})`);
        
        ctx.fillStyle = waveGradient;
        ctx.fill();

        // Add wave crest highlights on top layer
        if (layer === waveLayers - 1 && waveIntensity > 0.3) {
          ctx.strokeStyle = `rgba(127, 179, 213, ${0.25 * waveIntensity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();

        // Generate foam particles at crash zone (top layer only)
        if (layer === waveLayers - 1 && crashAmount > 0.5 && Math.random() < 0.5) {
          const crashX = Math.random() * canvas.width;
          const crashY = wavePoints[Math.floor(crashX / 6)]?.y || layerY;
          
          foamParticlesRef.current.push({
            x: crashX,
            y: crashY,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 3 - 1,
            life: 1,
            maxLife: Math.random() * 60 + 40,
            size: Math.random() * 3 + 1.5
          });
        }
      }

      // Draw foam crests at crash zone
      if (crashAmount > 0.3) {
        const foamCount = Math.floor(crashAmount * 12);
        for (let i = 0; i < foamCount; i++) {
          const foamX = (i / foamCount) * canvas.width + Math.sin(time * 3 + i) * 40;
          const foamY = waveBaseY + Math.sin(time * 2 + i * 0.5) * 20;
          const foamSize = (20 + Math.sin(time * 4 + i) * 10) * crashAmount;
          const foamAlpha = (0.2 + Math.sin(time * 3 + i) * 0.1) * crashAmount;

          ctx.save();
          ctx.beginPath();
          ctx.arc(foamX, foamY, foamSize, 0, Math.PI * 2);
          
          const foamGradient = ctx.createRadialGradient(foamX, foamY, 0, foamX, foamY, foamSize);
          foamGradient.addColorStop(0, `rgba(255, 255, 255, ${foamAlpha})`);
          foamGradient.addColorStop(0.4, `rgba(127, 179, 213, ${foamAlpha * 0.7})`);
          foamGradient.addColorStop(0.7, `rgba(100, 200, 220, ${foamAlpha * 0.4})`);
          foamGradient.addColorStop(1, 'rgba(127, 179, 213, 0)');
          
          ctx.fillStyle = foamGradient;
          ctx.fill();
          ctx.restore();
        }
      }

      // Update and draw foam particles
      foamParticlesRef.current = foamParticlesRef.current.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;
        p.vy += 0.08; // Gravity
        p.vx *= 0.99; // Air resistance

        if (p.life > 0) {
          const alpha = (p.life / p.maxLife) * 0.7;
          
          // Particle glow (pearl blue/teal)
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          const glowGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
          glowGradient.addColorStop(0, `rgba(100, 200, 220, ${alpha * 0.5})`);
          glowGradient.addColorStop(0.5, `rgba(127, 179, 213, ${alpha * 0.3})`);
          glowGradient.addColorStop(1, 'rgba(127, 179, 213, 0)');
          ctx.fillStyle = glowGradient;
          ctx.fill();
          ctx.restore();

          // Particle core (white foam)
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();

          // Subtle sparkle
          if (Math.random() < 0.1) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(100, 200, 220, ${alpha * 0.8})`;
            ctx.fill();
          }

          return true;
        }
        return false;
      });

      // Limit particle count for performance
      if (foamParticlesRef.current.length > 200) {
        foamParticlesRef.current = foamParticlesRef.current.slice(-200);
      }

      // Draw thin dark wet sand/soil band at bottom (stable, no flicker)
      const sandHeight = canvas.height * 0.06;
      const sandGradient = ctx.createLinearGradient(0, canvas.height - sandHeight, 0, canvas.height);
      sandGradient.addColorStop(0, 'rgba(40, 35, 30, 0.5)');
      sandGradient.addColorStop(0.5, 'rgba(30, 27, 25, 0.65)');
      sandGradient.addColorStop(1, 'rgba(25, 22, 20, 0.75)');
      ctx.fillStyle = sandGradient;
      ctx.fillRect(0, canvas.height - sandHeight, canvas.width, sandHeight);

      // Add stable sand texture (cached)
      sandTextureRef.current.forEach(grain => {
        const x = grain.x * canvas.width;
        const y = canvas.height - grain.y * sandHeight;
        ctx.fillStyle = `rgba(60, 55, 50, ${grain.alpha})`;
        ctx.fillRect(x, y, grain.size, grain.size);
      });

      // Add subtle gold shimmer on sand (stable positions)
      for (let i = 0; i < 4; i++) {
        const shimmerX = (i / 4 + 0.1) * canvas.width + Math.sin(time * 2 + i) * 15;
        const shimmerY = canvas.height - sandHeight * 0.4;
        const shimmerSize = 3 + Math.sin(time * 3 + i) * 1.5;
        const shimmerAlpha = Math.sin(time * 2.5 + i) * 0.2 + 0.2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(shimmerX, shimmerY, shimmerSize, 0, Math.PI * 2);
        const shimmerGradient = ctx.createRadialGradient(shimmerX, shimmerY, 0, shimmerX, shimmerY, shimmerSize);
        shimmerGradient.addColorStop(0, `rgba(212, 175, 55, ${shimmerAlpha})`);
        shimmerGradient.addColorStop(0.6, `rgba(212, 175, 55, ${shimmerAlpha * 0.5})`);
        shimmerGradient.addColorStop(1, 'rgba(212, 175, 55, 0)');
        ctx.fillStyle = shimmerGradient;
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []); // Empty deps - no re-initialization on mouse move

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.55 }}
      aria-hidden="true"
    />
  );
}
