import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  twinkleSpeed: number;
  phase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface BlueComet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  tail: { x: number; y: number; alpha: number }[];
  active: boolean;
}

export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const shootingStarsRef = useRef<ShootingStar[]>([]);
  const cometRef = useRef<BlueComet | null>(null);
  const redStarRef = useRef<{ x: number; y: number; radius: number; phase: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const initStars = () => {
      const starCount = Math.floor((width * height) / 5000);
      const stars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.3,
          baseAlpha: Math.random() * 0.5 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.008,
          phase: Math.random() * Math.PI * 2
        });
      }
      starsRef.current = stars;

      // Position the rare red twinkling star
      redStarRef.current = {
        x: width * 0.85,
        y: height * 0.18,
        radius: 2.2,
        phase: 0
      };
    };

    initStars();

    // Subtle shooting star every few seconds
    const maybeSpawnShootingStar = () => {
      if (Math.random() < 0.008 && shootingStarsRef.current.length < 2) {
        shootingStarsRef.current.push({
          x: Math.random() * width * 0.7,
          y: Math.random() * height * 0.4,
          length: Math.random() * 60 + 40,
          speed: Math.random() * 7 + 5,
          angle: Math.PI / 4,
          opacity: 0.8,
          active: true
        });
      }
    };

    // Blue comet manager (spawns periodically, travels left to right)
    const spawnComet = () => {
      cometRef.current = {
        x: -40,
        y: Math.random() * (height * 0.4) + 60,
        vx: 3.2,
        vy: 0.5,
        radius: 3.5,
        tail: [],
        active: true
      };
    };

    const cometInterval = setInterval(() => {
      if (!cometRef.current || !cometRef.current.active) {
        spawnComet();
      }
    }, 20000);

    // Initial comet after 3s
    const firstComet = setTimeout(spawnComet, 3000);

    const render = () => {
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      const now = performance.now();

      // Draw subtle white twinkling stars
      starsRef.current.forEach((star) => {
        const alpha = star.baseAlpha + Math.sin(now * star.twinkleSpeed + star.phase) * 0.25;
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.max(0.1, Math.min(0.85, alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // Draw Rare Red Twinkling Star
      if (redStarRef.current) {
        const rs = redStarRef.current;
        rs.phase += 0.03;
        const redAlpha = 0.4 + (Math.sin(rs.phase) + 1) * 0.3;

        // Subtle red aura
        ctx.fillStyle = `rgba(239, 68, 68, ${redAlpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(rs.x, rs.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `rgba(248, 113, 113, ${redAlpha})`;
        ctx.beginPath();
        ctx.arc(rs.x, rs.y, rs.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw Shooting Stars
      maybeSpawnShootingStar();
      for (let i = shootingStarsRef.current.length - 1; i >= 0; i--) {
        const s = shootingStarsRef.current[i];
        if (!s.active) {
          shootingStarsRef.current.splice(i, 1);
          continue;
        }

        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.opacity -= 0.016;

        if (s.opacity <= 0 || s.x > width || s.y > height) {
          s.active = false;
          continue;
        }

        const tailX = s.x - Math.cos(s.angle) * s.length;
        const tailY = s.y - Math.sin(s.angle) * s.length;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.opacity})`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }

      // Draw Blue Comet going left to right
      const comet = cometRef.current;
      if (comet && comet.active) {
        comet.x += comet.vx;
        comet.y += comet.vy;

        comet.tail.push({
          x: comet.x,
          y: comet.y,
          alpha: 0.7
        });

        // Tail
        for (let j = comet.tail.length - 1; j >= 0; j--) {
          const pt = comet.tail[j];
          pt.alpha -= 0.025;
          if (pt.alpha <= 0) {
            comet.tail.splice(j, 1);
            continue;
          }
          ctx.fillStyle = `rgba(56, 189, 248, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Blue head
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, 1.8, 0, Math.PI * 2);
        ctx.fill();

        if (comet.x > width + 50) {
          comet.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearInterval(cometInterval);
      clearTimeout(firstComet);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#09090b' }}
    />
  );
};
