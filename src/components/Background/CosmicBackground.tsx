import { useEffect, useRef } from 'react';

interface MangaDot {
  x: number;
  y: number;
  baseAlpha: number;
  phase: number;
}

interface CyberSpeedLine {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  active: boolean;
}

interface AnimeLaserComet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  active: boolean;
  trail: { x: number; y: number; alpha: number; width: number }[];
}

export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dotsRef = useRef<MangaDot[]>([]);
  const speedLinesRef = useRef<CyberSpeedLine[]>([]);
  const laserRef = useRef<AnimeLaserComet | null>(null);
  const targetBeaconRef = useRef<{ x: number; y: number; phase: number } | null>(null);

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
      initGrid();
    };

    window.addEventListener('resize', handleResize);

    const initGrid = () => {
      // Build a structured halftone screentone dot matrix
      const dots: MangaDot[] = [];
      const spacing = 32;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if ((r + c) % 2 === 0) {
            dots.push({
              x: c * spacing + (r % 2 === 0 ? 0 : spacing / 2),
              y: r * spacing,
              baseAlpha: 0.12,
              phase: Math.random() * Math.PI * 2
            });
          }
        }
      }
      dotsRef.current = dots;

      // Position the Red Team Cyber Beacon
      targetBeaconRef.current = {
        x: width * 0.88,
        y: height * 0.16,
        phase: 0
      };
    };

    initGrid();

    // Spawn an anime speedline periodically
    const maybeSpawnSpeedLine = () => {
      if (Math.random() < 0.04 && speedLinesRef.current.length < 5) {
        speedLinesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 14 + 10,
          alpha: 0.35,
          active: true
        });
      }
    };

    // Blue Laser Streak Spawner
    const spawnLaser = () => {
      laserRef.current = {
        x: -50,
        y: Math.random() * (height * 0.35) + 50,
        vx: 8.5,
        vy: 1.2,
        active: true,
        trail: []
      };
    };

    const laserInterval = setInterval(() => {
      if (!laserRef.current || !laserRef.current.active) {
        spawnLaser();
      }
    }, 18000);

    const firstLaser = setTimeout(spawnLaser, 2000);

    const render = () => {
      // Manga Dark Ink Background
      ctx.fillStyle = '#070709';
      ctx.fillRect(0, 0, width, height);

      const now = performance.now();

      // 1. Draw Manga Screentone Halftone Matrix
      const dots = dotsRef.current;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const alpha = d.baseAlpha + Math.sin(now * 0.002 + d.phase) * 0.04;
        ctx.fillStyle = `rgba(157, 158, 153, ${alpha})`;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Subtle Diagonal Manga Cyber Grid Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const diagonalSpacing = 80;
      for (let x = -height; x < width; x += diagonalSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + height, height);
        ctx.stroke();
      }

      // 3. Draw Anime Speed Lines (Action Manga Hatching)
      maybeSpawnSpeedLine();
      for (let i = speedLinesRef.current.length - 1; i >= 0; i--) {
        const line = speedLinesRef.current[i];
        if (!line.active) {
          speedLinesRef.current.splice(i, 1);
          continue;
        }

        line.x += line.speed;
        line.y += line.speed * 0.25;
        line.alpha -= 0.008;

        if (line.alpha <= 0 || line.x > width + line.length) {
          line.active = false;
          continue;
        }

        ctx.strokeStyle = `rgba(255, 255, 255, ${line.alpha * 0.25})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(line.x + line.length, line.y + line.length * 0.25);
        ctx.stroke();
      }

      // 4. Draw Red Team Cyber Targeting Beacon (Anime Reticle)
      if (targetBeaconRef.current) {
        const b = targetBeaconRef.current;
        b.phase += 0.04;
        const pulse = 0.5 + Math.sin(b.phase) * 0.35;

        // Outer Reticle Ring
        ctx.strokeStyle = `rgba(239, 68, 68, ${pulse * 0.4})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshairs
        ctx.beginPath();
        ctx.moveTo(b.x - 16, b.y);
        ctx.lineTo(b.x + 16, b.y);
        ctx.moveTo(b.x, b.y - 16);
        ctx.lineTo(b.x, b.y + 16);
        ctx.stroke();

        // Red Center Core
        ctx.fillStyle = `rgba(239, 68, 68, ${0.8 * pulse})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Draw Anime Cyber Blue Laser Comet
      const laser = laserRef.current;
      if (laser && laser.active) {
        laser.x += laser.vx;
        laser.y += laser.vy;

        laser.trail.push({
          x: laser.x,
          y: laser.y,
          alpha: 0.8,
          width: 3.5
        });

        // Draw hard comic laser trail
        for (let j = laser.trail.length - 1; j >= 0; j--) {
          const pt = laser.trail[j];
          pt.alpha -= 0.035;
          pt.width *= 0.94;

          if (pt.alpha <= 0) {
            laser.trail.splice(j, 1);
            continue;
          }

          ctx.fillStyle = `rgba(0, 240, 255, ${pt.alpha})`;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, Math.max(0.5, pt.width), 0, Math.PI * 2);
          ctx.fill();
        }

        // White hot laser core
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(laser.x, laser.y, 5, 0, Math.PI * 2);
        ctx.stroke();

        if (laser.x > width + 100) {
          laser.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      clearInterval(laserInterval);
      clearTimeout(firstLaser);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#070709' }}
    />
  );
};
