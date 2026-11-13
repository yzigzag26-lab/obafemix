"use client";
import { Atom, Cloud, Figma, Hexagon, Lightbulb, FileCode2 } from "lucide-react";

/** Second reference image, rebuilt in pure React/CSS:
    a glowing globe reading "Build Learn Improve Repeat" with skill
    tiles orbiting it (orbit ring rotates, tiles counter-rotate to stay upright). */
const orbiters = [
  { label: "React", Icon: Atom, color: "#61DAFB" },
  { label: "Node.js", Icon: Hexagon, color: "#8cc84b" },
  { label: "Figma", Icon: Figma, color: "#f24e1e" },
  { label: "Problem Solving", Icon: Lightbulb, color: "#a78bfa" },
  { label: "AWS", Icon: Cloud, color: "#ff9900" },
  { label: "Python", Icon: FileCode2, color: "#3776AB" },
];

export default function OrbitGlobe() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px]" role="img" aria-label="Orbiting toolbox globe: Build, Learn, Improve, Repeat — React, Node.js, Python, Figma, AWS and Problem Solving">
      {/* glow + rings */}
      <div aria-hidden className="absolute inset-[16%] rounded-full bg-violet-600/25 blur-3xl" />
      <div aria-hidden className="absolute inset-[7%] rounded-full border border-violet-300/15" />
      <div aria-hidden className="absolute inset-0 rounded-full border border-violet-300/10" />
      {/* globe */}
      <div aria-hidden className="absolute inset-[24%] overflow-hidden rounded-full border border-violet-300/30 shadow-[inset_-18px_-14px_50px_rgba(5,1,15,.85),0_0_70px_rgba(109,40,217,.55)]" style={{ background: "radial-gradient(circle at 34% 30%, #7c5cd6 0%, #4c2a9e 34%, #22104f 68%, #0d0724 100%)" }}>
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 62% 26%, rgba(255,255,255,.5) 0 5%, transparent 6%), radial-gradient(circle at 30% 62%, rgba(167,139,250,.55) 0 9%, transparent 10%), radial-gradient(circle at 72% 70%, rgba(167,139,250,.4) 0 7%, transparent 8%)" }} />
        <div className="flex h-full flex-col items-center justify-center text-center font-display text-[clamp(1rem,2.2vw,1.35rem)] font-semibold leading-snug text-white/95">
          <span>Build</span><span>Learn</span><span>Improve</span><span>Repeat</span>
        </div>
      </div>
      {/* orbiting tiles */}
      <div aria-hidden className="orbit-ring absolute inset-0">
        {orbiters.map((o, i) => {
          const angle = (360 / orbiters.length) * i;
          return (
            <span key={o.label} className="absolute left-1/2 top-1/2" style={{ transform: `rotate(${angle}deg) translateY(calc(var(--orbit-r, 190px) * -1))` }}>
              <span className="orbit-tile flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1.5" style={{ ["--a" as string]: `${angle}deg` }}>
                <span className="glass flex h-14 w-14 items-center justify-center rounded-2xl shadow-[0_0_26px_rgba(139,92,246,.35)] sm:h-16 sm:w-16" style={{ color: o.color }}>
                  <o.Icon className="h-7 w-7" />
                </span>
                <span className="whitespace-nowrap text-xs font-medium text-white/80">{o.label}</span>
              </span>
            </span>
          );
        })}
      </div>
      <style>{`
        .orbit-ring { animation: orbit-spin 36s linear infinite; --orbit-r: clamp(104px, 36vw, 196px); }
        .orbit-tile { animation: orbit-counter 36s linear infinite; }
        @keyframes orbit-spin { to { transform: rotate(360deg); } }
        @keyframes orbit-counter { from { transform: rotate(calc(var(--a) * -1)); } to { transform: rotate(calc(var(--a) * -1 - 360deg)); } }
        @media (prefers-reduced-motion: reduce) { .orbit-ring, .orbit-tile { animation: none; } }
      `}</style>
    </div>
  );
}
