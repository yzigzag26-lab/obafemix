import Image from "next/image";
import { BookOpen, Code2, Cpu, Globe2, GraduationCap, Heart, Lightbulb, Rocket, Target, Wrench, ExternalLink, Github } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

export function About() {
  const tiles = [
    { icon: GraduationCap, label: "Currently", value: "Student Developer — learning in public" },
    { icon: Target, label: "Focus", value: "Full-stack web, APIs & backend systems" },
    { icon: Rocket, label: "Role", value: "Founder & Primary Developer — WAZOBIA" },
    { icon: Lightbulb, label: "Approach", value: "Ideas into production, not prototypes" },
  ];
  const enjoy = [
    { icon: Code2, label: "Web Development" }, { icon: Cpu, label: "Backend Systems & APIs" },
    { icon: Wrench, label: "Problem Solving" }, { icon: Globe2, label: "Linux & Open Source" },
    { icon: Rocket, label: "Building Real Products" }, { icon: BookOpen, label: "Exploring Technology" },
  ];
  return (
    <section id="about" className="relative overflow-hidden py-24">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_20%,rgba(139,92,246,.16),transparent)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <p className="eyebrow">{"// 01. ABOUT ME"}</p>
          <h2 className="font-display mt-3 text-4xl font-extrabold sm:text-5xl">More than just a <span className="text-gradient">developer.</span></h2>
        </Reveal>
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="flex flex-col items-center rounded-[2rem] border border-violet-300/20 px-8 py-12 text-center" style={{ background: "radial-gradient(circle at 50% 30%, rgba(139,92,246,.35), #0d0724 65%)", boxShadow: "0 0 80px -20px rgba(139,92,246,.55)" }}>
              <Logo size={180} />
              <p className="font-display mt-6 text-3xl font-extrabold tracking-tight">OBAFEMIX</p>
              <div className="my-4 h-px w-24 bg-gradient-to-r from-transparent via-violet-400 to-transparent" />
              <p className="font-hand text-2xl text-violet-200">Dream · Code · Build · Innovate</p>
              <p className="mt-3 font-mono text-xs tracking-[.3em] text-white/50">NIGERIA · LAGOS STATE</p>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[["16", "Technologies"], ["1", "Flagship Product"], ["Always", "Curious"]].map(([n, l]) => (
                <div key={l} className="glass card-lift rounded-2xl p-4 text-center"><p className="font-display text-xl font-extrabold text-violet-200">{n}</p><p className="mt-1 text-xs text-white/55">{l}</p></div>
              ))}
            </div>
          </Reveal>
          <Reveal>
            <div className="space-y-4 leading-relaxed text-white/70">
              <p>I&apos;m OBAFEMIX — a student developer and full-stack developer based in Lagos State, Nigeria. I love turning ideas into real-world applications, and I&apos;m currently the Founder &amp; Primary Developer of WAZOBIA, an African language technology ecosystem.</p>
              <p>I work across the full arc of a product: building complete web applications, connecting frontends to APIs, and developing the backend systems behind them. I&apos;m at a beginner-to-intermediate level by my own honest measure — and I grow the way real software gets built: by shipping, breaking, reading the error and fixing it.</p>
              <p className="font-hand text-2xl text-violet-200">Linuxboss is what the tech streets call me — OBAFEMIX is the name on everything I ship.</p>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {tiles.map(t => (
                <div key={t.label} className="glass card-lift rounded-2xl p-4"><t.icon className="text-violet-300" size={20} /><p className="mt-2 font-mono text-[10px] uppercase tracking-[.25em] text-violet-300/80">{t.label}</p><p className="mt-1 text-sm font-medium">{t.value}</p></div>
              ))}
            </div>
            <h3 className="font-display mt-8 flex items-center gap-2 font-bold"><Heart size={17} className="text-violet-300" /> What I Enjoy</h3>
            <div className="mt-3 flex flex-wrap gap-2">{enjoy.map(e => <span key={e.label} className="chip"><e.icon size={14} className="text-violet-300" />{e.label}</span>)}</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  return (
    <section id="projects" className="relative overflow-hidden py-24">
      <Image src="/assets/project-bg.webp" alt="" fill className="object-cover opacity-25" aria-hidden />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[#05010f] via-[#05010f]/80 to-[#05010f]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <ProjectsClient />
      </div>
    </section>
  );
}

import ProjectsClient from "./ProjectsClient";
import SkillsClient from "./SkillsClient";
import ContactClient from "./ContactClient";
export function Skills() { return <SkillsClient />; }
export function Contact() { return <ContactClient />; }
export { ProjectsClient };
