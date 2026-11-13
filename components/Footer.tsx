import Link from "next/link";
import Image from "next/image";
import { Activity, ArrowRight, ArrowUp, ArrowUpRight, Github, Heart, Linkedin, Mail, Sparkle } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import { site } from "@/lib/site";

const QUICK = [
  { label: "Home", href: "#top" }, { label: "About", href: "#about" }, { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" }, { label: "Contact", href: "#contact" },
];
const DIVIDER = "min-w-0 lg:border-l lg:border-white/10 lg:pl-10";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Full-bleed cinematic background (reference image 1) */}
      <div aria-hidden className="absolute inset-0">
        <Image src="/assets/footer-bg.webp" alt="" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-[#05010f]/55" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05010f]/85 via-[#05010f]/25 to-[#05010f]/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#05010f] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-8 pt-14 sm:px-8 lg:px-10 lg:pt-16">
        {/* ===== Thanks for Visiting ===== */}
        <Reveal className="flex flex-col items-center text-center">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/[0.06] px-5 py-2 font-mono text-[11px] tracking-[0.32em] text-white/70 backdrop-blur-md">{"// END OF THE JOURNEY"}</span>
          <h2 className="font-display mt-6 text-[clamp(2.4rem,3.6vw,3.4rem)] font-extrabold leading-[1.1] tracking-tight text-white">
            Thanks for <span className="text-gradient">Visiting!</span>
          </h2>
          <p className="mt-4 max-w-[580px] text-[16.5px] leading-[1.6] text-white/70 sm:text-[17px]">
            Let&apos;s build something amazing together. Stay curious, keep building, and I&apos;ll see you around the internet!
          </p>
          <div aria-hidden className="mt-8 flex w-full max-w-[620px] items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-white/25" />
            <Sparkle className="h-4 w-4 shrink-0 fill-violet-400 text-violet-300 drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-white/25" />
          </div>
        </Reveal>

        {/* ===== Four columns ===== */}
        <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:mt-10 lg:grid-cols-[1.5fr_1fr_1fr_1.15fr] lg:gap-x-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Logo size={44} />
              <span className="font-display text-2xl font-semibold tracking-tight text-white">OBAFEMIX</span>
            </div>
            <p className="mt-3.5 max-w-[290px] text-[15px] leading-relaxed text-white/60">Building ideas into reality through code, creativity, and curiosity.</p>
            <p className="mt-2 text-xs text-white/35">aka Linuxboss · Lagos State, Nigeria</p>
            <div className="mt-6 flex gap-3">
              <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white backdrop-blur-md transition-all hover:border-violet-400/50 hover:bg-violet-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"><Github className="h-[18px] w-[18px]" /></a>
              <span title="Coming soon" aria-disabled="true" className="flex h-11 w-11 cursor-not-allowed items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-[#0a66c2] opacity-70 backdrop-blur-md"><Linkedin className="h-[18px] w-[18px]" /></span>
              <a href="#top" aria-label="Back to top" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white backdrop-blur-md transition-all hover:border-violet-400/50 hover:bg-violet-500/10"><ArrowUp className="h-[18px] w-[18px]" /></a>
            </div>
          </div>

          <nav className={DIVIDER} aria-label="Quick links">
            <h3 className="font-display text-[17px] font-semibold text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {QUICK.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="group flex items-center justify-between gap-6 py-0.5 text-[15px] text-white/65 transition-colors hover:text-white">
                    <span>{l.label}</span>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-violet-300" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={DIVIDER}>
            <h3 className="font-display text-[17px] font-semibold text-white">Other Places</h3>
            <ul className="mt-4 space-y-2.5">
              <li><a href={site.github} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-0.5 text-[15px] text-white/65 transition-colors hover:text-white"><span>GitHub</span><ArrowUpRight className="h-4 w-4 shrink-0 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></li>
              <li><a href={site.wazobia} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-0.5 text-[15px] text-white/65 transition-colors hover:text-white"><span>WAZOBIA — Live</span><ArrowUpRight className="h-4 w-4 shrink-0 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></li>
              <li><span title="Coming soon" className="flex cursor-not-allowed items-center justify-between gap-6 py-0.5 text-[15px] text-white/40"><span>LinkedIn — coming soon</span><span className="chip text-[9px]">SOON</span></span></li>
              <li><a href={site.maps} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-6 py-0.5 text-[15px] text-white/65 transition-colors hover:text-white"><span>Lagos, Nigeria</span><ArrowUpRight className="h-4 w-4 shrink-0 text-violet-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></li>
            </ul>
          </div>

          <div className={DIVIDER}>
            <h3 className="font-display text-[17px] font-semibold text-white">Let&apos;s Connect</h3>
            <p className="mt-3 max-w-[280px] text-[15px] leading-relaxed text-white/60">Open to collaborations, interesting projects, and exciting opportunities.</p>
            <a href="#contact" className="group mt-5 inline-flex h-12 items-center gap-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 px-6 text-[15px] font-semibold text-white shadow-[0_0_30px_rgba(109,80,246,0.45)] transition-all hover:brightness-110 hover:shadow-[0_0_40px_rgba(124,58,237,0.65)] active:scale-[0.99]">
              <Mail className="h-4 w-4" /> Send a Message <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="font-hand mt-5 text-xl text-violet-200/85">Dream · Code · Build · Innovate</p>
          </div>
        </div>

        {/* ===== Bottom bar ===== */}
        <div className="mt-10 flex flex-col items-center gap-2.5 rounded-xl border border-white/10 bg-[#0a051c]/70 px-5 py-3.5 backdrop-blur-md sm:flex-row sm:justify-between sm:gap-4 lg:mt-14">
          <p className="text-center text-[13.5px] text-white/55 sm:text-left">
            © 2026 OBAFEMIX. All rights reserved.<span className="mx-1.5 text-white/25">|</span>
            <Link href="/privacy" className="underline-offset-4 transition-colors hover:text-white hover:underline">Privacy</Link>
          </p>
          <div aria-hidden className="hidden items-center gap-2.5 md:flex">
            <Activity className="h-3.5 w-3.5 text-violet-400" />
            <span className="font-mono text-[11.5px] tracking-[0.28em] text-white/60">IDEAS <span className="text-white/30">✕</span> CODE <span className="text-white/30">✕</span> IMPACT</span>
          </div>
          <p className="flex flex-wrap items-center justify-center gap-x-1.5 text-center text-[13.5px] text-white/55">
            Made with <Heart className="h-3.5 w-3.5 fill-[#ff5c8a] text-[#ff5c8a]" /> in Nigeria <span className="mx-1 text-white/25">|</span> Keep Building <ArrowRight className="h-3.5 w-3.5" />
          </p>
        </div>
      </div>
    </footer>
  );
}
