"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { site } from "@/lib/site";
import { defaultProject, filtersFor, type Project } from "@/lib/projects";

function ProjectCard({ p }: { p: Project }) {
  const tags = p.tags.split(",").map((t) => t.trim()).filter(Boolean);
  const isDataOrExternal = p.image.startsWith("data:") || p.image.startsWith("http");
  return (
    <article className="glass card-lift mt-8 grid overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.05fr]">
      <div className="relative flex flex-col items-center justify-center bg-[#fbfaf6] p-8">
        {p.featured && <span className="absolute left-4 top-4 z-10 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold tracking-widest text-white">FEATURED</span>}
        {p.status && p.status !== "Live" && <span className="absolute right-4 top-4 z-10 rounded-full bg-[#0d0724] px-3 py-1 text-[10px] font-bold tracking-widest text-white">{p.status.toUpperCase()}</span>}
        {isDataOrExternal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.image} alt={p.imageAlt || p.title} className="max-h-[430px] w-full max-w-md rounded-xl object-contain" />
        ) : (
          <Image src={p.image} alt={p.imageAlt || p.title} width={640} height={430} className="w-full max-w-md rounded-xl object-contain" />
        )}
        {p.caption && <p className="font-hand mt-4 text-center text-2xl text-[#4a4232]">{p.caption}</p>}
        <p className="font-mono text-xs text-[#8a7d63]">{p.location} · {p.year}</p>
      </div>
      <div className="p-7 sm:p-9">
        <div className="flex flex-wrap gap-2">{tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
        <h3 className="font-display mt-4 text-4xl font-extrabold">{p.title} {p.aside && <span className="font-hand text-xl font-normal text-violet-300">{p.aside}</span>}</h3>
        <p className="mt-4 leading-relaxed text-white/70">{p.description}</p>
        {p.description2 && <p className="mt-3 leading-relaxed text-white/70">{p.description2}</p>}
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Role</p>
        <p className="font-display mt-1 font-bold">{p.role}</p>
        {p.contributions.length > 0 && <div className="mt-2 flex flex-wrap gap-2">{p.contributions.map((c) => <span key={c} className="chip text-xs">{c}</span>)}</div>}
        {p.stack.length > 0 && <>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Stack{p.id === "wazobia" ? " — verified from live site" : ""}</p>
          <div className="mt-2 flex flex-wrap gap-2">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </>}
        <div className="mt-7 flex flex-wrap gap-3">
          {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="btn-primary-glow shimmer-sweep inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"><ExternalLink size={16} /> Visit Live Website</a>}
          {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-violet-300/35 px-5 py-2.5 text-sm font-semibold hover:bg-violet-500/15"><Github size={16} /> GitHub</a>}
        </div>
        {p.id === "wazobia" && <p className="mt-4 text-xs text-white/45">One featured project by design — WAZOBIA is live and evolving.</p>}
      </div>
    </article>
  );
}

export default function ProjectsClient() {
  const [active, setActive] = useState("All");
  const [projects, setProjects] = useState<Project[]>([defaultProject]);

  // Projects added/edited in /admin/dashboard (same browser) replace the defaults on the site.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("obafemix.adminDraft");
      if (!raw) return;
      const draft = JSON.parse(raw);
      if (Array.isArray(draft.projects) && draft.projects.length) setProjects(draft.projects);
    } catch { /* keep defaults */ }
  }, []);

  const filters = useMemo(() => filtersFor(projects), [projects]);
  const shown = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Project filters">
        {filters.map((f) => (
          <button key={f.label} onClick={() => setActive(f.label)} className={`rounded-full px-4 py-2 text-sm transition ${active === f.label ? "btn-primary-glow" : "glass text-white/70 hover:text-white"}`}>{f.label} <span className="opacity-70">{f.count}</span></button>
        ))}
      </div>
      {shown.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-dashed border-violet-300/30 p-10 text-center">
          <p className="font-display text-xl font-bold">No {active} projects showcased yet.</p>
          <p className="mt-2 text-white/60">Honest empty state — follow the work as it ships.</p>
          <a href={site.github} target="_blank" rel="noreferrer" className="btn-primary-glow mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"><Github size={16} /> View GitHub</a>
        </div>
      ) : shown.map((p) => <ProjectCard key={p.id} p={p} />)}
    </div>
  );
}
