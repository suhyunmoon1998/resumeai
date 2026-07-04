"use client";

import { useEffect, useRef, useState } from "react";

/** Gradient dot + trailing ring cursor. Desktop (fine pointer) only. */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.body.classList.add("custom-cursor-on");

    let x = -100;
    let y = -100;
    let ringX = -100;
    let ringY = -100;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const dot = dotRef.current;
      if (dot) dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
    };

    const onOver = (e: MouseEvent) => {
      const interactive = (e.target as Element | null)?.closest?.(
        "a, button, [role='button'], label, summary"
      );
      ringRef.current?.classList.toggle("cursor-hover", !!interactive);
    };

    const loop = () => {
      ringX += (x - ringX) * 0.16;
      ringY += (y - ringY) * 0.16;
      const ring = ringRef.current;
      if (ring) {
        const half = ring.offsetWidth / 2;
        ring.style.transform = `translate(${ringX - half}px, ${ringY - half}px)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.body.classList.remove("custom-cursor-on");
    };
  }, []);

  if (!enabled) return null;
  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}
