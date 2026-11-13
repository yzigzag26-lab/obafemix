import Link from "next/link";
import { ArrowUp, Github, Linkedin, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { navLinks, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-violet-300/10 pt-16">
      <p aria-hidden className="text-outline font-display pointer-events-none absolute -bottom-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap font-extrabold opacity-60" style={{ fontSize: "clamp(4rem,14vw,11rem)" }}>OBAFEMIX</p>
      <div className="relative mx-auto max-w-7xl px-4 pb-28 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <div className="flex items-center gap-2.5"><Logo size={40} /><span className="font-display text-lg font-extrabold">OBAFEMIX</span></div>
            <p className="mt-1 font-mono text-xs text-violet-300/70">Student · Full-Stack · Founder</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">Building complete web applications, connecting frontends to APIs, and turning ideas into working software — from Lagos State, Nigeria.</p>
            <p className="mt-2 text-xs text-white/35">aka Linuxboss</p>
          </div>
          <nav aria-label="Footer">
            <p className="font-display font-bold">Navigate</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">{navLinks.map(l => <li key={l.href}><a href={l.href} className="hover:text-white">{l.label}</a></li>)}</ul>
          </nav>
          <div>
            <p className="font-display font-bold">Connect</p>
            <ul className="mt-3 space-y-2 text-sm text-white/60">
              <li><a href={site.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><Github size={15}/> GitHub</a></li>
              <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 hover:text-white"><Mail size={15}/> {site.email}</a></li>
              <li><span title="Coming soon" className="inline-flex cursor-not-allowed items-center gap-2 opacity-60"><Linkedin size={15}/> LinkedIn — coming soon</span></li>
              <li><a href={site.maps} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white"><MapPin size={15}/> Lagos</a></li>
            </ul>
          </div>
          <div>
            <p className="font-display font-bold">Flagship</p>
            <a href={site.wazobia} target="_blank" rel="noreferrer" className="glass card-lift mt-3 block rounded-2xl p-4">
              <p className="font-display font-extrabold tracking-wide">WAZOBIA</p>
              <p className="mt-1 text-sm text-white/55">The African Language Ecosystem — Nigeria-first.</p>
              <span className="mt-2 inline-block text-sm font-semibold text-violet-300">Visit live site →</span>
            </a>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-violet-300/10 pt-6 text-sm text-white/45">
          <p>© 2026 OBAFEMIX. All rights reserved.</p>
          <p className="font-hand text-xl text-violet-200/80">Dream · Code · Build · Innovate</p>
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <a href="#top" aria-label="Back to top" className="btn-primary-glow rounded-full p-3"><ArrowUp size={17} /></a>
        </div>
      </div>
    </footer>
  );
}
