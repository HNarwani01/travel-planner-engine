'use client';
import React, { useEffect } from 'react';

export default function Starfield() {
  useEffect(() => {
    const canvas = document.getElementById('bg-starfield') as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W: number, H: number;
    let stars: { x: number, y: number, r: number, color: string, speed: number, alpha: number, phase: number }[] = [];
    let animationFrameId: number;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function randomRange(a: number, b: number) { return a + Math.random() * (b - a); }

    function initStars() {
      stars = [];
      const numStars = Math.floor((W * H) / 2000);
      for (let i = 0; i < numStars; i++) {
        const type = Math.random();
        let color = '#FFFFFF';
        if (type > 0.95) color = '#6C63FF';
        else if (type > 0.9) color = '#FF6B6B';
        
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: randomRange(0.2, 1.2),
          color,
          speed: randomRange(0.0005, 0.002),
          alpha: randomRange(0.1, 0.8),
          phase: randomRange(0, Math.PI * 2)
        });
      }
    }

    function drawStars(t: number) {
      ctx!.clearRect(0, 0, W, H);
      stars.forEach(s => {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(t * s.speed * 1000 + s.phase));
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.color === '#FFFFFF'
          ? `rgba(255,255,255,${a})`
          : s.color === '#6C63FF'
            ? `rgba(108,99,255,${a})`
            : `rgba(255,107,107,${a})`;
        ctx!.fill();
      });
    }

    function loop(t: number) {
      drawStars(t / 1000);
      animationFrameId = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => { resize(); initStars(); });
    resize();
    initStars();
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      id="bg-starfield" 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
}
