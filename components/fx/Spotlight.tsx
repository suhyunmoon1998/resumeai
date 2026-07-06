"use client";

import { useEffect, useRef } from "react";

/** Soft radial glow that follows the cursor across the wrapped section. */
export default function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      glow.style.opacity = "1";
      glow.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${
        e.clientY - rect.top
      }px, rgba(245, 158, 11, 0.14), transparent 55%)`;
    };
    const onLeave = () => {
      glow.style.opacity = "0";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300"
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
