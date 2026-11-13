"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Brain, Code2, Globe, Github, LayoutGrid, Star, Wrench } from "lucide-react";
import { site } from "@/lib/site";
import { defaultProject, type Project } from "@/lib/projects";

const FILTER_ICONS: Record<string, typeof LayoutGrid> = {
  All: LayoutGrid, "Web Apps": Globe, "African Language Tech": Globe, "AI / ML": Brain,
  Tools: Wrench, "Open Source": Code2, "Mobile Apps": Globe, "Backend & APIs": Wrench, Other: LayoutGrid,
};

function ProjectCard({ p, index }: { p: Project; index: number }) {
  const tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const external = p.image.startsWith("data:") || p.image.startsWith("http");
  const cover = external ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={p.image} alt={`${p.title} preview`} className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
  ) : (
    <Image src={p.image} alt={`${p.title} preview`} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.05]" />
  );
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-[#0b0620]/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 ${p.featured ? "border-violet-400/40 shadow-[0_0_50px_rgba(139,92,246,0.25)] hover:border-violet-300/70" : "border-white/10 hover:border-violet-400/40 hover:shadow-[0_20px_60px_rgba(139,92,246,0.2)]"}`}
      style={{ transitionDelay: `${index * 30}ms` }}
    >
      {p.featured && (
        <span className="glass absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border-violet-300/40 px-3.5 py-1.5 text-xs font-semibold text-violet-100 shadow-[0_0_24px_rgba(139,92,246,0.5)]">
          <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" /> Featured
        </span>
      )}
      <a href={p.liveUrl || p.githubUrl || "#projects"} {...(p.liveUrl || p.githubUrl ? { target: "_blank", rel: "noreferrer" } : {})} aria-label={`${p.title} live demo`} className="relative block aspect-[16/10] overflow-hidden bg-[#fbfaf6]">
        {cover}
        <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b0620] via-transparent to-transparent opacity-80" />
        <span aria-hidden className="glass absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-white/0 transition-all duration-300 group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
      </a>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="rounded-full border border-violet-300/25 bg-violet-500/10 px-3 py-1 text-[11px] font-medium text-violet-200/90">{t}</span>
          ))}
        </div>
        <h3 className="font-display mt-4 text-[22px] font-bold tracking-tight text-white">{p.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-white/60 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] overflow-hidden">{p.description}</p>
        {(p.stack.length > 0) && <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-white/40">{p.stack.join(" · ")}</p>}
        <div className="mt-5 flex items-center justify-between">
          {p.liveUrl ? (
            <a href={p.liveUrl} target="_blank" rel="noreferrer" className="group/link inline-flex items-center gap-2 text-[15px] font-semibold text-violet-400 transition-colors hover:text-violet-200">
              View Project <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1.5" />
            </a>
          ) : <span />}
          {p.githubUrl && (
            <a href={p.githubUrl} target="_blank" rel="noreferrer" aria-label={`${p.title} source code on GitHub`} title="Source code" className="flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/40 text-violet-200 transition-all duration-300 hover:border-violet-300 hover:bg-violet-500/20 hover:text-white hover:shadow-[0_0_24px_rgba(139,92,246,0.5)]">
              <Github className="h-[18px] w-[18px]" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function ProjectsClient() {
  const [active, setActive] = useState("All");
  const [projects, setProjects] = useState<Project[]>([defaultProject]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("obafemix.adminDraft");
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (Array.isArray(draft.projects) && draft.projects.length) setProjects(draft.projects);
    } catch { /* keep defaults */ }
  }, []);

  const filters = useMemo(() => {
    const cats = Array.from(new Set(projects.map((p) => p.category)));
    const order = ["Web Apps", "African Language Tech", "AI / ML", "Tools", "Open Source"];
    const sorted = [...order.filter((c) => cats.includes(c)), ...cats.filter((c) => !order.includes(c))];
    return [{ label: "All Projects", value: "All" }, ...sorted.map((c) => ({ label: c, value: c }))];
  }, [projects]);

  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div className="relative">
      {/* Header — exact reference */}
      <div className="relative">
        <p className="font-mono text-[13px] tracking-[0.35em] text-white/70">{"// 02. PROJECTS"}</p>
        <h2 className="font-display mx-auto mt-4 max-w-4xl text-center text-[clamp(2rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight text-white">
          Projects that solve <span className="text-gradient">real problems.</span>
        </h2>
        <p className="mt-3 text-center text-base text-white/55 sm:text-lg">A blend of creativity, technology and purpose.</p>
        <span aria-hidden className="absolute -top-2 right-0 hidden rotate-[8deg] select-none text-right font-mono text-sm italic leading-tight text-violet-400/80 drop-shadow-[0_0_12px_rgba(139,92,246,0.8)] xl:block">Ideas<br />Code<br />Impact</span>
      </div>

      {/* Filters */}
      <div className="mt-9 flex flex-wrap items-center justify-center gap-3" role="tablist" aria-label="Filter projects by category">
        {filters.map((f) => {
          const Icon = FILTER_ICONS[f.value] ?? LayoutGrid;
          const isActive = active === f.value;
          const count = f.value === "All" ? projects.length : projects.filter((p) => p.category === f.value).length;
          return (
            <button key={f.value} role="tab" aria-selected={isActive} onClick={() => setActive(f.value)}
              className={`inline-flex items-center gap-2.5 rounded-full border px-6 py-3 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${isActive ? "btn-primary-glow border-violet-300/60 text-white" : "border-white/10 bg-white/[0.03] text-white/65 backdrop-blur-md hover:border-violet-400/40 hover:text-white hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"}`}>
              <Icon className="h-4 w-4" /> {f.label} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid — exact reference card */}
      {shown.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-dashed border-violet-300/30 p-10 text-center">
          <p className="font-display text-xl font-bold">No {active} projects showcased yet.</p>
          <p className="mt-2 text-white/60">Honest empty state — follow the work as it ships.</p>
          <a href={site.github} target="_blank" rel="noreferrer" className="btn-primary-glow mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"><Github size={16} /> View GitHub</a>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
        </div>
      )}

      <div className="relative mt-14">
        <span aria-hidden className="absolute -left-2 -top-10 hidden rotate-[-10deg] select-none font-mono text-sm italic leading-tight text-violet-400/80 drop-shadow-[0_0_12px_rgba(139,92,246,0.8)] xl:block">Build<br />Solve<br />Grow</span>
        <p aria-hidden className="text-outline font-display pointer-events-none select-none text-center font-extrabold tracking-tight" style={{ fontSize: "clamp(2.4rem,8vw,6rem)" }}>BUILD·SOLVE·GROW</p>
      </div>
    </div>
  );
}
