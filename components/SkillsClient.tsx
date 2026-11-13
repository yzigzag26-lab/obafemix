"use client";
import { useState } from "react";
import { Code2, Database, Globe, Layout, Terminal, Wrench, Server, Braces, FileCode2, GitBranch, Github, Rocket, Eye, Network, MonitorSmartphone } from "lucide-react";
import Reveal from "./Reveal";

const cats = ["All", "Frontend", "Backend & Databases", "Dev Tools", "Systems & Networking"] as const;
const skills = [
  { name: "HTML", cat: "Frontend", icon: FileCode2 }, { name: "CSS", cat: "Frontend", icon: Layout },
  { name: "JavaScript", cat: "Frontend", icon: Braces }, { name: "TypeScript", cat: "Frontend", icon: Code2 },
  { name: "React", cat: "Frontend", icon: Globe },
  { name: "Node.js", cat: "Backend & Databases", icon: Server }, { name: "REST APIs", cat: "Backend & Databases", icon: Network },
  { name: "MongoDB", cat: "Backend & Databases", icon: Database }, { name: "Supabase", cat: "Backend & Databases", icon: Database },
  { name: "Git", cat: "Dev Tools", icon: GitBranch }, { name: "GitHub", cat: "Dev Tools", icon: Github },
  { name: "VS Code", cat: "Dev Tools", icon: MonitorSmartphone }, { name: "Vercel", cat: "Dev Tools", icon: Rocket },
  { name: "Swagger", cat: "Dev Tools", icon: Eye },
  { name: "Linux", cat: "Systems & Networking", icon: Terminal }, { name: "Networking", cat: "Systems & Networking", icon: Network },
];
export default function SkillsClient() {
  const [active, setActive] = useState<(typeof cats)[number]>("All");
  const shown = active === "All" ? skills : skills.filter(s => s.cat === active);
  return (
    <section id="skills" className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0 bg-[url('/assets/skills-bg.webp')] bg-cover opacity-20" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05010f] via-[#05010f]/85 to-[#05010f]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">My Toolbox</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">Skills that build <span className="text-gradient">possibilities.</span></h2>
          <p className="mt-3 max-w-xl text-white/60">Honest levels, no percentages — beginner → intermediate across the board. I learn by shipping real projects.</p>
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              {cats.map(c => (
                <button key={c} onClick={() => setActive(c)} className={`rounded-full px-4 py-2 text-sm transition ${active === c ? "btn-primary-glow" : "glass text-white/70 hover:text-white"}`}>{c} <span className="opacity-70">{c === "All" ? skills.length : skills.filter(s => s.cat === c).length}</span></button>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {shown.map(s => (
                <div key={s.name} className="glass card-lift flex items-center gap-3 rounded-2xl p-4 hover:shadow-[0_0_28px_-8px_rgba(139,92,246,.7)]">
                  <span className="rounded-xl bg-violet-500/20 p-2.5 text-violet-200"><s.icon size={20} /></span>
                  <span><span className="block font-semibold">{s.name}</span><span className="block font-mono text-[10px] uppercase tracking-wider text-white/45">{s.cat}</span></span>
                </div>
              ))}
            </div>
          </div>
          <Reveal>
            <div className="glass rounded-3xl p-6">
              <p className="font-hand text-2xl leading-snug text-violet-100">Tools are important, but curiosity builds better developers. — OBAFEMIX</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[["16", "Technologies"], ["1", "Flagship Product"], ["WAZOBIA", "African Language Tech"], ["Always", "Learning"]].map(([n, l]) => (
                  <div key={l} className="rounded-2xl border border-violet-300/15 bg-violet-500/5 p-4"><p className="font-display text-lg font-extrabold text-violet-200">{n}</p><p className="text-xs text-white/55">{l}</p></div>
                ))}
              </div>
              <a href="#projects" className="font-hand mt-6 inline-block text-2xl text-violet-300 hover:text-violet-200">Better projects ahead ↓</a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
