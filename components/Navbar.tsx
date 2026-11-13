"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import Logo from "./Logo";
import { navLinks, site } from "@/lib/site";

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let last = window.scrollY; let ticking = false;
    const onScroll = () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24); setHidden(y > last && y > 300); last = y; ticking = false;
        for (const id of ["contact","skills","projects","about","top"]) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 140) { setActive(id); break; }
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${hidden && !open ? "-translate-y-full" : ""}`}>
      <div className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 ${scrolled ? "glass mt-2 rounded-2xl mx-3 sm:mx-6 lg:mx-auto" : ""}`}>
        <Link href="#top" className="flex items-center gap-2.5" aria-label="OBAFEMIX home">
          <Logo size={40} />
          <span className="font-display text-lg font-extrabold tracking-tight max-[380px]:hidden">OBAFEMIX</span>
          <Image src="/assets/obafemix-avatar.webp" width={40} height={40} priority alt="OBAFEMIX" className="h-9 w-9 rounded-full object-cover object-[50%_15%] ring-1 ring-violet-400/60" />
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map(l => (
            <a key={l.href} href={l.href} className={`rounded-full px-4 py-2 text-sm transition ${active === l.href.slice(1) ? "bg-violet-500/20 text-white" : "text-white/65 hover:text-white"}`}>{l.label}</a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href={site.github} target="_blank" rel="noreferrer" className="btn-primary-glow shimmer-sweep hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold sm:inline-flex"><Github size={16} /> Let&apos;s Connect</a>
          <button className="rounded-lg border border-violet-300/20 p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && (
        <nav className="glass mx-3 rounded-2xl p-4 md:hidden" aria-label="Mobile">
          {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-white/80 hover:bg-violet-500/15">{l.label}</a>)}
          <a href={site.github} target="_blank" rel="noreferrer" className="btn-primary-glow mt-2 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold"><Github size={16}/> Let&apos;s Connect</a>
        </nav>
      )}
    </header>
  );
}
