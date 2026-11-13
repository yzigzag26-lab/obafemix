"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, BarChart3, Code2, Heart, Quote, Wrench, Zap } from "lucide-react";
import { SKILLS, SKILL_FILTERS, type Skill } from "@/lib/skills";
import OrbitGlobe from "./OrbitGlobe";

function SkillCard({ skill, index, animate }: { skill: Skill; index: number; animate: boolean }) {
  return (
    <div className="group relative flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#0b0620]/70 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:shadow-[0_16px_50px_rgba(139,92,246,0.22)]" style={{ transitionDelay: `${(index % 8) * 20}ms` }}>
      <span style={{ color: skill.color }} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.04] transition-colors group-hover:bg-white/[0.07]">
        <Wrench className="hidden" />
        <span aria-hidden className="flex h-6 w-6 items-center justify-center rounded-md font-display text-[11px] font-extrabold" style={{ background: `${skill.color}22`, color: skill.color }}>{skill.name.slice(0, 2).toUpperCase()}</span>
      </span>
      <span className="mt-3 flex items-start justify-between gap-2">
        <span title={skill.name} className="min-w-0 flex-1 text-[13px] font-semibold leading-snug text-white [overflow-wrap:anywhere]">{skill.name}</span>
        <span className="shrink-0 font-mono text-xs text-white/60">{skill.percent}%</span>
      </span>
      <span className="mt-2 block h-1 w-full overflow-hidden rounded-full bg-white/10">
        <span className="block h-full rounded-full bg-gradient-to-r from-violet-500 via-violet-400 to-indigo-400 shadow-[0_0_12px_rgba(139,92,246,0.6)] transition-[width] duration-1000 ease-out" style={{ width: animate ? `${skill.percent}%` : "0%", transitionDelay: `${200 + (index % 8) * 60}ms` }} />
      </span>
      <span className="mt-2 block text-[11px] text-white/60">{skill.category}</span>
    </div>
  );
}

const STATS = [
  { icon: Code2, value: "10+", label: "Technologies" },
  { icon: Zap, value: "100%", label: "Self Taught" },
  { icon: BarChart3, value: "5+", label: "Major Projects" },
  { icon: Heart, value: "Always", label: "Learning" },
];

export default function SkillsClient() {
  const [filter, setFilter] = useState<(typeof SKILL_FILTERS)[number]>("All");
  const [animate, setAnimate] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (filter === "All" ? SKILLS.filter((s) => s.featured) : SKILLS.filter((s) => s.category === filter)),
    [filter]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from this browser's localStorage after mount (SSR-safe)
    setAnimate(false);
    const t = setTimeout(() => setAnimate(true), 60);
    return () => clearTimeout(t);
  }, [filter]);

  useEffect(() => {
    const el = gridRef.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setAnimate(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="skills" className="relative overflow-x-clip py-24">
      <div aria-hidden className="absolute inset-0 bg-[url('/assets/skills-bg.webp')] bg-cover opacity-15" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05010f] via-[#05010f]/80 to-[#05010f]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.6fr] lg:gap-6">
          {/* Left: orbiting globe (reference image 2, in motion) */}
          <div className="pt-2 lg:sticky lg:top-28">
            <OrbitGlobe />
            <figure className="relative mx-auto mt-8 max-w-sm rounded-xl border border-white/10 bg-black/40 px-5 pb-4 pt-6 backdrop-blur-xl">
              <Quote aria-hidden className="float-slow absolute -top-3 left-4 h-6 w-6 fill-violet-500 text-violet-400 drop-shadow-[0_0_12px_rgba(139,92,246,0.9)]" />
              <blockquote className="text-sm leading-relaxed text-white/85">Tools are important,<br />but curiosity builds better developers.</blockquote>
              <span aria-hidden className="mt-2.5 block h-[2px] w-6 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(139,92,246,0.9)]" />
            </figure>
          </div>

          {/* Right: header + filters + cards (exact reference layout) */}
          <div className="min-w-0">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-500/10 px-3.5 py-1 text-[13px] font-medium text-violet-200">
                <Zap className="h-3.5 w-3.5 fill-violet-400 text-violet-400" /> My Toolbox
              </span>
              <h2 className="font-display mx-auto mt-3 max-w-4xl text-[clamp(2.25rem,5vw,3.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
                Skills that build <span className="text-gradient">possibilities</span>
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-sm text-white/55 sm:text-base">A curated set of technologies, tools and skills I use to turn ideas into reality.</p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter skills by category">
              {SKILL_FILTERS.map((f) => {
                const active = filter === f;
                return (
                  <button key={f} role="tab" aria-selected={active} onClick={() => setFilter(f)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-300 hover:-translate-y-0.5 ${active ? "btn-primary-glow border-violet-300/60 text-white" : "border-white/10 bg-white/[0.03] text-white/65 backdrop-blur-md hover:border-violet-400/40 hover:text-white"}`}>
                    {f}
                  </button>
                );
              })}
            </div>
            {filter === "All" && <p className="mt-2.5 text-xs text-white/60">Showing {visible.length} of {SKILLS.length} — select a category to explore everything.</p>}
            {filter !== "All" && <p className="mt-2.5 text-xs text-white/60">Showing {visible.length} in {filter}.</p>}

            <div ref={gridRef} className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {visible.map((s, i) => <SkillCard key={s.id} skill={s} index={i} animate={animate} />)}
              {visible.length === 0 && <p className="rounded-2xl border border-dashed border-violet-300/25 p-6 text-sm text-white/55 sm:col-span-2 xl:col-span-4">Nothing here yet — honest empty state.</p>}
            </div>
          </div>
        </div>

        {/* Bottom: stats + Better Projects Ahead */}
        <div className="mt-10 grid items-end gap-4 lg:grid-cols-[1fr_280px]">
          <div className="glass relative overflow-hidden rounded-2xl px-5 py-4 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:px-6">
            <span aria-hidden className="shimmer-sweep absolute left-0 top-0 h-px w-full" />
            <span className="grid grid-cols-2 gap-x-4 gap-y-4 lg:grid-cols-4">
              {STATS.map((s, i) => (
                <span key={s.label} className={`flex min-w-0 items-center gap-3 ${i !== 0 ? "lg:border-l lg:border-white/10 lg:pl-5" : ""}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300 shadow-[0_0_18px_rgba(139,92,246,0.35)]"><s.icon className="h-4 w-4" /></span>
                  <span className="min-w-0"><span className="font-display block text-lg font-bold leading-tight text-white">{s.value}</span><span className="block break-words text-[11px] text-white/50">{s.label}</span></span>
                </span>
              ))}
            </span>
          </div>
          <a href="#projects" className="group relative flex min-w-0 items-center justify-between gap-4 overflow-hidden rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-600/25 via-[#0b0620]/80 to-indigo-600/20 p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-violet-300/60 hover:shadow-[0_20px_60px_rgba(139,92,246,0.35)]" aria-label="Back to projects">
            <span className="font-hand text-[28px] font-semibold leading-[1.05] text-violet-300">Better<br />Projects<br />Ahead...</span>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-violet-300/50 text-white transition-all group-hover:bg-violet-500/25 group-hover:shadow-[0_0_24px_rgba(139,92,246,0.6)]"><ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
