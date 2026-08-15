"use client";

import { useEffect, useRef } from "react";

/**
 * ParticleSphereAnimation
 *
 * The centre of the stack orbit. Points are distributed with a Fibonacci
 * lattice so they stay evenly spaced, rotated on the Y axis with a fixed tilt,
 * and projected with a simple perspective divide — depth drives size, opacity
 * and how far each point is tinted toward the Darly accent.
 *
 * One canvas, one rAF loop, no dependencies. The loop is suspended whenever the
 * element leaves the viewport or the tab is hidden, and reduced-motion visitors
 * get a single static frame.
 */
export default function ParticleSphereAnimation({
  count = 1100,
  className,
}: {
  count?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const total = window.innerWidth < 768 ? Math.round(count * 0.6) : count;

    // Evenly distributed unit-sphere points (Fibonacci lattice).
    const golden = Math.PI * (3 - Math.sqrt(5));
    const px = new Float32Array(total);
    const py = new Float32Array(total);
    const pz = new Float32Array(total);

    for (let i = 0; i < total; i += 1) {
      const y = 1 - (i / (total - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = i * golden;
      px[i] = Math.cos(theta) * radius;
      py[i] = y;
      pz[i] = Math.sin(theta) * radius;
    }

    const TILT = -0.38;
    const sinT = Math.sin(TILT);
    const cosT = Math.cos(TILT);

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;
    let angle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const R = Math.min(width, height) * 0.46;
      const fov = 3.2;

      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      for (let i = 0; i < total; i += 1) {
        // rotate around Y
        const x1 = px[i] * cosA + pz[i] * sinA;
        const z1 = pz[i] * cosA - px[i] * sinA;
        // tilt around X
        const y2 = py[i] * cosT - z1 * sinT;
        const z2 = py[i] * sinT + z1 * cosT;

        const scale = fov / (fov + z2);
        const sx = cx + x1 * R * scale;
        const sy = cy + y2 * R * scale;

        // 0 at the back of the sphere, 1 at the front
        const depth = (z2 + 1) / 2;
        const alpha = 0.1 + depth * 0.72;
        const size = 0.6 + depth * 1.7;

        // Points recede into the accent and resolve to paper white at the front.
        const r = Math.round(49 + depth * 196);
        const g = Math.round(92 + depth * 153);
        const b = Math.round(255 - depth * 15);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fillRect(sx, sy, size, size);
      }

      if (running) {
        angle += 0.0022;
        frame = requestAnimationFrame(render);
      }
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      frame = requestAnimationFrame(render);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    resize();
    render();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (!running) render();
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className={className ?? "block size-full"} />;
}
