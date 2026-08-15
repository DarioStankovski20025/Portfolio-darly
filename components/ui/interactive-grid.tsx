"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

type InteractiveGridProps = {
  className?: string;
  /** Distance between grid nodes in CSS pixels. */
  spacing?: number;
  /** Radius of the pointer's influence in CSS pixels. */
  radius?: number;
  /** Node displacement at the centre of the pointer field. */
  strength?: number;
  /** Push nodes away from the pointer, or draw them in. */
  mode?: "repel" | "attract";
  baseColor?: string;
  accentColor?: string;
  /** Idle wave amplitude. 0 disables the ambient drift. */
  ambient?: number;
  /** Draws faint links between excited nodes. */
  link?: boolean;
};

type Node = { x: number; y: number };

/**
 * Canvas field of grid nodes that respond to the pointer.
 *
 * Everything is drawn in one 2D context on a single rAF loop; the loop stops
 * entirely when the element scrolls out of view, when the tab is hidden, or
 * when the visitor prefers reduced motion (which paints one static frame).
 * On touch devices an automatic attractor drifts across the field instead.
 */
export function InteractiveGrid({
  className,
  spacing = 34,
  radius = 230,
  strength = 16,
  mode = "repel",
  baseColor = "7, 17, 31",
  accentColor = "36, 107, 253",
  ambient = 2.2,
  link = false,
}: InteractiveGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let frame = 0;
    let running = false;
    let start = performance.now();

    // Pointer target and its smoothed follower.
    const target = { x: -9999, y: -9999, active: false };
    const pointer = { x: -9999, y: -9999, amount: 0 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      nodes = [];
      const cols = Math.ceil(width / spacing) + 1;
      const rows = Math.ceil(height / spacing) + 1;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          nodes.push({ x: offsetX + c * spacing, y: offsetY + r * spacing });
        }
      }
    };

    const draw = (time: number) => {
      const t = (time - start) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Touch devices get a slow lissajous attractor so the field still breathes.
      if (coarse && !reduced) {
        target.x = width * (0.5 + 0.32 * Math.sin(t * 0.34));
        target.y = height * (0.5 + 0.26 * Math.cos(t * 0.23));
        target.active = true;
      }

      pointer.x += (target.x - pointer.x) * 0.12;
      pointer.y += (target.y - pointer.y) * 0.12;
      pointer.amount += ((target.active ? 1 : 0) - pointer.amount) * 0.08;

      const r2 = radius * radius;
      const excited: Array<{ x: number; y: number; f: number }> = [];

      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        let x = node.x;
        let y = node.y;

        if (ambient > 0 && !reduced) {
          x += Math.sin(node.y * 0.014 + t * 0.5) * ambient;
          y += Math.cos(node.x * 0.012 - t * 0.42) * ambient;
        }

        let energy = 0;

        if (pointer.amount > 0.01) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const d2 = dx * dx + dy * dy;

          if (d2 < r2) {
            const d = Math.sqrt(d2) || 1;
            const falloff = 1 - d / radius;
            energy = falloff * falloff * pointer.amount;
            const shift = energy * strength;
            const sign = mode === "repel" ? -1 : 1;
            x += (dx / d) * shift * sign;
            y += (dy / d) * shift * sign;
          }
        }

        const size = 1.5 + energy * 2.6;
        if (energy > 0.04) {
          ctx.fillStyle = `rgba(${accentColor}, ${0.22 + energy * 0.78})`;
          if (link && energy > 0.45) excited.push({ x, y, f: energy });
        } else {
          ctx.fillStyle = `rgba(${baseColor}, 0.17)`;
        }

        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Short connections between the most excited nodes read as structure
      // forming under the cursor rather than as decoration.
      if (link && excited.length > 1) {
        const maxLinkDist = spacing * 1.6;
        ctx.lineWidth = 1;
        for (let i = 0; i < excited.length; i += 1) {
          for (let j = i + 1; j < excited.length; j += 1) {
            const dx = excited[i].x - excited[j].x;
            const dy = excited[i].y - excited[j].y;
            const d = Math.hypot(dx, dy);
            if (d > maxLinkDist) continue;
            const alpha = (1 - d / maxLinkDist) * Math.min(excited[i].f, excited[j].f) * 0.5;
            ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(excited[i].x, excited[i].y);
            ctx.lineTo(excited[j].x, excited[j].y);
            ctx.stroke();
          }
        }
      }

      if (running) frame = requestAnimationFrame(draw);
    };

    const play = () => {
      if (running || reduced) return;
      running = true;
      start = performance.now() - 1000;
      frame = requestAnimationFrame(draw);
    };

    const pause = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (coarse) return;
      const rect = canvas.getBoundingClientRect();
      target.x = event.clientX - rect.left;
      target.y = event.clientY - rect.top;
      target.active =
        target.x > -radius &&
        target.y > -radius &&
        target.x < rect.width + radius &&
        target.y < rect.height + radius;
    };

    const onPointerLeave = () => {
      if (!coarse) target.active = false;
    };

    build();
    draw(performance.now());

    const resizeObserver = new ResizeObserver(() => {
      build();
      if (reduced) draw(performance.now());
    });
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : pause()),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const onVisibility = () => (document.hidden ? pause() : play());

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      pause();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [spacing, radius, strength, mode, baseColor, accentColor, ambient, link]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none block size-full", className)}
    />
  );
}
