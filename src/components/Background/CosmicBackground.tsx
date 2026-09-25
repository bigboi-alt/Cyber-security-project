import { useEffect, useRef } from 'react';

export const CosmicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      render();
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      // 1. Manta / Matte Black Base
      ctx.fillStyle = '#060608';
      ctx.fillRect(0, 0, width, height);

      // 2. Linear Gradient for Top-to-Bottom Grid Fade
      const gridFade = ctx.createLinearGradient(0, 0, 0, height);
      gridFade.addColorStop(0, 'rgba(255, 255, 255, 0.09)');
      gridFade.addColorStop(0.2, 'rgba(255, 255, 255, 0.07)');
      gridFade.addColorStop(0.55, 'rgba(255, 255, 255, 0.025)');
      gridFade.addColorStop(0.85, 'rgba(255, 255, 255, 0.005)');
      gridFade.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

      // Grid Spacing
      const spacingX = 48;
      const spacingY = 48;

      ctx.lineWidth = 1;
      ctx.strokeStyle = gridFade;

      // Draw Vertical Grid Lines
      for (let x = 0; x <= width; x += spacingX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Draw Horizontal Grid Lines with Progressive Vertical Alpha
      for (let y = 0; y <= height; y += spacingY) {
        const factor = Math.max(0, 1 - (y / (height * 0.85)));
        if (factor <= 0) continue;

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.06 * factor * factor})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Subtle Vignette Depth Shadow at corners
      const vignette = ctx.createRadialGradient(
        width / 2, height * 0.25, 100,
        width / 2, height / 2, Math.max(width, height) * 0.75
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(3, 3, 5, 0.8)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: '#060608' }}
    />
  );
};

