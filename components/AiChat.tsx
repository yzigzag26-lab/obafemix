"use client";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Bot, Grip, RotateCcw, Send, Sparkles, User, X } from "lucide-react";
import { site } from "@/lib/site";
import { SKILLS } from "@/lib/skills";

type Msg = { from: "bot" | "user"; text: string };
type Pos = { x: number; y: number };

const WELCOME: Msg = { from: "bot", text: "Hi! I'm the OBAFEMIX site assistant. Ask me about OBAFEMIX, WAZOBIA, his skills, projects — or how to get in touch. You can drag me anywhere on the page." };
const QUICK = ["Tell me about WAZOBIA", "What are his top skills?", "How can I contact him?", "What does he build?"];

function answer(raw: string): string {
  const q = raw.toLowerCase();
  if (/(wazobia|language|yoruba|hausa|igbo)/.test(q))
    return "WAZOBIA is OBAFEMIX's flagship product — an African language technology ecosystem, Nigeria-first. It makes Yorùbá, Hausa and Igbo fully usable in everyday digital tools: translation, structured learning, pronunciation and cultural preservation, with English as a bridge. It's live at wazobia-omega.vercel.app — scroll to Projects and hit “Visit Live Website”.";
  if (/(skill|toolbox|tech|stack|percent|best|top)/.test(q)) {
    const top = [...SKILLS].sort((a, b) => b.percent - a.percent).slice(0, 5).map((s) => `${s.name} (${s.percent}%)`).join(", ");
    return `His strongest tools right now: ${top}. The full My Toolbox section lists ${SKILLS.length} skills with animated percentage bars across ${"Programming, Frontend, Backend, API, AI, Data, Dev Tools and more"} — scroll to Skills to explore by category.`;
  }
  if (/(contact|email|reach|hire|touch|message)/.test(q))
    return `You can reach OBAFEMIX at ${site.email} — or use the contact form in the Contact section (it opens your mail app with the message pre-filled, no server in between). He's open to collaborations, interesting projects and exciting opportunities.`;
  if (/(project|build|work|portfolio)/.test(q))
    return "He builds complete web applications — frontends connected to APIs, plus the backend systems behind them — always turning ideas into working software, not prototypes. His featured project is WAZOBIA (React · TypeScript · Vercel). The Projects section shows every project in detail, and he can add more from /admin.";
  if (/(who|about|obafemix|linuxboss|developer)/.test(q))
    return "OBAFEMIX is a student & full-stack developer based in Lagos State, Nigeria, and Founder & Primary Developer of WAZOBIA. “Linuxboss” is what the tech streets call him — OBAFEMIX is the name on everything he ships. His headline: “I build solutions for a better tomorrow.”";
  if (/(where|location|lagos|nigeria)/.test(q))
    return "He's based in Lagos State, Nigeria (WAT timezone) — and available for remote collaboration anywhere. Use the Let's Connect button or the contact form to start a conversation.";
  if (/(hello|hi|hey|yo)\b/.test(q))
    return "Hello! Ask me about WAZOBIA, his skills and percentages, his projects, or how to contact him.";
  if (/(price|cost|rate|charge)/.test(q))
    return "Pricing depends on the project — the honest answer is to ask him directly. Email yzigzag26@gmail.com with what you're building and he'll take it from there.";
  return "I can answer questions about OBAFEMIX, WAZOBIA, his skills (with percentages), his projects, his location, and how to contact him. Try one of the quick prompts below — or ask in your own words.";
}

const clamp = (p: Pos, w: number, h: number): Pos => ({
  x: Math.min(Math.max(p.x, 8), Math.max(8, window.innerWidth - w - 8)),
  y: Math.min(Math.max(p.y, 8), Math.max(8, window.innerHeight - h - 8)),
});

export default function AiChat() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  // Default: bottom-right launcher; null = CSS default position.
  const [btnPos, setBtnPos] = useState<Pos | null>(null);
  const [panelPos, setPanelPos] = useState<Pos | null>(null);
  const drag = useRef<{ mode: "btn" | "panel"; startX: number; startY: number; orig: Pos; moved: boolean; pos: Pos } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("obafemix.aiChatPos");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from this browser's localStorage after mount (SSR-safe)
      if (raw) { const p = JSON.parse(raw); if (typeof p?.x === "number") setBtnPos(p); }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  const beginDrag = (mode: "btn" | "panel", e: ReactPointerEvent) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const fallback: Pos = mode === "btn"
      ? { x: window.innerWidth - 76, y: window.innerHeight - 76 }
      : { x: window.innerWidth - 404, y: window.innerHeight - 560 };
    const orig = (mode === "btn" ? btnPos : panelPos) ?? fallback;
    if (mode === "btn" && !btnPos) setBtnPos(orig);
    if (mode === "panel" && !panelPos) setPanelPos(orig);
    drag.current = { mode, startX: e.clientX, startY: e.clientY, orig, moved: false, pos: orig };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const startBtnDrag = (e: ReactPointerEvent) => beginDrag("btn", e);
  const startPanelDrag = (e: ReactPointerEvent) => beginDrag("panel", e);

  const onDragMove = (e: ReactPointerEvent) => {
    const d = drag.current; if (!d) return;
    const dx = e.clientX - d.startX, dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 6) d.moved = true;
    if (!d.moved) return;
    const w = d.mode === "btn" ? 60 : 388, h = d.mode === "btn" ? 60 : 532;
    const next = clamp({ x: d.orig.x + dx, y: d.orig.y + dy }, w, h);
    d.pos = next;
    if (d.mode === "btn") setBtnPos(next); else setPanelPos(next);
  };

  const endDrag = () => {
    const d = drag.current; drag.current = null;
    if (!d) return;
    if (d.mode === "btn") {
      if (d.moved) {
        try { localStorage.setItem("obafemix.aiChatPos", JSON.stringify(d.pos)); } catch { /* ignore */ }
      } else {
        // It was a click, not a drag.
        if (!panelPos) setPanelPos(clamp({ x: window.innerWidth - 404, y: window.innerHeight - 560 }, 388, 532));
        setOpen(true);
      }
    }
  };

  const resetPos = () => {
    setBtnPos(null); setPanelPos(null);
    try { localStorage.removeItem("obafemix.aiChatPos"); } catch { /* ignore */ }
  };

  const send = (text: string) => {
    const t = text.trim(); if (!t || typing) return;
    setMsgs((m) => [...m, { from: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => { setMsgs((m) => [...m, { from: "bot", text: answer(t) }]); setTyping(false); }, 650);
  };

  return (
    <>
      {/* ===== Movable launcher ===== */}
      {!open && (
        <button
          type="button"
          aria-label="Open AI assistant — drag to move, click to chat"
          title="Drag me anywhere · Click to chat"
          onPointerDown={startBtnDrag}
          onPointerMove={onDragMove}
          onPointerUp={endDrag}
          className="btn-primary-glow group fixed z-50 flex h-[60px] w-[60px] cursor-grab touch-none items-center justify-center rounded-full active:cursor-grabbing"
          style={btnPos ? { left: btnPos.x, top: btnPos.y } : { right: 16, bottom: 16 }}
        >
          <span aria-hidden className="pulse-dot absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <Bot className="h-7 w-7 transition-transform group-hover:scale-110" />
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
          {/* Header = drag handle */}
          <header
            onPointerDown={startPanelDrag}
            onPointerMove={onDragMove}
            onPointerUp={endDrag}
            className="flex cursor-grab touch-none items-center gap-3 border-b border-violet-300/15 bg-violet-600/20 px-4 py-3 active:cursor-grabbing"
          >
            <span className="btn-primary-glow flex h-10 w-10 shrink-0 items-center justify-center rounded-full"><Bot className="h-5 w-5" /></span>
            <span className="min-w-0 flex-1">
              <span className="font-display block truncate text-sm font-bold">OBAFEMIX Assistant</span>
              <span className="block text-[11px] text-emerald-300">● Online — answers from this site</span>
            </span>
            <Grip className="h-4 w-4 shrink-0 text-white/40" aria-hidden />
            <button type="button" onClick={resetPos} aria-label="Reset position" title="Reset position" className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"><RotateCcw className="h-4 w-4" /></button>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </header>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex items-end gap-2 ${m.from === "user" ? "flex-row-reverse" : ""}`}>
                <span aria-hidden className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.from === "bot" ? "bg-violet-500/25 text-violet-200" : "bg-white/10 text-white/70"}`}>
                  {m.from === "bot" ? <Sparkles className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                </span>
                <p className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === "bot" ? "rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 text-white/85" : "btn-primary-glow rounded-br-md text-white"}`}>{m.text}</p>
              </div>
            ))}
            {typing && (
              <div className="flex items-end gap-2">
                <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/25 text-violet-200"><Sparkles className="h-3.5 w-3.5" /></span>
                <p className="rounded-2xl rounded-bl-md border border-violet-300/15 bg-[#0d0724]/90 px-4 py-3" aria-label="Assistant is typing">
                  <span className="flex gap-1">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-violet-300" style={{ animationDelay: `${d * 150}ms` }} />)}</span>
                </p>
              </div>
            )}
          </div>

          {/* Quick prompts */}
          <div className="flex gap-2 overflow-x-auto px-4 pb-2">
            {QUICK.map((q) => (
              <button key={q} type="button" onClick={() => send(q)} className="chip shrink-0 text-xs transition hover:border-violet-300/60 hover:bg-violet-500/20">{q}</button>
            ))}
          </div>

          {/* Input */}
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
