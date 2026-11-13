"use client";
import { useState } from "react";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { site } from "@/lib/site";

const filters = [
  { label: "All", count: 1 }, { label: "Web Apps", count: 1 },
  { label: "African Language Tech", count: 1 }, { label: "Open Source", count: 0 },
];
export default function ProjectsClient() {
  const [active, setActive] = useState("All");
  const show = active === "All" || active === "Web Apps" || active === "African Language Tech";
  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Project filters">
        {filters.map(f => (
          <button key={f.label} onClick={() => setActive(f.label)} className={`rounded-full px-4 py-2 text-sm transition ${active === f.label ? "btn-primary-glow" : "glass text-white/70 hover:text-white"}`}>{f.label} <span className="opacity-70">{f.count}</span></button>
        ))}
      </div>
      {active === "Open Source" ? (
        <div className="mt-8 rounded-3xl border border-dashed border-violet-300/30 p-10 text-center">
          <p className="font-display text-xl font-bold">No open-source projects showcased yet.</p>
          <p className="mt-2 text-white/60">Honest empty state — follow the work as it ships.</p>
          <a href={site.github} target="_blank" rel="noreferrer" className="btn-primary-glow mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"><Github size={16}/> View GitHub</a>
        </div>
      ) : show && (
        <article className="glass card-lift mt-8 grid overflow-hidden rounded-3xl lg:grid-cols-[1fr_1.05fr]">
          <div className="relative flex flex-col items-center justify-center bg-[#fbfaf6] p-8">
            <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-3 py-1 text-[10px] font-bold tracking-widest text-white">FEATURED</span>
            <Image src="/assets/wazobia-lockup.webp" alt="WAZOBIA — The African Language Ecosystem logo" width={640} height={430} className="w-full max-w-md rounded-xl object-contain" />
            <p className="font-hand mt-4 text-2xl text-[#4a4232]">Africa speaks. Let&apos;s understand every voice.</p>
            <p className="font-mono text-xs text-[#8a7d63]">Nigeria · 2026</p>
          </div>
          <div className="p-7 sm:p-9">
            <div className="flex flex-wrap gap-2">{["Web App", "African Language Tech", "Founder"].map(t => <span key={t} className="chip">{t}</span>)}</div>
            <h3 className="font-display mt-4 text-4xl font-extrabold">WAZOBIA <span className="font-hand text-xl font-normal text-violet-300">the African language ecosystem</span></h3>
            <p className="mt-4 leading-relaxed text-white/70">WAZOBIA is an African language technology ecosystem — Nigeria first, built for Africa. It makes Yorùbá, Hausa and Igbo fully usable in everyday digital tools: translation, structured learning, pronunciation and cultural preservation, with English as a bridge language.</p>
            <p className="mt-3 leading-relaxed text-white/70">A language held only in speech is one generation from being lost. WAZOBIA exists so that learning, translating and preserving an African language does not require leaving it behind.</p>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Role</p>
            <p className="font-display mt-1 font-bold">Founder &amp; Primary Developer</p>
            <div className="mt-2 flex flex-wrap gap-2">{["Frontend Development", "Backend Development", "API Integration", "Product Architecture", "Product Development"].map(c => <span key={c} className="chip text-xs">{c}</span>)}</div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">Stack — verified from live site</p>
            <div className="mt-2 flex flex-wrap gap-2">{["React", "TypeScript", "Vercel"].map(s => <span key={s} className="chip">{s}</span>)}</div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href={site.wazobia} target="_blank" rel="noreferrer" className="btn-primary-glow shimmer-sweep inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"><ExternalLink size={16}/> Visit Live Website</a>
              <a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-violet-300/35 px-5 py-2.5 text-sm font-semibold hover:bg-violet-500/15"><Github size={16}/> GitHub</a>
            </div>
            <p className="mt-4 text-xs text-white/45">One featured project by design — WAZOBIA is live and evolving.</p>
          </div>
        </article>
      )}
    </div>
  );
}
