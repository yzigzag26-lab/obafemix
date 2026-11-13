"use client";
import { useEffect, useRef, type ReactNode } from "react";
export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const fallback = setTimeout(() => el.classList.add("is-visible"), 1400);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); clearTimeout(fallback); } }, { threshold: 0.12 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}
