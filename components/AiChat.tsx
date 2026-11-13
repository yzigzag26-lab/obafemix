"use client";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { Grip, RotateCcw, Send, User, X } from "lucide-react";
import { site } from "@/lib/site";
import { SKILLS } from "@/lib/skills";

/** Gemini-style four-point star (the Gemini AI mark) with its blue→purple gradient. */
export function GeminiStar({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" role="img" aria-label="Gemini AI star" className={className}>
      <defs>
        <linearGradient id="gemini-star-g" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1ba0e0" />
          <stop offset="0.45" stopColor="#5f7bf0" />
          <stop offset="0.75" stopColor="#9b5cf5" />
          <stop offset="1" stopColor="#d96570" />
        </linearGradient>
      </defs>
      <path d="M12 1.5c.9 5.8 4.7 9.6 10.5 10.5-5.8.9-9.6 4.7-10.5 10.5C11.1 16.7 7.3 12.9 1.5 12 7.3 11.1 11.1 7.3 12 1.5Z" fill="url(#gemini-star-g)" />
    </svg>
  );
}

type Msg = { from: "bot" | "user"; text: string };
type Pos = { x: number; y: number };

const clamp = (p: Pos, w: number, h: number): Pos => ({
  x: Math.min(Math.max(p.x, 8), Math.max(8, window.innerWidth - w - 8)),
  y: Math.min(Math.max(p.y, 8), Math.max(8, window.innerHeight - h - 8)),
});

const WELCOME: Msg = { from: "bot", text: "Hi! I'm the OBAFEMIX site assistant. Ask me about OBAFEMIX, WAZOBIA, his skills, projects — or how to get in touch." };
const QUICK = ["Tell me about WAZOBIA", "What are his top skills?", "How can I contact him?", "What does he build?"];

function answer(raw: string): string {
  const q = raw.toLowerCase();
  if (/(wazobia|language|yoruba|hausa|igbo)/.test(q))
    return "WAZOBIA is OBAFEMIX's flagship product — an African language technology ecosystem, Nigeria-first. It makes Yorùbá, Hausa and Igbo fully usable in everyday digital tools: translation, structured learning, pronunciation and cultural preservation, with English as a bridge. It's live at wazobia-omega.vercel.app — scroll to Projects and hit “Visit Live Website”.";
  if (/(skill|toolbox|tech|stack|percent|best|top)/.test(q)) {
    const top = [...SKILLS].sort((a, b) => b.percent - a.percent).slice(0, 5).map((s) => `${s.name} (${s.percent}%)`).join(", ");
    return `His strongest tools right now: ${top}. The full My Toolbox section lists ${SKILLS.length} skills with animated percentage bars across Programming, Frontend, Backend, API, AI, Data, Dev Tools and more — scroll to Skills to explore by category.`;
  }
  if (/(contact|email|reach|hire|touch|message)/.test(q))
    return `You can reach OBAFEMIX at ${site.email} — or use the contact form in the Contact section (it opens your mail app with the message pre-filled, no server in between). He's open to collaborations, interesting projects and exciting opportunities.`;
  if (/(project|build|work|portfolio)/.test(q))
    return "He builds complete web applications — frontends connected to APIs, plus the backend systems behind them — always turning ideas into working software, not prototypes. His featured project is WAZOBIA (React · TypeScript · Vercel). The Projects section shows every project in detail, and he can add more from /admin.";
  if (/(who|about|obafemix|linuxboss|developer)/.test(q))
    return "OBAFEMIX is a student & full-stack developer based in Lagos State, Nigeria. “Linuxboss” is what the tech streets call him — OBAFEMIX is the name on everything he ships. His headline: “I build solutions for a better tomorrow.”";
  if (/(where|location|lagos|nigeria)/.test(q))
    return "He's based in Lagos State, Nigeria (WAT timezone) — and available for remote collaboration anywhere. Use the Let's Connect button or the contact form to start a conversation.";
  if (/(hello|hi|hey|yo)\b/.test(q))
    return "Hello! Ask me about WAZOBIA, his skills and percentages, his projects, or how to contact him.";
  if (/(price|cost|rate|charge)/.test(q))
    return "Pricing depends on the project — the honest answer is to ask him directly. Email yzigzag26@gmail.com with what you're building and he'll take it from there.";
  return "I can answer questions about OBAFEMIX, WAZOBIA, his skills (with percentages), his projects, his location, and how to contact him. Try one of the quick prompts — or ask in your own words.";
}

/**
 * AI assistant — movable pop-up.
 * Circular launcher (Gemini star locked dead-center in the circle):
 * drag it anywhere; a click (not a drag) pops the chat window open.
 * The chat window itself is movable by its header. Positions clamp
 * to the viewport so the circle/star never get pushed off-screen.
 */
export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [btnPos, setBtnPos] = useState<Pos | null>(null);
  const [panelPos, setPanelPos] = useState<Pos | null>(null);
  const drag = useRef<{ mode: "btn" | "panel"; startX: number; startY: number; orig: Pos; moved: boolean; pos: Pos } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("obafemix.aiChatPos");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating saved launcher position from localStorage after mount (SSR-safe)
      if (raw) { const p = JSON.parse(raw); if (typeof p?.x === "number") setBtnPos(p); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (open) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const beginDrag = (mode: "btn" | "panel", e: ReactPointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const fallback: Pos = mode === "btn"
      ? { x: window.innerWidth - 80, y: window.innerHeight - 80 }
      : { x: window.innerWidth - 404, y: window.innerHeight - 560 };
    const orig = (mode === "btn" ? btnPos : panelPos) ?? fallback;
    if (mode === "btn" && !btnPos) setBtnPos(orig);
    if (mode === "panel" && !panelPos) setPanelPos(orig);
    drag.current = { mode, startX: e.clientX, startY: e.clientY, orig, moved: false, pos: orig };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const startBtnDrag = (e: ReactPointerEvent) => beginDrag("btn", e);
  const startPanelDrag = (e: ReactPointerEvent) => beginDrag("panel", e);

  const onDragMove = (e: ReactPointerEvent) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    if (!d.moved) return;
    const w = d.mode === "btn" ? 64 : 388, h = d.mode === "btn" ? 64 : 532;
    const next = clamp({ x: d.orig.x + dx, y: d.orig.y + dy }, w, h);
    d.pos = next;
    if (d.mode === "btn") setBtnPos(next); else setPanelPos(next);
  };

  const endDrag = () => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (d.mode !== "btn") return;
    if (d.moved) {
      try { localStorage.setItem("obafemix.aiChatPos", JSON.stringify(d.pos)); } catch { /* ignore */ }
    } else {
      if (!panelPos) setPanelPos(clamp({ x: window.innerWidth - 404, y: window.innerHeight - 560 }, 388, 532));
      setOpen(true);
    }
  };

  // Restart (↺): fresh conversation, cleared input, window back to its default corner.
  const restartChat = () => {
    setMsgs([WELCOME]);
    setInput("");
    setTyping(false);
    setBtnPos(null); setPanelPos(null);
    try { localStorage.removeItem("obafemix.aiChatPos"); } catch { /* ignore */ }
  };

  // Cancel (✕): close the chat. Also restores the launcher to its default
  // corner if the window was dragged, so it is always easy to find again.
  const closeChat = () => setOpen(false);

  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", text: answer(t) }]); setTyping(false); }, 650);
  };

  return (
    <>
      {/* ===== Movable circular launcher — Gemini star locked at the circle center ===== */}
      {!open && (
        <button
          type="button"
          aria-label="Open AI assistant — drag to move, click to chat"
          title="AI — drag me anywhere · Click to chat"
          onPointerDown={startBtnDrag}
          onPointerMove={onDragMove}
          onPointerUp={endDrag}
          className="btn-primary-glow fixed z-50 block h-16 w-16 cursor-grab touch-none rounded-full active:cursor-grabbing"
          style={btnPos ? { left: btnPos.x, top: btnPos.y } : { right: 16, bottom: 16 }}
        >
          {/* Centering layer: absolute inset-0 grid — the star is the only
              centered item, so it can never drift off the circle's center. */}
          <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="flex flex-col items-center justify-center gap-0.5">
              <GeminiStar size={20} className="block shrink-0 drop-shadow-[0_0_10px_rgba(155,92,245,0.65)]" />
              <span className="font-display block text-[13px] font-extrabold leading-none tracking-[0.18em] text-white">AI</span>
            </span>
          </span>
          <span aria-hidden className="absolute right-0.5 top-0.5 h-3 w-3 rounded-full border-2 border-[#0d0724] bg-emerald-400" />
          <span className="sr-only">AI assistant</span>
        </button>
      )}

      {/* ===== Movable chat window ===== */}
      {open && (
        <section
          aria-label="AI assistant chat"
          className="glass fixed z-50 flex h-[min(532px,calc(100dvh-24px))] w-[min(388px,calc(100vw-24px))] flex-col overflow-hidden rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,.55)]"
          style={panelPos ? { left: panelPos.x, top: panelPos.y } : { right: 12, bottom: 12 }}
        >
          <header
            onPointerDown={startPanelDrag}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            className="flex cursor-grab touch-none items-center gap-3 border-b border-violet-300/15 bg-violet-600/20 px-4 py-3 active:cursor-grabbing"
          >
            <span className="relative block h-11 w-11 shrink-0 rounded-full border border-violet-300/25 bg-[#0d0724]">
              <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
                <GeminiStar size={22} className="block shrink-0" />
              </span>
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-sm font-bold">OBAFEMIX Assistant</span>
              <span className="block text-[11px] text-emerald-300">● Online — answers from this site</span>
            </span>
            <Grip className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={restartChat} aria-label="Restart chat" title="Restart chat" className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"><RotateCcw className="h-4 w-4" /></button>
            <button type="button" onPointerDown={(e) => e.stopPropagation()} onPointerUp={(e) => e.stopPropagation()} onClick={closeChat} aria-label="Close chat" title="Close chat" className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <span aria-hidden className={`relative block h-7 w-7 shrink-0 rounded-full ${m.from === "bot" ? "border border-violet-300/20 bg-[#0d0724]" : "bg-white/10 text-white/70"}`}>
                  {m.from === "bot"
                    ? <span className="pointer-events-none absolute inset-0 grid place-items-center"><GeminiStar size={14} className="block shrink-0" /></span>
                    : <span className="absolute inset-0 grid place-items-center"><User className="h-3.5 w-3.5" /></span>}
                </span>
                <p className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "bot" ? "rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 text-white/85" : "btn-primary-glow rounded-br-md text-white"}`}>{m.text}</p>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <span aria-hidden className="relative block h-7 w-7 rounded-full border border-violet-300/20 bg-[#0d0724]">
                  <span className="pointer-events-none absolute inset-0 grid place-items-center"><GeminiStar size={14} className="block shrink-0" /></span>
                </span>
                <p className="rounded-2xl rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 px-4 py-3" aria-label="Assistant is typing">
                  <span className="flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300" style={{ animationDelay: `${d * 150}ms` }} />)}</span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => send(q)} className="chip shrink-0 text-xs transition hover:border-violet-300/60 hover:bg-violet-500/20">{q}</button>
            ))}
          </div>

          <form className="flex gap-2 border-t border-violet-300/15 p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
            <label htmlFor="ai-input" className="sr-only">Ask the assistant</label>
            <input id="ai-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about OBAFEMIX…" className="input-dark !rounded-full" autoComplete="off" />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send message" className="btn-primary-glow flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full disabled:opacity-40"><Send className="h-[18px] w-[18px]" /></button>
          </form>
          <p className="px-4 pb-3 text-center text-[10px] leading-relaxed text-white/40">On-device assistant — answers from this site&apos;s content, nothing is sent to a server. Drag the header to move me.</p>
        </section>
      )}
    </>
  );
}
