"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Github, Linkedin, MapPin, ArrowRight, Mail } from "lucide-react";
import { site } from "@/lib/site";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reading matchMedia once on mount (SSR-safe)
    setReduced(mq.matches);
    const fn = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return reduced;
}
function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
    const tick = () => setTime(fmt.format(new Date()));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);
  return time;
}
function useTyped(reduced: boolean) {
  const [text, setText] = useState(site.roles[0]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reduced-motion pins the first role
    if (reduced) { setText(site.roles[0]); return; }
    let role = 0, char = site.roles[0].length, deleting = true, timer: ReturnType<typeof setTimeout>;
    const step = () => {
      if (deleting) { char--; if (char === 0) { deleting = false; role = (role + 1) % site.roles.length; } }
      else { char++; if (char === site.roles[role].length) deleting = true; }
      setText(site.roles[role].slice(0, Math.max(char, 0)));
      timer = setTimeout(step, deleting && char === site.roles[role].length ? 1600 : deleting ? 38 : 72);
    };
    timer = setTimeout(step, 1600);
    return () => clearTimeout(timer);
  }, [reduced]);
  return text;
}

export default function Hero() {
  const reduced = usePrefersReducedMotion();
  const time = useClock();
  const role = useTyped(reduced);
  // First-load fix: the 1.3 MB video must never compete with first paint.
  // The 31 KB poster (priority image below) IS the first paint; the video
  // only starts downloading once the page has loaded / the browser is idle,
  // then fades in over the poster when it can actually play.
  const [loadVideo, setLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoWrapRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- screen-size pick once on mount
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);
  // If autoplay was blocked, the first tap/scroll anywhere starts it.
  useEffect(() => {
    if (!loadVideo || videoReady) return;
    const kick = () => videoWrapRef.current?.querySelector("video")?.play().catch(() => {});
    window.addEventListener("touchstart", kick, { passive: true, once: true });
    window.addEventListener("pointerdown", kick, { once: true });
    return () => { window.removeEventListener("touchstart", kick); window.removeEventListener("pointerdown", kick); };
  }, [loadVideo, videoReady]);
  useEffect(() => {
    if (reduced) return;
    let idle: number | undefined;
    const begin = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) idle = ric(() => setLoadVideo(true), { timeout: 600 });
      else idle = window.setTimeout(() => setLoadVideo(true), 400);
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });
    return () => {
      window.removeEventListener("load", begin);
      if (idle) window.clearTimeout(idle);
    };
  }, [reduced]);
  return (
    <section id="top" ref={videoWrapRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Poster = LCP: 31 KB, preloaded via priority, paints immediately on every device */}
      <Image src="/assets/hero-poster.webp" alt="" fill priority fetchPriority="high" sizes="100vw" className="pointer-events-none object-cover object-[50%_30%]" aria-hidden />
      {!reduced && loadVideo && (
        <video
          ref={(el) => {
            // Safari/iOS fix: React's `muted` attr alone is not enough, and a
            // dynamically-inserted <video autoPlay> often never starts on
            // phones. Set the muted *property* and call play() explicitly.
            if (el) { el.muted = true; el.defaultMuted = true; el.play().catch(() => {}); }
          }}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
          className={`pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_30%] transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
          autoPlay muted loop playsInline preload="auto" poster="/assets/hero-poster.webp" aria-hidden="true"
        >
          <source src={isMobile ? "/assets/hero-mobile.mp4" : "/assets/hero.mp4"} type="video/mp4" />
        </video>
      )}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#05010f] via-[#05010f]/62 to-transparent" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#05010f] via-transparent to-[#05010f]/40" />
      <div aria-hidden="true" className="noise-overlay absolute inset-0" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-28 pt-36 sm:px-6">
        <p className="eyebrow">{"// HELLO, I'M"}</p>
        <h1 className="font-display mt-4 font-extrabold tracking-tight text-white" style={{ fontSize: "clamp(2.75rem,13vw,7.2rem)", lineHeight: 0.95, textShadow: "0 0 60px rgba(139,92,246,.55)" }}>OBAFEMIX</h1>
        <p className="mt-5 font-mono text-lg text-violet-200 sm:text-xl">&gt; {role}<span className="animate-blink">|</span></p>
        <h2 className="font-display mt-6 max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">I build solutions for a <span className="text-gradient">better tomorrow.</span></h2>
        <p className="mt-4 max-w-xl leading-relaxed text-white/70">{site.description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#projects" className="btn-primary-glow shimmer-sweep inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold">View My Work <ArrowRight size={17} /></a>
          <a href="#contact" className="inline-flex items-center gap-2 rounded-full border border-violet-300/35 px-6 py-3 font-semibold text-white/85 transition hover:bg-violet-500/15"><Mail size={17}/> Get in Touch</a>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="glass rounded-full p-3 transition hover:shadow-[0_0_24px_rgba(139,92,246,.7)]"><Github size={19} /></a>
          <span title="Coming soon" className="glass cursor-not-allowed rounded-full p-3 opacity-50" aria-disabled="true"><Linkedin size={19} /></span>
          <span className="flex items-center gap-2 text-sm text-white/70"><span className="pulse-dot h-2.5 w-2.5 rounded-full bg-emerald-400" /> Open to opportunities</span>
          <span className="text-xs text-white/40">LinkedIn — Coming soon <span className="chip !py-0.5 text-[10px]">SOON</span></span>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-white/60"><MapPin size={16} className="text-violet-300" /> Lagos State, Nigeria · WAT <span suppressHydrationWarning className="font-mono">{time}</span></p>
      </div>
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[.3em] text-white/50">SCROLL TO EXPLORE</span>
        <span className="flex h-9 w-6 justify-center rounded-full border border-violet-300/30 pt-2"><span className="scroll-dot h-2 w-1 rounded bg-violet-300" /></span>
      </div>
      <aside className="glass float-slow absolute bottom-24 right-6 z-10 hidden max-w-xs rounded-2xl p-5 lg:block">
        <p className="font-mono text-[10px] tracking-[.3em] text-violet-300/80">CURRENTLY</p>
        <p className="font-display mt-2 font-bold">Founder &amp; Primary Developer of WAZOBIA</p>
        <p className="mt-1 text-sm text-white/60">The African Language Ecosystem — Nigeria-first.</p>
      </aside>
    </section>
  );
}
